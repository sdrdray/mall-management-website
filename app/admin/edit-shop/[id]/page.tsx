'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { ImageUploader } from '@/components/ImageUploader'
import { db, storage } from '@/lib/firebase'
import { doc, getDoc, updateDoc, collection, addDoc, getDocs, deleteDoc } from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { useAuth } from '@/hooks/useAuth'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface Shop {
  id: string;
  name: string;
  shopNumber: string;
  floor: number;
  ownerName: string;
  ownerOccupation: string;
  mobileNumber: string;
  email: string;
  socialMediaLink: string;
  imageUrl: string;
  category: string;
}

interface Item {
  id: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
  category: string;
}

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

interface Offer {
  id: string;
  itemCategory: string;
  discountPercentage: number;
  startDate: string;
  endDate: string;
}

export default function EditShopPage({ params }: { params: { id: string } }) {
  const [shop, setShop] = useState<Shop | null>(null)
  const [items, setItems] = useState<Item[]>([])
  const [events, setEvents] = useState<Event[]>([])
  const [offers, setOffers] = useState<Offer[]>([])
  const [newItemName, setNewItemName] = useState('')
  const [newItemPrice, setNewItemPrice] = useState('')
  const [newItemQuantity, setNewItemQuantity] = useState('')
  const [newItemCategory, setNewItemCategory] = useState('')
  const [newItemImage, setNewItemImage] = useState<string>('')
  const [newEventName, setNewEventName] = useState('')
  const [newEventDescription, setNewEventDescription] = useState('')
  const [newEventCategory, setNewEventCategory] = useState('')
  const [newEventStartDate, setNewEventStartDate] = useState('')
  const [newEventEndDate, setNewEventEndDate] = useState('')
  const [newEventStartTime, setNewEventStartTime] = useState('')
  const [newEventEndTime, setNewEventEndTime] = useState('')
  const [newEventVenue, setNewEventVenue] = useState('')
  const [newEventAdvertisement, setNewEventAdvertisement] = useState('')
  const [newEventSocialMediaLinks, setNewEventSocialMediaLinks] = useState('')
  const [newOfferItemCategory, setNewOfferItemCategory] = useState('')
  const [newOfferDiscountPercentage, setNewOfferDiscountPercentage] = useState('')
  const [newOfferStartDate, setNewOfferStartDate] = useState('')
  const [newOfferEndDate, setNewOfferEndDate] = useState('')
  const [error, setError] = useState('')
  const { user, loading, role } = useAuth()
  const router = useRouter()
  const categories = ['Electronics', 'Clothing', 'Food', 'Books', 'Other'];
  const eventCategories = ['Music', 'Sale', 'Exhibition', 'Other'];
  const [newShopImage, setNewShopImage] = useState<string>('')

  useEffect(() => {
    if (!loading && (!user || role !== 'admin')) {
      router.push('/')
    }
  }, [user, loading, role, router])

  useEffect(() => {
    const fetchShopData = async () => {
      const shopDoc = await getDoc(doc(db, 'shops', params.id))
      if (shopDoc.exists()) {
        setShop({ id: shopDoc.id, ...shopDoc.data() } as Shop)
      }

      const itemsCollection = collection(db, 'shops', params.id, 'items')
      const itemsSnapshot = await getDocs(itemsCollection)
      const itemsList = itemsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Item[]
      setItems(itemsList)

      const eventsCollection = collection(db, 'shops', params.id, 'events')
      const eventsSnapshot = await getDocs(eventsCollection)
      const eventsList = eventsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Event[]
      setEvents(eventsList)

      const offersCollection = collection(db, 'shops', params.id, 'offers')
      const offersSnapshot = await getDocs(offersCollection)
      const offersList = offersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Offer[]
      setOffers(offersList)
    }

    fetchShopData()
  }, [params.id])

  const handleUpdateShop = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!shop) return
    try {
      let updateData: any = {
        name: shop.name,
        shopNumber: shop.shopNumber,
        floor: shop.floor,
        ownerName: shop.ownerName,
        ownerOccupation: shop.ownerOccupation,
        mobileNumber: shop.mobileNumber,
        email: shop.email,
        socialMediaLink: shop.socialMediaLink,
        category: shop.category,
      }

      if (newShopImage) {
        updateData.imageUrl = newShopImage
      }

      await updateDoc(doc(db, 'shops', shop.id), updateData)
      router.push('/admin')
    } catch (error) {
      setError('Failed to update shop')
      console.error(error)
    }
  }

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const newItem = {
        name: newItemName,
        price: parseFloat(newItemPrice),
        quantity: parseInt(newItemQuantity),
        category: newItemCategory,
        imageUrl: newItemImage
      }
      const docRef = await addDoc(collection(db, 'shops', params.id, 'items'), newItem)
      setItems([...items, { id: docRef.id, ...newItem }])
      setNewItemName('')
      setNewItemPrice('')
      setNewItemQuantity('')
      setNewItemCategory('')
      setNewItemImage('')
    } catch (error) {
      console.error('Error adding item:', error)
      setError('Failed to add item')
    }
  }

  const handleUpdateItem = async (item: Item) => {
    await updateDoc(doc(db, 'shops', params.id, 'items', item.id), {
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      category: item.category,
      imageUrl: item.imageUrl
    })
    setItems(items.map(i => i.id === item.id ? item : i))
  }

  const handleDeleteItem = async (itemId: string) => {
    await deleteDoc(doc(db, 'shops', params.id, 'items', itemId))
    setItems(items.filter(item => item.id !== itemId))
  }

  const handleAddEvent = async (e: React.FormEvent) => {
    e.preventDefault()
    const newEvent = {
      name: newEventName,
      description: newEventDescription,
      category: newEventCategory,
      startDate: newEventStartDate,
      endDate: newEventEndDate,
      startTime: newEventStartTime,
      endTime: newEventEndTime,
      venue: newEventVenue,
      advertisement: newEventAdvertisement,
      socialMediaLinks: newEventSocialMediaLinks,
      status: 'active' as const,
      shopId: params.id,
      shopName: shop?.name || ''
    }
    try {
      const docRef = await addDoc(collection(db, 'events'), newEvent)
      setEvents([...events, { id: docRef.id, ...newEvent }])
      setNewEventName('')
      setNewEventDescription('')
      setNewEventCategory('')
      setNewEventStartDate('')
      setNewEventEndDate('')
      setNewEventStartTime('')
      setNewEventEndTime('')
      setNewEventVenue('')
      setNewEventAdvertisement('')
      setNewEventSocialMediaLinks('')
    } catch (error) {
      console.error('Error adding event:', error)
      setError('Failed to add event')
    }
  }

  const handleUpdateEvent = async (event: Event) => {
    try {
      await updateDoc(doc(db, 'events', event.id), event)
      setEvents(events.map(e => e.id === event.id ? event : e))
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

  const handleAddOffer = async (e: React.FormEvent) => {
    e.preventDefault()
    const newOffer = {
      itemCategory: newOfferItemCategory,
      discountPercentage: parseFloat(newOfferDiscountPercentage),
      startDate: newOfferStartDate,
      endDate: newOfferEndDate
    }
    const docRef = await addDoc(collection(db, 'shops', params.id, 'offers'), newOffer)
    setOffers([...offers, { id: docRef.id, ...newOffer }])
    setNewOfferItemCategory('')
    setNewOfferDiscountPercentage('')
    setNewOfferStartDate('')
    setNewOfferEndDate('')
  }

  const handleDeleteOffer = async (offerId: string) => {
    await deleteDoc(doc(db, 'shops', params.id, 'offers', offerId))
    setOffers(offers.filter(offer => offer.id !== offerId))
  }

  const handleShopImageUpload = (imageUrl: string) => {
    setNewShopImage(imageUrl)
  }

  const handleItemImageUpload = (imageUrl: string) => {
    setNewItemImage(imageUrl)
  }

  if (loading) return <div className="flex justify-center items-center h-screen"><div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div></div>
  if (!user || role !== 'admin') return null
  if (!shop) return <div className="text-center text-2xl mt-8">Shop not found</div>

  return (
    <div className="container mx-auto p-4 space-y-8">
      <h1 className="text-3xl font-bold mb-4 text-primary">Edit Shop: {shop?.name}</h1>
      <form onSubmit={handleUpdateShop} className="space-y-6 bg-white shadow-lg rounded-lg p-6">
        <div>
          <Label htmlFor="name">Shop Name</Label>
          <Input
            id="name"
            value={shop.name}
            onChange={(e) => setShop({ ...shop, name: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="shopNumber">Shop Number</Label>
          <Input
            id="shopNumber"
            value={shop.shopNumber}
            onChange={(e) => setShop({ ...shop, shopNumber: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="floor">Floor</Label>
          <Input
            id="floor"
            type="number"
            value={shop.floor}
            onChange={(e) => setShop({ ...shop, floor: parseInt(e.target.value) })}
            required
          />
        </div>
        <div>
          <Label htmlFor="ownerName">Owner Name</Label>
          <Input
            id="ownerName"
            value={shop.ownerName}
            onChange={(e) => setShop({ ...shop, ownerName: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="ownerOccupation">Owner Occupation</Label>
          <Input
            id="ownerOccupation"
            value={shop.ownerOccupation}
            onChange={(e) => setShop({ ...shop, ownerOccupation: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="mobileNumber">Mobile Number</Label>
          <Input
            id="mobileNumber"
            value={shop.mobileNumber}
            onChange={(e) => setShop({ ...shop, mobileNumber: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={shop.email}
            onChange={(e) => setShop({ ...shop, email: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="socialMediaLink">Social Media Link</Label>
          <Input
            id="socialMediaLink"
            value={shop.socialMediaLink}
            onChange={(e) => setShop({ ...shop, socialMediaLink: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="category">Category</Label>
          <Select 
            value={shop.category} 
            onValueChange={(value) => setShop({ ...shop, category: value })}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>{category}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="shopImage">Shop Image</Label>
          <ImageUploader onImageUpload={(url) => setShop({ ...shop, imageUrl: url })} folder="shops" />
          {shop.imageUrl && shop.imageUrl !== "" ? (
            <img src={shop.imageUrl} alt={shop.name} className="mt-2 max-w-xs rounded-lg shadow-md" />
          ) : (
            <div className="mt-2 max-w-xs h-40 bg-gray-200 rounded-lg shadow-md flex items-center justify-center">
              <span className="text-gray-500">No image uploaded</span>
            </div>
          )}
        </div>
        <Button type="submit" className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-2 px-4 rounded transition duration-200">Update Shop</Button>
      </form>

      <h2 className="text-2xl font-bold mb-4">Items</h2>
      <form onSubmit={handleAddItem} className="space-y-4 mb-4">
        <div>
          <Label htmlFor="itemName">Item Name</Label>
          <Input
            id="itemName"
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="itemPrice">Price</Label>
          <Input
            id="itemPrice"
            type="number"
            value={newItemPrice}
            onChange={(e) => setNewItemPrice(e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="itemQuantity">Quantity</Label>
          <Input
            id="itemQuantity"
            type="number"
            value={newItemQuantity}
            onChange={(e) => setNewItemQuantity(e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="itemCategory">Category</Label>
          <Select 
            value={newItemCategory} 
            onValueChange={setNewItemCategory}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>{category}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Item Image</Label>
          <ImageUploader onImageUpload={setNewItemImage} folder="items" />
        </div>
        <Button type="submit">Add Item</Button>
      </form>
      <ul className="space-y-2 mb-8">
        {items.map((item) => (
          <li key={item.id} className="flex items-center justify-between">
            <span>{item.name} - ₹{item.price} - Qty: {item.quantity} - Category: {item.category}</span>
            <div className="flex items-center space-x-2">
              <Input
                type="number"
                value={item.quantity}
                onChange={(e) => handleUpdateItem({ ...item, quantity: parseInt(e.target.value) })}
                className="w-20"
              />
              <Button onClick={() => handleDeleteItem(item.id)} variant="destructive">Delete</Button>
            </div>
          </li>
        ))}
      </ul>

      <h2 className="text-2xl font-bold mb-4">Events</h2>
      <form onSubmit={handleAddEvent} className="space-y-4 mb-4">
        <div>
          <Label htmlFor="eventName">Event Name</Label>
          <Input
            id="eventName"
            value={newEventName}
            onChange={(e) => setNewEventName(e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="eventDescription">Description</Label>
          <Textarea
            id="eventDescription"
            value={newEventDescription}
            onChange={(e) => setNewEventDescription(e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="eventCategory">Category</Label>
          <Select 
            value={newEventCategory} 
            onValueChange={setNewEventCategory}
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
          <Label htmlFor="eventStartDate">Start Date</Label>
          <Input
            id="eventStartDate"
            type="date"
            value={newEventStartDate}
            onChange={(e) => setNewEventStartDate(e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="eventEndDate">End Date</Label>
          <Input
            id="eventEndDate"
            type="date"
            value={newEventEndDate}
            onChange={(e) => setNewEventEndDate(e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="eventStartTime">Start Time</Label>
          <Input
            id="eventStartTime"
            type="time"
            value={newEventStartTime}
            onChange={(e) => setNewEventStartTime(e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="eventEndTime">End Time</Label>
          <Input
            id="eventEndTime"
            type="time"
            value={newEventEndTime}
            onChange={(e) => setNewEventEndTime(e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="eventVenue">Venue</Label>
          <Input
            id="eventVenue"
            value={newEventVenue}
            onChange={(e) => setNewEventVenue(e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="eventAdvertisement">Advertisement</Label>
          <Textarea
            id="eventAdvertisement"
            value={newEventAdvertisement}
            onChange={(e) => setNewEventAdvertisement(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="eventSocialMediaLinks">Social Media Links</Label>
          <Input
            id="eventSocialMediaLinks"
            value={newEventSocialMediaLinks}
            onChange={(e) => setNewEventSocialMediaLinks(e.target.value)}
          />
        </div>
        <Button type="submit">Add Event</Button>
      </form>
      <ul className="space-y-2 mb-8">
        {events.map((event) => (
          <li key={event.id} className="flex items-center justify-between">
            <span>{event.name} - From: {event.startDate} {event.startTime} To: {event.endDate} {event.endTime}</span>
            <div className="flex items-center space-x-2">
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
          </li>
        ))}
      </ul>

      <h2 className="text-2xl font-bold mb-4">Offers</h2>
      <form onSubmit={handleAddOffer} className="space-y-4 mb-4">
        <div>
          <Label htmlFor="offerItemCategory">Item Category</Label>
          <Select 
            value={newOfferItemCategory} 
            onValueChange={setNewOfferItemCategory}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>{category}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="offerDiscountPercentage">Discount Percentage</Label>
          <Input
            id="offerDiscountPercentage"
            type="number"
            value={newOfferDiscountPercentage}
            onChange={(e) => setNewOfferDiscountPercentage(e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="offerStartDate">Start Date</Label>
          <Input
            id="offerStartDate"
            type="date"
            value={newOfferStartDate}
            onChange={(e) => setNewOfferStartDate(e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="offerEndDate">End Date</Label>
          <Input
            id="offerEndDate"
            type="date"
            value={newOfferEndDate}
            onChange={(e) => setNewOfferEndDate(e.target.value)}
            required
          />
        </div>
        <Button type="submit">Add Offer</Button>
      </form>
      <ul className="space-y-2">
        {offers.map((offer) => (
          <li key={offer.id} className="flex items-center justify-between">
            <span>{offer.itemCategory} - {offer.discountPercentage}% off - From: {offer.startDate} To: {offer.endDate}</span>
            <Button onClick={() => handleDeleteOffer(offer.id)} variant="destructive">Delete</Button>
          </li>
        ))}
      </ul>
    </div>
  )
}

