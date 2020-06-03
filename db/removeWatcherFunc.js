export const removeWatcherFunc = (subName, connectionId, watcherSection) => { 
  const watcherIndex = watcherSection.findIndex(watcher => watcher.subName === subName)
  if (
    watcherIndex > -1
    && watcherSection[watcherIndex].watchers[connectionId]
  ) {    
    const { [connectionId]: watcherFunToRemove, ...restWatchers } = watcherSection[watcherIndex].watchers    
    watcherSection[watcherIndex].watchers = restWatchers

    if (!Object.keys(watcherSection[watcherIndex].watchers).length) {
      watcherSection.splice(watcherIndex, 1)
    }
  }
  return watcherSection
}
