'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { db } from '@/lib/firebase'
import { doc, getDoc, collection, getDocs } from 'firebase/firestore'
import { useAuth } from '@/hooks/useAuth'

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
  category: string; // Added category field
}

interface Item {
  id: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
}

interface Offer {
  id: string;
  name: string;
  offerId: string;
  price: number;
  startDate: string;
  endDate: string;
  discount: number;
  stock: number;
}

export default function ShopDetailsPage({ params }: { params: { id: string } }) {
  const [shop, setShop] = useState<Shop | null>(null)
  const [items, setItems] = useState<Item[]>([])
  const [offers, setOffers] = useState<Offer[]>([])
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

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

      const offersCollection = collection(db, 'shops', params.id, 'offers')
      const offersSnapshot = await getDocs(offersCollection)
      const offersList = offersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Offer[]
      setOffers(offersList)
    }

    if (user) {
      fetchShopData()
    }
  }, [user, params.id])

  if (loading) return <div>Loading...</div>
  if (!user) return null
  if (!shop) return <div>Shop not found</div>

  return (
    <div className="container mx-auto p-4">
      <Link href="/customer">
        <Button variant="outline" className="mb-4">Back to Shops</Button>
      </Link>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <h1 className="text-3xl font-bold mb-4">{shop.name}</h1>
          {shop.imageUrl && shop.imageUrl !== "" ? (
            <img src={shop.imageUrl} alt={shop.name} className="w-full h-64 object-cover rounded-lg mb-4" />
          ) : (
            <div className="w-full h-64 bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
              <span className="text-gray-500">No image available</span>
            </div>
          )}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p><strong>Shop Number:</strong> {shop.shopNumber}</p>
              <p><strong>Floor:</strong> {shop.floor}</p>
              <p><strong>Owner:</strong> {shop.ownerName}</p>
              <p><strong>Occupation:</strong> {shop.ownerOccupation}</p>
              <p><strong>Category:</strong> {shop.category}</p> {/* Added Category */}
            </div>
            <div>
              <p><strong>Mobile:</strong> {shop.mobileNumber}</p>
              <p><strong>Email:</strong> {shop.email}</p>
              <p><strong>Social Media:</strong> <a href={shop.socialMediaLink} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">{shop.socialMediaLink}</a></p>
            </div>
          </div>

          <h2 className="text-2xl font-bold mt-8 mb-4">Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {items.map((item) => (
              <div key={item.id} className="border p-4 rounded-lg">
                {item.imageUrl && item.imageUrl !== "" ? (
                  <img src={item.imageUrl} alt={item.name} className="w-full h-40 object-cover rounded-md mb-2" />
                ) : (
                  <div className="w-full h-40 bg-gray-200 rounded-md mb-2 flex items-center justify-center">
                    <span className="text-gray-500">No image</span>
                  </div>
                )}
                <h3 className="text-lg font-semibold">{item.name}</h3>
                <p>Price: ₹{item.price}</p>
                <p>In Stock: {item.quantity}</p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-4">Current Offers</h2>
          {offers.map((offer) => (
            <div key={offer.id} className="border p-4 rounded-lg mb-4">
              <h3 className="text-lg font-semibold">{offer.name}</h3>
              <p><strong>Offer ID:</strong> {offer.offerId}</p>
              <p><strong>Price:</strong> ${offer.price}</p>
              <p><strong>Discount:</strong> {offer.discount}%</p>
              <p><strong>Start Date:</strong> {new Date(offer.startDate).toLocaleDateString()}</p>
              <p><strong>End Date:</strong> {new Date(offer.endDate).toLocaleDateString()}</p>
              <p><strong>Stock:</strong> {offer.stock}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

