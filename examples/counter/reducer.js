import { counterReducer } from './counter'
import { ifOddReducer } from './ifOdd'
import { delayedReducer } from './delayed'
import { listReducer } from './list'

const reducer = listReducer(delayedReducer(ifOddReducer(counterReducer)))
export default reducer
