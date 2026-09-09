# NextStep — UI Design System

**Design Direction:** Structured Editorial Minimalism

**Product:** NextStep

**Tagline:** *Know what you want. Know what to do.*

---

# 1. Design Philosophy

NextStep adalah aplikasi untuk membantu pengguna bergerak dari ketidakjelasan menuju tindakan.

UI tidak dirancang seperti dashboard SaaS tradisional.

UI NextStep adalah sebuah **thinking space**.

Informasi tidak hanya ditampilkan.

Informasi disusun untuk membantu pengguna:

```text
UNDERSTAND

↓

DECIDE

↓

MOVE
```

Prinsip utama:

> **Clarity through movement.**

Setiap layar harus membuat pengguna merasa bahwa mereka sedang bergerak maju.

Walaupun hanya satu langkah kecil.

---

# 2. Visual Direction

## Structured

Informasi memiliki struktur yang kuat.

Gunakan:

* Alignment
* Grid
* Dividers
* Numbering
* Typography hierarchy

---

## Editorial

Typography menjadi bagian penting dari visual experience.

Informasi penting dapat menggunakan ukuran besar.

Layout tidak harus selalu simetris.

Whitespace digunakan dengan sengaja.

---

## Minimal

Minimal bukan berarti kosong.

Minimal berarti:

> Tidak ada elemen yang tidak membantu pengguna.

---

## Active

NextStep bukan aplikasi untuk sekadar melihat informasi.

Pengguna datang untuk:

* Memahami sesuatu
* Menentukan tujuan
* Membuat keputusan
* Mengambil langkah

UI harus selalu mengarahkan pengguna menuju tindakan berikutnya.

---

# 3. Core Design Language

Identitas visual NextStep berasal dari tiga elemen:

## Typography

Informasi penting memiliki presence yang kuat.

---

## Steps

Konsep langkah digunakan sebagai bagian dari sistem visual.

```text
01

02

03

04
```

Numbering bukan dekorasi.

Numbering menunjukkan perjalanan.

---

## Structure

Gunakan garis, alignment, spacing, dan grid untuk membangun hierarchy.

Bukan shadow.

Bukan gradient.

Bukan visual effects.

---

# 4. Visual Personality

NextStep harus terasa:

```text
CALM

INTELLIGENT

STRUCTURED

CONFIDENT

HUMAN
```

Bukan:

```text
LOUD

FUTURISTIC

OVERDECORATED

GENERIC

CORPORATE
```

---

# 5. Color System

## Philosophy

Warna digunakan untuk:

* Hierarchy
* Interaction
* Status
* Focus

Warna tidak digunakan untuk dekorasi.

---

## Primary

### Next Blue

```css
--blue-900: #173B6C;
--blue-700: #245EA8;
--blue-600: #2F6DB5;
--blue-100: #DCE8F5;
```

Primary color digunakan secara strategis.

Bukan untuk seluruh interface.

---

## Neutral

### Background

```css
--background: #F1F0EB;
```

Warm neutral.

Tidak pure white.

---

### Surface

```css
--surface: #E7E5DE;
--surface-light: #F7F6F2;
```

Surface digunakan untuk memisahkan area.

---

### Text

```css
--text-primary: #171716;
--text-secondary: #676762;
--text-muted: #969690;
```

---

### Border

```css
--border: #CFCFC7;
--border-strong: #AFAFA8;
```

---

# 6. Accent Philosophy

Sebagian besar layar harus tetap netral.

Accent blue hanya digunakan untuk:

```text
PRIMARY ACTION

ACTIVE STATE

CURRENT STEP

IMPORTANT FOCUS
```

Jika semuanya berwarna biru, tidak ada yang terasa penting.

---

# 7. Typography

Typography adalah salah satu elemen visual utama.

NextStep tidak menggunakan:

* Inter
* Geist
* Space Grotesk

## Primary Font

**Manrope**

Namun gunakan weight dan size dengan karakter kuat.

---

# 8. Typography Scale

## Display

```text
56px

Bold
Tight line-height
```

Digunakan untuk statement penting.

Contoh:

# WHAT ARE YOU

# TRYING TO FIGURE OUT?

---

## Page Title

```text
40px
700
```

---

## Section Title

```text
28px
700
```

---

## Large Content

```text
22px
500
```

---

## Body

```text
16px
400
```

---

## Metadata

```text
13px
600
Uppercase when appropriate
```

Contoh:

```text
CURRENT DIRECTION

NEXT STEP

YOUR PLAN
```

Gunakan uppercase secara terbatas untuk membantu hierarchy.

---

# 9. Typography as Layout

Teks bukan hanya konten.

Teks dapat menjadi struktur visual.

Contoh:

```text
YOUR

NEXT

STEP
```

Atau:

```text
BUILD PRACTICAL
AI APPLICATIONS
```

Gunakan typography besar hanya untuk informasi yang benar-benar penting.

---

# 10. Spacing System

Base unit:

```text
4px
```

Scale:

```css
--space-1: 4px;
--space-2: 8px;
--space-3: 12px;
--space-4: 16px;
--space-5: 20px;
--space-6: 24px;
--space-8: 32px;
--space-10: 40px;
--space-12: 48px;
--space-16: 64px;
--space-20: 80px;
--space-24: 96px;
```

Whitespace adalah bagian dari desain.

Area kosong tidak perlu selalu diisi.

---

# 11. Layout Philosophy

Jangan berpikir:

> Bagaimana saya mengisi halaman ini?

Pikirkan:

> Apa satu hal paling penting di halaman ini?

Kemudian bangun hierarchy berdasarkan jawaban tersebut.

---

# 12. Layout Structure

## Desktop

```text
┌──────────────────────────────────────────────┐
│ NEXTSTEP                              MENU   │
├──────────────────────────────────────────────┤
│                                              │
│                                              │
│            PRIMARY CONTENT                   │
│                                              │
│                                              │
│                                              │
└──────────────────────────────────────────────┘
```

Maximum width:

```css
1200px
```

---

## Reading Content

```css
max-width: 720px;
```

---

# 13. Grid

Gunakan:

```text
12 COLUMN GRID

24px GAP
```

Namun grid tidak harus selalu terlihat.

Grid digunakan untuk menciptakan alignment.

---

# 14. Controlled Asymmetry

NextStep tidak harus selalu simetris.

Contoh:

```text
┌──────────────────────────────────────────┐
│                                          │
│ YOUR                                    │
│ NEXT                                01   │
│ STEP                                    │
│                                          │
├───────────────────────────────┬──────────┤
│                               │          │
│ Learn Python                  │ 30 MIN   │
│                               │          │
└───────────────────────────────┴──────────┘
```

Asymmetry digunakan untuk menciptakan visual interest.

Namun tetap terstruktur.

---

# 15. Border Radius

Radius harus terasa tegas.

```css
--radius-sm: 2px;
--radius-md: 4px;
--radius-lg: 6px;
```

Gunakan:

```text
Buttons
4px

Inputs
4px

Cards
6px

Modal
6px
```

Hindari UI yang terlalu lembut.

---

# 16. Borders

Border adalah salah satu elemen utama dalam sistem visual.

```css
border: 1px solid var(--border);
```

Border digunakan untuk:

* Structure
* Separation
* Inputs
* Interactive areas

---

# 17. Shadows

```css
box-shadow: none;
```

Tidak menggunakan drop shadows.

Visual separation berasal dari:

```text
BORDER

SPACING

ALIGNMENT

SURFACE CONTRAST
```

---

# 18. Dividers

Divider menjadi elemen visual penting.

```css
border-top: 1px solid var(--border);
```

Contoh:

```text
YOUR PLAN

────────────────────────────

01  Python Fundamentals

────────────────────────────

02  Data Analysis

────────────────────────────

03  Machine Learning
```

Divider membantu membangun rhythm.

---

# 19. Step System

Ini adalah identitas utama NextStep.

## Standard Step

```text
01

STEP TITLE

Description
```

---

## Active Step

```text
01

CURRENT

Learn Python Fundamentals
```

---

## Completed

```text
01

COMPLETED

Python Fundamentals
```

Status tidak bergantung hanya pada warna.

Gunakan kombinasi:

* Number
* Label
* Typography
* Position

---

# 20. Step Marker

Gunakan step marker sebagai recurring visual element.

Contoh:

```text
01 / 08
```

atau:

```text
STEP 01
```

atau:

```text
01
────
```

Gunakan secara konsisten.

Ini menjadi bagian dari brand language NextStep.

---

# 21. Buttons

## Primary Button

```text
[ START NEXT STEP ]
```

Style:

```css
height: 44px;
padding: 0 20px;
border-radius: 4px;
```

Primary button memiliki visual presence yang kuat.

---

## Secondary Button

```text
[ EDIT GOAL ]
```

Border:

```text
1px solid
```

Background:

```text
Transparent
```

---

## Text Action

```text
View full plan
```

Digunakan untuk action dengan prioritas rendah.

---

# 22. Button Rules

Label harus jelas.

Gunakan:

```text
START STEP

CONTINUE

SAVE GOAL

CREATE PLAN
```

Jangan gunakan:

```text
CLICK HERE

SUBMIT

OK
```

jika action dapat dijelaskan dengan lebih spesifik.

---

# 23. No Decorative Motion

Hover state tidak menggunakan animasi dekoratif.

Gunakan perubahan sederhana:

```text
COLOR

BORDER

OPACITY
```

Tidak:

```text
FLOAT

BOUNCE

SCALE

GLOW
```

---

# 24. Inputs

Input harus terasa seperti area untuk berpikir.

## Standard Input

```css
height: 48px;
border: 1px solid var(--border);
border-radius: 4px;
```

---

# 25. Main Thinking Input

Untuk experience utama NextStep, gunakan input yang lebih besar.

Contoh:

```text
WHAT'S ON YOUR MIND?


I'm not sure what I should focus on
right now.


                                    CONTINUE
```

Textarea menjadi bagian penting dari experience.

---

# 26. Input Philosophy

Input bukan sekadar form field.

Untuk NextStep:

> Input adalah titik awal pemikiran pengguna.

Berikan ruang.

Jangan membuatnya kecil dan terasa administratif.

---

# 27. Cards

Cards bukan elemen utama.

Gunakan card hanya jika:

* Informasi membutuhkan grouping
* Action membutuhkan boundary
* Surface perlu dipisahkan

Default card:

```css
background: var(--surface);
border: 1px solid var(--border);
border-radius: 6px;
padding: 24px;
box-shadow: none;
```

---

# 28. Information Blocks

Sebagian besar informasi tidak memerlukan card.

Contoh:

```text
CURRENT GOAL


Build practical AI applications.
```

Kemudian divider.

```text
WHY THIS MATTERS

You want to understand AI deeply enough
to build useful products.
```

Ini membuat interface terasa lebih editorial.

---

# 29. Next Step Hero

Komponen paling penting.

Next Step tidak boleh terlihat seperti widget biasa.

## Structure

```text
NEXT STEP                           01


Understand how variables
and functions work.


30 MINUTES


────────────────────────────────────


[ START THIS STEP ]
```

Komponen ini memiliki:

* Banyak whitespace
* Typography besar
* Step number
* Action yang jelas

---

# 30. Goal Section

```text
YOUR DIRECTION


Build practical AI applications
with confidence.


WHY?

You want to move beyond tutorials
and start building real things.


EDIT GOAL
```

Tidak perlu dibungkus dalam card.

---

# 31. Action Plan

Gunakan vertical progression.

```text
YOUR PLAN


01

Python Fundamentals

COMPLETED


────────────────────────


02

Data Analysis

CURRENT


────────────────────────


03

Machine Learning

UP NEXT
```

---

# 32. Progress

Jangan selalu menggunakan progress bar.

Gunakan angka.

Contoh:

# 03 / 08

**Steps completed**

Atau:

```text
PROGRESS


03
────
08


STEPS COMPLETE
```

Angka besar menciptakan visual interest.

---

# 33. Home Screen Composition

Contoh struktur:

```text
NEXTSTEP


GOOD MORNING.


What would you like
to move forward on today?


────────────────────────────


YOUR DIRECTION


Build practical AI applications.


────────────────────────────


NEXT


01

Learn Python variables
and functions.


30 MINUTES


[ START STEP ]


────────────────────────────


03 / 08

STEPS COMPLETE
```

Halaman terasa seperti satu komposisi.

Bukan kumpulan widget.

---

# 34. AI Experience

AI harus terasa tenang.

Bukan chatbot generik.

## Flow

```text
YOUR CONTEXT

↓

AI UNDERSTANDING

↓

CLARIFY

↓

DEFINE GOAL

↓

CREATE PLAN
```

---

# 35. AI Response

AI response harus memiliki struktur.

Contoh:

```text
I understand.

You want to learn AI, but the number
of possible topics makes it difficult
to know where to begin.


ONE QUESTION


What would you eventually like
to build?
```

Pertanyaan penting diberi ruang visual.

---

# 36. Conversation Layout

Jangan hanya:

```text
[ User Bubble ]

[ AI Bubble ]

[ User Bubble ]

[ AI Bubble ]
```

Gunakan narrative conversation.

Contoh:

```text
YOU SAID

I want to learn AI.


NEXTSTEP UNDERSTANDS

You're interested in building things,
not only learning theory.


QUESTION 01

What kind of things would you like
to create?
```

Ini lebih sesuai dengan identitas produk.

---

# 37. Real Product Demonstration

Landing page harus menunjukkan produk.

Bukan sekadar menjelaskan fitur.

## Example

```text
YOU

I don't know what I should
focus on right now.


NEXTSTEP

Let's start there.

What are the things you've been
thinking about recently?


YOU

AI, programming, and building apps.


NEXTSTEP

I see a possible direction.


YOUR GOAL

Build practical AI applications.


NEXT STEP

Learn Python fundamentals.
```

---

# 38. Landing Page Composition

## Navigation

```text
NEXTSTEP

How It Works
Privacy

START
```

---

## Hero

```text
YOU DON'T NEED
THE WHOLE PLAN.


YOU JUST NEED TO KNOW

WHAT TO DO NEXT.


[ START HERE ]
```

Large typography menjadi visual hero.

---

## Product Demo

Tampilkan experience nyata.

Bukan feature cards.

---

## How It Works

Gunakan step sequence.

```text
01

TELL US
WHAT'S GOING ON


02

FIND
YOUR DIRECTION


03

TAKE
THE NEXT STEP
```

---

# 39. Visual Interest Rules

UI menjadi menarik melalui:

## Scale Contrast

```text
SMALL LABEL

VERY LARGE IDEA
```

---

## Spatial Contrast

```text
Dense information

↓

Large whitespace
```

---

## Typography Contrast

```text
Small metadata

↓

Large statement

↓

Normal explanation
```

---

## Structural Contrast

```text
Open section

↓

Strong divider

↓

Focused action
```

---

# 40. Do Not Use

NextStep tidak menggunakan:

* Harsh gradients
* Lucide icon aesthetic
* Pure white background
* Rainbow coloring
* Drop shadows
* Three feature cards in a row
* Emojis dalam UI
* Liquid glass
* Em dashes
* Inter
* Geist
* Space Grotesk
* Colored left stripes
* Fake testimonials
* Bento grids
* Terminal windows
* "It's not X, it's Y" copywriting
* Checkmark bullet decorations
* Three generic pricing tiers
* Fake product demos
* Oversized soft corner radius
* Purple and black aesthetic
* Skeleton loaders
* Radial orbs
* Dot grids
* Sparkle icons
* Animated arrows
* Missing Terms of Service
* Missing Privacy Policy
* Decorative hover animations
* Neon colors
* Basic pastel palettes

---

# 41. The NextStep Test

Sebelum sebuah elemen ditambahkan, tanyakan:

```text
DOES IT CREATE CLARITY?

DOES IT HELP MOVEMENT?

DOES IT HAVE A PURPOSE?
```

Jika tidak, jangan tambahkan.

---

# 42. Final Design Formula

NextStep menggunakan:

```text
STRONG TYPOGRAPHY

+

STRUCTURED LAYOUT

+

STEP-BASED IDENTITY

+

INTENTIONAL WHITESPACE

+

REAL PRODUCT INTERACTION
```

Bukan:

```text
MORE CARDS

+

MORE COLORS

+

MORE ANIMATIONS

+

MORE EFFECTS
```

---

# Final Statement

> **NextStep should feel like a place where your thoughts become direction.**

Pengguna datang dengan situasi yang mungkin berantakan.

NextStep membantu menyusun situasi tersebut.

Kemudian menunjukkan:

```text
THIS IS WHERE YOU ARE.


THIS IS WHERE YOU WANT TO GO.


THIS IS WHAT YOU DO NEXT.
```

**One step at a time.**
