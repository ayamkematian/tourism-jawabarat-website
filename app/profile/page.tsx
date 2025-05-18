import Image from "next/image"
import Link from "next/link"

export default function Home() {
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
          <Link href="/login" className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-[#006e67] rounded-md font-semibold">
            Masuk
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="w-full h-60 relative bg-gray-800 text-white">
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
            <h1 className="text-3xl md:text-4xl font-bold text-white">Dinas Pariwisata dan Kebudayaan Provinsi Jawa Barat</h1>
        </div>
      </section>

      {/* Content Section */}
      <div className="container mx-auto px-4 py-8 md:px-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden max-w-5xl mx-auto">
          <Image
            src="/disparbud.webp"
            alt="Kantor Dinas Pariwisata dan Kebudayaan Provinsi Jawa Barat"
            width={1200}
            height={600}
            className="w-full h-auto object-cover"
          />

          <div className="p-6 md:p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Profil Lembaga</h2>

            <p className="text-gray-700 mb-4">
              Dinas Pariwisata dan Kebudayaan Provinsi Jawa Barat mempunyai tugas sebagai motor penggerak terwujudnya
              Jawa Barat sebagai daerah budaya dan tujuan wisata andalan. Adapun tujuan dari Dinas Pariwisata dan
              Kebudayaan Provinsi Jawa Barat ini adalah untuk: Meningkatkan Citra Jawa Barat sebagai daerah budaya dan
              tujuan wisata, Meningkatkan peran seni dan budaya daerah Jawa Barat untuk Kepariwisataan, Meningkatkan
              kualitas dan terselenggaranya standarisasi pelayanan wisata dan Meningkatkan peran sub publik pariwisata
              sebagai andalan untuk menunjang perekonomian daerah dan kinerja promosi yang efektif.
            </p>

            <p className="text-gray-700 mb-4">
              Secara Historis Dinas Pariwisata dan Kebudayaan Provinsi Jawa Barat terbentuk dari empat instansi
              pemerintah pada tahun 2001, Berdasarkan Keputusan Gubernur Jawa Barat No. 52 Tahun 2001, Dinas Pariwisata
              dan Kebudayaan Provinsi Jawa Barat merupakan hasil gabungan dari empat instansi pemerintah.
              Instansi-instansi tersebut yaitu Dinas Pariwisata Provinsi Daerah Tingkat I Jawa Barat, Kantor Wilayah
              Seni dan Pariwisata Provinsi Jawa Barat, Bidang Kesenian Sejarah dan nilai-nilai Tradisional pada Kantor
              Wilayah Departemen Pendidikan dan Kebudayaan Provinsi Jawa Barat, dan Bidang Pembinaan Kesenian Daerah
              Dinas P&K Provinsi Jawa Barat. Dengan cikal bakal bernama Dinas Kebudayaan dan Pariwisata Provinsi Jawa
              Barat yang berlokasi di jalan LINE Martadinata no 209 Bandung.
            </p>

            <p className="text-gray-700 mb-4">
              Pada tahun 2007, berdasarkan Surat Keputusan dari pemerintah mengenai Otonomi Daerah (OTDA), Dinas
              Kebudayaan dan Pariwisata berubah Nomenklatur menjadi Dinas Pariwisata dan Kebudayaan Provinsi Jawa Barat
              karena Pemerintah Provinsi Jawa Barat ingin mengedepankan pariwisata sebagai motor penggerak ekonomi
              daerah masyarakat namun tetap urusan kebudayaan menjadi urusan wajib seperti yang tertuang dalam Peraturan
              Pemerintah 87 tahun 2021 yang artinya negara harus hadir dalam upaya-upaya pembangunan di bidang
              kebudayaan.
            </p>

            <p className="text-gray-700 mb-4">
              Selanjutnya, dalam perjalanan tata kelola Pemerintahan Daerah Provinsi Jawa Barat mengubah kembali
              berdasarkan Peraturan Gubernur Jawa Barat Nomor 67 Tahun 2016 tentang Tugas Pokok, Fungsi, Rincian Tugas
              Unit, dan Tata Kerja Dinas Pariwisata dan Kebudayaan dan Peraturan Gubernur Jawa Barat Nomor 69 Tahun 2017
              tentang Pembentukan dan Susunan Organisasi Cabang Dinas dan Unit Pelaksana Teknis Daerah Di Lingkungan
              Pemerintah Daerah Provinsi Jawa Barat telah mengubah struktur organisasi dan tata kerja salah satunya
              Dinas Pariwisata dan Kebudayaan Provinsi Jawa Barat yang semula terdiri 4 bidang beserta sekretariat dan 5
              balai, berubah menjadi 4 bidang beserta sekretariat dan UPTD PKDJB kelas A, yaitu sbb:
            </p>

            <ol className="list-decimal pl-8 text-gray-700 mb-4">
              <li className="mb-1">Sekretariat;</li>
              <li className="mb-1">Bidang Industri Pariwisata;</li>
              <li className="mb-1">Bidang Destinasi Pariwisata;</li>
              <li className="mb-1">Bidang Pemasaran;</li>
              <li className="mb-1">Bidang Kebudayaan;</li>
              <li className="mb-1">Unit Pelaksana Teknis Daerah (UPTD) Pengelolaan Kebudayaan Daerah Jawa Barat.</li>
            </ol>
          </div>
        </div>
      </div>
    </main>
  )
}
