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
  return {
    initial: [inner.initial],
    action: actions,
    reducer: (state, action) => {
      switch(action.type) {
        case ITEM:
          return _.map(state, (old, index) => index == action.index ? inner.reducer(old, action.action) : old)
        case ADD:
          return [ ...state, inner.initial]
        case REMOVE:
          return _.filter(state, (_, index) => index != action.index)
        default:
          return state
      }
    },
    reactions: (state, dispatch) => _.flatten(_.map(state, (state, index) => inner.reactions(state, (action) => dispatch(actions.item(index, action))))),
    view: ({ state, dispatch }) => (
        <div>
            {_.map(state, (counter, index) => <p key={index}>
                <inner.view state={counter} dispatch={(action) => dispatch(actions.item(index, action))} remove={() => dispatch(actions.remove(index))} />
                <button onClick={() => dispatch(actions.remove(index))}>Remove Counter</button>
              </p>)}
            <button onClick={() => dispatch(actions.add())}>Add Counter</button>
        </div>
       )
  }


}
