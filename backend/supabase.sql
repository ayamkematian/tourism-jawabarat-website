create table users (
  id serial primary key,
  email varchar(255) unique not null,
  password varchar(255) not null,
  namalengkap varchar(255) not null,
  role varchar(255) not null
);

create table destinasi (
  id serial primary key,
  nama varchar(255) not null,
  slug varchar(255) unique not null,
  gambar varchar(255),
  deskripsi text,
  lokasi varchar(255),
  kategori varchar(100),
  alamat text,
  hargatiket varchar(100),
  jambuka varchar(100),
  created_at date
);


create table daftar_destinasi (
  id serial primary key,
  nama varchar(255) not null,
  slug varchar(255) unique not null,
  gambar varchar(255),
  deskripsi text,
  lokasi varchar(255),
  kategori varchar(100),
  alamat text,
  hargatiket varchar(100),
  jambuka varchar(100),
  nibu varchar(100),
  npwp varchar(100),
  ktp varchar(100),
  akta varchar(100),
  sertifikat varchar(100),
  izin varchar(100),
  laporan varchar(100),
  pengelola_id integer references loginpengelola(id),
  created_at timestamp default now()
);

create table artikel (
  id serial primary key,
  judul varchar(255) not null,
  slug varchar(255) unique not null,
  konten text not null,
  excerpt text,
  gambar varchar(255),
  kategori varchar(100),
  status varchar(20) default 'draft',
  author_id integer references admin(id),
  author_name varchar(255),
  created_at timestamp default now(),
  updated_at timestamp default now()
);