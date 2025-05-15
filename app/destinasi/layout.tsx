import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "../globals.css"
import Link from "next/link"
import Image from "next/image"

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
    <html lang="en">
      <body className={inter.className}>
        <header className="w-full bg-white shadow-sm">
          <div className="container mx-auto px-4 py-2 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Image
                src="/tic.png?height=40&width=40"
                alt="Logo"
                width={70}
                height={70}
                className="rounded-full"
              />
              <Link href="/" className="text-[#008275]">| Tourism Information Center</Link>
            </div>
            <nav className="hidden md:flex items-center gap-6 text-sm">
              <Link href="/" className="text-[#4a4a4a] hover:text-[#008275]">
                Profile
              </Link>
              <Link href="/berita" className="text-[#4a4a4a] hover:text-[#008275]">
                Berita
              </Link>
              <Link href="/destinasi" className="text-[#4a4a4a] hover:text-[#008275]">
                Destinasi Wisata
              </Link>
              <Link href="/login" className="bg-[#008275] text-white px-4 py-1 rounded-md">
                Masuk
              </Link>
            </nav>
            <button className="md:hidden">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-[#4a4a4a]"
              >
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            </button>
          </div>
        </header>
        <main>{children}</main>
      </body>
    </html>
  )
}
