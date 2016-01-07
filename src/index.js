import _ from 'lodash'


export function startReactions(store, reactions, taskTypes) {
  var currentReactionState = {}

  function updateReactions() {
    var reactionsByType = _.groupBy(_.filter(reactions(store.getState())), 'type')
    for (var type in reactionsByType) {
      currentReactionState[type] = taskTypes[type](currentReactionState[type], reactionsByType[type], store.dispatch)
    }
  }

  store.subscribe(updateReactions)
}

function matchesReaction(reaction) {
  var strippedReaction = _.omit(reaction, 'events')
  return function (other) {
    return _.isEqual(strippedReaction, other.reaction)
  }
}

export function fromEmitter(emitter) {
  return function emitterWrapper(oldReactions = [], reactions, dispatch) {
    function createReaction(reaction) {
      var cancelled = false
      var events = reaction.events

      function emit(eventType, ...args) {
            if(!cancelled) {
              var actionCreator = events[eventType]
              if (actionCreator) {
                dispatch(actionCreator(...args))
              }
            }
          }

      var cancel = emitter(reaction, emit)

      return {
            reaction: _.omit(reaction, 'events'),
            replaceEvents: (events_) => {events = events_},
            cancel: () => {
              cancel()
              cancelled = true
            }
          }
    }

    var newReactions = []

    for (var reaction of reactions) {
      var existingReactions = _.remove(oldReactions, matchesReaction(reaction))
      if (existingReactions.length) {
        for (var existingReaction of existingReactions) {
          existingReaction.replaceEvents(reaction.events)
          newReactions.push(existingReaction)
        }
      } else {
        newReactions.push(createReaction(reaction))
      }
    }


    for (var { cancel } of oldReactions) {
      cancel()
    }

        
    return newReactions
  }
}
