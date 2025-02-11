'use client'

import PageWrapper from '@shared/components/PageWrapper'
import { useEffect, useMemo, useState } from 'react'

const STORAGE_KEY = 'daily-checklist'

// Time periods
enum Period {
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY',
  MONTHLY = 'MONTHLY',
  QUARTERLY = 'QUARTERLY',
  YEARLY = 'YEARLY'
}

// Daily checks
enum DailyChecks {
  MEDS = 'MEDS',
  CHORES = 'CHORES',
  JOB = 'JOB',
  DUG_WALK = 'DUG_WALK',
  DUG_BEDTIME = 'DUG_BEDTIME',
  DUG_TRAINING = 'DUG_TRAINING',
  PLN = 'PLN',
  MED = 'MED',
  EXC = 'EXC',
  SLP = 'SLP',
  EAT = 'EAT',
  ART = 'ART',
  TRY = 'TRY'
}

// Weekly checks
enum WeeklyChecks {
  READ = 'READ',
  DUG_BRUSH = 'DUG_BRUSH',
  MEAL_PLAN = 'MEAL_PLAN',
  SPRINT_PLAN = 'SPRINT_PLAN',
  HOME = 'HOME',
  FRIENDS = 'FRIENDS',
  FAMILY = 'FAMILY',
  COUSINS = 'COUSINS',
  DATE = 'DATE'
}

// Monthly checks
enum MonthlyChecks {
  FINANCE = 'FINANCE',
  LOAN = 'LOAN',
  STOCK = 'STOCK',
  DUG_GROOM = 'DUG_GROOM',
  DUG_MEDS = 'DUG_MEDS'
}

// Quarterly checks
enum QuarterlyChecks {
  SHRUBS = 'SHRUBS',
  TAXES = 'TAXES',
  FILTER = 'FILTER'
}

// Yearly checks
enum YearlyChecks {
  DOCTOR = 'DOCTOR'
}

type CheckList = {
  [Period.DAILY]: { [key in DailyChecks]: boolean }
  [Period.WEEKLY]: { [key in WeeklyChecks]: boolean }
  [Period.MONTHLY]: { [key in MonthlyChecks]: boolean }
  [Period.QUARTERLY]: { [key in QuarterlyChecks]: boolean }
  [Period.YEARLY]: { [key in YearlyChecks]: boolean }
}

type DB = {
  [date: string]: CheckList
}

const DEFAULT_CHECKS: CheckList = {
  [Period.DAILY]: Object.values(DailyChecks).reduce(
    (acc, check) => {
      acc[check] = false
      return acc
    },
    {} as { [key in DailyChecks]: boolean }
  ),
  [Period.WEEKLY]: Object.values(WeeklyChecks).reduce(
    (acc, check) => {
      acc[check] = false
      return acc
    },
    {} as { [key in WeeklyChecks]: boolean }
  ),
  [Period.MONTHLY]: Object.values(MonthlyChecks).reduce(
    (acc, check) => {
      acc[check] = false
      return acc
    },
    {} as { [key in MonthlyChecks]: boolean }
  ),
  [Period.QUARTERLY]: Object.values(QuarterlyChecks).reduce(
    (acc, check) => {
      acc[check] = false
      return acc
    },
    {} as { [key in QuarterlyChecks]: boolean }
  ),
  [Period.YEARLY]: Object.values(YearlyChecks).reduce(
    (acc, check) => {
      acc[check] = false
      return acc
    },
    {} as { [key in YearlyChecks]: boolean }
  )
}

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
      setDb({
        [today]: {
          [Period.DAILY]: DEFAULT_CHECKS[Period.DAILY],
          [Period.WEEKLY]: DEFAULT_CHECKS[Period.WEEKLY],
          [Period.MONTHLY]: DEFAULT_CHECKS[Period.MONTHLY],
          [Period.QUARTERLY]: DEFAULT_CHECKS[Period.QUARTERLY],
          [Period.YEARLY]: DEFAULT_CHECKS[Period.YEARLY]
        }
      })
    }
  }, [])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(db))
  }, [db])

  function handleCheck(period: Period, check: string, isChecked: boolean) {
    if (!db) return

    const updated = {
      ...db,
      [today]: {
        ...db[today],
        [period]: {
          ...db[today][period],
          [check]: isChecked
        }
      }
    }

    setDb(updated)
  }

  return (
    <PageWrapper title="Checks">
      {db && (
        <div className="flex-col items-center">
          {Object.values(Period).map((period) => (
            <Checklist
              key={period}
              period={period}
              checklist={db[today][period]}
              onCheck={handleCheck}
            />
          ))}
          <History db={db} />
        </div>
      )}
    </PageWrapper>
  )
}

function Checklist({
  checklist,
  period,
  onCheck
}: {
  checklist: CheckList[keyof CheckList]
  period: Period
  onCheck?: (period: Period, check: string, isChecked: boolean) => void
}) {
  const getEmoji = (check: string) => {
    const emojiMap: { [key: string]: string } = {
      DUG_WALK: '🐶',
      DUG_BEDTIME: '🐶',
      DUG_TRAINING: '🐶',
      PLN: '📜',
      MED: '🧠',
      EXC: '💪🏾',
      SLP: '🛏️',
      EAT: '🥦',
      ART: '🎨',
      TRY: '🧞‍♂️',
      READ: '📚',
      HOME: '🏡',
      FAMILY: '👨‍👩‍👧‍👦',
      DATE: '❤️',
      FINANCE: '💰',
      LOAN: '💳',
      DOCTOR: '👨‍⚕️'
    }
    return emojiMap[check] || ''
  }

  return (
    <div className="mb-6">
      <h3 className="mb-2">{period}</h3>
      <ul className="flex flex-wrap gap-4">
        {Object.entries(checklist).map(([key, isChecked]) => (
          <li key={key}>
            <label
              htmlFor={key + '_check'}
              className="flex items-center gap-1 font-bold"
            >
              {getEmoji(key)} {key.replace(/_/g, ' ')}
              {onCheck ? (
                <input
                  type="checkbox"
                  id={key + '_check'}
                  checked={isChecked}
                  onChange={(e) => onCheck?.(period, key, e.target.checked)}
                />
              ) : isChecked ? (
                '✅'
              ) : (
                '❌'
              )}
            </label>
          </li>
        ))}
      </ul>
    </div>
  )
}

function History({ db }: { db: DB }) {
  return Object.keys(db).map((date) => (
    <div key={date}>
      <h4>{date}</h4>
      <Checklist period={Period.DAILY} checklist={db[date][Period.DAILY]} />
    </div>
  ))
}
