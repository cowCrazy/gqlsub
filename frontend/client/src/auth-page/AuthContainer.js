import React, { Component } from 'react'
import LoginForm from './LoginForm'
import RegisterForm from './RegisterForm'

export default class AuthContainer extends Component {
  constructor(props) {
    super(props)
  
    this.state = {
       showLogin: true
    }
  }

  handleFormToggle = () => {
    const { showLogin } = this.state
    this.setState({
      showLogin: !showLogin,
    })
  }

  handleSubmitLogin = () => {}

  handleSubmitRegister = () => {}
  
  render() {
    const { showLogin } = this.state
    return (
      <div>
        <h2>In order to use the chat you must have a user account on the platform</h2>
        {
          showLogin
            ? <LoginForm handleSubmitLogin={this.handleSubmitLogin} />
            : <RegisterForm handleSubmitRegister={this.handleSubmitRegister} />
        }
        {
          showLogin
            ? (
              <div>
                If you don't have an account already please register <button onClick={this.handleFormToggle}>here</button>
              </div>
            )
            : (
              <div>
                If you have an account already please login <button onClick={this.handleFormToggle}>here</button>
              </div>
            )
        }
      </div>
    )
  }
}
