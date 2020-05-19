import {
  GraphQLObjectType,
  GraphQLString,
} from 'graphql'

import { writeDB } from '../../db/writedb'
import { readDB } from '../../db/readdb'
import { newMessageEvent } from '../subscriptions/NewMessageSub'
import { publishPubSub } from '../../pubsub'

const type = new GraphQLObjectType({
  name: 'AddMessage',
  fields: {
    message: { type: GraphQLString },
  },
})

const args = {
  message: { type: GraphQLString },
}

const resolve = (parentValue, args, context) => {  
  const db = context.dbClient.readCollection('messages')  
  const newMessage = { message: args.message }
  db.push(newMessage)
  context.dbClient.writeCollection('messages', db)
  try {
    newMessageEvent.emit('newMessage', newMessage)
    const subscribers = publishPubSub('newMessage')
  } catch (err) {
    console.error('got subscribers error:', err);
  }
  return { message: args.message }
}

export default {
  type,
  args,
  resolve,
}
