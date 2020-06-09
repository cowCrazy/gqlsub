import { execute, subscribe } from 'graphql'
import { parse } from 'graphql/language'
import { validate } from 'graphql/validation'
import ws from 'ws'

import { pubsubClient, dbClient } from './clients'
import { createAsyncIterable } from './asyncIterator'

export const createSubscriptionServer = (server, RootSchema) => {
  const wsServer = new ws.Server({
    server,
    path: '/subscriptions',
    // TODO: use it to authenticate users accessing the websocket
    // verifyClient: (info, done) => {
    //   console.log('verify info:', info)
    //   done(false)
    // },
  
  })
  
  const wsOnMessage = (message, connection, connectionId) => {
    console.info('connection message:', message)
    const { query, type, collection, subName, close } = JSON.parse(message)
  
    console.log('incoming message:', { query, type, collection, subName, close });
  
    if (close) {    
      const processToEnd = pubsubClient.drop(subName, connectionId)
      processToEnd.asyncIteratorToClose.forEach((removeRequest) => {
        removeRequest.payload.return()
      })
      processToEnd.watchesToRemove.forEach((removeRequest) => {
        dbClient.unwatchCollection({
          collectionName: removeRequest.collection,
          subName: removeRequest.subName,
          connectionId
        })
      })
      
    } else {
      let document
      try {
        document = parse(query)
      } catch (error) {
        console.error('pars res:', JSON.stringify(error));
        connection.send(JSON.stringify({ errors: [{ error }] }))
        return
      }
    
      const valRes = validate(RootSchema, document)
      if (valRes.length > 0) {
        console.error('val res:', JSON.stringify(valRes));
        connection.send(JSON.stringify({ errors: [{ error: valRes[0].message }] }))
        return
      } else {
        const operation = document.definitions[0].operation
    
        if (operation === 'subscription') {
          const pubsubConfigs = {} 
          Promise.resolve(
            subscribe({
              schema: RootSchema,
              document,
              rootValue: {},
              contextValue: {
                connectionId,
                connection,
                assignConfigs: (
                  collectionName,
                  DBEventType,
                  systemEvent,
                  subName
                ) => {
                  pubsubConfigs.collectionName = collectionName
                  pubsubConfigs.DBEventType = DBEventType
                  pubsubConfigs.systemEvent = systemEvent
                  pubsubConfigs.subName = subName
                },
                dbClient,
                pubsubClient,
              }
            })
          )
            .then((gqlRes) => {            
              dbClient.watchCollection(
                pubsubConfigs.collectionName,
                {
                  [pubsubConfigs.DBEventType]: {
                    subName: pubsubConfigs.subName,
                    connectionId,
                    func: (payload) => pubsubConfigs.systemEvent.emit(pubsubConfigs.subName, payload),
                    publish: () => pubsubClient.publish(pubsubConfigs.subName)
                  }
                },
              )
  
              pubsubClient.subscribe(
                pubsubConfigs.subName,
                gqlRes,
                connection,
                collection,
                connectionId
              )
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
  }
  
  const setupConnection = (connection, connectionId) => {
    connection.send(JSON.stringify({ collection: 'user', data: { connectionId } }))
  
    connection.on('message', (message) => wsOnMessage(message, connection, connectionId))
    connection.on('close', (message) => {
      console.log('connection closing:', connectionId);
      const processToEnd = pubsubClient.drop(null, connectionId)
      processToEnd.asyncIteratorToClose.forEach((removeRequest) => {
        removeRequest.payload.return()
      })
      processToEnd.watchesToRemove.forEach((removeRequest) => {
        dbClient.unwatchCollection({
          collectionName: removeRequest.collection,
          subName: removeRequest.subName,
          connectionId
        })
      })
    })
    connection.on('error', (message) => {
      console.log('connection error');
    })
  }
  
  let connectionId = 0
  const wsOnConnection = (connection, req) => {
    const url = req.url
    connectionId += 1
    setupConnection(connection, connectionId)
  }
  
  wsServer.on('connection', wsOnConnection)
}
