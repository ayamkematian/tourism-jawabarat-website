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
  const [lokasi, setLokasi] = useState("");
  const [pengunjungMax, setPengunjungMax] = useState<string>("");

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
  const [kategori, setKategori] = useState("");

  const [pendaftaranData, setPendaftaranData] = useState<any>(null);
  const [ktpBase64, setKtpBase64] = useState<string | null>(null);
  const [aktaBase64, setAktaBase64] = useState<string | null>(null);
  const [sertifikatBase64, setSertifikatBase64] = useState<string | null>(null);
  const [izinBase64, setIzinBase64] = useState<string | null>(null);
  const [laporanBase64, setLaporanBase64] = useState<string | null>(null);

  useEffect(() => {
    // Ambil data pendaftaran dari localStorage
    const data = localStorage.getItem("pendaftaranData");
    if (data) {
      const parsed = JSON.parse(data);
      setPendaftaranData(parsed);
      setKtpBase64(parsed.ktp || null);
      setAktaBase64(parsed.akta || null);
      setSertifikatBase64(parsed.sertifikat || null);
      setIzinBase64(parsed.izin || null);
      setLaporanBase64(parsed.laporan || null);
    }
  }, []);

  // Fungsi konversi base64 ke File
  function base64ToFile(base64: string, filename: string): File {
    const arr = base64.split(",");
    const match = arr[0].match(/:(.*?);/);
    const mime = match ? match[1] : "application/octet-stream";
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  }

  const validatePhotoFile = (file: File) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      alert("File harus berupa jpg, jpeg, atau png.");
      return false;
    }
    if (file.size > 5120 * 5120) {
      alert("Ukuran file maksimal 5MB.");
      return false;
    }
    return true;
  };

  const handlePhotoInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      // Validasi setiap file baru
      const newFiles = Array.from(e.target.files).filter(validatePhotoFile);
      // Gabungkan dengan file yang sudah ada, maksimal 5 file unik
      const files = [...destinationPhotos, ...newFiles].slice(0, 5);
      const uniqueFiles = Array.from(new Map(files.map(f => [f.name, f])).values());
      setDestinationPhotos(uniqueFiles);
    }
  };

  const handleSubmit = async () => {
    setSubmitError("");
    setSubmitLoading(true);
    try {
      // Upload file ke Supabase Storage
      const uploadAndGetUrl = async (base64: string | null, bucket: string, filename: string) => {
        if (!base64) return "";
        const file = base64ToFile(base64, filename);
        const fileExt = filename.split('.').pop();
        const uniqueName = `${bucket}-${Date.now()}-${Math.random().toString(36).substr(2, 5)}.${fileExt}`;
        const { error: uploadError } = await supabase.storage.from(bucket).upload(uniqueName, file);
        if (uploadError) throw uploadError;
        const { data } = supabase.storage.from(bucket).getPublicUrl(uniqueName);
        return data.publicUrl;
      };
      const ktpUrl = await uploadAndGetUrl(ktpBase64, "foto-ktp", "ktp.jpg");
      const aktaUrl = await uploadAndGetUrl(aktaBase64, "foto-akte-pendirian-usaha", "akta.jpg");
      const sertifikatUrl = await uploadAndGetUrl(sertifikatBase64, "foto-sertifikat-tanah", "sertifikat.jpg");
      const izinUrl = await uploadAndGetUrl(izinBase64, "foto-surat-izin", "izin.jpg");
      const laporanUrl = await uploadAndGetUrl(laporanBase64, "foto-laporan-keuangan", "laporan.jpg");

      // Upload foto destinasi ke bucket 'foto-destinasi' Supabase
      let fotoUrls: string[] = [];
      if (destinationPhotos.length > 0) {
        for (const file of destinationPhotos) {
          const fileExt = file.name.split('.').pop();
          const uniqueName = `destinasi-${Date.now()}-${Math.random().toString(36).substr(2, 5)}.${fileExt}`;
          const { error: uploadError } = await supabase.storage.from("foto-destinasi").upload(uniqueName, file);
          if (uploadError) throw uploadError;
          const { data } = supabase.storage.from("foto-destinasi").getPublicUrl(uniqueName);
          fotoUrls.push(data.publicUrl);
        }
      }

      // 3. Ambil data detail dari form
      const deskripsi = (document.getElementById("deskripsi") as HTMLTextAreaElement)?.value || "";
      const kategori = (document.getElementById("kategori") as HTMLSelectElement)?.value || "";
      const jambuka = (document.getElementById("jam-buka") as HTMLInputElement)?.value || "";
      const hargatiketStr = (document.getElementById("harga-tiket") as HTMLInputElement)?.value || "";
      const hargatiket = hargatiketStr === "" ? null : parseInt(hargatiketStr, 10);
      const alamat = (document.getElementById("alamat") as HTMLTextAreaElement)?.value || "";
      const lokasi = (document.getElementById("lokasi") as HTMLSelectElement)?.value || "";

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
          nama: pendaftaranData?.namaTempat || "",
          slug,
          nibu: pendaftaranData?.nomorInduk || "",
          npwp: pendaftaranData?.npwp || "",
          ktp: ktpUrl,
          akta: aktaUrl,
          sertifikat: sertifikatUrl,
          izin: izinUrl,
          laporan: laporanUrl,
          deskripsi,
          kategori,
          jambuka,
          hargatiket,
          alamat,
          lokasi,
          pengelola_id: pengelolaId,
          fotourl: fotoUrls,
          pengunjung_max: pengunjungMax === "" ? null : parseInt(pengunjungMax, 10),
          status: "pending",
        },
      ]);
      if (insertError) throw insertError;

      // Kirim notifikasi ke admin
      await supabase.from("notifikasii").insert({
        user_email: null,
        role: "admin",
        pesan: `Pengajuan destinasi baru: "${pendaftaranData?.namaTempat}" oleh pengelola`,
        waktu: new Date().toISOString(),
        status: "unread"
      });

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
      <head><link rel="icon" href="/tic.png" /></head>
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
              <Input id="harga-tiket" type="number" min={0} className="mt-1" placeholder="25000" />
            </div>
            <div>
              <Label htmlFor="alamat" className="text-[#575757]">
                Alamat Lengkap
              </Label>
              <Textarea id="alamat" className="mt-1" />
            </div>.

            <div>
              <Label htmlFor="pengunjung-max" className="text-[#575757]">
                Jumlah Pengunjung Maksimal
              </Label>
              <Input
                id="pengunjung-max"
                type="number"
                min={1}
                className="mt-1"
                placeholder="Contoh: 100"
                value={pengunjungMax}
                onChange={e => setPengunjungMax(e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="lokasi" className="text-[#575757]">
                Lokasi
              </Label>
              <select
                id="lokasi"
                className="mt-1 w-full border rounded px-3 py-2 text-[#575757]"
                value={lokasi}
                onChange={e => setLokasi(e.target.value)}
                required
              >
                <option value="">Pilih Lokasi</option>
                {lokasiList.map((nama, idx) => (
                  <option key={idx} value={nama}>{nama}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="kategori" className="text-[#575757]">
                Kategori
              </Label>
              <select
                id="kategori"
                className="mt-1 w-full border rounded px-3 py-2 text-[#575757]"
                value={kategori}
                onChange={e => setKategori(e.target.value)}
                required
              >
                <option value="">Pilih Kategori</option>
                {kategoriList.map((nama, idx) => (
                  <option key={idx} value={nama}>{nama}</option>
                ))}
              </select>
            </div>
            <div>
              <Label className="text-[#575757]">Gambar (5 Foto) </Label>
              {}
              <div className="mt-1">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handlePhotoInput}
              />
              </div>
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
