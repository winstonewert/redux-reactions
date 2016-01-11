import _ from 'lodash'


export function startReactions(store, reactions, taskTypes) {
  var currentReactionState = {}

  function updateReactions() {
    var reactionsByType = _.groupBy(_.filter(reactions(store.getState())), 'type')
    for (var type in taskTypes) {
      currentReactionState[type] = taskTypes[type](currentReactionState[type], reactionsByType[type] || [], store.dispatch)
    }
  }

  store.subscribe(updateReactions)
  updateReactions()
}

export function fromEmitter(emitter) {
  function matchesReaction(reaction) {
    var strippedReaction = _.omit(reaction, 'events')
    return function (other) {
      return _.isEqual(strippedReaction, other.reaction)
    }
  }

  return function emitterWrapper(oldReactions = [], reactions, dispatch) {
    function createReaction(reaction) {
      var cancelled = false
      var events = [ reaction.events ]

      function emit(eventType, ...args) {
        if(!cancelled) {
          for (var event_ of events) {
            var actionCreator = event_[eventType]
            if (actionCreator) {
              dispatch(actionCreator(...args))
            }
          }
        }
      }
      var stripped = _.omit(reaction, 'events')

      var cancel = emitter(stripped, emit)

      return {
        reaction: stripped,
        clearEvents: () => {events = []},
        addEvents: (events_) => {events.push(events_)},
        cancel: () => {
          if (cancel) {
            cancel()
          }
          cancelled = true
        }
      }
    }

    var newReactions = []

    for (var reaction of reactions) {
      var oldReactionIndex = _.findIndex(oldReactions, matchesReaction(reaction))
      if (oldReactionIndex !== -1) {
        var existingReaction = oldReactions.splice(oldReactionIndex, 1)[0]
        existingReaction.clearEvents()
        existingReaction.addEvents(reaction.events)
        newReactions.push(existingReaction)
      } else {
        var newReactionIndex = _.findIndex(newReactions, matchesReaction(reaction))
        if (newReactionIndex !== -1) {
            // An identical reaction has alread been started
          newReactions[newReactionIndex].addEvents(reaction.events)
        } else {
          newReactions.push(createReaction(reaction))
        }
      }
    }


    for (var { cancel } of oldReactions) {
      cancel()
    }

        
    return newReactions
  }
}

export function fromPromiseFactory(promiseFactory) {
  return fromEmitter((reaction, emit) => {
    promiseFactory(reaction)
           .then((result) => emit('resolved', result))
           .catch((error) => emit('rejected', error))
  })
}
