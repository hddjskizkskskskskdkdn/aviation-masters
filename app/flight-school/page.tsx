import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { getPilotProfile, type PilotPath } from '@/app/actions/onboarding'
import CategoryPage from '@/components/category-page'

export default async function FlightSchoolPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) redirect('/sign-in')

  const profile = await getPilotProfile()
  const type = profile?.path === 'helicopter' ? 'helicopters' : profile?.path === 'drone' ? 'drones' : 'aircraft'

  return <CategoryPage type={type} userName={session.user.name} />
}
