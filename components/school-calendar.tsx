'use client'

import { useMemo, useState } from 'react'
import { CalendarDays, ChevronLeft, ChevronRight, Clock3, MapPin, Plane, Radio, Shield, Users } from 'lucide-react'

type SchoolEvent = { id: string; title: string; description: string; eventType: string; startsAt: Date | string; endsAt: Date | string; location: string; instructor: string }

const typeIcons = { briefing: Radio, flight: Plane, exam: Shield, seminar: Users }
const typeLabels = { briefing: 'BRIEFING', flight: 'FLIGHT TRAINING', exam: 'ASSESSMENT', seminar: 'SEMINAR' }

function dayKey(date: Date) { return date.toISOString().slice(0, 10) }
function formatTime(value: Date | string) { return new Intl.DateTimeFormat('en', { hour: '2-digit', minute: '2-digit' }).format(new Date(value)) }

export default function SchoolCalendar({ events }: { events: SchoolEvent[] }) {
  const [cursor, setCursor] = useState(() => { const date = new Date(); date.setDate(1); return date })
  const [selectedDay, setSelectedDay] = useState(() => dayKey(new Date()))
  const days = useMemo(() => {
    const first = new Date(cursor.getFullYear(), cursor.getMonth(), 1)
    const start = (first.getDay() + 6) % 7
    const total = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 0).getDate()
    return Array.from({ length: start + total }, (_, index) => index < start ? null : new Date(cursor.getFullYear(), cursor.getMonth(), index - start + 1))
  }, [cursor])
  const selectedEvents = events.filter(event => dayKey(new Date(event.startsAt)) === selectedDay)
  const monthName = new Intl.DateTimeFormat('en', { month: 'long', year: 'numeric' }).format(cursor)

  return <main className="calendar-shell">
    <header className="calendar-topbar"><a href="/" className="calendar-brand"><span>AM</span><b>AVIATION MASTERS</b></a><nav><a href="/">ARCHIVE</a><a className="active" href="/calendar">FLIGHT CALENDAR</a><a href="/profile">PILOT PROFILE</a></nav><a className="calendar-back" href="/">BACK TO HANGAR</a></header>
    <section className="calendar-hero"><div><p className="calendar-eyebrow">FLIGHT SCHOOL OPERATIONS / 01</p><h1>Training <i>calendar.</i></h1><p>Stay aligned with Aviation Masters briefings, simulator labs, assessments and scheduled flight training.</p></div><div className="calendar-legend"><span><i className="dot cyan"/> FLIGHT</span><span><i className="dot amber"/> ASSESSMENT</span><span><i className="dot green"/> BRIEFING</span></div></section>
    <section className="calendar-content"><div className="calendar-board"><div className="calendar-board-head"><button aria-label="Previous month" onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1))}><ChevronLeft size={18}/></button><h2>{monthName}</h2><button aria-label="Next month" onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1))}><ChevronRight size={18}/></button></div><div className="calendar-weekdays">{['MON','TUE','WED','THU','FRI','SAT','SUN'].map(day => <span key={day}>{day}</span>)}</div><div className="calendar-grid">{days.map((day, index) => { const key = day ? dayKey(day) : `empty-${index}`; const dayEvents = day ? events.filter(event => dayKey(new Date(event.startsAt)) === key) : []; return <button key={key} disabled={!day} className={`calendar-day ${selectedDay === key ? 'selected' : ''} ${day && dayKey(new Date()) === key ? 'today' : ''}`} onClick={() => day && setSelectedDay(key)}>{day && <><strong>{day.getDate()}</strong>{dayEvents.slice(0, 2).map(event => <span className={`calendar-event-dot ${event.eventType}`} key={event.id}>{event.title}</span>)}</>}</button> })}</div></div><aside className="calendar-agenda"><div className="agenda-head"><span>SELECTED DAY</span><strong>{new Intl.DateTimeFormat('en', { weekday: 'long', month: 'short', day: 'numeric' }).format(new Date(`${selectedDay}T12:00:00`))}</strong></div>{selectedEvents.length ? selectedEvents.map(event => { const Icon = typeIcons[event.eventType as keyof typeof typeIcons] ?? CalendarDays; return <article className="agenda-card" key={event.id}><div className="agenda-icon"><Icon size={18}/></div><div><span className="agenda-type">{typeLabels[event.eventType as keyof typeof typeLabels] ?? event.eventType.toUpperCase()}</span><h3>{event.title}</h3><p>{event.description}</p><small><Clock3 size={12}/> {formatTime(event.startsAt)} – {formatTime(event.endsAt)}</small><small><MapPin size={12}/> {event.location}</small></div></article> }) : <div className="agenda-empty"><CalendarDays size={28}/><p>No scheduled training for this day.</p><span>Choose another date to view school operations.</span></div>}</aside></section>
  </main>
}
