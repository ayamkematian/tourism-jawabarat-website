-- Create artikel table for news articles
CREATE TABLE IF NOT EXISTS artikel (
  id SERIAL PRIMARY KEY,
  judul VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  konten TEXT NOT NULL,
  excerpt TEXT,
  gambar VARCHAR(500),
  kategori VARCHAR(100),
  status VARCHAR(20) DEFAULT 'draft',
  author_id INTEGER,
  author_name VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_artikel_status ON artikel(status);
CREATE INDEX IF NOT EXISTS idx_artikel_kategori ON artikel(kategori);
CREATE INDEX IF NOT EXISTS idx_artikel_created_at ON artikel(created_at);

-- Insert sample data
INSERT INTO artikel (judul, slug, konten, excerpt, kategori, status, author_name) VALUES
('Destinasi Wisata Terbaru di Bandung Barat', 'destinasi-wisata-terbaru-bandung-barat', 
 'Kabupaten Bandung Barat memiliki banyak destinasi wisata menarik yang baru dibuka untuk umum. Dari wisata alam hingga wisata budaya, semuanya tersedia di sini.',
 'Jelajahi destinasi wisata terbaru yang menawan di Kabupaten Bandung Barat',
 'wisata', 'published', 'Admin Tourism'),
 
('Festival Budaya Sunda 2024', 'festival-budaya-sunda-2024',
 'Festival Budaya Sunda tahun 2024 akan diselenggarakan dengan berbagai pertunjukan seni tradisional dan pameran kebudayaan yang menarik.',
 'Saksikan kemeriahan Festival Budaya Sunda dengan berbagai pertunjukan tradisional',
 'budaya', 'published', 'Admin Tourism'),
 
('Kuliner Khas yang Wajib Dicoba', 'kuliner-khas-wajib-dicoba',
 'Berbagai kuliner khas daerah yang memiliki cita rasa unik dan menggugah selera. Dari makanan tradisional hingga fusion modern.',
 'Nikmati kelezatan kuliner khas dengan cita rasa yang tak terlupakan',
 'kuliner', 'draft', 'Admin Tourism');
