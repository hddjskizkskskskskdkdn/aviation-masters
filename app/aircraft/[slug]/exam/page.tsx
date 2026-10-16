'use client'

import Link from 'next/link'
import { useState } from 'react'
import { ArrowLeft, CheckCircle2, ShieldAlert } from 'lucide-react'

const questions = [
  ['Which characteristic most distinguishes a fifth-generation fighter?', ['Higher maximum speed alone', 'Integrated stealth, sensors, avionics, and information sharing', 'Larger passenger capacity', 'Ability to fly without a pilot'], 1],
  ['What is the primary purpose of sensor fusion?', ['Increase engine thrust', 'Combine information from multiple sensors into a coherent operational picture', 'Eliminate navigation instruments', 'Reduce aircraft weight'], 1],
  ['What is the principal function of the F-35 Distributed Aperture System?', ['Panoramic situational awareness through distributed sensors', 'Control landing gear mechanically', 'Refuel the aircraft in flight', 'Measure runway length using radar alone'], 0],
  ['Why is aircraft weight important during flight planning?', ['It affects performance, fuel consumption, and landing considerations', 'It determines pilot rank', 'It eliminates weather effects', 'It has no effect after takeoff'], 0],
  ['What is the primary purpose of a pre-flight checklist?', ['Replace all technical inspections', 'Systematically verify aircraft readiness and identify potential problems', 'Shorten every flight automatically', 'Ensure weather never changes'], 1],
  ['What should take priority during a navigation display failure?', ['Mission score', 'Aircraft control, situational awareness, and safe flight', 'Maximum speed', 'Continuing regardless of conditions'], 1],
  ['What is the safest response to an unstable approach?', ['Continue to protect the schedule', 'Go around and reassess using applicable procedures', 'Increase speed without assessment', 'Ignore the approach parameters'], 1],
  ['What does fuel reserve planning provide?', ['A margin for diversions, delays, and unexpected conditions', 'A guarantee emergencies cannot occur', 'A replacement for monitoring fuel', 'Higher structural speed'], 0],
  ['When should a simulated flight be delayed?', ['When a critical fault or unsafe weather exceeds applicable limits', 'Whenever the mission is difficult', 'Only after landing', 'Never'], 0],
  ['What is the purpose of this examination?', ['An official military qualification', 'A fictional aircraft simulation assessment', 'A real-world flight license', 'A weapons authorization'], 1],
]

export default function F35ExamPage() {
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const [submitted, setSubmitted] = useState(false)
  const score = questions.reduce((total, question, index) => total + (answers[index] === question[2] ? 100 : 0), 0)
  const passed = score >= 850

  return <main className="exam-shell"><header className="topbar dossier-nav"><Link className="brand" href="/"><span className="brand-mark">AM</span><span>AVIATION <b>MASTERS</b></span></Link><Link className="back-link" href="/aircraft/f-35-lightning-ii"><ArrowLeft size={14}/> F-35 dossier</Link></header><article className="exam-page"><div className="exam-kicker">AVIATION MASTERS / MILITARY PILOT QUALIFICATION</div><h1>F-35A LIGHTNING II</h1><p className="exam-subtitle">Advanced Military Aviation Simulation · Candidate examination</p><div className="exam-meta"><span>TOTAL MARKS <b>1,000</b></span><span>DURATION <b>2 H 30 MIN</b></span><span>PASSING SCORE <b>850 / 1,000</b></span></div><div className="exam-notice"><ShieldAlert size={18}/><p>This is a fictional examination for an aircraft simulation game. It does not constitute an official military aviation qualification.</p></div><section className="exam-section"><span className="eyebrow">SECTION A / SYSTEMS AND TECHNICAL KNOWLEDGE</span><h2>Written assessment</h2><p>Answer each question. In the full assessment, Sections B–E include planning, practical simulator, emergency and final mission evaluations.</p>{questions.map((question, index) => <fieldset className="exam-question" key={question[0]}><legend><span>Q{index + 1}</span>{question[0]}</legend>{question[1].map((option, optionIndex) => <label key={option}><input type="radio" name={`question-${index}`} checked={answers[index] === optionIndex} onChange={() => setAnswers({...answers, [index]: optionIndex})}/>{String.fromCharCode(65 + optionIndex)}. {option}</label>)}</fieldset>)}</section>{submitted && <div className={`exam-result ${passed ? 'is-pass' : 'is-fail'}`}><CheckCircle2 size={22}/><div><strong>{passed ? 'QUALIFIED — WRITTEN ASSESSMENT' : 'FURTHER TRAINING REQUIRED'}</strong><p>{score} / 1,000 · {passed ? 'Proceed to practical flight assessment.' : 'Review the dossier and retry the simulation.'}</p></div></div>}<button className="exam-submit" type="button" onClick={() => setSubmitted(true)} disabled={Object.keys(answers).length < questions.length}>{submitted ? 'ASSESSMENT COMPLETE' : 'SUBMIT WRITTEN ASSESSMENT'}</button></article></main>
}
