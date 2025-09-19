import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from 'geist/font/sans'
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import { AppProvider } from "@/lib/app-context"
import "./globals.css"

const geist = GeistSans

export const metadata: Metadata = {
  title: "Rhinoback - AI Backend Builder",
  description: "Build backends that absolutely slap with AI",
  generator: "Rhinoback",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
      </head>
      <body className={`font-sans ${geist.variable} antialiased tracking-tight`}>
        <AppProvider>
          <Suspense fallback={null}>
            {children}
            <Analytics />
          </Suspense>
        </AppProvider>
      </body>
    </html>
  )
}
