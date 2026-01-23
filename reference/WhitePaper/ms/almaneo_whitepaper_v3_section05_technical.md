## 5. Seni Bina Teknikal

### Walaupun teknologinya kompleks, pengalamannya haruslah mudah.

Prinsip reka bentuk teknikal AlmaNEO adalah jelas: **Pengguna tidak perlu tahu apa-apa tentang rantaian blok.** Teknologi kompleks beroperasi di sebalik tabir, dan pengguna menggunakan perkhidmatan dengan cara yang biasa.

---

### 5.1 Gambaran Keseluruhan Sistem

**Seni Bina 4-Lapisan Sistem AlmaNEO:**

| Lapisan | Komponen | Peranan |
|:---:|:---|:---|
| **1. Lapisan Pengguna** | Aplikasi AlmaNEO, Web3Auth, antara muka sembang AI | Interaksi pengguna langsung |
| **2. Lapisan Kecerdasan** | Pelayanan model AI, rangkaian DePIN, penyetempatan model | Penyediaan perkhidmatan AI |
| **3. Lapisan Kepercayaan** | Skor Kebaikan, pengesahan biometrik, pengeluaran Jeong-SBT | Pengesahan identiti dan sumbangan |
| **4. Lapisan Rantaian Blok** | Rangkaian Poligon, Token ALMAN, Kontrak Pintar | Infrastruktur Terdesentralisasi |

**Aliran Data:** Titik Sentuh Pengguna → Kecerdasan → Kepercayaan → Rantaian Blok (Komunikasi Dwiarah Antara Lapisan)

---

### 5.2 Rantaian Blok: Mengapa Polygon

AlmaNEO dibina di atas **Rangkaian Polygon**.

#### Sebab Pemilihan

| Kriteria | Kelebihan Polygon |
|------|-----------------|
| **Yuran Gas** | Kurang daripada $0.01 setiap transaksi — Mampu milik walaupun untuk pengguna di Selatan Global |
| **Kelajuan** | Pengesahan Transaksi dalam masa 2 saat — Interaksi Masa Nyata |
| **Ekosistem** | DeFi Matang, Ekosistem NFT — Boleh Diskala |
| **Keserasian** | Serasi Sepenuhnya dengan Ethereum — Mudah Diperluas |
| **Alam Sekitar** | Cekap Tenaga Berdasarkan PoS — Mampan |

#### Struktur Kontrak Pintar

### Struktur Kontrak Pintar

| Kontrak | Penerangan | Peranan Utama |
| :--- | :--- | :--- |
| **Token ALMAN** | Token standard ERC-20 | Jumlah bekalan: 8 bilion, kredit/penyimpanan/utiliti tadbir urus AI |
| **Jeong-SBT** | ERC-5484 (SBT) | Token jiwa yang tidak boleh dipindah milik, rekod Skor Kebaikan dalam rantaian |
| **Daftar Kebaikan** | Kontrak Pengesahan Aktiviti | Pengesahan dan rakaman aktiviti Kebaikan, sistem pengundian yang disahkan rakan sebaya |
| **Perjanjian Pengiraan** | Kontrak Perkongsian Sumber | Pendaftaran dan ganjaran nod DePIN, peruntukan sumber pengiraan automatik |
| **Tadbir urus** | Kontrak DAO | Cadangan dan pengundian DAO, hak mengundi berwajaran Skor Kebaikan |

---

### 5.3 Pengalaman Pengguna: Reka Bentuk Halangan Sifar

#### Web3Auth: Permulaan dalam 5 Saat

Halangan terbesar untuk kemasukan dalam perkhidmatan rantaian blok sedia ada ialah "penciptaan dompet." Tuliskan 12 frasa benih anda, jangan sekali-kali kehilangannya, dan simpan kunci peribadi anda dengan selamat. Kebanyakan orang berputus asa di sini.

**AlmaNEO berbeza.**

![AlmaNEO Technical](../assets/images/05.webp)

### Perbandingan Onboarding Tradisional vs. AlmaNEO

| Kategori | Onboarding Rantaian Blok Tradisional | Onboarding AlmaNEO |
| :--- | :--- | :--- |
| **Prosedur** | Pasang dompet → Jana frasa benih → Simpan dengan selamat → Salin alamat → Beli token → Hantar → Caj yuran gas → Gunakan perkhidmatan (8 langkah) | Klik "Log masuk dengan Google" → Selesai (2 langkah) |
| **Masa diperlukan** | 30 minit hingga 1 jam | **5 saat** |
| **Kadar lantunan** | 90% atau lebih | Minimum |

**Cara ia berfungsi:**
- Web3Auth secara automatik mencipta dompet bukan penjaga berdasarkan akaun media sosial pengguna.
- Kunci peribadi disimpan secara terpencar, menjadikannya tidak dapat diakses oleh pengguna mahupun AlmaNEO.
- Pengguna boleh menggunakan semua ciri tanpa menyedari kewujudan dompet tersebut.

#### Transaksi Tanpa Gas: Tiada Kebimbangan Yuran

Satu lagi halangan kepada penggunaan blockchain ialah "yuran gas." Keperluan membayar yuran untuk setiap transaksi, tidak kira betapa kecilnya, boleh menjadi beban yang ketara bagi pengguna baharu.

**Penyelesaian AlmaNEO:**
- ERC-4337 (Abstraksi Akaun) digunakan.
- Asas ini meliputi yuran gas untuk transaksi asas.
- Pengguna boleh menggunakan perkhidmatan ini tanpa yuran.

---

### 5.4 Infrastruktur AI: Diedarkan dan Dioptimumkan

#### Pengoptimuman Model

Hab AI AlmaNEO menyediakan model AI sumber terbuka yang dioptimumkan.

| Teknologi | Penerangan | Kesan |
|------|-------|------|
| **Kuantisasi** | Pelarasan Ketepatan Model | Pengurangan kapasiti 70%, prestasi 99% |
| **LoRA** | Penalaan halus ringan | Pengoptimuman bahasa setempat |
| **Pengkomputeran Tepi** | Pengiraan pada peranti | Tersedia walaupun internet tidak stabil |

#### Operasi Nod DePIN

Pengguna di seluruh dunia menyambungkan komputer mereka ke rangkaian AlmaNEO untuk menyediakan sumber pengiraan.

Cara Menyertai Nod:

1. Pasang perisian Nod AlmaNEO (Windows, Mac, Linux)
2. Tetapkan jumlah sumber untuk dikongsi (GPU, CPU, storan)
3. Sambung ke rangkaian
4. Terima ganjaran token ALMAN berdasarkan jumlah sumber yang disediakan.

**Keselamatan:**
- Semua pengiraan dijalankan dalam persekitaran kotak pasir dalam bekas Docker.
- Data pengguna dilindungi dengan penyulitan hujung ke hujung (E2EE).
- Malah pengendali nod tidak dapat melihat pertanyaan pengguna.

---

### 5.5 Pengesahan Identiti: Manusia, Bukan Bot

Menyediakan sumber AI secara percuma pasti akan menyebabkan percubaan penyalahgunaan. Bot akan mencipta puluhan ribu akaun untuk memonopoli sumber.

AlmaNEO melaksanakan prinsip **"Satu Orang, Satu Akaun"** melalui teknologi.

#### Bukti Keperibadian Berbilang Lapisan

### Bukti Keperibadian Berbilang Lapisan

1. **Lapisan 1: Pengesahan Peranti**
- Pengesanan peranti pendua menggunakan Cap Jari Peranti
2. **Lapisan 2: Pengesahan Sosial**
- Pengesahan identiti asas dengan memautkan akaun media sosial
3. **Lapisan 3: Pengesahan Biometrik (Pilihan)**
- Capai penilaian yang lebih tinggi dengan ID Wajah dan kaedah pengesahan lain
4. **Lapisan 4: Analisis Tingkah Laku**
- Bezakan antara bot dan manusia berdasarkan corak penggunaan
5. **Lapisan 5: Sokongan Komuniti**
- Peningkatan kepercayaan melalui cadangan daripada ahli sedia ada

**Sistem Penilaian:**

|Penilaian | Tahap Pengesahan | Kredit AI Percuma Harian |
|------|----------|-------------------|
| Asas | Log Masuk Sosial Sahaja | 10 kali |
| Disahkan | Peranti + Sosial | 50 kali |
| Dipercayai | Pengesahan biometrik ditambah | 200 kali |
| Penjaga | Skor Kebaikan Tinggi | Tanpa Had |

---

### 5.6 Privasi: Data anda adalah milik anda

AlmaNEO tidak mengumpul data pengguna.

#### Prinsip Privasi

| Prinsip | Pelaksanaan |
|------|------|
| **Perbualan Tanpa Storan** | Perbualan AI tidak disimpan pada pelayan |
| **Penyulitan Tempatan** | Data pengguna disulitkan pada peranti dengan AES-256 |
| **Analitis Tanpa Nama** | Data dirahsiakan sepenuhnya untuk penambahbaikan perkhidmatan |
| **Penggunaan Protokol Sifar Pengetahuan** | Perlindungan privasi semasa mengesahkan Skor Kebaikan |

> *"Kami tidak tahu apa yang anda tanya. Apa yang kami tahu hanyalah betapa baiknya anda."*

---

### 5.7 Ringkasan Peta Jalan Teknologi

| Fasa | Tempoh | Perkembangan Utama |
|------|-------|----------|
| **Alfa** | Suku Pertama-Suku Kedua 2025 | Pelaksanaan Testnet, Pengesahan Fungsi Teras |
| **Beta** | Suku Ketiga-Suku Keempat 2025 | Pelaksanaan Mainnet, Pengembangan Nod DePIN |
| **V1.0** | Suku Pertama 2026 | Pelancaran Rasmi, Sokongan Berbilang Bahasa |
| **V2.0** | 2H26 | Ciri Lanjutan, Pengembangan Ekosistem |

---

*Bahagian berikut memperincikan struktur ekonomi token ALMAN.*

