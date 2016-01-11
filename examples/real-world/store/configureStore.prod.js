import { createStore, compose } from 'redux'
import { reduxReactRouter } from 'redux-router'
import createHistory from 'history/lib/createBrowserHistory'
import routes from '../routes'
import rootReducer from '../reducers'
import { startReactions } from '../../../lib'
import { reactions, REACTION_TYPES } from '../reactions'

const finalCreateStore = compose(
  reduxReactRouter({ routes, createHistory })
)(createStore)

export default function configureStore(initialState) {
  const store = finalCreateStore(rootReducer, initialState)
  startReactions(store, reactions, REACTION_TYPES)
  return store
}
