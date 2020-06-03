import {
  watchFile,
  unwatchFile,
  readFileSync,
  writeFileSync
} from 'fs'

import isEqual from 'lodash.isequal'
import differenceWith from 'lodash.differencewith'
import { attachWatcherFunc } from './attachWatcherFunc'
import { removeWatcherFunc } from './removeWatcherFunc'

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

    if (this.watchedCollections[collectionName]) {
      const currentWatchedCollection = this.watchedCollections[collectionName]
      if (addition) {
        const nextAdditionArray = attachWatcherFunc('addition', addition.subName, currentWatchedCollection, addition)
        this.watchedCollections[collectionName] = {
          ...currentWatchedCollection,
          addition: nextAdditionArray,
        }
      }
      if (removal) {
        const nextRemovalArray = attachWatcherFunc('removal', removal.subName, currentWatchedCollection, removal)
        this.watchedCollections[collectionName] = {
          ...currentWatchedCollection,
          removal: nextRemovalArray,
        }
      }
      if (change) {
        const nextChangeArray = attachWatcherFunc('change', change.subName, currentWatchedCollection, change)
        this.watchedCollections[collectionName] = {
          ...currentWatchedCollection,
          change: nextChangeArray,
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
        const nextAdditionArray = attachWatcherFunc('addition', addition.subName, currentWatchedCollection, addition)
        this.watchedCollections[collectionName] = {
          ...currentWatchedCollection,
          addition: nextAdditionArray,
        }
      }
      if (removal) {
        const nextRemovalArray = attachWatcherFunc('removal', removal.subName, currentWatchedCollection, removal)
        this.watchedCollections[collectionName] = {
          ...currentWatchedCollection,
          removal: nextRemovalArray,
        }
      }
      if (change) {
        const nextChangeArray = attachWatcherFunc('change', change.subName, currentWatchedCollection, change)
        this.watchedCollections[collectionName] = {
          ...currentWatchedCollection,
          change: nextChangeArray,
        }
      }
  
      watchFile(filePath, { interval: 300 }, () => {
        const oldContent = this.dbMemoryData[collectionName]
        const newContent = JSON.parse(readFileSync(filePath))
        if (oldContent.length < newContent.length) {
          const addedItem = differenceWith(newContent, oldContent, isEqual)
          console.log('item added:', addedItem);
          
          const { addition } =  this.watchedCollections[collectionName]
          addition.forEach((additionWatcher) => {            
            const { watchers, publish } = additionWatcher
            for (const watcher in watchers) {
              watchers[watcher](addedItem)
            }
            publish()
          })
        } else if (oldContent.length > newContent.length) {
          const removedItem = differenceWith(oldContent, newContent, isEqual)
          console.log('removedItem:', removedItem);

          const { removal } =  this.watchedCollections[collectionName]
          removal.forEach((removalWatcher) => {
            const { watchers, publish } = removalWatcher
            for (const watcher in watchers) {
              watchers[watcher](removedItem)
            }
            publish()
          })
        } else {
          const changedItem = differenceWith(newContent, oldContent, isEqual)
          console.log('changedItem:', changedItem);
        
          const { change } =  this.watchedCollections[collectionName]
          change.forEach((changeWatcher) => {
            const { watchers, publish } = changeWatcher
            for (const watcher in watchers) {
              watchers[watcher](changedItem)
            }
            publish()
          })
        }
        this.dbMemoryData[collectionName] = newContent
      })
    }
  }

  // TODO: when done add to the constructor
  unwatchCollection({ collectionName, subName, connectionId }) {
    // TODO: remove the watch callback by id
    // if no one else needs to watch that file, unwatch it!
    // use unwatchFile(fileName, function to drop)
    console.log({ collectionName, subName, connectionId });
    const collectionToSearch = this.watchedCollections[collectionName]
    
    collectionToSearch.addition = removeWatcherFunc(subName, connectionId, collectionToSearch.addition)
    collectionToSearch.removal = removeWatcherFunc(subName, connectionId, collectionToSearch.removal)
    collectionToSearch.change = removeWatcherFunc(subName, connectionId, collectionToSearch.change)
    if (
      !collectionToSearch.addition.length
      && !collectionToSearch.removal.length
      && !collectionToSearch.change.length
    ) {
      const filePath = `${this.dbPath}/${collectionName}.json`
      unwatchFile(filePath)
      console.log(`${collectionName} was unwatched`);
    }    
  }
}
