import { createServer } from 'http'
import path from 'path'

import express from 'express'
import bodyParser from 'body-parser'
import { execute, subscribe } from 'graphql'
import { parse } from 'graphql/language'
import ws from 'ws'

import { RootSchema } from './graphql/Root'
import { newMessageEvent } from './graphql/subscriptions/NewMessageSub'

const PORT = 3000

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

app.use('/graphql', (req, res) => {  
  const { body = {} } = req

  const document = parse(body.query)

  console.log({ document });

  Promise.resolve(
    execute({
      schema: RootSchema,
      document,
      rootValue: {},
      contextValue: {
        subscribers: wsServer.clients
      }
    })
  )  
    .then(gqlRes => {
      res.send(gqlRes)
    })
    .catch(gqlErr => {
      console.log('gqlErr:', gqlErr)
      res.send(gqlErr)
    })
})

const wsOnMessage = (message, connection) => {
  console.log('connection message:', message)
  const body = JSON.parse(message)
  const document = parse(body.query)

  console.log({ document });

  Promise.resolve(
    subscribe({
      schema: RootSchema,
      document,
      rootValue: {},
      contextValue: {
        subscribers: wsServer.clients
      }
    })
  )
    .then(gqlRes => {
      console.log('gqlRes:', gqlRes)
        newMessageEvent.addListener('newUser', () => {
          Promise.resolve(gqlRes.next())
          .then((subRes) => {
            console.log('subRes:', subRes);
            connection.send(JSON.stringify(subRes.value))
          })
          .catch((subResErr) => {
            console.log('resolver ended with error:', subResErr);
          })
        })
    })
    .catch(gqlErr => {
      console.log('gqlErr:', gqlErr)
      // res.send(gqlErr)
    })
}

const wsOnConnection = (connection, req) => {
  const url = req.url
  wsServer.clients.add(connection)
  connection.on('message', (message) => wsOnMessage(message, connection))
}

wsServer.on('connection', wsOnConnection)

server.listen(PORT, () => {
  console.log(`GraphQL Server is now running on http://localhost:${PORT}/graphql`);
  console.log(`Subscriptions are running on ws://localhost:${PORT}/subscriptions`);
})
