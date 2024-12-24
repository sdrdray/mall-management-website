'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { auth, db } from '@/lib/firebase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [adminPasskey, setAdminPasskey] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      const user = userCredential.user
      const userDoc = await getDoc(doc(db, 'users', user.uid))
      const userData = userDoc.data()
      if (userData?.role === 'admin') {
        if (adminPasskey !== '123') {
          throw new Error('Invalid admin passkey')
        }
        router.push('/admin')
      } else {
        router.push('/customer')
      }
    } catch (error) {
      setError('Failed to log in')
      console.error(error)
    }
  }

  return (
    <div className="container mx-auto p-4 max-w-md">
      <h1 className="text-3xl font-bold mb-6 text-center text-yellow-500">Login</h1>
      {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email</Label>
          <Input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring focus:ring-yellow-200 focus:ring-opacity-50 transition duration-200"
          />
        </div>
        <div>
          <Label htmlFor="password" className="text-sm font-medium text-gray-700">Password</Label>
          <Input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring focus:ring-yellow-200 focus:ring-opacity-50 transition duration-200"
          />
        </div>
        <div>
          <Label htmlFor="adminPasskey" className="text-sm font-medium text-gray-700">Admin Passkey (only for admins)</Label>
          <Input
            type="password"
            id="adminPasskey"
            value={adminPasskey}
            onChange={(e) => setAdminPasskey(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring focus:ring-yellow-200 focus:ring-opacity-50 transition duration-200"
          />
        </div>
        <Button type="submit" className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded transition duration-200">
          Login
        </Button>
      </form>
      <p className="mt-6 text-center">
        Don't have an account? <Link href="/register" className="text-blue-500 hover:underline">Register here</Link>
      </p>
    </div>
  )
}

