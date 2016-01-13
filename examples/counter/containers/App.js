import { connect } from 'react-redux'
import Counter from '../components/Counter'

function mapStateToProps(state) {
  return {
    counters: state
  }
}

export default connect(mapStateToProps)(Counter)
