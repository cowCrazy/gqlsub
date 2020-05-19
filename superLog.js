/* eslint-disable */
const path = require('path')

////////
// attaching '__stack' to the global scope
////////
Object.defineProperty(global, '__stack', {
  get: function(){
    const orig = Error.prepareStackTrace
    Error.prepareStackTrace = function(_, stack){ return stack }
    const err = new Error
    Error.captureStackTrace(err, arguments.callee)
    const { stack } = err
    Error.prepareStackTrace = orig
    return stack
  }
})

const customizedConsole = {
  log: console.log,
  warn: console.warn,
  error: console.error,
  info: console.info,
}

const getPosition = (myStack) => {
  return `${path.relative(process.cwd(), myStack.getFileName())}:${myStack.getLineNumber()}`
}

const printPos = (myPos) => {
  process.stdout.write('\x1b[35m')
  process.stdout.write(`${myPos} `)
  process.stdout.write('\x1b[0m')
}

const getTime = () => {
  return new Date().toLocaleString()
}

const printTime = (myTime) => {
  process.stdout.write('\x1b[34m')
  process.stdout.write(`${myTime} `)
  process.stdout.write('\x1b[0m')
}

global.console.log = (...value) => {
  const myTime = getTime()
  const myPos = getPosition(__stack[1])
  printTime(myTime)
  printPos(myPos)
  customizedConsole.log(...value)
}

global.console.success = (...value) => {
  const myTime = getTime()
  const myPos = getPosition(__stack[1])
  printTime(myTime)
  printPos(myPos)
  customizedConsole.log('\x1b[32m', ...value, '\x1b[0m')
}

global.console.warn = (...value) => {
  const myTime = getTime()
  const myPos = getPosition(__stack[1])
  printTime(myTime)
  printPos(myPos)
  customizedConsole.warn('\x1b[33m', ...value, '\x1b[0m')
}

global.console.error = (...value) => {
  const myTime = getTime()
  const myPos = getPosition(__stack[1])
  printTime(myTime)
  printPos(myPos)
  customizedConsole.error('\x1b[31m', ...value, '\x1b[0m')
}

global.console.info = (...value) => {
  const myTime = getTime()
  const myPos = getPosition(__stack[1])
  printTime(myTime)
  printPos(myPos)
  customizedConsole.error('\x1b[36m', ...value, '\x1b[0m')
}