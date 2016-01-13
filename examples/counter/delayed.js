import _ from 'lodash'
_.mixin(require('lodash-deep'))
const LATER = 'later'
const NOW = 'now'
const LATER_FINISHED = 'later_finished'

export function later(action) {
  return {
    type: LATER,
    action
  }
}

export function now(action) {
  return {
    type: NOW,
    action
  }
}

export function delayedReducer(reducer) {
  const default_state = {
    pending: [],
    state: reducer(undefined, {})
  }
  return (state = default_state, action) => {
    switch( action.type) {
      case LATER:
        return { ...state, pending: [ ...state.pending, action.action ] }
      case LATER_FINISHED:
        var index = _.deepFindIndex(state.pending, action.action)
        return { state: reducer(state.state, action.action), pending: [].concat(state.pending.slice(0, index), state.pending.slice(index+1)) }
      case NOW:
        return { ...state, state: reducer(state.state, action.action) }
      default:
        return state 
    }   
  }
}

function delayedAction(action) {
  return {
    type: 'DELAYED',
    delay: 1000,
    events: {
      go: () => ({ type: LATER_FINISHED, action })
    }
  }
}

export function delayedReactions(state) {
  return _.map(state.pending, delayedAction)
}
