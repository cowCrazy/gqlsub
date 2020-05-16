import events from 'events'

import {
  GraphQLObjectType,
  GraphQLString,
} from 'graphql'
import { createIterable } from '../../iterable'

export const newMessageEvent = new events.EventEmitter()

const NewMessageSub = new GraphQLObjectType({
  name: 'NewMessageSub',
  fields: {
    message: { type: GraphQLString },
  },
})

const resolve = (payload) => {
  console.log('i am resolving', payload);
  return payload
}

const subscribe = (parentValue, args, context) => {
  const eventName = 'newMessage'
  context.nameSub(eventName)
  const iterable = createIterable(eventName, newMessageEvent)
  return iterable
}

export default {
  type: NewMessageSub,
  resolve,
  subscribe,
}