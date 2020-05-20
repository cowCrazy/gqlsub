import './superLog'

import { createServer } from 'http'
import path from 'path'

import express from 'express'
import bodyParser from 'body-parser'
import { execute, subscribe } from 'graphql'
import { parse } from 'graphql/language'
import { validate } from 'graphql/validation'
import cors from 'cors'
import ws from 'ws'

import { RootSchema } from './graphql/Root'
import { PubSub } from './pubsub'
import { writeFileSync } from 'fs'
import { inspect } from 'util'
import { JsonDBClient } from './db/JsonDBClient'

const dbClient = new JsonDBClient()
const pubsubClient = new PubSub()

const PORT = process.argv[2] || 3000

const app = express()

const server = createServer(app)

const wsServer = new ws.Server({
  server,
  path: '/subscriptions'
})

const corsOptions = {
  origin: 'http://localhost:3000',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

app.use(cors(corsOptions))
app.use(bodyParser.json())
app.use(express.static(path.join(__dirname, 'frontend/build')))
app.get('/', (request, response) => {
  response.sendFile(path.resolve(__dirname, './frontend/build/index.html'))
})
app.get('/chat', (request, response) => {
  response.sendFile(path.resolve(__dirname, './frontend/build/chat.html'))
})
app.get('/ping', (request, response) => {  
  response.send(JSON.stringify({ message: 'welcome'}))
})

app.use('/graphql', (req, res) => {  
  const { body = {} } = req
  const document = parse(body.query)
  Promise.resolve(
    execute({
      schema: RootSchema,
      document,
      rootValue: {},
      contextValue: {
        dbClient,
      }
    })
  )  
    .then(gqlRes => {
      res.send(gqlRes)
    })
    .catch(gqlErr => {
      console.error('gqlErr:', gqlErr)
      res.send(gqlErr)
    })
})

const wsOnMessage = (message, connection, connectionId) => {
  console.info('connection message:', message)
  const { query, type, collection } = JSON.parse(message)
  
  const document = parse(query)

  const valRes = validate(RootSchema, document)
  if (valRes.length > 0) {
    console.error('val res:', JSON.stringify(valRes));
    connection.send(JSON.stringify({ errors: [{ error: valRes[0].message }] }))
  } else {
    const operation = document.definitions[0].operation

    if (operation === 'subscription') {
      let subName
      const dbWatchNames = {} 
      Promise.resolve(
        subscribe({
          schema: RootSchema,
          document,
          rootValue: {},
          contextValue: {
            connection,
            nameSub: (eventName) => {
              subName = eventName
            },
            nameDBWatch: (collectionName, eventType) => {
              dbWatchNames.collectionName = collectionName
              dbWatchNames.eventType = eventType
            },
            dbClient,
            pubsubClient,
          }
        })
      )
        .then((gqlRes) => {
          dbClient.watchCollection(
            dbWatchNames.collectionName,
            {
              [dbWatchNames.eventType]: () => pubsubClient.publish(subName)
            },
          )
          pubsubClient.subscribe(subName, gqlRes, connection, collection, connectionId)
        })
        .catch(gqlErr => {
          console.error('gqlErr:', gqlErr)
        })
    } else {
      Promise.resolve(
        execute({
          schema: RootSchema,
          document,
          rootValue: {},
          contextValue: {
            dbClient,
            pubsubClient,
          }
        })
      )  
        .then(gqlRes => {
          connection.send(JSON.stringify({ ...gqlRes, collection, type }))
        })
        .catch(gqlErr => {
          console.error('gqlErr:', gqlErr)
          connection.send(JSON.stringify(gqlErr))
        })
    }
  }
}

let connectionId = 1
const wsOnConnection = (connection, req) => {
  const url = req.url

  connection.on('message', (message) => wsOnMessage(message, connection, connectionId))
  connection.on('close', (message) => {
    console.log('connection closed');
    pubsubClient.drop(connectionId)
  })
  connection.on('error', (message) => {
    console.log('connection error');
  })

  connectionId += 1
}

wsServer.on('connection', wsOnConnection)


server.listen(PORT, () => {
  console.success(`GraphQL Server is now running on http://localhost:${PORT}/graphql`);
  console.success(`Subscriptions are running on ws://localhost:${PORT}/subscriptions`);
})
