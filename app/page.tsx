import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-8">Welcome to Sdrdrax  Mall</h1>
      <p className="text-xl mb-8">Explore our shops and offers!</p>
      <div className="flex space-x-4">
        <Link href="/customer">
          <Button>Shops and Offers</Button>
        </Link>
        <Link href="/shops">
          <Button variant="outline">View Shops</Button>
        </Link>
      </div>
    </main>
  )
}

