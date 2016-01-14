import React, { Component } from 'react'
import _ from 'lodash'

const IF_ODD = 'IF_ODD'
const ALWAYS = 'ALWAYS'

export const actions = {
  ifOdd: (action) => ({ type: IF_ODD, action }),
  always: (action) => ({ type: ALWAYS, action })
}

export default function (inner) {
  const default_state = inner.reducer(undefined, {})
  return {
    actions: { ...actions, ..._.mapValues(inner.actions, (actionCreator) => (...args) => actions.always(actionCreator(...args))) },
    reducer: (state = default_state, action) => {
      switch (action.type) {
        case IF_ODD:
          if (state % 2 == 0) {
            return state
          } else {
            return inner.reducer(state, action.action)
          }
          break
        case ALWAYS:
          return inner.reducer(state, action.action)
        default:
          return state
      }
    },
    view: ({ state, dispatch }) => (
            <span>
                <inner.View state={state} dispatch={(action) => dispatch(actions.always(action))}/>
                {' '}
                <button onClick={() => dispatch(actions.ifOdd(inner.actions.increment()))}>Increment if odd</button>
            </span>
            )
  }
}
