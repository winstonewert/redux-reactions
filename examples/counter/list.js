import _ from 'lodash'

const ITEM = 'ITEM'
const ADD = 'ADD'
const REMOVE = 'REMOVE'

export function item(index, action) {
  return {
    type: ITEM,
    index,
    action
  }
}

export function add() {
  return {
    type: ADD
  }
}

export function remove(index) {
  return {
    type: REMOVE,
    index
  }
}

export function listReducer(reducer) {
  const default_state = [ reducer(undefined, {}) ]
  return (state = default_state, action) => {
    switch(action.type) {
      case ITEM:
        var new_state = state.slice()
        new_state[action.index] = reducer(new_state[action.index], action.action)
        return new_state
      case ADD:
        return [ ...state, reducer(undefined, {}) ]
      case REMOVE:
        var new_state = state.slice()
        new_state.splice(action.index, 1)
        return new_state
      default:
        return state
    }
  }
}

export function listReactions(reactions) {
  return (state) => {
    function reactionsWithIndex(state, index) {
      return _.map(reactions(state), (reaction) => ({ ...reaction, events: _.mapValues(reaction.events, (actionCreator) => (...args) => item(index, actionCreator(...args))) }))
    }
    var result = _.flatten(_.map(state, reactionsWithIndex))
    return result
  }
}
