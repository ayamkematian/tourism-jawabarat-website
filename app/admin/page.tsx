"use client";
import Image from "next/image"
import { useState } from "react";

export default function AdminDashboard() {
  const [currentPage, setCurrentPage] = useState(1);

  return (
    <div className="min-h-screen bg-[#f9f9f9] text-[#2d2d2d]">
      {/* Header */}
      <header className="w-full bg-white py-4 px-6 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-2">
            <Image src="/tic.png" alt="Tourism Logo" width={70} height={70} />
            <span className="text-[#008275] font-medium">| Tourism Information Center</span>
        </div>
        <div className="flex items-center gap-4">
          <button className="relative">
            <span className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center">
              🔔
            </span>
          </button>
          <button className="flex items-center gap-2">
            <Image src="/user.png" alt="Admin Image" width={40} height={40} />
            <span>Ilham Khodar Trijaya</span>
          </button>
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
                <th className="py-2 px-4">Jenis Tempat</th>
                <th className="py-2 px-4">Nama Tempat</th>
                <th className="py-2 px-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {[
                { kode: "0001a", nama: "Budi Sudarsono", jenis: "Hotel", tempat: "Hotel Parahyangan", status: "Baru" },
                { kode: "0002a", nama: "Dudit Marko", jenis: "Wisata", tempat: "Hotel Parahyangan", status: "Proses" },
                { kode: "0003a", nama: "William Sudi", jenis: "Hotel", tempat: "Hotel Parahyangan", status: "Proses" },
                { kode: "0004a", nama: "Alexander Margi", jenis: "Wisata", tempat: "Hotel Parahyangan", status: "Disetujui" },
                { kode: "0005a", nama: "Asep Supratman", jenis: "Wisata", tempat: "Hotel Parahyangan", status: "Disetujui" },
              ].map((item, index) => (
                <tr key={index} className="border-b">
                  <td className="py-2 px-4">{item.kode}</td>
                  <td className="py-2 px-4">{item.nama}</td>
                  <td className="py-2 px-4">{item.jenis}</td>
                  <td className="py-2 px-4">{item.tempat}</td>
                  <td className="py-2 px-4">{item.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex justify-between items-center mt-4">
            <button className="text-sm text-[#008275]">Next Page →</button>
            <p className="text-sm">
              Page {currentPage} of 100
            </p>
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
              </tr>
            </thead>
            <tbody>
              {[
                { nama: "Curug Malela", jenis: "Wisata", alamat: "Jl. Jalan Terus, Kec. DayeuhKolot, Kab. Bandung" },
                { nama: "Arum Jeram Supri", jenis: "Wisata", alamat: "Jl. Jalan Terus, Kec. DayeuhKolot, Kab. Bandung" },
                { nama: "Gantole Lele", jenis: "Wisata", alamat: "Jl. Jalan Terus, Kec. DayeuhKolot, Kab. Bandung" },
                { nama: "Curug 9 Tangga", jenis: "Wisata", alamat: "Jl. Jalan Terus, Kec. DayeuhKolot, Kab. Bandung" },
                { nama: "Hotel Parahyangan", jenis: "Hotel", alamat: "Jl. Jalan Terus, Kec. DayeuhKolot, Kab. Bandung" },
              ].map((item, index) => (
                <tr key={index} className="border-b">
                  <td className="py-2 px-4">{item.nama}</td>
                  <td className="py-2 px-4">{item.jenis}</td>
                  <td className="py-2 px-4">{item.alamat}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex justify-between items-center mt-4">
            <button className="text-sm text-[#008275]">Next Page →</button>
            <p className="text-sm">
              Page {currentPage} of 100
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}