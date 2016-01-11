import _ from 'lodash'
import { incrementAsyncEnd } from '../actions/counter'
import { fromEmitter } from '../../../lib'

const DELAYED = 'DELAYED'

function delayedAsyncReaction(delay) {
  return {
    type: DELAYED,
    delay: delay,
    events: {
      go: incrementAsyncEnd
    }
  }
}

export function reactions(state) {
  return _.map(state.delayed, delayedAsyncReaction)
}

export const REACTORS = {
  DELAYED: fromEmitter((reaction, emit) => {
    setTimeout(() => emit('go'), reaction.delay)
  })
}
