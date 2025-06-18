"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Share2, Calendar } from "lucide-react"
import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { toast } from "sonner"
import { supabase } from "@/lib/supabaseClient"

export default function IsiberitaClient() {
  const [artikel, setArtikel] = useState<any>(null)
  const [beritaLain, setBeritaLain] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const searchParams = useSearchParams()
  const id = searchParams.get("id")

  useEffect(() => {
    const fetchArtikel = async () => {
      if (!id) return
      setLoading(true)
      const { data } = await supabase.from("artikel").select("*").eq("id", id).eq("status", "published").single()
      setArtikel(data)
      setLoading(false)
    }
    const fetchBeritaLain = async () => {
      if (!id) return
      const { data } = await supabase
        .from("artikel")
        .select("id, judul, excerpt, created_at, gambar")
        .eq("status", "published")
        .neq("id", id)
        .order("created_at", { ascending: false })
        .limit(3)
      setBeritaLain(data || [])
    }
    fetchArtikel()
    fetchBeritaLain()
  }, [id])

  const handleShare = () => {
    const shareUrl = typeof window !== "undefined" ? window.location.href : "";
    if (navigator.share) {
      navigator.share({
        title: artikel?.judul || "Berita",
        text: artikel?.excerpt || "",
        url: shareUrl,
      }).catch(() => {});
    } else {
      // Fallback: copy link ke clipboard
      navigator.clipboard.writeText(shareUrl);
      // Tampilkan notifikasi
      if (typeof toast === "function") {
        toast.success("Link postingan telah disalin!");
      } else {
        alert("Link postingan telah disalin!");
      }
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-gray-500">Loading...</div>
  }
  if (!artikel) {
    return <div className="min-h-screen flex items-center justify-center text-gray-500">Artikel tidak ditemukan atau belum dipublikasikan.</div>
  }

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <head><link rel="icon" href="/tic.png" /></head>
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
      <section className="relative h-[400px] bg-gradient-to-r from-black/70 to-black/50">
        {artikel.gambar ? (
          <Image
            src={artikel.gambar}
            alt={artikel.judul}
            fill
            className="object-cover opacity-30"
            priority
          />
        ) : (
          <div className="absolute inset-0 bg-gray-200 opacity-30" />
        )}
        <div className="absolute inset-0 bg-black/60"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
          <div className="text-white max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
              {artikel.judul}
            </h1>
            <div className="flex items-center space-x-4 mb-6">
              <div className="flex items-center space-x-2 text-[#b4b4b4]">
                <Calendar className="w-4 h-4" />
                <span>{new Date(artikel.created_at).toLocaleDateString("id-ID", { year: "numeric", month: "long", day: "numeric" })}</span>
              </div>
            </div>
            <Button
              className="bg-[#008275] hover:bg-[#02a191] text-white px-6 py-2"
              onClick={handleShare}
            >
              <Share2 className="w-4 h-4 mr-2" />
              Bagikan Postingan
            </Button>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col xl:flex-row gap-8">
          {/* Article Content */}
          <div className="xl:w-2/3 flex-1">
            {artikel.gambar && (
              <div className="mb-6">
                <Image
                  src={artikel.gambar}
                  alt={artikel.judul}
                  width={800}
                  height={400}
                  className="w-full h-auto rounded-lg"
                />
              </div>
            )}

            {/* Article Text */}
            <div className="prose prose-gray max-w-none">
              {artikel.konten?.split("\n").map((p: string, i: number) => (
                <p key={i} className="text-[#363636] leading-relaxed mb-4">{p}</p>
              ))}
              <p className="text-[#363636] leading-relaxed mt-8">
                <strong>Penulis:</strong> {artikel.author_name || "-"}
              </p>
            </div>
          </div>

          {/* Right Sidebar - Berita Lain */}
          <div className="xl:w-1/3 w-full">
            <div className="sticky top-8">
              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-[#363636] mb-6">Berita Lain</h3>
                <div className="space-y-6">
                  {beritaLain.length === 0 ? (
                    <div className="text-gray-400 text-sm">Tidak ada berita lain.</div>
                  ) : (
                    beritaLain.map((item) => (
                      <Link
                        key={item.id}
                        href={`/isiberita?id=${item.id}`}
                        className="block border-b border-gray-100 pb-4 last:border-b-0 last:pb-0 hover:bg-gray-50 rounded-lg transition"
                      >
                        <div className="flex gap-3 items-start bg-[#f5f5f5] rounded-lg p-4">
                          {item.gambar && (
                            <img src={item.gambar} alt={item.judul} className="w-16 h-12 object-cover rounded mr-2" />
                          )}
                          <div className="flex-1">
                            <h4 className="font-medium text-[#363636] mb-2 leading-tight text-sm line-clamp-2">{item.judul}</h4>
                            <p className="text-xs text-[#909090] mb-3 line-clamp-2">{item.excerpt}</p>
                            <div className="flex items-center text-xs text-[#939393]">
                              <Calendar className="w-3 h-3 mr-1" />
                              <span>{new Date(item.created_at).toLocaleDateString("id-ID", { year: "numeric", month: "long", day: "numeric" })}</span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
