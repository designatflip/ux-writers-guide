import { Suspense } from 'react'
import BrandConstantForm from '@/components/BrandConstantForm'

export default function NewBrandConstantPage() {
  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-neutral-900">New Brand Constant</h1>
      <Suspense>
        <BrandConstantForm />
      </Suspense>
    </div>
  )
}
