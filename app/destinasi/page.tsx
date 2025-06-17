"use client";

import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react";
import { Search, ChevronRight } from "lucide-react"
import { supabase } from "@/lib/supabaseClient";

const featuredImages = [
  "/gunungpadang.jpeg",
  "/curugmalela.jpg",
  "/sangyang.jpeg",
];

const kategoriList = [
    "Wisata Alam",
    "Wisata Air",
    "Wisata Sejarah",
    "Wisata Religi",
    "Wisata Hiburan",
    "Wisata Belanja",
    "Wisata Kuliner",
    "Wisata Edukasi"
  ];

const lokasiList = [
  "Kabupaten Bandung",
  "Kabupaten Bandung Barat",
  "Kabupaten Bekasi",
  "Kabupaten Bogor",
  "Kabupaten Ciamis",
  "Kabupaten Cianjur",
  "Kabupaten Cirebon",
  "Kabupaten Garut",
  "Kabupaten Indramayu",
  "Kabupaten Karawang",
  "Kabupaten Kuningan",
  "Kabupaten Majalengka",
  "Kabupaten Pangandaran",
  "Kabupaten Purwakarta",
  "Kabupaten Subang",
  "Kabupaten Sukabumi",
  "Kabupaten Sumedang",
  "Kabupaten Tasikmalaya",
  "Kota Bandung",
  "Kota Banjar",
  "Kota Bekasi",
  "Kota Bogor",
  "Kota Cimahi",
  "Kota Cirebon",
  "Kota Depok",
  "Kota Sukabumi",
  "Kota Tasikmalaya"
];

export default function Home() {
  const [destinasiList, setDestinasiList] = useState<any[]>([]);
  const [error, setError] = useState("");
  const [currentSlide, setCurrentSlide] = useState(0);
  const DESTINASI_PER_PAGE = 9;
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [selectedKategori, setSelectedKategori] = useState("");
  const [selectedLokasi, setSelectedLokasi] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % featuredImages.length);
    }, 3500); // Ganti gambar setiap 3.5 detik
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Ambil daftar destinasi dari Supabase
    const fetchDestinasiList = async () => {
      try {
        const { data, error } = await supabase.from("destinasi").select("*");
        if (error) throw new Error(error.message);
        setDestinasiList(data || []);
      } catch (err: any) {
        setError(err.message);
      }
    };

    fetchDestinasiList();
  }, []);

  const filteredDestinasi = destinasiList.filter((destinasi) =>
    destinasi.nama.toLowerCase().includes(search.toLowerCase()) &&
    (selectedKategori === "" || destinasi.kategori === selectedKategori) &&
    (selectedLokasi === "" || destinasi.lokasi === selectedLokasi)
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredDestinasi.length / DESTINASI_PER_PAGE);
  const paginatedDestinasi = filteredDestinasi.slice(
    (currentPage - 1) * DESTINASI_PER_PAGE,
    currentPage * DESTINASI_PER_PAGE
  );

  if (error) {
    return <div className="container mx-auto px-4 py-6">Error: {error}</div>;
  }

  if (destinasiList.length === 0) {
    return <div className="container mx-auto px-4 py-6">Loading...</div>;
  }

  return (
    <main className="min-h-screen bg-white">
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

      {/* Search Section */}
      <div className="container mx-auto px-4 py-2 flex flex-wrap gap-2 mb-2">
      <select
        className="border border-gray-300 rounded-full px-4 py-1 text-sm"
        value={selectedKategori}
        onChange={e => {
          setSelectedKategori(e.target.value);
          setCurrentPage(1);
        }}
      >
        <option value="">Kategori</option>
        {kategoriList.map((kategori, idx) => (
          <option key={idx} value={kategori}>{kategori}</option>
        ))}
      </select>
      <select
        className="border border-gray-300 rounded-full px-4 py-1 text-sm"
        value={selectedLokasi}
        onChange={e => {
          setSelectedLokasi(e.target.value);
          setCurrentPage(1);
        }}
      >
        <option value="">Kota/Kab</option>
        {lokasiList.map((lokasi, idx) => (
          <option key={idx} value={lokasi}>{lokasi}</option>
        ))}
      </select>
      <div className="relative flex-grow">
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1); // Reset ke halaman 1 saat search berubah
          }}
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
        {paginatedDestinasi.length === 0 ? (
          <div className="col-span-full text-center text-gray-500 py-8">
            Tidak ada destinasi ditemukan.
          </div>
        ) : (
          paginatedDestinasi.map((destinasi) => (
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
              <div className="new-badge">{destinasi.lokasi}</div>
            </Link>
          ))
        )}
      </div>

      {/* Pagination */}
      <div className="container mx-auto px-4 pb-8 flex justify-between items-center mt-2">
        <button
          className="bg-[#008275] text-white px-4 py-2 rounded-md flex items-center gap-2 disabled:opacity-50"
          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          disabled={currentPage === 1}
        >
          Previous Page
        </button>
        <div className="flex items-center gap-2">
          <span>Page</span>
          <input
            type="text"
            value={currentPage}
            className="border border-gray-300 rounded w-12 px-2 py-1 text-center"
            readOnly
          />
          <span>of {totalPages}</span>
        </div>
        <button
          className="bg-[#008275] text-white px-4 py-2 rounded-md flex items-center gap-2 disabled:opacity-50"
          onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
          disabled={currentPage === totalPages || totalPages === 0}
        >
          Next Page
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </main>
  );
}
