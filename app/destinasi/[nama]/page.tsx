"use client"
import Image from "next/image"
import { useRef, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { getDatabase, ref, child, get, onValue, off } from "firebase/database"
import firebaseApp from "@/backend/firebase-sdk"
import { supabase } from "@/lib/supabaseClient"
import React from "react"
import { createClient } from "@supabase/supabase-js"
import dynamic from "next/dynamic"
import "@/components/chart-setup"
import { getFirestore, collection, getDocs } from "firebase/firestore"
const {format} = require("date-fns")
const Chart = dynamic(() => import("react-chartjs-2").then(mod => mod.Line), { ssr: false })

export default function DestinasiPage({ params }: { params: Promise<{ nama: string }> }) {
  // Semua hook harus di atas, sebelum return apa pun
  const { nama } = React.use(params)
  const [destinasi, setDestinasi] = useState<any>(null)
  const [error, setError] = useState("")
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [fotoESPCamUrl, setFotoESPCamUrl] = useState<string | null>(null);
  const snapShot = useRef(null)
  const [density, setDensity] = useState<number | null>(null)
  const [rainStatus, setRainStatus] = useState<string | null>(null)
  const [humidity, setHumidity] = useState<number | null>(null)
  const [temperature, setTemperature] = useState<number | null>(null)
  const [densityPercent, setDensityPercent] = useState<number | null>(null)
  const rainPercent = rainStatus === "hujan" ? 100 : 0
  const [sensorHistory, setSensorHistory] = useState<any>({})
  const [chartData, setChartData] = useState<any>(null)
  // State untuk slider foto
  const [activeIndex, setActiveIndex] = useState(0)
  const [fotoArray, setFotoArray] = useState<string[]>([]);

  // Ambil data destinasi dari tabel destinasi
  useEffect(() => {
    const fetchDestinasi = async () => {
      try {
        const { data, error } = await supabase
          .from("destinasi")
          .select("*")
          .eq("slug", nama)
          .single()
        if (error || !data) throw new Error("Destinasi tidak ditemukan")
        setDestinasi(data)
      } catch (err: any) {
        setError(err.message)
      }
    }
    fetchDestinasi()
  }, [nama])

  // Ambil foto terbaru dari bucket Supabase "foto-dari-espcam"
  useEffect(() => {
    const fetchLatestFoto = async () => {
      try {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
        const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY!;
        const supabase = createClient(supabaseUrl, supabaseKey);

        // Ambil daftar file di bucket
        const { data: files, error } = await supabase
          .storage
          .from("foto-dari-espcam")
          .list("", { limit: 100, sortBy: { column: "name", order: "desc" } });

        if (error || !files || files.length === 0) {
          setFotoESPCamUrl(null);
          return;
        }

        // File terbaru = urutan pertama (karena sort desc)
        const latestFile = files[0].name;

        // Buat signed url
        const { data: signed } = await supabase
          .storage
          .from("foto-dari-espcam")
          .createSignedUrl(latestFile, 60 * 10); // 10 menit

        setFotoESPCamUrl(signed?.signedUrl || null);
      } catch {
        setFotoESPCamUrl(null);
      }
    };

    fetchLatestFoto();
  }, []);

  // Listener dinamis untuk PeopleInside dan Sensor
  useEffect(() => {
    if (!destinasi) return
    const database = getDatabase(firebaseApp)
    const peopleRef = ref(database, `raspberry_data/${nama}/PeopleInside`)
    const sensorRef = ref(database, `Sensor/${nama}`)
    // Listener PeopleInside
    const peopleListener = onValue(peopleRef, (snapshot) => {
      let dbValue = snapshot.val()
      if (typeof dbValue === "number" && dbValue < 0) dbValue = 0
      setDensity(dbValue)
      if (destinasi.pengunjung_max) {
        const percent = Math.round((dbValue / destinasi.pengunjung_max) * 100)
        setDensityPercent(percent)
      }
    })
    // Listener Sensor (suhu, kelembapan, hujan)
    const sensorListener = onValue(sensorRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val()
        setHumidity(data.Humidity)
        setTemperature(data.Temperature)
        setRainStatus(data.Rain_Status)
      }
    })
    // Cleanup listener saat unmount
    return () => {
      off(peopleRef)
      off(sensorRef)
    }
  }, [destinasi, nama])

  // Hydration-safe: parsing fotoArray hanya di client
  useEffect(() => {
    if (destinasi && typeof destinasi.fotourl === "string" && destinasi.fotourl.startsWith("[")) {
      try {
        setFotoArray(JSON.parse(destinasi.fotourl));
      } catch {
        setFotoArray([]);
      }
    } else {
      setFotoArray([]);
    }
  }, [destinasi]);

  // Auto-slide: ubah foto setiap 3 detik jika fotoArray > 1
  useEffect(() => {
    if (fotoArray.length <= 1) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % fotoArray.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [fotoArray]);

  // Ambil histori suhu dari Firebase dan siapkan data chart
  useEffect(() => {
    if (!destinasi) return;
    const fetchChartData = async () => {
      try {
        const db = getFirestore(firebaseApp);
        // Format tanggal hari ini (YYYY-MM-DD)
        const now = new Date();
        const yyyy = now.getFullYear();
        const mm = String(now.getMonth() + 1).padStart(2, '0');
        const dd = String(now.getDate()).padStart(2, '0');
        const tanggal = `${yyyy}-${mm}-${dd}`;

        // Path: Rata2LoggingESP/{nama}/Per_hari/{tanggal}/DataPerJam
        const colRef = collection(db, `Rata2LoggingESP/${nama}/Per_hari/${tanggal}/DataPerJam`);
        const snapshot = await getDocs(colRef);
        const jamArr: string[] = [];
        const suhuArr: number[] = [];
        snapshot.forEach(doc => {
          const data = doc.data();
          jamArr.push(doc.id); // id dokumen = jam, misal "13"
          // Pastikan hanya number, jika tidak, push NaN
          suhuArr.push(typeof data.suhu_rata2 === 'number' ? data.suhu_rata2 : NaN);
          // Log detail dokumen
          console.log("doc.id", doc.id, "data", data);
        });
        console.log("jamArr", jamArr);
        console.log("suhuArr", suhuArr);
        console.log("snapshot size", snapshot.size);

        // Urutkan berdasarkan jam dan pastikan jam 00-23 selalu ada
        const jamLengkap = Array.from({length: 24}, (_, i) => i.toString().padStart(2, '0'));
        const jamToSuhu: Record<string, number> = {};
        jamArr.forEach((jam, i) => {
          jamToSuhu[jam.padStart(2, '0')] = typeof suhuArr[i] === 'number' ? suhuArr[i] : NaN;
        });
        setChartData({
          labels: jamLengkap.map(j => j + ':00'),
          datasets: [
            {
              label: 'Rata-rata Suhu (°C)',
              data: jamLengkap.map(j => jamToSuhu[j] ?? NaN),
              borderColor: '#008275',
              backgroundColor: 'rgba(0,130,117,0.2)',
              tension: 0.3,
            },
          ],
        });
      } catch (e) {
        setChartData(null);
      }
    };
    fetchChartData();
  }, [destinasi, nama]);

  // Status kepadatan berdasarkan persentase
  const getDensityStatus = (percent: number | null) => {
    if (percent === null) return "-"
    if (percent > 80) return "Sangat Padat"
    if (percent > 60) return "Padat"
    if (percent > 30) return "Renggang"
    if (percent > 0) return "Sepi"
    return "Memuat..."
  }
  // Warna status kepadatan
  const getDensityColor = (percent: number | null) => {
    if (percent === null) return "bg-gray-200 text-gray-500"
    if (percent > 80) return "bg-red-500/20 text-[#952020]"
    if (percent > 60) return "bg-orange-400/20 text-orange-700"
    if (percent > 30) return "bg-yellow-200 text-yellow-800"
    if (percent > 0) return "bg-green-100 text-green-700"
    return "bg-gray-200 text-gray-500"
  }

  const getDensityLabel = (value: number) => {
    if (value > 3) return "Sangat Padat"
    if (value > 2) return "Padat"
    if (value > 1) return "Renggang"
    return "Sepi"
  }

  if (error) {
    return <div className="container mx-auto px-4 py-6">Error: {error}</div>
  }

  if (!destinasi) {
    return <div className="container mx-auto px-4 py-6">Loading...</div>
  }

  const handlePrev = () => setActiveIndex((prev) => prev === 0 ? fotoArray.length - 1 : prev - 1)
  const handleNext = () => setActiveIndex((prev) => prev === fotoArray.length - 1 ? 0 : prev + 1)

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

      <div className="container mx-auto px-4 py-6 pb-10">
        <h1 className="text-3xl font-bold mb-6">{destinasi.nama}</h1>
        {/* Image Slider Dinamis */}
        <div className="relative mb-8">
          <div className="overflow-hidden rounded-lg h-[400px] relative flex items-center justify-center">
            {fotoArray.length > 0 ? (
              <Image src={fotoArray[activeIndex]} alt={destinasi.nama} fill className="object-cover transition-all duration-300" />
            ) : (
              <Image src={destinasi.gambar || "/placeholder.svg"} alt={destinasi.nama} fill className="object-cover" />
            )}
            {/* Tombol Prev/Next */}
            {fotoArray.length > 1 && (
              <>
                <button onClick={handlePrev} className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/70 rounded-full p-2 shadow hover:bg-white">
                  <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 19l-7-7 7-7"/></svg>
                </button>
                <button onClick={handleNext} className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/70 rounded-full p-2 shadow hover:bg-white">
                  <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 5l7 7-7 7"/></svg>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Info Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Map */}
        <div className="bg-[#fafafa] rounded-lg p-4 h-[400px] relative">
          <div
            className={`absolute inset-0 rounded-lg flex flex-col items-center justify-center transition-all duration-300 ${
              getDensityColor(densityPercent)
            }`}
          >
            <span className="font-bold text-xl">
              {densityPercent === null ? "Memuat..." : getDensityStatus(densityPercent)}
            </span>
            {density !== null && destinasi?.pengunjung_max && (
              <span className="text-sm mt-2">
                {density} / {destinasi.pengunjung_max} pengunjung ({densityPercent}%)
              </span>
            )}
          </div>
        </div>

        {/* Foto kondisi dari ESPCam Supabase */}
        <div className="border border-gray-200 rounded-lg p-4 flex flex-col items-center justify-center h-[400px] bg-white">
          <h3 className="text-lg font-medium mb-2">Kondisi Terkini di {destinasi.nama}</h3>
          {fotoESPCamUrl ? (
            <Image
              src={fotoESPCamUrl}
              alt={`Kondisi Terkini di ${destinasi.nama}`}
              width={400}
              height={300}
              className="rounded-lg object-cover w-full"
              style={{ aspectRatio: "4/3", maxWidth: 400, maxHeight: 400, height: 320 }}
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-[320px] w-full text-gray-400">
              <svg width="60" height="60" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="8" y="16" width="48" height="32" rx="4" />
                <circle cx="32" cy="32" r="8" />
              </svg>
              <span className="mt-2 text-sm">Foto kondisi belum tersedia</span>
            </div>
          )}
        </div>
      </div>

        {/* Tambahkan grafik suhu rata-rata (kecil, di atas deskripsi) */}
        <div className="max-w-md mx-auto mt-8 mb-4">
          {chartData ? (
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
              <h3 className="text-base font-semibold mb-2 text-[#008275]">Grafik Rata-rata Suhu Hari Ini</h3>
              <Chart
                data={chartData}
                options={{
                  responsive: true,
                  plugins: { legend: { display: false } },
                  scales: {
                    x: { title: { display: true, text: 'Jam' }, ticks: { font: { size: 10 } } },
                    y: { title: { display: true, text: 'Suhu (°C)' }, min: 0, max: 50, ticks: { font: { size: 10 } } },
                  },
                }}
                height={180}
              />
            </div>
          ) : (
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 text-center text-gray-500">
              Data grafik suhu rata-rata belum tersedia untuk hari ini.
            </div>
          )}
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
              {destinasi.google_maps_url && (
                <a
                  href={destinasi.google_maps_url}
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
                  <div className="text-gray-700">{destinasi.jambuka}</div>
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
                  <div className="text-gray-700">Rp {destinasi.hargatiket}</div>
                ) : (
                  <p className="italic text-gray-500">Informasi harga tiket belum tersedia untuk destinasi ini.</p>
                )}
                {/* Tombol Beli Tiket jika tiket_url tersedia */}
                {destinasi.tiket_url && (
                  <a
                    href={destinasi.google_maps_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center mt-3 text-[#008275] hover:underline"
                  >
                    <span>Beli Tiket di Sini</span>
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
    </main>
  )
}
