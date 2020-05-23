import events from 'events'

import {
  GraphQLObjectType,
  GraphQLString,
} from 'graphql'
import { createIterable } from '../../iterable'

const newMessageEvent = new events.EventEmitter()

const NewMessageSub = new GraphQLObjectType({
  name: 'NewMessageSub',
  fields: {
    message: { type: GraphQLString },
  },
})

const resolve = (payload) => {
  console.log('message sub resolving:', payload);
  
  return payload[0]
}

const subscribe = (parentValue, args, context) => {
  const eventName = 'newMessage'
  context.assignConfigs('messages', 'addition', newMessageEvent, eventName)
  const iterable = createIterable(eventName, newMessageEvent)
  return iterable
}

export default {
  type: NewMessageSub,
  resolve,
  subscribe,
}
