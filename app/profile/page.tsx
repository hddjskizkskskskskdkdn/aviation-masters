import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { getPilotProfile } from '@/app/actions/onboarding'

const rankForPath = { military: 'Student Pilot / Trainee', commercial: 'Student Pilot / Trainee', helicopter: 'Student Pilot / Trainee', drone: 'Student Pilot / Trainee' } as const
const pathLabels = { military: 'Military pilot', commercial: 'Commercial pilot', helicopter: 'Helicopter pilot', drone: 'Drone pilot' } as const

export default async function ProfilePage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) redirect('/sign-in')
  const pilotProfile = await getPilotProfile()
  const path = pilotProfile?.path as keyof typeof pathLabels | undefined
  return <main className="profile-page"><a className="back-link" href="/">← CUSTOMER ARCHIVE</a><span className="eyebrow">AVIATION MASTERS / CUSTOMER PROFILE</span><h1>{session.user.name}</h1><div className="rank-card"><span>CURRENT FLIGHT SCHOOL RANK</span><strong>{path ? rankForPath[path] : 'Student Pilot / Trainee'}</strong><small>{path ? `${pathLabels[path]} path · Plain badge / no stripes` : 'Complete your pilot intake to begin training.'}</small><div className="rank-progress" aria-label="Rank progress"><i /></div></div><div className="profile-card"><span>REGISTERED CUSTOMER</span><strong>{session.user.email}</strong><small>Member access is active for the Aviation Masters documentary archive.</small></div></main>
}
