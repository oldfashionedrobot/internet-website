import { PropsWithChildren } from 'react'

type Props = PropsWithChildren<{
  title: string
}>

export default function PageWrapper({ title, children }: Props) {
  return (
    <div className="m-8">
      <hgroup>
        <h1>{title}</h1>
      </hgroup>
      <div>{children}</div>
    </div>
  )
}
