import { GraphQLObjectType } from 'graphql'
import AddMessage from './AddMessage';

export const RootMutation = new GraphQLObjectType({
  name: 'RootMutation',
  fields: {
    writer: {
      type: new GraphQLObjectType({
        name: 'WriterMutation',
        fields: {
          addMessage: {
            type: AddMessage.type,
            args: AddMessage.args,
            resolve: AddMessage.resolve,
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
