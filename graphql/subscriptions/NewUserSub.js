import events from 'events'

import {
  GraphQLObjectType,
  GraphQLString,
} from 'graphql'
import { createIterable } from '../../iterable'

const NewUserSub = new GraphQLObjectType({
  name: 'NewUserSub',
  fields: {
    id: { type: GraphQLString },
    username: { type: GraphQLString },
    status: { type: GraphQLString },
  },
})

const resolve = (payload) => {
  console.log('got new user payload:', payload);
  return payload[0]
}

const subscribe = (parentValue, args, context) => {
  console.log('subscribed for new users');
  
  const usersStatusEvent = new events.EventEmitter()
  const eventName = 'newUser'
  context.assignConfigs('users', 'addition', usersStatusEvent, eventName)
  const iterable = createIterable(eventName, usersStatusEvent)
  return iterable
}

export default {
  type: NewUserSub,
  resolve,
  subscribe,
}
