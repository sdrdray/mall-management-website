'use client'

import './globals.css'
import { Inter } from 'next/font/google'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { auth, analytics } from '@/lib/firebase'
import { signOut } from 'firebase/auth'
import { useEffect } from 'react'
import { logEvent } from 'firebase/analytics'

const inter = Inter({ subsets: ['latin'] })

function NavBar() {
  const { user, loading, role } = useAuth()

  const handleLogout = async () => {
    try {
      await signOut(auth)
      if (analytics) logEvent(analytics, 'logout')
    } catch (error) {
      console.error('Failed to log out', error)
    }
  }

  useEffect(() => {
    if (analytics && user) {
      logEvent(analytics, 'login', { method: 'email' })
    }
  }, [user])

  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">Mall Management</Link>
        <div className="space-x-4">
          {!loading && (
            user ? (
              <>
                {role === 'admin' ? (
                  <Link href="/admin" className="hover:text-gray-300">Admin</Link>
                ) : (
                  <Link href="/customer" className="hover:text-gray-300">Shops & Offers</Link>
                )}
                <Button onClick={handleLogout} variant="ghost">Logout</Button>
              </>
            ) : (
              <>
                <Link href="/login" className="hover:text-gray-300">Login</Link>
                <Link href="/register" className="hover:text-gray-300">Register</Link>
              </>
            )
          )}
        </div>
      </div>
    </nav>
  )
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  useEffect(() => {
    if (analytics) {
      logEvent(analytics, 'page_view')
    }
  }, [])

  return (
    <html lang="en">
      <body className={inter.className}>
        <NavBar />
        {children}
      </body>
    </html>
  )
}

