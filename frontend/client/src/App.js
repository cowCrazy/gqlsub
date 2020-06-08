import React from 'react'
import { Provider as ReduxProvider } from 'react-redux'

import configureStore from './store/store'
import RouterRoot from 'RouterRoot'

const reduxStore = configureStore()

const App = () => {
  return (
    <div>
      <ReduxProvider store={reduxStore}>
        <RouterRoot />
      </ReduxProvider>
    </div>
  )
}

export default App
