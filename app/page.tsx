import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import ArchivePage from '@/components/archive-page'
import { getPilotProfile, type PilotPath } from '@/app/actions/onboarding'

export default async function Page() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) redirect('/sign-in')
  const stored = await getPilotProfile()
  const pilotProfile = stored ? { age: stored.age, path: stored.path as PilotPath, firstFlight: stored.firstFlight } : undefined
  return <ArchivePage userName={session.user.name} pilotProfile={pilotProfile} />
}
