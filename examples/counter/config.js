import counter from './counter'
import ifOdd from './ifodd'
import delayed from './delayed'
import list from './list'

export default list(delayed(ifOdd(counter)))
