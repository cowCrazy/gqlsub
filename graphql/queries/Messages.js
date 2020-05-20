import {
  GraphQLObjectType,
  GraphQLList,
  GraphQLInt,
} from 'graphql'

import Message from './Message'

const typeDec = new GraphQLObjectType({
  name: 'MessagesType',
  fields: {
    list: {
      type: new GraphQLList(Message.type),
      resolve: (parentValue, args, context) => {
        return parentValue.list.map(item => Message.resolve(item, args, context))
      }
    },
    count: { type: GraphQLInt },
  }
})

const argsDec = {}

const resolveDec = (parentValue, args, context) => {  
  const result = context.dbClient.readCollection('messages')  
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
