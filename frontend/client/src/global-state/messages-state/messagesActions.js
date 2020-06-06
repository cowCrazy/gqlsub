import {
  MESSAGES_INIT_MESSAGES,
  MESSAGES_NEW_INCOMING_MESSAGE,
  MESSAGES_EDIT_INCOMING_MESSAGE,
} from './messagesTypes'
import { newMessageMut } from 'global-functions/graphql-requests/newMessageMut';
import { editMessageMut } from 'global-functions/graphql-requests/editMessageMut';

export const rootMessagesAction = (data) => {
  return (dispatch) => {
    console.log(data);
    if (data?.reader?.messages?.list) {
      dispatch(initMessagesAction(data))
    } else if (data?.newMessageSub?.message) {
      dispatch(newIncomingMessagesAction(data))
    } else if (data?.editMessageSub?.message) {
      dispatch(editIncomingMessagesAction(data))
    }
  }
}

const initMessagesAction = (data) => {
  return (dispatch) => {
    const { list: incomingMessages } = data.reader.messages
    dispatch({ type: MESSAGES_INIT_MESSAGES, payload: incomingMessages })
  }
}

const newIncomingMessagesAction = (data) => {
  return (dispatch) => {
    const incomingMessages = data.newMessageSub
    dispatch({ type: MESSAGES_NEW_INCOMING_MESSAGE, payload: incomingMessages })
  }
}

const editIncomingMessagesAction = (data) => {
  return (dispatch) => {
    const incomingMessages = data.editMessageSub
    dispatch({ type: MESSAGES_EDIT_INCOMING_MESSAGE, payload: incomingMessages })
  }
}

export const sendMessageAction = (message) => {
  return (dispatch, getState) => {
    const { connection: wsConnection } = getState().wsConnectionReducer
    wsConnection.send(newMessageMut(message))
  }
}

export const editMessageAction = (id, message) => {
  return (dispatch, getState) => {
    const { connection: wsConnection } = getState().wsConnectionReducer
    wsConnection.send(editMessageMut(id, message))
  }
}