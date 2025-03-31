import { MAIN_NAV } from '@app/shared/constants/navigation.const'
import Link from 'next/link'

const NAV_COLOR = [
  'text-red',
  'text-orange',
  'text-yellow',
  'text-green',
  'text-teal',
  '!text-blue',
  'text-purple',
  'text-pink'
] as const

export function Navigation() {
  return (
    <nav className="flex gap-2 font-black text-2xl m-8">
      {MAIN_NAV.map((item, index) => (
        <Link
          key={item.name + index}
          href={item.path}
          className={'px-1 ' + NAV_COLOR.at(index)}
        >
          {item.name}
        </Link>
      ))}
    </nav>
  )
}
