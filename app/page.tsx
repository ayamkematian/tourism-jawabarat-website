import Image from "next/image"
import Link from "next/link"

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-[#2d2d2d]">
      {/* Header */}
      <header className="w-full bg-white py-1 px-6 flex items-center justify-between shadow">
        <div className="flex items-center gap-2">
          <Image src="/tic.png" alt="Tourism Logo" width={70} height={70} />
          <span className="text-[#008275] font-medium">| Tourism Information Center</span>
        </div>
        <nav className="hidden md:flex items-center gap-6 text-sm">
          <Link href="#" className="text-[#4a4a4a] hover:text-[#008275]">Profile</Link>
          <Link href="#" className="text-[#4a4a4a] hover:text-[#008275]">Berita</Link>
          <Link href="/destinasi" className="text-[#4a4a4a] hover:text-[#008275]">Destinasi Wisata</Link>
          <Link href="#" className="text-[#4a4a4a] hover:text-[#008275]">Galeri</Link>
          <Link href="#" className="text-[#4a4a4a] hover:text-[#008275]">Kontak</Link>
          <Link href="/login" className="bg-[#008275] text-white px-4 py-1.5 rounded hover:bg-[#006e67]">Masuk</Link>
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

      {/* Tentang Section */}
      <section className="py-12 px-6 md:px-20 bg-white relative z-10">
        <h2 className="text-[#008275] text-xl font-bold mb-2">── <span>Tentang</span></h2>
        <h3 className="text-3xl font-light mb-1">
          Kenapa Harus ke
        </h3>
        <h4 className="text-5xl font-bold mb-4 italic">
          Jawa Barat?
        </h4>
        <p className="text-[#6b6b6b] text-base font-normal mb-10 max-w-4xl leading-relaxed">
          Jawa Barat mungkin bukan tujuan utama yang sering terlintas di pikiran, namun siapa sangka, provinsi ini menyimpan pesona yang luar biasa. Dengan garis pantai yang mempesona, pegunungan yang menantang, dan budaya yang kaya, Jawa Barat adalah tempat di mana alam dan tradisi berpadu dalam harmoni yang menakjubkan.
        </p>

        {/* Gallery - Kolase Gambar */}
        <div className="grid grid-cols-8 grid-rows-3 gap-2 mt-10">
          <Image src="/candijiwa.jpeg" alt="img1" className="rounded-lg object-cover w-full h-full col-span-1 row-span-1 transition-transform duration-300 hover:scale-[1.01]" width={400} height={400} />
          <Image src="/curugmalela.jpg" alt="img2" className="rounded-lg object-cover w-full h-full col-span-2 row-span-1 transition-transform duration-300 hover:scale-[1.01]" width={400} height={400} />
          <Image src="/curugputri.jpeg" alt="img3" className="rounded-lg object-cover w-full h-full col-span-1 row-span-1 transition-transform duration-300 hover:scale-[1.01]" width={400} height={400} />
          <Image src="/guasunyaragi.jpeg" alt="img4" className="rounded-lg object-cover w-full h-full col-span-2 row-span-2 transition-transform duration-300 hover:scale-[1.01]" width={400} height={400} />
          <Image src="/gunungpadang.jpeg" alt="img5" className="rounded-lg object-cover w-full h-full col-span-2 row-span-1 transition-transform duration-300 hover:scale-[1.01]" width={400} height={400} />
          <Image src="/gunungpapandayan.jpeg" alt="img6" className="rounded-lg object-cover w-full h-full col-span-2 row-span-1 transition-transform duration-300 hover:scale-[1.01]" width={400} height={400} />
          <Image src="/sangyang.jpeg" alt="img7" className="rounded-lg object-cover w-full h-full col-span-2 row-span-2 transition-transform duration-300 hover:scale-[1.01]" width={400} height={400} />
          <Image src="/sayangheulang.jpeg" alt="img8" className="rounded-lg object-cover w-full h-full col-span-2 row-span-2 transition-transform duration-300 hover:scale-[1.01]" width={400} height={400} />
          <Image src="/tamansafari.jpeg" alt="img9" className="rounded-lg object-cover w-full h-full col-span-2 row-span-1 transition-transform duration-300 hover:scale-[1.01]" width={400} height={400} />
          <Image src="/telaganilem.jpeg" alt="img10" className="rounded-lg object-cover w-full h-full col-span-2 row-span-1 transition-transform duration-300 hover:scale-[1.01]" width={400} height={400} />
        </div>
      </section>

      {/* Daya Tarik Section */}
      <section className="py-12 px-6 md:px-20 bg-[#ffffff] relative z-10">
        <h2 className="text-[#008275] text-xl font-bold mb-2">── <span>Daya Tarik</span></h2>
        <h3 className="text-3xl font-light mb-1">
          Apa saja aktivitas yang dapat dilakukan di
        </h3>
        <h4 className="text-5xl font-bold mb-4 italic">
          Jawa Barat?
        </h4>
        <p className="text-[#6b6b6b] text-base font-normal mb-10 max-w-4xl leading-relaxed">
          Anda bisa menjelajahi hutan dan pegunungan yang menyegarkan jiwa, menyusuri pesisir yang mempesona dengan panorama matahari terbenam yang dramatis, hingga merasakan kehidupan kota yang dinamis penuh hiburan dan kuliner modern.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          {["Petualangan", "Pesisir dan Pantai", "Bukit dan Pegunungan", "Perkotaan", "Belanja", "Seni dan Budaya", "Pedesaan"].map((item, i) => (
            <div key={i} className="bg-white rounded-lg p-4 shadow-md transition-all duration-300 hover:bg-gradient-to-tr hover:from-[#008275] hover:to-[#ffffff]">
              <p className="text-[#2d2d2d] font-semibold">{item}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="bg-[#008275bb] text-white px-6 py-10 mt-20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 items-start">
          {/* Kiri: Logo dan Deskripsi */}
          <div className="flex flex-col items-start">
            <img src="/tic.png" alt="logo" className="w-32 mb-4" />
            <p className="text-sm text-white/80 max-w-xl">
              This is the official website of the West Java Tourism Information Center, Indonesia. The content listed on this website is intended for informational rather than commercial purposes. Any sales displayed are intended as a sign of partnership and will always direct you to our partner sites.
            </p>
            {/* Ikon Sosial */}
            <div className="flex items-center gap-4 mt-4">
              <a href="#"><img src="/icon-fb.png" alt="facebook" className="w-6 h-6" /></a>
              <a href="#"><img src="/icon-x.png" alt="x-twitter" className="w-6 h-6" /></a>
              <a href="#"><img src="/icon-ig.png" alt="instagram" className="w-7 h-7" /></a>
              <a href="#"><img src="/icon-yt.png" alt="youtube" className="w-6 h-6" /></a>
              <a href="#"><img src="/icon-tt.png" alt="tiktok" className="w-6 h-6" /></a>
            </div>
          </div>
        </div>

        {/* Garis & Copyright */}
        <div className="border-t border-white/20 mt-8 pt-4 text-sm text-white text-center">
          © 2025 West Java Tourism Information Center. All Right Reserved
        </div>
      </footer>
    </div>
  )
}
