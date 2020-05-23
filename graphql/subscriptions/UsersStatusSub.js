import events from 'events'

import {
  GraphQLObjectType,
  GraphQLString,
} from 'graphql'
import { createIterable } from '../../iterable'

export const usersStatusEvent = new events.EventEmitter()

const UsersStatusSub = new GraphQLObjectType({
  name: 'UsersStatusSub',
  fields: {
    id: { type: GraphQLString },
    username: { type: GraphQLString },
    status: { type: GraphQLString },
  },
})

const resolve = (payload) => {
  console.log('resolve payload:', payload);
  return payload[0]
}

const subscribe = (parentValue, args, context) => {
  const eventName = 'userStatusChange'
  context.assignConfigs('users', 'change', usersStatusEvent, eventName)
  const iterable = createIterable(eventName, usersStatusEvent)
  return iterable
}

export default {
  type: UsersStatusSub,
  resolve,
  subscribe,
}
