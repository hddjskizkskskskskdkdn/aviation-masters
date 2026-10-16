import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { auth } from '@/lib/auth'
import { pool } from '@/lib/db'

const scores: Record<string, number> = {'F-35 Lightning II':88,'F-22 Raptor':96,'F-16 Fighting Falcon':78,'F-14 Tomcat':76,'Su-57 Felon':90,'Su-35 Flanker-E':84,'MiG-29 Fulcrum':72,'Eurofighter Typhoon':87}
const id = () => crypto.randomUUID()
const code = () => Math.random().toString(36).slice(2,8).toUpperCase()

async function currentUser() {
  const session = await auth.api.getSession({ headers: await headers() })
  return session?.user ?? null
}

export async function GET(request: Request) {
  const user = await currentUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const roomCode = new URL(request.url).searchParams.get('code')
  if (!roomCode) return NextResponse.json({ error: 'Room code required' }, { status: 400 })
  const result = await pool.query('SELECT * FROM battle_rooms WHERE code = $1', [roomCode.toUpperCase()])
  if (!result.rows[0]) return NextResponse.json({ error: 'Room not found' }, { status: 404 })
  return NextResponse.json({ room: result.rows[0], currentUserId: user.id })
}

export async function POST(request: Request) {
  const user = await currentUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await request.json()
  const action = body.action as string
  if (action === 'create') {
    const room = await pool.query('INSERT INTO battle_rooms (id, code, host_user_id, host_aircraft, host_count) VALUES ($1,$2,$3,$4,$5) RETURNING *', [id(), code(), user.id, body.aircraft, Math.max(1, Math.min(12, Number(body.count) || 1))])
    return NextResponse.json({ room: room.rows[0], currentUserId: user.id })
  }
  const roomCode = String(body.code || '').toUpperCase()
  const existing = await pool.query('SELECT * FROM battle_rooms WHERE code = $1', [roomCode])
  const room = existing.rows[0]
  if (!room) return NextResponse.json({ error: 'Room not found' }, { status: 404 })
  if (action === 'join') {
    if (room.host_user_id === user.id || room.guest_user_id) return NextResponse.json({ error: 'Room is unavailable' }, { status: 409 })
    const updated = await pool.query('UPDATE battle_rooms SET guest_user_id=$1, guest_aircraft=$2, guest_count=$3, status=\'readying\', updated_at=now() WHERE code=$4 RETURNING *', [user.id, body.aircraft, Math.max(1, Math.min(12, Number(body.count) || 1)), roomCode])
    return NextResponse.json({ room: updated.rows[0], currentUserId: user.id })
  }
  if (![room.host_user_id, room.guest_user_id].includes(user.id)) return NextResponse.json({ error: 'Not a room player' }, { status: 403 })
  const side = user.id === room.host_user_id ? 'host' : 'guest'
  if (action === 'update') {
    const field = side === 'host' ? 'host_aircraft' : 'guest_aircraft'; const countField = side === 'host' ? 'host_count' : 'guest_count'
    const updated = await pool.query(`UPDATE battle_rooms SET ${field}=$1, ${countField}=$2, updated_at=now() WHERE code=$3 RETURNING *`, [body.aircraft, Math.max(1, Math.min(12, Number(body.count) || 1)), roomCode])
    return NextResponse.json({ room: updated.rows[0], currentUserId: user.id })
  }
  if (action === 'ready') {
    const readyField = side === 'host' ? 'host_ready' : 'guest_ready'
    const updated = await pool.query(`UPDATE battle_rooms SET ${readyField}=true, status='ready', updated_at=now() WHERE code=$1 RETURNING *`, [roomCode])
    return NextResponse.json({ room: updated.rows[0], currentUserId: user.id })
  }
  if (action === 'battle') {
    if (!room.host_ready || !room.guest_ready) return NextResponse.json({ error: 'Both players must be ready' }, { status: 409 })
    const hostScore = (scores[room.host_aircraft] || 70) * room.host_count; const guestScore = (scores[room.guest_aircraft] || 70) * room.guest_count; const winner = hostScore === guestScore ? 'DRAW' : hostScore > guestScore ? 'TEAM A' : 'TEAM B'
    const updated = await pool.query('UPDATE battle_rooms SET status=\'complete\', winner=$1, host_score=$2, guest_score=$3, updated_at=now() WHERE code=$4 RETURNING *', [winner, hostScore, guestScore, roomCode])
    return NextResponse.json({ room: updated.rows[0], currentUserId: user.id })
  }
  return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
}
