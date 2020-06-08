import React from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from 'react-router-dom'

import Navbar from 'Navbar'
import ChatRoom from 'chat-room/ChatRoom'
import AuthContainer from 'auth-page/AuthContainer'

export default () => (
  <Router>
      <div>
        <Navbar />

        <Switch>
          <Route path="/" exact>
            <div>welcome</div>
          </Route>
          <Route path="/login" exact>
            <AuthContainer />
          </Route>
          <Route path="/chat" exact>
            <ChatRoom />
          </Route>
          <Route path="/">
            <div><h2>404 page not found</h2></div>
          </Route>
        </Switch>
      </div>
    </Router>
)