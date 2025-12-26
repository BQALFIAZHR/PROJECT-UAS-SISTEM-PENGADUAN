# PROJECT UAS SISTEM PENGADUAN KAMPUS

Proyek ini adalah  web  yang dikembangkan untuk memenuhi tugas Ujian Akhir Semester (UAS). Sistem ini berfungsi sebagai platform digital bagi mahasiswa untuk melaporkan kendala di lingkungan kampus seperti fasilitas rusak atau masalah akademik dan memberikan antarmuka bagi Admin untuk menindaklanjuti laporan tersebut secara transparan.

Aplikasi ini dibangun menggunakan arsitektur **MVC (Model-View-Controller)** dan **REST API**.

---

## 1. Fitur Utama

**Fitur Umum & Keamanan:**
* 🔐 **Autentikasi JWT:** Login aman menggunakan JSON Web Token.
* 🛡️ **Protected Routes:** Halaman dashboard tidak bisa diakses tanpa login.
* 👮 **Role-Based Access:** Pembedaan hak akses antara **Mahasiswa** dan **Admin**.

**Fitur Mahasiswa:**
* 📝 **Buat Pengaduan:** Melaporkan masalah dengan kategori (Fasilitas/Akademik).
* 📊 **Dashboard Riwayat:** Melihat status laporan (Pending, Proses, Selesai).
* ✏️ **Edit Laporan:** Mengubah data laporan jika status masih *pending*.
* 📰 **Galeri Berita:** Melihat bukti perbaikan fasilitas yang telah diselesaikan admin.

**Fitur Admin:**
* 📋 **Panel Admin:** Melihat semua laporan masuk dari seluruh mahasiswa.
* 🔄 **Update Status:** Mengubah status laporan menjadi "Proses" atau "Selesai".
* ✅ **Penyelesaian & Bukti:** Menambahkan pesan balasan dan link foto bukti perbaikan.

---

## 2. Instalasi yang Dibutuhkan

Sebelum menjalankan aplikasi, pastikan komputer Anda sudah terinstal:

1.  **Node.js** (v14 ke atas) & NPM.
2.  **MySQL Database** (bisa menggunakan XAMPP/Laragon).
3.  **Git** (Opsional).

**Langkah Awal:**
1.  Clone atau Download repository ini.
2.  Import database MySQL.
3.  Pastikan file `.env` di folder `uas-backend` sudah dikonfigurasi dengan benar (DB_PASS, JWT_SECRET).

---

## 3. Cara Run Frontend

Frontend dibangun menggunakan **Vue 3** dan **Vite**.

1.  Buka terminal baru, masuk ke folder frontend:
    ```bash
    cd uas-frontend
    ```
2.  Install library yang dibutuhkan :
    ```bash
    npm install
    ```
3.  Jalankan server frontend:
    ```bash
    npm run dev
    ```
4.  Akses aplikasi di browser melalui link yang muncul (biasanya `http://localhost:5173`).

---

## 4. Cara Run Backend

Backend dibangun menggunakan **Express.js**.

1.  Buka terminal baru, masuk ke folder backend:
    ```bash
    cd uas-backend
    ```
2.  Install library yang dibutuhkan (hanya pertama kali):
    ```bash
    npm install
    ```
3.  Jalankan server backend:
    ```bash
    npx nodemon server.js
    ```
    *(Pastikan muncul pesan "Server running on port 5000" dan "Connected to MySQL")*

---

## 5. Akun Masuk untuk Role Mahasiswa

Gunakan akun ini untuk menguji fitur pelaporan masalah:

* **Username:** `alfia`
* **Password:** `5555`

---

## 6. Akun Masuk untuk Role Admin

Gunakan akun ini untuk menguji fitur memproses laporan dan update status:

* **Username:** `admin`
* **Password:** `123`

---

## 7. Penjelasan Uji API

Berikut adalah dokumentasi pengujian REST API menggunakan Postman untuk memastikan backend berjalan dengan baik sesuai prinsip CRUD.

### Registrasi User Baru
Menguji endpoint untuk mendaftarkan pengguna baru ke dalam sistem.
<img width="1920" height="1080" alt="REGIS" src="https://github.com/user-attachments/assets/79e66aea-1a40-4dd4-9c8b-bfc7de21f74b" />

### Login (Generate Token)
Menguji proses login untuk mendapatkan **Token JWT** yang wajib digunakan untuk mengakses endpoint lainnya.
<img width="1920" height="1080" alt="LOGIN" src="https://github.com/user-attachments/assets/36a449b8-85a2-47d1-af0b-3108830f4e55" />

### Create Data (Buat Pengaduan)
Mengirim data laporan baru (Judul, Deskripsi, Kategori) dengan menyertakan Token di header.
<img width="1920" height="1080" alt="CREATE DATA" src="https://github.com/user-attachments/assets/d0a75ed6-8bd1-4970-a434-6527bf0145f5" />

### Read List Data (Dashboard)
Mengambil daftar semua laporan milik user yang sedang login.
<img width="1920" height="1080" alt="READ LIST DATA" src="https://github.com/user-attachments/assets/51b68e37-68d5-453e-a7fe-e36204928345" />

### Read Detail Data
Mengambil detail lengkap dari satu laporan spesifik berdasarkan ID.
<img width="1920" height="1080" alt="READ DETAIL DATA" src="https://github.com/user-attachments/assets/e4e2b241-2e27-45ec-91ff-e7caed4361f9" />

### Update Data
Mengedit judul atau deskripsi laporan yang sudah ada.
<img width="1920" height="1080" alt="UPDATE DATA" src="https://github.com/user-attachments/assets/f3dd6c0f-33c6-41db-800e-b982d46e4db2" />

### Protected Route (Uji Keamanan)
Mencoba mengakses data tanpa Token, sistem harus menolak akses (Unauthorized).
<img width="1920" height="1080" alt="PROTECTED ROUTE" src="https://github.com/user-attachments/assets/0f229604-d8a6-450e-b79b-b5ef21e3c022" />
