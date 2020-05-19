import {
  GraphQLObjectType,
  GraphQLList,
  GraphQLInt,
} from 'graphql'

import User from './User'

const typeDec = new GraphQLObjectType({
  name: 'UsersType',
  fields: {
    list: {
      type: new GraphQLList(User.type),
      resolve: (parentValue, args, context) => {
        return parentValue.list.map(item => User.resolve(item, args, context))
      }
    },
    count: { type: GraphQLInt },
  }
})

const argsDec = {}

const resolveDec = (parentValue, args, context) => {  
  const result = context.dbClient.readCollection('users')  
  return {
    list: result,
    count: result.length,
  }
}

export default {
  type: typeDec,
  args: argsDec,
  resolve: resolveDec,
}
