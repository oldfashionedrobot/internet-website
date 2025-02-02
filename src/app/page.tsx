'use client'

import { Button } from '@components/Button'
import PageWrapper from '@components/PageWrapper'
import { useEffect, useState } from 'react'

const DB_VERSION = 4
const DB_NAME = 'db'

export default function HomePage() {
  const [database, setDatabase] = useState<IDBDatabase>()

  useEffect(() => {
    const req = indexedDB.open(DB_NAME, DB_VERSION)

    req.onsuccess = function (e) {
      callback.call(this, e)

      const db = this.result

      db.onversionchange = function () {
        db.close()
        alert('Database is outdated, please reload the page.')
      }

      db.onabort = db.onclose = db.onerror = callback.bind(db)

      setDatabase(db)
    }

    req.onerror = function (e) {
      callback.call(this, e)
      indexedDB.deleteDatabase(DB_NAME)
      alert('Old database, daleted')
    }

    req.onupgradeneeded = function (e) {
      callback.call(this, e)
      console.log('Upgrading DB')
      const db = this.result

      if (!db.objectStoreNames.contains('books')) {
        // if there's no "books" store
        db.createObjectStore('books', { keyPath: 'id' }) // create it
      }
    }

    req.onblocked = callback.bind(req)

    function callback(this: IDBRequest | IDBDatabase, e: Event) {
      console.log(e.type, this)
    }

    return () => {
      req.onsuccess = req.onerror = req.onblocked = req.onupgradeneeded = null
      database?.close()
    }
  }, [])

  return (
    <PageWrapper title="Home">
      <Button color="green">Click</Button>
    </PageWrapper>
  )
}
