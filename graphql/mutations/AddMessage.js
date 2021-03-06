import {
  GraphQLObjectType,
  GraphQLString,
} from 'graphql'

const type = new GraphQLObjectType({
  name: 'AddMessage',
  fields: {
    id: { type: GraphQLString },
    message: { type: GraphQLString },
  },
})

const args = {
  message: { type: GraphQLString },
}

const resolve = (parentValue, args, context) => {  
  const db = context.dbClient.readCollection('messages')  
  const lastMessage = db[db.length - 1]  
  const nextId = lastMessage ? `${Number(lastMessage.id) + 1}` : '1'
  const newMessage = {
    id: nextId,
    message: args.message,
    date: Date.now(),
    edited: false,
  }
  db.push(newMessage)
  context.dbClient.writeCollection('messages', db)
  return newMessage
}

export default {
  type,
  args,
  resolve,
}
