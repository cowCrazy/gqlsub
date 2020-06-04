export const newMessageMut = (message) => {
  return JSON.stringify({
    collection: 'messages',
    type: 'mutation',
    query: `
      mutation {
        writer {
          addMessage(message: "${message}") {
            message
          }
        }
      }
    `
  })
}