import { USER_CONNECTION_SUCCESS } from "./userTypes"

const initialState = {
  connectionId: null
}

export const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case USER_CONNECTION_SUCCESS:
      console.log('got user con-id:', action);
      
      return {
        ...state,
        connectionId: action.payload,
      }
    default:
      return state
  }
}
