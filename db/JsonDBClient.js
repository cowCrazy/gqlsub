import {
  watchFile,
  unwatchFile,
  readFileSync,
  writeFileSync
} from 'fs'

import isEqual from 'lodash.isequal'
import differenceWith from 'lodash.differencewith'

export class JsonDBClient {
  constructor() {
    this.dbPath = './db/collections'
    this.dbMemoryData = {}
    this.watchedCollections = {}
  }

  readCollection(collectionName) {    
    if (this.dbMemoryData[collectionName] && this.watchedCollections[collectionName]) {      
      return this.dbMemoryData[collectionName]
    }
    const filePath = `${this.dbPath}/${collectionName}.json`
    return JSON.parse(readFileSync(filePath))
  }

  writeCollection(collectionName, data) {
    console.log('writing');
    const filePath = `${this.dbPath}/${collectionName}.json`
    writeFileSync(filePath, JSON.stringify(data, null, 2))
  }

  watchCollection(collectionName, { addition, removal, change }) {
    // TODO: need to have a call back attached with id to each watch callback function
    // so later on it can be tracked and remove
    if (this.watchedCollections[collectionName]) {
      // TODO: code duplication of assign watcherFunction to the collection
      // reduce to one occurrence 
      const currentWatchedCollection = this.watchedCollections[collectionName]
      if (addition) {
        this.watchedCollections[collectionName] = {
          ...currentWatchedCollection,
          addition: [...currentWatchedCollection.addition, addition],
        }
      }
      if (removal) {
        this.watchedCollections[collectionName] = {
          ...currentWatchedCollection,
          removal: [...currentWatchedCollection.removal, removal],
        }
      }
      if (change) {
        this.watchedCollections[collectionName] = {
          ...currentWatchedCollection,
          change: [...currentWatchedCollection.change, change],
        }
      }
    } else {
      console.log('starting to watch:', collectionName, { addition });
      const filePath = `${this.dbPath}/${collectionName}.json`
      const watchStartData = this.readCollection(collectionName)
      this.dbMemoryData[collectionName] = watchStartData
      this.watchedCollections[collectionName] = {
        collectionName,
        addition: [],
        removal: [],
        change: [],
      }
      const currentWatchedCollection = this.watchedCollections[collectionName]

      if (addition) {
        this.watchedCollections[collectionName] = {
          ...currentWatchedCollection,
          addition: [...currentWatchedCollection.addition, addition],
        }
      }
      if (removal) {
        this.watchedCollections[collectionName] = {
          ...currentWatchedCollection,
          removal: [...currentWatchedCollection.removal, removal],
        }
      }
      if (change) {
        this.watchedCollections[collectionName] = {
          ...currentWatchedCollection,
          change: [...currentWatchedCollection.change, change],
        }
      }
  
      const watchProcess = watchFile(filePath, { interval: 300 }, () => {
        console.log('changed:', collectionName)
        const oldContent = this.dbMemoryData[collectionName]
        const newContent = JSON.parse(readFileSync(filePath))
        if (oldContent.length < newContent.length) {
          const addedItem = differenceWith(newContent, oldContent, isEqual)
          console.log('addition:', addedItem)
          this.watchedCollections[collectionName].addition.forEach((func) => func())
        } else if (oldContent.length > newContent.length) {
          const removedItem = differenceWith(oldContent, newContent, isEqual)
          console.log('removal:', removedItem)
          this.watchedCollections[collectionName].removal.forEach((func) => func())
        } else {
          const changedItem = differenceWith(newContent, oldContent, isEqual)
          console.log('change:', changedItem)
          this.watchedCollections[collectionName].change.forEach((func) => func())
        }
        this.dbMemoryData[collectionName] = newContent
      })
    }
  }

  // TODO: when done add to the constructor
  unwatchCollection(collectionName, watchActionId) {
    // TODO: remove the watch callback by id
    // if no one else needs to watch that file, unwatch it!
    // use unwatchFile(fileName, function to drop)
  }
}
