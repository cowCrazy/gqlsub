
export class PubSub {
  constructor() {
    this.pubsub = {}
  }

  subscribe(name, payload, connection, collection, connectionId) {     
    if (this.pubsub[name]) {
      if (!this.pubsub[name].find(item => item.connectionId === connectionId)) {
        this.pubsub[name].push({
          payload,
          connection,
          collection,
          connectionId
        })
      }
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
          console.log('value to publish:', value);
          
          subscriber.connection.send(JSON.stringify({ ...value, collection: subscriber.collection }))
        })
        .catch((err) => {
          console.error('pub error:', error);
        })
    })
  }

  drop(subName, connectionId) {
    const watchesToRemove = []
    const asyncIteratorToClose = []
    const subNames = Object.keys(this.pubsub)
    console.log({ pubsubBeforeDrop: this.pubsub });
    const pubsubAfterDrop = subNames.reduce((acc, val) => { 
      let itemToDrop   
      const subConnections = this.pubsub[val].filter((item) => {
        let dropMe
        if (subName) {
          dropMe = item.connectionId === connectionId && val === subName
        } else {
          dropMe = item.connectionId === connectionId
        }
        if (dropMe) {
          itemToDrop = item
          asyncIteratorToClose.push({ payload: itemToDrop.payload })
        }
        return !dropMe
      })    
      if (subConnections.length) {
        acc[val] = subConnections
      }
      if (itemToDrop) {        
        watchesToRemove.push({ subName: val, collection: itemToDrop.collection })
      }   
      return acc
    }, {})
    console.log({ pubsubAfterDrop });
    
    this.pubsub = pubsubAfterDrop
    return {
      asyncIteratorToClose,
      watchesToRemove,
    }
  }
}
