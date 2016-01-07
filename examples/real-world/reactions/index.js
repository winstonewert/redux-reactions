import _ from 'lodash'
import apiDriver from './api'

export function reactions(state) {
  return _(state.router.components)
        .map('reactions')
        .filter() // remove components that don't have a reactions function.
        .map((x) => x(state))
        .flatten()
        .value()
}

export const REACTION_TYPES = {
  GITHUB_API: apiDriver
}
