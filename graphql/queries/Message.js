import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLBoolean,
} from 'graphql'

const typeDec = new GraphQLObjectType({
  name: 'MessageType',
  fields: {
    id: { type: GraphQLString },
    message: { type: GraphQLString },
    date: { type: GraphQLString },
    edited: { type: GraphQLBoolean },
  },
})

const argsDec = {}

const resolveDec = (parentValue, args, context) => {
  return parentValue
}

export default {
  type: typeDec,
  args: argsDec,
  resolve: resolveDec,
}
