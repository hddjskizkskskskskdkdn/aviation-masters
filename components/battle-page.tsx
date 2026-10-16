'use client'

import { useMemo, useState } from 'react'
import { ChevronDown, Crosshair, Swords } from 'lucide-react'

const aircraft = [
  { name: 'F-35 Lightning II', score: 88, role: 'Stealth multirole' },
  { name: 'F-22 Raptor', score: 96, role: 'Air superiority' },
  { name: 'F-16 Fighting Falcon', score: 78, role: 'Multirole fighter' },
  { name: 'F-14 Tomcat', score: 76, role: 'Fleet defense' },
  { name: 'Su-57 Felon', score: 90, role: 'Stealth multirole' },
  { name: 'Su-35 Flanker-E', score: 84, role: 'Air superiority' },
  { name: 'MiG-29 Fulcrum', score: 72, role: 'Air superiority' },
  { name: 'Eurofighter Typhoon', score: 87, role: 'Multirole fighter' },
]

const initialTeam = (name: string) => ({ name, aircraft: [aircraft[0].name] })

export default function BattlePage({ userName }: { userName: string }) {
  const [teamA, setTeamA] = useState(initialTeam('TEAM A'))
  const [teamB, setTeamB] = useState({ name: 'TEAM B', aircraft: ['Su-57 Felon'] })
  const [countA, setCountA] = useState(2)
  const [countB, setCountB] = useState(3)
  const [result, setResult] = useState<string | null>(null)

  const buildRoster = (selected: string, count: number) => Array.from({ length: count }, () => selected)
  const total = (roster: string[]) => roster.reduce((sum, name) => sum + (aircraft.find((entry) => entry.name === name)?.score ?? 0), 0)
  const selectedA = teamA.aircraft[0]
  const selectedB = teamB.aircraft[0]
  const winner = useMemo(() => {
    const a = total(buildRoster(selectedA, countA))
    const b = total(buildRoster(selectedB, countB))
    return a === b ? 'DRAW' : a > b ? 'TEAM A' : 'TEAM B'
  }, [selectedA, selectedB, countA, countB])

  const runBattle = () => {
    const aScore = total(buildRoster(selectedA, countA))
    const bScore = total(buildRoster(selectedB, countB))
    setResult(`${winner} wins the scenario — Team A ${aScore} / Team B ${bScore}`)
  }

  const updateTeam = (side: 'A' | 'B', value: string) => {
    if (side === 'A') setTeamA({ ...teamA, aircraft: [value] })
    else setTeamB({ ...teamB, aircraft: [value] })
    setResult(null)
  }

  return <main className="battle-shell"><header className="topbar"><a className="brand" href="/"><span className="brand-mark">AM</span><span>AVIATION <b>MASTERS</b></span></a><nav className="primary-nav"><a href="/category/aircraft">Military Aircrafts</a><a href="/category/helicopters">Military Helicopters</a><a href="/category/tanks">Military Tanks</a><a href="/category/ships">Military Ships</a><a href="/category/drones">Military Drones</a><a className="active-nav" href="/battle">Battle</a></nav><div className="profile-menu"><a className="profile-trigger" href="/profile">{userName}</a></div></header>
    <section className="battle-hero"><span className="eyebrow">AVIATION MASTERS / SCENARIO LAB</span><h1>Battle <i>brief.</i></h1><p>Build a fictional, data-led comparison between two teams. This is an educational scoring model, not a prediction of real combat outcomes.</p></section>
    <section className="battle-board"><TeamCard label="TEAM A" team={teamA} count={countA} onAircraft={(value) => updateTeam('A', value)} onCount={setCountA}/><div className="versus"><Swords size={22}/><span>VS</span><button type="button" onClick={runBattle}><Crosshair size={15}/> RUN BATTLE</button></div><TeamCard label="TEAM B" team={teamB} count={countB} onAircraft={(value) => updateTeam('B', value)} onCount={setCountB}/></section>
    <section className="battle-result" aria-live="polite"><span className="eyebrow">OUTCOME / DATA MODEL</span>{result ? <><h2>{result.split(' — ')[0]}</h2><p>{result.split(' — ')[1]}. The model weights documented platform capability scores and fleet count only.</p></> : <p>Select aircraft, set fleet counts, then run the scenario.</p>}</section>
  </main>
}

function TeamCard({ label, team, count, onAircraft, onCount }: { label: string; team: { name: string; aircraft: string[] }; count: number; onAircraft: (value: string) => void; onCount: (value: number) => void }) {
  return <article className="team-card"><div className="team-card-head"><span>{label}</span><ChevronDown size={16}/></div><label>PLATFORM<select value={team.aircraft[0]} onChange={(event) => onAircraft(event.target.value)}>{aircraft.map((entry) => <option key={entry.name}>{entry.name}</option>)}</select></label><label>FLEET COUNT<input type="number" min="1" max="12" value={count} onChange={(event) => onCount(Math.max(1, Math.min(12, Number(event.target.value) || 1)))}/></label><div className="team-role">{aircraft.find((entry) => entry.name === team.aircraft[0])?.role}</div><div className="roster-line">{Array.from({ length: count }, (_, index) => <span key={index}>{index + 1}</span>)}</div></article>
}
