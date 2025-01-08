'use client'

import PageWrapper from '@components/PageWrapper'
import { useEffect, useMemo, useState } from 'react'

const STORAGE_KEY = 'daily-checklist'

enum Checks {
  PLN = 'PLN',
  MED = 'MED',
  EXC = 'EXC',
  SLP = 'SLP',
  EAT = 'EAT',
  ART = 'ART',
  TRY = 'TRY'
}

type DailyChecks = {
  [key in Checks]: boolean
}

type DB = {
  [date: string]: DailyChecks
}

const DEFAULT_CHECKS = Object.values(Checks).reduce((acc, check) => {
  acc[check] = false
  return acc
}, {} as DailyChecks)

export default function Home() {
  const [db, setDb] = useState<DB>()
  const today = useMemo(() => new Date().toLocaleDateString(), [])

  useEffect(() => {
    const storage = localStorage.getItem(STORAGE_KEY)

    if (typeof storage === 'string') {
      try {
        // TODO: validate parsed object, could be valid JSON but not valid DB (zod)
        setDb(JSON.parse(storage))
      } catch {
        // parse failed, initialize
        initDb()
      }
    } else {
      // nothing stored, initialize
      initDb()
    }

    function initDb() {
      setDb({ [today]: DEFAULT_CHECKS })
    }
  }, [])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(db))
  }, [db])

  function handleCheck(check: Checks, isChecked: boolean) {
    if (!db) return

    const updated = {
      ...db,
      [today]: {
        ...db[today],
        [check]: isChecked
      }
    }

    // update storage
    setDb(updated)
  }

  return (
    <PageWrapper title="Home">
      {db && (
        <div className="flex-col items-center">
          <Checklist checklist={db[today]} onCheck={handleCheck} />
          <History db={db} />
        </div>
      )}
    </PageWrapper>
  )
}

function Checklist({
  checklist,
  onCheck
}: {
  checklist: DailyChecks
  onCheck?: (check: Checks, isChecked: boolean) => void
}) {
  return (
    <ul className="inline-flex gap-4">
      {(Object.keys(checklist) as Checks[]).map((key) => {
        const isChecked = checklist[key] === true
        return (
          <li key={key}>
            <label
              htmlFor={key + '_check'}
              className="flex items-center gap-1 font-bold"
            >
              {key}
              {onCheck ? (
                <input
                  type="checkbox"
                  id={key + '_check'}
                  checked={isChecked}
                  onChange={(e) => onCheck?.(key, e.target.checked)}
                />
              ) : isChecked ? (
                '✅'
              ) : (
                '❌'
              )}
            </label>
          </li>
        )
      })}
    </ul>
  )
}

function History({ db }: { db: DB }) {
  return Object.keys(db).map((date) => (
    <div key={date}>
      <h4>{date}</h4>
      <Checklist checklist={db[date]} />
    </div>
  ))
}
