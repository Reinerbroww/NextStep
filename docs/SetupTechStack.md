# NextStep — STEP 6: Setup Tech Stack

**Product:** NextStep
**Tagline:** *Know what you want. Know what to do.*

---

## 1. Objective

Menyiapkan environment development NextStep menggunakan tech stack yang telah ditentukan dalam SOP.

Setup harus mengikuti stack wajib:

* Next.js
* React
* TypeScript
* Tailwind CSS
* PostgreSQL

---

# 2. Tech Stack

| Component           | Technology                  | Status           |
| ------------------- | --------------------------- | ---------------- |
| Framework           | Next.js                     | Required         |
| UI Library          | React                       | Required         |
| Language            | TypeScript                  | Required         |
| Styling             | Tailwind CSS                | Required         |
| Database            | PostgreSQL                  | Required         |
| PostgreSQL Provider | Supabase / Neon             | To be selected   |
| AI                  | AI API                      | To be configured |
| AI App Builder      | One approved AI coding tool | To be selected   |

---

# 3. Project Structure

Project menggunakan struktur Next.js yang terorganisasi.

```text
NextStep/
│
├── app/
│   ├── page.tsx
│   ├── layout.tsx
│   └── globals.css
│
├── components/
│
├── lib/
│
├── public/
│
├── docs/
│   ├── prd.md
│   ├── user-persona.md
│   ├── user-flow.md
│   ├── wireframe.md
│   ├── database-schema.md
│   ├── style-and-mood.md
│   └── coldstart.md
│
├── .env.local
├── package.json
├── tsconfig.json
└── README.md
```

Struktur dapat disesuaikan selama proses development apabila diperlukan, tetapi tidak boleh mengubah arsitektur utama tanpa alasan yang jelas.

---

# 4. Database Setup

NextStep menggunakan:

**PostgreSQL**

Database provider yang diperbolehkan:

* Supabase
* Neon

Database akan digunakan untuk menyimpan:

```text
Users
   ↓
Sessions
   ↓
Goals
   ↓
Action Plans
   ↓
Progress
```

Database schema mengikuti dokumen:

`docs/database-schema.md`

---

# 5. Environment Variables

Credential dan konfigurasi sensitif tidak boleh ditulis langsung di source code.

Gunakan:

```text
.env.local
```

Contoh struktur:

```env
DATABASE_URL="your-postgresql-connection-string"

AI_API_KEY="your-ai-api-key"
```

> Nilai sebenarnya tidak ditulis di dalam repository atau dokumentasi publik.

---

# 6. AI Setup

NextStep menggunakan **AI API** untuk menjalankan proses:

```text
User Input
    ↓
AI
    ↓
Context & Intent Understanding
    ↓
Goal Discovery & Clarification
    ↓
Action Plan
    ↓
Next Step
```

AI digunakan untuk membantu proses pemahaman dan pengambilan struktur dari input pengguna.

Tidak diperlukan proses training model AI sendiri untuk MVP.

---

# 7. AI App Builder

Sesuai SOP, development menggunakan **satu AI app builder / AI coding assistant** yang dipilih untuk membantu proses implementasi.

Tool yang dipilih harus:

* Mendukung Next.js
* Mendukung TypeScript
* Mendukung React
* Mendukung Tailwind CSS
* Dapat bekerja berdasarkan `coldstart.md`
* Membantu proses coding dan debugging

**AI App Builder:** `[Pilih satu tool]`

> Pemilihan tool dilakukan sebelum masuk STEP 7.

---

# 8. Initial Setup Checklist

Sebelum masuk ke tahap development, pastikan:

* [ ] Node.js sudah terinstall.
* [ ] Package manager sudah tersedia.
* [ ] Project Next.js berhasil dibuat.
* [ ] TypeScript aktif.
* [ ] React aktif.
* [ ] Tailwind CSS aktif.
* [ ] PostgreSQL provider sudah dipilih.
* [ ] Database berhasil dibuat.
* [ ] Database connection berhasil.
* [ ] `.env.local` sudah dikonfigurasi.
* [ ] AI API sudah dipilih.
* [ ] AI API key sudah dikonfigurasi.
* [ ] AI app builder sudah dipilih.
* [ ] `coldstart.md` tersedia sebagai referensi development.

---

# 9. Setup Validation

Sebelum melanjutkan ke STEP 7, lakukan validasi:

### Application

```text
Next.js
   ↓
Application runs successfully
```

### Database

```text
Next.js
   ↓
Database Connection
   ↓
PostgreSQL
```

### AI

```text
Next.js
   ↓
AI API
   ↓
AI Response
```

Ketiga komponen harus dapat berjalan sebelum masuk ke tahap build.

---

# 10. STEP 6 Completion Criteria

STEP 6 dianggap selesai apabila:

1. Project Next.js berhasil dijalankan.
2. React dan TypeScript berfungsi.
3. Tailwind CSS aktif.
4. PostgreSQL berhasil dikonfigurasi.
5. Database connection berhasil.
6. AI API telah dipilih dan dikonfigurasi.
7. AI app builder telah dipilih.
8. Tidak ada credential sensitif yang hardcoded.
9. `coldstart.md` siap digunakan sebagai development reference.

---

# 11. Important Constraint

STEP 6 hanya berfokus pada **setup environment**.

Jangan mulai membangun fitur MVP pada tahap ini.

Feature development dimulai pada:

**STEP 7 — Build Full-Stack with AI**
