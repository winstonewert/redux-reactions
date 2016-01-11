import { INCREMENT_ASYNC, INCREMENT_ASYNC_END } from '../actions/counter'
import _ from 'lodash'

export default function delayed(state = [], action) {
  switch (action.type) {
    case INCREMENT_ASYNC:
      return [ ...state, action.delay ]
    case INCREMENT_ASYNC_END:
      return _.slice(state, 1)
    default:
      return state
  }
}
