export const messagesQue = () => {
  return JSON.stringify({
    collection: 'messages',
    type: 'query',
    query: `
      query {
        reader {
          messages {
            list {
              id
              message
              date
              edited
            }
          }
        }
      }
    `
  })
}