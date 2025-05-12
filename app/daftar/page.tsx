"use client"

import { useState } from "react"
import Link from "next/link"
import { Eye, EyeOff } from "lucide-react"

export default function Login() {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="relative min-h-screen bg-[url('/JawaBarat.png?height=1080&width=1920')] bg-cover bg-center flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-md"></div>
      <div className="relative z-10">
        <div className="bg-[#008275]/90 text-white rounded-lg p-8 w-full max-w-md backdrop-blur-sm">
          <h1 className="text-2xl font-semibold text-center mb-6">Daftar sebagai pengelola wisata</h1>

          <form className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="nama" className="block text-sm">
                Nama Lengkap:
              </label>
              <input
                id="nama"
                type="text"
                className="w-full p-2 rounded bg-[#b7dfdb]/20 border border-[#b7dfdb]/30 text-white placeholder-white/70"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm">
                Email:
              </label>
              <input
                id="email"
                type="email"
                className="w-full p-2 rounded bg-[#b7dfdb]/20 border border-[#b7dfdb]/30 text-white placeholder-white/70"
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
                  className="w-full p-2 rounded bg-[#b7dfdb]/20 border border-[#b7dfdb]/30 text-white placeholder-white/70"
                />
                <button
                  type="button"
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-white/80 hover:text-white"
                  onClick={() => setShowPassword(!showPassword)}
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
                  className="w-full p-2 rounded bg-[#b7dfdb]/20 border border-[#b7dfdb]/30 text-white placeholder-white/70"
                />
                <button
                  type="button"
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-white/80 hover:text-white"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="flex items-center">
              <input
                id="remember"
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-[#008275] focus:ring-[#008275]"
              />
              <label htmlFor="remember" className="ml-2 block text-sm">
                Remember me
              </label>
            </div>

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
          <Link href="/login" className="underline hover:text-gray-300">
            Masuk
          </Link>
        </p>
      </div>
    </div>
  )
}
