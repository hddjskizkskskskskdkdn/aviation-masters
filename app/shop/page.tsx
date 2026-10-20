import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import ShopClient from '@/components/shop-client'

function studentId(userId: string) { return `AM-${userId.replace(/[^a-zA-Z0-9]/g, '').slice(-8).toUpperCase().padStart(8, '0')}` }

export default async function ShopPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) redirect('/sign-in')
  return <ShopClient studentId={studentId(session.user.id)} />
}
