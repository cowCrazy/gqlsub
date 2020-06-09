import events from 'events'

import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLBoolean,
} from 'graphql'

const NewMessageSub = new GraphQLObjectType({
  name: 'NewMessageSub',
  fields: {
    id: { type: GraphQLString },
    message: { type: GraphQLString },
    date: { type: GraphQLString },
    edited: { type: GraphQLBoolean },
  },
})

const resolve = (payload, args, context) => {
  return payload[0]
}

const subscribe = (parentValue, args, context) => {
  const newMessageEvent = new events.EventEmitter()
  const eventName = 'newMessage'  
  context.assignConfigs('messages', 'addition', newMessageEvent, eventName)
  const iterable = context.createAsyncIterable(eventName, newMessageEvent)
  console.log('iterable created:', iterable)
  return iterable
}

export default {
  type: NewMessageSub,
  resolve,
  subscribe,
}
