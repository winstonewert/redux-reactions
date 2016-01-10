import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import reducer from '../reducers'
import { startReactions } from '../../../lib'
import { reactions, REACTORS} from '../reactions'

const createStoreWithMiddleware = applyMiddleware(
  thunk
)(createStore)

export default function configureStore(initialState) {
  const store = createStoreWithMiddleware(reducer, initialState)

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('../reducers', () => {
      const nextReducer = require('../reducers')
      store.replaceReducer(nextReducer)
    })
  }

  startReactions(store, reactions, REACTORS)

  return store
}
