"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabaseClient"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import bcrypt from "bcryptjs"

export default function AdminBaruPage() {
  const [email, setEmail] = useState("")
  const [nama, setNama] = useState("")
  const [nip, setNip] = useState<string>("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    try {
      // 1. Register user di Supabase Auth
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: { namalengkap: nama, nip, role: "admin" }
        }
      })
      if (signUpError) throw signUpError

      // 2. Hash password sebelum insert ke tabel users
      const hashedPassword = await bcrypt.hash(password, 10)

      // 3. Insert ke tabel users hanya jika signUp berhasil
      const { error: insertError } = await supabase.from("users").insert({
        email,
        namalengkap: nama,
        password: hashedPassword,
        nip: nip === "" ? null : parseInt(nip, 10),
        role: "admin"
      })
      if (insertError) throw insertError

      alert("Admin baru berhasil didaftarkan!")
      router.push("/admin/dashboard")
    } catch (err: any) {
      setError(err.message || "Gagal mendaftarkan admin baru")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-lg mx-auto mt-10">
      <Card>
        <CardHeader>
          <CardTitle>Daftarkan Admin Baru</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="nama">Nama Lengkap</Label>
              <Input id="nama" value={nama} onChange={e => setNama(e.target.value)} required />
            </div>
            <div>
              <Label htmlFor="nip">Nomor Induk Pegawai </Label>
              <Input id="nip" type="text" inputMode= "numeric" 
                     pattern="[0-9]*" value={nip} onChange={e => {
                      const val = e.target.value.replace(/[^0-9]/g, "");
                      setNip(val);
                     }} required />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
            </div>
            {error && <div className="text-red-600 text-sm">{error}</div>}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Mendaftarkan..." : "Daftarkan Admin"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}