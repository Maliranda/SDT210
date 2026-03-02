import { Link as RouterLink, type LinkProps } from 'react-router-dom'
import Link from '@mui/material/Link'
import type { ReactNode } from 'react'

export interface AppLinkProps extends Omit<LinkProps, 'children'> {
  children: ReactNode
  className?: string
}

export function AppLink({ children, className, ...linkProps }: AppLinkProps) {
  return (
    <Link component={RouterLink} className={className} underline="hover" color="secondary" {...linkProps}>
      {children}
    </Link>
  )
}
