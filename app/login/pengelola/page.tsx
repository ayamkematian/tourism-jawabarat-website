"use client"

import { useState } from "react"
import Link from "next/link"
import { Eye, EyeOff } from "lucide-react"
import { useRouter } from "next/navigation";


export default function Login() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:3001/api/login/pengelola", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Login berhasil!");
        console.log("Pengelola data:", data.pengelola);
        // Redirect ke halaman dashboard pengelola, ganti sesuai kebutuhan
        router.push("/pengelola");
      } else {
        setErrorMessage(data.message || "Login gagal.");
      }
    } catch (error) {
      console.error("Error during login:", error);
      setErrorMessage("Terjadi kesalahan pada server.");
    }
  }

  return (
    <div className="relative min-h-screen bg-[url('/JawaBarat.png?height=1080&width=1920')] bg-cover bg-center flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-md"></div>
      <div className="relative z-10">
        <div className="bg-[#008275]/90 text-white rounded-lg p-8 w-full max-w-md backdrop-blur-sm">
          <h1 className="text-2xl font-semibold text-center mb-6">Masuk sebagai pengelola wisata</h1>

          <form className="space-y-4" onSubmit={handleLogin}>
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
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}

            <button
              type="submit"
              className="w-full bg-[#00a38f] hover:bg-[#00b9a2] text-white py-2 rounded transition-colors"
            >
              Masuk
            </button>
          </form>


          <div className="mt-6">
            <Link
              href="/daftar"
              className="block text-center py-2 border border-[#b7dfdb]/30 rounded hover:bg-[#b7dfdb]/10 transition-colors text-sm"
            >
              Belum punya akun?{" "}
              <span className="text-green-600 underline hover:text-green-700">
              Mendaftar
              </span>
            </Link>
          </div>

        </div>
      </div>
    </div>
  )
}
