import { GraphQLObjectType } from 'graphql'
import Messages from './Messages';

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
          }
        }
      }),
      resolve: (parentValue, args, context) => {
        console.log('running');
        return 'read success'
      }
    }
  }
})
