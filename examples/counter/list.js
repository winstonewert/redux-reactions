import React, { Component } from 'react'
import _ from 'lodash'

const ITEM = 'ITEM'
const ADD = 'ADD'
const REMOVE = 'REMOVE'

const actions = {
  item: (index, action) => ({ type: ITEM, index, action }),
  add: () => ({ type: ADD }),
  remove: (index, action) => ({ type: REMOVE, index })
}

export default function (inner) {

  const default_state = [ inner.reducer(undefined, {}) ]

  return {
    action: actions,
    reducer: (state = default_state, action) => {
      console.log(state, action)
      switch(action.type) {
        case ITEM:
          var new_state = state.slice()
          new_state[action.index] = inner.reducer(new_state[action.index], action.action)
          return new_state
        case ADD:
          return [ ...state, inner.reducer(undefined, {}) ]
        case REMOVE:
          var new_state = state.slice()
          new_state.splice(action.index, 1)
          return new_state
        default:
          return state
      }
    },
    reactions: (state) =>  {
      function reactionsWithIndex(state, index) {
        return _.map(inner.reactions(state), (reaction) => ({ ...reaction, events: _.mapValues(reaction.events, (actionCreator) => (...args) => actions.item(index, actionCreator(...args))) }))
      }
      var result = _.flatten(_.map(state, reactionsWithIndex))
      return result
    },
    view: ({ state, dispatch }) => {console.log(state); return (
<div>
        {_.map(state, (counter, index) => <p key={index}>
                <inner.view state={counter} dispatch={(action) => dispatch(actions.item(index, action))}/>
                <button onClick={() => dispatch(actions.remove(index))}>Remove Counter</button>
          </p>)}
        <button onClick={() => dispatch(actions.add())}>Add Counter</button>
    </div>)}
  }


}
