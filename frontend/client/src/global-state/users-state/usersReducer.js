import {
  USERS_INITIAL_INCOMING_SUCCESS,
  USERS_STATUS_CHANGE_USER,
  USERS_NEW_USER,
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
    case USERS_STATUS_CHANGE_USER:      
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
    case USERS_NEW_USER:
      return {
        ...state,
        users: [...state.users, action.payload]
      }
    default:
      return state
  }
}
