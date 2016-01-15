import React from 'react'
import { connect } from 'react-redux'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import configureStore from './store'
import config from './config'

const store = configureStore()

function mapStateToProps(state) {
  return { state }
}
const App = connect(mapStateToProps)(config.view)

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
)
