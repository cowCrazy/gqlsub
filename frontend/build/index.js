let wsConnection

const query = document.querySelector('#query')
const mutation = document.querySelector('#mutation')
const send = document.querySelector('#send')
const gqlString = document.querySelector('#gqlString')
const result = document.querySelector('#result')

const connect = document.querySelector('#connect')
connect.addEventListener('click', () => {
  console.log('connecting to ws');
  
  wsConnection = new WebSocket(`ws://localhost:3000/subscriptions`)
  wsConnection.onopen = (initMsg) => {
    console.log('got open msg:', initMsg);
    connect.style.backgroundColor = 'green'
  }

  wsConnection.onmessage = (msg) => {
    console.log('got normal msg:', msg);
    const data = JSON.parse(msg.data)
    const entry = document.createElement('p')
    entry.innerHTML = data.data.newMessageSub.message
    result.appendChild(entry)
  }
})

const subscribe = document.querySelector('#subscribe')
subscribe.addEventListener('click', () => {
  wsConnection.send(JSON.stringify({
    query: `
      subscription {
        newMessageSub {
          message
        }
      }
    `
  }))
})

query.addEventListener('click', () => {
  gqlString.value = `
    {
      reader {
        messages {
          list {
            message
          }
        }
      }
    }
  `
})

mutation.addEventListener('click', () => {
  gqlString.value = `
    mutation {
      writer {
        addMessage(message: "test message") {
          message
        }
      }
    }
  `
})

send.addEventListener('click', () => {
  console.log('clicked');
  const queryString = gqlString.value
  // query.value = JSON.stringify(queryString, null, 4)

  fetch(
    'http://localhost:3000/graphql',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: queryString
      })
    }
  )
    .then(res => res.json())
    .then(res => {
      console.log('res:', res);
      try {
        const { list } = res.data.reader.messages
        result.innerHTML = null
        list.forEach((item) => {
          const entry = document.createElement('p')
          entry.innerHTML = item.message
          result.appendChild(entry)
        })
      } catch (err) {
        console.log('not a query:', err)
      }
    })
    .catch(err => {
      console.log('err:', err);
    })
})