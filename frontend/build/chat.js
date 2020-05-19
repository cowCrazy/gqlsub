const ipAddress = 'localhost'
const serverPort = '3000'
let wsConnection

const send = document.querySelector('#send')
const message = document.querySelector('#message')
const result = document.querySelector('#result')
const users = document.querySelector('#users')

const onMessageData = (data) => {
  try {
    const entry = document.createElement('p')
    entry.innerHTML = data.newMessageSub.message
    result.appendChild(entry)
  } catch (e) {
    const { list } = data.reader.messages
    result.innerHTML = null
    list.forEach((item) => {
      const entry = document.createElement('p')
      entry.innerHTML = item.message
      result.appendChild(entry)
    })
  }
}

const onUserData = (data) => {
  try {
    const entry = document.createElement('li')
    entry.innerHTML = data.userStatusSub.user
    users.appendChild(entry)
  } catch (e) {
    const { list } = data.reader.users
    list.forEach((item) => {
      const entry = document.createElement('li')
      entry.innerHTML = item.username
      users.appendChild(entry)
    })
  }
}

const gqlSendMessage = (message) => {
  return JSON.stringify({
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

const wsOnMessage = (msg) => {
  console.log('got ws msg:', msg);
  const data = JSON.parse(msg.data)
  
  if (data.errors) {
    console.log('got error back');
  } else if (data.collection === 'messages') {
    onMessageData(data.data)
  } else if (data.collection === 'users') {
    onUserData(data.data)
  }
}

const wsOnConnection = (initMsg) => {
  console.log('got open msg:', initMsg);
  send.style.backgroundColor = 'green'
  wsConnection.send(JSON.stringify({
    collection: 'users',
    type: 'mutation',
    query: `
      mutation {
        changeUsersStatus(status: "online") {
          message
        }
      }
    `
  }))
  wsConnection.send(JSON.stringify({
    collection: 'messages',
    type: 'subscription',
    query: `
      subscription {
        newMessageSub {
          message
        }
      }
    `
  }))
  wsConnection.send(JSON.stringify({
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
  }))
  wsConnection.send(JSON.stringify({
    collection: 'messages',
    type: 'query',
    query: `
      query {
        reader {
          messages {
            list {
              message
            }
          }
        }
      }
    `
  }))
  wsConnection.send(JSON.stringify({
    collection: 'users',
    type: 'query',
    query: `
      query {
        reader {
          users {
            list {
              username
            }
            count
          }
        }
      }
    `
  }))
}

const unifiedFetch = (body) => {
  return fetch(
    `http://${ipAddress}:${serverPort}/graphql`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body,
    }
  )
    .then(res => res.json())
    .then(res => {
      console.log('res:', res);
      return res
    })
    .catch(err => {
      return err
    })
}

wsConnection = new WebSocket(`ws://${ipAddress}:${serverPort}/subscriptions`)
wsConnection.onopen = wsOnConnection
wsConnection.onmessage = wsOnMessage
wsConnection.onclose = () => {
  console.log('connection closed');  
  send.style.backgroundColor = 'red'
}

send.addEventListener('click', () => {
  wsConnection.send(gqlSendMessage(message.value))
  message.value = ''
})