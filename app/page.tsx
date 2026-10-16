import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { cookies } from 'next/headers'
import ArchivePage from '@/components/archive-page'
import type { PilotPath } from '@/app/actions/onboarding'

export default async function Page() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) redirect('/sign-in')
  const stored = (await cookies()).get('am_pilot_profile')?.value
  let pilotProfile: { age: number; path: PilotPath; firstFlight: string } | null = null
  if (stored) {
    try { pilotProfile = JSON.parse(stored) } catch { pilotProfile = null }
  }
  return <ArchivePage userName={session.user.name} pilotProfile={pilotProfile ?? undefined} />
}
