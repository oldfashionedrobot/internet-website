import { nanoid } from 'nanoid'
import { JSONContent } from '@tiptap/react'

const DB_VERSION = 2
const DB_NAME = 'notes-db'
const STORE_NAME = 'notes'

function logError(error: unknown) {
  console.error('NotesDB Error:', error)
  // You could also send this to an error reporting service
}

export type Note = {
  id: string
  title: string | null
  content: JSONContent
  created: number
  updated: number
}

class NotesDatabase {
  private db: IDBDatabase | null = null

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION)

      request.onerror = () => reject(request.error)
      request.onsuccess = () => {
        this.db = request.result
        resolve()
      }

      request.onupgradeneeded = (event) => {
        try {
          const db = (event.target as IDBOpenDBRequest).result
          const oldVersion = event.oldVersion

          if (!db.objectStoreNames.contains(STORE_NAME)) {
            db.createObjectStore(STORE_NAME, { keyPath: 'id' })
          }

          if (oldVersion === 1) {
            const transaction = (event.target as IDBOpenDBRequest).transaction
            if (!transaction) return

            const store = transaction.objectStore(STORE_NAME)
            
            store.openCursor().onsuccess = (e) => {
              const cursor = (e.target as IDBRequest).result
              if (cursor) {
                const note = cursor.value

                if (typeof note.content === 'string') {
                  const updatedNote = {
                    ...note,
                    title: note.title || null,
                    content: {
                      type: 'doc',
                      content: [{
                        type: 'paragraph',
                        content: [{
                          type: 'text',
                          text: note.content
                        }]
                      }]
                    }
                  }
                  cursor.update(updatedNote)
                }
                cursor.continue()
              }
            }
          }

          resolve()
        } catch (error) {
          logError(error)
          // Optionally, you could delete the database and start fresh
          // indexedDB.deleteDatabase(DB_NAME)
          reject(error)
        }
      }

      request.onblocked = () => {
        alert('Please close all other tabs with this site open')
      }
    })
  }

  async getAllNotes(): Promise<Note[]> {
    if (!this.db) throw new Error('Database not initialized')

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(STORE_NAME, 'readonly')
      const store = transaction.objectStore(STORE_NAME)
      const request = store.getAll()

      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve(request.result)
    })
  }

  async addNote(title: string | null = null): Promise<Note> {
    if (!this.db) throw new Error('Database not initialized')

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(STORE_NAME, 'readwrite')
      const store = transaction.objectStore(STORE_NAME)
      
      const newNote: Note = {
        id: nanoid(),
        title,
        content: {
          type: 'doc',
          content: [{
            type: 'paragraph'
          }]
        },
        created: Date.now(),
        updated: Date.now()
      }

      const request = store.add(newNote)
      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve(newNote)
    })
  }

  async updateNote(id: string, content: JSONContent, title?: string | null): Promise<Note> {
    if (!this.db) throw new Error('Database not initialized')

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(STORE_NAME, 'readwrite')
      const store = transaction.objectStore(STORE_NAME)
      const getRequest = store.get(id)

      getRequest.onerror = () => reject(getRequest.error)
      getRequest.onsuccess = () => {
        const note = getRequest.result
        const updatedNote: Note = {
          ...note,
          title: title ?? note.title,
          content,
          updated: Date.now()
        }

        const putRequest = store.put(updatedNote)
        putRequest.onerror = () => reject(putRequest.error)
        putRequest.onsuccess = () => resolve(updatedNote)
      }
    })
  }

  async deleteNote(id: string): Promise<void> {
    if (!this.db) throw new Error('Database not initialized')

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(STORE_NAME, 'readwrite')
      const store = transaction.objectStore(STORE_NAME)
      const request = store.delete(id)

      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve()
    })
  }
}

// Export a singleton instance
export const notesDb = new NotesDatabase() 