'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { db } from '@/lib/firebase'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { useAuth } from '@/hooks/useAuth'

interface Shop {
  id: string;
  name: string;
  shopNumber: string;
  floor: number;
  category: string;
}

interface Event {
  id: string;
  name: string;
  shopId: string;
  shopName: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  venue: string;
  category: string;
}

const categories = ['Technology', 'Food', 'Toys', 'Electronics', 'Medical', 'Other'];

export default function CustomerLandingPage() {
  const [shops, setShops] = useState<Shop[]>([])
  const [events, setEvents] = useState<Event[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedFloor, setSelectedFloor] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

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

    if (user) {
      fetchShopsAndEvents()
    }
  }, [user])

  const filteredShops = shops.filter(shop => 
    (searchTerm === '' || shop.name.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (selectedFloor === null || shop.floor.toString() === selectedFloor) &&
    (selectedCategory === null || shop.category === selectedCategory)
  )

  const filteredEvents = events.filter(event =>
    (selectedFloor === null || shops.find(shop => shop.id === event.shopId)?.floor.toString() === selectedFloor) &&
    (selectedCategory === null || event.category === selectedCategory)
  )

  const isEventActive = (event: Event) => {
    const now = new Date()
    const startDate = new Date(`${event.startDate}T${event.startTime}`)
    const endDate = new Date(`${event.endDate}T${event.endTime}`)
    return now >= startDate && now <= endDate
  }

  if (loading) return <div className="flex justify-center items-center h-screen"><div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-yellow-500"></div></div>
  if (!user) return null

  return (
    <div className="container mx-auto p-4 space-y-8 bg-gray-100">
      <h1 className="text-4xl font-bold mb-8 text-center text-yellow-500">Shops and Events</h1>
      
      <div className="flex flex-wrap gap-2 mb-6 justify-center">
        {categories.map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? "default" : "outline"}
            onClick={() => setSelectedCategory(selectedCategory === category ? null : category)}
            className="transition-all duration-200 ease-in-out transform hover:scale-105 bg-blue-500 text-white hover:bg-blue-600"
          >
            {category}
          </Button>
        ))}
      </div>

      <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 mb-6">
        <Input
          placeholder="Search for a shop"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-grow transition-all duration-200 ease-in-out focus:ring-2 focus:ring-yellow-500"
        />
        <Select onValueChange={(value) => setSelectedFloor(value)}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Select Floor" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={null}>All Floors</SelectItem>
            {Array.from(new Set(shops.map(shop => shop.floor))).sort().map(floor => (
              <SelectItem key={floor} value={floor.toString()}>{`Floor ${floor}`}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <h2 className="text-2xl font-bold mb-4 text-yellow-500">Shops</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {filteredShops.map(shop => (
              <Link href={`/customer/shop/${shop.id}`} key={shop.id}>
                <div className="border p-4 rounded-lg hover:shadow-lg transition-all duration-200 ease-in-out transform hover:scale-105 bg-white">
                  <h3 className="text-xl font-semibold text-blue-500">{shop.name}</h3>
                  <p className="text-gray-600">Shop Number: {shop.shopNumber}</p>
                  <p className="text-gray-600">Floor: {shop.floor}</p>
                  <p className="text-gray-600">Category: {shop.category}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
        
        <div>
          <h2 className="text-2xl font-bold mb-4 text-yellow-500">Ongoing Events</h2>
          {filteredEvents.map(event => (
            <div 
              key={event.id} 
              className={`border p-4 rounded-lg mb-4 transition-all duration-200 ease-in-out ${
                isEventActive(event) 
                  ? 'bg-green-100 border-green-300' 
                  : 'bg-red-100 border-red-300'
              }`}
            >
              <h3 className="text-lg font-semibold text-blue-500">{event.name}</h3>
              <p className="text-gray-600">{event.shopName}</p>
              <p className="text-gray-600">Venue: {event.venue}</p>
              <p className="text-gray-600">Category: {event.category}</p>
              <p className="text-gray-600">
                {isEventActive(event) 
                  ? `Ongoing: ${event.startDate} ${event.startTime} - ${event.endDate} ${event.endTime}` 
                  : `Upcoming: ${event.startDate} ${event.startTime}`
                }
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

