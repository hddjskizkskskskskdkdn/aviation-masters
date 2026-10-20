'use client'

import { useMemo, useState } from 'react'
import { ComposableMap, Geographies, Geography, Marker } from 'react-simple-maps'
import { ArrowUpRight, Crosshair, MapPin, Shield, Waves } from 'lucide-react'

const geoUrl = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json'

const missions = [
  { id: 'arctic', name: 'ARCTIC WATCH', region: 'Northern training range', x: -42, y: 70, type: 'Reconnaissance', environment: 'Extreme cold', aircraft: ['DRONE', 'MULTIROLE JET'], difficulty: '02 / 05', icon: Crosshair },
  { id: 'atlantic', name: 'COASTAL GUARDIAN', region: 'North Atlantic sector', x: -24, y: 42, type: 'Maritime patrol', environment: 'Open water', aircraft: ['HELICOPTER', 'MULTIROLE JET'], difficulty: '03 / 05', icon: Waves },
  { id: 'sahara', name: 'DESERT RELAY', region: 'Saharan training zone', x: 12, y: 24, type: 'Long-range logistics', environment: 'Arid terrain', aircraft: ['TRANSPORT', 'DRONE'], difficulty: '02 / 05', icon: Shield },
  { id: 'himalaya', name: 'MOUNTAIN RESCUE', region: 'High-altitude corridor', x: 78, y: 31, type: 'Search and rescue', environment: 'High altitude', aircraft: ['HELICOPTER', 'DRONE'], difficulty: '04 / 05', icon: MapPin },
  { id: 'pacific', name: 'PACIFIC SHIELD', region: 'Western Pacific sector', x: 150, y: 34, type: 'Fleet protection', environment: 'Open ocean', aircraft: ['FIGHTER JET', 'MULTIROLE JET'], difficulty: '05 / 05', icon: Shield },
]

export default function MissionMap() {
  const [selectedId, setSelectedId] = useState(missions[1].id)
  const [aircraft, setAircraft] = useState('ALL AIRCRAFT')
  const selected = missions.find((mission) => mission.id === selectedId) ?? missions[0]
  const aircraftOptions = ['ALL AIRCRAFT', ...Array.from(new Set(missions.flatMap((mission) => mission.aircraft)))]
  const visibleMissions = useMemo(() => aircraft === 'ALL AIRCRAFT' ? missions : missions.filter((mission) => mission.aircraft.includes(aircraft)), [aircraft])

  return <main className="app-shell mission-page">
    <header className="topbar"><a className="brand" href="/"><span className="brand-mark">AM</span><span>AVIATION <b>MASTERS</b></span></a><nav className="primary-nav"><a href="/">ARCHIVE</a><a className="active" href="/missions">MISSIONS</a><a href="/calendar">CALENDAR</a><a href="/profile">PROFILE</a></nav></header>
    <section className="mission-hero"><div><span className="eyebrow">03 / MISSION CONTROL</span><h1>Choose your <i>theatre.</i></h1><p>Explore fictional training areas and match your selected aircraft to the mission profile. Every zone is designed for education and simulation—not real-world operations.</p></div><div className="mission-status"><span>ACTIVE THEATRES</span><strong>{visibleMissions.length.toString().padStart(2, '0')}</strong><small>AVAILABLE FOR TRAINING</small></div></section>
    <div className="mission-toolbar"><label htmlFor="aircraft-filter">AIRCRAFT FILTER</label><select id="aircraft-filter" value={aircraft} onChange={(event) => setAircraft(event.target.value)}>{aircraftOptions.map((option) => <option key={option}>{option}</option>)}</select><span className="map-note">FICTIONAL TRAINING MAP / 2026</span></div>
    <section className="mission-layout"><div className="mission-map-card"><ComposableMap projection="geoEqualEarth" projectionConfig={{ scale: 145, center: [8, 8] }} aria-label="World map showing fictional Aviation Masters mission areas"><Geographies geography={geoUrl}>{({ geographies }) => geographies.map((geo) => <Geography key={geo.rsmKey} geography={geo} className="mission-country" />)}</Geographies>{visibleMissions.map((mission) => <Marker key={mission.id} coordinates={[mission.x, mission.y]}><button type="button" className={`mission-marker ${selectedId === mission.id ? 'selected' : ''}`} aria-label={`Select ${mission.name}`} onClick={() => setSelectedId(mission.id)}><span><mission.icon /></span></button></Marker>)}</ComposableMap><div className="map-legend"><span><i className="legend-dot"/> TRAINING ZONE</span><span><i className="legend-line"/> AIRCRAFT MATCH</span></div></div><aside className="mission-detail"><span className="eyebrow">MISSION BRIEFING / {selected.difficulty}</span><h2>{selected.name}</h2><p className="mission-region">{selected.region}</p><div className="mission-detail-grid"><div><span>MISSION TYPE</span><strong>{selected.type}</strong></div><div><span>ENVIRONMENT</span><strong>{selected.environment}</strong></div></div><div className="mission-match"><span>RECOMMENDED AIRCRAFT</span><div>{selected.aircraft.map((item) => <b key={item}>{item}</b>)}</div><small>Selected aircraft suitability is based on the fictional training brief.</small></div><button className="button primary" type="button">OPEN MISSION BRIEFING <ArrowUpRight size={16}/></button></aside></section>
  </main>
}
