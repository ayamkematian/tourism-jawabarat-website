"use client"
import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabaseClient"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { Search, Plus, Trash2, Edit, Eye } from "lucide-react"
import Link from "next/link"

export default function ArtikelPage() {
  const [artikel, setArtikel] = useState<any[]>([])
  const [filteredArtikel, setFilteredArtikel] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedDeleteId, setSelectedDeleteId] = useState<number | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const ITEMS_PER_PAGE = 10

  useEffect(() => {
    fetchArtikel()
  }, [])

  useEffect(() => {
    const filtered = artikel.filter(
      (item) =>
        item.judul.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.kategori.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.author_name && item.author_name.toLowerCase().includes(searchTerm.toLowerCase())),
    )
    setFilteredArtikel(filtered)
    setCurrentPage(1)
  }, [searchTerm, artikel])

  const fetchArtikel = async () => {
    setLoading(true)
    const { data } = await supabase.from("artikel").select("*").order("created_at", { ascending: false })

    setArtikel(data || [])
    setFilteredArtikel(data || [])
    setLoading(false)
  }

  const handleDelete = async (id: number) => {
    setDeleteLoading(true)
    await supabase.from("artikel").delete().eq("id", id)
    setDeleteLoading(false)
    setDeleteDialogOpen(false)
    setSelectedDeleteId(null)
    fetchArtikel()
  }

  const toggleStatus = async (id: number, currentStatus: string) => {
    const newStatus = currentStatus === "published" ? "draft" : "published"
    await supabase
      .from("artikel")
      .update({
        status: newStatus,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)

    fetchArtikel()
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "published":
        return <Badge className="bg-green-100 text-green-800">Published</Badge>
      case "draft":
        return <Badge variant="secondary">Draft</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const totalPages = Math.ceil(filteredArtikel.length / ITEMS_PER_PAGE)
  const paginatedData = filteredArtikel.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <head><link rel="icon" href="/tic.png" /></head>
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Kelola Artikel</h1>
          <p className="text-gray-600">Kelola artikel berita yang telah dibuat</p>
        </div>
        <Link href="/admin/artikel/create">
          <Button className="bg-[#008275] hover:bg-[#00a38f]">
            <Plus className="w-4 h-4 mr-2" />
            Buat Artikel
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Daftar Artikel ({filteredArtikel.length})</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Cari artikel..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {paginatedData.map((item) => (
              <div key={item.id} className="border rounded-lg p-4 hover:bg-gray-50">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-lg text-gray-900">{item.judul}</h3>
                      {getStatusBadge(item.status)}
                    </div>

                    {item.excerpt && <p className="text-gray-600 text-sm mb-2 line-clamp-2">{item.excerpt}</p>}

                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>Kategori: {item.kategori}</span>
                      <span>Penulis: {item.author_name}</span>
                      <span>Dibuat: {formatDate(item.created_at)}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 ml-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleStatus(item.id, item.status)}
                      className={
                        item.status === "published"
                          ? "text-orange-600 hover:text-orange-800"
                          : "text-green-600 hover:text-green-800"
                      }
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      asChild
                      variant="ghost"
                      size="sm"
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <Link href={`/admin/artikel/edit/${item.id}`}>
                        <Edit className="w-4 h-4" />
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedDeleteId(item.id)
                        setDeleteDialogOpen(true)
                      }}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {paginatedData.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              {searchTerm ? "Tidak ada artikel yang sesuai dengan pencarian" : "Belum ada artikel"}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-between items-center mt-6">
              <Button
                variant="outline"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <span className="text-sm text-gray-600">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Konfirmasi Hapus Artikel</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus artikel ini? Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteLoading}>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => selectedDeleteId && handleDelete(selectedDeleteId)}
              className="bg-red-600 hover:bg-red-700"
              disabled={deleteLoading}
            >
              {deleteLoading ? "Menghapus..." : "Hapus"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
