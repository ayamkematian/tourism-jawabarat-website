import Image from "next/image"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Share2, Calendar } from "lucide-react"

export default function Component() {
  return (
    <div className="min-h-screen bg-[#fafafa]">

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
          <Link href="/login" className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-[#006e67] rounded-md font-semibold">
            Masuk
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative h-[400px] bg-gradient-to-r from-black/70 to-black/50">
        {/* Background Image with Opacity */}
        <Image
          src="/JawaBarat.png?height=1080&width=1920"
          alt="Tourism Background"
          fill
          className="object-cover opacity-30"
          priority
        />

        {/* Fallback/Overlay Background */}
        <div className="absolute inset-0 bg-[url('/Jawa Barat.png?height=800&width=1200')] bg-cover bg-center"></div>

        {/* Black Overlay for Readability */}
        <div className="absolute inset-0 bg-black/60"></div>

        {/* Content Container */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
          <div className="text-white max-w-2xl">
            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
              Festival Topeng Cirebon 2025
              <br />
              Banjir Apresiasi, dari Masyarakat
              <br />
              hingga Pemerintah Pusat
            </h1>

            {/* Date Info */}
            <div className="flex items-center space-x-4 mb-6">
              <div className="flex items-center space-x-2 text-[#b4b4b4]">
                <Calendar className="w-4 h-4" />
                <span>Rabu, 30 April 2025</span>
              </div>
            </div>

            {/* Share Button */}
            <Button className="bg-[#008275] hover:bg-[#02a191] text-white px-6 py-2">
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
            {/* Featured Image */}
            <div className="mb-6">
              <Image
                src="/fotoberita1.webp?height=400&width=800"
                alt="Festival Topeng Cirebon 2025"
                width={800}
                height={400}
                className="w-full h-auto rounded-lg"
              />
            </div>

            {/* Article Text */}
            <div className="prose prose-gray max-w-none">
              <p className="text-[#363636] leading-relaxed mb-4">
                CIREBON - Pemerintah Daerah Kota Cirebon melalui Dinas Kebudayaan dan Pariwisata sukses menyelenggarakan
                Festival Topeng Cirebon 2025. Kegiatan ini diadakan di Balai Kota Cirebon, Sabtu 26 April 2025 dan
                mendapatkan sambutan hangat dari masyarakat.
              </p>

              <p className="text-[#363636] leading-relaxed mb-4">
                Sebanyak enam maestro topeng yakni Nani Kasmini, Nuranani, Inu Kartapati, Roedah, Aeril Rasinah, dan
                Waryo Sela memberikan penampilan memukau di atas panggung. Hal tersebut tentunya diapresiasi oleh banyak
                pihak, termasuk Wali Kota Cirebon Effendi Edo yang sangat bangga dengan adanya festival budaya ini.
              </p>

              <p className="text-[#363636] leading-relaxed mb-4">
                "Dari penampilan para maestro, kita menyaksikan jagatan yang menari, hikmah yang bergerak, dan
                nilai-nilai luhur yang menjelmia dalam rupa wajah-wajah kayu yang penuh makna," kata Wali Kota Cirebon.
              </p>

              <p className="text-[#363636] leading-relaxed mb-4">
                "Karya dan pengetahuan para maestro ini tidak hanya memperkaya seni budaya, tetapi juga menjaga nyala
                api budaya yang nyaris padam," tuturnya.
              </p>

              <p className="text-[#363636] leading-relaxed mb-4">
                Selain pertunjukan kesenian, kegiatan ini juga diisi dengan seminar dan workshop yang memberikan ruang
                bagi generasi muda untuk memahami seni topeng. Kepala Dinas Kebudayaan dan Pariwisata Kota Cirebon Agus
                Sukmanjaya mengatakan antusiasme masyarakat begitu tinggi dan hal tersebut menjadi kabar baik dalam
                upaya pelestarian seni budaya daerah.
              </p>

              <p className="text-[#363636] leading-relaxed mb-4">
                "Ada workshop topeng, kemudian seminar, alhamdulillah antusiasme generasi muda cukup tinggi. Ini adalah
                langkah awal untuk menjadikan Festival Topeng Cirebon ke level nasional, bahkan internasional," ucapnya.
              </p>

              <p className="text-[#363636] leading-relaxed mb-4">
                Apresiasi juga diberikan oleh Direktur Jenderal Pelindungan Kebudayaan dan Tradisi Kementerian
                Kebudayaan RI Restu Gunawan. Dirinya juga memuja keberadaan Museum Topeng yang berlokasi di kawasan
                Gedung Balai Kota Cirebon.
              </p>

              <p className="text-[#363636] leading-relaxed mb-4">
                "Visi kebudayaan dari Kota Cirebon ini terlihat sangat nyata. Festival Topeng Cirebon 2025 telah
                mengukir sejarah baru yang akan dikenang dan dilestarikan kepada generasi mendatang," ujarnya.
              </p>

              <p className="text-[#363636] leading-relaxed mb-4">
                "Melalui berbagai seminar, workshop, dan dialog, festival ini menajak publik untuk memahami lebih dalam
                nilai-nilai yang terkandung dalam seni topeng, serta peranannya dalam kehidupan sehari-hari,"
                pungkasnya.
              </p>

              <p className="text-[#363636] leading-relaxed mb-4">
                Dalam kesempatan tersebut, dirangkaikan juga dengan penyerahan sertifikat resmi dari Kementerian
                Kebudayaan Republik Indonesia kepada Museum Topeng Cirebon.
              </p>

              <p className="text-[#363636] leading-relaxed">
                <strong>Penulis:</strong> Karto sudrotejo
              </p>
            </div>
          </div>

          {/* Right Sidebar - Berita Lain */}
          <div className="xl:w-1/3 w-full">
            <div className="sticky top-8">
              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-[#363636] mb-6">Berita Lain</h3>

                <div className="space-y-6">
                  {[1, 2, 3].map((item) => (
                    <div key={item} className="border-b border-gray-100 pb-4 last:border-b-0 last:pb-0">
                      <div className="bg-[#f5f5f5] rounded-lg p-4">
                        <h4 className="font-medium text-[#363636] mb-2 leading-tight text-sm">
                          Festival Topeng Cirebon 2025 Banjir Apresiasi, dari ...
                        </h4>
                        <p className="text-xs text-[#909090] mb-3 line-clamp-2">
                          CIREBON - Pemerintah Daerah Kota Cirebon melalui Dinas Kebudayaan dan ...
                        </p>
                        <div className="flex items-center text-xs text-[#939393]">
                          <Calendar className="w-3 h-3 mr-1" />
                          <span>Rabu, 30 April 2025</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
