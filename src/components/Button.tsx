import { PropsWithChildren } from 'react'

type ButtonProps = PropsWithChildren<{
  className?: string
}>

export function Button({ className = '', children }: ButtonProps) {
  return (
    <button
      className={`bg-green text-black px-3 py-1 transition-colors duration-100
        hover:bg-black hover:text-green hover:outline-1 hover:outline
        active:text-green active:bg-black active:outline-4 ${className}`}
    >
      {children}
    </button>
  )
}
