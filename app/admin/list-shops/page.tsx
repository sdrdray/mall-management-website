'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { db } from '@/lib/firebase'
import { collection, getDocs } from 'firebase/firestore'

interface Shop {
  id: string;
  name: string;
  floor: number;
  imageUrl: string;
}

export default function AdminListAllShop() {
  const [shops, setShops] = useState<Shop[]>([])

  useEffect(() => {
    const fetchShops = async () => {
      const shopsCollection = collection(db, 'shops')
      const shopSnapshot = await getDocs(shopsCollection)
      const shopList = shopSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Shop[]
      setShops(shopList)
    }

    fetchShops()
  }, [])

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">All Shops</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {shops.map((shop) => (
          <div key={shop.id} className="bg-white p-4 rounded-lg shadow">
            {shop.imageUrl && shop.imageUrl !== "" ? (
              <img src={shop.imageUrl} alt={shop.name} className="w-full h-48 object-cover rounded-md mb-2" />
            ) : (
              <div className="w-full h-48 bg-gray-200 rounded-md mb-2 flex items-center justify-center">
                <span className="text-gray-500">No image</span>
              </div>
            )}
            <h2 className="text-xl font-semibold">{shop.name}</h2>
            <p>Floor: {shop.floor}</p>
            <Link href={`/admin/edit-shop/${shop.id}`}>
              <Button className="mt-2">Edit</Button>
            </Link>
          </div>
        ))}
      </div>
      <Link href="/admin">
        <Button className="mt-4" variant="outline">Back to Admin Home</Button>
      </Link>
    </div>
  )
}

