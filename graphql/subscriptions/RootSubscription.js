import { GraphQLObjectType } from 'graphql'

import NewMessageSub from './NewMessageSub';
import UsersStatusSub from './UsersStatusSub';
import EditMessageSub from './EditMessageSub';

export const RootSubscriptions = new GraphQLObjectType({
  name: 'RootSubscriptions',
  fields: {
    newMessageSub: {
      type: NewMessageSub.type,
      resolve: NewMessageSub.resolve,
      subscribe: NewMessageSub.subscribe,
    },
    editMessageSub: {
      type: EditMessageSub.type,
      resolve: EditMessageSub.resolve,
      subscribe: EditMessageSub.subscribe,
    },
    usersStatusSub: {
      type: UsersStatusSub.type,
      resolve: UsersStatusSub.resolve,
      subscribe: UsersStatusSub.subscribe,
    }
  }
})
