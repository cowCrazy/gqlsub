import './superLog'

import { createServer } from 'http'
import path from 'path'
import { execute } from 'graphql'
import { parse } from 'graphql/language'
import express from 'express'
import bodyParser from 'body-parser'

import cors from 'cors'

import { RootSchema } from './graphql/Root'
import { dbClient } from './clients'
import { createSubscriptionServer } from './subscription-server'

const PORT = process.argv[2] || 3000

const app = express()

const server = createServer(app)

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
  response.send('pong')
})

app.post('/login', (request, response) => {  
  const { username, password } = request.body
  const users = dbClient.readCollection('users')
  const loginUserIndex = users.findIndex(user => user.username === username && user.password == password)
  if (loginUserIndex) {
    users[loginUserIndex].status = 'online'
    dbClient.writeCollection('users', users)
    response.send('auth success')
  } else {
    response.send('auth fail')
  }
})

app.post('/register', (request, response) => {  
  const { username, password } = request.body
  const users = dbClient.readCollection('users')
  const regUser = users.find(user => user.username === username)
  if (regUser) {
    response.send('user already exist')
  } else {
    const lastUser = users[users.length - 1]
    const lastUserId = lastUser ? lastUser.id : 0
    const newUser = { id: `${Number(lastUserId) + 1}`, username, password }
    users.push(newUser)
    dbClient.writeCollection('users', users)
    response.send('successfully registered')
  }
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

createSubscriptionServer(server, RootSchema)

server.listen(PORT, () => {
  console.success(`GraphQL Server is now running on http://localhost:${PORT}/graphql`);
  console.success(`Subscriptions are running on ws://localhost:${PORT}/subscriptions`);
})
