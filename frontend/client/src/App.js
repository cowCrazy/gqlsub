import React from 'react'
import { Provider as ReduxProvider } from 'react-redux'

import store from './store/store'
import ChatRoom from './ChatRoom'

function App() {
  return (
    <div>
      <ReduxProvider store={store()}>
        <ChatRoom />
      </ReduxProvider>
    </div>
  );
}

export default App
