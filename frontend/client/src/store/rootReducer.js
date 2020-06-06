import { combineReducers } from 'redux'

import { wsConnectionReducer } from 'global-state/ws-connection-state/wsConnectionReducer'
import { messagesReducer } from 'global-state/messages-state/messagesReducer'
import { userReducer } from 'global-state/user-state/userReducer'
import { usersReducer } from 'global-state/users-state/usersReducer'

export default combineReducers({
  wsConnectionReducer,
  userReducer,
  usersReducer,
  messagesReducer,
})