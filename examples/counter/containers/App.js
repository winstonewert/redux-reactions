import { connect } from 'react-redux'
import config from '../config'

function mapStateToProps(state) {
  return { state }
}

export default connect(mapStateToProps)(config.view)
