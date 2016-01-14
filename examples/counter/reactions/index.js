import { fromEmitter } from '../../../lib'
import config from '../config'

export function reactions(state) {
  return config.reactions(state) 
}

export const REACTORS = {
  DELAYED: fromEmitter((reaction, emit) => {
    setTimeout(() => {emit('go')}, reaction.delay)
  })
}
