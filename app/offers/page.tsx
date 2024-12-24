'use client'

import React, { useEffect, useState } from 'react'
import { db } from '@/lib/firebase'
import { collection, getDocs } from 'firebase/firestore'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'

interface Offer {
  id: string;
  shopId: string;
  shopName: string;
  itemName: string;
  discount: number;
  expiryDate: string;
}

export default function OffersPage() {
  const [offers, setOffers] = useState<Offer[]>([])
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  useEffect(() => {
    const fetchOffers = async () => {
      const offersCollection = collection(db, 'offers')
      const offerSnapshot = await getDocs(offersCollection)
      const offerList = offerSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Offer[]
      setOffers(offerList)
    }

    fetchOffers()
  }, [])

  if (loading) return <div>Loading...</div>
  if (!user) return null

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Current Offers</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {offers.map((offer) => (
          <div key={offer.id} className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-xl font-semibold">{offer.shopName}</h2>
            <p className="text-lg">{offer.itemName}</p>
            <p className="text-green-600 font-bold">{offer.discount}% OFF</p>
            <p className="text-sm text-gray-500">Expires: {offer.expiryDate}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

