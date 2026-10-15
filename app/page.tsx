'use client'

import { useMemo, useState } from 'react'
import { ArrowUpRight, ChevronDown, LockKeyhole, Search } from 'lucide-react'

const slugify = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

const aircraft = [
  ['F-35 Lightning II','Stealth / Multirole','USA',1.6,1200,50],['F-22 Raptor','Air Superiority','USA',2.25,1600,48],['F/A-18 Hornet','Carrier Multirole','USA',1.8,1275,43],['F-16 Fighting Falcon','Multirole Fighter','USA',2.05,1350,42],['F-14 Tomcat','Fleet Defense','USA',2.34,1600,48],['F-15EX Eagle II','Air Superiority','USA',2.5,1200,68],['MiG-29 Fulcrum','Air Superiority','Russia',2.25,1500,43],['Su-35 Flanker-E','Air Superiority','Russia',2.25,1800,48],['Su-57 Felon','Stealth / Multirole','Russia',2,1750,47],['Eurofighter Typhoon','Swing-Role','Europe',2,1800,45],['Dassault Rafale','Omnirole Fighter','France',1.8,1900,44],['A-10 Thunderbolt II','Close Air Support','USA',0.78,800,40],['SR-71 Blackbird','Reconnaissance','USA',3.32,2900,85],['B-2 Spirit','Stealth Bomber','USA',0.95,6000,52],['B-21 Raider','Stealth Bomber','USA',0.9,5000,50],['B-52 Stratofortress','Strategic Bomber','USA',0.86,8800,185],['Tu-160 Blackjack','Strategic Bomber','Russia',2.05,7300,120],['C-17 Globemaster III','Airlift','USA',0.82,2400,73],['C-5M Super Galaxy','Airlift','USA',0.79,4400,95],['AC-130 Gunship','Close Air Support','USA',0.59,2400,38],['J-36','Next-Gen / Concept','China',2.5,3000,60],['F/A-XX','Carrier Next-Gen','USA',2,2200,48],['F-47 NGAD','Next-Gen Air Dominance','USA',2,2500,55],['Su-47 Berkut','Technology Demonstrator','Russia',1.6,1500,44],
] as const
type Aircraft = typeof aircraft[number]

function Detail({ item }: { item: Aircraft }) {
  return <article className="detail-panel" id="details">
    <div className="panel-kicker"><span>DOCUMENTARY ENTRY</span><b>PUBLIC REFERENCE</b></div>
    <h2>{item[0]}</h2><p className="detail-type">{item[1]} <span>/</span> {item[2]}</p>
    <div className="spec-grid"><div><span>MAX SPEED</span><strong>Mach {item[3]}</strong></div><div><span>RANGE</span><strong>{item[4].toLocaleString()} km</strong></div><div><span>LENGTH</span><strong>{item[5]} m est.</strong></div><div><span>STATUS</span><strong>Reference</strong></div></div>
    <div className="detail-copy"><p>Aviation Masters presents a concise public-data reference for this aircraft. Explore the role, performance context, design lineage and service history through the archive below.</p><a href={`/aircraft/${slugify(item[0])}`} className="text-link">Read full data sheet <ArrowUpRight size={15}/></a></div>
  </article>
}

export default function Page() {
  const [active, setActive] = useState<string | null>(null)
  const [query, setQuery] = useState('')
  const [origin, setOrigin] = useState('All origins')
  const selected = active ? aircraft.find(([name]) => name === active) : undefined
  const filtered = useMemo(() => aircraft.filter(([name, role, country]) => `${name} ${role} ${country}`.toLowerCase().includes(query.toLowerCase()) && (origin === 'All origins' || country === origin)), [query, origin])
  return <main className="app-shell">
    <header className="topbar"><a className="brand" href="#top"><span className="brand-mark">AM</span><span>AVIATION <b>MASTERS</b></span></a><nav><a href="#collection">Aircraft</a><a href="#details">Details</a><a href="#data-table">Data sheets</a></nav><div className="access"><LockKeyhole size={14}/> CUSTOMER ARCHIVE <span className="dot"/></div></header>
    <section className="hero" id="top"><div className="hero-copy"><div className="eyebrow">AVIATION MASTERS / OFFICIAL CUSTOMER ARCHIVE</div><h1>THE AIRCRAFT<br/><i>DOCUMENTARY.</i></h1><p>A considered reference library for Aviation Masters customers — observe each aircraft, read its story, and explore key public specifications in one clean archive.</p><a className="button primary" href="#collection">Explore the collection <ArrowUpRight size={16}/></a></div><div className="hero-radar"><div className="radar-ring">AIRFRAME<br/>REFERENCE</div></div></section>
    <section className="workspace" id="collection"><div className="section-heading"><div><span className="eyebrow">01 / AIRCRAFT INDEX</span><h2>Explore the <i>collection.</i></h2></div><span className="count">{filtered.length} AIRCRAFT</span></div><div className="tools"><label className="search"><Search size={16}/><input aria-label="Search aircraft" value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search aircraft, role, origin..."/></label><label className="select-wrap">ORIGIN <select value={origin} onChange={e=>setOrigin(e.target.value)}><option>All origins</option><option>USA</option><option>Russia</option><option>Europe</option><option>France</option><option>China</option></select><ChevronDown size={14}/></label></div><div className="archive-layout"><div className="aircraft-list">{filtered.map((item,index)=><div key={item[0]} className="aircraft-entry"><button className={`aircraft-row ${active===item[0]?'selected':''}`} aria-expanded={active===item[0]} onClick={()=>setActive(active===item[0]?null:item[0])}><span className="row-num">{String(index+1).padStart(2,'0')}</span><span className="row-name"><b>{item[0]}</b><small>{item[1]}</small></span><span className="origin">{item[2]}</span><ChevronDown className={`row-chevron ${active===item[0]?'open':''}`} size={15}/></button>{active===item[0]&&<div className="inline-detail"><Detail item={item}/></div>}</div>)}{!filtered.length&&<p className="empty">No archive entries match your search.</p>}</div></div></section>
    <section className="data-section" id="data-table"><div className="section-heading"><div><span className="eyebrow">02 / REFERENCE TABLE</span><h2>Performance <i>at a glance.</i></h2></div><span className="count">PUBLIC DATA / ESTIMATES</span></div><div className="table-scroll"><table><thead><tr><th>Aircraft</th><th>Role</th><th>Origin</th><th>Max speed</th><th>Range</th><th>Length</th><th>Archive status</th></tr></thead><tbody>{aircraft.map(item=><tr key={item[0]}><td><button onClick={()=>{setActive(item[0]);document.querySelector('#collection')?.scrollIntoView({behavior:'smooth'})}}>{item[0]}</button></td><td>{item[1]}</td><td>{item[2]}</td><td>Mach {item[3]}</td><td>{item[4].toLocaleString()} km</td><td>{item[5]} m est.</td><td><span className="status">Documented</span></td></tr>)}</tbody></table></div><p className="disclaimer">For educational and editorial reference only. Figures are public-data estimates, may vary by configuration, and are not operational guidance. Aviation Masters is not affiliated with any aircraft manufacturer or military service.</p></section>
    <footer><span>AVIATION MASTERS / CUSTOMER ARCHIVE</span><span>PUBLIC DATA • EDITORIAL REFERENCE • 2026</span></footer>
  </main>
}
