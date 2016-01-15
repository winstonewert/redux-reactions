import { fromEmitter } from '../../lib'

export const REACTORS = {
  DELAYED: fromEmitter((reaction, emit) => {
    setTimeout(() => {emit('go')}, reaction.delay)
  })
}
