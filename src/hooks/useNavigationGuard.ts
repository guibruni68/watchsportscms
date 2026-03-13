import { useState, useEffect, useRef, useCallback } from "react"
import { useBlocker } from "react-router-dom"

export function useNavigationGuard(isDirty: boolean) {
  // Keep a ref in sync so the stable blocker callback always reads current value
  const isDirtyRef = useRef(isDirty)
  isDirtyRef.current = isDirty

  // Stable function reference — registered once, never re-registered on dirty changes
  const blocker = useBlocker(
    useCallback(() => isDirtyRef.current, [])
  )

  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null)
  const [manualBlocked, setManualBlocked] = useState(false)

  // Protect against browser close / tab reload
  useEffect(() => {
    if (!isDirty) return
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault()
      e.returnValue = ""
    }
    window.addEventListener("beforeunload", handler)
    return () => window.removeEventListener("beforeunload", handler)
  }, [isDirty])

  const isBlocked = blocker.state === "blocked" || manualBlocked

  // For onClose-based navigation (inline forms that don't trigger the router)
  const guardNavigation = (action: () => void) => {
    if (isDirty) {
      setPendingAction(() => action)
      setManualBlocked(true)
    } else {
      action()
    }
  }

  const proceed = () => {
    if (blocker.state === "blocked") blocker.proceed?.()
    if (manualBlocked) {
      pendingAction?.()
      setManualBlocked(false)
      setPendingAction(null)
    }
  }

  const reset = () => {
    if (blocker.state === "blocked") blocker.reset?.()
    setManualBlocked(false)
    setPendingAction(null)
  }

  return { isBlocked, proceed, reset, guardNavigation }
}
