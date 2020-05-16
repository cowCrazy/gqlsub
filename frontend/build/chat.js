const ipAddress = 'localhost'
let wsConnection
const send = document.querySelector('#send')
const message = document.querySelector('#message')
const result = document.querySelector('#result')

const gqlChatHistory = JSON.stringify({
  query: `{
    reader {
      messages {
        list {
          message
        }
      }
    }
  }`
})

const gqlSendMessage = (message) => {
  return JSON.stringify({
    query: `mutation {
      writer {
        addMessage(message: "${message}") {
          message
        }
      }
    }`
  })
}

const wsOnMessage = (msg) => {
  console.log('got normal msg:', msg);
  const data = JSON.parse(msg.data)
  const entry = document.createElement('p')
  entry.innerHTML = data.value.data.newMessageSub.message
  result.appendChild(entry)
}

const wsOnConnection = (initMsg) => {
  console.log('got open msg:', initMsg);
  send.style.backgroundColor = 'green'
  wsConnection.send(JSON.stringify({
    query: `
      subscription {
        newMessageSub {
          message
        }
      }
    `
  }))
}

const unifiedFetch = (body) => {
  return fetch(
    `http://${ipAddress}:3000/graphql`,
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

unifiedFetch(gqlChatHistory)
  .then((res) => {
    const { list } = res.data.reader.messages
    result.innerHTML = null
    list.forEach((item) => {
      const entry = document.createElement('p')
      entry.innerHTML = item.message
      result.appendChild(entry)
    })
    wsConnection = new WebSocket(`ws://${ipAddress}:3000/subscriptions`)
    wsConnection.onopen = wsOnConnection
    wsConnection.onmessage = wsOnMessage
  })
  .catch((err) => {
    console.log('failed to fetch')
    console.log(err)
  })

send.addEventListener('click', () => {
  console.log('clicked');
  unifiedFetch(gqlSendMessage(message.value))
    .then((res) => {
      message.value = ''
    })
    .catch((err) => {
      console.log('send message error')
      console.log(err)
    })
})