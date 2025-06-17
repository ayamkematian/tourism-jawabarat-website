"use client"
import { useState, useEffect } from "react"
import { Button } from "../../../components/ui/button"
import { Input } from "../../../components/ui/input"
import { Clock, MapPin, Bell } from "lucide-react"
import { supabase } from "../../../lib/supabaseClient"
import { Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu"

interface Destination {
  id: string
  name: string
  description: string
  category: string
  openingHours: string
  ticketPrice: string
  address: string
  location: string
  manager: string
  status: "pending" | "Disetujui" | "Ditolak"
  registrationDate: string
}

export default function PengelolaDashboardPage() {
  const [destinations, setDestinations] = useState<Destination[]>([])
  const [loading, setLoading] = useState(false)
  const [showList, setShowList] = useState(false)
  const [notifikasi, setNotifikasi] = useState<any[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const pageSize = 5; // jumlah destinasi per halaman
  const email = typeof window !== "undefined" ? localStorage.getItem("pengelolaEmail") : null
  const router = useRouter();
  const RupiahIcon = () => (
    <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
      <text x="0" y="15" fontSize="14" fontWeight="bold" fill="#008275">Rp</text>
    </svg>
  );

  useEffect(() => {
    const fetchDestinasiWithPengelola = async () => {
      setLoading(true)
      const email = typeof window !== "undefined" ? localStorage.getItem("pengelolaEmail") : null
      if (!email) return setLoading(false)
      const { data: pengelola } = await supabase
        .from("users")
        .select("id, namalengkap")
        .eq("email", email)
        .eq("role", "pengelola")
        .single()
      if (!pengelola?.id) return setLoading(false)
      // Hitung total destinasi
      const { count } = await supabase
        .from("daftar_destinasi")
        .select("*", { count: "exact", head: true })
        .eq("pengelola_id", pengelola.id)
      setTotalPages(count ? Math.ceil(count / pageSize) : 1)
      // Ambil destinasi sesuai halaman
      const from = (currentPage - 1) * pageSize
      const to = from + pageSize - 1
      const { data } = await supabase
        .from("daftar_destinasi")
        .select("*", { count: "exact" })
        .eq("pengelola_id", pengelola.id)
        .order("created_at", { ascending: false })
        .range(from, to)
      setDestinations(
        (data || []).map((item: any) => ({
          id: item.id,
          name: item.nama,
          description: item.deskripsi,
          category: item.kategori,
          openingHours: item.jambuka,
          ticketPrice: item.hargatiket,
          address: item.alamat,
          location: item.lokasi,
          manager: pengelola.namalengkap || "-",
          status: item.status || "pending",
          registrationDate: item.created_at
            ? new Date(item.created_at).toLocaleDateString("id-ID")
            : "",
        }))
      )
      setLoading(false)
    }
    if (showList) fetchDestinasiWithPengelola()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showList, currentPage])

  useEffect(() => {
    if (!email) return;
    const fetchNotifikasi = async () => {
      const { data } = await supabase
        .from("notifikasii")
        .select("*")
        .eq("user_email", email)
        .order("waktu", { ascending: false })
        .limit(10);
      setNotifikasi(data || []);
    };
    fetchNotifikasi();
    const interval = setInterval(fetchNotifikasi, 30000);
    return () => clearInterval(interval);
  }, [email]);

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <div className="flex-1 p-2 sm:p-4 md:p-6 bg-[#eaeaea]">
        <div className="bg-[#ffffff] rounded-lg p-2 sm:p-4 md:p-6 max-w-flex mx-auto w-full">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-[#000000]">Dashboard</h1>
              <p className="text-[#575757] text-sm sm:text-base">Selamat Datang di Dashboard Pengelola Wisata</p>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="relative p-2 rounded-full hover:bg-gray-100 focus:outline-none">
                  <Bell className="w-6 h-6 text-[#008275]" />
                  {notifikasi.length > 0 && (
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                  )}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80 max-h-96 overflow-y-auto">
                <DropdownMenuLabel>Notifikasi</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {notifikasi.length === 0 ? (
                  <DropdownMenuItem className="text-gray-500">Tidak ada notifikasi</DropdownMenuItem>
                ) : (
                  notifikasi.map((notif) => (
                    <DropdownMenuItem key={notif.id} className={notif.status === "unread" ? "bg-[#e6f7f4]" : ""}>
                      <div className="flex flex-col w-full">
                        <span className="text-sm text-[#222]">{notif.pesan}</span>
                        <span className="text-xs text-gray-500 mt-1">{notif.waktu ? new Date(notif.waktu).toLocaleString("id-ID") : ""}</span>
                      </div>
                    </DropdownMenuItem>
                  ))
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Daftar Destinasi */}
          <div className="flex flex-col sm:flex-row gap-2 justify-end mb-4">
            <Button
              onClick={() => setShowList((v) => !v)}
              className="bg-[#008275] hover:bg-[#4ca69d] text-white px-4 sm:px-6 w-full sm:w-auto"
            >
              {showList ? "Tutup Daftar Destinasi" : "Lihat Daftar Destinasi"}
            </Button>
            <Button
              onClick={() => router.push("/pengelola/pendaftaran")}
              className="bg-white border border-[#008275] text-[#008275] px-4 sm:px-6 w-full sm:w-auto"
            >
              Daftar Destinasi
            </Button>
          </div>
          {showList && (
            loading ? (
              <div className="flex justify-center items-center py-8 sm:py-12">
                <Loader2 className="animate-spin w-8 h-8 text-[#008275]" />
              </div>
            ) : destinations.length === 0 ? (
              <div className="text-center text-gray-500">Belum ada destinasi yang didaftarkan.</div>
            ) : (
              <div className="space-y-4">
                {destinations.map((destination) => (
                  <div
                    key={destination.id}
                    className="border border-[#eaeaea] rounded-lg p-3 sm:p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex flex-col md:flex-row items-start justify-between mb-4 gap-2">
                      <div>
                        <h3 className="text-lg sm:text-xl font-semibold text-[#000000] mb-1">{destination.name}</h3>
                        <p className="text-[#575757] text-xs sm:text-sm">Pengelola: {destination.manager}</p>
                        <p className="text-[#888888] text-xs">Didaftarkan pada: {destination.registrationDate}</p>
                      </div>
                      <div className="flex items-center gap-2 mt-2 md:mt-0">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          destination.status === "pending"
                            ? "bg-[#fff3cd] text-[#856404]"
                            : destination.status === "Disetujui"
                            ? "bg-[#d4edda] text-[#155724]"
                            : destination.status === "Ditolak"
                            ? "bg-[#f8d7da] text-[#721c24]"
                            : "bg-gray-200 text-gray-600"
                        }`}
                      >
                        {destination.status === "pending"
                          ? "Dalam Proses"
                          : destination.status === "Disetujui"
                          ? "Disetujui"
                          : destination.status === "Ditolak"
                          ? "Ditolak"
                          : destination.status}
                      </span>
                    </div>
                    </div>
                    {destination.description && <p className="text-[#575757] mb-4 line-clamp-2 text-xs sm:text-base">{destination.description}</p>}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs sm:text-sm">
                      {destination.category && (
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-[#008275] rounded-full"></div>
                          <span className="text-[#575757]">Kategori: {destination.category}</span>
                        </div>
                      )}
                      {destination.openingHours && (
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-[#008275]" />
                          <span className="text-[#575757]">{destination.openingHours}</span>
                        </div>
                      )}
                      {destination.ticketPrice && (
                        <div className="flex items-center gap-2">
                          <RupiahIcon />
                          <span className="text-[#575757]">{destination.ticketPrice}</span>
                        </div>
                      )}
                    </div>
                    {destination.location && (
                      <div className="flex items-center gap-2 mt-2">
                        <MapPin className="w-4 h-4 text-[#008275]" />
                        <span className="text-[#575757] text-xs sm:text-sm">{destination.location}</span>
                      </div>
                    )}
                  </div>
                ))}
                {/* Pagination Controls */}
                <div className="flex justify-center gap-2 mt-6">
                  <Button
                    variant="outline"
                    className="px-3 py-1"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  <span className="px-2 py-1 text-sm">Halaman {currentPage} dari {totalPages}</span>
                  <Button
                    variant="outline"
                    className="px-3 py-1"
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  )
}