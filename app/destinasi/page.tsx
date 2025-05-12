import Image from "next/image"
import Link from "next/link"
import { Search, ChevronRight } from "lucide-react"

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-6">
      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="stat-box">
          <p className="text-sm">Jumlah Wisatawan Lokal</p>
          <p className="text-2xl font-bold">10.000.000</p>
        </div>
        <div className="stat-box">
          <p className="text-sm">Kabupaten/Kota Terfavorit</p>
          <p className="text-sm font-bold">Kabupaten Bandung Barat</p>
        </div>
        <div className="stat-box">
          <p className="text-sm">Destinasi Wisata Terpopuler</p>
          <p className="text-sm font-bold">Curug Malela</p>
        </div>
        <div className="stat-box">
          <p className="text-sm">Jumlah Wisatawan Mancanegara</p>
          <p className="text-2xl font-bold">10.000.000</p>
        </div>
      </div>

      {/* Search Section */}
      <div className="flex flex-wrap gap-2 mb-6">
        <div className="flex items-center border border-gray-300 rounded-full px-4 py-1">
          <span className="text-sm">Wisata</span>
          <ChevronRight className="w-4 h-4 text-gray-400" />
        </div>
        <div className="flex items-center border border-gray-300 rounded-full px-4 py-1">
          <span className="text-sm">Kota/Kab</span>
          <ChevronRight className="w-4 h-4 text-gray-400" />
        </div>
        <div className="relative flex-grow">
          <input
            type="text"
            placeholder="Search..."
            className="w-full border border-gray-300 rounded-full px-4 py-1 pr-10"
          />
          <button className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500">
            <Search className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Featured Destinations */}
      <div className="relative bg-[#008275]/10 p-6 rounded-lg mb-8">
        <h2 className="text-2xl font-bold mb-2">
          7 Destinasi Wisata <br />
          Ter-favorit <br />
          <span className="text-[#fbbb0e]">Jawa Barat</span>
        </h2>
        <Link href="/destinasi" className="absolute bottom-4 right-4">
          <ChevronRight className="w-6 h-6 text-white bg-[#008275] rounded-full p-1" />
        </Link>
      </div>

      {/* Destination Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        <Link href="/destinasi/curug-malela" className="destination-card">
          <Image
            src="/curugmalela.jpg?height=150&width=300"
            alt="Curug Malela"
            width={300}
            height={150}
            className="w-full h-full object-cover"
          />
          <div className="label">Curug Malela</div>
          <div className="new-badge">New</div>
        </Link>
        <Link href="/destinasi/telaga-nilam" className="destination-card">
          <Image
            src="/telaganilem.jpeg?height=150&width=300"
            alt="Telaga Nilam"
            width={300}
            height={150}
            className="w-full h-full object-cover"
          />
          <div className="label">Telaga Nilam</div>
          <div className="new-badge">New</div>
        </Link>
        <Link href="/destinasi/gua-sunyaragi" className="destination-card">
          <Image
            src="/guasunyaragi.jpeg?height=150&width=300"
            alt="Gua Sunyaragi"
            width={300}
            height={150}
            className="w-full h-full object-cover"
          />
          <div className="label">Gua Sunyaragi</div>
          <div className="new-badge">New</div>
        </Link>
        <Link href="/destinasi/taman-safari" className="destination-card">
          <Image
            src="/tamansafari.jpeg?height=150&width=300"
            alt="Taman Safari"
            width={300}
            height={150}
            className="w-full h-full object-cover"
          />
          <div className="label">Taman Safari</div>
          <div className="new-badge">New</div>
        </Link>
        <Link href="/destinasi/gunung-papandayan" className="destination-card">
          <Image
            src="/gunungpapandayan.jpeg?height=150&width=300"
            alt="Gunung Papandayan"
            width={300}
            height={150}
            className="w-full h-full object-cover"
          />
          <div className="label">Gunung Papandayan</div>
          <div className="new-badge">New</div>
        </Link>
        <Link href="/destinasi/curug-putri" className="destination-card">
          <Image
            src="/curugputri.jpeg?height=150&width=300"
            alt="Curug Putri Palutungan"
            width={300}
            height={150}
            className="w-full h-full object-cover"
          />
          <div className="label">Curug Putri Palutungan</div>
          <div className="new-badge">New</div>
        </Link>
        <Link href="/destinasi/pantai-sayang" className="destination-card">
          <Image
            src="/sayangheulang.jpeg?height=150&width=300"
            alt="Pantai Sayang Heulang"
            width={300}
            height={150}
            className="w-full h-full object-cover"
          />
          <div className="label">Pantai Sayang Heulang</div>
          <div className="new-badge">New</div>
        </Link>
        <Link href="/destinasi/canal-batujaya" className="destination-card">
          <Image
            src="/candijiwa.jpeg?height=150&width=300"
            alt="Canal Jiwa Batujaya"
            width={300}
            height={150}
            className="w-full h-full object-cover"
          />
          <div className="label">Canal Jiwa Batujaya</div>
          <div className="new-badge">New</div>
        </Link>
        <Link href="/destinasi/keraton-kasepuhan" className="destination-card">
          <Image
            src="/keratonkasepuhan.jpeg?height=150&width=300"
            alt="Keraton Kasepuhan"
            width={300}
            height={150}
            className="w-full h-full object-cover"
          />
          <div className="label">Keraton Kasepuhan</div>
          <div className="new-badge">New</div>
        </Link>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-8">
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
    </div>
  )
}
