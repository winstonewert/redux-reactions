import React from 'react'

const INCREMENT = 'INCREMENT'
const DECREMENT = 'DECREMENT'

export const actions = {
  increment: () => ({ type: INCREMENT }),
  decrement: () => ({ type: DECREMENT })
}

export function reducer(state = 0, action) {
  switch (action.type) {
    case INCREMENT:
      return state + 1
    case DECREMENT:
      return state - 1
    default:
      return state
  }
}

export function view({ state, dispatch }) {
  return (<span>
        Clicked: {state} times
        {' '}
        <button onClick={() => dispatch(actions.increment())}>+</button>
        {' '}
        <button onClick={() => dispatch(actions.decrement())}>-</button>
    </span>)
}

export default { actions, reducer, view }
