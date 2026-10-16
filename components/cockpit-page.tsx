'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Crosshair, Gauge, Radio, ShieldAlert, Volume2, VolumeX } from 'lucide-react'

const cockpitProfiles: Record<string, { name: string; role: string; mode: string; accent: string; speed: number; altitude: number; threat: string }> = {
  'f-35-lightning-ii': { name: 'F-35 Lightning II', role: 'STEALTH MULTIROLE / SENSOR FUSION', mode: 'AIR DOMINANCE', accent: '#7de9ff', speed: 684, altitude: 32800, threat: 'LOW OBSERVABILITY ACTIVE' },
  'f-22-raptor': { name: 'F-22 Raptor', role: 'AIR SUPERIORITY / SUPERCRUISE', mode: 'INTERCEPT', accent: '#a6ffcf', speed: 918, altitude: 42000, threat: 'BVR TRACKING ACTIVE' },
  'f-a-18-hornet': { name: 'F/A-18 Hornet', role: 'CARRIER MULTIROLE / NAVAL STRIKE', mode: 'CARRIER CAP', accent: '#ffc078', speed: 572, altitude: 18400, threat: 'DECK RECOVERY STANDBY' },
}

const fallback = { name: 'Aircraft Cockpit', role: 'DOCUMENTARY SIMULATION', mode: 'FREE FLIGHT', accent: '#7de9ff', speed: 510, altitude: 24000, threat: 'SYSTEMS NOMINAL' }

export default function CockpitPage({ slug }: { slug: string }) {
  const profile = cockpitProfiles[slug] ?? { ...fallback, name: slug.split('-').map((part) => part[0]?.toUpperCase() + part.slice(1)).join(' ') }
  const [running, setRunning] = useState(false)
  const [sound, setSound] = useState(true)
  const [mode, setMode] = useState(profile.mode)
  const [scan, setScan] = useState(42)
  const [message, setMessage] = useState('SYSTEMS READY · SELECT A MISSION PROFILE')
  const [weather, setWeather] = useState<{ temperature: number; wind: number; visibility: string } | null>(null)
  const [weatherLoading, setWeatherLoading] = useState(false)
  const telemetry = useMemo(() => ({ speed: Math.round(profile.speed + scan * 1.2), altitude: profile.altitude + scan * 12 }), [profile, scan])

  const loadWeather = async () => {
    setWeatherLoading(true)
    try {
      const response = await fetch('https://api.open-meteo.com/v1/forecast?latitude=6.9271&longitude=79.8612&current=temperature_2m,wind_speed_10m,visibility&wind_speed_unit=kn')
      if (!response.ok) throw new Error('weather unavailable')
      const data = await response.json()
      setWeather({ temperature: Math.round(data.current.temperature_2m), wind: Math.round(data.current.wind_speed_10m), visibility: `${Math.round(data.current.visibility / 1000)} KM` })
      setMessage('COLOMBO WEATHER FEED LOADED · MISSION BRIEFING UPDATED')
    } catch {
      setMessage('WEATHER FEED UNAVAILABLE · USE SIMULATION CONDITIONS')
    } finally {
      setWeatherLoading(false)
    }
  }

  useEffect(() => {
    if (!running) return
    const timer = setInterval(() => setScan((value) => (value + 7) % 100), 700)
    return () => clearInterval(timer)
  }, [running])

  const launch = () => {
    setRunning(true)
    setMessage(`${mode} PROFILE ACTIVE · RADAR SWEEP IN PROGRESS`)
  }

  return <main className="cockpit-shell" style={{ '--cockpit-accent': profile.accent } as React.CSSProperties}>
    <header className="cockpit-topbar"><Link href={`/aircraft/${slug}`} className="cockpit-back"><ArrowLeft size={15}/> DOSSIER</Link><div className="cockpit-title"><span>AVIATION MASTERS / COCKPIT LAB</span><b>{profile.name}</b></div><button className="cockpit-sound" onClick={() => setSound(!sound)}>{sound ? <Volume2 size={15}/> : <VolumeX size={15}/>} {sound ? 'AUDIO ON' : 'AUDIO OFF'}</button></header>
    <section className="cockpit-intro"><span className="eyebrow">INTERACTIVE COCKPIT / EDUCATIONAL SIMULATION</span><h1>Enter the <i>flight deck.</i></h1><p>{profile.role}. Explore an aircraft-specific interface inspired by public systems knowledge. This is a fictional, non-operational experience.</p></section>
    <section className="cockpit-grid">
      <aside className="cockpit-sidebar"><div className="cockpit-label">MISSION PROFILE</div><button className={mode === 'FREE FLIGHT' ? 'selected' : ''} onClick={() => setMode('FREE FLIGHT')}>FREE FLIGHT</button><button className={mode === 'INTERCEPT' ? 'selected' : ''} onClick={() => setMode('INTERCEPT')}>INTERCEPT</button><button className={mode === 'RECON' ? 'selected' : ''} onClick={() => setMode('RECON')}>RECON</button><button className={mode === 'CARRIER CAP' ? 'selected' : ''} onClick={() => setMode('CARRIER CAP')}>CARRIER APPROACH</button><button className="launch-cockpit" onClick={launch}><Crosshair size={15}/> {running ? 'MISSION LIVE' : 'INITIALIZE'}</button></aside>
      <div className="hud-screen"><div className="hud-scanline"/><div className="hud-corners"/><div className="hud-status"><span>FLIGHT COMPUTER 01</span><span>{running ? 'LIVE' : 'STANDBY'}</span></div><div className="radar-display"><div className="radar-ring ring-one"/><div className="radar-ring ring-two"/><div className="radar-line" style={{ transform: `rotate(${scan * 3.6}deg)` }}/><div className="radar-blip blip-one"/><div className="radar-blip blip-two"/><Radio size={22}/></div><div className="hud-readout"><span>SPD <b>{telemetry.speed} KT</b></span><span>ALT <b>{telemetry.altitude.toLocaleString()} FT</b></span><span>HDG <b>{String(240 + Math.round(scan)).padStart(3, '0')}°</b></span></div><div className="hud-message">{message}</div></div>
      <aside className="telemetry-panel"><div className="telemetry-card"><Gauge size={18}/><span>AIRSPEED</span><strong>{telemetry.speed}</strong><small>KNOTS / INDICATED</small></div><div className="telemetry-card"><ShieldAlert size={18}/><span>THREAT STATUS</span><strong>01</strong><small>{profile.threat}</small></div><div className="telemetry-card"><Radio size={18}/><span>DATA LINK</span><strong>98%</strong><small>FUSED SENSOR PICTURE</small></div><div className="telemetry-card weather-card"><span>LIVE WEATHER · COLOMBO</span>{weather ? <><strong>{weather.temperature}°C</strong><small>WIND {weather.wind} KT · VIS {weather.visibility}</small></> : <small>FREE OPEN-METEO FEED</small>}<button type="button" onClick={loadWeather} disabled={weatherLoading}>{weatherLoading ? 'LOADING...' : weather ? 'REFRESH FEED' : 'LOAD WEATHER'}</button></div></aside>
    </section>
    <section className="cockpit-log"><span>MISSION EVENT LOG</span><p><b>01:24:08</b> {running ? 'Radar sweep complete. Contact classification updated.' : 'Awaiting pilot input. Select a profile to begin.'}</p><p><b>01:24:12</b> Public capability model loaded for {profile.name}.</p></section>
  </main>
}
