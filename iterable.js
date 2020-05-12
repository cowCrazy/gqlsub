export const createIterable = (eventEmitter, eventName) => {
  return {
    [Symbol.asyncIterator]() {
      const eventsQue = []
      const pushToQue = (payload) => {
        eventsQue.push(payload)
      }
      eventEmitter.addListener(eventName, pushToQue)
      
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
        }
      };
    }
  };
}