# NextStep — Database Schema

**Product:** NextStep
**Tagline:** *Know what you want. Know what to do.*

---

## 1. Database Overview

NextStep menggunakan **PostgreSQL** sebagai database utama.

Database digunakan untuk menyimpan:

* Data pengguna
* Input atau session pengguna
* Goal
* Action plan
* Progress

---

# 2. Entity Relationship

```text
users
  │
  ├──< sessions
  │
  └──< goals
          │
          └──< action_plans
                    │
                    └── progress
```

---

# 3. Table: Users

Menyimpan data dasar pengguna.

| Column     | Type      | Constraint       | Description       |
| ---------- | --------- | ---------------- | ----------------- |
| id         | UUID      | PRIMARY KEY      | ID unik pengguna  |
| email      | VARCHAR   | UNIQUE, NOT NULL | Email pengguna    |
| name       | VARCHAR   | NULL             | Nama pengguna     |
| created_at | TIMESTAMP | NOT NULL         | Waktu akun dibuat |

### Schema

```sql
CREATE TABLE users (
    id UUID PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(100),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

---

# 4. Table: Sessions

Menyimpan sesi ketika pengguna menceritakan kondisi, masalah, atau pikirannya kepada NextStep.

| Column     | Type        | Constraint            | Description                     |
| ---------- | ----------- | --------------------- | ------------------------------- |
| id         | UUID        | PRIMARY KEY           | ID session                      |
| user_id    | UUID        | FOREIGN KEY, NOT NULL | Pemilik session                 |
| input_text | TEXT        | NOT NULL              | Input pengguna                  |
| input_type | VARCHAR(20) | NOT NULL, CHECK       | Jenis input                     |
| ai_context | TEXT        | NULL                  | Hasil pemahaman konteks oleh AI |
| created_at | TIMESTAMP   | NOT NULL              | Waktu session dibuat            |

### Validasi Input Type

`input_type` hanya boleh memiliki nilai:

* `text`
* `voice`

### Schema

```sql
CREATE TABLE sessions (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL,
    input_text TEXT NOT NULL,

    input_type VARCHAR(20) NOT NULL
        CHECK (input_type IN ('text', 'voice')),

    ai_context TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);
```

---

# 5. Table: Goals

Menyimpan goal yang telah ditemukan dan dikonfirmasi oleh pengguna.

| Column     | Type        | Constraint            | Description       |
| ---------- | ----------- | --------------------- | ----------------- |
| id         | UUID        | PRIMARY KEY           | ID goal           |
| session_id | UUID        | FOREIGN KEY, NOT NULL | Session terkait   |
| goal_text  | TEXT        | NOT NULL              | Goal pengguna     |
| status     | VARCHAR(20) | NOT NULL, CHECK       | Status goal       |
| created_at | TIMESTAMP   | NOT NULL              | Waktu goal dibuat |

### Validasi Status Goal

Status goal hanya boleh:

* `active`
* `completed`
* `archived`

### Schema

```sql
CREATE TABLE goals (
    id UUID PRIMARY KEY,
    session_id UUID NOT NULL,
    goal_text TEXT NOT NULL,

    status VARCHAR(20) NOT NULL DEFAULT 'active'
        CHECK (status IN ('active', 'completed', 'archived')),

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (session_id)
        REFERENCES sessions(id)
        ON DELETE CASCADE
);
```

---

# 6. Table: Action Plans

Menyimpan langkah-langkah yang dibuat berdasarkan goal.

| Column      | Type        | Constraint            | Description    |
| ----------- | ----------- | --------------------- | -------------- |
| id          | UUID        | PRIMARY KEY           | ID action      |
| goal_id     | UUID        | FOREIGN KEY, NOT NULL | Goal terkait   |
| title       | TEXT        | NOT NULL              | Nama langkah   |
| description | TEXT        | NULL                  | Detail langkah |
| step_order  | INTEGER     | NOT NULL              | Urutan langkah |
| status      | VARCHAR(20) | NOT NULL, CHECK       | Status langkah |
| created_at  | TIMESTAMP   | NOT NULL              | Waktu dibuat   |

### Validasi Status Action Plan

Status action plan hanya boleh:

* `pending`
* `in_progress`
* `completed`

### Schema

```sql
CREATE TABLE action_plans (
    id UUID PRIMARY KEY,
    goal_id UUID NOT NULL,
    title TEXT NOT NULL,
    description TEXT,

    step_order INTEGER NOT NULL
        CHECK (step_order > 0),

    status VARCHAR(20) NOT NULL DEFAULT 'pending'
        CHECK (status IN ('pending', 'in_progress', 'completed')),

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (goal_id)
        REFERENCES goals(id)
        ON DELETE CASCADE
);
```

---

# 7. Table: Progress

Menyimpan status progress dari action plan yang dikerjakan pengguna.

| Column         | Type        | Constraint            | Description         |
| -------------- | ----------- | --------------------- | ------------------- |
| id             | UUID        | PRIMARY KEY           | ID progress         |
| action_plan_id | UUID        | FOREIGN KEY, NOT NULL | Action plan terkait |
| status         | VARCHAR(20) | NOT NULL, CHECK       | Status pengerjaan   |
| completed_at   | TIMESTAMP   | NULL                  | Waktu selesai       |

### Validasi Status Progress

Status progress hanya boleh:

* `pending`
* `completed`

### Schema

```sql
CREATE TABLE progress (
    id UUID PRIMARY KEY,
    action_plan_id UUID NOT NULL,

    status VARCHAR(20) NOT NULL DEFAULT 'pending'
        CHECK (status IN ('pending', 'completed')),

    completed_at TIMESTAMP,

    FOREIGN KEY (action_plan_id)
        REFERENCES action_plans(id)
        ON DELETE CASCADE
);
```

---

# 8. Validation Summary

Semua nilai yang bersifat terbatas divalidasi langsung pada level database menggunakan PostgreSQL `CHECK constraint`.

| Table        | Column     | Allowed Values                        |
| ------------ | ---------- | ------------------------------------- |
| sessions     | input_type | `text`, `voice`                       |
| goals        | status     | `active`, `completed`, `archived`     |
| action_plans | status     | `pending`, `in_progress`, `completed` |
| progress     | status     | `pending`, `completed`                |

Dengan validasi ini, database akan menolak nilai yang tidak sesuai dengan aturan yang telah ditentukan.

---

# 9. Data Flow

```text
User
  │
  ▼
Text / Voice Input
  │
  ▼
Session
  │
  ▼
AI Context Understanding
  │
  ▼
Goal
  │
  ▼
Action Plan
  │
  ▼
Progress
```

---

# 10. MVP Database Scope

### Included

* User
* User input/session
* AI context
* Goal
* Action plan
* Progress

### Not Included

* Calendar integration
* Notifications
* Social/collaboration
* Gamification
* Autonomous AI agent
* Mobile-specific data

---

## 11. Database Principle

Database NextStep dirancang dengan prinsip:

* **Simple** — hanya menyimpan data yang diperlukan MVP.
* **Validated** — nilai dengan pilihan terbatas divalidasi menggunakan database constraint.
* **Relational** — hubungan antar data jelas.
* **Consistent** — menggunakan PostgreSQL sesuai tech stack wajib.
* **Scalable** — struktur dapat dikembangkan jika kebutuhan aplikasi bertambah.

**Core relationship:**

> User → Session → Goal → Action Plan → Progress
