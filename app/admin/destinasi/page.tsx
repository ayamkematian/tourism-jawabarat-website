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
import { Trash2, Search } from "lucide-react"

export default function DestinasiPage() {
  const [destinasi, setDestinasi] = useState<any[]>([])
  const [filteredDestinasi, setFilteredDestinasi] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedDeleteId, setSelectedDeleteId] = useState<number | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const ITEMS_PER_PAGE = 10

  useEffect(() => {
    fetchDestinasi()
  }, [])

  useEffect(() => {
    const filtered = destinasi.filter(
      (item) =>
        (item.nama?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
        (item.kategori?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
        (item.alamat?.toLowerCase() || "").includes(searchTerm.toLowerCase()),
    )
    setFilteredDestinasi(filtered)
    setCurrentPage(1)
  }, [searchTerm, destinasi])

  const fetchDestinasi = async () => {
    setLoading(true)
    const { data } = await supabase.from("destinasi").select("*").order("created_at", { ascending: false })

    setDestinasi(data || [])
    setFilteredDestinasi(data || [])
    setLoading(false)
  }

  const handleDelete = async (id: number) => {
    setDeleteLoading(true)
    await supabase.from("destinasi").delete().eq("id", id)
    setDeleteLoading(false)
    setDeleteDialogOpen(false)
    setSelectedDeleteId(null)
    fetchDestinasi()
  }

  const totalPages = Math.ceil(filteredDestinasi.length / ITEMS_PER_PAGE)
  const paginatedData = filteredDestinasi.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)

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
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Daftar Destinasi</h1>
        <p className="text-gray-600">Kelola destinasi wisata yang telah disetujui</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Destinasi Wisata ({filteredDestinasi.length})</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Cari destinasi..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3 font-medium text-gray-700">Nama Tempat</th>
                  <th className="text-left p-3 font-medium text-gray-700">Kategori</th>
                  <th className="text-left p-3 font-medium text-gray-700">Alamat</th>
                  <th className="text-left p-3 font-medium text-gray-700">Harga Tiket</th>
                  <th className="text-left p-3 font-medium text-gray-700">Jam Buka</th>
                  <th className="text-center p-3 font-medium text-gray-700">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.map((item) => (
                  <tr key={item.id} className="border-b hover:bg-gray-50">
                    <td className="p-3">
                      <div>
                        <p className="font-medium text-gray-900">{item.nama}</p>
                        <p className="text-sm text-gray-500">{item.slug}</p>
                      </div>
                    </td>
                    <td className="p-3">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                        {item.kategori}
                      </span>
                    </td>
                    <td className="p-3 text-sm text-gray-600 max-w-xs truncate">{item.alamat}</td>
                    <td className="p-3 text-sm text-gray-600">{item.hargatiket}</td>
                    <td className="p-3 text-sm text-gray-600">{item.jambuka}</td>
                    <td className="p-3 text-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedDeleteId(item.id)
                          setDeleteDialogOpen(true)
                        }}
                        className="text-red-600 hover:text-red-800 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {paginatedData.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              {searchTerm ? "Tidak ada destinasi yang sesuai dengan pencarian" : "Belum ada destinasi"}
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
            <AlertDialogTitle>Konfirmasi Hapus Destinasi</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus destinasi ini? Tindakan ini tidak dapat dibatalkan.
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
