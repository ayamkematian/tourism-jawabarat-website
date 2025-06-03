"use client"

import { useState } from "react"
import Link from "next/link"
import { Eye, EyeOff } from "lucide-react"

export default function DaftarPengelola() {
  const [showPassword, setShowPassword] = useState(false)
  const [nama, setNama] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [repeatPassword, setRepeatPassword] = useState("")
  const [errorMessage, setErrorMessage] = useState("")
  const [successMessage, setSuccessMessage] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage("")
    setSuccessMessage("")

    if (!nama || !email || !password || !repeatPassword) {
      setErrorMessage("Semua field wajib diisi.")
      return
    }
    if (password !== repeatPassword) {
      setErrorMessage("Password dan Repeat Password tidak sama.")
      return
    }

    try {
      const response = await fetch("http://localhost:3001/api/daftar/pengelola", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nama, email, password }),
      })
      const data = await response.json()
      if (response.ok) {
        setSuccessMessage("Pendaftaran berhasil! Silakan login.")
        setNama("")
        setEmail("")
        setPassword("")
        setRepeatPassword("")
      } else {
        setErrorMessage(data.message || "Pendaftaran gagal.")
      }
    } catch (error) {
      setErrorMessage("Terjadi kesalahan pada server.")
    }
  }

  return (
    <div className="relative min-h-screen bg-[url('/JawaBarat.png?height=1080&width=1920')] bg-cover bg-center flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-md"></div>
      <div className="relative z-10">
        <div className="bg-[#008275]/90 text-white rounded-lg p-8 w-full max-w-md backdrop-blur-sm">
          <h1 className="text-2xl font-semibold text-center mb-6">Daftar sebagai pengelola wisata</h1>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label htmlFor="nama" className="block text-sm">
                Nama Lengkap:
              </label>
              <input
                id="nama"
                type="text"
                value={nama}
                onChange={(e) => setNama(e.target.value)}
                className="w-full p-2 rounded bg-[#b7dfdb]/20 border border-[#b7dfdb]/30 text-white placeholder-white/70"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm">
                Email:
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 rounded bg-[#b7dfdb]/20 border border-[#b7dfdb]/30 text-white placeholder-white/70"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm">
                Password:
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-2 rounded bg-[#b7dfdb]/20 border border-[#b7dfdb]/30 text-white placeholder-white/70"
                  required
                />
                <button
                  type="button"
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-white/80 hover:text-white"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="repeat-password" className="block text-sm">
                Repeat Password:
              </label>
              <div className="relative">
                <input
                  id="repeat-password"
                  type={showPassword ? "text" : "password"}
                  value={repeatPassword}
                  onChange={(e) => setRepeatPassword(e.target.value)}
                  className="w-full p-2 rounded bg-[#b7dfdb]/20 border border-[#b7dfdb]/30 text-white placeholder-white/70"
                  required
                />
                <button
                  type="button"
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-white/80 hover:text-white"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}
            {successMessage && <p className="text-green-400 text-sm">{successMessage}</p>}

            <button
              type="submit"
              className="w-full bg-[#00a38f] hover:bg-[#00b9a2] text-white py-2 rounded transition-colors"
            >
              Daftar
            </button>
          </form>

        </div>
        <p className="mt-4 text-center text-white">
          Sudah punya akun?{' '}
          <Link href="/login/pengelola" className="underline hover:text-gray-300">
            Masuk
          </Link>
        </p>
      </div>
    </div>
  )
}