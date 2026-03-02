import MuiListItem from '@mui/material/ListItem'
import type { ReactNode } from 'react'

export interface ListItemProps {
  children: ReactNode
  className?: string
}

export function ListItem({ children, className }: ListItemProps) {
  return (
    <MuiListItem
      className={className}
      disablePadding
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 1,
        py: 0.5,
        borderBottom: '1px solid',
        borderColor: 'divider',
        '&:last-of-type': { borderBottom: 'none' },
      }}
    >
      {children}
    </MuiListItem>
  )
}
