import { createStore } from 'redux'
import { strictEqual, deepEqual } from 'assert'
import { startReactions } from '../src'

describe('startReactions', () => {
  it('applies reactions', () => {

    function reducer(state = { started: false, finished: false }, action) {
      switch (action.type) {
        case 'START':
          return { ...state, started: true }
        case 'FINISH':
          return { ...state, finished: true }
        default:
          return state
      }
    }
    var store = createStore(reducer)

    function reactions(state) {
      return [
        state.started && !state.finished && { type: 'TASK', events: { finished: () => {type: 'FINISH'} } }
      ]
    }

    var waiting = []

    function taskImplementation(details, emitter) {
      waiting.push(() => emitter('FINISH'))
    }

    startReactions(store, reactions,{ TASK: taskImplementation })

    strictEqual(waiting.length, 0)
    deepEqual(store.getState(), { started: false, finished: false })

    store.dispatch({ type: 'START' })

    strictEqual(waiting.length, 1)
    deepEqual(store.getState(), { started: true, finished: false })

    waiting[0]()

    strictEqual(waiting.length, 1)
    deepEqual(store.getState(), { started: true, finished: true })
  })
})
