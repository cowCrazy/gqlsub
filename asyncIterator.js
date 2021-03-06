export const createAsyncIterable = (eventName, eventEmitter) => {
  const eventsQue = []
  const pushToQue = (payload) => {    
    eventsQue.push(payload)
  }
  eventEmitter.addListener(eventName, pushToQue)
  return {
    [Symbol.asyncIterator]() {
      return {
        eventsQue,
        next() {
          const nextEvent = this.eventsQue.shift()
          if (nextEvent && nextEvent.done) {
            return Promise.resolve({ done: true })
          }
          if (nextEvent) {
            return Promise.resolve({ value: nextEvent, done: false })
          }
          return Promise.resolve({ done: false })
        },
        return() {          
          eventsQue.length = 0
          eventEmitter.removeListener(eventName, pushToQue)
          return Promise.resolve({ value: null, done: true })
        }
      };
    }
  };
}
