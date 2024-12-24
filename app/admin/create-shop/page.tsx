'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ImageUpload } from '@/components/ImageUpload'
import { db, storage } from '@/lib/firebase'
import { collection, addDoc } from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { useAuth } from '@/hooks/useAuth'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export default function CreateShop() {
  const [name, setName] = useState('')
  const [shopNumber, setShopNumber] = useState('')
  const [floor, setFloor] = useState('')
  const [ownerName, setOwnerName] = useState('')
  const [ownerOccupation, setOwnerOccupation] = useState('')
  const [mobileNumber, setMobileNumber] = useState('')
  const [email, setEmail] = useState('')
  const [socialMediaLink, setSocialMediaLink] = useState('')
  const [image, setImage] = useState<File | null>(null)
  const [error, setError] = useState('')
  const [category, setCategory] = useState('')
  const categories = ['Electronics', 'Clothing', 'Food', 'Books', 'Other']; // Example categories
  const router = useRouter()
  const { user, loading, role } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (role !== 'admin') {
      setError('You do not have permission to create a shop')
      return
    }
    try {
      let imageUrl = ''
      if (image) {
        const storageRef = ref(storage, `shops/${Date.now()}_${image.name}`)
        await uploadBytes(storageRef, image)
        imageUrl = await getDownloadURL(storageRef)
      }

      await addDoc(collection(db, 'shops'), {
        name,
        shopNumber,
        floor: parseInt(floor),
        ownerName,
        ownerOccupation,
        mobileNumber,
        email,
        socialMediaLink,
        imageUrl,
        createdBy: user?.uid,
        createdAt: new Date().toISOString(),
        category
      })
      router.push('/admin')
    } catch (error) {
      setError('Failed to create shop')
      console.error(error)
    }
  }

  if (loading) return <div>Loading...</div>
  if (!user || role !== 'admin') {
    router.push('/')
    return null
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Create New Shop</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="name">Shop Name</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="shopNumber">Shop Number</Label>
          <Input
            id="shopNumber"
            value={shopNumber}
            onChange={(e) => setShopNumber(e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="floor">Floor</Label>
          <Input
            id="floor"
            type="number"
            value={floor}
            onChange={(e) => setFloor(e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="ownerName">Owner Name</Label>
          <Input
            id="ownerName"
            value={ownerName}
            onChange={(e) => setOwnerName(e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="ownerOccupation">Owner Occupation</Label>
          <Input
            id="ownerOccupation"
            value={ownerOccupation}
            onChange={(e) => setOwnerOccupation(e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="mobileNumber">Mobile Number</Label>
          <Input
            id="mobileNumber"
            value={mobileNumber}
            onChange={(e) => setMobileNumber(e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="socialMediaLink">Social Media Link</Label>
          <Input
            id="socialMediaLink"
            value={socialMediaLink}
            onChange={(e) => setSocialMediaLink(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="category">Category</Label>
          <Select onValueChange={(value) => setCategory(value)}>
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
          <Label>Shop Image</Label>
          <ImageUpload onImageUpload={setImage} />
        </div>
        <Button type="submit">Create Shop</Button>
      </form>
    </div>
  )
}

