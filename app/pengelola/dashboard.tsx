"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Home, Upload, User, MapPin, Clock, DollarSign } from "lucide-react"
import { supabase } from "@/lib/supabaseClient"

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
  status: "pending" | "approved" | "rejected"
  registrationDate: string
}

export default function Component() {
  const [currentView, setCurrentView] = useState<"dashboard" | "registration" | "details" | "list">("dashboard")
  const [destinations, setDestinations] = useState<Destination[]>([])
  const [currentDestination, setCurrentDestination] = useState<Partial<Destination>>({})

  const fetchDestinasiWithPengelola = async () => {
    // Ambil email pengelola dari localStorage
    const email = typeof window !== "undefined" ? localStorage.getItem("pengelolaEmail") : null
    if (!email) return []
    // Ambil id pengelola dari tabel users
    const { data: pengelola, error: userError } = await supabase
      .from("users")
      .select("id, namalengkap")
      .eq("email", email)
      .eq("role", "pengelola")
      .single()
    if (userError || !pengelola?.id) return []
    // Ambil destinasi berdasarkan pengelola_id
    const { data, error } = await supabase
      .from("daftar_destinasi")
      .select("*", { count: "exact" })
      .eq("pengelola_id", pengelola.id)
      .order("created_at", { ascending: false })
    if (error) return []
    // Tambahkan nama pengelola ke setiap destinasi
    return (data || []).map((item: any) => ({ ...item, manager: pengelola.namalengkap }))
  }

  useEffect(() => {
    const getData = async () => {
      const data = await fetchDestinasiWithPengelola()
      setDestinations(
        data.map((item: any) => ({
          id: item.id,
          name: item.nama,
          description: item.deskripsi,
          category: item.kategori,
          openingHours: item.jambuka,
          ticketPrice: item.hargatiket,
          address: item.alamat,
          location: item.lokasi,
          manager: item.manager || "-",
          status: "pending",
          registrationDate: item.created_at
            ? new Date(item.created_at).toLocaleDateString("id-ID")
            : "",
        }))
      )
    }
    getData()
  }, [currentView])

  const DashboardView = () => (
    <div className="flex-1 bg-[#eaeaea] p-6">
      <div className="bg-[#ffffff] rounded-lg p-6 max-w-2xl">
        <h1 className="text-2xl font-bold text-[#000000] mb-2">Dashboard</h1>
        <p className="text-[#575757] mb-6">Selamat Datang di Dashboard Pengelola Wisata</p>

        {destinations.length === 0 ? (
          <div className="space-y-4">
            <Input
              placeholder="Belum ada destinasi aktif"
              className="bg-[#fafafa] border-[#b4b4b4] text-[#a4a4a4]"
              disabled
            />
            <Button
              onClick={() => setCurrentView("registration")}
              className="bg-[#008275] hover:bg-[#4ca69d] text-white px-6"
            >
              Daftar Destinasi
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <Button onClick={() => setCurrentView("list")} className="bg-[#008275] hover:bg-[#4ca69d] text-white px-6">
              Lihat Daftar Destinasi
            </Button>
            <Button
              onClick={() => setCurrentView("registration")}
              variant="outline"
              className="border-[#008275] text-[#008275] px-6"
            >
              Tambah Destinasi Baru
            </Button>
          </div>
        )}
      </div>
    </div>
  )

  const RegistrationView = () => {
    const handleSaveAndContinue = () => {
      setCurrentDestination({
        id: Date.now().toString(),
        name: (document.getElementById("nama-tempat") as HTMLInputElement)?.value || "",
        status: "pending",
        registrationDate: new Date().toLocaleDateString("id-ID"),
      })
      setCurrentView("details")
    }

    return (
      <div className="flex-1 bg-[#eaeaea] p-6">
        <div className="bg-[#ffffff] rounded-lg p-6 max-w-4xl">
          <h1 className="text-2xl font-bold text-[#000000] mb-2">Pendaftaran Destinasi</h1>
          <p className="text-[#575757] mb-6">Isi data di bawah dengan lengkap</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="nama-tempat" className="text-[#575757]">
                  Nama Tempat
                </Label>
                <Input id="nama-tempat" className="mt-1" />
              </div>

              <div>
                <Label htmlFor="nomor-induk" className="text-[#575757]">
                  Nomor Induk Berusaha
                </Label>
                <Input id="nomor-induk" className="mt-1" />
              </div>

              <div>
                <Label htmlFor="npwp" className="text-[#575757]">
                  NPWP
                </Label>
                <Input id="npwp" className="mt-1" />
              </div>

              <div>
                <Label className="text-[#575757]">Kartu Tanda Penduduk</Label>
                <div className="mt-1 flex items-center gap-2">
                  <Button variant="outline" size="sm" className="text-[#008275] border-[#008275]">
                    <Upload className="w-4 h-4 mr-1" />
                    Tambahkan file
                  </Button>
                  <span className="text-[#ff0000] text-xs">format jpg/png/png maksimal 5MB</span>
                </div>
              </div>

              <div>
                <Label className="text-[#575757]">Akta Pendirian Usaha</Label>
                <div className="mt-1 flex items-center gap-2">
                  <Button variant="outline" size="sm" className="text-[#008275] border-[#008275]">
                    <Upload className="w-4 h-4 mr-1" />
                    Tambahkan file
                  </Button>
                  <span className="text-[#ff0000] text-xs">format jpg/png/png maksimal 5MB</span>
                </div>
              </div>

              <div>
                <Label className="text-[#575757]">Kartu Tanda Penduduk</Label>
                <div className="mt-1 flex items-center gap-2">
                  <Button variant="outline" size="sm" className="text-[#008275] border-[#008275]">
                    <Upload className="w-4 h-4 mr-1" />
                    Tambahkan file
                  </Button>
                  <span className="text-[#ff0000] text-xs">format jpg/png/png maksimal 5MB</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label className="text-[#575757]">Sertifikat Tanah</Label>
                <div className="mt-1 flex items-center gap-2">
                  <Button variant="outline" size="sm" className="text-[#008275] border-[#008275]">
                    <Upload className="w-4 h-4 mr-1" />
                    Tambahkan file
                  </Button>
                  <span className="text-[#ff0000] text-xs">format jpg/png/png maksimal 5MB</span>
                </div>
              </div>

              <div>
                <Label className="text-[#575757]">Surat Izin Lurah dan Camat</Label>
                <div className="mt-1 flex items-center gap-2">
                  <Button variant="outline" size="sm" className="text-[#008275] border-[#008275]">
                    <Upload className="w-4 h-4 mr-1" />
                    Tambahkan file
                  </Button>
                  <span className="text-[#ff0000] text-xs">format jpg/png/png maksimal 5MB</span>
                </div>
              </div>

              <div>
                <Label className="text-[#575757]">Laporan Keuangan</Label>
                <div className="mt-1 flex items-center gap-2">
                  <Button variant="outline" size="sm" className="text-[#008275] border-[#008275]">
                    <Upload className="w-4 h-4 mr-1" />
                    Tambahkan file
                  </Button>
                  <span className="text-[#ff0000] text-xs">format jpg/png/png maksimal 5MB</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-4 mt-8">
            <Button onClick={handleSaveAndContinue} className="bg-[#008275] hover:bg-[#4ca69d] text-white px-6">
              Simpan & Lanjutkan
            </Button>
            <Button
              variant="outline"
              onClick={() => setCurrentView("dashboard")}
              className="border-[#008275] text-[#008275]"
            >
              Kembali
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const DetailsView = () => {
    const handleSubmit = async () => {
      // Ambil data form
      const description = (document.getElementById("deskripsi") as HTMLTextAreaElement)?.value || ""
      const category = (document.getElementById("kategori") as HTMLInputElement)?.value || ""
      const openingHours = (document.getElementById("jam-buka") as HTMLInputElement)?.value || ""
      const ticketPrice = (document.getElementById("harga-tiket") as HTMLInputElement)?.value || ""
      const address = (document.getElementById("alamat") as HTMLTextAreaElement)?.value || ""
      const location = (document.getElementById("lokasi") as HTMLInputElement)?.value || ""
      // Ambil email pengelola dari localStorage
      const email = typeof window !== "undefined" ? localStorage.getItem("pengelolaEmail") : null
      let pengelolaId = null
      if (email) {
        // Ambil id dari tabel users, bukan loginpengelola
        const { data: pengelola } = await supabase.from("users").select("id").eq("email", email).eq("role", "pengelola").single()
        if (pengelola?.id) pengelolaId = pengelola.id
      }
      // Insert ke daftar_destinasi
      await supabase.from("daftar_destinasi").insert([
        {
          nama: currentDestination.name,
          slug: currentDestination.name?.toLowerCase().replace(/\s+/g, "-"),
          deskripsi: description,
          kategori: category,
          jambuka: openingHours,
          hargatiket: ticketPrice,
          alamat: address,
          lokasi: location,
          pengelola_id: pengelolaId,
        },
      ])
      setCurrentView("list")
    }

    return (
      <div className="flex-1 bg-[#eaeaea] p-6">
        <div className="bg-[#ffffff] rounded-lg p-6 max-w-4xl">
          <h1 className="text-2xl font-bold text-[#000000] mb-2">Detail Destinasi Wisata</h1>
          <p className="text-[#575757] mb-6">Lengkapi informasi destinasi wisata anda</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="deskripsi" className="text-[#575757]">
                  Deskripsi
                </Label>
                <Textarea id="deskripsi" className="mt-1 min-h-[100px]" />
              </div>

              <div>
                <Label htmlFor="jam-buka" className="text-[#575757]">
                  Jam Buka
                </Label>
                <Input id="jam-buka" className="mt-1" placeholder="08:00 - 17:00" />
              </div>

              <div>
                <Label htmlFor="harga-tiket" className="text-[#575757]">
                  Harga Tiket
                </Label>
                <Input id="harga-tiket" className="mt-1" placeholder="Rp 25.000" />
              </div>

              <div>
                <Label htmlFor="alamat" className="text-[#575757]">
                  Alamat Lengkap
                </Label>
                <Textarea id="alamat" className="mt-1" />
              </div>

              <div>
                <Label htmlFor="lokasi" className="text-[#575757]">
                  Lokasi
                </Label>
                <Input id="lokasi" className="mt-1" placeholder="Bogor, Jawa Barat" />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="kategori" className="text-[#575757]">
                  Kategori
                </Label>
                <Input id="kategori" className="mt-1" placeholder="Wisata Air" />
              </div>

              <div>
                <Label className="text-[#575757]">Gambar (5 Foto)</Label>
                <div className="mt-1 flex items-center gap-2">
                  <Button variant="outline" size="sm" className="text-[#008275] border-[#008275]">
                    <Upload className="w-4 h-4 mr-1" />
                    Tambahkan file
                  </Button>
                  <span className="text-[#ff0000] text-xs">format jpg/png/png maksimal 5MB</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-4 mt-8">
            <Button onClick={handleSubmit} className="bg-[#008275] hover:bg-[#4ca69d] text-white px-6">
              Kirim
            </Button>
            <Button
              variant="outline"
              onClick={() => setCurrentView("registration")}
              className="border-[#008275] text-[#008275]"
            >
              Kembali
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const ListView = () => (
    <div className="flex-1 bg-[#eaeaea] p-6">
      <div className="bg-[#ffffff] rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-[#000000] mb-2">Daftar Destinasi Wisata</h1>
            <p className="text-[#575757]">Destinasi yang telah didaftarkan</p>
          </div>
          <Button
            onClick={() => setCurrentView("registration")}
            className="bg-[#008275] hover:bg-[#4ca69d] text-white px-6"
          >
            Tambah Destinasi
          </Button>
        </div>

        <div className="space-y-4">
          {destinations.map((destination) => (
            <div
              key={destination.id}
              className="border border-[#eaeaea] rounded-lg p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-[#000000] mb-1">{destination.name}</h3>
                  <p className="text-[#575757] text-sm">Pengelola: {destination.manager}</p>
                  <p className="text-[#888888] text-xs">Didaftarkan pada: {destination.registrationDate}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      destination.status === "pending"
                        ? "bg-[#fff3cd] text-[#856404]"
                        : destination.status === "approved"
                          ? "bg-[#d4edda] text-[#155724]"
                          : "bg-[#f8d7da] text-[#721c24]"
                    }`}
                  >
                    {destination.status === "pending"
                      ? "Dalam Proses"
                      : destination.status === "approved"
                        ? "Disetujui"
                        : "Ditolak"}
                  </span>
                </div>
              </div>

              {destination.description && <p className="text-[#575757] mb-4 line-clamp-2">{destination.description}</p>}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
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
                    <DollarSign className="w-4 h-4 text-[#008275]" />
                    <span className="text-[#575757]">{destination.ticketPrice}</span>
                  </div>
                )}
              </div>

              {destination.location && (
                <div className="flex items-center gap-2 mt-2">
                  <MapPin className="w-4 h-4 text-[#008275]" />
                  <span className="text-[#575757] text-sm">{destination.location}</span>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-6">
          <Button
            variant="outline"
            onClick={() => setCurrentView("dashboard")}
            className="border-[#008275] text-[#008275]"
          >
            Kembali ke Dashboard
          </Button>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <div className="flex">
        {currentView === "dashboard" && <DashboardView />}
        {currentView === "registration" && <RegistrationView />}
        {currentView === "details" && <DetailsView />}
        {currentView === "list" && <ListView />}
      </div>
      <div className="fixed bottom-4 left-4">
        <button className="text-[#888888] text-sm flex items-center gap-1">
          Keluar <span>→</span>
        </button>
      </div>
    </div>
  )
}
