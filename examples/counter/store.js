import { createStore } from 'redux'
import { startReactions } from '../../lib'
import { REACTORS } from './reactions'
import config from './config'

export default function configureStore(initialState) {
  
  const store = createStore((state = config.initial, action) => config.reducer(state, action), initialState)
  startReactions(store, config.reactions, REACTORS)
  return store
}
