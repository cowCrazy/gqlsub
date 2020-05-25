
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

  publish(name, payload) {
    const subscribers = this.pubsub[name]  
    subscribers.forEach((subscriber) => {
      subscriber.payload.next()
        .then((res) => {
          console.log('pubres:', res);
          const { value } = res  
          subscriber.connection.send(JSON.stringify({ ...value, collection: subscriber.collection }))
        })
        .catch((err) => {
          console.error('pub error:', error);
        })
    })
  }

  drop(connectionId) {
    const watchesToRemove = []
    const subNames = Object.keys(this.pubsub)
    this.pubsub = subNames.reduce((acc, val, idx) => { 
      let collectionToDrop   
      const subConnections = this.pubsub[val].filter((item) => {
        const dropMe = item.connectionId !== connectionId
        if (!dropMe) {
          collectionToDrop = item.collection
        }
        return dropMe
      })    
      if (subConnections.length) {
        acc[val] = subConnections
      } else {        
        watchesToRemove.push({ subName: val, collection: collectionToDrop })
      }
      return acc
    }, {})
    return watchesToRemove
  }
}
