'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { productStore } from '@/lib/store'
import ProductForm from '@/components/ProductForm'
import type { Product } from '@/types'

export default function EditProductPage() {
  const { id } = useParams<{ id: string }>()
  const [product, setProduct] = useState<Product | null>(null)

  useEffect(() => {
    productStore.list().then((products) => {
      setProduct(products.find((p) => p.id === id) ?? null)
    })
  }, [id])

  if (!product) return <p className="text-neutral-600">Loading…</p>

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-neutral-900">Edit Product</h1>
      <ProductForm product={product} />
    </div>
  )
}
