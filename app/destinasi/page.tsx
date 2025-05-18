"use client";

import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react";
import { Search, ChevronRight } from "lucide-react"

const featuredImages = [
  "/gunungpadang.jpeg",
  "/curugmalela.jpg",
  "/sangyang.jpeg",
];

export default function Home() {
  const [destinasiList, setDestinasiList] = useState<any[]>([]);
  const [error, setError] = useState("");
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % featuredImages.length);
    }, 3500); // Ganti gambar setiap 3.5 detik
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Ambil daftar destinasi dari backend
    const fetchDestinasiList = async () => {
      try {
        const response = await fetch("http://localhost:3001/api/destinasi");
        if (!response.ok) {
          throw new Error("Gagal memuat daftar destinasi");
        }
        const data = await response.json();
        setDestinasiList(data);
      } catch (err: any) {
        setError(err.message);
      }
    };

    fetchDestinasiList();
  }, []);

  if (error) {
    return <div className="container mx-auto px-4 py-6">Error: {error}</div>;
  }

  if (destinasiList.length === 0) {
    return <div className="container mx-auto px-4 py-6">Loading...</div>;
  }

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

      {/* Stats Section */}
      <div className="container mx-auto px-4 py-4 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="stat-box">
          <p className="text-sm">Jumlah Wisatawan Lokal</p>
          <p className="text-2xl font-bold">10.000.000</p>
        </div>
        <div className="stat-box">
          <p className="text-sm">Kabupaten/Kota Terfavorit</p>
          <p className="text-xl font-bold">Kabupaten Bandung Barat</p>
        </div>
        <div className="stat-box">
          <p className="text-sm">Destinasi Wisata Terpopuler</p>
          <p className="text-xl font-bold">Curug Malela</p>
        </div>
        <div className="stat-box">
          <p className="text-sm">Jumlah Wisatawan Mancanegara</p>
          <p className="text-2xl font-bold">10.000.000</p>
        </div>
      </div>

      {/* Search Section */}
      <div className="container mx-auto px-4 py-2 flex flex-wrap gap-2 mb-2">
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
      <div
        className="container px-4 relative w-full h-64 rounded-lg flex items-center justify-center transition-all duration-700"
        style={{
          backgroundImage: `url('${featuredImages[currentSlide]}')`,
          backgroundSize: "fit",
          backgroundPosition: "center 60%",
        }}
      >
        <h1 className="text-white text-4xl font-bold text-center drop-shadow-lg px-4 py-2 rounded">
          Temukan Cerita di Setiap Destinasi – Yuk, Jelajah Jawa Barat!
        </h1>
      </div>

      {/* Destination Grid */}
      <div className="container mx-auto px-4 py-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {destinasiList.map((destinasi) => (
        <Link
          key={destinasi.id}
          href={`/destinasi/${destinasi.slug}`}
          className="destination-card"
        >
          <Image
            src={destinasi.gambar || "/placeholder.svg"}
            alt={destinasi.nama}
            width={300}
            height={150}
            className="w-full h-full object-cover"
          />
          <div className="label">{destinasi.nama}</div>
          <div className="new-badge">New</div>
        </Link>
      ))}
      </div>

      {/* Pagination */}
      <div className="container mx-auto px-4 pb-8 flex justify-between items-center mt-2">
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
    </main>
  );
}
