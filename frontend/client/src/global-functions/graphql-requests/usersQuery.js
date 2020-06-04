export const usersQue = () => {
  return JSON.stringify({
    collection: 'users',
    type: 'query',
    query: `
      {
        reader {
          users {
            list {
              id
              username
              status
            }
          }
        }
      }
    `
  })
}