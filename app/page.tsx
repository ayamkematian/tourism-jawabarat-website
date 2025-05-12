import Image from "next/image"
import Link from "next/link"

export default function Home() {
  return (
    <div className="min-h-screen bg-[#fafafa]">
      {/* Header */}
      <header className="w-full bg-white py-4 px-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Image
            src="/tic.png?height=40&width=40"
            alt="Tourism Logo"
            width={40}
            height={40}
            className="text-[#008275]"
          />
          <span className="text-[#008275] font-medium">| Tourism Information Center</span>
        </div>
        <nav className="hidden md:flex items-center gap-6">
          <Link href="#" className="text-[#4a4a4a] hover:text-[#008275]">
            Profile
          </Link>
          <Link href="#" className="text-[#4a4a4a] hover:text-[#008275]">
            Berita
          </Link>
          <Link href="/destinasi" className="text-[#4a4a4a] hover:text-[#008275]">
            Destinasi Wisata
          </Link>
          <Link href="#" className="text-[#4a4a4a] hover:text-[#008275]">
            Galeri
          </Link>
          <Link href="#" className="text-[#4a4a4a] hover:text-[#008275]">
            Kontak
          </Link>
          <Link
            href="/login"
            className="bg-[#008275] text-white px-4 py-1.5 rounded hover:bg-[#006e67] transition-colors"
          >
            Masuk
          </Link>
        </nav>
      </header>

      {/* Hero Section */}
      <div className="relative h-[calc(100vh-72px)] w-full">
        <Image
          src="/JawaBarat.png?height=800&width=1200"
          alt="Jawa Barat Tourism"
          fill
          className="object-cover"
          priority
        />

        {/* Info Card */}
        <div className="absolute bottom-12 left-12 max-w-md">
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <h2 className="text-[#2d2d2d] text-xl font-semibold mb-2">Tourism Information Center</h2>
            <p className="text-[#4a4a4a] text-sm mb-4">
              Informasi Lengkap di Ujung Jari. Wujudkan Liburan Hebat Sepanjang Hari!
            </p>
            <button className="w-full bg-[#1e1e1e] text-white py-3 rounded hover:bg-black transition-colors">
              Mulai
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
