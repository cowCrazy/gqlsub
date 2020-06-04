export const usersStatusSub = () => {
  return JSON.stringify({
    collection: 'users',
    type: 'subscription',
    query: `
      subscription {
        usersStatusSub {
          id
          username
          status
        }
      }
    `
  })
}