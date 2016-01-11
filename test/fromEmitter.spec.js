import sinon from 'sinon'
import { fromEmitter } from '../src'
import { strictEqual, deepEqual } from 'assert'

describe('fromEmitter', () => {
  var cancel, emitter, dispatch, reactor

  beforeEach(() => {
    cancel = sinon.spy()
    emitter = sinon.stub().returns(cancel)
    dispatch = sinon.spy()
    reactor = fromEmitter(emitter)
  })
  it('does nothing if there are no reactions', () => {

    var result = reactor(undefined, [], dispatch)

    strictEqual(result.length, 0)
    strictEqual(emitter.callCount, 0)
    strictEqual(dispatch.callCount, 0)
    strictEqual(cancel.callCount, 0)
  })

  it('calls the emitter for new tasks', () => {

    const reaction = { 'foobar': 42, events: {} }
    var result = reactor(undefined, [ reaction ], dispatch)

    strictEqual(result.length, 1)
    deepEqual(result[0].reaction, { foobar: 42 })
    strictEqual(emitter.callCount, 1)
    deepEqual(emitter.args[0][0], { foobar: 42 })
    strictEqual(dispatch.callCount, 0)
    strictEqual(cancel.callCount, 0)
  })
  it('a different reaction replaces the original', () => {

    const reaction = { 'foobar': 42 }
    const reaction2 = { 'goat': 7 }
    var result = reactor(undefined, [ reaction ], dispatch)
    result = reactor(result, [ reaction2 ], dispatch)

    strictEqual(result.length, 1)
    deepEqual(result[0].reaction, reaction2)
    strictEqual(emitter.callCount, 2)
    deepEqual(emitter.args[0][0], reaction)
    strictEqual(dispatch.callCount, 0)
    strictEqual(cancel.callCount, 1)
  })
  it('a second iteration with the same reactions produces the same results', () => {

    const reaction = { 'foobar': 42 }
    var initial = reactor(undefined, [ reaction ], dispatch)
    var result = reactor(initial, [ reaction ], dispatch)

    strictEqual(result.length, 1)
    deepEqual(result[0].reaction, reaction)
    strictEqual(emitter.callCount, 1)
    strictEqual(dispatch.callCount, 0)
    strictEqual(cancel.callCount, 0)
  })
  it('a second iteration with the reaction removed, causes it to be cancelled', () => {

    const reaction = { 'foobar': 42 }
    var initial = reactor(undefined, [ reaction ], dispatch)
    var result = reactor(initial, [], dispatch)

    strictEqual(result.length, 0)
    strictEqual(emitter.callCount, 1)
    strictEqual(dispatch.callCount, 0)
    strictEqual(cancel.callCount, 1)
  })
  it('creates reactions if added', () => {

    const reaction = { 'foobar': 42 }
    var initial = reactor(undefined, [], dispatch)
    var result = reactor(initial, [ reaction ], dispatch)

    strictEqual(result.length, 1)
    deepEqual(result[0].reaction, reaction)
    strictEqual(emitter.callCount, 1)
    strictEqual(dispatch.callCount, 0)
    strictEqual(cancel.callCount, 0)
  })

  it('creates multiple reactions', () => {

    const reaction = { 'foobar': 42 }
    const reaction2 = { 'goat': 7 }
    var result = reactor(undefined, [ reaction, reaction2 ], dispatch)

    strictEqual(result.length, 2)
    deepEqual(result[0].reaction, reaction)
    deepEqual(result[1].reaction, reaction2)
    strictEqual(emitter.callCount, 2)
    strictEqual(dispatch.callCount, 0)
    strictEqual(cancel.callCount, 0)
  })

  it('cancels multiple reactions', () => {

    const reaction = { 'foobar': 42 }
    const reaction2 = { 'goat': 7 }
    var result = reactor(undefined, [ reaction, reaction2 ], dispatch)
    result = reactor(result, [], dispatch)

    strictEqual(result.length, 0)
    strictEqual(emitter.callCount, 2)
    strictEqual(dispatch.callCount, 0)
    strictEqual(cancel.callCount, 2)
  })
  it('dispatches events', () => {

    const reaction = { 'foobar': 42, events: { fire: () => 8 } }
    reactor(undefined, [ reaction ], dispatch)
    emitter.args[0][1]('fire')

    strictEqual(dispatch.callCount, 1)
    deepEqual(dispatch.args, [ [ 8 ] ])
        
  })

  it('dispatches events with argments', () => {

    const reaction = { 'foobar': 42, events: { fire: (x) => x } }
    reactor(undefined, [ reaction ], dispatch)
    emitter.args[0][1]('fire', 99)

    strictEqual(dispatch.callCount, 1)
    deepEqual(dispatch.args, [ [ 99 ] ])
  })

  it('ignores events without an action creator', () => {

    const reaction = { 'foobar': 42, events: { fire: (x) => x } }
    reactor(undefined, [ reaction ], dispatch)
    emitter.args[0][1]('water', 99)

    strictEqual(dispatch.callCount, 0)
  })

  it('replaces actions that only differ by event', () => {

    const reaction = { 'foobar': 42, events: { fire: (x) => x } }
    const reaction2 = { 'foobar': 42, events: { fire: (x) => x+1 } }
    var result = reactor(undefined, [ reaction ], dispatch)
    result = reactor(result, [ reaction2 ], dispatch)

    emitter.args[0][1]('fire', 99)

    strictEqual(dispatch.callCount, 1)
    deepEqual(dispatch.args, [ [ 100 ] ])
  })

  it('identical actions are combined', () => {
    const reaction = { 'foobar': 42 }
    reactor(undefined, [ reaction, reaction ], dispatch)

    strictEqual(emitter.callCount, 1)
    strictEqual(dispatch.callCount, 0)

  })

  it('identical actions combined in iteration', () => {
    const reaction = { 'foobar': 42 }
    var result = reactor(undefined, [ reaction, reaction ], dispatch)
    result = reactor(result, [ reaction, reaction ], dispatch)

    strictEqual(emitter.callCount, 1)
    strictEqual(dispatch.callCount, 0)
  })

  it('identical actions, both dispatched', () => {
    const reaction = { 'foobar': 42, events: { go: () => 1 } }
    const reaction2 = { 'foobar': 42, events: { go: () => 2 } }
    var result = reactor(undefined, [ reaction, reaction2 ], dispatch)
    result = reactor(result, [ reaction, reaction2 ], dispatch)

    strictEqual(emitter.callCount, 1)
    strictEqual(dispatch.callCount, 0)

    emitter.args[0][1]('go')
    deepEqual(dispatch.args, [ [ 1 ],[ 2 ] ])
      
  })

})
