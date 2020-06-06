import { USER_CONNECTION_SUCCESS } from "./userTypes"

export const rootUserActions = (data) => {
  return (dispatch) => {
    dispatch(connectionSuccessUserAction(data))
  }
}

const connectionSuccessUserAction = (data) => {
  return (dispatch) => {
    dispatch({ type: USER_CONNECTION_SUCCESS, payload: data.connectionId })
  }
}