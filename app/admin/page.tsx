'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { db } from '@/lib/firebase'
import { collection, getDocs } from 'firebase/firestore'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'

interface Shop {
  id: string;
  name: string;
  floor: number;
  imageUrl: string;
  category: string;
}

interface Event {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  shopName: string;
}

export default function AdminPage() {
  const [shops, setShops] = useState<Shop[]>([])
  const [events, setEvents] = useState<Event[]>([])
  const { user, loading, role } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && (!user || role !== 'admin')) {
      router.push('/')
    }
  }, [user, loading, role, router])

  useEffect(() => {
    const fetchShopsAndEvents = async () => {
      const shopsCollection = collection(db, 'shops')
      const shopSnapshot = await getDocs(shopsCollection)
      const shopList = shopSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Shop[]
      setShops(shopList)

      const eventsCollection = collection(db, 'events')
      const eventSnapshot = await getDocs(eventsCollection)
      const eventList = eventSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Event[]
      setEvents(eventList)
    }

    if (user && role === 'admin') {
      fetchShopsAndEvents()
    }
  }, [user, role])

  if (loading) return <div className="flex justify-center items-center h-screen"><div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-yellow-500"></div></div>
  if (!user || role !== 'admin') return null

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4 text-yellow-500">Admin Dashboard</h1>
      <div className="flex space-x-4 mb-8">
        <Link href="/admin/create-shop">
          <Button className="bg-blue-500 hover:bg-blue-600 text-white">Create New Shop</Button>
        </Link>
        <Link href="/admin/edit-events">
          <Button className="bg-green-500 hover:bg-green-600 text-white">Edit Events</Button>
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {shops.map((shop) => (
          <div key={shop.id} className="bg-white p-4 rounded-lg shadow-lg transition-all duration-200 hover:shadow-xl">
            {shop.imageUrl && shop.imageUrl !== "" ? (
              <img src={shop.imageUrl} alt={shop.name} className="w-full h-48 object-cover rounded-md mb-2" />
            ) : (
              <div className="w-full h-48 bg-gray-200 rounded-md mb-2 flex items-center justify-center">
                <span className="text-gray-500">No image</span>
              </div>
            )}
            <h2 className="text-xl font-semibold text-blue-500">{shop.name}</h2>
            <p className="text-gray-600">Floor: {shop.floor}</p>
            <p className="text-gray-600">Category: {shop.category}</p>
            <Link href={`/admin/edit-shop/${shop.id}`}>
              <Button className="mt-2 bg-yellow-500 hover:bg-yellow-600 text-white">Edit Shop</Button>
            </Link>
          </div>
        ))}
      </div>

      <h2 className="text-2xl font-bold mt-8 mb-4 text-yellow-500">Ongoing Events</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {events.map((event) => (
          <div key={event.id} className="bg-white p-4 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold text-blue-500">{event.name}</h3>
            <p className="text-gray-600">Shop: {event.shopName}</p>
            <p className="text-gray-600">Start: {new Date(event.startDate).toLocaleDateString()}</p>
            <p className="text-gray-600">End: {new Date(event.endDate).toLocaleDateString()}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

