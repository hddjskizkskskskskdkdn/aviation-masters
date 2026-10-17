'use server'

import { headers } from 'next/headers'
import { and, eq, sql } from 'drizzle-orm'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { flightSessions } from '@/lib/db/schema'

async function getUserId() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) return null
  return session.user.id
}

export async function getTotalFlightHours() {
  const userId = await getUserId()
  if (!userId) return 0
  const [result] = await db.select({ seconds: sql<number>`coalesce(sum(${flightSessions.durationSeconds}), 0)` }).from(flightSessions).where(eq(flightSessions.userId, userId))
  return Number(result?.seconds ?? 0) / 3600
}

export async function saveFlightSession(mission: string, durationSeconds: number) {
  const userId = await getUserId()
  if (!userId) return { saved: false }
  if (!Number.isInteger(durationSeconds) || durationSeconds < 60 || durationSeconds > 86400) return { saved: false }
  await db.insert(flightSessions).values({ id: crypto.randomUUID(), userId, mission, durationSeconds })
  return { saved: true }
}
