import React, { Component } from 'react'
import { editMessageMut } from './global-functions/graphql-requests/editMessageMut'

export default class Message extends Component {
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
    const { wsConnection, id } = this.props
    const { message } = this.state
    wsConnection.send(editMessageMut(id, message))
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
            <button style={{ backgroundColor: 'red' }} onClick={this.toggleEdit}>Cancel</button>
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
