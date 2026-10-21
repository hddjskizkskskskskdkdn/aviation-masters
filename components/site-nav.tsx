'use client'

import { Menu, X } from 'lucide-react'
import { useState } from 'react'

const links = [
  ['/', 'ARCHIVE'],
  ['/missions', 'MISSIONS'],
  ['/calendar', 'CALENDAR'],
  ['/profile', 'PROFILE'],
  ['/shop', 'SHOP'],
] as const

export default function SiteNav({ active }: { active?: string }) {
  const [open, setOpen] = useState(false)
  return (
    <header className={`topbar ${open ? 'menu-open' : ''}`}>
      <a className="brand" href="/" aria-label="Aviation Masters home"><span className="brand-mark">AM</span><span>AVIATION <b>MASTERS</b></span></a>
      <button className="mobile-menu-button" type="button" aria-label={open ? 'Close navigation' : 'Open navigation'} aria-expanded={open} onClick={() => setOpen(!open)}>{open ? <X size={20} /> : <Menu size={20} />}</button>
      <nav className={`primary-nav ${open ? 'is-open' : ''}`} aria-label="Primary navigation">
        {links.map(([href, label]) => <a key={href} className={active === href ? 'active' : ''} href={href} onClick={() => setOpen(false)}>{label}</a>)}
      </nav>
    </header>
  )
}
