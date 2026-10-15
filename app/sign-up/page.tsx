import Link from 'next/link'
import { AuthForm } from '@/components/auth-form'

export default function SignUpPage() {
  return <main className="auth-shell"><div className="auth-card"><Link className="auth-brand" href="/">AM / AVIATION MASTERS</Link><span className="eyebrow">CUSTOMER ARCHIVE / REGISTRATION</span><h1>Join the archive.</h1><p>Create a customer account to access detailed aircraft documentation and reference sheets.</p><AuthForm mode="sign-up" /><span className="auth-switch">Already registered? <Link href="/sign-in">Sign in</Link></span></div></main>
}
