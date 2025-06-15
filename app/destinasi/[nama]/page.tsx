"use client"
import Image from "next/image"
import { useRef, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { getDatabase, ref, child, get } from "firebase/database"
import firebaseApp from "@/backend/firebase-sdk"
import { supabase } from "@/lib/supabaseClient"

export default function DestinasiPage({ params }: { params: { nama: string } }) {
  const [destinasi, setDestinasi] = useState<any>(null)
  const [error, setError] = useState("")
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const snapShot = useRef(null)
  const [density, setDensity] = useState<number | null>(null)
  const [rainStatus, setRainStatus] = useState<string | null>(null)
  const [humidity, setHumidity] = useState<number | null>(null)
  const [temperature, setTemperature] = useState<number | null>(null)
  const rainPercent = rainStatus === "hujan" ? 100 : 0

  // Ambil data kepadatan dari Firebase
  const getValue = async () => {
    try {
      const database = getDatabase(firebaseApp)
      const rootReference = ref(database)
      // Gunakan params.nama untuk path dinamis
      const dbGet = await get(child(rootReference, `raspberry_data/${params.nama}/Density`))
      const dbValue = dbGet.val()
      setDensity(dbValue)
      console.log("Density:", dbValue)
    } catch (error) {
      console.error("Firebase DB Error:", error)
    }
  }

  // Ambil data cuaca berdasarkan Firebase
  useEffect(() => {
    getWeatherValue()
  }, [])
  const getWeatherValue = async () => {
    try {
      const database = getDatabase(firebaseApp)
      const rootReference = ref(database)
      // Gunakan params.nama untuk path dinamis
      const snapshot = await get(child(rootReference, `Sensor/${params.nama}`))
      if (snapshot.exists()) {
        const data = snapshot.val()
        setHumidity(data.Humidity)
        setTemperature(data.Temperature)
        setRainStatus(data.Rain_Status)
        console.log("Firebase data:", data)
      } else {
        console.warn(`No data found at Sensor/${params.nama}`)
      }
    } catch (error) {
      console.error("Firebase DB Error:", error)
    }
  }

  const getKepadatanStatus = (value: number) => {
    if (value > 3) return "Sangat Padat"
    if (value > 2) return "Padat"
    if (value > 1) return "Renggang"
    return "Sepi"
  }

  const getDensityColor = (value: number) => {
    if (value > 3) return "bg-red-500/20 text-[#952020]" // Sangat Padat
    if (value > 2) return "bg-orange-400/20 text-orange-700" // Padat
    if (value > 1) return "bg-yellow-200 text-yellow-800" // Renggang
    return "bg-green-200 text-green-800" // Sepi
  }

  const getDensityLabel = (value: number) => {
    if (value > 3) return "Sangat Padat"
    if (value > 2) return "Padat"
    if (value > 1) return "Renggang"
    return "Sepi"
  }
  useEffect(() => {
    getValue()
  }, [])

  useEffect(() => {
    const getDensityValue = async () => {
      try {
        const database = getDatabase(firebaseApp)
        const rootReference = ref(database)
        const snapshot = await get(child(rootReference, `raspberry_data/${params.nama}/Density`))

        if (snapshot.exists()) {
          const dbValue = snapshot.val()
          console.log("Density:", dbValue)
          // Kamu bisa set state di sini kalau perlu
        } else {
          console.warn("No data found at raspberry_data/${params.nama}/Density")
        }
      } catch (err) {
        console.error("Firebase DB Error:", err)
      }
    }

    getDensityValue()
  }, [])

  useEffect(() => {
    // Ambil data destinasi dari Supabase
    const fetchDestinasi = async () => {
      try {
        const { data, error } = await supabase
          .from("destinasi")
          .select("*")
          .eq("slug", params.nama)
          .single()
        if (error || !data) throw new Error("Destinasi tidak ditemukan")
        setDestinasi(data)
      } catch (err: any) {
        setError(err.message)
      }
    }

    fetchDestinasi()
  }, [params.nama])

  if (error) {
    return <div className="container mx-auto px-4 py-6">Error: {error}</div>
  }

  if (!destinasi) {
    return <div className="container mx-auto px-4 py-6">Loading...</div>
  }

  // Parse fotourl jika berupa string JSON
  let fotoArray: string[] = [];
  if (typeof destinasi.fotourl === "string" && destinasi.fotourl.startsWith("[")) {
    try {
      fotoArray = JSON.parse(destinasi.fotourl);
    } catch {
      fotoArray = [];
    }
  }

  return (
    <div className="container mx-auto px-4 py-6 pb-10">
      <head><link rel="icon" href="/tic.png" /></head>
      {/* Navigation Bar */}
      <nav className="flex items-center justify-between px-4 py-3 bg-white shadow-sm md:px-8">
        <div className="flex items-center">
          <Image src="/tic.png" alt="Logo" width={70} height={70} className="mr-2" />
          <div className="border-l-2 border-teal-600 pl-2">
            <Link href="/" className="text-[#008275] font-semibold">
              Tourism Information Center
            </Link>
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
          <Link
            href="/login"
            className="bg-teal-600 text-white px-4 py-2 hover:bg-[#006e67] rounded-md font-semibold"
          >
            Masuk
          </Link>
        </div>
      </nav>

      <h1 className="text-3xl font-bold mb-6">{destinasi.nama}</h1>
      {/* Image Slider */}
      <div className="relative mb-8">
        <div className="overflow-hidden rounded-lg h-[400px] relative">
          <Image src={destinasi.gambar || "/placeholder.svg"} alt={destinasi.nama} fill className="object-cover" />
        </div>
      </div>

      {/* Info Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Map */}
        <div className="bg-[#fafafa] rounded-lg p-4 h-[300px] relative">
          <div
            className={`absolute inset-0 rounded-lg flex items-center justify-center transition-all duration-300 ${
              density !== null ? getDensityColor(density) : "bg-gray-200 text-gray-500"
            }`}
          >
            <span className="font-bold text-xl">
              {density === null
                ? "Memuat..."
                : density > 4
                  ? "Sangat Padat"
                  : density > 3
                    ? "Padat"
                    : density > 2
                      ? "Senggang"
                      : "Sepi"}
            </span>
          </div>
        </div>

        {/* Weather Info */}
        <div className="border border-gray-200 rounded-lg p-4">
          <h3 className="text-lg font-medium mb-2">Cuaca Hari Ini di {destinasi.nama}</h3>
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-6">
              {/* Suhu */}
              <div className="flex flex-col items-center">
                <p className="text-sm text-gray-500">Suhu Saat Ini</p>
                <div className="text-6xl font-bold flex items-start">
                  {temperature !== null ? temperature : "--"}
                  <span className="text-2xl">°</span>
                </div>
              </div>
              {/* Hujan/Awan */}
              <div className="flex flex-col items-center">
                {rainStatus === "Hujan" ? (
                  <>
                    {/* Icon Hujan */}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="36"
                      height="36"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                      className="text-blue-500 mb-1"
                    >
                      <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/>
                      <path d="M16 14v3"/>
                      <path d="M8 14v3"/>
                      <path d="M12 16v3"/>
                    </svg>
                    <span className="text-blue-600 font-medium">Hujan</span>
                  </>
                ) : (
                  <>
                    {/* Icon Awan */}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="36"
                      height="36"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                      className="text-gray-400 mb-1"
                    >
                      <path d="M17.5 19a4.5 4.5 0 0 0 0-9 6 6 0 0 0-11.31 2.16A4 4 0 1 0 6 19h11.5z"/>
                    </svg>
                    <span className="text-gray-600 font-medium">Tidak Hujan</span>
                  </>
                )}
              </div>
            </div>

            {/* Kelembapan */}
            <div className="w-full mt-6">
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
                <span>{humidity !== null ? `${Math.round(humidity)}%` : "--"}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-[#008275] h-2 rounded-full"
                  style={{ width: humidity !== null ? `${Math.round(humidity)}%` : "0%" }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Information Section */}
      <div className="mt-8 space-y-6">
        {/* Description - Full Width */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
          <h3 className="text-xl font-semibold mb-3 text-[#008275] flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
              <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
            </svg>
            Deskripsi
          </h3>
          <div className="text-gray-700">
            {destinasi.deskripsi || (
              <p className="italic text-gray-500">Deskripsi belum tersedia untuk destinasi ini.</p>
            )}
          </div>
        </div>

        {/* Address and Opening Hours/Ticket Price - Two Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Address */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
            <h3 className="text-xl font-semibold mb-3 text-[#008275] flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
              Alamat
            </h3>
            <div className="text-gray-700">
              {destinasi.alamat || <p className="italic text-gray-500">Alamat belum tersedia untuk destinasi ini.</p>}
            </div>
            {destinasi.googleMapsUrl && (
              <a
                href={destinasi.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center mt-3 text-[#008275] hover:underline"
              >
                <span>Lihat di Google Maps</span>
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
                  className="ml-1"
                >
                  <path d="M7 7h10v10"></path>
                  <path d="M7 17 17 7"></path>
                </svg>
              </a>
            )}
          </div>

          {/* Opening Hours and Ticket Price */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-3 text-[#008275] flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
                Jam Buka
              </h3>
              {destinasi.jambuka ? (
                <div className="grid grid-cols-2 gap-2 text-gray-700">
                  <div>Senin - Jumat:</div>
                  <div>{destinasi.jambuka.weekday || "08:00 - 16:00"}</div>
                  <div>Sabtu - Minggu:</div>
                  <div>{destinasi.jambuka.weekend || "08:00 - 17:00"}</div>
                  <div>Hari Libur:</div>
                  <div>{destinasi.jambuka.holiday || "08:00 - 17:00"}</div>
                </div>
              ) : (
                <p className="italic text-gray-500">Jam buka belum tersedia untuk destinasi ini.</p>
              )}
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-3 text-[#008275] flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect width="20" height="12" x="2" y="6" rx="2"></rect>
                  <circle cx="12" cy="12" r="2"></circle>
                  <path d="M6 12h.01M18 12h.01"></path>
                </svg>
                Harga Tiket
              </h3>
              {destinasi.hargatiket ? (
                <div className="grid grid-cols-2 gap-2 text-gray-700">
                  <div>Dewasa:</div>
                  <div>Rp {destinasi.hargatiket.dewasa?.toLocaleString("id-ID") || "25.000"}</div>
                  <div>Anak-anak:</div>
                  <div>Rp {destinasi.hargatiket.anak?.toLocaleString("id-ID") || "15.000"}</div>
                  {destinasi.hargatiket.mancanegara && (
                    <>
                      <div>Wisatawan Mancanegara:</div>
                      <div>Rp {destinasi.hargatiket.mancanegara.toLocaleString("id-ID")}</div>
                    </>
                  )}
                </div>
              ) : (
                <p className="italic text-gray-500">Informasi harga tiket belum tersedia untuk destinasi ini.</p>
              )}
            </div>
          </div>
        </div>

        {/* Collage Foto Destinasi */}
        {fotoArray.length > 0 && (
          <div className="mt-8">
            <h3 className="text-xl font-semibold mb-4 text-[#008275]">Galeri Foto</h3>
            <div
              className="grid gap-4"
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 2fr 1fr",
                gridTemplateRows: "1fr 1fr",
                gridTemplateAreas: `
                  "foto1 foto3 foto4"
                  "foto2 foto3 foto5"
                `,
                height: 500,
              }}
            >
              {/* Gambar 1 */}
              <div style={{ gridArea: "foto1" }}>
                {fotoArray[0] && (
                  <Image
                    src={fotoArray[0]}
                    alt="Gambar 1"
                    width={400}
                    height={200}
                    className="w-full h-full object-cover rounded-lg transition-transform duration-300 hover:scale-[1.01]"
                    style={{ height: "100%", width: "100%" }}
                  />
                )}
              </div>
              {/* Gambar 2 */}
              <div style={{ gridArea: "foto2" }}>
                {fotoArray[1] && (
                  <Image
                    src={fotoArray[1]}
                    alt="Gambar 2"
                    width={400}
                    height={200}
                    className="w-full h-full object-cover rounded-lg transition-transform duration-300 hover:scale-[1.01]"
                    style={{ height: "100%", width: "100%" }}
                  />
                )}
              </div>
              {/* Gambar 3 (besar di tengah) */}
              <div style={{ gridArea: "foto3" }}>
                {fotoArray[2] && (
                  <Image
                    src={fotoArray[2]}
                    alt="Gambar 3"
                    width={800}
                    height={400}
                    className="w-full h-full object-cover rounded-lg transition-transform duration-300 hover:scale-[1.01]"
                    style={{ height: "100%", width: "100%" }}
                  />
                )}
              </div>
              {/* Gambar 4 */}
              <div style={{ gridArea: "foto4" }}>
                {fotoArray[3] && (
                  <Image
                    src={fotoArray[3]}
                    alt="Gambar 4"
                    width={400}
                    height={200}
                    className="w-full h-full object-cover rounded-lg transition-transform duration-300 hover:scale-[1.01]"
                    style={{ height: "100%", width: "100%" }}
                  />
                )}
              </div>
              {/* Gambar 5 */}
              <div style={{ gridArea: "foto5" }}>
                {fotoArray[4] && (
                  <Image
                    src={fotoArray[4]}
                    alt="Gambar 5"
                    width={400}
                    height={200}
                    className="w-full h-full object-cover rounded-lg transition-transform duration-300 hover:scale-[1.01]"
                    style={{ height: "100%", width: "100%" }}
                  />
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
