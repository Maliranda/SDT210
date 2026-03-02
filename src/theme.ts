import { createTheme } from '@mui/material/styles'

export const theme = createTheme({
  palette: {
    primary: { main: '#1a1a2e' },
    secondary: { main: '#a8d8ea' },
    error: { main: '#b91c1c' },
  },
  typography: {
    fontFamily: 'system-ui, -apple-system, sans-serif',
  },
})
