import React from 'react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function AdminDashboard() {
  // This data would typically come from your backend
  const stats = {
    totalShops: 15,
    totalRevenue: 50000,
    newShopsThisMonth: 3,
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">Total Shops</h2>
          <p className="text-3xl font-bold">{stats.totalShops}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">Total Revenue</h2>
          <p className="text-3xl font-bold">${stats.totalRevenue}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">New Shops This Month</h2>
          <p className="text-3xl font-bold">{stats.newShopsThisMonth}</p>
        </div>
      </div>
      <Link href="/admin">
        <Button variant="outline">Back to Admin Home</Button>
      </Link>
    </div>
  )
}

