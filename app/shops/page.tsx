'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/useAuth'
import { db } from '@/lib/firebase'
import { collection, getDocs } from 'firebase/firestore'
import { useRouter } from 'next/navigation'

interface Shop {
  id: string;
  name: string;
  floor: number;
}

interface Item {
  id: string;
  name: string;
  quantity: number;
}

interface Offer {
  id: string;
  itemName: string;
  discount: number;
  expiryDate: string;
}

export default function Shops() {
  const [shops, setShops] = useState<Shop[]>([])
  const [shopItems, setShopItems] = useState<{ [shopId: string]: Item[] }>({})
  const [shopOffers, setShopOffers] = useState<{ [shopId: string]: Offer[] }>({})
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  useEffect(() => {
    const fetchShops = async () => {
      const shopsCollection = collection(db, 'shops')
      const shopSnapshot = await getDocs(shopsCollection)
      const shopList = shopSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Shop[]
      setShops(shopList)

      // Fetch items and offers for each shop
      const itemsPromises = shopList.map(shop => 
        getDocs(collection(db, 'shops', shop.id, 'items'))
      )
      const offersPromises = shopList.map(shop => 
        getDocs(collection(db, 'shops', shop.id, 'offers'))
      )

      const itemsSnapshots = await Promise.all(itemsPromises)
      const offersSnapshots = await Promise.all(offersPromises)

      const newShopItems: { [shopId: string]: Item[] } = {}
      const newShopOffers: { [shopId: string]: Offer[] } = {}

      itemsSnapshots.forEach((snapshot, index) => {
        newShopItems[shopList[index].id] = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Item[]
      })

      offersSnapshots.forEach((snapshot, index) => {
        newShopOffers[shopList[index].id] = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Offer[]
      })

      setShopItems(newShopItems)
      setShopOffers(newShopOffers)
    }

    if (user) {
      fetchShops()
    }
  }, [user])

  if (loading) return <div>Loading...</div>
  if (!user) return null

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Our Shops</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {shops.map((shop) => (
          <div key={shop.id} className="border p-4 rounded-lg">
            <h2 className="text-xl font-semibold">{shop.name}</h2>
            <p>Floor: {shop.floor}</p>
            <h3 className="text-lg font-semibold mt-2">Items:</h3>
            <ul>
              {shopItems[shop.id]?.map((item) => (
                <li key={item.id}>{item.name} - Quantity: {item.quantity}</li>
              ))}
            </ul>
            <h3 className="text-lg font-semibold mt-2">Offers:</h3>
            {shopOffers[shop.id]?.length > 0 ? (
              <ul>
                {shopOffers[shop.id].map((offer) => (
                  <li key={offer.id}>{offer.itemName} - {offer.discount}% off (Expires: {offer.expiryDate})</li>
                ))}
              </ul>
            ) : (
              <p>No ongoing offers</p>
            )}
          </div>
        ))}
      </div>
      <Link href="/">
        <Button className="mt-4" variant="outline">Back to Home</Button>
      </Link>
    </div>
  )
}

