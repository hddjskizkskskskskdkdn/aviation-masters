'use client'

import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'
import { signIn, signUp } from '@/lib/auth-client'

export function AuthForm({ mode }: { mode: 'sign-in' | 'sign-up' }) {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const isSignUp = mode === 'sign-up'

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setLoading(true); setError('')
    const result = isSignUp ? await signUp.email({ name, email, password }) : await signIn.email({ email, password })
    if (result.error) setError('Unable to authenticate with those details.')
    else { router.push('/'); router.refresh() }
    setLoading(false)
  }

  return <form className="auth-form" onSubmit={submit}>
    {isSignUp && <label>NAME<input required value={name} onChange={e => setName(e.target.value)} autoComplete="name" /></label>}
    <label>EMAIL<input required type="email" value={email} onChange={e => setEmail(e.target.value)} autoComplete="email" /></label>
    <label>PASSWORD<input required minLength={8} type="password" value={password} onChange={e => setPassword(e.target.value)} autoComplete={isSignUp ? 'new-password' : 'current-password'} /></label>
    {error && <p className="auth-error" role="alert">{error}</p>}
    <button className="button primary auth-submit" disabled={loading}>{loading ? 'PLEASE WAIT' : isSignUp ? 'CREATE ACCOUNT' : 'SIGN IN'}</button>
  </form>
}
