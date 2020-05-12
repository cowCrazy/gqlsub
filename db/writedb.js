import { writeFileSync } from 'fs'

export const writeDB = ({ collection, data }) => {
  const relativePath = `./db/collections/${collection}.json`
  const currentDB = writeFileSync(relativePath, JSON.stringify(data, null, 2))
  console.log('currentDB:', currentDB); 
}
