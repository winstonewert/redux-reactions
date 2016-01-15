import { createStore } from 'redux'
import { startReactions } from '../../lib'
import { REACTORS } from './reactions'
import config from './config'

export default function configureStore(initialState) {
  const store = createStore(config.reducer, initialState)
  startReactions(store, config.reactions, REACTORS)
  return store
}
