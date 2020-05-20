import { GraphQLObjectType } from 'graphql'

import Messages from './Messages';
import Users from './Users';

export const RootQuery = new GraphQLObjectType({
  name: 'RootQuery',
  fields: {
    reader: {
      type: new GraphQLObjectType({
        name: 'ReaderQuery',
        fields: {
          messages: {
            type: Messages.type,
            args: Messages.args,
            resolve: Messages.resolve,
          },
          users: {
            type: Users.type,
            args: Users.args,
            resolve: Users.resolve,
          }
        }
      }),
      resolve: (parentValue, args, context) => {
        return 'read success'
      }
    }
  }
})
