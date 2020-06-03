import {
  GraphQLObjectType,
  GraphQLString,
} from 'graphql'

const type = new GraphQLObjectType({
  name: 'EditMessage',
  fields: {
    id: { type: GraphQLString },
    message: { type: GraphQLString },
  },
})

const args = {
  id: { type: GraphQLString },
  message: { type: GraphQLString },
}

const resolve = (parentValue, args, context) => {  
  const db = context.dbClient.readCollection('messages')  
  const targetMessageIndex = db.findIndex(item => item.id === args.id)
  db[targetMessageIndex] = {
    ...db[targetMessageIndex],
    message: args.message,
    edited: true,
  }  
  context.dbClient.writeCollection('messages', db)
  return db[targetMessageIndex]
}

export default {
  type,
  args,
  resolve,
}
