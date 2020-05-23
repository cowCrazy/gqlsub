import {
  GraphQLObjectType,
  GraphQLString,
} from 'graphql'

const type = new GraphQLObjectType({
  name: 'AddMessage',
  fields: {
    message: { type: GraphQLString },
  },
})

const args = {
  message: { type: GraphQLString },
}

const resolve = (parentValue, args, context) => {  
  const db = context.dbClient.readCollection('messages')  
  const newMessage = { message: args.message }
  db.push(newMessage)
  context.dbClient.writeCollection('messages', db)
  return newMessage
}

export default {
  type,
  args,
  resolve,
}
