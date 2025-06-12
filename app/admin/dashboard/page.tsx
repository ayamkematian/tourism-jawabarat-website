"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import { supabase } from "@/lib/supabaseClient"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, MapPin, FileText, Newspaper } from "lucide-react"

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalPengajuan: 0,
    totalDestinasi: 0,
    totalArtikel: 0,
    pengajuanPending: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true)

      // Fetch pengajuan stats
      const { data: pengajuanData } = await supabase.from("daftar_destinasi").select("*")

      // Fetch destinasi stats
      const { data: destinasiData } = await supabase.from("destinasi").select("*")

      // Fetch artikel stats (assuming you have an artikel table)
      const { data: artikelData } = await supabase.from("artikel").select("*")

      const pendingPengajuan = pengajuanData?.filter((item) => item.status !== "Disetujui").length || 0

      setStats({
        totalPengajuan: pengajuanData?.length || 0,
        totalDestinasi: destinasiData?.length || 0,
        totalArtikel: artikelData?.length || 0,
        pengajuanPending: pendingPengajuan,
      })

      setLoading(false)
    }

    fetchStats()
  }, [])

  const statCards = [
    {
      title: "Total Pengajuan",
      value: stats.totalPengajuan,
      icon: FileText,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Pengajuan Pending",
      value: stats.pengajuanPending,
      icon: Users,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
    {
      title: "Total Destinasi",
      value: stats.totalDestinasi,
      icon: MapPin,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Total Artikel",
      value: stats.totalArtikel,
      icon: Newspaper,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
  ]

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
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Admin</h1>
        <p className="text-gray-600">Selamat datang di panel admin Tourism Information Center</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon
          return (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-full ${stat.bgColor}`}>
                    <Icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Aksi Cepat</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              href="/admin/pengajuan"
              className="p-4 text-left border rounded-lg hover:bg-gray-50 transition-colors block"
            >
              <h3 className="font-medium text-gray-900">Kelola Pengajuan</h3>
              <p className="text-sm text-gray-600">Review dan approve pengajuan destinasi</p>
            </Link>
            <Link
              href="/admin/artikel/create"
              className="p-4 text-left border rounded-lg hover:bg-gray-50 transition-colors block"
            >
              <h3 className="font-medium text-gray-900">Buat Artikel</h3>
              <p className="text-sm text-gray-600">Tulis artikel berita terbaru</p>
            </Link>
            <Link
              href="/admin/destinasi"
              className="p-4 text-left border rounded-lg hover:bg-gray-50 transition-colors block"
            >
              <h3 className="font-medium text-gray-900">Kelola Destinasi</h3>
              <p className="text-sm text-gray-600">Edit dan hapus destinasi wisata</p>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
