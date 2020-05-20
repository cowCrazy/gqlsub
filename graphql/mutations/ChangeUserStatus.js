import {
  GraphQLObjectType,
  GraphQLString,
} from 'graphql'

import { usersStatusEvent } from '../subscriptions/UsersStatusSub'

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

const resolveDec = (parentValue, args, context) => {
  const db = context.dbClient.readCollection({ collection: 'users' })
  const { username, status } = args
  
  context.dbClient.writeCollection({ collection: 'users', data: db })
  try {
    usersStatusEvent.emit('newMessage', newMessage)
    const subscribers = context.pubsubClient.publish('newMessage')
  } catch (err) {
    console.error('got subscribers error:', err);
  }
  return { message: args.message }
}

export default {
  type: typeDec,
  args: argsDec,
  resolve: resolveDec,
}
