'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { db } from '@/lib/firebase'
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore'
import { useAuth } from '@/hooks/useAuth'

interface Event {
  id: string;
  name: string;
  description: string;
  category: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  venue: string;
  advertisement: string;
  socialMediaLinks: string;
  status: 'active' | 'paused' | 'cancelled';
  shopId: string;
  shopName: string;
}

export default function EditEventsPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [newEvent, setNewEvent] = useState<Omit<Event, 'id'>>({
    name: '',
    description: '',
    category: '',
    startDate: '',
    endDate: '',
    startTime: '',
    endTime: '',
    venue: '',
    advertisement: '',
    socialMediaLinks: '',
    status: 'active',
    shopId: '',
    shopName: ''
  })
  const [editingEvent, setEditingEvent] = useState<Event | null>(null)
  const [shops, setShops] = useState<{ id: string; name: string }[]>([])
  const [error, setError] = useState('')
  const { user, loading, role } = useAuth()
  const router = useRouter()

  const eventCategories = ['Music', 'Sale', 'Exhibition', 'Other']

  useEffect(() => {
    if (!loading && (!user || role !== 'admin')) {
      router.push('/')
    }
  }, [user, loading, role, router])

  useEffect(() => {
    const fetchEvents = async () => {
      const eventsCollection = collection(db, 'events')
      const eventSnapshot = await getDocs(eventsCollection)
      const eventList = eventSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Event[]
      setEvents(eventList)
    }

    const fetchShops = async () => {
      const shopsCollection = collection(db, 'shops')
      const shopSnapshot = await getDocs(shopsCollection)
      const shopList = shopSnapshot.docs.map(doc => ({
        id: doc.id,
        name: doc.data().name
      }))
      setShops(shopList)
    }

    if (user && role === 'admin') {
      fetchEvents()
      fetchShops()
    }
  }, [user, role])

  const handleAddEvent = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const eventData = {
        name: newEvent.name,
        description: newEvent.description,
        category: newEvent.category,
        startDate: newEvent.startDate,
        endDate: newEvent.endDate,
        startTime: newEvent.startTime,
        endTime: newEvent.endTime,
        venue: newEvent.venue,
        advertisement: newEvent.advertisement,
        socialMediaLinks: newEvent.socialMediaLinks,
        status: newEvent.status,
        shopId: newEvent.shopId,
        shopName: newEvent.shopName
      }
      const docRef = await addDoc(collection(db, 'events'), eventData)
      setEvents([...events, { id: docRef.id, ...eventData }])
      setNewEvent({
        name: '',
        description: '',
        category: '',
        startDate: '',
        endDate: '',
        startTime: '',
        endTime: '',
        venue: '',
        advertisement: '',
        socialMediaLinks: '',
        status: 'active',
        shopId: '',
        shopName: ''
      })
    } catch (error) {
      console.error('Error adding event:', error)
      setError('Failed to add event')
    }
  }

  const handleUpdateEvent = async (event: Event) => {
    try {
      await updateDoc(doc(db, 'events', event.id), event)
      setEvents(events.map(e => e.id === event.id ? event : e))
      setEditingEvent(null)
    } catch (error) {
      console.error('Error updating event:', error)
      setError('Failed to update event')
    }
  }

  const handleDeleteEvent = async (eventId: string) => {
    try {
      await deleteDoc(doc(db, 'events', eventId))
      setEvents(events.filter(event => event.id !== eventId))
    } catch (error) {
      console.error('Error deleting event:', error)
      setError('Failed to delete event')
    }
  }

  const handleEditEvent = (event: Event) => {
    setEditingEvent(event)
  }

  if (loading) return <div className="flex justify-center items-center h-screen"><div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div></div>
  if (!user || role !== 'admin') return null

  return (
    <div className="container mx-auto p-4 space-y-8">
      <h1 className="text-3xl font-bold mb-4 text-primary">Edit Ongoing Events</h1>
      {error && <p className="text-red-500">{error}</p>}
      <form onSubmit={handleAddEvent} className="space-y-4 bg-white shadow-lg rounded-lg p-6">
        <div>
          <Label htmlFor="name">Event Name</Label>
          <Input
            id="name"
            value={newEvent.name}
            onChange={(e) => setNewEvent({ ...newEvent, name: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={newEvent.description}
            onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="category">Category</Label>
          <Select 
            value={newEvent.category} 
            onValueChange={(value) => setNewEvent({ ...newEvent, category: value })}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Category" />
            </SelectTrigger>
            <SelectContent>
              {eventCategories.map((category) => (
                <SelectItem key={category} value={category}>{category}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="startDate">Start Date</Label>
          <Input
            id="startDate"
            type="date"
            value={newEvent.startDate}
            onChange={(e) => setNewEvent({ ...newEvent, startDate: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="endDate">End Date</Label>
          <Input
            id="endDate"
            type="date"
            value={newEvent.endDate}
            onChange={(e) => setNewEvent({ ...newEvent, endDate: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="startTime">Start Time</Label>
          <Input
            id="startTime"
            type="time"
            value={newEvent.startTime}
            onChange={(e) => setNewEvent({ ...newEvent, startTime: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="endTime">End Time</Label>
          <Input
            id="endTime"
            type="time"
            value={newEvent.endTime}
            onChange={(e) => setNewEvent({ ...newEvent, endTime: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="venue">Venue</Label>
          <Input
            id="venue"
            value={newEvent.venue}
            onChange={(e) => setNewEvent({ ...newEvent, venue: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="advertisement">Advertisement</Label>
          <Textarea
            id="advertisement"
            value={newEvent.advertisement}
            onChange={(e) => setNewEvent({ ...newEvent, advertisement: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="socialMediaLinks">Social Media Links</Label>
          <Input
            id="socialMediaLinks"
            value={newEvent.socialMediaLinks}
            onChange={(e) => setNewEvent({ ...newEvent, socialMediaLinks: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="shop">Shop</Label>
          <Select 
            value={newEvent.shopId} 
            onValueChange={(value) => {
              const selectedShop = shops.find(shop => shop.id === value)
              setNewEvent({ ...newEvent, shopId: value, shopName: selectedShop?.name || '' })
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Shop" />
            </SelectTrigger>
            <SelectContent>
              {shops.map((shop) => (
                <SelectItem key={shop.id} value={shop.id}>{shop.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button type="submit">Add Event</Button>
      </form>

      <h2 className="text-2xl font-bold mb-4">Current Events</h2>
      <div className="space-y-4">
        {events.map((event) => (
          <div key={event.id} className="bg-white shadow-lg rounded-lg p-6">
            {editingEvent && editingEvent.id === event.id ? (
              <form onSubmit={(e) => {
                e.preventDefault()
                handleUpdateEvent(editingEvent)
              }} className="space-y-4">
                <div>
                  <Label htmlFor={`edit-name-${event.id}`}>Event Name</Label>
                  <Input
                    id={`edit-name-${event.id}`}
                    value={editingEvent.name}
                    onChange={(e) => setEditingEvent({ ...editingEvent, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor={`edit-description-${event.id}`}>Description</Label>
                  <Textarea
                    id={`edit-description-${event.id}`}
                    value={editingEvent.description}
                    onChange={(e) => setEditingEvent({ ...editingEvent, description: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor={`edit-category-${event.id}`}>Category</Label>
                  <Select 
                    value={editingEvent.category} 
                    onValueChange={(value) => setEditingEvent({ ...editingEvent, category: value })}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                    <SelectContent>
                      {eventCategories.map((category) => (
                        <SelectItem key={category} value={category}>{category}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor={`edit-startDate-${event.id}`}>Start Date</Label>
                  <Input
                    id={`edit-startDate-${event.id}`}
                    type="date"
                    value={editingEvent.startDate}
                    onChange={(e) => setEditingEvent({ ...editingEvent, startDate: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor={`edit-endDate-${event.id}`}>End Date</Label>
                  <Input
                    id={`edit-endDate-${event.id}`}
                    type="date"
                    value={editingEvent.endDate}
                    onChange={(e) => setEditingEvent({ ...editingEvent, endDate: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor={`edit-startTime-${event.id}`}>Start Time</Label>
                  <Input
                    id={`edit-startTime-${event.id}`}
                    type="time"
                    value={editingEvent.startTime}
                    onChange={(e) => setEditingEvent({ ...editingEvent, startTime: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor={`edit-endTime-${event.id}`}>End Time</Label>
                  <Input
                    id={`edit-endTime-${event.id}`}
                    type="time"
                    value={editingEvent.endTime}
                    onChange={(e) => setEditingEvent({ ...editingEvent, endTime: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor={`edit-venue-${event.id}`}>Venue</Label>
                  <Input
                    id={`edit-venue-${event.id}`}
                    value={editingEvent.venue}
                    onChange={(e) => setEditingEvent({ ...editingEvent, venue: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor={`edit-advertisement-${event.id}`}>Advertisement</Label>
                  <Textarea
                    id={`edit-advertisement-${event.id}`}
                    value={editingEvent.advertisement}
                    onChange={(e) => setEditingEvent({ ...editingEvent, advertisement: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor={`edit-socialMediaLinks-${event.id}`}>Social Media Links</Label>
                  <Input
                    id={`edit-socialMediaLinks-${event.id}`}
                    value={editingEvent.socialMediaLinks}
                    onChange={(e) => setEditingEvent({ ...editingEvent, socialMediaLinks: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor={`edit-shop-${event.id}`}>Shop</Label>
                  <Select 
                    value={editingEvent.shopId} 
                    onValueChange={(value) => {
                      const selectedShop = shops.find(shop => shop.id === value)
                      setEditingEvent({ ...editingEvent, shopId: value, shopName: selectedShop?.name || '' })
                    }}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Shop" />
                    </SelectTrigger>
                    <SelectContent>
                      {shops.map((shop) => (
                        <SelectItem key={shop.id} value={shop.id}>{shop.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex space-x-2">
                  <Button type="submit">Save Changes</Button>
                  <Button type="button" variant="outline" onClick={() => setEditingEvent(null)}>Cancel</Button>
                </div>
              </form>
            ) : (
              <>
                <h3 className="text-xl font-semibold">{event.name}</h3>
                <p>Shop: {event.shopName}</p>
                <p>Category: {event.category}</p>
                <p>From: {event.startDate} {event.startTime} To: {event.endDate} {event.endTime}</p>
                <p>Venue: {event.venue}</p>
                <p>Status: {event.status}</p>
                <div className="mt-4 space-x-2">
                  <Button onClick={() => handleEditEvent(event)}>Edit</Button>
                  <Select 
                    value={event.status} 
                    onValueChange={(value) => handleUpdateEvent({ ...event, status: value as 'active' | 'paused' | 'cancelled' })}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="paused">Paused</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button onClick={() => handleDeleteEvent(event.id)} variant="destructive">Delete</Button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

