import {
  GraphQLObjectType,
  GraphQLString,
} from 'graphql'

const typeDec = new GraphQLObjectType({
  name: 'UserType',
  fields: {
    id: { type: GraphQLString },
    username: { type: GraphQLString },
    status: { type: GraphQLString },
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
