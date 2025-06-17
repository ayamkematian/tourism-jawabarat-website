"use client"
import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabaseClient"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
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
import { ChevronDown, ChevronUp } from "lucide-react"

export default function PengajuanPage() {
  const [pengajuan, setPengajuan] = useState<any[]>([])
  const [pengelolaList, setPengelolaList] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedDetail, setSelectedDetail] = useState<number | null>(null)
  const [acceptDialogOpen, setAcceptDialogOpen] = useState(false)
  const [selectedAcceptId, setSelectedAcceptId] = useState<number | null>(null)
  const [acceptLoading, setAcceptLoading] = useState(false)
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false)
  const [selectedRejectId, setSelectedRejectId] = useState<number | null>(null)
  const [rejectLoading, setRejectLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const ITEMS_PER_PAGE = 10

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)

    const { data: pengajuanData } = await supabase
      .from("daftar_destinasi")
      .select("*")
      .order("created_at", { ascending: false })

    // Ambil data pengelola dari tabel users dengan role pengelola
    const { data: pengelolaData } = await supabase
      .from("users")
      .select("id, namalengkap")
      .eq("role", "pengelola")
    
    // Urutkan: pending dulu, lalu Disetujui/Ditolak
    const sortedPengajuan = (pengajuanData || []).sort((a, b) => {
      if (a.status === "pending" && b.status !== "pending") return -1;
      if (a.status !== "pending" && b.status === "pending") return 1;
      return 0;
    });

    setPengajuan(sortedPengajuan)
    setPengelolaList(pengelolaData || [])
    setLoading(false)
  }

  const handleAccept = async (id: number) => {
    setAcceptLoading(true)

    const pengajuanItem = pengajuan.find((item) => item.id === id)
    if (pengajuanItem) {
      // Update status di daftar_destinasi
      await supabase
        .from("daftar_destinasi")
        .update({
          status: "Disetujui",
          is_validated: true,
        })
        .eq("id", id)

      // Insert ke tabel destinasi
      const destinasiData = {
        nama: pengajuanItem.nama,
        slug: pengajuanItem.slug,
        gambar: Array.isArray(pengajuanItem.fotourl) ? pengajuanItem.fotourl[0] : pengajuanItem.fotourl,
        deskripsi: pengajuanItem.deskripsi,
        lokasi: pengajuanItem.lokasi,
        kategori: pengajuanItem.kategori,
        alamat: pengajuanItem.alamat,
        hargatiket: pengajuanItem.hargatiket,
        jambuka: pengajuanItem.jambuka,
        fotourl: pengajuanItem.fotourl,
        pengunjung_max: pengajuanItem.pengunjung_max,
      }
      await supabase.from("destinasi").insert(destinasiData)

      // Kirim notifikasi ke pengelola
      // Ambil email pengelola dari tabel users
      const { data: pengelolaData } = await supabase
        .from("users")
        .select("email")
        .eq("id", pengajuanItem.pengelola_id)
        .single();
      if (pengelolaData?.email) {
        await supabase.from("notifikasii").insert({
          user_email: pengelolaData.email,
          pesan: `Pengajuan destinasi \"${pengajuanItem.nama}\" telah DISETUJUI.`,
          waktu: new Date().toISOString(),
          status: "unread"
        });
      }
    }

    setAcceptLoading(false)
    setAcceptDialogOpen(false)
    setSelectedAcceptId(null)
    fetchData()
  }

  const handleReject = async (id: number) => {
    setRejectLoading(true)
    // Update status menjadi Ditolak
    await supabase
      .from("daftar_destinasi")
      .update({ status: "Ditolak", is_validated: false })
      .eq("id", id)
    // Kirim notifikasi ke pengelola
    const pengajuanItem = pengajuan.find((item) => item.id === id)
    if (pengajuanItem) {
      const { data: pengelolaData } = await supabase
        .from("users")
        .select("email")
        .eq("id", pengajuanItem.pengelola_id)
        .single();
      if (pengelolaData?.email) {
        await supabase.from("notifikasii").insert({
          user_email: pengelolaData.email,
          pesan: `Pengajuan destinasi \"${pengajuanItem.nama}\" telah DITOLAK dan dihapus dari daftar pengajuan.`,
          waktu: new Date().toISOString(),
          status: "unread"
        });
      }
    }
    // Hapus data pengajuan dari daftar_destinasi
    await supabase
      .from("daftar_destinasi")
      .delete()
      .eq("id", id)
    setRejectLoading(false)
    setRejectDialogOpen(false)
    setSelectedRejectId(null)
    fetchData()
  }

  const getPengelolaName = (pengelolaId: number) => {
    const pengelola = pengelolaList.find((p) => p.id === pengelolaId)
    return pengelola ? pengelola.namalengkap : `ID: ${pengelolaId}`
  }

  const totalPages = Math.ceil(pengajuan.length / ITEMS_PER_PAGE)
  const paginatedData = pengajuan.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6 px-2 sm:px-4 md:px-6 max-w-3xl mx-auto w-full">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">List Pengajuan Destinasi</h1>
        <p className="text-gray-600">Kelola pengajuan destinasi dan akomodasi wisata</p>
      </div>

      <Card className="w-full max-w-full">
        <CardHeader>
          <CardTitle>Daftar Pengajuan ({pengajuan.length})</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto w-full max-w-full">
          <div className="space-y-4">
            {paginatedData.map((item) => (
              <div key={item.id} className="border rounded-lg w-full max-w-full">
                <div
                  className="p-4 cursor-pointer hover:bg-gray-50 flex items-center justify-between w-full max-w-full"
                  onClick={() => setSelectedDetail(selectedDetail === item.id ? null : item.id)}
                >
                  <div className="grid grid-cols-1 sm:grid-cols-4 md:grid-cols-4 gap-2 w-full">
                    <div className="col-span-2">
                      <p className="text-sm text-gray-500 break-words text-wrap">Pendaftar</p>
                      <p className="font-medium break-words text-wrap whitespace-nowrap">{getPengelolaName(item.pengelola_id)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 break-words text-wrap">Nama Tempat</p>
                      <p className="font-medium break-words text-wrap">{item.nama}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 break-words text-wrap">Kategori</p>
                      <p className="font-medium break-words text-wrap">{item.kategori}</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-500 break-words text-wrap">Status</p>
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            item.status === "Disetujui"
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {item.status}
                        </span>
                      </div>
                      {selectedDetail === item.id ? <ChevronUp /> : <ChevronDown />
                      }
                    </div>
                  </div>
                </div>

                {selectedDetail === item.id && (
                  <div className="border-t bg-gray-50 p-4 space-y-3 overflow-x-auto w-full max-w-full">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-full">
                      <div>
                        <p className="text-sm font-medium text-gray-700">Alamat:</p>
                        <p className="text-sm text-gray-600">{item.alamat}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">Lokasi:</p>
                        <p className="text-sm text-gray-600">{item.lokasi}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">Harga Tiket:</p>
                        <p className="text-sm text-gray-600">Rp {item.hargatiket}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">Jam Buka:</p>
                        <p className="text-sm text-gray-600">{item.jambuka}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">Deskripsi:</p>
                        <p className="text-sm text-gray-600">{item.deskripsi}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">Nomor Induk Berusaha:</p>
                        <p className="text-sm text-gray-600">{item.nibu}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">NPWP:</p>
                        <p className="text-sm text-gray-600">{item.npwp}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">KTP:</p>
                        {item.ktp ? (
                          <a href={item.ktp} target="_blank" rel="noopener noreferrer">
                            <img
                              src={item.ktp}
                              alt="KTP"
                              className="w-32 h-20 object-cover rounded border hover:opacity-80 transition"
                            />
                          </a>
                        ) : (
                          <span className="text-sm text-gray-600">Tidak ada file</span>
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">Akta Pendirian Usaha:</p>
                        {item.akta ? (
                          <a href={item.akta} target="_blank" rel="noopener noreferrer">
                            <img
                              src={item.akta}
                              alt="Akta"
                              className="w-32 h-20 object-cover rounded border hover:opacity-80 transition"
                            />
                          </a>
                        ) : (
                          <span className="text-sm text-gray-600">Tidak ada file</span>
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">Sertifikat Tanah:</p>
                        {item.sertifikat ? (
                          <a href={item.sertifikat} target="_blank" rel="noopener noreferrer">
                            <img
                              src={item.sertifikat}
                              alt="Sertifikat"
                              className="w-32 h-20 object-cover rounded border hover:opacity-80 transition"
                            />
                          </a>
                        ) : (
                          <span className="text-sm text-gray-600">Tidak ada file</span>
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">Surat Izin Lurah dan Camat:</p>
                        {item.izin ? (
                          <a href={item.izin} target="_blank" rel="noopener noreferrer">
                            <img
                              src={item.izin}
                              alt="Izin"
                              className="w-32 h-20 object-cover rounded border hover:opacity-80 transition"
                            />
                          </a>
                        ) : (
                          <span className="text-sm text-gray-600">Tidak ada file</span>
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">Laporan Keuangan:</p>
                        {item.laporan ? (
                          <a href={item.laporan} target="_blank" rel="noopener noreferrer">
                            <img
                              src={item.laporan}
                              alt="Laporan"
                              className="w-32 h-20 object-cover rounded border hover:opacity-80 transition"
                            />
                          </a>
                        ) : (
                          <span className="text-sm text-gray-600">Tidak ada file</span>
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">Foto Destinasi:</p>
                        {item.fotourl && Array.isArray(item.fotourl) && item.fotourl.length > 0 ? (
                          <div className="flex gap-2 flex-wrap">
                            {item.fotourl.map((url: string, idx: number) => (
                              <a
                                key={idx}
                                href={url}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <img
                                  src={url}
                                  alt={`Preview ${idx + 1}`}
                                  className="w-32 max-w-full h-20 object-cover rounded border hover:opacity-80 transition"
                                />
                              </a>
                            ))}
                          </div>
                        ) : (
                          <span className="text-sm text-gray-600">Tidak ada gambar</span>
                        )}
                      </div>
                    </div>

                    {item.status !== "Disetujui" && (
                      <div className="pt-3 border-t flex gap-2">
                        <Button
                          onClick={(e) => {
                            e.stopPropagation()
                            setSelectedAcceptId(item.id)
                            setAcceptDialogOpen(true)
                          }}
                          className="bg-[#008275] hover:bg-[#00a38f]"
                        >
                          Setujui Pengajuan
                        </Button>
                        <Button
                          variant="destructive"
                          onClick={(e) => {
                            e.stopPropagation()
                            setSelectedRejectId(item.id)
                            setRejectDialogOpen(true)
                          }}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          Tolak Pengajuan
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

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

      {/* Accept Dialog */}
      <AlertDialog open={acceptDialogOpen} onOpenChange={setAcceptDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Konfirmasi Persetujuan</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menyetujui pengajuan destinasi ini? Data akan divalidasi dan ditambahkan ke daftar
              destinasi.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={acceptLoading}>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => selectedAcceptId && handleAccept(selectedAcceptId)}
              className="bg-green-600 hover:bg-green-700"
              disabled={acceptLoading}
            >
              {acceptLoading ? "Memproses..." : "Setujui"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Reject Dialog */}
      <AlertDialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Konfirmasi Penolakan</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menolak dan menghapus pengajuan destinasi ini? Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={rejectLoading}>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => selectedRejectId && handleReject(selectedRejectId)}
              className="bg-red-600 hover:bg-red-700"
              disabled={rejectLoading}
            >
              {rejectLoading ? "Memproses..." : "Tolak & Hapus"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
