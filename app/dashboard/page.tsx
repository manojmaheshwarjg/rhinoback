"use client"

import { AppSidebar } from "@/components/app-sidebar"
import { ChatInterface } from "@/components/chat-interface"
import { SchemaPreview } from "@/components/schema-preview"
import { Header } from "@/components/header"
import { SidebarProvider } from "@/components/ui/sidebar"

function DashboardContent() {
  return (
    <div className="h-screen flex flex-col">
      <Header />

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden pt-14 relative">
        {/* Left Sidebar */}
        <AppSidebar />

        <main className="flex-1 min-w-0 min-h-0 transition-all duration-300" style={{ marginRight: "23.75rem" }}>
          <div className="h-full min-h-0 w-full">
            <ChatInterface />
          </div>
        </main>

        <div className="fixed right-0 top-14 bottom-0 w-[380px] min-w-[380px] border-l bg-background z-10">
          <SchemaPreview />
        </div>
      </div>
    </div>
  )
}

export default function Dashboard() {
  return (
    <SidebarProvider>
      <DashboardContent />
    </SidebarProvider>
  )
}
