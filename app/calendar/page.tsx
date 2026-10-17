import SchoolCalendar from '@/components/school-calendar'
import { getSchoolEvents } from '@/app/actions/calendar'

export const dynamic = 'force-dynamic'

export default async function CalendarPage() {
  const events = await getSchoolEvents()
  return <SchoolCalendar events={events} />
}
