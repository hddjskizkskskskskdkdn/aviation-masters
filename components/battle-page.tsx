'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { Volume2, VolumeX, Swords } from 'lucide-react'

const aircraft = [
  { name: 'F-35 Lightning II', role: 'Stealth multirole fighter', score: 92 },
  { name: 'F-22 Raptor', role: 'Air-superiority fighter', score: 96 },
  { name: 'F-16 Fighting Falcon', role: 'Multirole fighter', score: 78 },
  { name: 'F-14 Tomcat', role: 'Fleet-defense interceptor', score: 72 },
  { name: 'Su-57 Felon', role: 'Stealth multirole fighter', score: 89 },
  { name: 'Su-35 Flanker-E', role: 'Air-superiority fighter', score: 82 },
  { name: 'MiG-29 Fulcrum', role: 'Air-defense fighter', score: 69 },
  { name: 'Eurofighter Typhoon', role: 'Air-superiority fighter', score: 90 },
]

const phases = [
  ['MISSION BRIEFING', 'A contested air corridor. Both pilots receive the same intelligence picture.'],
  ['RADAR CONTACT', 'Long-range sensors acquire the opposing formation beyond visual range.'],
  ['POSITIONING', 'Both jets trade altitude and angle. Low observability and sensor fusion shape the first move.'],
  ['ENGAGEMENT', 'The merge begins. Countermeasures flare as the fighters enter the threat envelope.'],
  ['DOGFIGHT', 'Visual range combat. Energy, agility and pilot positioning decide the turning fight.'],
  ['DEBRIEF', 'The mission result is calculated from the selected aircraft, fleet size and scenario conditions.'],
]

function playTone(enabled: boolean, frequency = 440, duration = 0.08) {
  if (!enabled || typeof window === 'undefined') return
  const context = new AudioContext()
  const oscillator = context.createOscillator()
  const gain = context.createGain()
  oscillator.frequency.value = frequency
  oscillator.type = 'sawtooth'
  gain.gain.setValueAtTime(0.04, context.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + duration)
  oscillator.connect(gain).connect(context.destination)
  oscillator.start()
  oscillator.stop(context.currentTime + duration)
}

export default function BattlePage({ userName }: { userName: string }) {
  const [teamA, setTeamA] = useState('F-35 Lightning II')
  const [teamB, setTeamB] = useState('Su-57 Felon')
  const [countA, setCountA] = useState(2)
  const [countB, setCountB] = useState(2)
  const [phase, setPhase] = useState(-1)
  const [progress, setProgress] = useState(0)
  const [result, setResult] = useState<string | null>(null)
  const [sound, setSound] = useState(true)
  const timer = useRef<ReturnType<typeof setInterval> | null>(null)
  const fighterA = useMemo(() => aircraft.find(item => item.name === teamA)!, [teamA])
  const fighterB = useMemo(() => aircraft.find(item => item.name === teamB)!, [teamB])
  const running = phase >= 0 && !result

  useEffect(() => () => { if (timer.current) clearInterval(timer.current) }, [])

  const startBattle = () => {
    if (timer.current) clearInterval(timer.current)
    setResult(null); setPhase(0); setProgress(0); playTone(sound, 180, .16)
    let tick = 0
    timer.current = setInterval(() => {
      tick += 2
      setProgress(tick)
      const nextPhase = Math.min(phases.length - 1, Math.floor(tick / (100 / phases.length)))
      setPhase(nextPhase)
      playTone(sound, 260 + nextPhase * 70, .04)
      if (tick >= 100) {
        if (timer.current) clearInterval(timer.current)
        const scoreA = fighterA.score * countA + Math.round(Math.random() * 10)
        const scoreB = fighterB.score * countB + Math.round(Math.random() * 10)
        setResult(scoreA === scoreB ? 'DRAW — BOTH TEAMS DISENGAGED' : scoreA > scoreB ? `TEAM A WINS — ${teamA}` : `TEAM B WINS — ${teamB}`)
        playTone(sound, scoreA === scoreB ? 330 : scoreA > scoreB ? 660 : 220, .35)
      }
    }, 120)
  }

  return <main className="battle-shell"><header className="topbar"><a className="brand" href="/"><span className="brand-mark">AM</span><span>AVIATION <b>MASTERS</b></span></a><nav className="primary-nav"><a href="/category/aircraft">Military Aircrafts</a><a href="/category/helicopters">Military Helicopters</a><a href="/category/tanks">Military Tanks</a><a href="/category/ships">Military Ships</a><a href="/category/drones">Military Drones</a><a className="active-nav" href="/battle">Battle</a></nav><a className="profile-trigger" href="/profile">{userName}</a></header>
    <section className="battle-hero"><span className="eyebrow">SOLO COMBAT SIMULATOR</span><h1>Jet <i>combat.</i></h1><p>Set up a fictional one-player air engagement. Watch the mission unfold from radar contact to the final debrief.</p><div className="solo-note"><strong>HOW IT WORKS</strong><span>Select two jets, choose fleet sizes, then launch the cinematic simulation. No room code or opponent required.</span></div></section>
    <section className="battle-board solo-board"><JetCard label="TEAM A / BLUE FORCE" selected={teamA} count={countA} disabled={running} onJet={setTeamA} onCount={setCountA}/><div className="versus"><span>VS</span><button className="sound-toggle" onClick={() => setSound(value => !value)}>{sound ? <Volume2 size={15}/> : <VolumeX size={15}/>} {sound ? 'AUDIO ON' : 'AUDIO OFF'}</button></div><JetCard label="TEAM B / RED FORCE" selected={teamB} count={countB} disabled={running} onJet={setTeamB} onCount={setCountB}/></section>
    <section className="room-controls solo-controls"><p>{running ? `${phases[phase][0]} · ${phases[phase][1]}` : result ? 'Simulation complete. Review the tactical debrief below.' : 'Ready when you are, pilot.'}</p><button className="battle-primary" disabled={running} onClick={startBattle}><Swords size={15}/> {result ? 'RUN AGAIN' : 'LAUNCH SIMULATION'}</button></section>
    {running && <section className="simulation-panel" aria-live="polite"><div className="progress-ring" style={{ '--progress': `${progress * 3.6}deg` } as React.CSSProperties}><span>{progress}%</span></div><div><span className="eyebrow">LIVE MISSION FEED</span><h2>{phases[phase][0]}</h2><p>{phases[phase][1]}</p></div><div className="mission-feed">{phases.slice(0, phase + 1).map(([title, text], index) => <p className={index === phase ? 'current' : ''} key={title}><b>0{index + 1}</b>{title}<small>{text}</small></p>)}</div></section>}
    {result && <section className="battle-result" aria-live="polite"><span className="eyebrow">FINAL DEBRIEF</span><h2>{result}</h2><p>{teamA} fielded {countA} unit{countA > 1 ? 's' : ''}; {teamB} fielded {countB} unit{countB > 1 ? 's' : ''}. The outcome uses a fictional educational model based on public capability context and fleet size—not a real combat prediction.</p></section>}
  </main>
}

function JetCard({ label, selected, count, disabled, onJet, onCount }: { label: string; selected: string; count: number; disabled: boolean; onJet: (value: string) => void; onCount: (value: number) => void }) { return <article className="team-card"><div className="team-card-head"><span>{label}</span><span>{disabled ? 'IN FLIGHT' : 'SELECT'}</span></div><label>JET PLATFORM<select value={selected} disabled={disabled} onChange={event => onJet(event.target.value)}>{aircraft.map(item => <option key={item.name}>{item.name}</option>)}</select></label><label>FLEET SIZE<input type="number" min="1" max="6" value={count} disabled={disabled} onChange={event => onCount(Math.max(1, Math.min(6, Number(event.target.value) || 1)))}/></label><div className="team-role">{count} × {aircraft.find(item => item.name === selected)?.role}</div></article> }
EOF
