## 5. Arsitektur Teknis

### Meskipun teknologinya kompleks, pengalaman pengguna harus sederhana.

Prinsip desain teknis AlmaNEO jelas: **Pengguna tidak perlu mengetahui apa pun tentang blockchain.** Teknologi kompleks beroperasi di balik layar, dan pengguna menggunakan layanan dengan cara yang familiar.

---

### 5.1 Gambaran Sistem

**Arsitektur 4 Lapisan Sistem AlmaNEO:**

| Lapisan | Komponen | Peran |

|:---:|:---|:---|

| **1. Lapisan Pengguna** | Aplikasi AlmaNEO, Web3Auth, antarmuka obrolan AI | Interaksi pengguna langsung |

| **2. Lapisan Kecerdasan** | Penyajian model AI, jaringan DePIN, lokalisasi model | Penyediaan layanan AI |

| **3. Lapisan Kepercayaan** | Skor Kebaikan, otentikasi biometrik, penerbitan Jeong-SBT | Verifikasi identitas dan kontribusi |

| **4. Lapisan Blockchain** | Jaringan Polygon, Token ALMAN, Kontrak Pintar | Infrastruktur Terdesentralisasi |

**Alur Data:** Titik Kontak Pengguna → Intelijen → Kepercayaan → Blockchain (Komunikasi Dua Arah Antar Lapisan)

---

### 5.2 Blockchain: Mengapa Polygon

AlmaNEO dibangun di atas **Jaringan Polygon**.

#### Alasan Pemilihan

| Kriteria | Keunggulan Polygon |

|------|---------------|

| **Biaya Gas** | Kurang dari $0,01 per transaksi — Terjangkau bahkan untuk pengguna di Global Selatan |

| **Kecepatan** | Konfirmasi Transaksi dalam 2 detik — Interaksi Real-time |

| **Ekosistem** | Ekosistem DeFi dan NFT yang Matang — Dapat Diperluas |

| **Kompatibilitas** | Sepenuhnya Kompatibel dengan Ethereum — Mudah Dikembangkan |

| **Lingkungan** | Hemat Energi Berbasis PoS — Berkelanjutan |

#### Struktur Kontrak Pintar

### Struktur Kontrak Pintar

| Kontrak | Deskripsi | Peran Utama |

| :--- | :--- | :--- |

| **Token ALMAN** | Token standar ERC-20 | Total pasokan: 8 miliar, utilitas kredit/staking/tata kelola AI |

| **Jeong-SBT** | ERC-5484 (SBT) | Token jiwa yang tidak dapat ditransfer, catatan on-chain Skor Kebaikan |

| **Registrasi Kebaikan** | Kontrak Verifikasi Aktivitas | Verifikasi dan pencatatan aktivitas kebaikan, sistem pemungutan suara yang diverifikasi oleh rekan |

| **Perjanjian Komputasi** | Kontrak Berbagi Sumber Daya | Registrasi dan hadiah node DePIN, alokasi sumber daya komputasi otomatis |

| **Tata Kelola** | Kontrak DAO | Proposal dan pemungutan suara DAO, hak suara berbobot Skor Kebaikan |

---

### 5.3 Pengalaman Pengguna: Desain Tanpa Hambatan

#### Web3Auth: Mulai dalam 5 Detik

Hambatan terbesar untuk masuk ke layanan blockchain yang ada adalah "pembuatan dompet." Catat 12 frasa kunci Anda, jangan pernah kehilangannya, dan simpan kunci pribadi Anda dengan aman. Kebanyakan orang menyerah di sini.

**AlmaNEO berbeda.**

![Teknologi AlmaNEO](../assets/images/05.webp)

### Perbandingan Onboarding Tradisional vs. AlmaNEO

| Kategori | Onboarding Blockchain Tradisional | Onboarding AlmaNEO |

| :--- | :--- | :--- |

| **Prosedur** | Instal dompet → Buat frasa kunci → Simpan dengan aman → Salin alamat → Beli token → Kirim → Bayar biaya gas → Gunakan layanan (8 langkah) | Klik "Masuk dengan Google" → Selesai (2 langkah) |

| **Waktu yang dibutuhkan** | 30 menit hingga 1 jam | **5 detik** |

| **Tingkat pantulan** | 90% atau lebih | Minimal |

**Cara kerjanya:**
- Web3Auth secara otomatis membuat dompet non-kustodian berdasarkan akun media sosial pengguna.

- Kunci pribadi disimpan secara terdesentralisasi, sehingga tidak dapat diakses oleh pengguna maupun AlmaNEO.

- Pengguna dapat menggunakan semua fitur tanpa menyadari keberadaan dompet tersebut.

#### Transaksi Tanpa Biaya Gas: Tanpa Kekhawatiran Biaya

Hambatan lain untuk adopsi blockchain adalah "biaya gas." Harus membayar biaya untuk setiap transaksi, sekecil apa pun, dapat menjadi beban yang signifikan bagi pengguna baru.

**Solusi AlmaNEO:**
- ERC-4337 (Abstraksi Akun) diterapkan.

- Yayasan menanggung biaya gas untuk transaksi dasar.

- Pengguna dapat menggunakan layanan tanpa biaya.

---

### 5.4 Infrastruktur AI: Terdistribusi dan Dioptimalkan

#### Optimasi Model

AlmaNEO AI Hub menyediakan model AI sumber terbuka yang dioptimalkan.

| Teknologi | Deskripsi | Efek |

|------|------|------|

| **Kuantisasi** | Penyesuaian Presisi Model | Pengurangan kapasitas 70%, kinerja 99% |

| **LoRA** | Penyesuaian halus yang ringan | Optimasi bahasa lokal |

| **Komputasi Tepi** | Komputasi di perangkat | Tersedia bahkan saat internet tidak stabil |

#### Operasi Node DePIN

Pengguna di seluruh dunia menghubungkan komputer mereka ke jaringan AlmaNEO untuk menyediakan sumber daya komputasi.

Cara Berpartisipasi dalam Node:

1. Instal perangkat lunak Node AlmaNEO (Windows, Mac, Linux)
2. Tetapkan jumlah sumber daya yang akan dibagikan (GPU, CPU, penyimpanan)
3. Hubungkan ke jaringan
4. Terima hadiah token ALMAN berdasarkan jumlah sumber daya yang diberikan.

**Keamanan:**
- Semua komputasi berjalan di lingkungan sandbox dalam kontainer Docker.

- Data pengguna dilindungi dengan enkripsi ujung-ke-ujung (E2EE).

- Bahkan operator node pun tidak dapat melihat kueri pengguna.

---

### 5.5 Verifikasi Identitas: Manusia, Bukan Bot

Memberikan sumber daya AI secara gratis pasti akan menyebabkan upaya penyalahgunaan. Bot akan membuat puluhan ribu akun untuk memonopoli sumber daya.

AlmaNEO menerapkan prinsip **"Satu Orang, Satu Akun"** melalui teknologi.

#### Bukti Identitas Berlapis

### Bukti Identitas Berlapis

1. **Lapisan 1: Otentikasi Perangkat**
- Deteksi perangkat duplikat menggunakan Sidik Jari Perangkat
2. **Lapisan 2: Otentikasi Sosial**
- Verifikasi identitas dasar dengan menghubungkan akun media sosial
3. **Lapisan 3: Otentikasi Biometrik (Opsional)**
- Raih peringkat lebih tinggi dengan Face ID dan metode otentikasi lainnya
4. **Lapisan 4: Analisis Perilaku**
- Membedakan antara bot dan manusia berdasarkan pola penggunaan
5. **Lapisan 5: Dukungan Komunitas**
- Meningkatkan kepercayaan melalui rekomendasi dari anggota yang sudah ada

**Sistem Peringkat:**

|Peringkat | Tingkat Otentikasi | Kredit AI Gratis Harian |

|------|----------|-------------------|

| Dasar | Hanya Login Sosial | 10 kali |

| Terverifikasi | Perangkat + Sosial | 50 kali |

| Terpercaya | Otentikasi biometrik ditambahkan | 200 kali |

| Wali | Skor Kebaikan Tinggi | Tidak Terbatas |

---

### 5.6 Privasi: Data Anda adalah milik Anda

AlmaNEO tidak mengumpulkan data pengguna.

#### Prinsip Privasi

| Prinsip | Implementasi |

|------|------|

| **Percakapan Tanpa Penyimpanan** | Percakapan AI tidak disimpan di server |

| **Enkripsi Lokal** | Data pengguna dienkripsi di perangkat dengan AES-256 |

| **Analisis Anonim** | Data sepenuhnya dianonimkan untuk peningkatan layanan |

| **Pemanfaatan Protokol Tanpa Pengetahuan** | Perlindungan privasi saat memverifikasi Skor Kebaikan |

> *"Kami tidak tahu apa yang Anda tanyakan. Yang kami tahu hanyalah betapa baiknya Anda."*

---

### 5.7 Ringkasan Peta Jalan Teknologi

| Fase | Periode | Perkembangan Utama |

|------|------|----------|

| **Alpha** | Kuartal 1-2 2025 | Implementasi Testnet, Verifikasi Fungsi Inti |

| **Beta** | Kuartal 3-4 2025 | Implementasi Mainnet, Perluasan Node DePIN |

| **V1.0** | Kuartal 1 2026 | Peluncuran Resmi, Dukungan Multibahasa |

| **V2.0** | Semester 2 2026 | Fitur Lanjutan, Perluasan Ekosistem |

---

*Bagian berikut merinci struktur ekonomi token ALMAN.*

