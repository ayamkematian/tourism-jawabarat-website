const express = require("express");
const bcrypt = require("bcrypt");
const bodyParser = require("body-parser");
const supabase = require("./supabase-client");

const app = express();
const port = 3001;

// Middleware
app.use(bodyParser.json());

const cors = require("cors");
app.use(cors());

// Endpoint untuk mendapatkan data destinasi berdasarkan nama
app.get("/api/destinasi/:nama", async (req, res) => {
  const { nama } = req.params;
  const { data, error } = await supabase
    .from("destinasi")
    .select("*")
    .eq("slug", nama)
    .single();
  if (error || !data) {
    return res.status(404).json({ message: "Destinasi tidak ditemukan." });
  }
  res.status(200).json(data);
});

// Endpoint untuk mendapatkan semua destinasi
app.get("/api/destinasi", async (req, res) => {
  const { data, error } = await supabase.from("destinasi").select("*");
  if (error) {
    return res.status(500).json({ message: "Terjadi kesalahan pada server." });
  }
  res.status(200).json(data);
});

// Endpoint untuk login admin
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Email dan password wajib diisi." });
  }
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("email", email)
    .single();
  if (error || !data) {
    return res.status(404).json({ message: "Admin tidak ditemukan." });
  }
  if (data.role !== "admin") {
    setErrorMessage("Akun ini bukan Akun Admin.");
    return;
  }
  const admin = data;
  const isMatch = await bcrypt.compare(password, admin.password);
  if (!isMatch) {
    return res.status(401).json({ message: "Password salah." });
  }
  res.status(200).json({ message: "Login berhasil.", admin: { id: admin.id, email: admin.email } });
});

// Endpoint untuk login pengelola
app.post("/api/login/pengelola", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Email dan password wajib diisi." });
  }
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("email", email)
    .single();
  if (error || !data) {
    return res.status(404).json({ message: "Pengelola tidak ditemukan." });
  }
  if (data.role !== "pengelola") {
    setErrorMessage("Akun ini bukan Akun Pengelola.");
    return;
  }
  const pengelola = data;
  const isMatch = await bcrypt.compare(password, pengelola.password);
  if (!isMatch) {
    return res.status(401).json({ message: "Password salah." });
  }
  res.status(200).json({ message: "Login berhasil.", pengelola: { id: pengelola.id, email: pengelola.email } });
});

// Endpoint untuk daftar pengelola
app.post("/api/daftar/pengelola", async (req, res) => {
  const { nama, email, password } = req.body;
  if (!nama || !email || !password) {
    return res.status(400).json({ message: "Nama Lengkap, email, dan password wajib diisi." });
  }
  // Cek apakah email sudah terdaftar
  const { data: existing, error: cekError } = await supabase
    .from("users")
    .select("*")
    .eq("email", email)
    .single();
  if (existing) {
    return res.status(409).json({ message: "Email sudah terdaftar." });
  }
  const hash = await bcrypt.hash(password, 10);
  const { error: insertError } = await supabase
    .from("loginpengelola")
    .insert([{ email, password: hash, namalengkap: nama, nama, role: "pengelola"}]);
  if (insertError) {
    return res.status(500).json({ message: "Terjadi kesalahan pada server." });
  }
  res.status(201).json({ message: "Pendaftaran berhasil." });
});

// Jalankan server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});