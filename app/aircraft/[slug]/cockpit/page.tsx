import { notFound, redirect } from 'next/navigation'
import { recordsForCockpit } from '@/lib/cockpit-data'
import CockpitPage from '@/components/cockpit-page'

export default async function AircraftCockpit({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  if (!recordsForCockpit.has(slug)) notFound()
  if (slug === 'f-35-lightning-ii') redirect('/cockpit/f35')
  return <CockpitPage slug={slug} />
}
