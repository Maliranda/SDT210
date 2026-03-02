import Box from '@mui/material/Box'
import type { ReactNode } from 'react'

export interface SpanProps {
  children: ReactNode
  className?: string
}

export function Span({ children, className }: SpanProps) {
  return (
    <Box component="span" className={className}>
      {children}
    </Box>
  )
}
