import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Jawa Barat Tourism Information Center",
  description: "Tourism Information Center for Jawa Barat, Indonesia",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="id">
      <body className={`${inter.className} bg-gray-100 text-gray-900 flex flex-col min-h-screen`}>{children}</body>
    </html>
  )
}
