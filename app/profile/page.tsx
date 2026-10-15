import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'

export default async function ProfilePage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) redirect('/sign-in')
  return <main className="profile-page"><a className="back-link" href="/">← CUSTOMER ARCHIVE</a><span className="eyebrow">AVIATION MASTERS / CUSTOMER PROFILE</span><h1>{session.user.name}</h1><div className="profile-card"><span>REGISTERED CUSTOMER</span><strong>{session.user.email}</strong><small>Member access is active for the Aviation Masters documentary archive.</small></div></main>
}
