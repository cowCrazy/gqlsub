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
  const collectionData = context.dbClient.readCollection({ collection: 'users' })
  const user = collectionData.find((items) => items.username === args.username)
  const { username, status } = args 
  context.dbClient.writeCollection({ collection: 'users', data: db })
  return { message: args.message }
}

export default {
  type: typeDec,
  args: argsDec,
  resolve: resolveDec,
}
