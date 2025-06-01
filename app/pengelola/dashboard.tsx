"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Home, Upload, ArrowRight } from "lucide-react"
import Link from "next/link"

export default function Component() {
  const [currentView, setCurrentView] = useState<"empty" | "withDestination" | "registration">("empty")

  const Header = () => (
    <header className="bg-[#ffffff] border-b border-[#eaeaea] px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#008275] rounded-lg flex items-center justify-center">
            <div className="w-6 h-6 bg-[#4ca69d] rounded"></div>
          </div>
          <span className="text-[#008275] font-medium">Tourism Information Center</span>
        </div>
        <div className="flex items-center gap-3">
          <Avatar className="w-8 h-8">
            <AvatarFallback className="bg-[#eaeaea] text-[#575757] text-sm">👤</AvatarFallback>
          </Avatar>
          <span className="bg-[#008275] text-[#ffffff] px-3 py-1 rounded text-sm">Haldi Alfiansyach</span>
        </div>
      </div>
    </header>
  )

  const Sidebar = () => (
    <aside className="w-full md:w-48 bg-[#ffffff] border-r border-[#eaeaea] min-h-screen">
      <div className="p-4">
        <div className="flex items-center gap-3 text-[#1e1e1e] font-medium">
          <Home className="w-5 h-5" />
          Dashboard
        </div>
      </div>
      <div className="absolute bottom-4 left-4">
        <Link href="/login/pengelola" className="flex items-center gap-2 text-[#888888] text-sm">
          Keluar <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </aside>
  )

  const EmptyDashboard = () => (
    <main className="flex-1 bg-[#eaeaea] p-4 md:p-6">
      <div className="bg-[#ffffff] rounded-lg p-4 md:p-6 h-full">
        <h1 className="text-xl md:text-2xl font-bold text-[#1e1e1e] mb-2">Dashboard</h1>
        <p className="text-[#888888] mb-4 md:mb-8">Selamat Datang di Dashboard Pengelola Wisata</p>

        <div className="max-w-md">
          <Input
            placeholder="Belum ada destinasi aktif"
            className="mb-4 bg-[#fafafa] border-[#b4b4b4] text-[#a4a4a4]"
          />
          <Button
            className="bg-[#4ca69d] hover:bg-[#008275] text-[#ffffff]"
            onClick={() => setCurrentView("registration")}
          >
            Daftar Destinasi
          </Button>
        </div>
      </div>
    </main>
  )

  const DashboardWithDestination = () => (
    <main className="flex-1 bg-[#eaeaea] p-4 md:p-6">
      <div className="bg-[#ffffff] rounded-lg p-4 md:p-6 h-full">
        <h1 className="text-xl md:text-2xl font-bold text-[#1e1e1e] mb-2">Dashboard</h1>
        <p className="text-[#888888] mb-4 md:mb-8">Selamat Datang di Dashboard Pengelola Wisata</p>

        <Card className="max-w-md mb-4 border-[#eaeaea]">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg text-[#1e1e1e]">Waterboom Bogor</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-[#888888] text-sm">Dalam proses pengecekan...</p>
          </CardContent>
        </Card>

        <Button
          className="bg-[#4ca69d] hover:bg-[#008275] text-[#ffffff]"
          onClick={() => setCurrentView("registration")}
        >
          Daftar Destinasi
        </Button>
      </div>
    </main>
  )

  const RegistrationForm = () => (
    <main className="flex-1 bg-[#eaeaea] p-4 md:p-6">
      <div className="bg-[#ffffff] rounded-lg p-4 md:p-6 h-full overflow-y-auto">
        <h1 className="text-xl md:text-2xl font-bold text-[#1e1e1e] mb-2">Pendaftaran Destinasi</h1>
        <p className="text-[#888888] mb-4 md:mb-8">Isi data di bawah dengan lengkap</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 max-w-4xl">
          <div className="space-y-4">
            <div>
              <label className="block text-[#575757] text-sm mb-2">Nama Tempat</label>
              <Input className="border-[#b4b4b4]" />
            </div>

            <div>
              <label className="block text-[#575757] text-sm mb-2">Nomor Induk Berusaha</label>
              <Input className="border-[#b4b4b4]" />
            </div>

            <div>
              <label className="block text-[#575757] text-sm mb-2">NPWP</label>
              <Input className="border-[#b4b4b4]" />
            </div>

            <div>
              <label className="block text-[#575757] text-sm mb-2">Kartu Tanda Penduduk</label>
              <Button variant="outline" className="w-full justify-start border-[#4ca69d] text-[#4ca69d]">
                <Upload className="w-4 h-4 mr-2" />
                Tambahkan file
              </Button>
            </div>

            <div>
              <label className="block text-[#575757] text-sm mb-2">Akta Pendirian Usaha</label>
              <Button variant="outline" className="w-full justify-start border-[#4ca69d] text-[#4ca69d]">
                <Upload className="w-4 h-4 mr-2" />
                Tambahkan file
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-[#575757] text-sm mb-2">Sertifikat Tanah</label>
              <Button variant="outline" className="w-full justify-start border-[#4ca69d] text-[#4ca69d]">
                <Upload className="w-4 h-4 mr-2" />
                Tambahkan file
              </Button>
            </div>

            <div>
              <label className="block text-[#575757] text-sm mb-2">Surat Izin Lurah dan Camat</label>
              <Button variant="outline" className="w-full justify-start border-[#4ca69d] text-[#4ca69d]">
                <Upload className="w-4 h-4 mr-2" />
                Tambahkan file
              </Button>
            </div>

            <div>
              <label className="block text-[#575757] text-sm mb-2">Laporan Keuangan</label>
              <Button variant="outline" className="w-full justify-start border-[#4ca69d] text-[#4ca69d]">
                <Upload className="w-4 h-4 mr-2" />
                Tambahkan file
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <Button className="bg-[#4ca69d] hover:bg-[#008275] text-[#ffffff] px-8">Kirim</Button>
        </div>
      </div>
    </main>
  )

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <Header />
      <div className="flex">
        <Sidebar />
        {currentView === "empty" && <EmptyDashboard />}
        {currentView === "withDestination" && <DashboardWithDestination />}
        {currentView === "registration" && <RegistrationForm />}
      </div>

    </div>
  )
}
