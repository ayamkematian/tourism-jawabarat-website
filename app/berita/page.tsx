"use client";
import Image from "next/image"
import Link from "next/link"
import { CalendarIcon, ChevronRight } from "lucide-react"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"

export default function Home() {
  const [berita, setBerita] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchBerita = async () => {
      setLoading(true)
      const { data, error } = await supabase
        .from("artikel")
        .select("*")
        .eq("status", "published")
        .order("created_at", { ascending: false })
      setBerita(data || [])
      setLoading(false)
    }
    fetchBerita()
  }, [])

  return (
    <main className="min-h-screen bg-white">
      {/* Navigation Bar */}
      <nav className="flex items-center justify-between px-4 py-3 bg-white shadow-sm md:px-8">
        <div className="flex items-center">
          <Image src="/tic.png" alt="Logo" width={70} height={70} className="mr-2" />
          <div className="border-l-2 border-teal-600 pl-2">
            <Link href="/" className="text-[#008275] font-semibold">Tourism Information Center</Link>
          </div>
        </div>
        <div className="hidden md:flex items-center space-x-6">
          <Link href="/profile" className="font-semibold text-[#4a4a4a] hover:text-[#008275]">
            Profile
          </Link>
          <Link href="/berita" className="font-semibold text-[#4a4a4a] hover:text-[#008275]">
            Berita
          </Link>
          <Link href="/destinasi" className="font-semibold text-[#4a4a4a] hover:text-[#008275]">
            Destinasi Wisata
          </Link>
          <Link href="/login" className="bg-teal-600 text-white px-4 py-2 hover:bg-[#006e67] rounded-md font-semibold">
            Masuk
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative bg-gray-800 text-white">
        <div className="absolute inset-0 z-0">
          <Image
            src="/JawaBarat.png?height=400&width=1920"
            alt="Tourism Background"
            fill
            className="object-cover opacity-30"
            priority
          />
        </div>
        <div className="container mx-auto px-4 py-16 relative z-10">
          <h1 className="text-4xl font-bold mb-4">Jelajahi Berita Terkini</h1>
          <p className="max-w-2xl">
            Dapatkan rangkuman berita terbaru dalam satu tempat. Baca berita terkini dari berbagai sumber untuk tetap
            update dengan perkembangan terbaru.
          </p>
        </div>
      </section>

      {/* News Section */}
      <section className="container mx-auto px-4 py-8">
        {/* News List */}
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-8 text-gray-500">Loading...</div>
          ) : berita.length === 0 ? (
            <div className="text-center py-8 text-gray-500">Belum ada berita yang dipublikasikan.</div>
          ) : (
            berita.map((item) => (
              <Link key={item.id} href={"/isiberita?id=" + item.id}>
                <div className="flex gap-4 border-t pt-4 transition-colors duration-200 hover:bg-[#008275]/5 rounded-lg p-2">
                  <div className="w-32 h-24 bg-gray-200 rounded flex-shrink-0 overflow-hidden">
                    {item.gambar && (
                      <Image src={item.gambar} alt={item.judul} width={128} height={96} className="w-full h-full object-cover" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{item.judul}</h3>
                    {item.excerpt && (
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">{item.excerpt}</p>
                    )}
                    <div className="flex items-center text-gray-500 text-sm mt-2">
                      <CalendarIcon className="w-4 h-4 mr-1" />
                      <span>{new Date(item.created_at).toLocaleDateString("id-ID", { year: "numeric", month: "long", day: "numeric" })}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
        
        {/* Pagination */}
        <div className="flex justify-between items-center mt-8 p-2">
          <button className="bg-[#008275] text-white px-4 py-2 rounded-md flex items-center gap-2">
            Next Page
            <ChevronRight className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-2">
            <span>Page</span>
              <input type="text" value="1" className="border border-gray-300 rounded w-12 px-2 py-1 text-center" readOnly />
            <span>of 100</span>
          </div>
        </div>
      </section>

      
    </main>
  )
}
