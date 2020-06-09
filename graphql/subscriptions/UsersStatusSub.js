import events from 'events'

import {
  GraphQLObjectType,
  GraphQLString,
} from 'graphql'

const UsersStatusSub = new GraphQLObjectType({
  name: 'UsersStatusSub',
  fields: {
    id: { type: GraphQLString },
    username: { type: GraphQLString },
    status: { type: GraphQLString },
  },
})

const resolve = (payload) => {
  return payload[0]
}

const subscribe = (parentValue, args, context) => {
  const usersStatusEvent = new events.EventEmitter()
  const eventName = 'userStatusChange'
  context.assignConfigs('users', 'change', usersStatusEvent, eventName)
  const iterable = context.createAsyncIterable(eventName, usersStatusEvent)
  return iterable
}

export default {
  type: UsersStatusSub,
  resolve,
  subscribe,
}
