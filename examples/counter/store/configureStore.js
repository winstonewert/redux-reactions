import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import reducer from '../reducer'
import { startReactions } from '../../../lib'
import { reactions, REACTORS } from '../reactions'

const createStoreWithMiddleware = applyMiddleware(
  thunk
)(createStore)

export default function configureStore(initialState) {
  const store = createStoreWithMiddleware(reducer, initialState)

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('../reducer', () => {
      const nextReducer = require('../reducer')
      store.replaceReducer(nextReducer)
    })
  }

  startReactions(store, reactions, REACTORS)

  return store
}
