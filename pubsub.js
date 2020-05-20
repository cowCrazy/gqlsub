
export class PubSub {
  constructor() {
    this.pubsub = {}
  }

  subscribe(name, payload, connection, collection, connectionId) {  
    if (this.pubsub[name]) {
      this.pubsub[name].push({
        payload,
        connection,
        collection,
        connectionId
      })
    } else {
      this.pubsub[name] = [{
        payload,
        connection,
        collection,
        connectionId
      }]
    }
  }

  publish(name) {
    const subscribers = this.pubsub[name]  
    subscribers.forEach((subscriber) => {
      subscriber.payload.next()
        .then((res) => {        
          const { value } = res  
          subscriber.connection.send(JSON.stringify({ ...value, collection: subscriber.collection }))
        })
        .catch((err) => {
          console.error('pub error:', error);
        })
    })
  }

  drop(connectionId) {
    const subNames = Object.keys(this.pubsub)
    this.pubsub = subNames.reduce((acc, val, idx) => {    
      const subConnections = this.pubsub[val].filter((item) => item.connectionId !== connectionId)    
      if (subConnections.length) {
        acc[val] = subConnections
      }
      return acc
    }, {})
  }
}
