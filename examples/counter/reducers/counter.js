import { INCREMENT_COUNTER, DECREMENT_COUNTER, INCREMENT_IF_ODD, INCREMENT_ASYNC_END } from '../actions/counter'

export default function counter(state = 0, action) {
  switch (action.type) {
    case INCREMENT_COUNTER:
      return state + 1
    case DECREMENT_COUNTER:
      return state - 1
    case INCREMENT_IF_ODD:
      return (state % 2 == 0) ? state : state + 1
    case INCREMENT_ASYNC_END:
      return state + 1
    default:
      return state
  }
}
