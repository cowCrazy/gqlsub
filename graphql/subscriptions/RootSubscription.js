import { GraphQLObjectType } from 'graphql'

import NewMessageSub from './NewMessageSub';
import UsersStatusSub from './UsersStatusSub';

export const RootSubscriptions = new GraphQLObjectType({
  name: 'RootSubscriptions',
  fields: {
    newMessageSub: {
      type: NewMessageSub.type,
      resolve: NewMessageSub.resolve,
      subscribe: NewMessageSub.subscribe,
    },
    usersStatusSub: {
      type: UsersStatusSub.type,
      resolve: UsersStatusSub.resolve,
      subscribe: UsersStatusSub.subscribe,
    }
  }
})
