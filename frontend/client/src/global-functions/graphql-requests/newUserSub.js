export const newUserSub = () => {
  return JSON.stringify({
    collection: 'users',
    type: 'subscription',
    query: `
      subscription {
        newUserSub {
          id
          username
          status
        }
      }
    `
  })
}