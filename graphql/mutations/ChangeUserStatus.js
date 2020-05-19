import {
  GraphQLObjectType,
  GraphQLString,
} from 'graphql'

import { writeDB } from '../../db/writedb'
import { readDB } from '../../db/readdb'
import { usersStatusEvent } from '../subscriptions/NewMessageSub'
import { publishPubSub } from '../../pubsub'

const typeDec = new GraphQLObjectType({
  name: 'ChangeUserStatus',
  fields: {
    error: { type: GraphQLString },
    message: { type: GraphQLString },
  },
})

const argsDec = {
  username: { type: GraphQLString },
  status: { type: GraphQLString },
}

const resolveDec = (parentValue, args) => {
  const db = readDB({ collection: 'users' })
  const { username, status } = args
  
  writeDB({ collection: 'users', data: db })
  try {
    usersStatusEvent.emit('newMessage', newMessage)
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
