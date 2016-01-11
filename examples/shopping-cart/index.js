import React from 'react'
import { render } from 'react-dom'
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import logger from 'redux-logger'
import thunk from 'redux-thunk'
import reducer from './reducers'
import App from './containers/App'
import { startReactions } from '../../lib'
import { reactions, REACTION_TYPES } from './reactions'

const middleware = process.env.NODE_ENV === 'production' ?
  [ thunk ] :
  [ thunk, logger() ]

const createStoreWithMiddleware = applyMiddleware(...middleware)(createStore)
const store = createStoreWithMiddleware(reducer)

startReactions(store, reactions, REACTION_TYPES)

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
)
