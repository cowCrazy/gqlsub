import { GraphQLSchema } from 'graphql'

import { RootQuery } from './queries/RootQuery'
import { RootMutation } from './mutations/RootMutation'
import { RootSubscriptions } from './subscriptions/RootSubscription'

export const RootSchema = new GraphQLSchema({
  query: RootQuery,
  mutation: RootMutation,
  subscription: RootSubscriptions
})