import { default as NextLink } from 'next/link'
import { ComponentProps } from 'react'

export function Link({
  className = '',
  children,
  ...restProps
}: ComponentProps<typeof NextLink>) {
  return (
    <NextLink
      className={`text-green hover:underline underline-offset-2 ${className}`}
      {...restProps}
    >
      {children}
    </NextLink>
  )
}
