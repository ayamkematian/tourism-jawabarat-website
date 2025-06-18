"use client"
import { useState, useEffect } from "react"
import type React from "react"
import { supabase } from "@/lib/supabaseClient";
import { useRouter, usePathname } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Drawer, DrawerTrigger, DrawerContent } from "@/components/ui/drawer"
import { Menu as MenuIcon } from "lucide-react"

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
import { ChevronDown, LayoutDashboard, FileText, MapPin, PlusCircle, List, Users } from "lucide-react"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [adminName, setAdminName] = useState<string>("")
  const [showMenu, setShowMenu] = useState(false)
  const [openLogout, setOpenLogout] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [notifikasi, setNotifikasi] = useState<any[]>([])
  const [showNotif, setShowNotif] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const fetchAdminData = async () => {
      const email = typeof window !== "undefined" ? localStorage.getItem("adminEmail") : null
      if (email) {
        // Ambil nama admin dari tabel users kolom namalengkap
        const { data: adminData } = await supabase
          .from("users")
          .select("namalengkap")
          .eq("email", email)
          .eq("role", "admin")
          .single()
        if (adminData && adminData.namalengkap) {
          setAdminName(adminData.namalengkap)
        }
      }
    }

    const fetchNotifikasi = async () => {
      const { data } = await supabase
        .from("notifikasii")
        .select("*")
        .eq("role", "admin")
        .order("waktu", { ascending: false })
        .limit(10)
      setNotifikasi(data || [])
    }
    fetchAdminData()
    fetchNotifikasi()
    // Polling notifikasi setiap 30 detik
    const interval = setInterval(fetchNotifikasi, 30000)
    return () => clearInterval(interval)
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
    {
      href: "/admin/destinasi",
      icon: MapPin,
      label: "Daftar Destinasi",
      description: "Kelola destinasi wisata",
    },
    {
      href: "/admin/artikel/create",
      icon: PlusCircle,
      label: "Buat Artikel",
      description: "Tulis artikel berita baru",
    },
    {
      href: "/admin/artikel",
      icon: List,
      label: "List Artikel",
      description: "Kelola artikel yang dipublish",
    },
    {
      href: "/admin/registrasi",
      icon: Users,
      label: "Daftarkan Admin",
      description: "Tambah admin baru",
    },
    ]

  return (
    <div
      className={`min-h-screen bg-[#f9f9f9] transition-opacity duration-500 ${isLoggingOut ? "opacity-0" : "opacity-100"}`}
    >
      <head><link rel="icon" href="/tic.png" /></head>
      {/* Header */}
      <header className="w-full bg-white py-4 px-6 flex items-center justify-between shadow-md sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <Drawer>
            <DrawerTrigger asChild>
              <button className="md:hidden mr-2 p-2 rounded hover:bg-gray-100 focus:outline-none">
                <MenuIcon className="w-7 h-7 text-[#008275]" />
              </button>
            </DrawerTrigger>
            <DrawerContent className="md:hidden left-0 top-0 bottom-0 h-full w-64 rounded-none p-0">
              <button
                className="absolute top-3 right-3 p-2 rounded hover:bg-gray-100 focus:outline-none"
                onClick={() => {
                  // trigger close drawer
                  const evt = new CustomEvent('vaul-close');
                  window.dispatchEvent(evt);
                }}
                aria-label="Tutup Sidebar"
                type="button"
              >
                <span className="text-2xl">×</span>
              </button>
              <nav className="p-4 pt-16">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Menu Admin</h2>
                <ul className="space-y-2">
                  {menuItems.map((item) => {
                    const Icon = item.icon
                    const isActive = pathname === item.href
                    return (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                            isActive ? "bg-[#008275] text-white" : "text-gray-700 hover:bg-gray-100"
                          }`}
                        >
                          <Icon className="w-5 h-5" />
                          <div>
                            <div className="font-medium">{item.label}</div>
                            <div className={`text-xs ${isActive ? "text-gray-200" : "text-gray-500"}`}>
                              {item.description}
                            </div>
                          </div>
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              </nav>
            </DrawerContent>
          </Drawer>
          <Image src="/tic.png" alt="Logo" width={70} height={70} className="mr-2 hidden md:block" />
          <div className="border-l-2 border-teal-600 pl-2 hidden md:block">
            <Link href="/admin/dashboard" className="text-[#008275] font-semibold">Tourism Information Center</Link>
          </div>
        </div>
        <div className="flex items-center gap-4 relative">
          <div className="relative">
            <button
              className="flex items-center gap-flex focus:outline-none"
              onClick={() => setShowMenu((v) => !v)}
              title="Menu Admin"
              type="button"
            >
              <Image src="/user.png" alt="Admin Image" width={40} height={40} />
              <span>{adminName || "Admin"}</span>
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
        {/* Sidebar Desktop */}
        <div className="hidden md:flex">
          <aside className="w-64 bg-white shadow-md min-h-[calc(100vh-88px)] sticky top-[88px]">
            <nav className="p-4">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Menu Admin</h2>
              <ul className="space-y-2">
                {menuItems.map((item) => {
                  const Icon = item.icon
                  const isActive = pathname === item.href
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                          isActive ? "bg-[#008275] text-white" : "text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <div>
                          <div className="font-medium">{item.label}</div>
                          <div className={`text-xs ${isActive ? "text-gray-200" : "text-gray-500"}`}>
                            {item.description}
                          </div>
                        </div>
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </nav>
          </aside>
          <main className="flex-1 p-6">{children}</main>
        </div>
        {/* Main Content Mobile */}
        <div className="block md:hidden">
          <main className="p-4">{children}</main>
        </div>
      </div>

      {/* Logout Dialog */}
      <AlertDialog open={openLogout} onOpenChange={setOpenLogout}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Konfirmasi Log Out</AlertDialogTitle>
            <AlertDialogDescription>
              Log Out dari akun admin? Anda akan keluar dari akun dan harus login kembali untuk mengakses fitur
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
                  localStorage.removeItem("adminEmail")
                  router.push("/login")
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