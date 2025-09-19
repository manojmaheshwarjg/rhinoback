"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

// This will be replaced with actual auth/state management later
function useAppState() {
  // TODO: Replace with actual user state management
  // For now, always redirect to onboarding
  return {
    isAuthenticated: false,
    hasCompletedOnboarding: false,
    currentProject: null
  }
}

export default function RootPage() {
  const router = useRouter()
  const { isAuthenticated, hasCompletedOnboarding, currentProject } = useAppState()

  useEffect(() => {
    // Routing logic based on user state
    if (!isAuthenticated) {
      // TODO: Redirect to auth page when implemented
      router.push('/onboarding')
    } else if (!hasCompletedOnboarding) {
      router.push('/onboarding')
    } else if (!currentProject) {
      router.push('/onboarding')
    } else {
      router.push('/dashboard')
    }
  }, [router, isAuthenticated, hasCompletedOnboarding, currentProject])

  // Show loading state while routing
  return (
    <div className="min-h-screen w-full bg-background flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-muted-foreground">Loading RhinoBack...</p>
      </div>
    </div>
  )
}
