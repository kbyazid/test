'use client'

import { useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import { getUserTheme } from '@/action'

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { user, isSignedIn } = useUser()

  useEffect(() => {
    const initializeTheme = async () => {
      let theme = 'light'
      
      if (isSignedIn && user?.primaryEmailAddress?.emailAddress) {
        try {
          // Get theme from database for signed-in user
          theme = await getUserTheme(user.primaryEmailAddress.emailAddress)
        } catch (error) {
          console.error('Failed to load user theme:', error)
          // Fallback to localStorage
          theme = localStorage.getItem('theme') || 'light'
        }
      } else {
        // Use localStorage for non-signed-in users
        theme = localStorage.getItem('theme') || 'light'
      }
      
      document.documentElement.setAttribute('data-theme', theme)
      localStorage.setItem('theme', theme)
    }

    initializeTheme()
  }, [isSignedIn, user])

  return <>{children}</>
}