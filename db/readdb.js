import { readFileSync } from 'fs'

export const readDB = ({ collection }) => {
  const relativePath = `./db/collections/${collection}.json`
  return JSON.parse(readFileSync(relativePath))
}
