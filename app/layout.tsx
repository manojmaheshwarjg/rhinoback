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
  viewport: "width=device-width, initial-scale=1, maximum-scale=5",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
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
