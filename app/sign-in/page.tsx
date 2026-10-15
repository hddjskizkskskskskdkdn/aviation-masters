import Link from 'next/link'
import { AuthForm } from '@/components/auth-form'

export default function SignInPage() {
  return <main className="auth-shell"><div className="auth-card"><Link className="auth-brand" href="/">AM / AVIATION MASTERS</Link><span className="eyebrow">CUSTOMER ARCHIVE / ACCESS</span><h1>Welcome back.</h1><p>Sign in to continue exploring the Aviation Masters documentary archive.</p><AuthForm mode="sign-in" /><span className="auth-switch">New customer? <Link href="/sign-up">Create an account</Link></span></div></main>
}
