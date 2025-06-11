"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Home, ArrowRight, Loader2 } from "lucide-react"
import Link from "next/link"
import { supabase } from "@/lib/supabaseClient"
import { Textarea } from "@/components/ui/textarea"

export default function Component() {
  const [currentView, setCurrentView] = useState<"empty" | "withDestination" | "registration" | "details">("empty")
  const [namaPengelola, setNamaPengelola] = useState<string>("")
  const [form, setForm] = useState({
    nama: "",
    slug: "",
    gambar: "",
    deskripsi: "",
    lokasi: "",
    kategori: "",
    alamat: "",
    hargatiket: "",
    jambuka: "",
    nibu: "",
    npwp: "",
    ktp: "",
    akta: "",
    sertifikat: "",
    izin: "",
    laporan: "",
  })
  const [destinasi, setDestinasi] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(true)

  useEffect(() => {
    setIsFetching(true)
    // Ambil email pengelola dari localStorage
    const email = typeof window !== "undefined" ? localStorage.getItem("pengelolaEmail") : null
    if (!email) {
      setIsFetching(false)
      return
    }
    const fetchNama = async () => {
      const { data, error } = await supabase.from("loginpengelola").select("namalengkap, id").eq("email", email).single()
      if (data && data.namalengkap) setNamaPengelola(data.namalengkap)
      if (data && data.id) {
        // Ambil semua destinasi milik pengelola ini
        const { data: destinasiData } = await supabase
          .from("daftar_destinasi")
          .select("*")
          .eq("pengelola_id", data.id)
          .order("created_at", { ascending: false })
        if (destinasiData && destinasiData.length > 0) {
          setDestinasi(destinasiData)
          setCurrentView("withDestination")
        }
      }
      setIsFetching(false)
    }
    fetchNama()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async () => {
    setLoading(true)
    // Validate required fields
    if (!form.nama || !form.nibu || !form.npwp) {
      alert("Harap isi nama tempat, NIBU, dan NPWP")
      setLoading(false)
      return
    }
    setLoading(false)
    // Instead of saving to database, move to details form
    setCurrentView("details")
  }

  const handleFinalSubmit = async () => {
    setLoading(true)
    const slug = form.nama.toLowerCase().replace(/\s+/g, "-")
    // Ambil email pengelola dari localStorage
    const email = typeof window !== "undefined" ? localStorage.getItem("pengelolaEmail") : null
    let pengelolaId = null
    if (email) {
      const { data: pengelola } = await supabase.from("loginpengelola").select("id").eq("email", email).single()
      if (pengelola && pengelola.id) pengelolaId = pengelola.id
    }
    // Insert ke daftar_destinasi
    const { data, error } = await supabase
      .from("daftar_destinasi")
      .insert([
        {
          nama: form.nama,
          slug,
          gambar: form.gambar,
          deskripsi: form.deskripsi,
          lokasi: form.lokasi,
          kategori: form.kategori,
          alamat: form.alamat,
          hargatiket: form.hargatiket,
          jambuka: form.jambuka,
          nibu: form.nibu,
          npwp: form.npwp,
          ktp: form.ktp,
          akta: form.akta,
          sertifikat: form.sertifikat,
          izin: form.izin,
          laporan: form.laporan,
          pengelola_id: pengelolaId,
          created_at: new Date().toISOString(),
        },
      ])
      .select()
      .single()
    setLoading(false)
    if (!error && data) {
      setDestinasi(data)
      setCurrentView("withDestination")
    } else {
      alert("Gagal menyimpan data")
    }
  }

  // Hapus handleDetailsSubmit, gunakan handleFinalSubmit saja

  const Header = () => (
    <header className="bg-[#ffffff] border-b border-[#eaeaea] px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src="/tic.png" alt="Logo" className="w-10 h-10 rounded-lg" />
          <span className="text-[#008275] font-medium">Tourism Information Center</span>
        </div>
        <div className="flex items-center gap-3">
          <Avatar className="w-8 h-8">
            <AvatarFallback className="bg-[#eaeaea] text-[#575757] text-sm">👤</AvatarFallback>
          </Avatar>
          <span className="bg-[#008275] text-[#ffffff] px-3 py-1 rounded text-sm">{namaPengelola || "Pengelola"}</span>
        </div>
      </div>
    </header>
  )

  const Sidebar = () => (
    <aside className="w-full md:w-48 bg-[#ffffff] border-r border-[#eaeaea] min-h-screen">
      <div className="p-4">
        <div className="flex items-center gap-3 text-[#1e1e1e] font-medium">
          <Home className="w-5 h-5" />
          Dashboard
        </div>
      </div>
      <div className="absolute bottom-4 left-4">
        <Link href="/login/pengelola" className="flex items-center gap-2 text-[#888888] text-sm">
          Keluar <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </aside>
  )

  const EmptyDashboard = () => (
    <main className="flex-1 bg-[#eaeaea] p-4 md:p-6">
      <div className="bg-[#ffffff] rounded-lg p-4 md:p-6 h-full">
        <h1 className="text-xl md:text-2xl font-bold text-[#1e1e1e] mb-2">Dashboard</h1>
        <p className="text-[#888888] mb-4 md:mb-8">Selamat Datang di Dashboard Pengelola Wisata</p>

        <div className="max-w-md">
          <Input
            placeholder="Belum ada destinasi aktif"
            className="mb-4 bg-[#fafafa] border-[#b4b4b4] text-[#a4a4a4]"
          />
          <Button
            className="bg-[#4ca69d] hover:bg-[#008275] text-[#ffffff]"
            onClick={() => setCurrentView("registration")}
          >
            Daftar Destinasi
          </Button>
        </div>
      </div>
    </main>
  )

  const RegistrationForm = () => (
    <main className="flex-1 bg-[#eaeaea] p-4 md:p-6">
      <div className="bg-[#ffffff] rounded-lg p-4 md:p-6 h-full overflow-y-auto">
        <h1 className="text-xl md:text-2xl font-bold text-[#1e1e1e] mb-2">Pendaftaran Destinasi</h1>
        <p className="text-[#888888] mb-4 md:mb-8">Isi data di bawah dengan lengkap</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 max-w-4xl">
          <div className="space-y-4">
            <div>
              <label className="block text-[#575757] text-sm mb-2">Nama Tempat</label>
              <Input className="border-[#b4b4b4]" name="nama" value={form.nama} onChange={handleChange} />
            </div>

            <div>
              <label className="block text-[#575757] text-sm mb-2">Nomor Induk Berusaha</label>
              <Input className="border-[#b4b4b4]" name="nibu" value={form.nibu} onChange={handleChange} />
            </div>

            <div>
              <label className="block text-[#575757] text-sm mb-2">NPWP</label>
              <Input className="border-[#b4b4b4]" name="npwp" value={form.npwp} onChange={handleChange} />
            </div>

            <div>
              <label className="block text-[#575757] text-sm mb-2">Kartu Tanda Penduduk</label>
              <Input className="border-[#b4b4b4]" name="ktp" value={form.ktp} onChange={handleChange} />
            </div>

            <div>
              <label className="block text-[#575757] text-sm mb-2">Akta Pendirian Usaha</label>
              <Input className="border-[#b4b4b4]" name="akta" value={form.akta} onChange={handleChange} />
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-[#575757] text-sm mb-2">Sertifikat Tanah</label>
              <Input className="border-[#b4b4b4]" name="sertifikat" value={form.sertifikat} onChange={handleChange} />
            </div>

            <div>
              <label className="block text-[#575757] text-sm mb-2">Surat Izin Lurah dan Camat</label>
              <Input className="border-[#b4b4b4]" name="izin" value={form.izin} onChange={handleChange} />
            </div>

            <div>
              <label className="block text-[#575757] text-sm mb-2">Laporan Keuangan</label>
              <Input className="border-[#b4b4b4]" name="laporan" value={form.laporan} onChange={handleChange} />
            </div>
          </div>
        </div>

        <div className="mt-8">
          <Button
            className="bg-[#4ca69d] hover:bg-[#008275] text-[#ffffff] px-8"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Mengirim..." : "Kirim"}
          </Button>
        </div>
      </div>
    </main>
  )

  const DetailsForm = () => (
    <main className="flex-1 bg-[#eaeaea] p-4 md:p-6">
      <div className="bg-[#ffffff] rounded-lg p-4 md:p-6 h-full overflow-y-auto">
        <h1 className="text-xl md:text-2xl font-bold text-[#1e1e1e] mb-2">Detail Destinasi Wisata</h1>
        <p className="text-[#888888] mb-4 md:mb-8">Lengkapi informasi destinasi wisata Anda</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 max-w-4xl">
          <div className="space-y-4">
            <div>
              <label className="block text-[#575757] text-sm mb-2">Deskripsi</label>
              <Textarea
                name="deskripsi"
                value={form.deskripsi}
                onChange={handleChange}
                placeholder="Deskripsi lengkap tentang tempat wisata"
              />
            </div>

            <div>
              <label className="block text-[#575757] text-sm mb-2">Alamat Lengkap</label>
              <Input
                className="border-[#b4b4b4]"
                name="alamat"
                value={form.alamat}
                onChange={handleChange}
                placeholder="Jl. Contoh No. 123, Kecamatan, Kota"
              />
            </div>

            <div>
              <label className="block text-[#575757] text-sm mb-2">Lokasi (Kota/Kabupaten)</label>
              <Input
                className="border-[#b4b4b4]"
                name="lokasi"
                value={form.lokasi}
                onChange={handleChange}
                placeholder="Contoh: Bogor"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-[#575757] text-sm mb-2">Kategori</label>
              <Input
                className="border-[#b4b4b4]"
                name="kategori"
                value={form.kategori}
                onChange={handleChange}
                placeholder="Contoh: Taman Hiburan, Wisata Alam, Museum"
              />
            </div>

            <div>
              <label className="block text-[#575757] text-sm mb-2">Jam Buka</label>
              <Input
                className="border-[#b4b4b4]"
                name="jambuka"
                value={form.jambuka}
                onChange={handleChange}
                placeholder="Contoh: 08:00 - 17:00 WIB"
              />
            </div>

            <div>
              <label className="block text-[#575757] text-sm mb-2">Harga Tiket</label>
              <Input
                className="border-[#b4b4b4]"
                name="hargatiket"
                value={form.hargatiket}
                onChange={handleChange}
                placeholder="Contoh: Rp 25.000 - Rp 50.000"
              />
            </div>

            <div>
              <label className="block text-[#575757] text-sm mb-2">URL Gambar</label>
              <Input
                className="border-[#b4b4b4]"
                name="gambar"
                value={form.gambar}
                onChange={handleChange}
                placeholder="https://example.com/image.jpg"
              />
            </div>
          </div>
        </div>

        <div className="mt-8 flex gap-4">
          <Button
            variant="outline"
            onClick={() => setCurrentView("registration")}
            className="border-[#4ca69d] text-[#4ca69d]"
          >
            Kembali
          </Button>
          <Button
            className="bg-[#4ca69d] hover:bg-[#008275] text-[#ffffff] px-8"
            onClick={handleFinalSubmit}
            disabled={loading}
          >
            {loading ? "Mengirim..." : "Simpan & Selesai"}
          </Button>
        </div>
      </div>
    </main>
  )
  const DashboardWithDestination = () => (
    <main className="flex-1 bg-[#eaeaea] p-4 md:p-6">
      <div className="bg-[#ffffff] rounded-lg p-4 md:p-6 h-full">
        <h1 className="text-xl md:text-2xl font-bold text-[#1e1e1e] mb-2">Dashboard</h1>
        <p className="text-[#888888] mb-4 md:mb-8">Selamat Datang di Dashboard Pengelola Wisata</p>

        {Array.isArray(destinasi) && destinasi.length > 0 ? (
          destinasi.map((item: any) => (
            <Card key={item.id} className="max-w-md mb-4 border-[#eaeaea]">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-[#1e1e1e]">{item.nama}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-[#888888] text-sm">Status: Dalam proses pengecekan...</p>
                <p className="text-[#888888] text-sm mt-2">NIBU: {item.nibu}</p>
                <p className="text-[#888888] text-sm">NPWP: {item.npwp}</p>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card className="max-w-md mb-4 border-[#eaeaea]">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg text-[#1e1e1e]">Waterboom Bogor</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-[#888888] text-sm">Dalam proses pengecekan...</p>
            </CardContent>
          </Card>
        )}

        <Button
          className="bg-[#4ca69d] hover:bg-[#008275] text-[#ffffff]"
          onClick={() => setCurrentView("registration")}
        >
          Daftar Destinasi
        </Button>
      </div>
    </main>
  )

  // Komponen loading spinner
  const LoadingSpinner = () => (
    <main className="flex-1 flex items-center justify-center bg-[#eaeaea]">
      <div className="flex flex-col items-center">
        <Loader2 className="animate-spin w-12 h-12 text-[#4ca69d] mb-4" />
        <span className="text-[#4ca69d] text-lg font-semibold">Memuat data destinasi...</span>
      </div>
    </main>
  )

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <Header />
      <div className="flex">
        <Sidebar />
        {isFetching ? <LoadingSpinner /> : (
          <>
            {currentView === "empty" && <EmptyDashboard />}
            {currentView === "withDestination" && <DashboardWithDestination />}
            {currentView === "registration" && <RegistrationForm />}
            {currentView === "details" && <DetailsForm />}
          </>
        )}
      </div>
    </div>
  )
}
