import {
  GraphQLObjectType,
  GraphQLString,
} from 'graphql'

import { writeDB } from '../../db/writedb'
import { readDB } from '../../db/readdb'
import { newMessageEvent } from '../subscriptions/NewMessageSub'
import { publishPubSub } from '../../pubsub'

const typeDec = new GraphQLObjectType({
  name: 'AddMessage',
  fields: {
    message: { type: GraphQLString },
  },
})

const argsDec = {
  message: { type: GraphQLString },
}

const resolveDec = (parentValue, args) => {
  const db = readDB({ collection: 'messages' })
  const newMessage = { message: args.message }
  db.push(newMessage)
  writeDB({ collection: 'messages', data: db })
  try {
    newMessageEvent.emit('newMessage', newMessage)
    const subscribers = publishPubSub('newMessage')
  } catch (err) {
    console.log('got subscribers error:', err);
  }
  return { message: args.message }
}

export default {
  type: typeDec,
  args: argsDec,
  resolve: resolveDec,
}
