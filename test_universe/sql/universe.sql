-- Buat database dengan nama Cosmic_Universe_DB
CREATE DATABASE IF NOT EXISTS cosmic_universe_db;
USE cosmic_universe_db;

-- Hapus tabel jika sudah ada (untuk fresh start)
DROP TABLE IF EXISTS object_facts;
DROP TABLE IF EXISTS cosmic_objects;

-- Tabel cosmic_objects
CREATE TABLE cosmic_objects (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) UNIQUE NOT NULL,
    type ENUM('Planet', 'Star', 'Moon', 'Galaxy', 'Nebula', 'Black Hole') NOT NULL,
    diameter_km DECIMAL(20, 2),
    mass_kg DECIMAL(30, 2),
    distance_from_earth_ly DECIMAL(15, 2),
    constellation VARCHAR(50),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabel object_facts dengan relationship yang proper
CREATE TABLE object_facts (
    id INT PRIMARY KEY AUTO_INCREMENT,
    cosmic_object_id INT NOT NULL,
    fact_description TEXT NOT NULL,
    discovery_year INT,
    fact_type ENUM('Scientific', 'Historical', 'Cultural', 'Astronomical'),
    credibility_rating ENUM('High', 'Medium', 'Low'),
    FOREIGN KEY (cosmic_object_id) REFERENCES cosmic_objects(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample data untuk cosmic_objects
INSERT INTO cosmic_objects (name, type, diameter_km, mass_kg, distance_from_earth_ly, constellation, description) VALUES
('Earth', 'Planet', 12742.00, 5.972e24, 0.000016, 'Various', 'Planet ketiga dari Matahari, satu-satunya planet yang diketahui mendukung kehidupan'),
('Sun', 'Star', 1392700.00, 1.989e30, 0.000016, 'None', 'Bintang di pusat tata surya kita, sumber energi utama untuk kehidupan di Bumi'),
('Moon', 'Moon', 3474.80, 7.342e22, 0.000016, 'Various', 'Satelit alami Bumi, mempengaruhi pasang surut air laut'),
('Jupiter', 'Planet', 139820.00, 1.898e27, 0.000084, 'Various', 'Planet terbesar dalam tata surya kita, planet gas raksasa'),
('Andromeda Galaxy', 'Galaxy', 220000.00, 1.5e42, 2537000.00, 'Andromeda', 'Galaksi spiral terdekat dengan Bima Sakti'),
('Mercury', 'Planet', 4879.40, 3.301e23, 0.000011, 'Various', 'Planet terkecil dan terdekat dengan Matahari'),
('Neptune', 'Planet', 49244.00, 1.024e26, 0.000476, 'Various', 'Planet terjauh dari Matahari, raksasa es'),
('Saturn', 'Planet', 116460.00, 5.683e26, 0.000150, 'Various', 'Planet dengan sistem cincin yang paling mencolok');

-- Insert sample data untuk object_facts
INSERT INTO object_facts (cosmic_object_id, fact_description, discovery_year, fact_type, credibility_rating) VALUES
(1, 'Memiliki satu satelit alami bernama Bulan', 1610, 'Scientific', 'High'),
(1, 'Satu-satunya planet yang diketahui memiliki air dalam bentuk cair di permukaannya', 1543, 'Scientific', 'High'),
(2, 'Mengandung 99.86% massa total tata surya', 1610, 'Scientific', 'High'),
(2, 'Suhu intinya mencapai 15 juta derajat Celsius', 1610, 'Scientific', 'High'),
(3, 'Memengaruhi rotasi Bumi dan memperlambatnya sekitar 1.7 milidetik per abad', 1610, 'Scientific', 'High'),
(4, 'Memiliki Great Red Spot, badai raksasa yang telah berlangsung selama ratusan tahun', 1665, 'Scientific', 'High'),
(5, 'Akan bertabrakan dengan Bima Sakti dalam sekitar 4.5 miliar tahun', 964, 'Astronomical', 'High'),
(6, 'Tidak memiliki atmosfer yang signifikan', 1639, 'Scientific', 'High'),
(7, 'Ditemukan melalui perhitungan matematika sebelum diamati secara langsung', 1846, 'Historical', 'High'),
(8, 'Cincin Saturnus sebagian besar terbuat dari partikel es dengan sedikit batuan', 1610, 'Scientific', 'High');

-- Tambahkan tabel users
CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'user', 'researcher', 'student') DEFAULT 'user',
    avatar VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert demo users
INSERT INTO users (first_name, last_name, email, username, password, role, avatar) VALUES
('Admin', 'User', 'admin@universe.com', 'admin', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin', 'https://ui-avatars.com/api/?name=Admin+User&background=00d4ff&color=fff'),
('Regular', 'User', 'user@universe.com', 'user', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'user', 'https://ui-avatars.com/api/?name=Regular+User&background=6f42c1&color=fff');