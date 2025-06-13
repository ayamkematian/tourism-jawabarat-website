"use client"
import { useState, useEffect } from "react"
import { Button } from "../../../components/ui/button"
import { Input } from "../../../components/ui/input"
import { Label } from "../../../components/ui/label"
import { Textarea } from "../../../components/ui/textarea"
import { Upload } from "lucide-react"
import { useRouter } from "next/navigation"
import { supabase } from "../../../lib/supabaseClient"

export default function DetailDestinasi() {
  const [destinationPhotos, setDestinationPhotos] = useState<File[]>([])
  const [submitLoading, setSubmitLoading] = useState(false)
  const [submitError, setSubmitError] = useState("")
  const router = useRouter()

  const validatePhotoFile = (file: File) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (!allowedTypes.includes(file.type)) {
      alert("File harus berupa jpg, jpeg, atau png.");
      return false;
    }
    if (file.size > 1024 * 1024) {
      alert("Ukuran file maksimal 1MB.");
      return false;
    }
    return true;
  };

  const handlePhotoInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = [...destinationPhotos, ...Array.from(e.target.files)].slice(0, 5);
      const uniqueFiles = Array.from(new Map(files.map(f => [f.name, f])).values());
      setDestinationPhotos(uniqueFiles);
    }
  };

  const handleSubmit = async () => {
    setSubmitError("");
    if (destinationPhotos.length === 0) {
      setSubmitError("Silakan upload minimal 1 foto destinasi.");
      return;
    }
    setSubmitLoading(true);
    try {
      // 1. Ambil data pendaftaran dari localStorage
      const pendaftaranData = JSON.parse(localStorage.getItem("pendaftaranData") || "{}");

      // 2. Upload foto destinasi ke bucket
      const uploadedPhotoUrls: string[] = [];
      for (const file of destinationPhotos) {
        const fileExt = file.name.split('.').pop();
        const fileName = `destinasi-${Date.now()}-${Math.random().toString(36).substr(2, 5)}.${fileExt}`;
        const { error: uploadError } = await supabase.storage.from('foto-destinasi').upload(fileName, file);
        if (uploadError) throw uploadError;
        const { data } = supabase.storage.from('foto-destinasi').getPublicUrl(fileName);
        uploadedPhotoUrls.push(data.publicUrl);
      }

      // 3. Ambil data detail dari form
      const deskripsi = (document.getElementById("deskripsi") as HTMLTextAreaElement)?.value || "";
      const kategori = (document.getElementById("kategori") as HTMLInputElement)?.value || "";
      const jambuka = (document.getElementById("jam-buka") as HTMLInputElement)?.value || "";
      const hargatiket = (document.getElementById("harga-tiket") as HTMLInputElement)?.value || "";
      const alamat = (document.getElementById("alamat") as HTMLTextAreaElement)?.value || "";
      const lokasi = (document.getElementById("lokasi") as HTMLInputElement)?.value || "";

      // 4. Gabungkan semua data
      const slug = pendaftaranData.namaTempat
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");

      // 5. Ambil email pengelola dari localStorage
      const email = typeof window !== "undefined" ? localStorage.getItem("pengelolaEmail") : null;
      let pengelolaId = null;
      if (email) {
        const { data: pengelola } = await supabase.from("users").select("id").eq("email", email).eq("role", "pengelola").single();
        if (pengelola?.id) pengelolaId = pengelola.id;
      }

      // 6. Insert ke tabel daftar_destinasi SEKALI SAJA
      const { error: insertError } = await supabase.from("daftar_destinasi").insert([
        {
          nama: pendaftaranData.namaTempat,
          nibu: pendaftaranData.nomorInduk,
          npwp: pendaftaranData.npwp,
          ktp: pendaftaranData.ktp,
          akta: pendaftaranData.akta,
          sertifikat: pendaftaranData.sertifikat,
          izin: pendaftaranData.izin,
          laporan: pendaftaranData.laporan,
          deskripsi,
          kategori,
          jambuka,
          hargatiket,
          alamat,
          lokasi,
          pengelola_id: pengelolaId,
          fotourl: uploadedPhotoUrls,
          slug,
          status: "pending",
        },
      ]);
      if (insertError) throw insertError;

      alert("Pendaftaran destinasi berhasil!");
      setDestinationPhotos([]);
      localStorage.removeItem("pendaftaranData");
      router.push("/pengelola/dashboard");
    } catch (err: any) {
      setSubmitError(err?.message || "Gagal upload data/foto destinasi.");
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <div className="flex-1 bg-[#eaeaea] p-6">
      <div className="bg-[#ffffff] rounded-lg p-6 max-w-flex mx-auto w-full">
        <h1 className="text-2xl font-bold text-[#000000] mb-2">Detail Destinasi Wisata</h1>
        <p className="text-[#575757] mb-6">Lengkapi informasi destinasi wisata anda</p>
        {submitError && (
          <div className="mb-4 text-xs text-[#ff0000] font-semibold">{submitError}</div>
        )}
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
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handlePhotoInput}
                className="mt-1"
              />
              <div className="flex gap-2 mt-2 flex-wrap">
                {destinationPhotos.map((file, idx) => (
                  <div key={idx} className="flex flex-col items-center">
                    <img
                      src={URL.createObjectURL(file)}
                      alt={file.name}
                      className="w-20 h-20 object-cover rounded border mb-1"
                    />
                    <span className="text-xs text-center max-w-[80px] break-words">{file.name}</span>
                    <button
                      type="button"
                      className="text-xs text-red-500 mt-1"
                      onClick={() => setDestinationPhotos(destinationPhotos.filter((_, i) => i !== idx))}
                    >
                      Hapus
                    </button>
                  </div>
                ))}
              </div>
              <span className="text-[#ff0000] text-xs">format jpg/png maksimal 1MB, maksimal 5 foto</span>
            </div>
          </div>
        </div>
        <div className="flex gap-4 mt-8">
          <Button onClick={handleSubmit} className="bg-[#008275] hover:bg-[#4ca69d] text-white px-6" disabled={submitLoading}>
            {submitLoading ? "Menyimpan..." : "Kirim"}
          </Button>
          <Button onClick={() => router.push("/pengelola/pendaftaran")} 
            className="bg-white border border-[#008275] text-[#008275] px-6 hover:bg-[#f3f3f3]" disabled={submitLoading}>
            Kembali
          </Button>
        </div>
      </div>
    </div>
  )
}
