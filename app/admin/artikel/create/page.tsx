"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabaseClient"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Save } from "lucide-react"
import Link from "next/link"

export default function CreateArtikelPage() {
  const [formData, setFormData] = useState({
    judul: "",
    slug: "",
    konten: "",
    excerpt: "",
    gambar: "",
    kategori: "",
    status: "draft",
  })
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))

    // Auto generate slug from title
    if (field === "judul") {
      const slug = value
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .trim()
      setFormData((prev) => ({
        ...prev,
        slug: slug,
      }))
    }
  }

  const handleSubmit = async (status: string) => {
    if (!formData.judul || !formData.konten) {
      alert("Judul dan konten harus diisi!")
      return
    }

    setLoading(true)

    try {
      const adminEmail = localStorage.getItem("adminEmail")
      const { data: adminData } = await supabase.from("admin").select("id, nama_admin").eq("email", adminEmail).single()

      const artikelData = {
        ...formData,
        status,
        author_id: adminData?.id,
        author_name: adminData?.nama_admin,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }

      const { error } = await supabase.from("artikel").insert(artikelData)

      if (error) throw error

      router.push("/admin/artikel")
    } catch (error) {
      console.error("Error saving artikel:", error)
      alert("Gagal menyimpan artikel!")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/artikel">
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Buat Artikel Baru</h1>
          <p className="text-gray-600">Tulis dan publikasikan artikel berita</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Konten Artikel</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="judul">Judul Artikel *</Label>
                <Input
                  id="judul"
                  value={formData.judul}
                  onChange={(e) => handleInputChange("judul", e.target.value)}
                  placeholder="Masukkan judul artikel..."
                />
              </div>

              <div>
                <Label htmlFor="slug">Slug URL</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => handleInputChange("slug", e.target.value)}
                  placeholder="url-artikel"
                />
              </div>

              <div>
                <Label htmlFor="excerpt">Ringkasan</Label>
                <Textarea
                  id="excerpt"
                  value={formData.excerpt}
                  onChange={(e) => handleInputChange("excerpt", e.target.value)}
                  placeholder="Ringkasan singkat artikel..."
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="konten">Konten Artikel *</Label>
                <Textarea
                  id="konten"
                  value={formData.konten}
                  onChange={(e) => handleInputChange("konten", e.target.value)}
                  placeholder="Tulis konten artikel di sini..."
                  rows={15}
                  className="min-h-[400px]"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Pengaturan Artikel</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="kategori">Kategori</Label>
                <Select value={formData.kategori} onValueChange={(value) => handleInputChange("kategori", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih kategori" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="berita">Berita</SelectItem>
                    <SelectItem value="wisata">Wisata</SelectItem>
                    <SelectItem value="kuliner">Kuliner</SelectItem>
                    <SelectItem value="budaya">Budaya</SelectItem>
                    <SelectItem value="event">Event</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="gambar">URL Gambar</Label>
                <Input
                  id="gambar"
                  value={formData.gambar}
                  onChange={(e) => handleInputChange("gambar", e.target.value)}
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              {formData.gambar && (
                <div>
                  <Label>Preview Gambar</Label>
                  <img
                    src={formData.gambar || "/placeholder.svg"}
                    alt="Preview"
                    className="w-full h-32 object-cover rounded border"
                    onError={(e) => {
                      e.currentTarget.style.display = "none"
                    }}
                  />
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Aksi</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button onClick={() => handleSubmit("draft")} variant="outline" className="w-full" disabled={loading}>
                <Save className="w-4 h-4 mr-2" />
                Simpan Draft
              </Button>
              <Button
                onClick={() => handleSubmit("published")}
                className="w-full bg-[#008275] hover:bg-[#00a38f]"
                disabled={loading}
              >
                {loading ? "Menyimpan..." : "Publikasikan"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
