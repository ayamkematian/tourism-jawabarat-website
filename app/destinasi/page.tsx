"use client";

import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react";
import { Search, ChevronRight } from "lucide-react"

export default function DestinasiListPage() {
  const [destinasiList, setDestinasiList] = useState<any[]>([]);
  const [error, setError] = useState("");

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
    <div className="container mx-auto px-4 py-6">
      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
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
      <div className="container mx-auto px-4 py-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
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
      <div className="flex justify-between items-center mt-2">
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
  );
}
