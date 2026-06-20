'use client'
import { useState, useEffect } from 'react'

const words = ['one team.', 'Flip.']

export default function CyclingWord() {
  const [index, setIndex] = useState(0)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false)
      setTimeout(() => {
        setIndex((i) => (i + 1) % words.length)
        setVisible(true)
      }, 350)
    }, 2200)
    return () => clearInterval(interval)
  }, [])

  return (
    <span
      style={{
        display: 'inline-block',
        textDecoration: 'underline',
        textDecorationColor: '#FFB207',
        textDecorationThickness: '6px',
        textUnderlineOffset: '8px',
        transition: 'opacity 0.35s ease, transform 0.35s ease',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(-10px)',
      }}
    >
      {words[index]}
    </span>
  )
}
