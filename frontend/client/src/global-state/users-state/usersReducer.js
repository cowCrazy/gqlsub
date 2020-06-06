import {
  USERS_INITIAL_INCOMING_SUCCESS,
  USER_STATUS_CHANGE_USERS,
} from './usersTypes'

const initialState = {
  users: []
}

export const usersReducer = (state = initialState, action) => {
  switch (action.type) {
    case USERS_INITIAL_INCOMING_SUCCESS:      
      return {
        ...state,
        users: action.payload,
      }
    case USER_STATUS_CHANGE_USERS:
      console.log('user status changed:', action);
      
      const incomingUser = action.payload
      const nextUsers = [...state.users]
      const userIdx = nextUsers.findIndex(user => user.id === incomingUser.id)
      const { id, ...rest } = incomingUser
      nextUsers[userIdx] =  {
        ...nextUsers[userIdx],
        ...rest,
      }
      return {
        ...state,
        users: nextUsers,
      }
    default:
      return state
  }
}
