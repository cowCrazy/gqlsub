import {
  USERS_INITIAL_INCOMING_SUCCESS,
  USERS_STATUS_CHANGE_USER,
  USERS_NEW_USER,
} from './usersTypes'

export const rootUsersActions = (data) => {
  return (dispatch) => {
    if (data?.reader?.users?.list) {
      dispatch(connectionSuccessUserAction(data.reader.users.list))
    } else if (data?.usersStatusSub?.id) {
      dispatch(userStatusChangeUsersAction(data.usersStatusSub))
    } else if (data?.newUserSub?.id) {
      dispatch(newUserUsersAction(data.newUserSub))
    }
  }
}

const connectionSuccessUserAction = (data) => {
  return (dispatch) => {
    dispatch({ type: USERS_INITIAL_INCOMING_SUCCESS, payload: data })
  }
}

const userStatusChangeUsersAction = (data) => {
  return (dispatch) => {
    dispatch({ type: USERS_STATUS_CHANGE_USER, payload: data })
  }
}

const newUserUsersAction = (data) => {
  return (dispatch) => {
    dispatch({ type: USERS_NEW_USER, payload: data })
  }
}
