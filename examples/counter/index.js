import React from 'react'
import { connect } from 'react-redux'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import config from './config'
import { createStore } from 'redux'
import { startReactions } from '../../lib'
import { REACTORS } from './reactions'

function reducer(state, action) {
    console.log(state, action)
    if (action.type == 'ACTION') {
        return config.reducer(state, action.action);
    } else {
        return state;
    }
}

function reactions(state, dispatch) {
    return config.reactions(state, (action) => dispatch({type: 'ACTION', action}))
}

const store = createStore(reducer, config.initial)
startReactions(store, reactions, REACTORS)

function mapStateToProps(state) {
  return { state }
}
function mapDispatchToProps(dispatch) {
  return { dispatch: (action) => dispatch({type: 'ACTION', action}) }
}
const App = connect(mapStateToProps, mapDispatchToProps)(config.view)



render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
)
