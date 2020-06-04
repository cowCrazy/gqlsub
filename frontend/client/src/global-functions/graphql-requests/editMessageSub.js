export const editMessageSub = () => {
  return JSON.stringify({
    collection: 'messages',
    type: 'subscription',
    query: `
      subscription {
        editMessageSub {
          id
          message
          edited
        }
      }
    `
  })
}