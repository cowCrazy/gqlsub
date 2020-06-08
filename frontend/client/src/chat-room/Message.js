import React, { Component } from 'react'
import { connect } from 'react-redux'

import { editMessageMut } from 'global-functions/graphql-requests/editMessageMut'
import { editMessageAction } from 'global-state/messages-state/messagesActions'

class Message extends Component {
  constructor(props) {
    super(props)

    this.state = {
      isEdited: false,
      message: '',
    }
  }

  componentDidMount() {
    this.setState({
      message: this.props.message,
    })
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.message !== this.props.message) {
      this.setState({
        message: this.props.message,
      })
    }
  }

  toggleEdit = () => {
    const { isEdited } = this.state
    const { message } = this.props
    this.setState({
      isEdited: !isEdited,
      message,
    })
  }

  handleEdit = (e) => {
    this.setState({
      message: e.target.value,
    })
  }

  handleSend = () => {
    const { editMessage, id } = this.props
    const { message } = this.state
    editMessage(id, message)
    this.setState({
      isEdited: false
    })
  }

  render() {
    const { edited, date } = this.props
    const { message, isEdited } = this.state
    if (isEdited) {
      return (
        <div
          style={{
            display: 'flex',
            flexDirection: 'row'
          }}
        >
          <div style={{ flex: '1' }}>
            <button onClick={this.toggleEdit}>Cancel</button>
          </div>
          <div style={{ flex: '2' }}>
            <input value={message} onChange={this.handleEdit} />
          </div>
          <div style={{ flex: '1' }}>
            <button onClick={this.handleSend}>Send</button>
          </div>
        </div>
      )
    }
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'row'
        }}
      >
        <div style={{ flex: '1' }}>
          <button onClick={this.toggleEdit}>Edit</button>
        </div>
        <div style={{ flex: '3', color: '#444444' }}>{new Date(Number(date)).toLocaleString()}</div>
        <div style={{ flex: '2' }}>{message}</div>
        <div style={{ flex: '1' }}>
          {
            edited
              ? `(edited)`
              :null
          }
        </div>
      </div>
    )
  }
}

const mapDispatchToProps = dispatch => ({
  editMessage: (id, message) => dispatch(editMessageAction(id, message))
})

export default connect(
  null,
  mapDispatchToProps,
)(Message)