'use client'

import { ArrowUpRight, ChevronDown, LogOut, Menu, X } from 'lucide-react'
import { useState, useTransition } from 'react'
import { signOut } from '@/lib/auth-client'
import { savePilotProfile, type PilotPath } from '@/app/actions/onboarding'

type PilotProfile = { age: number; path: PilotPath; firstFlight: string }
const paths: { id: PilotPath; title: string; detail: string }[] = [
  { id: 'military', title: 'Military pilot', detail: 'Tactical jets, air superiority and mission discipline' },
  { id: 'commercial', title: 'Commercial pilot', detail: 'Transport aircraft, navigation and flight operations' },
  { id: 'helicopter', title: 'Helicopter pilot', detail: 'Rotorcraft handling, terrain and close support' },
  { id: 'drone', title: 'Drone pilot', detail: 'Remote systems, sensors and precision missions' },
]
const pathLabel = (path: PilotPath) => paths.find((item) => item.id === path)?.title ?? 'Pilot'

export default function ArchivePage({ userName, pilotProfile }: { userName: string; pilotProfile?: PilotProfile }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [onboardingOpen, setOnboardingOpen] = useState(!pilotProfile)
  const [age, setAge] = useState('')
  const [path, setPath] = useState<PilotPath>('military')
  const [error, setError] = useState('')
  const [pending, startTransition] = useTransition()
  const completeOnboarding = () => {
    setError('')
    startTransition(async () => {
      try { await savePilotProfile(Number(age), path); setOnboardingOpen(false); window.location.reload() } catch (err) { setError(err instanceof Error ? err.message : 'Please complete your pilot profile.') }
    })
  }
  const unlockedCategory = pilotProfile?.path === 'helicopter' ? 'helicopters' : pilotProfile?.path === 'drone' ? 'drones' : 'aircraft'
  const categories = [['aircraft','Military Aircrafts','24 documentary entries'],['helicopters','Military Helicopters','Rotorcraft reference archive'],['tanks','Military Tanks','Armoured vehicle records'],['ships','Military Ships','Naval platform records'],['drones','Military Drones','Uncrewed systems archive']] as const
  return <main className="app-shell landing-page">
    <header className={`topbar ${menuOpen ? 'menu-open' : ''}`}><a className="brand" href="/"><span className="brand-mark">AM</span><span>AVIATION <b>MASTERS</b></span></a><button className="mobile-menu-button" type="button" aria-label={menuOpen ? 'Close navigation' : 'Open navigation'} aria-expanded={menuOpen} onClick={()=>setMenuOpen(!menuOpen)}>{menuOpen ? <X size={20}/> : <Menu size={20}/>}</button><nav className={`primary-nav ${menuOpen ? 'is-open' : ''}`} aria-label="Military collections"><a href={`/category/${unlockedCategory}`}>Your flight school</a><a href="/category/aircraft">Aircraft</a><a href="/category/helicopters">Helicopters</a><a href="/category/tanks">Tanks</a><a href="/category/ships">Ships</a><a href="/category/drones">Drones</a></nav><div className="profile-menu"><button type="button" className="profile-trigger"><span className="profile-avatar">{userName.slice(0,1).toUpperCase()}</span><span>{userName}</span><ChevronDown size={13}/></button><div className="profile-dropdown mobile-profile-dropdown"><span className="profile-label">PILOT PROFILE</span><a href="/profile">View profile</a><button type="button" className="signout" onClick={async()=>{await signOut(); window.location.href='/sign-in'}}><LogOut size={13}/> SIGN OUT</button></div></div></header>
    <section className="hero landing-hero"><div className="hero-copy"><div className="eyebrow">AVIATION MASTERS / FLIGHT TRAINING SCHOOL</div><h1>YOUR FLIGHT.<br/><i>YOUR MASTERY.</i></h1><p>Train through interactive aircraft dossiers, cockpit labs and fictional mission scenarios designed around your pilot path.</p><a className="button primary" href={`/category/${unlockedCategory}`}>Continue training <ArrowUpRight size={16}/></a>{pilotProfile&&<div className="pilot-passport"><span>CADET PROFILE</span><strong>{pathLabel(pilotProfile.path)}</strong><small>FIRST FLIGHT UNLOCKED · {pilotProfile.firstFlight}</small></div>}</div><div className="hero-radar"><div className="radar-ring">FLIGHT<br/>SCHOOL</div></div></section>
    <section className="landing-categories"><div className="section-heading"><div><span className="eyebrow">01 / TRAINING HANGAR</span><h2>Choose your <i>airframe.</i></h2></div><span className="count">{pilotProfile ? '1 UNLOCKED' : 'CADET INTAKE'}</span></div><div className="category-cards">{categories.map(([slug,title,meta],index)=>{const unlocked=slug===unlockedCategory;return <a className={`category-card ${!unlocked?'is-locked':''}`} href={unlocked?`/category/${slug}`:'#'} aria-disabled={!unlocked} onClick={(event)=>{if(!unlocked)event.preventDefault()}} key={slug}><span>{String(index+1).padStart(2,'0')}</span><div><b>{unlocked?title:'LOCKED TRAINING'}</b><small>{unlocked?meta:'Complete your first flight to unlock'}</small></div><span className="lock-mark">{unlocked?'OPEN':'LOCKED'}</span></a>})}</div></section>
    <section className="landing-note"><span className="eyebrow">02 / FLIGHT SCHOOL</span><h2>Earn access one flight at a time.</h2><p>Start with one aircraft matched to your pilot path. Master its dossier and cockpit lab before the next airframe enters your training hangar.</p></section>
    <footer><span>AVIATION MASTERS / FLIGHT TRAINING SCHOOL</span><span>PUBLIC DATA • FICTIONAL SIMULATION • 2026</span></footer>
    {onboardingOpen&&<div className="onboarding-backdrop"><section className="onboarding-card onboarding-card-welcome" role="dialog" aria-modal="true" aria-labelledby="onboarding-title"><div className="onboarding-guide"><img src="/images/aviation-instructor.png" alt="Aviation Masters flight instructor"/><div><span className="eyebrow">AVIATION MASTERS / FLIGHT SCHOOL</span><strong>Welcome, {userName}.</strong><small>Your instructor is ready to build your first flight path.</small></div></div><span className="eyebrow">CADET INTAKE / 01</span><h2 id="onboarding-title">Choose your <i>flight path.</i></h2><p>We will unlock one first flight built for your training goal. The rest of the hangar stays locked until you earn access.</p><label>How old are you?<input type="number" min="13" max="100" value={age} onChange={(event)=>setAge(event.target.value)} placeholder="Your age"/></label><fieldset><legend>At Aviation Masters, I want to be a...</legend>{paths.map((item)=><label className={`path-option ${path===item.id?'selected':''}`} key={item.id}><input type="radio" name="pilot-path" value={item.id} checked={path===item.id} onChange={()=>setPath(item.id)}/><span><strong>{item.title}</strong><small>{item.detail}</small></span></label>)}</fieldset>{error&&<p className="onboarding-error">{error}</p>}<button className="button primary onboarding-submit" type="button" disabled={pending} onClick={completeOnboarding}>{pending?'SETTING UP FLIGHT SCHOOL…':'START MY FLIGHT SCHOOL'} <ArrowUpRight size={16}/></button></section></div>}
  </main>
}
