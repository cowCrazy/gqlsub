import { GraphQLObjectType } from 'graphql'

import AddMessage from './AddMessage';
import EditMessage from './EditMessage';
import ChangeUserStatus from './ChangeUserStatus';

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
          },
          editMessage: {
            type: EditMessage.type,
            args: EditMessage.args,
            resolve: EditMessage.resolve,
          },
          changeUsersStatus: {
            type: ChangeUserStatus.type,
            args: ChangeUserStatus.args,
            resolve: ChangeUserStatus.resolve,
          }
        }
      }),
      resolve: (parentValue, args, context) => {
        return 'read success'
      }
    }
  }
})
