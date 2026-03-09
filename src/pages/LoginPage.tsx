import { useState } from 'react'
import { getAuthInstance, isFirebaseConfigured } from '../lib/firebase'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth'
import Box from '@mui/material/Box'
import {
  PageLayout,
  Heading,
  Text,
  Section,
  Form,
  Input,
  Button,
  FormField,
} from '../components/ui'

type Tab = 'signin' | 'signup'

export default function LoginPage() {
  const [tab, setTab] = useState<Tab>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const auth = getAuthInstance()

  if (!isFirebaseConfigured() || !auth) {
    return (
      <PageLayout>
        <Heading level={1}>Login</Heading>
        <Text>Firebase is not configured. Add VITE_FIREBASE_* env variables to enable login.</Text>
      </PageLayout>
    )
  }

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    if (!email.trim() || !password) {
      setError('Enter email and password.')
      return
    }
    setLoading(true)
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Sign in failed.'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    if (!email.trim() || !password) {
      setError('Enter email and password.')
      return
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }
    setLoading(true)
    try {
      await createUserWithEmailAndPassword(auth, email.trim(), password)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Sign up failed.'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <PageLayout>
      <Heading level={1}>Vocabulary Builder</Heading>
      <Text>Sign in or create an account to sync your vocabulary across devices.</Text>

      <Section title={tab === 'signin' ? 'Sign in' : 'Create account'}>
        <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
          <Button
            variant={tab === 'signin' ? 'primary' : 'secondary'}
            onClick={() => { setTab('signin'); setError(null); }}
          >
            Sign in
          </Button>
          <Button
            variant={tab === 'signup' ? 'primary' : 'secondary'}
            onClick={() => { setTab('signup'); setError(null); }}
          >
            Sign up
          </Button>
        </Box>

        {error && (
          <Box sx={{ p: 1, mb: 1, borderRadius: 1, bgcolor: 'error.light', color: 'error.dark' }}>
            <Text>{error}</Text>
          </Box>
        )}

        {tab === 'signin' ? (
          <Form onSubmit={handleSignIn}>
            <FormField label="Email:">
              <Input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                style={{ minWidth: 220 }}
              />
            </FormField>
            <FormField label="Password:">
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                style={{ minWidth: 220 }}
              />
            </FormField>
            <Button type="submit" disabled={loading}>
              {loading ? 'Signing in…' : 'Sign in'}
            </Button>
          </Form>
        ) : (
          <Form onSubmit={handleSignUp}>
            <FormField label="Email:">
              <Input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                style={{ minWidth: 220 }}
              />
            </FormField>
            <FormField label="Password:">
              <Input
                type="password"
                placeholder="At least 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
                style={{ minWidth: 220 }}
              />
            </FormField>
            <FormField label="Confirm password:">
              <Input
                type="password"
                placeholder="Repeat password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                autoComplete="new-password"
                style={{ minWidth: 220 }}
              />
            </FormField>
            <Button type="submit" disabled={loading}>
              {loading ? 'Creating account…' : 'Sign up'}
            </Button>
          </Form>
        )}
      </Section>
    </PageLayout>
  )
}
