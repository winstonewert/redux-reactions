import sinon from 'sinon'
import { fromPromiseFactory } from '../src'
import { strictEqual, deepEqual } from 'assert'

describe('fromPromiseFactory', () => {

  var promises, reactor, dispatch

  function promiseFactory(reaction) {
    return new Promise(function (resolve, reject) {
        promises.push({ reaction, resolve, reject })
      })
  }

  beforeEach(() => {
    promises = []
    reactor = fromPromiseFactory(promiseFactory)
    dispatch = sinon.spy()
  })

  it('does nothing if there are no reactions', () => {
    var result = reactor(undefined, [], dispatch)

    strictEqual(promises.length, 0)
    strictEqual(result.length, 0)
    strictEqual(dispatch.callCount, 0)
  })

  it('creates a promise for new reactions', () => {

    const reaction = { 'foobar': 42, events: {} }
    var result = reactor(undefined, [ reaction ], dispatch)

    strictEqual(promises.length, 1)
    strictEqual(result.length, 1)
    deepEqual(promises[0].reaction, { foobar: 42 })
    deepEqual(result[0].reaction, { foobar: 42 })
    strictEqual(dispatch.callCount, 0)
  })
  it('a different reaction replaces the original', () => {

    const reaction = { 'foobar': 42 }
    const reaction2 = { 'goat': 7 }
    var result = reactor(undefined, [ reaction ], dispatch)
    result = reactor(result, [ reaction2 ], dispatch)

    strictEqual(result.length, 1)
    deepEqual(result[0].reaction, reaction2)
    strictEqual(promises.length, 2)
    deepEqual(promises[0].reaction, reaction)
    deepEqual(promises[1].reaction, reaction2)
    strictEqual(dispatch.callCount, 0)
  })
  it('a second iteration with the same reactions produces the same results', () => {

    const reaction = { 'foobar': 42 }
    var initial = reactor(undefined, [ reaction ], dispatch)
    var result = reactor(initial, [ reaction ], dispatch)

    strictEqual(result.length, 1)
    deepEqual(result[0].reaction, reaction)
    strictEqual(promises.length, 1)
    strictEqual(dispatch.callCount, 0)
  })
  it('a second iteration with the reaction removed, causes it to be cancelled', () => {

    const reaction = { 'foobar': 42 }
    var initial = reactor(undefined, [ reaction ], dispatch)
    var result = reactor(initial, [], dispatch)

    strictEqual(result.length, 0)
    strictEqual(promises.length, 1)
    strictEqual(dispatch.callCount, 0)
  })
  it('creates reactions if added', () => {

    const reaction = { 'foobar': 42 }
    var initial = reactor(undefined, [], dispatch)
    var result = reactor(initial, [ reaction ], dispatch)

    strictEqual(result.length, 1)
    deepEqual(result[0].reaction, reaction)
    strictEqual(promises.length, 1)
    strictEqual(dispatch.callCount, 0)
  })

  it('creates multiple reactions', () => {

    const reaction = { 'foobar': 42 }
    const reaction2 = { 'goat': 7 }
    var result = reactor(undefined, [ reaction, reaction2 ], dispatch)

    strictEqual(result.length, 2)
    deepEqual(result[0].reaction, reaction)
    deepEqual(result[1].reaction, reaction2)
    strictEqual(promises.length, 2)
    strictEqual(dispatch.callCount, 0)
  })

  it('cancels multiple reactions', () => {

    const reaction = { 'foobar': 42 }
    const reaction2 = { 'goat': 7 }
    var result = reactor(undefined, [ reaction, reaction2 ], dispatch)
    result = reactor(result, [], dispatch)

    strictEqual(result.length, 0)
    strictEqual(promises.length, 2)
    strictEqual(dispatch.callCount, 0)
  })
  it('dispatches events', () => {
    return new Promise(function (resolve) {
      const reaction = { 'foobar': 42, events: { resolved: () => 8 } }
      reactor(undefined, [ reaction ], resolve)
      promises[0].resolve()
    }).then( (action) => strictEqual(action, 8))
  })

  it('dispatches rejection events events', () => {
    return new Promise(function (resolve) {
      const reaction = { 'foobar': 42, events: { rejected: () => 8 } }
      reactor(undefined, [ reaction ], resolve)
      promises[0].reject()
    }).then( (action) => strictEqual(action, 8))
  })

  it('dispatches events with argments', () => {
    return new Promise(function (resolve) {
      const reaction = { 'foobar': 42, events: { resolved: (x) => x } }
      reactor(undefined, [ reaction ], resolve)
      promises[0].resolve(99)
    }).then((action) => strictEqual(action, 99))
  })

  it('replaces actions that only differ by event', () => {
    return new Promise(function (resolve) {
      const reaction = { 'foobar': 42, events: { resolved: (x) => x } }
      const reaction2 = { 'foobar': 42, events: { resolved: (x) => x+1 } }
      var result = reactor(undefined, [ reaction ], resolve)
      result = reactor(result, [ reaction2 ], resolve)
      promises[0].resolve(99)
    }).then((action) => strictEqual(action, 100))
  })

})
