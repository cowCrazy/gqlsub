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
    // if (this.dbMemoryData[collectionName] && this.watchedCollections[collectionName]) {      
    //   return this.dbMemoryData[collectionName]
    // }
    const filePath = `${this.dbPath}/${collectionName}.json`
    return JSON.parse(readFileSync(filePath))
  }

  writeCollection(collectionName, data) {
    const filePath = `${this.dbPath}/${collectionName}.json`
    writeFileSync(filePath, JSON.stringify(data, null, 2))
  }

  watchCollection(collectionName, { addition, removal, change }) {
    console.log('started a watch process:', collectionName, { addition, removal, change });
    
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
  
      watchFile(filePath, { interval: 300 }, () => {
        const oldContent = this.dbMemoryData[collectionName]
        const newContent = JSON.parse(readFileSync(filePath))
        console.log({
          oldContent,
          newContent,
        })
        if (oldContent.length < newContent.length) {
          const addedItem = differenceWith(newContent, oldContent, isEqual)
          console.log('item added:', addedItem);
          
          this.watchedCollections[collectionName].addition.forEach((watcher) => {            
            watcher.func(addedItem)
          })
        } else if (oldContent.length > newContent.length) {
          const removedItem = differenceWith(oldContent, newContent, isEqual)
          console.log('removedItem:', removedItem);

          this.watchedCollections[collectionName].removal.forEach((watcher) => watcher.func(removedItem))
        } else {
          const changedItem = differenceWith(newContent, oldContent, isEqual)
          console.log('changedItem:', changedItem);
          
          this.watchedCollections[collectionName].change.forEach((watcher) => watcher.func(changedItem))
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
    console.log({ collectionName, watchActionId });
    const collectionToSearch = this.watchedCollections[collectionName]
    this.watchedCollections[collectionName].addition = collectionToSearch.addition.filter(watcher => watcher.subName !== watchActionId)
    this.watchedCollections[collectionName].removal = collectionToSearch.removal.filter(watcher => watcher.subName !== watchActionId)
    this.watchedCollections[collectionName].change = collectionToSearch.change.filter(watcher => watcher.subName !== watchActionId)
    if (!this.watchedCollections[collectionName].addition.length && !this.watchedCollections[collectionName].removal.length && !this.watchedCollections[collectionName].change.length) {
      const filePath = `${this.dbPath}/${collectionName}.json`
      unwatchFile(filePath)
      console.log(`${collectionName} was unwatched`);
    }    
  }
}
