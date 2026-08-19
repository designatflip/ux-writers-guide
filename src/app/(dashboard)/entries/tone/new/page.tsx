import { Suspense } from 'react'
import TonePillarForm from '@/components/TonePillarForm'

export default function NewTonePillarPage() {
  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-neutral-900">New Tone Pillar</h1>
      <Suspense>
        <TonePillarForm />
      </Suspense>
    </div>
  )
}
