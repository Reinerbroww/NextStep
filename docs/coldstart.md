# NextStep — Cold Start Document

**Product:** NextStep
**Tagline:** *Know what you want. Know what to do.*

> This document summarizes the approved product decisions from STEP 1 through STEP 5. It is the primary reference for development and must be followed without changing the approved scope.

---

# 1. Product Overview

## Product Name

**NextStep**

## Tagline

**Know what you want. Know what to do.**

## Core Concept

NextStep adalah web app berbasis AI yang membantu pengguna ketika mereka merasa bingung, memiliki banyak pikiran, menghadapi masalah, memiliki beberapa pilihan, atau belum mengetahui dengan jelas apa yang ingin dilakukan.

Pengguna dapat menceritakan kondisi mereka melalui **text atau voice input**.

AI kemudian:

1. Memahami konteks dan intent pengguna.
2. Membantu memperjelas apa yang sebenarnya ingin dicapai.
3. Membentuk goal.
4. Membuat action plan.
5. Menentukan langkah konkret yang harus dilakukan selanjutnya.
6. Membantu pengguna melihat progress.

NextStep bukan sekadar to-do list atau chatbot. Fokus utamanya adalah membantu pengguna bergerak dari **kebingungan menuju tindakan yang jelas**.

---

# 2. Problem

Banyak orang mengalami kondisi seperti:

* Tidak tahu harus mulai dari mana.
* Memiliki terlalu banyak pilihan.
* Memiliki banyak pikiran tetapi belum tahu apa yang sebenarnya diinginkan.
* Mengetahui tujuan tetapi tidak tahu langkah pertama.
* Kesulitan menentukan prioritas.

NextStep membantu mengubah situasi tersebut menjadi tujuan dan langkah yang lebih jelas.

---

# 3. Target Users

Target utama:

**Mahasiswa dan pengguna umum yang sedang menghadapi situasi membingungkan.**

Characteristics:

* Memiliki banyak pikiran, masalah, atau keinginan.
* Tidak selalu mengetahui tujuan sebenarnya.
* Sering bingung menentukan prioritas.
* Memiliki beberapa pilihan.
* Membutuhkan arahan yang sederhana dan praktis.

### Main Need

> Memahami situasi → mengetahui apa yang ingin dicapai → mengetahui apa yang harus dilakukan.

---

# 4. MVP Features

MVP NextStep memiliki enam fitur utama:

### 1. Text & Voice Input

Pengguna dapat menceritakan kondisi, masalah, keinginan, atau pikirannya menggunakan text maupun voice.

### 2. AI Context & Intent Understanding

AI memahami konteks dan intent dari input pengguna.

### 3. Goal Discovery & Clarification

AI membantu pengguna menemukan dan memperjelas tujuan apabila goal belum jelas.

### 4. Action Plan

AI membuat rencana tindakan berdasarkan goal yang telah ditentukan.

### 5. What Should I Do Next?

AI memberikan langkah konkret yang harus dilakukan pengguna selanjutnya.

### 6. Progress Tracking

Pengguna dapat melihat perkembangan berdasarkan action plan yang telah diselesaikan.

---

# 5. Out of Scope

Fitur berikut **tidak termasuk dalam MVP**:

* Calendar atau third-party integrations
* Notifications
* Social / collaboration
* Gamification
* AI autonomous agent
* Real-time voice conversation
* Mobile application

---

# 6. Core User Flow

```text
Confused
   ↓
Understand
   ↓
Clarify
   ↓
Goal
   ↓
Plan
   ↓
Next Step
   ↓
Progress
```

Detailed flow:

```text
Landing Page
      ↓
Tell What's on Your Mind
      ↓
Text / Voice Input
      ↓
AI Understands Context
      ↓
Is the Goal Clear?
      ↓
 ┌────┴────┐
 │         │
 No       Yes
 │         │
 ↓         ↓
AI Asks   Confirm
Questions Goal
 │         │
 ↓         ↓
User      Action
Answers   Plan
 │         │
 ↓         ↓
Clarify   What Should
Goal      I Do Next?
 │         │
 └────┬────┘
      ↓
Progress Tracking
```

---

# 7. Wireframe Summary

## Landing Page

```text
┌──────────────────────────────────────────────┐
│ NextStep                                     │
│                                              │
│        Know what you want.                  │
│        Know what to do.                     │
│                                              │
│  Turn your thoughts into a clear next step. │
│                                              │
│             [ Get Started ]                 │
└──────────────────────────────────────────────┘
```

## Input Page

```text
┌──────────────────────────────────────────────┐
│        What's on your mind?                  │
│                                              │
│ ┌──────────────────────────────────────────┐ │
│ │ Tell us what's happening...              │ │
│ └──────────────────────────────────────────┘ │
│                                              │
│  [ Voice ]                       [ Continue ]│
└──────────────────────────────────────────────┘
```

## Goal Clarification

```text
┌──────────────────────────────────────────────┐
│        Let's figure this out.                │
│                                              │
│  AI Question:                                │
│  What do you want to achieve?               │
│                                              │
│ ┌──────────────────────────────────────────┐ │
│ │ Type your answer...                      │ │
│ └──────────────────────────────────────────┘ │
│                                              │
│                    [ Continue ]              │
└──────────────────────────────────────────────┘
```

## Goal

```text
┌──────────────────────────────────────────────┐
│              Your Goal                       │
│                                              │
│  ┌────────────────────────────────────────┐  │
│  │ Your confirmed goal                    │  │
│  └────────────────────────────────────────┘  │
│                                              │
│             [ Confirm Goal ]                │
└──────────────────────────────────────────────┘
```

## Action Plan

```text
┌──────────────────────────────────────────────┐
│              Your Action Plan                │
│                                              │
│  ○ Step 1                                    │
│  ○ Step 2                                    │
│  ○ Step 3                                    │
│  ○ Step 4                                    │
│                                              │
└──────────────────────────────────────────────┘
```

## What Should I Do Next?

```text
┌──────────────────────────────────────────────┐
│          What Should I Do Next?              │
│                                              │
│  ┌────────────────────────────────────────┐  │
│  │ Your next step                         │  │
│  └────────────────────────────────────────┘  │
│                                              │
│              [ Mark as Done ]                │
└──────────────────────────────────────────────┘
```

## Progress

```text
┌──────────────────────────────────────────────┐
│              Your Progress                  │
│                                              │
│  ████████████░░░░░░░░  50%                 │
│                                              │
│  ✓ Step 1                                    │
│  ✓ Step 2                                    │
│  ○ Step 3                                    │
│  ○ Step 4                                    │
└──────────────────────────────────────────────┘
```

---

# 8. Database Schema

NextStep menggunakan **PostgreSQL**.

Database dapat menggunakan:

* Supabase
* Neon

Dan kita memakai Neon untuk database

## Core Relationship

```text
User → Session → Goal → Action Plan → Progress
```

## Tables

### Users

```text
users
├── id
├── email
├── name
└── created_at
```

### Sessions

```text
sessions
├── id
├── user_id
├── input_text
├── input_type
├── ai_context
└── created_at
```

`input_type` hanya menerima:

```text
text
voice
```

### Goals

```text
goals
├── id
├── session_id
├── goal_text
├── status
└── created_at
```

Status goal:

```text
active
completed
archived
```

### Action Plans

```text
action_plans
├── id
├── goal_id
├── title
├── description
├── step_order
├── status
└── created_at
```

Status action plan:

```text
pending
in_progress
completed
```

### Progress

```text
progress
├── id
├── action_plan_id
├── status
└── completed_at
```

Status progress:

```text
pending
completed
```

---

# 9. Design & Visual Direction

## Design Style

NextStep menggunakan gaya:

* Minimal
* Calm
* Modern
* Focused
* Trustworthy

### Design Principle

> **From confusion to clarity.**

UI harus terasa sederhana dan tidak membuat pengguna semakin overwhelmed.

---

# 10. Color Palette

| Role       | Color       | Hex       |
| ---------- | ----------- | --------- |
| Primary    | Deep Indigo | `#4F46E5` |
| Background | Soft White  | `#F8FAFC` |
| Text       | Dark Slate  | `#0F172A` |

---

# 11. Typography

**Primary Font:** Inter

Typography harus:

* Clean
* Modern
* Easy to read
* Memiliki hierarchy yang jelas

---

# 12. UI Direction

### Buttons

* Rounded corners
* Clear labels
* Strong visual hierarchy
* Tidak menggunakan terlalu banyak variasi warna

### Cards

Digunakan untuk informasi penting seperti:

* Goal
* Action Plan
* Next Step
* Progress

### Layout

Gunakan:

* Centered content
* Generous whitespace
* Clear hierarchy
* Minimal visual decoration

---

# 13. Design Rules

Hindari:

* Animasi berlebihan.
* Terlalu banyak warna.
* Informasi terlalu padat.
* Dekorasi yang tidak memiliki fungsi.
* Terlalu banyak tombol dalam satu halaman.

Prioritas visual:

```text
User Context
     ↓
Goal
     ↓
Action Plan
     ↓
Next Step
     ↓
Progress
```

---

# 14. Mandatory Tech Stack

Tech stack NextStep bersifat **WAJIB dan TERKUNCI**.

| Bagian     | Teknologi                         |
| ---------- | --------------------------------- |
| Framework  | Next.js                           |
| UI Library | React                             |
| Language   | TypeScript                        |
| Styling    | Tailwind CSS                      |
| Database   | PostgreSQL via Supabase atau Neon |

### Stack

```text
Next.js
   │
   ├── React
   ├── TypeScript
   ├── Tailwind CSS
   └── PostgreSQL
          ├── Supabase
          └── Neon
```

Tech stack tidak boleh diganti tanpa persetujuan mentor.

---

# 15. Development Principles

Saat mengembangkan NextStep:

1. Ikuti scope MVP yang telah ditentukan.
2. Jangan menambahkan fitur baru tanpa persetujuan.
3. Pertahankan core user flow.
4. Gunakan tech stack wajib.
5. Prioritaskan simplicity dan clarity.
6. Setiap fitur harus memiliki tujuan yang jelas terhadap core experience.

---

# 16. Core Product Philosophy

NextStep bukan bertujuan membuat pengguna melakukan lebih banyak hal.

NextStep membantu pengguna mengetahui:

> **Apa yang sebenarnya saya inginkan?**

Kemudian:

> **Apa yang harus saya lakukan sekarang?**

Core experience:

```text
Confused
   ↓
Understand
   ↓
Clarify
   ↓
Goal
   ↓
Plan
   ↓
Next Step
   ↓
Progress
```

---

# 17. Final Product Statement

> **NextStep helps people turn uncertainty into a clear goal, a practical plan, and the next step they can take.**

**Know what you want. Know what to do.**
