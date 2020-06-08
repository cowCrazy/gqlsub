import React, { Component } from 'react'
import { connect } from 'react-redux'

import Message from './Message'
import { connectWsConnectionAction } from 'global-state/ws-connection-state/wsConnectionActions'
import { sendMessageAction } from 'global-state/messages-state/messagesActions'

class ChatRoom extends Component {
  constructor(props) {
    super(props)

    this.state = {
      newMessage: '',
      users: [],
    }
  }

  componentDidMount() {
    const { connect } = this.props
    connect()
  }

  handleSendNewMessage = () => {
    const { newMessage } = this.state
    const { sendMessage } = this.props
    sendMessage(newMessage)
    this.setState({
      newMessage: '',
    })
  }

  handleEditNewMessage = (e) => {
    this.setState({
      newMessage: e.target.value
    })
  }

  handleLeave = () => {
    const { wsConnection } = this.state
    wsConnection.send(JSON.stringify({ close: true, subName: 'newMessage' }))
  }

  render() {
    const { newMessage } = this.state
    const {
      messages,
      wsConnection,
      user,
      users,
    } = this.props
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

const mapStateToProps = storeState => ({
  messages: storeState.messagesReducer.messages,
  wsConnection: storeState.wsConnectionReducer.connection,
  user: storeState.userReducer,
  users: storeState.usersReducer.users,
})

const mapDispatchToProps = (dispatch) => ({
  connect: () => dispatch(connectWsConnectionAction()),
  sendMessage: (message) => dispatch(sendMessageAction(message))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ChatRoom)