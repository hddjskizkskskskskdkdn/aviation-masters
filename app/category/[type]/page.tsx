import { headers } from 'next/headers'
import { redirect, notFound } from 'next/navigation'
import { auth } from '@/lib/auth'
import CategoryPage from '@/components/category-page'

const types = ['aircraft','helicopters','tanks','ships','drones'] as const
export default async function Page({ params }: { params: Promise<{ type: string }> }) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) redirect('/sign-in')
  const { type } = await params
  if (!types.includes(type as typeof types[number])) notFound()
  return <CategoryPage type={type as typeof types[number]} userName={session.user.name} />
}
