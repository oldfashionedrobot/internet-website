import { PropsWithChildren } from 'react'
const COLOR_CLASSES = {
  red: 'border-red bg-background text-red outline-red hover:bg-red hover:text-background active:bg-red active:text-background',
  orange:
    'border-orange bg-background text-orange outline-orange hover:bg-orange hover:text-background active:bg-orange active:text-background',
  yellow:
    'border-yellow bg-background text-yellow outline-yellow hover:bg-yellow hover:text-background active:bg-yellow active:text-background',
  green:
    'border-green bg-background text-green outline-green hover:bg-green hover:text-background active:bg-green active:text-background',
  teal: 'border-teal bg-background text-teal outline-teal hover:bg-teal hover:text-background active:bg-teal active:text-background',
  blue: 'border-blue bg-background text-blue outline-blue hover:bg-blue hover:text-background active:bg-blue active:text-background',
  purple:
    'border-purple bg-background text-purple outline-purple hover:bg-purple hover:text-background active:bg-purple active:text-background',
  pink: 'border-pink bg-background text-pink outline-pink hover:bg-pink hover:text-background active:bg-pink active:text-background',
  black:
    'border-black bg-background text-black outline-black hover:bg-black hover:text-background active:bg-black active:text-background'
} as const

type ButtonProps = PropsWithChildren<{
  color?: keyof typeof COLOR_CLASSES
  className?: string
}>

const BASE_CLASSES =
  'px-3 py-1 rounded border-2 active:outline active:outline-4 m-1'

export function Button({ color, className = '', children }: ButtonProps) {
  return (
    <button
      className={`${BASE_CLASSES} ${COLOR_CLASSES[color ?? 'green']} ${className}`}
    >
      {children}
    </button>
  )
}
