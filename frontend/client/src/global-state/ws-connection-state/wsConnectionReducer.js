import {
  WS_CONNECTION_START,
  WS_CONNECTION_SUCCESS,
  WS_CONNECTION_ERROR,
  WS_CONNECTION_CLOSE,
} from './wsConnectionTypes'

const initialState = {
  isConnecting: false,
  connection: null,
}

export const wsConnectionReducer = (state = initialState, action) => {
  switch (action.type) {
    case WS_CONNECTION_START:
      return {
        ...state,
        isConnecting: true,
      }
    case WS_CONNECTION_SUCCESS:
      return {
        ...state,
        isConnecting: false,
        connection: action.payload
      }
    case WS_CONNECTION_ERROR:
      return {
        ...state,
        isConnecting: false,
      }
    case WS_CONNECTION_CLOSE:
      return {
        ...state,
        connection: null
      }
    default:
      return state
  }
}