"use client"
import Image from "next/image"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react"

export default function DestinasiPage({ params }: { params: { nama: string } }) {
  const [destinasi, setDestinasi] = useState<any>(null);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    // Ambil data destinasi dari backend
    const fetchDestinasi = async () => {
      try {
        const response = await fetch(`http://localhost:3001/api/destinasi/${params.nama}`);
        if (!response.ok) {
          throw new Error("Destinasi tidak ditemukan");
        }
        const data = await response.json();
        setDestinasi(data);
      } catch (err: any) {
        setError(err.message);
      }
    };

    fetchDestinasi();
  }, [params.nama]);

  if (error) {
    return <div className="container mx-auto px-4 py-6">Error: {error}</div>;
  }

  if (!destinasi) {
    return <div className="container mx-auto px-4 py-6">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold mb-6">{destinasi.nama}</h1>

      {/* Image Slider */}
      <div className="relative mb-8">
        <div className="overflow-hidden rounded-lg h-[400px] relative">
          <Image
            src={destinasi.gambar || "/placeholder.svg"}
            alt={destinasi.nama}
            fill
            className="object-cover"
          />
        </div>
      </div>

      {/* Info Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Map */}
        <div className="bg-[#fafafa] rounded-lg p-4 h-[300px] relative">
          <div className="absolute inset-0 bg-red-500/20 rounded-lg flex items-center justify-center">
            <span className="text-[#952020] font-bold">Sangat Padat</span>
          </div>
        </div>

        {/* Weather Info */}
        <div className="border border-gray-200 rounded-lg p-4">
          <h3 className="text-lg font-medium mb-2">Cuaca Hari Ini di {destinasi.nama}</h3>
          <div className="flex flex-col items-center">
            <p className="text-sm text-gray-500">Terasa spt</p>
            <div className="text-6xl font-bold flex items-start">
              29<span className="text-2xl">°</span>
            </div>

            <div className="w-full mt-4">
              <div className="flex justify-between items-center mb-2">
                <span className="flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 2v2"></path>
                    <path d="M12 8v2"></path>
                    <path d="M12 14v2"></path>
                    <path d="M12 20v2"></path>
                    <path d="M2 12h2"></path>
                    <path d="M8 12h2"></path>
                    <path d="M14 12h2"></path>
                    <path d="M20 12h2"></path>
                    <path d="m4.93 4.93 1.41 1.41"></path>
                    <path d="m17.66 17.66 1.41 1.41"></path>
                    <path d="m4.93 19.07 1.41-1.41"></path>
                    <path d="m17.66 6.34 1.41-1.41"></path>
                  </svg>
                  Kelembapan
                </span>
                <span>70%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-[#008275] h-2 rounded-full" style={{ width: "70%" }}></div>
              </div>
            </div>

            <div className="w-full mt-4">
              <div className="flex justify-between items-center mb-2">
                <span className="flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"></path>
                    <path d="M16 14v6"></path>
                    <path d="M8 14v6"></path>
                    <path d="M12 16v6"></path>
                  </svg>
                  Hujan
                </span>
                <span>70%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-[#008275] h-2 rounded-full" style={{ width: "70%" }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}