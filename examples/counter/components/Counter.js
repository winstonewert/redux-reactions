import React, { Component } from 'react'
import { increment, decrement } from '../counter'
import _ from 'lodash'

function BasicCounter({ counter, dispatch }) {
  return (<span>
        Clicked: {counter} times
        {' '}
        <button onClick={() => dispatch(increment())}>+</button>
        {' '}
        <button onClick={() => dispatch(decrement())}>-</button>
    </span>)
}

import { always, ifOdd } from '../ifOdd'

function CounterWithIfOdd({ counter, dispatch }) {
  return (<span>
        <BasicCounter counter={counter} dispatch={(action) => dispatch(always(action))}/>
        {' '}
        <button onClick={() => dispatch(ifOdd(increment()))}>Increment if odd</button>
    </span>)
}

import { now, later } from '../delayed'

function Counter({ counter, dispatch }) {
  return (
      <span>
        <CounterWithIfOdd counter={counter.state} dispatch={(action) => dispatch(now(action))}/>
        {' '}
        <button onClick={() => dispatch(later(always(increment())))}>Increment async</button>
      </span>
    )
}

import { item, add, remove } from '../list'

class CounterList extends Component {
  render() {
    const { counters, dispatch } = this.props
    return (<div>
        {_.map(counters, (counter, index) => <p key={index}>
                <Counter counter={counter} dispatch={(action) => dispatch(item(index, action))}/>
                <button onClick={() => dispatch(remove(index))}>Remove Counter</button>
          </p>)}
        <button onClick={() => dispatch(add())}>Add Counter</button>
    </div>)
  }
}

export default CounterList
