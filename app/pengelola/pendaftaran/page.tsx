"use client"
import { useState, useRef } from "react"
import { Button } from "../../../components/ui/button"
import { Input } from "../../../components/ui/input"
import { Label } from "../../../components/ui/label"
import { Upload } from "lucide-react"
import { useRouter } from "next/navigation"

export default function PendaftaranDestinasi() {
  const [namaTempat, setNamaTempat] = useState("");
  const [nomorInduk, setNomorInduk] = useState("");
  const [npwp, setNpwp] = useState("");
  const [warning, setWarning] = useState("");
  const [ktpFile, setKtpFile] = useState<File | null>(null)
  const [aktaFile, setAktaFile] = useState<File | null>(null)
  const [sertifikatFile, setSertifikatFile] = useState<File | null>(null)
  const [izinFile, setIzinFile] = useState<File | null>(null)
  const [laporanFile, setLaporanFile] = useState<File | null>(null)
  const ktpInputRef = useRef<HTMLInputElement | null>(null)
  const aktaInputRef = useRef<HTMLInputElement | null>(null)
  const sertifikatInputRef = useRef<HTMLInputElement | null>(null)
  const izinInputRef = useRef<HTMLInputElement | null>(null)
  const laporanInputRef = useRef<HTMLInputElement | null>(null)
  const router = useRouter();

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

  const handleFileChange = (setter: any) => (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (validateFile(file)) {
        setter(file);
      } else {
        setter(null);
        e.target.value = "";
      }
    }
  };

  const handleSaveAndContinue = () => {
    // Simpan data ke localStorage agar bisa diambil di halaman detail
    localStorage.setItem("pendaftaranData", JSON.stringify({
      namaTempat, nomorInduk, npwp
    }))
    router.push("/pengelola/detail")
  }

  return (
    <div className="flex-1 bg-[#eaeaea] p-6">
      <div className="bg-[#ffffff] rounded-lg p-6 max-w-flex mx-auto w-full">
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
              <Input id="nomor-induk" type="text" className="mt-1" value={nomorInduk} onChange={e => setNomorInduk(e.target.value.replace(/[^0-9]/g, ""))} />
            </div>
            <div className="flex flex-col">
              <Label htmlFor="npwp" className="text-[#575757]">
                NPWP
              </Label>
              <Input id="npwp" type="text" className="mt-1" value={npwp} onChange={e => setNpwp(e.target.value.replace(/[^0-9]/g, ""))} />
            </div>
            <div className="flex flex-col gap-2">
              <Label className="text-[#575757]">Kartu Tanda Penduduk</Label>
              <input type="file" accept="image/*" ref={ktpInputRef} style={{display:'none'}} onChange={handleFileChange(setKtpFile)} />
              <Button type="button" className="w-40 bg-white border border-[#008275] text-[#008275] px-6 hover:bg-[#f3f3f3]" onClick={() => ktpInputRef.current?.click()}>
                <Upload className="w-4 h-4 mr-1" /> Upload KTP
              </Button>
              <span className="text-xs ml-2">{ktpFile?.name}</span>
            </div>
            <div className= 'flex flex-col gap-2'> 
              <Label className="text-[#575757]">Akta Pendirian Usaha</Label>
              <input type="file" accept="image/*" ref={aktaInputRef} style={{display:'none'}} onChange={handleFileChange(setAktaFile)} />
              <Button type="button" className="w-40 bg-white border border-[#008275] text-[#008275] px-6 hover:bg-[#f3f3f3]" onClick={() => aktaInputRef.current?.click()}>
                <Upload className="w-4 h-4 mr-1" /> Upload Akta
              </Button>
              <span className="text-xs ml-2">{aktaFile?.name}</span>
            </div>
          </div>
          <div className="space-y-4">
            <div className='flex flex-col gap-2'>
              <Label className="text-[#575757]">Sertifikat Tanah</Label>
              <input type="file" accept="image/*" ref={sertifikatInputRef} style={{display:'none'}} onChange={handleFileChange(setSertifikatFile)} />
              <Button type="button" className="w-40 bg-white border border-[#008275] text-[#008275] px-6 hover:bg-[#f3f3f3]" onClick={() => sertifikatInputRef.current?.click()}>
                <Upload className="w-4 h-4 mr-1" /> Upload Sertifikat
              </Button>
              <span className="text-xs ml-2">{sertifikatFile?.name}</span>
            </div>
            <div className='flex flex-col gap-2'>
              <Label className="text-[#575757]">Surat Izin Lurah dan Camat</Label>
              <input type="file" accept="image/*" ref={izinInputRef} style={{display:'none'}} onChange={handleFileChange(setIzinFile)} />
              <Button type="button" className="w-40 bg-white border border-[#008275] text-[#008275] px-6 hover:bg-[#f3f3f3]" onClick={() => izinInputRef.current?.click()}>
                <Upload className="w-4 h-4 mr-1" /> Upload Izin
              </Button>
              <span className="text-xs ml-2">{izinFile?.name}</span>
            </div>
            <div className='flex flex-col gap-2'>
              <Label className="text-[#575757]">Laporan Keuangan</Label>
              <input type="file" accept="image/*" ref={laporanInputRef} style={{display:'none'}} onChange={handleFileChange(setLaporanFile)} />
              <Button type="button" className="w-40 bg-white border border-[#008275] text-[#008275] px-6 hover:bg-[#f3f3f3]" onClick={() => laporanInputRef.current?.click()}>
                <Upload className="w-4 h-4 mr-1" /> Upload Laporan
              </Button>
              <span className="text-xs ml-2">{laporanFile?.name}</span>
            </div>
          </div>
        </div>
        <div className="flex gap-4 mt-8">
          <Button onClick={handleSaveAndContinue} className="bg-[#008275] hover:bg-[#4ca69d] text-white px-6">
            Simpan & Lanjutkan
          </Button>
          <Button onClick={() => router.push("/pengelola/dashboard")} 
            className="bg-white border border-[#008275] text-[#008275] px-6 hover:bg-[#f3f3f3]">
            Kembali
          </Button>
        </div>
      </div>
    </div>
  )
}
