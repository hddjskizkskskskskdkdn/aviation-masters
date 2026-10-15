'use client'

import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Float, ContactShadows, Environment } from '@react-three/drei'
import { useMemo, useRef, useState } from 'react'
import { Search, LockKeyhole, ArrowUpRight, Play, SlidersHorizontal, X, Rotate3D } from 'lucide-react'
import * as THREE from 'three'

const posters = {
  'F-47 NGAD': 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG-20261015-WA5374-4KMhWTQA9nLirwFelO6vEhgEyKfZ9c.jpg',
  'J-36': 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG-20261015-WA6833-oFHUtvM2kJerZGuQREO7VNQ6vl8pHt.jpg',
  'F/A-XX': 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG-20261015-WA9361-euf33IXGghdp8SLHrIR6Rfh3MOko6M.jpg',
  'SR-71 Blackbird': 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG-20261015-WA7806-LfKjQrwvHYrNDtpA9TbVJNoDe1HEhh.jpg',
  'AC-130 Gunship': 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG-20261015-WA8165-bsuFBulPKqoI8K8Z8KjzjoQFiPzcae.jpg',
}

const aircraft = [
  ['F-35 Lightning II','STEALTH / MULTIROLE','USA'],['F-22 Raptor','AIR SUPERIORITY','USA'],['F/A-18 Hornet','CARRIER MULTIROLE','USA'],['F-16 Fighting Falcon','MULTIROLE FIGHTER','USA'],['F-14 Tomcat','FLEET DEFENSE','USA'],['F-15EX Eagle II','AIR SUPERIORITY','USA'],['MiG-29 Fulcrum','AIR SUPERIORITY','RUSSIA'],['Su-35 Flanker-E','AIR SUPERIORITY','RUSSIA'],['Su-57 Felon','STEALTH / MULTIROLE','RUSSIA'],['Eurofighter Typhoon','SWING-ROLE','EUROPE'],['Dassault Rafale','OMNIROLE FIGHTER','FRANCE'],['A-10 Thunderbolt II','CLOSE AIR SUPPORT','USA'],['SR-71 Blackbird','RECONNAISSANCE','USA'],['B-2 Spirit','STEALTH BOMBER','USA'],['B-21 Raider','STEALTH BOMBER','USA'],['B-52 Stratofortress','STRATEGIC BOMBER','USA'],['Tu-160 Blackjack','STRATEGIC BOMBER','RUSSIA'],['C-17 Globemaster III','AIRLIFT','USA'],['C-5M Super Galaxy','AIRLIFT','USA'],['AC-130 Gunship','CLOSE AIR SUPPORT','USA'],['J-36','NEXT-GEN / CONCEPT','CHINA'],['F/A-XX','CARRIER NEXT-GEN','USA'],['F-47 NGAD','NEXT-GEN AIR DOMINANCE','USA'],['Su-47 Berkut','TECHNOLOGY DEMONSTRATOR','RUSSIA'],
]

function AircraftModel({ spin = true }: { spin?: boolean }) {
  const group = useRef<THREE.Group>(null)
  useFrame((_, delta) => { if (spin && group.current) group.current.rotation.y += delta * 0.22 })
  return <group ref={group} rotation={[0.1, -0.55, 0.06]} scale={1.35}>
    <mesh castShadow><boxGeometry args={[3.7, .34, .62]} /><meshStandardMaterial color="#aeb8c4" metalness={.8} roughness={.22} /></mesh>
    <mesh castShadow position={[.4,0,0]} rotation={[0,0,Math.PI / 2]}><coneGeometry args={[.38, 1.4, 4]} /><meshStandardMaterial color="#8795a4" metalness={.75} roughness={.25} /></mesh>
    <mesh castShadow position={[-1.2,.05,0]}><coneGeometry args={[.3, 1.4, 4]} /><meshStandardMaterial color="#c3ccd5" metalness={.8} roughness={.2} /></mesh>
    <mesh castShadow position={[-.2,0,0]} rotation={[0,0,Math.PI / 2]}><coneGeometry args={[.72, 2.4, 4]} /><meshStandardMaterial color="#667584" metalness={.78} roughness={.3} /></mesh>
    <mesh castShadow position={[1.22,.25,0]} rotation={[0,0,.35]}><boxGeometry args={[.18,.7,.7]} /><meshStandardMaterial color="#586979" metalness={.75} roughness={.25} /></mesh>
    <mesh castShadow position={[1.22,-.25,0]} rotation={[0,0,-.35]}><boxGeometry args={[.18,.7,.7]} /><meshStandardMaterial color="#586979" metalness={.75} roughness={.25} /></mesh>
    <mesh position={[-.65,.17,0]}><boxGeometry args={[.65,.08,.38]} /><meshStandardMaterial color="#162a3b" metalness={.2} roughness={.1} /></mesh>
  </group>
}

function Viewer({ aircraftName }: { aircraftName: string }) {
  if (aircraftName === 'C-5M Super Galaxy') return <div className="viewer sketchfab-viewer">
    <iframe title="3D model C-5M Galaxy by zizian" src="https://sketchfab.com/models/c9c7eed4a3c143f6b063157bf6668221/embed?autostart=1&ui_theme=dark" allow="autoplay; fullscreen; xr-spatial-tracking" allowFullScreen />
    <div className="viewer-label"><Rotate3D size={13}/> SKETCHFAB / DRAG TO INSPECT</div><div className="viewer-grid" />
  </div>
  return <div className="viewer"><Canvas camera={{ position: [0, 1.7, 5.5], fov: 42 }} shadows><color attach="background" args={['#08121c']} /><ambientLight intensity={1.2} /><directionalLight position={[3,4,5]} intensity={4} castShadow /><pointLight position={[-4,1,-2]} color="#36b9e9" intensity={5} /><Float speed={1.4} rotationIntensity={.12} floatIntensity={.22}><AircraftModel /></Float><ContactShadows position={[0,-1.35,0]} opacity={.55} scale={7} blur={2.4} far={4} /><Environment preset="night" /><OrbitControls enablePan={false} minDistance={3.2} maxDistance={7} /></Canvas><div className="viewer-label"><Rotate3D size={13}/> DRAG TO INSPECT</div><div className="viewer-grid" /></div>
}

export default function Page() {
  const [active, setActive] = useState('F-35 Lightning II')
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('ALL AIRCRAFT')
  const selected = aircraft.find(([name]) => name === active) ?? aircraft[0]
  const filtered = useMemo(() => aircraft.filter(([name, type, origin]) => `${name} ${type} ${origin}`.toLowerCase().includes(query.toLowerCase()) && (category === 'ALL AIRCRAFT' || type.includes(category))), [query, category])
  const preview = posters[active as keyof typeof posters]
  return <main className="app-shell">
    <header className="topbar"><a className="brand" href="#top"><span className="brand-mark">AM</span><span>AVIATION <b>MASTERS</b></span></a><nav><a href="#collection">Collection</a><a href="#archive">Archive</a><a href="#about">About</a></nav><div className="access"><LockKeyhole size={14}/> PRIVATE ARCHIVE <span className="dot"/></div></header>
    <section className="hero" id="top"><div className="hero-copy"><div className="eyebrow"><span className="live-dot"/> MEMBER ACCESS / 001</div><h1>THE AIRCRAFT<br/><i>ARCHIVE.</i></h1><p>A digital companion to your Aviation Masters poster collection. Explore the machines, missions, and engineering that changed the sky.</p><div className="hero-actions"><a className="button primary" href="#collection">Explore collection <ArrowUpRight size={16}/></a><button className="button ghost"><Play size={14} fill="currentColor"/> Watch intro</button></div></div><div className="hero-stats"><span>COLLECTION 2026</span><strong>24</strong><small>AIRCRAFT / INDEXED</small></div><div className="hero-image"><img src={posters['F-47 NGAD']} alt="F-47 NGAD technical blueprint poster"/><div className="image-caption"><span>FEATURED FILE / 024</span><b>F-47 NGAD</b></div></div></section>
    <section className="workspace" id="collection"><div className="section-heading"><div><span className="eyebrow">01 / THE HANGAR</span><h2>Choose your <i>airframe.</i></h2></div><span className="count">{String(filtered.length).padStart(2,'0')} RESULTS</span></div><div className="tools"><label className="search"><Search size={16}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search aircraft, role, origin..." /></label><div className="filters">{['ALL AIRCRAFT','STEALTH','BOMBER','AIR SUPERIORITY'].map(item=><button key={item} className={category===item?'active':''} onClick={()=>setCategory(item)}>{item}</button>)}<SlidersHorizontal size={17}/></div></div><div className="gallery-layout"><div className="aircraft-list">{filtered.map(([name,type,origin], i)=><button className={`aircraft-row ${active===name?'selected':''}`} key={name} onClick={()=>setActive(name)}><span className="row-num">{String(i+1).padStart(2,'0')}</span><span className="row-name"><b>{name}</b><small>{type}</small></span><span className="origin">{origin}</span><ArrowUpRight className="row-arrow" size={15}/></button>)}</div><aside className="detail-panel"><div className="panel-kicker">ACTIVE SPECIMEN <span>STATUS: REFERENCE</span></div><h3>{selected[0]}</h3><p className="detail-type">{selected[1]} <span>/</span> {selected[2]}</p><div className="model-wrap"><Viewer aircraftName={selected[0]}/></div><div className="spec-grid"><div><span>ROLE</span><b>{selected[1]}</b></div><div><span>ACCESS</span><b>POSTER EDITION</b></div><div><span>DATA SET</span><b>PUBLIC RECORD</b></div></div><div className="panel-footer"><span>3D MODEL / ORBIT ENABLED</span>{preview ? <button onClick={()=>window.open(preview,'_blank')}>View poster <ArrowUpRight size={14}/></button> : <span>Model preview</span>}</div></aside></div></section>
    <section className="poster-strip" id="archive"><div><span className="eyebrow">02 / FROM THE WALL</span><h2>Your collection,<br/><i>in motion.</i></h2><p>Scan the technical posters that started the archive. More aircraft files unlock as the collection grows.</p></div><div className="poster-grid">{Object.entries(posters).slice(1,4).map(([name,src])=><button key={name} onClick={()=>window.open(src,'_blank')}><img src={src} alt={`${name} technical poster`} /><span>{name} <ArrowUpRight size={14}/></span></button>)}</div></section>
    <footer id="about"><span>AVIATION MASTERS / DIGITAL ARCHIVE</span><span>FOR EDUCATIONAL REFERENCE • PUBLIC DATA ONLY</span><span>© 2026</span></footer>
  </main>
}
