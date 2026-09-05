"use client"

import { Mic, MicOff } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

type SpeechRecognitionLike = {
  lang: string
  continuous: boolean
  interimResults: boolean
  start: () => void
  stop: () => void
  onresult: ((event: { resultIndex: number; results: ArrayLike<{ 0: { transcript: string }; isFinal: boolean }> }) => void) | null
  onerror: ((event: { error?: string }) => void) | null
  onend: (() => void) | null
}

type VoiceInputProps = {
  value: string
  onChange: (value: string) => void
  lang?: string
  onUnsupported?: (message: string) => void
}

export function VoiceInput({ value, onChange, lang = 'en-US', onUnsupported }: VoiceInputProps) {
  const recognition = useRef<SpeechRecognitionLike | null>(null)
  const [listening, setListening] = useState(false)

  useEffect(() => () => recognition.current?.stop(), [])

  function toggleListening() {
    const SpeechRecognition = (window as Window & { SpeechRecognition?: new () => SpeechRecognitionLike; webkitSpeechRecognition?: new () => SpeechRecognitionLike }).SpeechRecognition
      ?? (window as Window & { webkitSpeechRecognition?: new () => SpeechRecognitionLike }).webkitSpeechRecognition
    if (!SpeechRecognition) {
      onUnsupported?.('Voice input is not supported in this browser. Try Chrome or Edge.')
      return
    }
    if (listening) { recognition.current?.stop(); setListening(false); return }
    const instance = new SpeechRecognition()
    instance.lang = lang
    instance.continuous = true
    instance.interimResults = true
    instance.onresult = (event) => {
      let transcript = ''
      for (let index = event.resultIndex; index < event.results.length; index += 1) transcript += event.results[index][0].transcript
      onChange(`${value}${value && !value.endsWith(' ') ? ' ' : ''}${transcript}`)
    }
    instance.onerror = (event) => { setListening(false); onUnsupported?.(event.error === 'not-allowed' ? 'Microphone access was denied. Enable it in your browser settings.' : 'Voice input stopped. Please try again.') }
    instance.onend = () => setListening(false)
    recognition.current = instance
    setListening(true)
    instance.start()
  }

  return <button type="button" className={`voice-button ${listening ? 'voice-listening' : ''}`} onClick={toggleListening} aria-label={listening ? 'Stop voice input' : 'Start voice input'} aria-pressed={listening}><span className="voice-waves" aria-hidden="true"><i /><i /><i /></span>{listening ? <MicOff size={17} /> : <Mic size={17} />}{listening && <span className="voice-status">Listening</span>}</button>
}

export const VOICE_LANGUAGES = [
  ['English (US)', 'en-US'], ['English (UK)', 'en-GB'], ['Arabic (Saudi Arabia)', 'ar-SA'], ['Arabic (Egypt)', 'ar-EG'], ['French', 'fr-FR'], ['Spanish', 'es-ES'], ['German', 'de-DE'], ['Turkish', 'tr-TR'], ['Russian', 'ru-RU'], ['Portuguese', 'pt-BR'], ['Italian', 'it-IT'], ['Hindi', 'hi-IN'], ['Japanese', 'ja-JP'], ['Korean', 'ko-KR'], ['Chinese', 'zh-CN'],
] as const
