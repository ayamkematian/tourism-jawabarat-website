"use client";
import Image from "next/image"
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { useRouter } from "next/navigation";
import { ChevronDown, Trash2 } from "lucide-react";

export default function AdminDashboard() {
  const [pengajuan, setPengajuan] = useState<any[]>([]);
  const [destinasi, setDestinasi] = useState<any[]>([]);
  const [pengelolaList, setPengelolaList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedDetail, setSelectedDetail] = useState<number | null>(null);
  const [adminName, setAdminName] = useState<string>("");
  const [openLogout, setOpenLogout] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedDeleteId, setSelectedDeleteId] = useState<number|null>(null);
  const [acceptDialogOpen, setAcceptDialogOpen] = useState(false);
  const [selectedAcceptId, setSelectedAcceptId] = useState<number|null>(null);
  const [acceptLoading, setAcceptLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const router = useRouter();

  const DESTINASI_PER_PAGE = 5;
  const PENGAJUAN_PER_PAGE = 5;
  const [currentPengajuanPage, setCurrentPengajuanPage] = useState(1);

  // Fetch data dari Supabase
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      // Ambil email admin dari localStorage
      const email = typeof window !== "undefined" ? localStorage.getItem("adminEmail") : null;
      if (email) {
        const { data: adminData } = await supabase
          .from("admin")
          .select("nama_admin")
          .eq("email", email)
          .single();
        if (adminData && adminData.nama_admin) setAdminName(adminData.nama_admin);
      }
      // Ambil data pengajuan dari daftar_destinasi
      const { data: pengajuanData } = await supabase
        .from("daftar_destinasi")
        .select("*");
      setPengajuan(pengajuanData || []);
      // Ambil data destinasi dari tabel destinasi
      const { data: destinasiData } = await supabase
        .from("destinasi")
        .select("*");
      setDestinasi(destinasiData || []);
      // Ambil data pengelola
      const { data: pengelolaData } = await supabase
        .from("loginpengelola")
        .select("*");
      setPengelolaList(pengelolaData || []);
      setLoading(false);
    };
    fetchData();
  }, []);

  // Fungsi untuk menerima pengajuan
  const handleAccept = async (id: number) => {
    setAcceptLoading(true);
    // Ambil data pengajuan yang di-accept
    const pengajuanItem = pengajuan.find((item) => item.id === id);
    if (pengajuanItem) {
      // Update is_validated di daftar_destinasi
      await supabase.from("daftar_destinasi").update({ is_validated: true }).eq("id", id);
      // Cek apakah sudah ada di destinasi
      const exists = destinasi.some((d) => d.nama === pengajuanItem.nama);
      if (!exists) {
        // Hanya ambil field yang ada di tabel destinasi
        const destinasiData = {
          nama: pengajuanItem.nama,
          slug: pengajuanItem.slug,
          gambar: pengajuanItem.gambar,
          deskripsi: pengajuanItem.deskripsi,
          lokasi: pengajuanItem.lokasi,
          kategori: pengajuanItem.kategori,
          alamat: pengajuanItem.alamat,
          hargatiket: pengajuanItem.hargatiket,
          jambuka: pengajuanItem.jambuka,
          created_at: pengajuanItem.created_at,
        };
        await supabase.from("destinasi").insert(destinasiData);
      }
    }
    setAcceptLoading(false);
    // Refresh data
    const { data: pengajuanData } = await supabase
      .from("daftar_destinasi")
      .select("*");
    setPengajuan(pengajuanData || []);
    const { data: destinasiData } = await supabase
      .from("destinasi")
      .select("*");
    setDestinasi(destinasiData || []);
  };

  // Fungsi untuk menghapus destinasi
  const handleDeleteDestinasi = async (id: number) => {
    setDeleteLoading(true);
    await supabase.from("destinasi").delete().eq("id", id);
    setDeleteLoading(false);
    // Refresh data
    const { data: destinasiData } = await supabase
      .from("destinasi")
      .select("*");
    setDestinasi(destinasiData || []);
    setDeleteDialogOpen(false);
    setSelectedDeleteId(null);
  };

  // Hitung paginasi destinasi
  const totalDestinasi = destinasi.length;
  const totalDestinasiPages = Math.ceil(totalDestinasi / DESTINASI_PER_PAGE);
  const paginatedDestinasi = destinasi.slice((currentPage - 1) * DESTINASI_PER_PAGE, currentPage * DESTINASI_PER_PAGE);

  // Hitung paginasi pengajuan
  const totalPengajuan = pengajuan.length;
  const totalPengajuanPages = Math.ceil(totalPengajuan / PENGAJUAN_PER_PAGE);
  const paginatedPengajuan = pengajuan.slice((currentPengajuanPage - 1) * PENGAJUAN_PER_PAGE, currentPengajuanPage * PENGAJUAN_PER_PAGE);

  return (
    <div className={`min-h-screen bg-[#f9f9f9] text-[#2d2d2d] transition-opacity duration-500 ${isLoggingOut ? 'opacity-0' : 'opacity-100'}`}>
      {/* Header */}
      <header className="w-full bg-white py-4 px-6 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-2">
            <Image src="/tic.png" alt="Tourism Logo" width={70} height={70} />
            <span className="text-[#008275] font-medium">| Tourism Information Center</span>
        </div>
        <div className="flex items-center gap-4 relative">
          <button className="relative">
            <span className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center">
              🔔
            </span>
          </button>
          <div className="relative">
            <button
              className="flex items-center gap-2 focus:outline-none"
              onClick={() => setShowMenu((v) => !v)}
              title="Menu Admin"
              type="button"
            >
              <Image src="/user.png" alt="Admin Image" width={40} height={40} />
              <span>{adminName || "Admin"}</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${showMenu ? 'rotate-180' : ''}`} />
            </button>
            {showMenu && (
              <div className="absolute right-0 mt-2 w-36 bg-white border rounded shadow-lg z-20 animate-fade-in">
                <button
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 text-[#d32f2f] font-medium"
                  onClick={() => {
                    setShowMenu(false);
                    setOpenLogout(true);
                  }}
                >
                  Log Out
                </button>
              </div>
            )}
          </div>
          <AlertDialog open={openLogout} onOpenChange={setOpenLogout}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Konfirmasi Log Out</AlertDialogTitle>
                <div className="max-h-32 overflow-y-auto border rounded p-2 bg-gray-50 text-gray-700 text-sm">
                  Log Out dari akun admin? Anda akan keluar dari dashboard dan harus login kembali untuk mengakses fitur admin. Pastikan data penting sudah disimpan sebelum keluar.
                  <br /><br />
                  Jika Anda yakin ingin keluar, klik tombol Log Out di bawah.
                </div>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Batal</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => {
                    setOpenLogout(false);
                    setIsLoggingOut(true);
                    setTimeout(() => {
                      localStorage.removeItem("adminEmail");
                      router.push("/login");
                    }, 600);
                  }}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  Log Out
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </header>

      {/* Stats Section */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-4 p-6">
        <div className="stat-box">
          <p className="text-sm">Jumlah Wisatawan Lokal</p>
          <p className="text-2xl font-bold">10.000.000</p>
        </div>
        <div className="stat-box">
          <p className="text-sm">Kabupaten/Kota Terfavorit</p>
          <p className="text-xl font-bold">Kabupaten Bandung Barat</p>
        </div>
        <div className="stat-box">
          <p className="text-sm">Destinasi Wisata Terpopuler</p>
          <p className="text-xl font-bold">Curug Malela</p>
        </div>
        <div className="stat-box">
          <p className="text-sm">Jumlah Wisatawan Mancanegara</p>
          <p className="text-2xl font-bold">10.000.000</p>
        </div>
      </section>

      {/* Tables Section */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
        {/* List Pengajuan */}
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-lg font-semibold mb-4">List Pengajuan Destinasi dan Akomodasi</h3>
          <table className="w-full text-sm text-left border-collapse">
            <thead>
              <tr className="border-b">
                <th className="py-2 px-4">Kode</th>
                <th className="py-2 px-4">Nama Pendaftar</th>
                <th className="py-2 px-4">Nama Tempat</th>
                <th className="py-2 px-4">Jenis Tempat</th>
                <th className="py-2 px-4">Status</th>
                <th className="py-2 px-4">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {paginatedPengajuan.map((item, index) => (
                <>
                  <tr key={index} className="border-b cursor-pointer hover:bg-gray-100" onClick={() => setSelectedDetail(selectedDetail === item.id ? null : item.id)}>
                    <td className="py-2 px-4">{item.kode}</td>
                    <td className="py-2 px-4">
                  {(() => {
                    const pengelola = pengelolaList.find((p) => p.id === item.pengelola_id);
                    return pengelola ? pengelola.namalengkap : item.pengelola_id;
                  })()}
                </td>
                <td className="py-2 px-4">{item.nama}</td>
                <td className="py-2 px-4">{item.kategori}</td>
                <td className="py-2 px-4">{item.status}</td>
                <td className="py-2 px-4">
                  {item.status !== "Disetujui" && (
                    <button
                      className="text-xs bg-[#008275] text-white px-2 py-1 rounded transition-all duration-200 hover:scale-105 hover:bg-[#00a38f]"
                      onClick={e => {
                        e.stopPropagation();
                        setSelectedAcceptId(item.id);
                        setAcceptDialogOpen(true);
                      }}
                    >
                      Accept
                    </button>
                  )}
                </td>
                  </tr>
                  {selectedDetail === item.id && (
                    <tr>
                      <td colSpan={6} className="bg-gray-50 p-4">
                        <div>
                          <div><b>Kode:</b> {item.kode}</div>
                          <div><b>Nama Pendaftar:</b> {(() => {
                            const pengelola = pengelolaList.find((p) => p.id === item.pengelola_id);
                            return pengelola ? pengelola.namalengkap : item.pengelola_id;
                          })()}</div>
                          <div><b>Jenis Tempat:</b> {item.kategori}</div>
                          <div><b>Nama Tempat:</b> {item.nama}</div>
                          <div><b>Status:</b> {item.status}</div>
                          <div><b>Alamat:</b> {item.alamat}</div>
                          <div><b>Deskripsi:</b> {item.deskripsi}</div>
                          <div><b>Lokasi:</b> {item.lokasi}</div>
                          <div><b>Harga Tiket:</b> {item.hargatiket}</div>
                          <div><b>Jam Buka:</b> {item.jambuka}</div>
                          <div><b>NIBU:</b> {item.nibu}</div>
                          <div><b>NPWP:</b> {item.npwp}</div>
                          <div><b>KTP:</b> {item.ktp}</div>
                          <div><b>Akta:</b> {item.akta}</div>
                          <div><b>Sertifikat:</b> {item.sertifikat}</div>
                          <div><b>Izin:</b> {item.izin}</div>
                          <div><b>Laporan Keuangan:</b> {item.laporan}</div>
                          <div><b>URL Gambar:</b> {item.gambar}</div>
                          {/* Tambahkan field lain jika ada */}
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
          <div className="flex justify-between items-center mt-4">
            <button
              className="text-sm text-[#008275] disabled:opacity-50"
              onClick={() => setCurrentPengajuanPage((p) => Math.max(1, p - 1))}
              disabled={currentPengajuanPage === 1}
            >
              Previous Page
            </button>
            <p className="text-sm">
              Page {currentPengajuanPage} of {totalPengajuanPages}
            </p>
            <button
              className="text-sm text-[#008275] disabled:opacity-50"
              onClick={() => setCurrentPengajuanPage((p) => Math.min(totalPengajuanPages, p + 1))}
              disabled={currentPengajuanPage === totalPengajuanPages || totalPengajuanPages === 0}
            >
              Next Page
            </button>
          </div>
        </div>

        {/* Daftar Destinasi */}
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-lg font-semibold mb-4">Daftar Destinasi dan Akomodasi</h3>
          <table className="w-full text-sm text-left border-collapse">
            <thead>
              <tr className="border-b">
                <th className="py-2 px-4">Nama Tempat</th>
                <th className="py-2 px-4">Jenis Tempat</th>
                <th className="py-2 px-4">Alamat</th>
                <th className="py-2 px-4">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {paginatedDestinasi.map((item, index) => (
                <tr key={item.id || index} className="border-b">
                  <td className="py-2 px-4">{item.nama}</td>
                  <td className="py-2 px-4">{item.jenis}</td>
                  <td className="py-2 px-4">{item.alamat}</td>
                  <td className="py-2 px-4 text-right">
                    <button
                      className="text-red-600 hover:text-red-800 p-1 transition-all duration-200 hover:scale-110"
                      title="Hapus Destinasi"
                      onClick={() => {
                        setSelectedDeleteId(item.id);
                        setDeleteDialogOpen(true);
                      }}
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex justify-between items-center mt-4">
            <button
              className="text-sm text-[#008275] disabled:opacity-50"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              Previous Page
            </button>
            <p className="text-sm">
              Page {currentPage} of {totalDestinasiPages}
            </p>
            <button
              className="text-sm text-[#008275] disabled:opacity-50"
              onClick={() => setCurrentPage((p) => Math.min(totalDestinasiPages, p + 1))}
              disabled={currentPage === totalDestinasiPages || totalDestinasiPages === 0}
            >
              Next Page
            </button>
          </div>
        </div>
      </section>

      {/* Dialog Konfirmasi Accept */}
      <AlertDialog open={acceptDialogOpen} onOpenChange={setAcceptDialogOpen}>
        <AlertDialogContent className="animate-fade-in animate-duration-300">
          <AlertDialogHeader>
            <AlertDialogTitle>Konfirmasi Validasi Pengajuan</AlertDialogTitle>
            <div className="text-gray-700 text-sm">
              Apakah Anda yakin ingin menerima pengajuan destinasi wisata ini? Data akan divalidasi dan ditambahkan ke daftar destinasi.
            </div>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={acceptLoading}>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => {
                if (selectedAcceptId) {
                  await handleAccept(selectedAcceptId);
                  setAcceptDialogOpen(false);
                  setSelectedAcceptId(null);
                }
              }}
              className="bg-green-600 hover:bg-green-700 text-white"
              disabled={acceptLoading}
            >
              {acceptLoading ? 'Memproses...' : 'Terima'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Dialog Konfirmasi Hapus */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="animate-fade-in animate-duration-300">
          <AlertDialogHeader>
            <AlertDialogTitle>Konfirmasi Hapus Destinasi</AlertDialogTitle>
            <div className="text-gray-700 text-sm">
              Apakah Anda yakin ingin menghapus destinasi ini? Tindakan ini tidak dapat dibatalkan.
            </div>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteLoading}>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => {
                if (selectedDeleteId) {
                  setDeleteLoading(true);
                  await handleDeleteDestinasi(selectedDeleteId);
                  setDeleteLoading(false);
                }
              }}
              className="bg-red-600 hover:bg-red-700 text-white"
              disabled={deleteLoading}
            >
              {deleteLoading ? 'Menghapus...' : 'Hapus'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}