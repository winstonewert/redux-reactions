import React from 'react'
import _ from 'lodash'
_.mixin(require('lodash-deep'))
const LATER = 'later'
const NOW = 'now'
const LATER_FINISHED = 'later_finished'

export const actions = {
  later: (action) => ({ type: LATER, action }),
  now: (action) => ({ type: NOW, action })
}

function delayedAction(action, dispatch) {
  return {
    type: 'DELAYED',
    delay: 1000,
    events: {
      go: () => dispatch({ type: LATER_FINISHED, action })
    }
  }
}

export default function (inner) {
  const default_state = {
    pending: [],
    state: inner.reducer(undefined, {})
  }
 
  return {
    actions: actions,
    reducer: (state = default_state, action) => {
      switch( action.type) {
        case LATER:
          return { ...state, pending: [ ...state.pending, action.action ] }
        case LATER_FINISHED:
          var index = _.deepFindIndex(state.pending, action.action)
          return { state: inner.reducer(state.state, action.action), pending: [].concat(state.pending.slice(0, index), state.pending.slice(index+1)) }
        case NOW:
          return { ...state, state: inner.reducer(state.state, action.action) }
        default:
          return state 
      }   
    },
    reactions: (state, dispatch) =>  _.map(state.pending, (action) => delayedAction(action, dispatch)),
    view: ({ state, dispatch }) => (
            <span>
                <inner.view state={state.state} dispatch={(action) => dispatch(actions.now(action))}/>
                {' '}
                <button onClick={() => dispatch(actions.later(inner.actions.increment()))}>Increment async</button>
              </span>
        )
  }
}


