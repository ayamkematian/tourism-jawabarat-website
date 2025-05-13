const express = require("express");
const mysql = require("mysql");
const bcrypt = require("bcrypt");
const bodyParser = require("body-parser");

const app = express();
const port = 3001;

// Middleware
app.use(bodyParser.json());

// Konfigurasi koneksi MySQL
const db = mysql.createConnection({
  host: "localhost",
  user: "root", // Ganti dengan username MySQL Anda
  password: "", // Ganti dengan password MySQL Anda
  database: "tic-jawabarat", // Ganti dengan nama database Anda
});

const cors = require("cors");
app.use(cors());

// Koneksi ke database
db.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL:", err);
    return;
  }
  console.log("Connected to MySQL database.");
});

// Endpoint untuk mendapatkan data destinasi berdasarkan nama
app.get("/api/destinasi/:nama", (req, res) => {
  const { nama } = req.params;

  const query = "SELECT * FROM destinasi WHERE slug = ?";
  db.query(query, [nama], (err, results) => {
    if (err) {
      console.error("Error querying database:", err);
      return res.status(500).json({ message: "Terjadi kesalahan pada server." });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "Destinasi tidak ditemukan." });
    }

    res.status(200).json(results[0]);
  });
});

// Endpoint untuk mendapatkan semua destinasi
app.get("/api/destinasi", (req, res) => {
  const query = "SELECT * FROM destinasi";
  db.query(query, (err, results) => {
    if (err) {
      console.error("Error querying database:", err);
      return res.status(500).json({ message: "Terjadi kesalahan pada server." });
    }

    res.status(200).json(results);
  });
});

// Endpoint untuk login admin
app.post("/api/login", (req, res) => {
  const { email, password } = req.body;

  console.log("Request received:", { email, password }); // Log input dari frontend

  // Validasi input
  if (!email || !password) {
    console.log("Validation failed: Email atau password kosong.");
    return res.status(400).json({ message: "Email dan password wajib diisi." });
  }

  // Query untuk mencari admin berdasarkan email
  const query = "SELECT * FROM admin WHERE email = ?";
  db.query(query, [email], (err, results) => {
    if (err) {
      console.error("Error querying database:", err); // Log error query
      return res.status(500).json({ message: "Terjadi kesalahan pada server." });
    }

    console.log("Query results:", results); // Log hasil query

    if (results.length === 0) {
      console.log("Admin tidak ditemukan.");
      return res.status(404).json({ message: "Admin tidak ditemukan." });
    }

    const admin = results[0];

    // Verifikasi password
    bcrypt.compare(password, admin.password, (err, isMatch) => {
      if (err) {
        console.error("Error comparing passwords:", err); // Log error bcrypt
        return res.status(500).json({ message: "Terjadi kesalahan pada server." });
      }

      if (!isMatch) {
        console.log("Password salah.");
        return res.status(401).json({ message: "Password salah." });
      }

      // Login berhasil
      console.log("Login berhasil:", { id: admin.id, email: admin.email });
      res.status(200).json({ message: "Login berhasil.", admin: { id: admin.id, email: admin.email } });
    });
  });
});

// Jalankan server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});