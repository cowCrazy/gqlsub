import { PubSub } from './pubsub'
import { JsonDBClient } from './db/JsonDBClient'

export const pubsubClient = new PubSub()
export const dbClient = new JsonDBClient()
