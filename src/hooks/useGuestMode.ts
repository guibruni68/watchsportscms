import { useState, useEffect } from 'react'

export function useGuestMode() {
  const [isGuest, setIsGuest] = useState(false)

  useEffect(() => {
    const guestMode = localStorage.getItem('guestMode') === 'true'
    setIsGuest(guestMode)
  }, [])

  const enableGuestMode = () => {
    localStorage.setItem('guestMode', 'true')
    setIsGuest(true)
  }

  const disableGuestMode = () => {
    localStorage.removeItem('guestMode')
    setIsGuest(false)
  }

  return {
    isGuest,
    enableGuestMode,
    disableGuestMode
  }
}