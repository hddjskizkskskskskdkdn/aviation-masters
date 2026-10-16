'use server'

import { cookies } from 'next/headers'

export type PilotPath = 'military' | 'commercial' | 'helicopter' | 'drone'

export async function savePilotProfile(age: number, path: PilotPath) {
  if (!Number.isInteger(age) || age < 13 || age > 100) throw new Error('Please enter a valid age.')
  const allowed: PilotPath[] = ['military', 'commercial', 'helicopter', 'drone']
  if (!allowed.includes(path)) throw new Error('Please choose a pilot path.')
  const cookieStore = await cookies()
  cookieStore.set('am_pilot_profile', JSON.stringify({ age, path, firstFlight: firstFlightFor(path) }), {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 365,
    path: '/',
  })
}

function firstFlightFor(path: PilotPath) {
  return ({
    military: 'F-35 Lightning II',
    commercial: 'C-17 Globemaster III',
    helicopter: 'AH-64 Apache',
    drone: 'MQ-9 Reaper',
  } as const)[path]
}
