"use client"

import { useState } from "react"
import Link from "next/link"
import { Eye, EyeOff } from "lucide-react"
import { supabase } from "@/lib/supabaseClient"
import bcrypt from "bcryptjs"

export default function DaftarPengelola() {
  const [showPassword, setShowPassword] = useState(false)
  const [nama, setNama] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [repeatPassword, setRepeatPassword] = useState("")
  const [errorMessage, setErrorMessage] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
  const [nik, setNik] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage("")
    setSuccessMessage("")

    if (!nama || !email || !password || !repeatPassword) {
      setErrorMessage("Semua field wajib diisi.")
      return
    }
    if (nik.length !== 16) {
      setErrorMessage("NIK harus 16 digit.")
      return
    }
    if (password !== repeatPassword) {
      setErrorMessage("Password dan Repeat Password tidak sama.")
      return
    }

    try {
        // Cek apakah NIK sudah terdaftar
        const { data: nikExist } = await supabase
        .from("users")
        .select("nik")
        .eq("nik", nik)
        .single()
      if (nikExist) {
        setErrorMessage("NIK sudah terdaftar.")
        return
      }
      // Cek apakah email sudah terdaftar
      const { data: existing } = await supabase
        .from("users")
        .select("*")
        .eq("email", email)
        .single()
      if (existing) {
        setErrorMessage("Email sudah terdaftar.")
        return
      }
      const hash = await bcrypt.hash(password, 10)
      const { error: insertError } = await supabase
        .from("users")
        .insert([{ email, password: hash, namalengkap: nama, nik, role: "pengelola" }])
      if (insertError) {
        setErrorMessage("Terjadi kesalahan pada server.")
        return
      }
      setSuccessMessage("Pendaftaran berhasil! Silakan login.")
      setNama("")
      setEmail("")
      setNik("")
      setPassword("")
      setRepeatPassword("")
    } catch (error) {
      setErrorMessage("Terjadi kesalahan pada server.")
    }
  }

  return (
    <div className="relative min-h-screen bg-[url('/JawaBarat.png?height=1080&width=1920')] bg-cover bg-center flex items-center justify-center p-4">
      <head><link rel="icon" href="/tic.png" /></head>
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
            <label htmlFor="nik" className="block text-sm">
              NIK:
            </label>
            <input
              id="nik"
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={16}
              value={nik}
              onChange={e => {
                // Hanya angka, maksimal 16 digit
                const val = e.target.value.replace(/[^0-9]/g, "").slice(0, 16);
                setNik(val);
              }}
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
        <div className="mt-4">
          <Link
            href="/"
            className="block text-center bg-[#00a38f] hover:bg-[#00b9a2] text-white py-2 rounded transition-colors"
          >
            Kembali ke Menu Utama
          </Link>
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