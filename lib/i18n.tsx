"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export type Language = "en" | "id";

export const translations = {
  en: {
    nav: {
      logo: "NextStep",
      howItWorks: "How It Works",
      privacy: "Privacy",
      terms: "Terms",
      start: "Start",
      startHere: "Start Here",
      plan: "Plan",
      progress: "Progress",
    },
    landing: {
      tagline: "From confusion to clarity",
      heroTitle:
        "You don't need the whole plan. You just need to know what to do next.",
      demoUser1: "I don't know what I should focus on right now.",
      demoNextstep1:
        "Let's start there. What are the things you've been thinking about recently?",
      demoUser2: "AI, programming, and building apps.",
      demoNextstep2: "I see a possible direction.",
      demoYourGoal: "Your Goal",
      demoGoalValue: "Build practical AI applications.",
      demoNextStep: "Next Step",
      demoStepValue: "Learn Python fundamentals.",
      howItWorksTitle: "How it works",
      step1Title: "Tell us what's going on",
      step1Desc: "Share the situation in your own words.",
      step2Title: "Find your direction",
      step2Desc: "We help you turn the mess into a clear goal.",
      step3Title: "Take the next step",
      step3Desc: "A single, clear action you can start now.",
      ctaTitle: "Feeling stuck? Start with one sentence.",
      ctaDesc:
        "NextStep turns what's on your mind into a clear goal and a single next step you can take.",
    },
    start: {
      back: "Back",
      title: "What's on your mind?",
      subtitle:
        "Tell us what's happening, what you want, or what's confusing you. You can type or speak.",
      label: "Your words",
      placeholder: "I'm not sure what to focus on right now...",
      loadingText: "Understanding your situation...",
      continueButton: "Continue",
      analyzingButton: "Analyzing...",
    },
    understanding: {
      stage0: "Understanding your situation...",
      stage1: "Finding possible directions...",
      stage2: "Clarifying your goal...",
    },
    goal: {
      direction: "Your Direction",
      answerLabel: "Your answer",
      answerPlaceholder: "Type your answer here...",
      clarifyingLoading: "Understanding your answer...",
      isRightDirection: "Is this the right direction?",
      editGoalLabel: "Edit your goal",
      editGoalButton: "Edit Goal",
      confirmGoalButton: "Confirm Goal",
      buildingPlanLoading: "Building your plan...",
    },
    plan: {
      title: "Your Plan",
      goalLabel: "Goal",
      statusCompleted: "Completed",
      statusCurrent: "Current",
      statusUpNext: "Up next",
      preparingPlan:
        "Your plan is being prepared. Head back to confirm your goal to generate it.",
      startNextStep: "Start Next Step",
      viewProgress: "View Progress",
    },
    next: {
      title: "Next Step",
      step: "Step",
      findingNextStep: "Finding your next step...",
      couldNotFind: "We couldn't find your next step.",
      allDoneTitle: "All steps are complete.",
      allDoneDesc:
        "You moved from confusion to action, one step at a time. This goal is complete.",
      minutes: "minutes",
      markAsDone: "Mark as Done",
      updatingPlan: "Updating your plan...",
      tryAgain: "Try again",
      completedHint:
        "Completed it? Mark it done and we will point you to the next step.",
      seeProgress: "See your progress",
      startNewSession: "Start a new session",
    },
    progress: {
      title: "Progress",
      stepsComplete: "Steps complete",
      goalComplete: "Goal complete.",
      readyNextDirection:
        "Every step is done. Ready for the next direction?",
      statusDone: "Done",
      statusCurrent: "Current",
      statusUpNext: "Up next",
      markDoneBtn: "Mark done",
      continueNextStep: "Continue to next step",
      viewPlan: "View plan",
    },
    voice: {
      speak: "Speak",
      stop: "Stop",
      transcribing: "Transcribing...",
      transcribingAudio: "Transcribing audio with AI...",
      recordingHint: "Recording... Speak naturally, then tap Stop.",
      listeningHint: "Listening... Start speaking (Live Writing active).",
      idleHint: "Tap Speak to write with your voice in real time.",
      languageLabel: "Language",
      notSupported:
        "Voice input is not available here. Use Chrome, Edge, or Safari with microphone permission.",
    },
    demo: {
      title: "Mentor demo guide",
      exit: "Exit demo",
      showTour: "Show the mentor demo tour",
      hideTour: "Hide demo tour",
      landing:
        "Welcome to the NextStep demo. Start by clicking 'Start Here' and telling NextStep what's on your mind.",
      start:
        "This is where you share what's on your mind. Type your situation, tap 'Speak' to talk, or pick an example below. Then press Continue.",
      goal:
        "If your goal isn't clear yet, NextStep asks one question. Answer it, and when the direction looks right, press Confirm Goal.",
      plan: "Your action plan: 3-5 clear steps in order. Start with the first one.",
      next: "One exact next step to do right now. Done it? Press Mark as Done and NextStep moves you forward.",
      progress:
        "Your progress so far. Mark steps done to advance. All steps done = goal complete.",
      default: "You're in demo mode. Explore the flow: Start, Plan, Next step, Progress.",
      examplesTitle: "Not sure what to write? Tap an example",
      examples: [
        "I finally have time to learn programming, but I don't know where to start.",
        "I want to open an online shop, but I'm torn between too many product ideas.",
        "I'm looking for a new job but I'm confused about which direction fits me.",
        "I want to build a portfolio website but I don't know how to begin.",
      ],
    },
  },
  id: {
    nav: {
      logo: "NextStep",
      howItWorks: "Cara Kerja",
      privacy: "Privasi",
      terms: "Ketentuan",
      start: "Mulai",
      startHere: "Mulai di Sini",
      plan: "Rencana",
      progress: "Kemajuan",
    },
    landing: {
      tagline: "Dari kebingungan menuju kejelasan",
      heroTitle:
        "Anda tidak butuh seluruh rencana. Anda hanya perlu tahu apa yang harus dilakukan selanjutnya.",
      demoUser1: "Saya tidak tahu apa yang harus saya fokuskan saat ini.",
      demoNextstep1:
        "Mari kita mulai dari sana. Hal apa saja yang sedang Anda pikirkan belakangan ini?",
      demoUser2: "AI, pemrograman, dan membuat aplikasi.",
      demoNextstep2: "Saya melihat arah yang memungkinkan.",
      demoYourGoal: "Tujuan Anda",
      demoGoalValue: "Membuat aplikasi AI praktis.",
      demoNextStep: "Langkah Selanjutnya",
      demoStepValue: "Pelajari dasar-dasar Python.",
      howItWorksTitle: "Cara kerja",
      step1Title: "Ceritakan apa yang terjadi",
      step1Desc: "Bagikan situasi Anda dengan kata-kata Anda sendiri.",
      step2Title: "Temukan arah Anda",
      step2Desc:
        "Kami membantu Anda mengubah kebingungan menjadi tujuan yang jelas.",
      step3Title: "Ambil langkah selanjutnya",
      step3Desc: "Satu tindakan jelas yang dapat Anda mulai sekarang.",
      ctaTitle: "Merasa jalan di tempat? Mulai dengan satu kalimat.",
      ctaDesc:
        "NextStep mengubah apa yang ada di pikiran Anda menjadi tujuan yang jelas dan satu langkah selanjutnya yang dapat Anda ambil.",
    },
    start: {
      back: "Kembali",
      title: "Apa yang sedang ada di pikiran Anda?",
      subtitle:
        "Ceritakan apa yang terjadi, apa yang Anda inginkan, atau apa yang membingungkan Anda. Anda dapat mengetik atau berbicara.",
      label: "Kata-kata Anda",
      placeholder: "Saya tidak yakin apa yang harus difokuskan sekarang...",
      loadingText: "Memahami situasi Anda...",
      continueButton: "Lanjutkan",
      analyzingButton: "Menganalisis...",
    },
    understanding: {
      stage0: "Memahami situasi Anda...",
      stage1: "Mencari arah yang memungkinkan...",
      stage2: "Memperjelas tujuan Anda...",
    },
    goal: {
      direction: "Arah Anda",
      answerLabel: "Jawaban Anda",
      answerPlaceholder: "Ketik jawaban Anda di sini...",
      clarifyingLoading: "Memahami jawaban Anda...",
      isRightDirection: "Apakah ini arah yang tepat?",
      editGoalLabel: "Edit tujuan Anda",
      editGoalButton: "Edit Tujuan",
      confirmGoalButton: "Konfirmasi Tujuan",
      buildingPlanLoading: "Menyusun rencana Anda...",
    },
    plan: {
      title: "Rencana Anda",
      goalLabel: "Tujuan",
      statusCompleted: "Selesai",
      statusCurrent: "Saat Ini",
      statusUpNext: "Selanjutnya",
      preparingPlan:
        "Rencana Anda sedang disiapkan. Kembali untuk mengonfirmasi tujuan Anda untuk membuatnya.",
      startNextStep: "Mulai Langkah Selanjutnya",
      viewProgress: "Lihat Kemajuan",
    },
    next: {
      title: "Langkah Selanjutnya",
      step: "Langkah",
      findingNextStep: "Mencari langkah selanjutnya...",
      couldNotFind: "Kami tidak dapat menemukan langkah Anda selanjutnya.",
      allDoneTitle: "Semua langkah telah selesai.",
      allDoneDesc:
        "Anda telah bergerak dari kebingungan menjadi tindakan, satu per satu langkah. Tujuan ini telah selesai.",
      minutes: "menit",
      markAsDone: "Tandai Selesai",
      updatingPlan: "Memperbarui rencana...",
      tryAgain: "Coba lagi",
      completedHint:
        "Sudah selesai? Tandai selesai dan kami akan mengarahkan Anda ke langkah berikutnya.",
      seeProgress: "Lihat kemajuan Anda",
      startNewSession: "Mulai sesi baru",
    },
    progress: {
      title: "Kemajuan",
      stepsComplete: "Langkah selesai",
      goalComplete: "Tujuan selesai.",
      readyNextDirection:
        "Setiap langkah telah selesai. Siap untuk arah berikutnya?",
      statusDone: "Selesai",
      statusCurrent: "Saat Ini",
      statusUpNext: "Selanjutnya",
      markDoneBtn: "Tandai selesai",
      continueNextStep: "Lanjutkan ke langkah selanjutnya",
      viewPlan: "Lihat rencana",
    },
    voice: {
      speak: "Bicara",
      stop: "Berhenti",
      transcribing: "Transkripsi...",
      transcribingAudio: "Mentranskripsi suara dengan AI...",
      recordingHint: "Merekam... Bicaralah secara alami, lalu tekan Berhenti.",
      listeningHint: "Mendengar... Mulai bicara (Live Writing aktif).",
      idleHint:
        "Tekan Bicara untuk menulis dengan suara Anda secara langsung.",
      languageLabel: "Bahasa",
      notSupported:
        "Input suara tidak tersedia di sini. Gunakan Chrome, Edge, atau Safari dengan izin mikrofon.",
    },
    demo: {
      title: "Panduan demo untuk mentor",
      exit: "Keluar dari demo",
      showTour: "Tampilkan tur demo mentor",
      hideTour: "Sembunyikan tur demo",
      landing:
        "Selamat datang di demo NextStep. Mulai dengan menekan 'Mulai di Sini' dan ceritakan apa yang ada di pikiran Anda.",
      start:
        "Di sini Anda bercerita. Ketik situasi Anda, tekan 'Bicara' untuk berbicara, atau pilih contoh di bawah. Lalu tekan Lanjutkan.",
      goal:
        "Jika tujuan belum jelas, NextStep menanyakan satu pertanyaan. Jawab, dan saat arahnya tepat tekan Konfirmasi Tujuan.",
      plan: "Rencana aksi Anda: 3-5 langkah yang jelas dan berurutan. Mulailah dengan langkah pertama.",
      next: "Satu langkah tepat yang harus dilakukan sekarang. Sudah selesai? Tekan Tandai Selesai untuk maju ke depan.",
      progress:
        "Ini kemajuan Anda. Tandai langkah selesai untuk maju. Semua selesai = tujuan tercapai.",
      default:
        "Anda berada dalam mode demo. Jelajahi jalur: Mulai, Rencana, Langkah selanjutnya, Kemajuan.",
      examplesTitle: "Tidak yakin mau menulis apa? Pilih salah satu contoh",
      examples: [
        "Akhirnya saya punya waktu untuk belajar programming, tapi bingung harus mulai dari mana.",
        "Saya ingin membuka toko online, tapi bingung memilih di antara terlalu banyak ide produk.",
        "Saya sedang mencari pekerjaan baru tapi bingung arah mana yang cocok untuk saya.",
        "Saya ingin membuat website portofolio tapi tidak tahu harus mulai dari mana.",
      ],
    },
  },
};

type LanguageContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: typeof translations.en;
};

const LanguageContext = createContext<LanguageContextType>({
  language: "en",
  setLanguage: () => {},
  t: translations.en,
});

const STORAGE_KEY = "nextstep-language";

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");

  useEffect(() => {
    let next: Language | null = null;
    try {
      const saved = localStorage.getItem(STORAGE_KEY) as Language | null;
      if (saved === "en" || saved === "id") {
        next = saved;
      } else {
        const navLang = navigator.language.toLowerCase();
        if (navLang.startsWith("id")) {
          next = "id";
        }
      }
    } catch {
      // Fallback default is 'en'
    }
    if (next) queueMicrotask(() => setLanguageState(next));
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      // ignore
    }
  };

  const t = translations[language];

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useTranslation() {
  return useContext(LanguageContext);
}
