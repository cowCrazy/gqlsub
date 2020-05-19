const pubsub = {}

export const publishPubSub = (name) => {
  const subscribers = pubsub[name]  
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

export const subscribePubSub = (name, payload, connection, collection) => {  
  if (pubsub[name]) {
    pubsub[name].push({
      payload,
      connection,
      collection
    })
  } else {
    pubsub[name] = [{
      payload,
      connection,
      collection
    }]
  }
}
