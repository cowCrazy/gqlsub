import React, { Component } from 'react'

import { messagesQue } from './global-functions/graphql-requests/messagesQuery';
import { newMessageSub } from './global-functions/graphql-requests/newMessageSub';
import { newMessageMut } from './global-functions/graphql-requests/newMessageMut';
import { usersStatusSub } from './global-functions/graphql-requests/usersStatusSub';
import { usersQue } from './global-functions/graphql-requests/usersQuery';
import { editMessageSub } from './global-functions/graphql-requests/editMessageSub';
import Message from './Message';

export default class ChatRoom extends Component {
  constructor(props) {
    super(props)

    this.state = {
      messages: [],
      newMessage: '',
      users: [],
      user: {},
      wsConnection: null,
    }
  }

  componentDidMount() {
    const wsConnection = new WebSocket('ws://localhost:3000/subscriptions')
    wsConnection.onopen = (initMsg) => this.wsOnConnection(initMsg, wsConnection)
    wsConnection.onmessage = this.wsMessageReceived
    wsConnection.onclose = () => {
      console.log('connection closed');  
    }
    this.setState({
      wsConnection
    })
  }

  wsOnConnection = (initMsg, wsConnection) => {
    wsConnection.send(newMessageSub())
    wsConnection.send(editMessageSub())
    wsConnection.send(messagesQue())
    wsConnection.send(usersStatusSub())
    wsConnection.send(usersQue())
  }

  wsMessageReceived = (msg) => {
    console.log('got ws msg:', msg);
    const data = JSON.parse(msg.data)
    
    if (data.errors) {
      console.log('got error back');
    } else if (data.collection === 'user') {
      this.updateUser(data.data)
    } else if (data.collection === 'messages') {
      this.updateMessages(data.data)
    }  else if (data.collection === 'users') {
      this.updateUsers(data.data)
    }
  }

  updateUser = (data) => {
    console.log('got user data:', data);
    
    this.setState({
      user: { ...data },
    })
  }

  updateMessages = (data) => {
    console.log(data);
    const { messages } = this.state
    if (data?.reader?.messages?.list) {
      const incomingMessages = data.reader.messages.list
      this.setState({
        messages: [...incomingMessages]
      })
    } else if (data?.newMessageSub?.message) {
      const incomingMessages = [data.newMessageSub]
      this.setState({
        messages: [...messages, ...incomingMessages]
      })
    } else if (data?.editMessageSub?.message) {
      const incomingMessages = [...messages]
      const messageIdx = incomingMessages.findIndex(message => message.id === data.editMessageSub.id)
      const { id, ...rest } = data.editMessageSub
      incomingMessages[messageIdx] =  {
        ...incomingMessages[messageIdx],
        ...rest,
      }
      this.setState({
        messages: [...incomingMessages]
      })
    }
  }

  handleEditNewMessage = (e) => {
    this.setState({
      newMessage: e.target.value,
    })
  }

  handleSendNewMessage = () => {
    const { wsConnection, newMessage } = this.state
    wsConnection.send(newMessageMut(newMessage))
    this.setState({
      newMessage: '',
    })
  }

  handleLeave = () => {
    const { wsConnection } = this.state
    wsConnection.send(JSON.stringify({ close: true, subName: 'newMessage' }))
  }

  updateUsers = (data) => {
    console.log(data);
    const { users } = this.state
    if (data?.reader?.users?.list) {
      const incomingUsers = data.reader.users.list
      this.setState({
        users: [...users, ...incomingUsers]
      })
    } else if (data?.usersStatusSub?.id) {
      const updatedUsers = users.map((item) => item.id === data.usersStatusSub.id ? data.usersStatusSub : item)
      this.setState({
        users: [...updatedUsers]
      })
    }
  }

  render() {
    const {
      messages,
      newMessage,
      users,
      user,
      wsConnection,
    } = this.state
    return (
      <div style={{ display: 'flex' }}>
        {
          user?.connectionId
            ? (
              <div>
                user connection - {user.connectionId}
              </div>
            )
            : null
        }
        <div style={{ flex: '1' }}>
          {
            users.map((item) => (
              <p key={item.id} style={{ color: item.status === 'online' ? 'green' : 'black' }}>
                {item.username}
              </p>
            ))
          }
        </div>
        <div style={{ flex: '3' }}>
          {
            messages.map((item) => (
              <Message key={item.id} {...item} wsConnection={wsConnection} />
            ))
          }
          <div>
            <input value={newMessage} onChange={this.handleEditNewMessage} />
            <button onClick={this.handleSendNewMessage} style={{ backgroundColor: wsConnection ? 'green' : 'red' }}>
              click
            </button>
          </div>
          <div>
            <button onClick={this.handleLeave} style={{ backgroundColor: wsConnection ? 'green' : 'red' }}>
              leave
            </button>
          </div>
        </div>
      </div>
    )
  }
}
