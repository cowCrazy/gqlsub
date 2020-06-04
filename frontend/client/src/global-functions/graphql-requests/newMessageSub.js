export const newMessageSub = () => {
  return JSON.stringify({
    collection: 'messages',
    type: 'subscription',
    query: `
      subscription {
        newMessageSub {
          id
          message
          date
          edited
        }
      }
    `
  })
}