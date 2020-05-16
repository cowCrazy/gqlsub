const pubsub = {}

export const publishPubSub = (name) => {
  const subscribers = pubsub[name]
  console.log('subscribers:', subscribers);
  
  subscribers.forEach((subscriber) => {
    subscriber.payload.next()
      .then((res) => {          
        subscriber.connection.send(JSON.stringify(res))
      })
      .catch((err) => {
        console.log('pub error:', error);
      })
  })
}

export const subscribePubSub = (name, payload, connection) => {
  console.log('saving payload:', payload);
  
  if (pubsub[name]) {
    pubsub[name].push({
      payload,
      connection,
    })
  } else {
    pubsub[name] = [{
      payload,
      connection,
    }]
  }
}
