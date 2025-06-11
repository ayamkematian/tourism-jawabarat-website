"use client"
import { useState, useEffect } from "react"
import type React from "react"
import { supabase } from "@/lib/supabaseClient";
import { useRouter, usePathname } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog"
import { ChevronDown, LayoutDashboard, FileText, MapPin, PlusCircle, List } from "lucide-react"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [adminName, setAdminName] = useState<string>("")
  const [showMenu, setShowMenu] = useState(false)
  const [openLogout, setOpenLogout] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const router = useRouter()
  const pathname = usePathname()
  const [namaPengelola, setNamaPengelola] = useState<string>("")
  const [isFetching, setIsFetching] = useState(false)

  useEffect(() => {
    setIsFetching(true)
    const email = typeof window !== "undefined" ? localStorage.getItem("pengelolaEmail") : null
    if (!email) {
      setIsFetching(false)
      return
    }
    const fetchNama = async () => {
      const { data, error } = await supabase.from("loginpengelola").select("namalengkap, id").eq("email", email).single()
      if (data && data.namalengkap) setNamaPengelola(data.namalengkap)
      setIsFetching(false)
    }
    fetchNama()
  }, [])

  const menuItems = [
    {
      href: "/admin/dashboard",
      icon: LayoutDashboard,
      label: "Dashboard",
      description: "Overview dan statistik",
    },
    {
      href: "/admin/pengajuan",
      icon: FileText,
      label: "List Pengajuan",
      description: "Kelola pengajuan destinasi",
    },
  ]

  return (
    <div
      className={`min-h-screen bg-[#f9f9f9] transition-opacity duration-500 ${isLoggingOut ? "opacity-0" : "opacity-100"}`}
    >
      {/* Header */}
      <header className="w-full bg-white py-4 px-6 flex items-center justify-between shadow-md sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <Image src="/tic.png" alt="Tourism Logo" width={70} height={70} />
          <span className="text-[#008275] font-medium">| Tourism Information Center</span>
        </div>
        <div className="flex items-center gap-4 relative">
          <button className="relative">
            <span className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center">🔔</span>
          </button>
          <div className="relative">
            <button
              className="flex items-center gap-2 focus:outline-none"
              onClick={() => setShowMenu((v) => !v)}
              title="Menu Pengelola"
              type="button"
            >
              <Image src="/user.png" alt="Pengelola Image" width={40} height={40} />
              <span>{namaPengelola || "Pengelola"}</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${showMenu ? "rotate-180" : ""}`} />
            </button>
            {showMenu && (
              <div className="absolute right-0 mt-2 w-36 bg-white border rounded shadow-lg z-20">
                <button
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 text-[#d32f2f] font-medium"
                  onClick={() => {
                    setShowMenu(false)
                    setOpenLogout(true)
                  }}
                >
                  Log Out
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-md min-h-[calc(100vh-88px)] sticky top-[88px]">
          <nav className="p-4">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Menu Pengelola</h2>
            <ul className="space-y-2">
              <li>
                <Link href="/pengelola/dashboard" className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${pathname === "/pengelola/dashboard" ? "bg-[#008275] text-white" : "text-gray-700 hover:bg-gray-100"}`}>
                  <LayoutDashboard className="w-5 h-5" />
                  <div>
                    <div className="font-medium">Dashboard</div>
                    <div className={`text-xs ${pathname === "/pengelola/dashboard" ? "text-gray-200" : "text-gray-500"}`}>List & kelola destinasi Anda</div>
                  </div>
                </Link>
              </li>
            </ul>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">{children}</main>
      </div>

      {/* Logout Dialog */}
      <AlertDialog open={openLogout} onOpenChange={setOpenLogout}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Konfirmasi Log Out</AlertDialogTitle>
            <AlertDialogDescription>
              Log Out dari akun admin? Anda akan keluar dari dashboard dan harus login kembali untuk mengakses fitur
              admin.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                setOpenLogout(false)
                setIsLoggingOut(true)
                setTimeout(() => {
                  localStorage.removeItem("pengelolaEmail")
                  router.push("/login/pengelola")
                }, 600)
              }}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Log Out
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}