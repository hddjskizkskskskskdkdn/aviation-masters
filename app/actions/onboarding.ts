'use server'

import { headers } from 'next/headers'
import { cookies } from 'next/headers'
import { eq } from 'drizzle-orm'
import { auth } from '@/lib/auth'
import { db, pool } from '@/lib/db'
import { pilotProfiles } from '@/lib/db/schema'

export type PilotPath = 'military' | 'commercial' | 'helicopter' | 'drone'

const firstFlightFor = (path: PilotPath) => ({ military: 'F-35 Lightning II', commercial: 'C-17 Globemaster III', helicopter: 'AH-64 Apache', drone: 'MQ-9 Reaper' } as const)[path]

async function ensurePilotProfilesTable() {
  await pool.query(`CREATE TABLE IF NOT EXISTS pilot_profiles (id text PRIMARY KEY, user_id text NOT NULL UNIQUE, age integer NOT NULL, path text NOT NULL, first_flight text NOT NULL, created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now())`)
}

export async function getPilotProfile() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) return null
  await ensurePilotProfilesTable()
  const [profile] = await db.select().from(pilotProfiles).where(eq(pilotProfiles.userId, session.user.id)).limit(1)
  return profile ?? null
}

export async function savePilotProfile(age: number, path: PilotPath) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) throw new Error('Please sign in before starting flight school.')
  if (!Number.isInteger(age) || age < 13 || age > 100) throw new Error('Please enter a valid age.')
  if (!['military', 'commercial', 'helicopter', 'drone'].includes(path)) throw new Error('Please choose a pilot path.')
  await ensurePilotProfilesTable()
  const firstFlight = firstFlightFor(path)
  await db.insert(pilotProfiles).values({ id: crypto.randomUUID(), userId: session.user.id, age, path, firstFlight }).onConflictDoUpdate({ target: pilotProfiles.userId, set: { age, path, firstFlight, updatedAt: new Date() } })
  const cookieStore = await cookies()
  cookieStore.set('am_pilot_profile', JSON.stringify({ age, path, firstFlight }), { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', maxAge: 60 * 60 * 24 * 365, path: '/' })
}
