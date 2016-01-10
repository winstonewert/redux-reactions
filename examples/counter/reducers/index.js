import { combineReducers } from 'redux'
import counter from './counter'
import delayed from './delayed'

const rootReducer = combineReducers({
  counter,
  delayed
})

export default rootReducer
