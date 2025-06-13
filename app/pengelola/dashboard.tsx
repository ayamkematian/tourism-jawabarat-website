"use client"

import { useState, useEffect, useRef } from "react"
import type { ChangeEvent } from "react"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { Textarea } from "../../components/ui/textarea"
import { Upload, MapPin, Clock, DollarSign } from "lucide-react"
import { supabase } from "../../lib/supabaseClient"

interface Destination {
  id: string
  name: string
  nibu?: string 
  npwp?: string
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

  const [ktpFile, setKtpFile] = useState<File | null>(null)
  const [aktaFile, setAktaFile] = useState<File | null>(null)
  const [sertifikatFile, setSertifikatFile] = useState<File | null>(null)
  const [izinFile, setIzinFile] = useState<File | null>(null)
  const [laporanFile, setLaporanFile] = useState<File | null>(null)
  const [ktpUrl, setKtpUrl] = useState("")
  const [aktaUrl, setAktaUrl] = useState("")
  const [sertifikatUrl, setSertifikatUrl] = useState("")
  const [izinUrl, setIzinUrl] = useState("")
  const [laporanUrl, setLaporanUrl] = useState("")
  const ktpInputRef = useRef<HTMLInputElement | null>(null)
  const aktaInputRef = useRef<HTMLInputElement | null>(null)
  const sertifikatInputRef = useRef<HTMLInputElement | null>(null)
  const izinInputRef = useRef<HTMLInputElement | null>(null)
  const laporanInputRef = useRef<HTMLInputElement | null>(null)

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

  const uploadSyaratDokumen = async (file: File, type: string) => {
    const fileExt = file.name.split('.').pop()
    const fileName = `${type}-${Date.now()}.${fileExt}`
    const { error } = await supabase.storage
      .from('syarat-foto')
      .upload(fileName, file)
    if (error) throw error
    return supabase.storage.from('syarat-foto').getPublicUrl(fileName).data.publicUrl
  }

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
          <div className="space-x-2 space-y-4">
            <Button onClick={() => setCurrentView("list")} 
              className="bg-[#008275] hover:bg-[#4ca69d] text-white px-6">
              Lihat Daftar Destinasi
            </Button>
            <Button
              onClick={() => setCurrentView("registration")}
              className="bg-white border border-[#008275] text-[#008275] px-6 hover:bg-[#f3f3f3]"
            >
              Tambah Destinasi Baru
            </Button>
          </div>
        )}
      </div>
    </div>
  )

  // RegistrationView: pindahkan state input ke dalam komponen agar input bisa diketik normal
  const RegistrationView = () => {
    const [namaTempat, setNamaTempat] = useState("");
    const [nomorInduk, setNomorInduk] = useState("");
    const [npwp, setNpwp] = useState("");
    const [warning, setWarning] = useState(""); // Tambahkan state untuk warning

      // Fungsi validasi file
  const validateFile = (file: File) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (!allowedTypes.includes(file.type)) {
      setWarning("File harus berupa jpg, jpeg, atau png.");
      return false;
    }
    if (file.size > 1024 * 1024) {
      setWarning("Ukuran file maksimal 1MB.");
      return false;
    }
    setWarning("");
    return true;
  };

  const handleFileChange = (setter: any) => (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (validateFile(file)) {
        setter(file);
      } else {
        setter(null);
        e.target.value = ""; // reset input jika tidak valid
      }
    }
  };
  
    const handleSaveAndContinue = async () => {
      let ktp = ktpUrl, akta = aktaUrl, sertifikat = sertifikatUrl, izin = izinUrl, laporan = laporanUrl
      if (ktpFile) ktp = await uploadSyaratDokumen(ktpFile, "ktp")
      if (aktaFile) akta = await uploadSyaratDokumen(aktaFile, "akta")
      if (sertifikatFile) sertifikat = await uploadSyaratDokumen(sertifikatFile, "sertifikat")
      if (izinFile) izin = await uploadSyaratDokumen(izinFile, "izin")
      if (laporanFile) laporan = await uploadSyaratDokumen(laporanFile, "laporan")
      setKtpUrl(ktp); setAktaUrl(akta); setSertifikatUrl(sertifikat); setIzinUrl(izin); setLaporanUrl(laporan)
      setCurrentDestination({
        ...currentDestination,
        id: Date.now().toString(),
        name: namaTempat,
        nibu: nomorInduk,
        npwp: npwp, 
        status: "pending",
        registrationDate: new Date().toLocaleDateString("id-ID")
      })
      setCurrentView("details")
    }

    return (
      <div className="flex-1 bg-[#eaeaea] p-6">
        <div className="bg-[#ffffff] rounded-lg p-6 max-w-4xl">
          <h1 className="text-2xl font-bold text-[#000000] mb-2">Pendaftaran Destinasi</h1>
          <p className="text-[#575757] mb-6">Isi data di bawah dengan lengkap</p>
          {warning && (
            <div className="mb-4 text-xs text-[#ff0000] font-semibold">{warning}</div>
          )}
          <div className="grid grid-cols-2 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="nama-tempat" className="text-[#575757]">
                  Nama Tempat
                </Label>
                <Input id="nama-tempat" className="mt-1" value={namaTempat} onChange={e => setNamaTempat(e.target.value)} />
              </div>

              <div className="flex flex-col">
                <Label htmlFor="nomor-induk" className="text-[#575757]">
                  Nomor Induk Berusaha
                </Label>
                <Input id="nomor-induk" type="number" className="mt-1" value={nomorInduk} onChange={e => setNomorInduk(e.target.value.replace(/[^0-9]/g, ""))} />
              </div>

              <div className="flex flex-col">
                <Label htmlFor="npwp" className="text-[#575757]">
                  NPWP
                </Label>
                <Input id="npwp" type="number" className="mt-1" value={npwp} onChange={e => setNpwp(e.target.value.replace(/[^0-9]/g, ""))} />
              </div>

              <div className="flex flex-col gap-2">
                <Label className="text-[#575757]">Kartu Tanda Penduduk</Label>
                <input type="file" accept="image/*" ref={ktpInputRef} style={{display:'none'}} onChange={handleFileChange(setKtpFile)} />
                <Button type="button" className="w-40 bg-white border border-[#008275] text-[#008275] px-6 hover:bg-[#f3f3f3]" onClick={() => ktpInputRef.current?.click()}>
                  <Upload className="w-4 h-4 mr-1" /> Upload KTP
                </Button>
                <span className="text-xs ml-2">{ktpFile?.name || (ktpUrl && "Sudah diupload")}</span>
              </div>

              <div className= 'flex flex-col gap-2'> 
                <Label className="text-[#575757]">Akta Pendirian Usaha</Label>
                <input type="file" accept="image/*" ref={aktaInputRef} style={{display:'none'}} onChange={handleFileChange(setAktaFile)} />
                <Button type="button" className="w-40 bg-white border border-[#008275] text-[#008275] px-6 hover:bg-[#f3f3f3]" onClick={() => aktaInputRef.current?.click()}>
                  <Upload className="w-4 h-4 mr-1" /> Upload Akta
                </Button>
                <span className="text-xs ml-2">{aktaFile?.name || (aktaUrl && "Sudah diupload")}</span>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className='flex flex-col gap-2'>
                <Label className="text-[#575757]">Sertifikat Tanah</Label>
                <input type="file" accept="image/*" ref={sertifikatInputRef} style={{display:'none'}} onChange={handleFileChange(setSertifikatFile)} />
                <Button type="button" className="w-40 bg-white border border-[#008275] text-[#008275] px-6 hover:bg-[#f3f3f3]" onClick={() => sertifikatInputRef.current?.click()}>
                  <Upload className="w-4 h-4 mr-1" /> Upload Sertifikat
                </Button>
                <span className="text-xs ml-2">{sertifikatFile?.name || (sertifikatUrl && "Sudah diupload")}</span>
              </div>

              <div className='flex flex-col gap-2'>
                <Label className="text-[#575757]">Surat Izin Lurah dan Camat</Label>
                <input type="file" accept="image/*" ref={izinInputRef} style={{display:'none'}} onChange={handleFileChange(setIzinFile)} />
                <Button type="button" className="w-40 bg-white border border-[#008275] text-[#008275] px-6 hover:bg-[#f3f3f3]" onClick={() => izinInputRef.current?.click()}>
                  <Upload className="w-4 h-4 mr-1" /> Upload Izin
                </Button>
                <span className="text-xs ml-2">{izinFile?.name || (izinUrl && "Sudah diupload")}</span>
              </div>

              <div className='flex flex-col gap-2'>
                <Label className="text-[#575757]">Laporan Keuangan</Label>
                <input type="file" accept="image/*" ref={laporanInputRef} style={{display:'none'}} onChange={handleFileChange(setLaporanFile)} />
                <Button type="button" className="w-40 bg-white border border-[#008275] text-[#008275] px-6 hover:bg-[#f3f3f3]" onClick={() => laporanInputRef.current?.click()}>
                  <Upload className="w-4 h-4 mr-1" /> Upload Laporan
                </Button>
                <span className="text-xs ml-2">{laporanFile?.name || (laporanUrl && "Sudah diupload")}</span>
              </div>
            </div>
          </div>

          <div className="flex gap-4 mt-8">
            <Button onClick={handleSaveAndContinue} className="bg-[#008275] hover:bg-[#4ca69d] text-white px-6">
              Simpan & Lanjutkan
            </Button>
            <Button
              onClick={() => setCurrentView("dashboard")}
              className="bg-white border border-[#008275] text-[#008275] px-6 hover:bg-[#f3f3f3]"
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
                  Jam Buka.a
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
                  <Button className="text-[#008275] border-[#008275]">
                    <Upload className="w-4 h-4 mr-1" />
                    Tambahkan file
                  </Button>
                  <span className="text-[#ff0000] text-xs">format jpg/png/png maksimal 1MB</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-4 mt-8">
            <Button onClick={handleSubmit} className="bg-[#008275] hover:bg-[#4ca69d] text-white px-6">
              Kirim
            </Button>
            <Button
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
            onClick={() => setCurrentView("dashboard")}
            className="bg-white border border-[#008275] text-[#008275] px-6 hover:bg-[#f3f3f3]"
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
