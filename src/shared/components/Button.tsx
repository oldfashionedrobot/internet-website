import { PropsWithChildren } from 'react'

const COLOR_CLASSES = {
  red: 'border-red bg-background text-red hover:bg-red hover:text-background active:bg-red active:text-white active:outline-red',
  orange:
    'border-orange bg-background text-orange hover:bg-orange hover:text-background active:bg-orange active:text-background active:outline-orange',
  yellow:
    'border-yellow bg-background text-yellow hover:bg-yellow hover:text-background active:bg-yellow active:text-background active:outline-yellow',
  green:
    'border-green bg-background text-green hover:bg-green hover:text-background active:bg-green active:text-background active:outline-green',
  teal: 'border-teal bg-background text-teal hover:bg-teal hover:text-background active:bg-teal active:text-background active:outline-teal',
  blue: 'border-blue bg-background text-blue hover:bg-blue hover:text-background active:bg-blue active:text-background active:outline-blue',
  purple:
    'border-purple bg-background text-purple hover:bg-purple hover:text-background active:bg-purple active:text-background active:outline-purple',
  pink: 'border-pink bg-background text-pink hover:bg-pink hover:text-background active:bg-pink active:text-background active:outline-pink',
  contrast:
    'border-foreground bg-background text-foreground hover:bg-foreground hover:text-background active:bg-foreground active:text-background active:outline-foreground'
} as const

type ButtonProps = PropsWithChildren<{
  color?: keyof typeof COLOR_CLASSES
  className?: string
}>

const BASE_CLASSES =
  'px-3 py-1 rounded border-2 active:outline active:outline-4'

export function Button({ color, className = '', children }: ButtonProps) {
  return (
    <button
      className={`${BASE_CLASSES} ${COLOR_CLASSES[color ?? 'green']} ${className}`}
    >
      {children}
    </button>
  )
}
