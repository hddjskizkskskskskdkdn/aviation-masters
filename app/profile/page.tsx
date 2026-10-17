import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { getPilotProfile } from '@/app/actions/onboarding'
import { getTotalFlightHours } from '@/app/actions/flight-hours'

const rankForPath = { military: 'Student Pilot / Trainee', commercial: 'Student Pilot / Trainee', helicopter: 'Student Pilot / Trainee', drone: 'Student Pilot / Trainee' } as const
const pathLabels = { military: 'Military pilot', commercial: 'Commercial pilot', helicopter: 'Helicopter pilot', drone: 'Drone pilot' } as const

export default async function ProfilePage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) redirect('/sign-in')
  const pilotProfile = await getPilotProfile()
  const totalFlightHours = await getTotalFlightHours()
  const path = pilotProfile?.path as keyof typeof pathLabels | undefined
  return <main className="profile-page"><a className="back-link" href="/">← CUSTOMER ARCHIVE</a><span className="eyebrow">AVIATION MASTERS / CUSTOMER PROFILE</span><h1>{session.user.name}</h1><div className="rank-card"><span>CURRENT FLIGHT SCHOOL RANK</span><strong>{path ? rankForPath[path] : 'Student Pilot / Trainee'}</strong><small>{path ? `${pathLabels[path]} path · Plain badge / no stripes` : 'Complete your pilot intake to begin training.'}</small><div className="rank-progress" aria-label="Rank progress"><i /></div></div><div className="profile-notification" role="status"><span>FLIGHT SCHOOL NOTIFICATION</span><strong>{totalFlightHours > 0 ? 'Training record updated' : 'Welcome to Aviation Masters Flight School'}</strong><small>{totalFlightHours > 0 ? 'Your latest simulator time has been added to your pilot record.' : 'Complete your first 60-second simulator session to start your official flight log.'}</small></div><div className="profile-card"><span>REGISTERED CUSTOMER</span><strong>{session.user.email}</strong><small>Member access is active for the Aviation Masters documentary archive.</small></div><div className="profile-card profile-hours-card"><span>TOTAL FLYING HOURS</span><strong>{totalFlightHours.toFixed(1)} <small>HRS</small></strong><small>Signed-in simulator sessions recorded in your Aviation Masters flight log.</small></div><div className="profile-card profile-calendar-card"><span>FLIGHT SCHOOL SCHEDULE</span><strong>Training calendar</strong><small>View briefings, simulator labs, assessments and scheduled flight training.</small><a className="profile-calendar-link" href="/calendar">OPEN FLIGHT CALENDAR →</a></div></main>
}
