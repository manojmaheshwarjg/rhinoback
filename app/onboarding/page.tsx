"use client"
import { OnboardingFlow } from "@/components/onboarding-flow"
import { Header } from "@/components/header"
import { SidebarProvider } from "@/components/ui/sidebar"

export default function OnboardingPage() {
  return (
    <SidebarProvider>
      <div className="min-h-screen bg-background w-full">
        <Header />
        <OnboardingFlow />
      </div>
    </SidebarProvider>
  )
}
