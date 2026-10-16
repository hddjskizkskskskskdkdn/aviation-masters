'use client'

import { useEffect, useRef, useState } from 'react'
import { Volume2, VolumeX } from 'lucide-react'

export default function AmbientAudio() {
  const [enabled, setEnabled] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const start = async () => {
    const audio = audioRef.current
    if (!audio) return
    audio.volume = 0.22
    try {
      await audio.play()
      setEnabled(true)
    } catch {
      setEnabled(false)
    }
  }

  const stop = () => {
    audioRef.current?.pause()
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
      audioRef.current?.pause()
    }
  }, [])

  return (
    <>
      <audio ref={audioRef} src="/audio/dawning-anthem-falls.mp3" loop preload="metadata" aria-label="Dawning by Anthem Falls" />
      <button className="ambient-audio" type="button" aria-label={enabled ? 'Mute Dawning background music' : 'Play Dawning background music'} onClick={() => enabled ? stop() : void start()}>
        {enabled ? <Volume2 size={15}/> : <VolumeX size={15}/>} <span>{enabled ? 'DAWNING ON' : 'MUSIC'}</span>
      </button>
    </>
  )
}
