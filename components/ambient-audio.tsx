'use client'

import { useEffect, useRef, useState } from 'react'
import { Volume2, VolumeX } from 'lucide-react'

export default function AmbientAudio() {
  const [enabled, setEnabled] = useState(false)
  const contextRef = useRef<AudioContext | null>(null)
  const nodesRef = useRef<{ master: GainNode; oscillators: OscillatorNode[] } | null>(null)

  const start = async () => {
    if (typeof window === 'undefined') return
    const AudioContextClass = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
    if (!AudioContextClass) return
    const context = contextRef.current ?? new AudioContextClass()
    contextRef.current = context
    await context.resume()
    if (!nodesRef.current) {
      const master = context.createGain()
      master.gain.value = 0.018
      master.connect(context.destination)
      const oscillators = [55, 82.5, 110].map((frequency, index) => {
        const oscillator = context.createOscillator()
        const gain = context.createGain()
        oscillator.type = index === 0 ? 'sine' : 'triangle'
        oscillator.frequency.value = frequency
        gain.gain.value = index === 0 ? 0.6 : 0.18
        oscillator.connect(gain)
        gain.connect(master)
        oscillator.start()
        return oscillator
      })
      nodesRef.current = { master, oscillators }
    }
    nodesRef.current.master.gain.setTargetAtTime(0.018, context.currentTime, 0.35)
    setEnabled(true)
  }

  const stop = () => {
    const context = contextRef.current
    if (context && nodesRef.current) {
      nodesRef.current.master.gain.setTargetAtTime(0, context.currentTime, 0.25)
    }
    setEnabled(false)
  }

  useEffect(() => {
    const beginAfterGesture = () => {
      void start()
      window.removeEventListener('pointerdown', beginAfterGesture)
      window.removeEventListener('keydown', beginAfterGesture)
    }
    window.addEventListener('pointerdown', beginAfterGesture, { once: true })
    window.addEventListener('keydown', beginAfterGesture, { once: true })
    return () => {
      window.removeEventListener('pointerdown', beginAfterGesture)
      window.removeEventListener('keydown', beginAfterGesture)
      nodesRef.current?.oscillators.forEach((oscillator) => oscillator.stop())
      void contextRef.current?.close()
    }
  }, [])

  return <button className="ambient-audio" type="button" aria-label={enabled ? 'Mute ambient archive sound' : 'Enable ambient archive sound'} onClick={() => enabled ? stop() : void start()}>{enabled ? <Volume2 size={15}/> : <VolumeX size={15}/>} <span>{enabled ? 'AMBIENT ON' : 'SOUND'}</span></button>
}
