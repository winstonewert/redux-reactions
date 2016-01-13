import { fromEmitter } from '../../../lib'
import { delayedReactions } from '../delayed'
import { listReactions } from '../list'

export function reactions(state) {
  return listReactions(delayedReactions)(state) 
}

export const REACTORS = {
  DELAYED: fromEmitter((reaction, emit) => {
    setTimeout(() => {emit('go')}, reaction.delay)
  })
}
