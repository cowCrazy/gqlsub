import {
  WS_CONNECTION_START,
  WS_CONNECTION_SUCCESS,
  WS_CONNECTION_ERROR,
  WS_CONNECTION_CLOSE,
} from './wsConnectionTypes'

import { messagesQue } from 'global-functions/graphql-requests/messagesQuery'
import { newMessageSub } from 'global-functions/graphql-requests/newMessageSub'
import { usersStatusSub } from 'global-functions/graphql-requests/usersStatusSub'
import { usersQue } from 'global-functions/graphql-requests/usersQuery'
import { editMessageSub } from 'global-functions/graphql-requests/editMessageSub'
import { newUserSub } from 'global-functions/graphql-requests/newUserSub'

import { rootMessagesAction } from 'global-state/messages-state/messagesActions'
import { rootUserActions } from 'global-state/user-state/userActions'
import { rootUsersActions } from 'global-state/users-state/usersActions'

export const connectWsConnectionAction = () => {
  console.log('I am connecting');
  
  return (dispatch) => {
    const wsConnection = new WebSocket('ws://localhost:3000/subscriptions')
    wsConnection.onopen = (initMsg) => dispatch(onConnectWsConnectionAction(initMsg, wsConnection))
    wsConnection.onmessage = (msg) => dispatch(onMessageWsConnectionAction(msg))
    wsConnection.onclose = () => dispatch(onCloseWsConnectionAction())
  }
}

const onConnectWsConnectionAction = (initMsg, wsConnection) => {
  console.log('i am on open');
  
  return (dispatch) => {
    wsConnection.send(newMessageSub())
    wsConnection.send(editMessageSub())
    wsConnection.send(messagesQue())
    wsConnection.send(usersStatusSub())
    wsConnection.send(newUserSub())
    wsConnection.send(usersQue())
    dispatch({ type: WS_CONNECTION_SUCCESS, payload: wsConnection })
  }
}

const onCloseWsConnectionAction = () => {
  return (dispatch) => {
    dispatch({ type: WS_CONNECTION_CLOSE })
  }
}

const onMessageWsConnectionAction = (message) => {
  console.log('i am on message');
  
  return (dispatch) => {
    console.log('got ws msg:', message);
    const data = JSON.parse(message.data)
    
    if (data.errors) {
      console.log('got error back');
    } else if (data.collection === 'user') {
      dispatch(rootUserActions(data.data))
    } else if (data.collection === 'messages') {
      dispatch(rootMessagesAction(data.data))
    }  else if (data.collection === 'users') {
      dispatch(rootUsersActions(data.data))
    }
  }
}

