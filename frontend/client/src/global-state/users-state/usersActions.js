import {
  USERS_INITIAL_INCOMING_SUCCESS,
  USER_STATUS_CHANGE_USERS,
} from './usersTypes'

export const rootUsersActions = (data) => {
  return (dispatch) => {
    if (data?.reader?.users?.list) {
      dispatch(connectionSuccessUserAction(data.reader.users.list))
    } else if (data?.usersStatusSub?.id) {
      dispatch(userStatusChangeUsersAction(data.usersStatusSub))
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
    dispatch({ type: USER_STATUS_CHANGE_USERS, payload: data })
  }
}