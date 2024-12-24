'use client'

import React from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'

export default function AdminPending() {
  const { user, loading, role } = useAuth()
  const router = useRouter()

  if (loading) {
    return <div>Loading...</div>
  }

  if (!user || role !== 'admin') {
    router.push('/')
    return null
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Admin Registration Pending</h1>
      <p>Your admin registration is pending approval. Please check back later or contact the system administrator.</p>
    </div>
  )
}

