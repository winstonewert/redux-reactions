const IF_ODD = 'IF_ODD'
const ALWAYS = 'ALWAYS'

export function ifOdd(action) {
  return {
    type: IF_ODD,
    action
  }
}
export function always(action) {
  return {
    type: ALWAYS,
    action
  }
}

export function ifOddReducer(reducer) {
  return (state = reducer(undefined, {}), action) => {
    switch (action.type) {
      case IF_ODD:
        if (state % 2 == 0) {
          return state
        } else {
          return reducer(state, action.action)
        }
        break
      case ALWAYS:
        return reducer(state, action.action)
      default:
        return state
    }
  }
}
