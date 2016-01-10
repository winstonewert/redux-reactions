import { createStore } from 'redux'
import { strictEqual, deepEqual } from 'assert'
import { startReactions, fromEmitter } from '../src'

describe('startReactions', () => {

  describe('string sync scenario', () => {

      /* For the this scenario we have a single string. We keep track of the
       * local version of this string, as well as the remote version. If the
       * user sets the local version of the string, we send a request to set
       * it to the server which may either succeed or fail. The server can
       * also set the string from elsewhere.
       */

    function reducer(state = { local: '', remote: '', error: null }, action) {
      switch (action.type) {
        case 'USER_SET':
                  // The user has set the local string. The server will still have
                  // the string it used to have.
          return { ...state, local: action.text }
        case 'SERVER_SET':
                  // The server has initiated the change, so it already has this
                  // text.
          return { ...state, local: action.text, remote: action.text }
        case 'USER_SET_SUCCESS':
                  // We succesfully set the server string, it is now equal to the local.
          return { ...state, remote: state.local }
        case 'USER_SET_ERROR':
                  // We failed to set the server string, record the error.
          return { ...state, error: action.error }
        default:
          return state
      }
    }


    function setServerString(string) {
          /* This is the reaction creator. It builds and returns the reaction object. */
      return {
        type: 'SET_SERVER_STRING',
        text: string,
        events: {
          success: () => ({ type: 'USER_SET_SUCCESS' }),
          error: (error) => ({ type: 'USER_SET_ERROR', error })
        }
      }
    }

    function reactions(state) {
          /* This is the reactions function, it returns a list of reactions that should happen.
           * In this case it tries to set the server string if the local and remote are out of
           * sync and there are no errors. */
          
      return [
        state.local !== state.remote && !state.error && setServerString(state.local)
      ]
    }

    var serverRequests
      
    const setServerStringImplementation = fromEmitter((reaction, emit) => {
      var data = { emit, cancelled: false }
        // complain if we are sending a request we already sent.
      strictEqual(serverRequests[reaction.text], undefined)
      serverRequests[reaction.text] = data

      return () => {
        data.cancelled = true
      }
    })

    const REACTION_TYPES = {
      SET_SERVER_STRING: setServerStringImplementation
    }

    var store

    beforeEach(() => {
      serverRequests = {}
      store = createStore(reducer)
      startReactions(store, reactions, REACTION_TYPES)
    })

    it('does nothing from the initial state', () => {
      deepEqual(serverRequests, {})
      deepEqual({ local: '', remote: '', error: null }, store.getState())
    })

    it('initiates setting the server side string if the local string is changed', () => {
      store.dispatch({ type: 'USER_SET', text: 'Hello World' })
      deepEqual({ local: 'Hello World', remote: '', error: null }, store.getState())
      deepEqual([ 'Hello World' ], Object.keys(serverRequests))
    })

    it('accepts the success of the attempt to set the server side string', () => {
      store.dispatch({ type: 'USER_SET', text: 'Hello World' })
      serverRequests['Hello World'].emit('success')
      deepEqual({ local: 'Hello World', remote: 'Hello World', error: null }, store.getState())
    })

    it('records the failure of the attempt to set the server side string', () => {
      store.dispatch({ type: 'USER_SET', text: 'Hello World' })
      serverRequests['Hello World'].emit('error', 'request stubbed toe')
      deepEqual({ local: 'Hello World', remote: '', error: 'request stubbed toe' }, store.getState())
    })

    it('cancels the first request, if a second request happens', () => {
      store.dispatch({ type: 'USER_SET', text: 'Hello' })
      store.dispatch({ type: 'USER_SET', text: 'Hello World' })
      strictEqual(serverRequests['Hello'].cancelled, true)
      strictEqual(serverRequests['Hello World'].cancelled, false)
    })

    it('keeps the first request, if the second request is the same', () => {
      store.dispatch({ type: 'USER_SET', text: 'Hello' })
      store.dispatch({ type: 'FOOBAR' })
      strictEqual(serverRequests['Hello'].cancelled, false)
    })

    it('ignores events on first request after it was cancelled', () => {
      store.dispatch({ type: 'USER_SET', text: 'Hello' })
      store.dispatch({ type: 'USER_SET', text: 'Hello World' })
      serverRequests['Hello'].emit('success')
      deepEqual(store.getState(), { local: 'Hello World', remote: '', error: null })
    })

    it('accepts the second request', () => {
      store.dispatch({ type: 'USER_SET', text: 'Hello' })
      store.dispatch({ type: 'USER_SET', text: 'Hello World' })
      serverRequests['Hello World'].emit('success')
      deepEqual({ local: 'Hello World', remote: 'Hello World', error: null }, store.getState())
    })

    it('cancels correctly if change our mind, and dont want a change', () => {
      store.dispatch({ type: 'USER_SET', text: 'Hello' })
      store.dispatch({ type: 'USER_SET', text: '' })
      strictEqual(serverRequests['Hello'].cancelled, true)
    });


  })
})
