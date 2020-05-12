import { GraphQLObjectType } from 'graphql'
import NewMessageSub from './NewMessageSub';

export const RootSubscriptions = new GraphQLObjectType({
  name: 'RootSubscriptions',
  fields: {
    newMessageSub: {
      type: NewMessageSub.type,
      resolve: NewMessageSub.resolve,
      subscribe: NewMessageSub.subscribe,
    }
  }
})
