'use server'

import { db } from '@/lib/db'
import { schoolEvents } from '@/lib/db/schema'
import { asc, gte } from 'drizzle-orm'

export async function getSchoolEvents() {
  return db.select().from(schoolEvents).where(gte(schoolEvents.endsAt, new Date())).orderBy(asc(schoolEvents.startsAt))
}
