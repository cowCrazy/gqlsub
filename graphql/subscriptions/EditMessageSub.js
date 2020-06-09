import events from 'events'

import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLBoolean,
} from 'graphql'

const EditMessageSub = new GraphQLObjectType({
  name: 'EditMessageSub',
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
  const editMessageEvent = new events.EventEmitter()
  const eventName = 'editMessage'
  context.assignConfigs('messages', 'change', editMessageEvent, eventName)
  const iterable = context.createAsyncIterable(eventName, editMessageEvent)
  return iterable
}

export default {
  type: EditMessageSub,
  resolve,
  subscribe,
}
