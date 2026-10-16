import { notFound } from 'next/navigation'
import { recordsForCockpit } from '@/lib/cockpit-data'
import CockpitPage from '@/components/cockpit-page'

export default async function AircraftCockpit({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  if (!recordsForCockpit.has(slug)) notFound()
  return <CockpitPage slug={slug} />
}
