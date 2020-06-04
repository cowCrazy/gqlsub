export const editMessageMut = (id, message) => {
  return JSON.stringify({
    collection: 'messages',
    type: 'mutation',
    query: `
      mutation {
        writer {
          editMessage(id: "${id}", message: "${message}") {
            id
            message
          }
        }
      }
    `
  })
}