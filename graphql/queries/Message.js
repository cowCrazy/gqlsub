import {
  GraphQLObjectType,
  GraphQLString,
} from 'graphql'

const typeDec = new GraphQLObjectType({
  name: 'MessageType',
  fields: {
    message: { type: GraphQLString },
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
