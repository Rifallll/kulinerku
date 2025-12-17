# 🍽️ Kulinerku - Jelajahi Rasa Nusantara

**Kulinerku** adalah platform web modern untuk mengeksplorasi kekayaan kuliner Indonesia. Dari Sabang sampai Merauke, temukan makanan terbaik, resep autentik, dan cerita di balik setiap hidangan.

Dilengkapi dengan **AI Chef Assistant** yang siap menjawab pertanyaan seputar resep dan kuliner Indonesia secara real-time! 🤖👨‍🍳

![Kulinerku Banner](https://images.unsplash.com/photo-1555126634-323283e090fa?q=80&w=1000&auto=format&fit=crop)

## ✨ Fitur Utama

*   **🗺️ Peta Kuliner Interaktif:** Jelajahi sebaran makanan khas di seluruh provinsi Indonesia melalui peta interaktif.
*   **🤖 AI Chef Assistant:** Chatbot pintar bertenaga **Google Gemini AI** yang bisa membuatkan resep, memberikan tips memasak, dan menjawab pertanyaan kuliner.
*   **❤️ Simpan & Favorit:** Simpan makanan kesukaanmu agar mudah ditemukan kembali.
*   **🍳 Resep Lengkap:** Koleksi resep masakan Indonesia dengan panduan langkah demi langkah.
*   **📊 Dashboard Analitik:** Pantau tren kuliner dan aktivitas pengguna (untuk Admin).
*   **🔐 Autentikasi User:** Login aman menggunakan Email atau Google (via Supabase).

## 🛠️ Teknologi yang Digunakan

Project ini dibangun dengan **Modern Web Stack** untuk performa tinggi dan pengalaman pengguna terbaik:

*   **Frontend:** [React](https://react.dev/) + [Vite](https://vitejs.dev/) (Super cepat!)
*   **Language:** [TypeScript](https://www.typescriptlang.org/) (Kode lebih aman dan rapi)
*   **Styling:** [Tailwind CSS](https://tailwindcss.com/) + [Shadcn UI](https://ui.shadcn.com/) (Desain cantik dan responsif)
*   **Backend / Database:** [Supabase](https://supabase.com/) (Auth, Database, Realtime)
*   **AI Engine:** [Google Gemini AI](https://deepmind.google/technologies/gemini/) (API v1.5 Flash)
*   **Deployment:** [Vercel](https://vercel.com/) (Serverless Functions untuk AI)

## 🚀 Cara Menjalankan (Local Development)

Ikuti langkah ini untuk menjalankan aplikasi di komputer Anda:

1.  **Clone Repository**
    ```bash
    git clone https://github.com/Rifallll/kulinerku.git
    cd kulinerku
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    
    ```

3.  **Setup Environment Variables**
    Buat file `.env` di root folder dan isi dengan konfigurasi Supabase & Gemini AI Anda:
    ```env
    VITE_SUPABASE_URL=https://your-project.supabase.co
    VITE_SUPABASE_ANON_KEY=your-anon-key
    GEMINI_API_KEY=your-google-gemini-api-key
    ```

4.  **Jalankan Server**
    ```bash
    npm run dev
    npm install express cors @google/generative-ai dotenv --legacy-peer-dep
    -node server.js > dijlankan di terminal yang beda-
    ```
    Buka [http://localhost:8080](http://localhost:8080) di browser.

    
    
    > **Catatan:** Untuk fitur AI Chat di local, pastikan menjalankan `node server.js` di terminal terpisah jika ingin menggunakan backend local, ATAU biarkan aplikasi menggunakan Serverless Function saat di-deploy.

## 🌐 Deployment (Vercel)

Aplikasi ini sudah dikonfigurasi untuk **Vercel** dengan dukungan Serverless Function untuk API Chat-nya.

1.  Push kode ke GitHub.
2.  Import project di [Vercel Dashboard](https://vercel.com/new).
3.  Masukkan **Environment Variables** (sama seperti di atas) di pengaturan Vercel.
4.  Deploy! 🚀

---

Dibuat dengan ❤️ oleh [Rifallll](https://github.com/Rifallll) untuk pecinta kuliner Indonesia.
