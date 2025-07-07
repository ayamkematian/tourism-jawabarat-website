"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "../../../../lib/supabaseClient"
import { Button } from "../../../../components/ui/button"
import { Input } from "../../../../components/ui/input"
import { Loader2 } from "lucide-react"

export default function EditDestinasiPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const id = params.id
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    nama: "",
    deskripsi: "",
    kategori: "",
    jambuka: "",
    hargatiket: "",
    alamat: "",
    lokasi: "",
  })

  useEffect(() => {
    if (!id) return
    const fetchDestinasi = async () => {
      setLoading(true)
      const { data } = await supabase
        .from("daftar_destinasi")
        .select("*")
        .eq("id", id)
        .single()
      if (data) {
        setForm({
          nama: data.nama || "",
          deskripsi: data.deskripsi || "",
          kategori: data.kategori || "",
          jambuka: data.jambuka || "",
          hargatiket: data.hargatiket || "",
          alamat: data.alamat || "",
          lokasi: data.lokasi || "",
        })
      }
      setLoading(false)
    }
    fetchDestinasi()
  }, [id])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    await supabase
      .from("daftar_destinasi")
      .update(form)
      .eq("id", id)
    setSaving(false)
    alert("Destinasi berhasil diupdate!")
    router.push("/pengelola/dashboard")
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="animate-spin w-8 h-8 text-[#008275]" />
      </div>
    )
  }

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-lg shadow mt-8">
      <h1 className="text-2xl font-bold mb-4">Edit Destinasi Wisata</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Nama Destinasi</label>
          <Input name="nama" value={form.nama} onChange={handleChange} required />
        </div>
        <div>
          <label className="block mb-1 font-medium">Deskripsi</label>
          <textarea name="deskripsi" value={form.deskripsi} onChange={handleChange} className="w-full border rounded p-2" rows={3} required />
        </div>
        <div>
          <label className="block mb-1 font-medium">Kategori</label>
          <Input name="kategori" value={form.kategori} onChange={handleChange} required />
        </div>
        <div>
          <label className="block mb-1 font-medium">Jam Buka</label>
          <Input name="jambuka" value={form.jambuka} onChange={handleChange} required />
        </div>
        <div>
          <label className="block mb-1 font-medium">Harga Tiket</label>
          <Input name="hargatiket" value={form.hargatiket} onChange={handleChange} required />
        </div>
        <div>
          <label className="block mb-1 font-medium">Alamat</label>
          <Input name="alamat" value={form.alamat} onChange={handleChange} required />
        </div>
        <div>
          <label className="block mb-1 font-medium">Lokasi</label>
          <Input name="lokasi" value={form.lokasi} onChange={handleChange} required />
        </div>
        <Button type="submit" className="w-full bg-[#008275] text-white" disabled={saving}>
          {saving ? "Menyimpan..." : "Simpan Perubahan"}
        </Button>
      </form>
    </div>
  )
}