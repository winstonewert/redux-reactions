export function startReactions(store, reactions, taskTypes) {
  function updateReactions() {
    for (var reaction of reactions(store.getState())) {
      if (reaction) {
        taskTypes[reaction.type](undefined, () => store.dispatch({ type: 'FINISH' }))
      }
    }
  }

  store.subscribe(updateReactions)
}
