import React, { Component } from 'react'
import { increment, decrement } from '../counter'
import _ from 'lodash'
import config from '../config'

import { item, add, remove } from '../list'

class CounterList extends Component {
  render() {
    const { counters, dispatch } = this.props
    return (<div>
        {_.map(counters, (counter, index) => <p key={index}>
                <config.view state={counter} dispatch={(action) => dispatch(item(index, action))}/>
                <button onClick={() => dispatch(remove(index))}>Remove Counter</button>
          </p>)}
        <button onClick={() => dispatch(add())}>Add Counter</button>
    </div>)
  }
}

export default CounterList
