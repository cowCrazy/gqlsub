export const attachWatcherFunc = (watchName, subName, currentWatchCollectionCallbacks, nextWatchCallback) => {
  const currentWatchProcess = currentWatchCollectionCallbacks[watchName]
  const nextWatchProcessIndex = currentWatchProcess.findIndex(existingWatchProcess => existingWatchProcess.subName === subName)
  if (nextWatchProcessIndex > -1) {
    const nextWatchProcessItem = {
      ...currentWatchProcess[nextWatchProcessIndex],
      watchers: {
        ...currentWatchProcess[nextWatchProcessIndex].watchers,
        [nextWatchCallback.connectionId]: nextWatchCallback.func,
      }
    }
    const nextWatchProcessArray = [...currentWatchProcess]
    nextWatchProcessArray[nextWatchProcessIndex] = nextWatchProcessItem
    return nextWatchProcessArray
  } else {
    const nextWatchProcessItem = {
      subName: nextWatchCallback.subName,
      publish: nextWatchCallback.publish,
      watchers: {
        [nextWatchCallback.connectionId]: nextWatchCallback.func
      }
    }
    return [...currentWatchProcess, nextWatchProcessItem]
  }
}
