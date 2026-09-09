# NextStep — Wireframe

**Product:** NextStep
**Tagline:** *Know what you want. Know what to do.*

---

## 1. Landing Page

```text
┌──────────────────────────────────────────────┐
│ NextStep                              [Logo] │
│                                              │
│        Know what you want.                  │
│        Know what to do.                     │
│                                              │
│  Turn your thoughts into a clear next step. │
│                                              │
│             [ Get Started ]                 │
│                                              │
└──────────────────────────────────────────────┘
```

### Elements

* Logo / Product Name
* Tagline
* Short product description
* Get Started button

---

## 2. Tell What's on Your Mind

```text
┌──────────────────────────────────────────────┐
│ ← NextStep                                   │
│                                              │
│        What's on your mind?                  │
│                                              │
│  Tell us what's happening, what you want,    │
│  or what's confusing you.                    │
│                                              │
│ ┌──────────────────────────────────────────┐ │
│ │ I'm confused about...                    │ │
│ │                                          │ │
│ │                                          │ │
│ └──────────────────────────────────────────┘ │
│                                              │
│  [ 🎙 Voice ]                    [ Continue ]│
│                                              │
└──────────────────────────────────────────────┘
```

### Elements

* Text input
* Voice input
* Continue button

---

## 3. AI Understanding

```text
┌──────────────────────────────────────────────┐
│                                              │
│              Understanding...               │
│                                              │
│       AI is trying to understand             │
│       your situation.                        │
│                                              │
│                 ● ● ●                        │
│                                              │
└──────────────────────────────────────────────┘
```

Setelah proses selesai, pengguna diarahkan ke proses goal clarification.

---

## 4. Goal Clarification

### Jika Goal Belum Jelas

```text
┌──────────────────────────────────────────────┐
│ ← Back                                       │
│                                              │
│        Let's figure this out.                │
│                                              │
│  AI Question:                                │
│  What area do you feel most interested       │
│  in exploring right now?                     │
│                                              │
│ ┌──────────────────────────────────────────┐ │
│ │ Type your answer...                      │ │
│ └──────────────────────────────────────────┘ │
│                                              │
│                    [ Continue ]              │
│                                              │
└──────────────────────────────────────────────┘
```

Pengguna menjawab pertanyaan sampai tujuan menjadi lebih jelas.

---

## 5. Goal Confirmation

```text
┌──────────────────────────────────────────────┐
│                                              │
│              Your Goal                       │
│                                              │
│  Based on what you've shared, your goal is:  │
│                                              │
│  ┌────────────────────────────────────────┐  │
│  │ Learn AI and Machine Learning          │  │
│  └────────────────────────────────────────┘  │
│                                              │
│          [ Confirm Goal ]                    │
│                                              │
└──────────────────────────────────────────────┘
```

Pengguna mengonfirmasi goal yang telah dirumuskan oleh AI.

---

## 6. Action Plan

```text
┌──────────────────────────────────────────────┐
│ ← Back                                       │
│                                              │
│              Your Action Plan                │
│                                              │
│  Goal: Learn AI and Machine Learning         │
│                                              │
│  ○ 1. Learn Python fundamentals              │
│                                              │
│  ○ 2. Learn basic mathematics                │
│                                              │
│  ○ 3. Learn machine learning concepts        │
│                                              │
│  ○ 4. Build a simple ML project              │
│                                              │
│                 [ Continue ]                 │
│                                              │
└──────────────────────────────────────────────┘
```

---

## 7. What Should I Do Next?

```text
┌──────────────────────────────────────────────┐
│                                              │
│          What Should I Do Next?              │
│                                              │
│  Your next step is:                          │
│                                              │
│  ┌────────────────────────────────────────┐  │
│  │ Learn Python fundamentals for          │  │
│  │ 30 minutes.                            │  │
│  └────────────────────────────────────────┘  │
│                                              │
│              [ Mark as Done ]                │
│                                              │
└──────────────────────────────────────────────┘
```

Fokus utama halaman ini adalah memberikan **satu langkah konkret** yang dapat dilakukan pengguna selanjutnya.

---

## 8. Progress Tracking

```text
┌──────────────────────────────────────────────┐
│ ← NextStep                                   │
│                                              │
│              Your Progress                   │
│                                              │
│  Learn AI and Machine Learning               │
│                                              │
│  ████████████░░░░░░░░  50%                  │
│                                              │
│  ✓ Learn Python fundamentals                 │
│  ✓ Learn basic mathematics                   │
│  ○ Learn machine learning concepts           │
│  ○ Build a simple ML project                 │
│                                              │
└──────────────────────────────────────────────┘
```

Progress ditampilkan berdasarkan langkah dalam action plan yang telah diselesaikan pengguna.

---

# 9. Complete Wireframe Flow

```text
Landing Page
     │
     ▼
Tell What's on Your Mind
     │
     ▼
Text / Voice Input
     │
     ▼
AI Understanding
     │
     ▼
Goal Clarification
     │
     ├── Goal belum jelas
     │       │
     │       ▼
     │   AI Questions
     │       │
     │       ▼
     │   User Answers
     │       │
     │       └──────────────┐
     │                      │
     └── Goal sudah jelas   │
            │              │
            ▼              │
       Goal Confirmation ◄─┘
            │
            ▼
       Action Plan
            │
            ▼
   What Should I Do Next?
            │
            ▼
    Progress Tracking
```

## 10. Wireframe Principle

Wireframe NextStep dibuat dengan prinsip:

* **Simple** — pengguna tidak dibebani banyak elemen.
* **Focused** — setiap halaman memiliki satu tujuan utama.
* **Clear** — pengguna selalu mengetahui posisi dan langkah berikutnya.
* **Goal-oriented** — seluruh flow mengarah dari kebingungan menuju tindakan konkret.

**Core experience:**

> Confused → Understand → Clarify → Goal → Plan → Next Step → Progress
