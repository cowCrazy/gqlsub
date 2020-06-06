import {
  MESSAGES_INIT_MESSAGES,
  MESSAGES_NEW_INCOMING_MESSAGE,
  MESSAGES_EDIT_INCOMING_MESSAGE,
} from './messagesTypes'

const initialState = {
  messages: [],
}

export const messagesReducer = (state = initialState, action) => {
  switch (action.type) {
    case MESSAGES_INIT_MESSAGES:
      return {
        ...state,
        messages: action.payload
      }
    case MESSAGES_NEW_INCOMING_MESSAGE:
      return {
        ...state,
        messages: [...state.messages, action.payload]
      }
    case MESSAGES_EDIT_INCOMING_MESSAGE:
      const incomingMessage = action.payload
      const nextMessages = [...state.messages]
      const messageIdx = nextMessages.findIndex(message => message.id === incomingMessage.id)
      const { id, ...rest } = incomingMessage
      nextMessages[messageIdx] =  {
        ...nextMessages[messageIdx],
        ...rest,
      }
      return {
        ...state,
        messages: nextMessages
      }
    default:
      return state
  }
}
