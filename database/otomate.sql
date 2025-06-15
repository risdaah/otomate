-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Waktu pembuatan: 15 Jun 2025 pada 02.57
-- Versi server: 8.4.3
-- Versi PHP: 8.3.16

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `otomate`
--

-- --------------------------------------------------------

--
-- Struktur dari tabel `detail_bengkel`
--

CREATE TABLE `detail_bengkel` (
  `id_detail_bengkel` int NOT NULL,
  `id_user` int NOT NULL,
  `nama` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `alamat` text COLLATE utf8mb4_general_ci,
  `telp` varchar(20) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `detail_bengkel`
--

INSERT INTO `detail_bengkel` (`id_detail_bengkel`, `id_user`, `nama`, `alamat`, `telp`, `created_at`) VALUES
(1, 1, 'Admin 1 Bengkel Nugraha Jaya', 'Jl. Raden Wijaya Jl. Anusanata II No.30, Dusun Pager, Sawotratap, Kec. Gedangan, Kabupaten Sidoarjo, Jawa Timur 61254', '0811378263', '2025-06-07 13:20:13');

-- --------------------------------------------------------

--
-- Struktur dari tabel `detail_pesanan`
--

CREATE TABLE `detail_pesanan` (
  `id_detail_pesanan` int NOT NULL,
  `id_pesanan` int NOT NULL,
  `id_produk` int NOT NULL,
  `jumlah` int NOT NULL,
  `harga` decimal(12,2) NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `detail_pesanan`
--

INSERT INTO `detail_pesanan` (`id_detail_pesanan`, `id_pesanan`, `id_produk`, `jumlah`, `harga`, `created_at`) VALUES
(1, 1, 2, 1, 44000.00, '2025-06-08 07:53:12'),
(2, 1, 1, 1, 160000.00, '2025-06-08 07:53:12'),
(13, 13, 1, 1, 160000.00, '2025-06-14 00:47:57'),
(14, 14, 1, 3, 160000.00, '2025-06-14 00:59:47'),
(15, 15, 2, 2, 44000.00, '2025-06-14 01:00:12');

-- --------------------------------------------------------

--
-- Struktur dari tabel `invoice`
--

CREATE TABLE `invoice` (
  `id_invoice` int NOT NULL,
  `id_pesanan` int NOT NULL,
  `status` enum('unpaid','paid') COLLATE utf8mb4_general_ci DEFAULT 'unpaid',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `invoice`
--

INSERT INTO `invoice` (`id_invoice`, `id_pesanan`, `status`, `created_at`) VALUES
(1, 1, 'paid', '2025-06-08 07:53:13'),
(3, 13, 'unpaid', '2025-06-14 00:47:57'),
(4, 14, 'unpaid', '2025-06-14 00:59:47'),
(5, 15, 'unpaid', '2025-06-14 01:00:12');

-- --------------------------------------------------------

--
-- Struktur dari tabel `jenis_stok`
--

CREATE TABLE `jenis_stok` (
  `id_jenis_stok` int NOT NULL,
  `jenis` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data untuk tabel `jenis_stok`
--

INSERT INTO `jenis_stok` (`id_jenis_stok`, `jenis`) VALUES
(1, 'STOK BENGKEL'),
(2, 'NON STOK');

-- --------------------------------------------------------

--
-- Struktur dari tabel `kategori`
--

CREATE TABLE `kategori` (
  `id_kategori` int NOT NULL,
  `nama_kategori` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `kategori`
--

INSERT INTO `kategori` (`id_kategori`, `nama_kategori`, `created_at`) VALUES
(1, 'Fuel System', '2025-06-04 19:22:41'),
(2, 'Cooling System', '2025-06-04 19:22:41'),
(4, 'Brake System', '2025-06-11 11:56:22'),
(12, 'Filter dan Fluida', '2025-06-14 14:58:31');

-- --------------------------------------------------------

--
-- Struktur dari tabel `mobil`
--

CREATE TABLE `mobil` (
  `id_mobil` int NOT NULL,
  `nama_mobil` varchar(30) NOT NULL,
  `merk` varchar(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data untuk tabel `mobil`
--

INSERT INTO `mobil` (`id_mobil`, `nama_mobil`, `merk`) VALUES
(1, 'dua', 'MAZDA'),
(2, 'tigaratusenam', 'PEUGEOT'),
(3, 'tigaratusduapuluhtiga', 'MAZDA'),
(4, 'APV', 'SUZUKI'),
(5, 'ATOZ', 'HYUNDAI'),
(6, 'Accord', 'HONDA'),
(7, 'Aerio', 'SUZUKI'),
(8, 'Agya', 'TOYOTA'),
(9, 'Almaz', 'WULING'),
(10, 'Alphard', 'TOYOTA'),
(11, 'Altis', 'TOYOTA'),
(12, 'Avanza', 'TOYOTA'),
(13, 'Avega', 'HYUNDAI'),
(14, 'Aveo', 'CHEVROLET'),
(15, 'Ayla', 'DAIHATSU'),
(16, 'BIG UP BOX', 'KIA'),
(17, 'BRV', 'HONDA'),
(18, 'Baleno', 'SUZUKI'),
(19, 'Biante', 'MAZDA'),
(20, 'Brio', 'HONDA'),
(21, 'Bt50', 'MAZDA'),
(22, 'CANTER', 'MITSUBISHI'),
(23, 'CRV', 'HONDA'),
(24, 'CX-5', 'MAZDA'),
(25, 'Calya', 'TOYOTA'),
(26, 'Camry', 'TOYOTA'),
(27, 'Captiva', 'CHEVROLET'),
(28, 'Carens', 'KIA'),
(29, 'Carnival', 'KIA'),
(30, 'Carry', 'SUZUKI'),
(31, 'Cayla', 'TOYOTA'),
(32, 'City', 'HONDA'),
(33, 'Civic', 'HONDA'),
(34, 'Colt', 'MITSUBISHI'),
(35, 'Confero', 'WULING'),
(36, 'Corolla', 'TOYOTA'),
(37, 'Cortez', 'WULING'),
(38, 'Crown', 'TOYOTA'),
(39, 'D-Max', 'ISUZU'),
(40, 'DUTRO', 'HINO'),
(41, 'Dyna', 'TOYOTA'),
(42, 'Ecosport', 'FORD'),
(43, 'Elf', 'ISUZU'),
(44, 'Elyson', 'HONDA'),
(45, 'Ertiga', 'SUZUKI'),
(46, 'Escape', 'FORD'),
(47, 'Escudo', 'SUZUKI'),
(48, 'Espass', 'DAIHATSU'),
(49, 'Estilo', 'HONDA'),
(50, 'Etios', 'TOYOTA'),
(51, 'Evalia', 'NISSAN'),
(52, 'Everest', 'FORD'),
(53, 'Every', 'SUZUKI'),
(54, 'Excel', 'HYUNDAI'),
(55, 'Exora', 'PROTON'),
(56, 'Expander', 'MITSUBISHI'),
(57, 'Feroza', 'DAIHATSU'),
(58, 'Fiesta', 'FORD'),
(59, 'Focus', 'FORD'),
(60, 'Forester', 'SUBARU'),
(61, 'Fortuner', 'TOYOTA'),
(62, 'Freed', 'HONDA'),
(63, 'Frontier', 'NISSAN'),
(64, 'Futura', 'SUZUKI'),
(65, 'Galant', 'MITSUBISHI'),
(66, 'Genio', 'HONDA'),
(67, 'Go Panca', 'DATSUN'),
(68, 'Grandmax', 'DAIHATSU'),
(69, 'H1', 'HYUNDAI'),
(70, 'HRV', 'HONDA'),
(71, 'Harier', 'TOYOTA'),
(72, 'Hiace', 'TOYOTA'),
(73, 'Hiline', 'DAIHATSU'),
(74, 'Hilux', 'TOYOTA'),
(75, 'Honda', 'HONDA'),
(76, 'I10', 'HYUNDAI'),
(77, 'I20', 'HYUNDAI'),
(78, 'INNOVA REBON', 'TOYOTA'),
(79, 'ISUZU NKR', 'ISUZU'),
(80, 'Ignis', 'SUZUKI'),
(81, 'Infinity', 'NISSAN'),
(82, 'Innova', 'TOYOTA'),
(83, 'Jazz', 'HONDA'),
(84, 'Jimny', 'SUZUKI'),
(85, 'Juke', 'NISSAN'),
(86, 'Karimun', 'SUZUKI'),
(87, 'Katana', 'SUZUKI'),
(88, 'Kijang', 'TOYOTA'),
(89, 'Kuda', 'MITSUBISHI'),
(90, 'L200', 'MITSUBISHI'),
(91, 'L300', 'MITSUBISHI'),
(92, 'Lancer', 'MITSUBISHI'),
(93, 'Limo', 'TOYOTA'),
(94, 'Livina', 'NISSAN'),
(95, 'Luxio', 'DAIHATSU'),
(96, 'MEGA CARRY', 'SUZUKI'),
(97, 'March', 'NISSAN'),
(98, 'Mirage', 'MITSUBISHI'),
(99, 'Mobilio', 'HONDA'),
(100, 'NAV', 'TOYOTA'),
(101, 'Navara', 'NISSAN'),
(102, 'Odyssey', 'HONDA'),
(103, 'Outlander', 'MITSUBISHI'),
(104, 'PEUGEOT', '-'),
(105, 'Pajero', 'MITSUBISHI'),
(106, 'Panther', 'ISUZU'),
(107, 'Picanto', 'KIA'),
(108, 'Pregio', 'KIA'),
(109, 'RAGASA', 'MITSUBISHI'),
(110, 'RESTA', 'FORD'),
(111, 'Raize', 'TOYOTA'),
(112, 'Ranger', 'FORD'),
(113, 'Rio', 'KIA'),
(114, 'Rocky', 'DAIHATSU'),
(115, 'Rush', 'TOYOTA'),
(116, 'S-Cross', 'SUZUKI'),
(117, 'SCROSS', 'SUZUKI'),
(118, 'STARGA ZER PRIME', 'HYUNDAI'),
(119, 'Sedona', 'KIA'),
(120, 'Serena', 'NISSAN'),
(121, 'Sidekick', 'SUZUKI'),
(122, 'Sienta', 'TOYOTA'),
(123, 'Sigra', 'DAIHATSU'),
(124, 'Sirion', 'DAIHATSU'),
(125, 'Soluna', 'TOYOTA'),
(126, 'Spark', 'CHEVROLET'),
(127, 'Spin', 'CHEVROLET'),
(128, 'Splash', 'SUZUKI'),
(129, 'Starlet', 'TOYOTA'),
(130, 'Stream', 'HONDA'),
(131, 'Swift', 'SUZUKI'),
(132, 'T120 SS', 'MITSUBISHI'),
(133, 'Taft', 'DAIHATSU'),
(134, 'Taruna', 'DAIHATSU'),
(135, 'Teana', 'NISSAN'),
(136, 'Terano', 'NISSAN'),
(137, 'Terios', 'DAIHATSU'),
(138, 'Traga', 'ISUZU'),
(139, 'Travello', 'KIA'),
(140, 'Triton', 'MITSUBISHI'),
(141, 'Trooper', 'CHEVROLET'),
(142, 'Tucson', 'HYUNDAI'),
(143, 'VANTREND', 'MAZDA'),
(144, 'VRZ', 'TOYOTA'),
(145, 'Vellfire', 'TOYOTA'),
(146, 'Veloz', 'TOYOTA'),
(147, 'Vios', 'TOYOTA'),
(148, 'Visto', 'KIA'),
(149, 'Vitara', 'SUZUKI'),
(150, 'Wish', 'TOYOTA'),
(151, 'X Over', 'SUZUKI'),
(152, 'X Trail', 'NISSAN'),
(153, 'XL', 'SUZUKI'),
(154, 'XL-7', 'SUZUKI'),
(155, 'Xenia', 'DAIHATSU'),
(156, 'Xpander', 'MITSUBISHI'),
(157, 'Yaris', 'TOYOTA'),
(158, 'Zebra', 'DAIHATSU');

-- --------------------------------------------------------

--
-- Struktur dari tabel `pesanan`
--

CREATE TABLE `pesanan` (
  `id_pesanan` int NOT NULL,
  `id_user` int NOT NULL,
  `id_supplier` int NOT NULL,
  `total` decimal(12,2) DEFAULT NULL,
  `status` enum('pending','accepted','rejected') COLLATE utf8mb4_general_ci DEFAULT 'pending',
  `catatan` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `pesanan`
--

INSERT INTO `pesanan` (`id_pesanan`, `id_user`, `id_supplier`, `total`, `status`, `catatan`, `created_at`) VALUES
(1, 1, 1, 204000.00, 'accepted', '', '2025-06-08 07:53:12'),
(13, 1, 1, 160000.00, 'pending', '', '2025-06-14 00:47:57'),
(14, 1, 1, 480000.00, 'pending', '', '2025-06-14 00:59:47'),
(15, 1, 1, 88000.00, 'pending', 'Dibayar bulan depan', '2025-06-14 01:00:12');

-- --------------------------------------------------------

--
-- Struktur dari tabel `produk`
--

CREATE TABLE `produk` (
  `id_produk` int NOT NULL,
  `id_kategori` int DEFAULT NULL,
  `id_mobil` int DEFAULT NULL,
  `id_jenis_stok` int DEFAULT NULL,
  `nama` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `stok` int DEFAULT '0',
  `harga` decimal(12,2) DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `produk`
--

INSERT INTO `produk` (`id_produk`, `id_kategori`, `id_mobil`, `id_jenis_stok`, `nama`, `stok`, `harga`, `created_at`) VALUES
(1, 12, 88, 2, 'Filter Oli Kijang', 5, 160000.00, '2025-06-08 05:24:39'),
(2, 12, 8, 1, 'Filter Oli Agya', 11, 44000.00, '2025-06-08 05:31:39'),
(3, 12, 4, 1, 'Filter Oli APV', 0, 2250000.00, '2025-06-08 05:32:18'),
(7, 12, 25, 2, 'Filter Oli Calya', 50, 1000.00, '2025-06-14 17:09:27');

-- --------------------------------------------------------

--
-- Struktur dari tabel `supplier`
--

CREATE TABLE `supplier` (
  `id_supplier` int NOT NULL,
  `id_user` int NOT NULL,
  `nama_supplier` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `telp` varchar(20) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `supplier`
--

INSERT INTO `supplier` (`id_supplier`, `id_user`, `nama_supplier`, `telp`, `created_at`) VALUES
(1, 2, 'BMM (Benua Motor) Surabaya', '031544', '2025-06-07 13:37:49'),
(2, 3, 'SMM (Suzuki Motor) Surabaya', '12345678', '2025-06-14 16:02:11'),
(4, 5, 'Beni', '123456789', '2025-06-14 16:39:24');

-- --------------------------------------------------------

--
-- Struktur dari tabel `user`
--

CREATE TABLE `user` (
  `id_user` int NOT NULL,
  `nama` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `email` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `role` enum('bengkel','supplier') COLLATE utf8mb4_general_ci NOT NULL,
  `status` enum('active','inactive') COLLATE utf8mb4_general_ci DEFAULT 'active',
  `personal_token` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `user`
--

INSERT INTO `user` (`id_user`, `nama`, `email`, `password`, `role`, `status`, `personal_token`, `created_at`) VALUES
(1, 'Admin 1 Bengkel Nugraha Jaya', 'bengkel.nugraha.jaya@gmail.com', '$2b$10$tbIL2f3s6sy6r2GudAC6wel3o4B93BDYvLGo0yuhxbhm0/1XGxQ06', 'bengkel', 'active', 'fdb30d578f7db88429669cbaa87478481d401f8707d46f4e47aec5bfa74a268c', '2025-06-07 13:20:13'),
(2, 'BMM (Benua Motor) Surabaya', 'benuamotorsurabaya@gmail.com', '$2b$10$W5Vwen8UChRodcxijdW7XOqYrzZ.OU0DnDVqooZUuo0h3R70POW8u', 'supplier', 'active', NULL, '2025-06-07 13:37:49'),
(3, 'SMM (Suzuki Motor) Surabaya', 'suzuki.motor.sby@gmail.com', '$2b$10$Z8IWzT0gKvkdId.3b8ruoe0wp4Q/8RSzRnnK2th5H.qmmoVbwzIGW', 'supplier', 'active', NULL, '2025-06-14 16:02:11'),
(5, 'Beni', 'huhu@gmail.com', '$2b$10$3Bt.FYX3XYHHHTSw0nu7DuKJcC16S5.LvUrqgbHvcTVMJE4EUb8JG', 'supplier', 'inactive', NULL, '2025-06-14 16:39:24');

--
-- Indexes for dumped tables
--

--
-- Indeks untuk tabel `detail_bengkel`
--
ALTER TABLE `detail_bengkel`
  ADD PRIMARY KEY (`id_detail_bengkel`),
  ADD KEY `id_user` (`id_user`);

--
-- Indeks untuk tabel `detail_pesanan`
--
ALTER TABLE `detail_pesanan`
  ADD PRIMARY KEY (`id_detail_pesanan`),
  ADD KEY `id_pesanan` (`id_pesanan`),
  ADD KEY `id_produk` (`id_produk`);

--
-- Indeks untuk tabel `invoice`
--
ALTER TABLE `invoice`
  ADD PRIMARY KEY (`id_invoice`),
  ADD KEY `id_pesanan` (`id_pesanan`);

--
-- Indeks untuk tabel `jenis_stok`
--
ALTER TABLE `jenis_stok`
  ADD PRIMARY KEY (`id_jenis_stok`);

--
-- Indeks untuk tabel `kategori`
--
ALTER TABLE `kategori`
  ADD PRIMARY KEY (`id_kategori`);

--
-- Indeks untuk tabel `mobil`
--
ALTER TABLE `mobil`
  ADD PRIMARY KEY (`id_mobil`);

--
-- Indeks untuk tabel `pesanan`
--
ALTER TABLE `pesanan`
  ADD PRIMARY KEY (`id_pesanan`),
  ADD KEY `id_user` (`id_user`),
  ADD KEY `id_supplier` (`id_supplier`);

--
-- Indeks untuk tabel `produk`
--
ALTER TABLE `produk`
  ADD PRIMARY KEY (`id_produk`),
  ADD KEY `id_kategori` (`id_kategori`),
  ADD KEY `fk_id_mobil` (`id_mobil`),
  ADD KEY `fk_id_jenis_stok` (`id_jenis_stok`);

--
-- Indeks untuk tabel `supplier`
--
ALTER TABLE `supplier`
  ADD PRIMARY KEY (`id_supplier`),
  ADD KEY `id_user` (`id_user`);

--
-- Indeks untuk tabel `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id_user`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT untuk tabel yang dibuang
--

--
-- AUTO_INCREMENT untuk tabel `detail_bengkel`
--
ALTER TABLE `detail_bengkel`
  MODIFY `id_detail_bengkel` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT untuk tabel `detail_pesanan`
--
ALTER TABLE `detail_pesanan`
  MODIFY `id_detail_pesanan` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT untuk tabel `invoice`
--
ALTER TABLE `invoice`
  MODIFY `id_invoice` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT untuk tabel `jenis_stok`
--
ALTER TABLE `jenis_stok`
  MODIFY `id_jenis_stok` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT untuk tabel `kategori`
--
ALTER TABLE `kategori`
  MODIFY `id_kategori` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT untuk tabel `mobil`
--
ALTER TABLE `mobil`
  MODIFY `id_mobil` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=159;

--
-- AUTO_INCREMENT untuk tabel `pesanan`
--
ALTER TABLE `pesanan`
  MODIFY `id_pesanan` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT untuk tabel `produk`
--
ALTER TABLE `produk`
  MODIFY `id_produk` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT untuk tabel `supplier`
--
ALTER TABLE `supplier`
  MODIFY `id_supplier` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT untuk tabel `user`
--
ALTER TABLE `user`
  MODIFY `id_user` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- Ketidakleluasaan untuk tabel pelimpahan (Dumped Tables)
--

--
-- Ketidakleluasaan untuk tabel `detail_bengkel`
--
ALTER TABLE `detail_bengkel`
  ADD CONSTRAINT `detail_bengkel_ibfk_1` FOREIGN KEY (`id_user`) REFERENCES `user` (`id_user`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Ketidakleluasaan untuk tabel `detail_pesanan`
--
ALTER TABLE `detail_pesanan`
  ADD CONSTRAINT `detail_pesanan_ibfk_1` FOREIGN KEY (`id_pesanan`) REFERENCES `pesanan` (`id_pesanan`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `detail_pesanan_ibfk_2` FOREIGN KEY (`id_produk`) REFERENCES `produk` (`id_produk`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Ketidakleluasaan untuk tabel `invoice`
--
ALTER TABLE `invoice`
  ADD CONSTRAINT `invoice_ibfk_1` FOREIGN KEY (`id_pesanan`) REFERENCES `pesanan` (`id_pesanan`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Ketidakleluasaan untuk tabel `pesanan`
--
ALTER TABLE `pesanan`
  ADD CONSTRAINT `pesanan_ibfk_1` FOREIGN KEY (`id_user`) REFERENCES `user` (`id_user`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `pesanan_ibfk_2` FOREIGN KEY (`id_supplier`) REFERENCES `supplier` (`id_supplier`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Ketidakleluasaan untuk tabel `produk`
--
ALTER TABLE `produk`
  ADD CONSTRAINT `fk_id_jenis_stok` FOREIGN KEY (`id_jenis_stok`) REFERENCES `jenis_stok` (`id_jenis_stok`),
  ADD CONSTRAINT `fk_id_mobil` FOREIGN KEY (`id_mobil`) REFERENCES `mobil` (`id_mobil`),
  ADD CONSTRAINT `produk_ibfk_1` FOREIGN KEY (`id_kategori`) REFERENCES `kategori` (`id_kategori`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Ketidakleluasaan untuk tabel `supplier`
--
ALTER TABLE `supplier`
  ADD CONSTRAINT `supplier_ibfk_1` FOREIGN KEY (`id_user`) REFERENCES `user` (`id_user`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
