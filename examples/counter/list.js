import React from 'react'
import _ from 'lodash'

const ITEM = 'ITEM'
const ADD = 'ADD'
const REMOVE = 'REMOVE'

const actions = {
  item: (index, action) => ({ type: ITEM, index, action }),
  add: () => ({ type: ADD }),
  remove: (index) => ({ type: REMOVE, index })
}

export default function (inner) {

  const default_state = [ inner.reducer(undefined, {}) ]

  return {
    action: actions,
    reducer: (state = default_state, action) => {
      switch(action.type) {
        case ITEM:
          return _.map(state, (old, index) => index == action.index ? inner.reducer(old, action.action) : old)
        case ADD:
          return [ ...state, inner.reducer(undefined, {}) ]
        case REMOVE:
          return _.filter(state, (_, index) => index != action.index)
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
    view: ({ state, dispatch }) => (
        <div>
            {_.map(state, (counter, index) => <p key={index}>
                <inner.view state={counter} dispatch={(action) => dispatch(actions.item(index, action))}/>
                <button onClick={() => dispatch(actions.remove(index))}>Remove Counter</button>
              </p>)}
            <button onClick={() => dispatch(actions.add())}>Add Counter</button>
        </div>
       )
  }


}
