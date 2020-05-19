import './superLog'

import { createServer } from 'http'
import path from 'path'

import express from 'express'
import bodyParser from 'body-parser'
import { execute, subscribe } from 'graphql'
import { parse } from 'graphql/language'
import { validate } from 'graphql/validation'
import ws from 'ws'

import { RootSchema } from './graphql/Root'
import { subscribePubSub, publishPubSub } from './pubsub'
import { writeFileSync } from 'fs'
import { inspect } from 'util'
import { JsonDBClient } from './db/JsonDBClient'

const dbClient = new JsonDBClient()

const PORT = process.argv[2] || 3000

const app = express()

const server = createServer(app)

const wsServer = new ws.Server({
  server,
  path: '/subscriptions'
})

app.use(bodyParser.json())
app.use(express.static(path.join(__dirname, 'frontend/build')))
app.get('/', (request, response) => {
  response.sendFile(path.resolve(__dirname, './frontend/build/index.html'))
})
app.get('/chat', (request, response) => {
  response.sendFile(path.resolve(__dirname, './frontend/build/chat.html'))
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

const wsOnMessage = (message, connection) => {
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
          }
        })
      )
        .then((gqlRes) => {
          dbClient.watchCollection(
            dbWatchNames.collectionName,
            {
              [dbWatchNames.eventType]: () => publishPubSub(subName)
            },
          )
          subscribePubSub(subName, gqlRes, connection, collection)
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

const wsOnConnection = (connection, req) => {
  const url = req.url

  connection.on('message', (message) => wsOnMessage(message, connection))

}

wsServer.on('connection', wsOnConnection)

server.listen(PORT, () => {
  console.success(`GraphQL Server is now running on http://localhost:${PORT}/graphql`);
  console.success(`Subscriptions are running on ws://localhost:${PORT}/subscriptions`);
})
