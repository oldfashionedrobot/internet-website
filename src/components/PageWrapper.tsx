import { MAIN_NAV } from '@shared/navigation'
import { PropsWithChildren } from 'react'
import { Link } from './Link'

type Props = PropsWithChildren<{
  title: string
}>

export default function PageWrapper({ title, children }: Props) {
  return (
    <div className="p-10">
      <Navigation />
      <hgroup>
        <h1>{title}</h1>
      </hgroup>
      <div>{children}</div>
    </div>
  )
}

const NAV_COLOR = [
  'text-red',
  'text-orange',
  'text-yellow',
  'text-green',
  'text-teal',
  '!text-blue',
  'text-purple',
  'text-pink'
]

function Navigation() {
  return (
    <nav className="flex gap-2 font-black text-2xl">
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
