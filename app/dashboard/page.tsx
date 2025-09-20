"use client"

import { useState } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { ChatInterface } from "@/components/chat-interface"
import { SchemaSummary } from "@/components/schema-summary"
import { Header } from "@/components/header"
import { SidebarProvider } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Database, X } from "lucide-react"

function DashboardContent() {
  const [isSchemaOpen, setIsSchemaOpen] = useState(false)

  return (
    <div className="h-screen w-full flex flex-col">
      <Header />

      {/* Mobile Schema Toggle Button */}
      <Button
        onClick={() => setIsSchemaOpen(true)}
        className="lg:hidden fixed bottom-20 right-4 z-50 h-12 w-12 rounded-full p-0 shadow-lg bg-gray-900 hover:bg-gray-800 text-white"
        size="sm"
      >
        <Database className="h-5 w-5" />
      </Button>

      {/* Main Content */}
      <div className="flex-1 flex w-full overflow-hidden pt-[44px] sm:pt-[52px] relative">
        {/* Left Sidebar */}
        <AppSidebar />

        {/* Main Content Area */}
        <main className="flex-1 w-full h-full mr-0 lg:mr-[380px] min-w-0">
          <ChatInterface />
        </main>

        {/* Desktop Right Sidebar */}
        <div className="hidden lg:block fixed right-0 top-[52px] bottom-0 w-[380px] min-w-[380px] border-l bg-background z-10">
          <SchemaSummary />
        </div>

        {/* Mobile Schema Panel */}
        {isSchemaOpen && (
          <>
            {/* Backdrop */}
            <div 
              className="lg:hidden fixed inset-0 bg-black/50 z-40"
              onClick={() => setIsSchemaOpen(false)}
            />
            {/* Panel */}
            <div className="lg:hidden fixed inset-x-0 top-0 bottom-0 z-50 bg-background max-w-md mx-auto border-x flex flex-col">
              <div className="flex items-center justify-between p-3 sm:p-4 border-b bg-white flex-shrink-0">
                <h2 className="text-lg font-semibold">Database Schema</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsSchemaOpen(false)}
                  className="h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex-1 overflow-y-auto min-h-0">
                <SchemaSummary />
              </div>
            </div>
          </>
        )}
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
