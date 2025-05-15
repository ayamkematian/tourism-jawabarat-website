"use client";
import Image from "next/image"
import Link from "next/link"
import { CalendarIcon, ChevronRight } from "lucide-react"

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      {/* Header/Navigation */}
      <header className="container mx-auto px-4 py-2 flex flex-col sm:flex-row items-center justify-between">
        <div className="flex items-center gap-2 mb-4 sm:mb-0">
          <Image src="/tic.png" alt="Tourism Logo" width={70} height={70} />
          <div className="border-l-2 border-teal-600 pl-2">
            <Link href="/" className="text-[#008275] font-medium">Tourism Information Center</Link>
          </div>
        </div>
        <nav className="flex items-center gap-6">
          <Link href="#" className="text-gray-700 hover:text-teal-600 transition-colors">
            Profile
          </Link>
          <Link href="#" className="text-gray-700 hover:text-teal-600 transition-colors">
            Berita
          </Link>
          <Link href="/destinasi" className="text-gray-700 hover:text-teal-600 transition-colors">
            Destinasi Wisata
          </Link>
          <Link href="/login" className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700 transition-colors">
            Masuk
          </Link>
        </nav>
      </header>

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
          {/* News Item 1 */}
          <Link href="#">
            <div className="flex gap-4 transition-colors duration-200 hover:bg-[#008275]/5 rounded-lg p-2">
              <div className="w-32 h-24 bg-gray-200 rounded flex-shrink-0"></div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg">
                  Festival Topeng Cirebon 2025 Banjir Apresiasi, dari Masyarakat hingga Pemerintah Pusat
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  CIREBON - Pemerintah Daerah Kota Cirebon melalui Dinas Kebudayaan dan Pariwisata sukses menyelenggarakan
                  Festival Topeng Cirebon 2025. Kegiatan ini diadakan di Kota Cirebon, Sabtu 26 April 2025 dan...
                </p>
                <div className="flex items-center text-gray-500 text-sm mt-2">
                  <CalendarIcon className="w-4 h-4 mr-1" />
                  <span>Rabu, 30 April 2025</span>
                </div>
              </div>
            </div>
          </Link>

          {/* News Item 2 */}
          <Link href="#"> 
            <div className="flex gap-4 border-t pt-4 transition-colors duration-200 hover:bg-[#008275]/5 rounded-lg p-2">
              <div className="w-32 h-24 bg-gray-200 rounded flex-shrink-0"></div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg">
                  Rangkaian Peringatan 70 Tahun KAA, Kadisparbud Jabar Hadiri Seminar Hari Warisan Dunia
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  BANDUNG - Kepala Dinas Pariwisata dan Kebudayaan Provinsi Jawa Barat Bendra Sofyan menghadiri Seminar
                  Hari Warisan Dunia dalam rangka Peringatan 70 Tahun Konferensi Asia Afrika. Kegiatan tersebut...
                </p>
                <div className="flex items-center text-gray-500 text-sm mt-2">
                  <CalendarIcon className="w-4 h-4 mr-1" />
                  <span>Rabu, 30 April 2025</span>
                </div>
              </div>
            </div>
          </Link>

          {/* News Item 3 */}
          <Link href="#">
            <div className="flex gap-4 border-t pt-4 transition-colors duration-200 hover:bg-[#008275]/5 rounded-lg p-2">
              <div className="w-32 h-24 bg-gray-200 rounded flex-shrink-0"></div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg">
                  Kemenkebud RI dan PT Pos Indonesia Luncurkan Prangko Spesial Peringati 70 Tahun Konferensi Asia Afrika
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  BANDUNG - Kementerian Kebudayaan RI bersama PT Pos Indonesia menggelar Pameran Filateli dalam rangka
                  Peringatan 70 Tahun Konferensi Asia Afrika. Kegiatan dibuka secara langsung oleh...
                </p>
                <div className="flex items-center text-gray-500 text-sm mt-2">
                  <CalendarIcon className="w-4 h-4 mr-1" />
                  <span>Rabu, 30 April 2025</span>
                </div>
              </div>
            </div>
          </Link>

          {/* News Item 4 */}
          <Link href="#">
            <div className="flex gap-4 border-t pt-4 transition-colors duration-200 hover:bg-[#008275]/5 rounded-lg p-2">
              <div className="w-32 h-24 bg-gray-200 rounded flex-shrink-0"></div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg">
                  Workshop Fotografi, Storytelling dan Sosialisasi Hak Kekayaan Intelektual (HKI) untuk Peserta Uniqlo
                  Neighborhood Collaboration
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  BEKASI - Dinas Pariwisata dan Kebudayaan Provinsi Jawa Barat menggelar Workshop Fotografi dan
                  Storytelling serta Sosialisasi Hak Kekayaan Intelektual (HKI) kepada 24 peserta ekonomi kreatif di
                  wilayah Kota...
                </p>
                <div className="flex items-center text-gray-500 text-sm mt-2">
                  <CalendarIcon className="w-4 h-4 mr-1" />
                  <span>Rabu, 30 April 2025</span>
                </div>
              </div>
            </div>
          </Link>

          {/* News Item 5 */}
          <Link href="#">
            <div className="flex gap-4 border-t pt-4 transition-colors duration-200 hover:bg-[#008275]/5 rounded-lg p-2">
              <div className="w-32 h-24 bg-gray-200 rounded flex-shrink-0"></div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg">
                  Delegasi Uni Afrika Kunjungi Masjid Al Jabbar dan Galeri Rasulullah
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  BANDUNG - Sebanyak 17 Delegasi Uni Afrika (African Union) mengunjungi Masjid Raya Al Jabbar, Kota
                  Bandung, Rabu 23 April 2025. Kunjungan tersebut masuk agenda perjalanan dalam rangka peringatan 70 tahun
                  Konferensi...
                </p>
                <div className="flex items-center text-gray-500 text-sm mt-2">
                  <CalendarIcon className="w-4 h-4 mr-1" />
                  <span>Rabu, 30 April 2025</span>
                </div>
              </div>igra
            </div>
          </Link>
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
