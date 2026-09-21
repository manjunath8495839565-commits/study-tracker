# 🎯 GATE Command Center 2028 — Ultimate CS + DA Dual Stream Preparation & Target Tracker

[![Live Demo](https://img.shields.io/badge/Live%20Demo-GitHub%20Pages-success?style=for-the-badge&logo=github)](https://manjunath8495839565-commits.github.io/study-tracker/)
[![PWA Ready](https://img.shields.io/badge/PWA-Mobile%20App%20Ready-583323?style=for-the-badge&logo=pwa)](https://manjunath8495839565-commits.github.io/study-tracker/)
[![React](https://img.shields.io/badge/React-19.2-blue?style=for-the-badge&logo=react)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-Warm_Brown_Theme-a3643b?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)

An interactive, full-featured web and mobile Progressive Web Application (PWA) engineered for engineering students targeting **GATE 2028 (Computer Science + Data Science & AI Dual Stream)**.

🔗 **Live Web & Mobile App:** [https://manjunath8495839565-commits.github.io/study-tracker/](https://manjunath8495839565-commits.github.io/study-tracker/)

---

## 🌟 Key Highlights

### 📱 1. Mobile App (PWA) — No App Store Needed!
- **Standalone Mobile Experience:** Install directly on Android or iPhone home screens without Google Play Store or Apple App Store.
- **Offline Capable:** Powered by Service Workers (`sw.js`) for instant loading even without internet.
- **Auto-Hide Install Buttons:** Smart standalone detection (`display-mode: standalone`) hides install prompts when running inside the installed app.

### 🔔 2. 5:00 PM Daily Push Notifications & SMS Alerts
- **Automatic Evening Notification:** Sends native mobile lock-screen alerts at 5:00 PM summarizing today's incomplete priority focus tasks.
- **1-Tap SMS Reminder:** Generates pre-formatted mobile SMS messages (`sms:?body=...`) to send task alerts directly to yourself or a study partner.

### 📱 3. Two-Screen Flow Architecture
- **Screen 1 — Landing / Welcome Screen:** Clean landing dashboard with real-time live clock, target exam countdown (Feb 2028), 4 main stat cards, overall progress percentage, and **START PREPARATION** CTA.
- **Screen 2 — Main Preparation Dashboard:** Full command center with action buttons, custom filter tabs, syllabus breakdown, velocity calculator, and weak topics analytics.

### 🎨 4. Tailored Warm Brown & Espresso Palette
- Custom visual design using HSL warm brown (`#583323`), espresso (`#2d180f`), off-white (`#faf6f0`), and warm amber accents (`#e8a33d`) across all components.

---

## 🔥 Features & Functional Modules

### 📚 1. Comprehensive Syllabus Breakdown (CS + DA Streams)
- **Full Coverage:** 12 Core CS subjects + 8 Data Science & AI subjects + General Aptitude & Mathematics.
- **Sequential Daily Focus:** Auto-selects ongoing subject topics based on real-time dates rather than random picks.
- **Sub-task Checklists:** Theory reading, derivations, practice sets, PYQs, and speed drills.

### ⏱️ 2. Minimum Required Study Hours & PYQ Benchmarks
- Benchmark time allocations based on topic complexity (`Small`: 4h, `Medium`: 10h, `Large`: 20h).
- Progress tracking against minimum recommended study hours.

### ⚡ 3. Velocity & Pace Calculator
- Custom pace slider to calculate projected completion dates and schedule status (`Ahead` / `Behind`).

### 📊 4. Weak Topics & Revision Analytics
- Auto-flags topics with <60% accuracy for priority revision drills.
- Revision streak tracker and formulas checklist.

### 💾 5. Data Persistence & Cloud Sync
- **Local Storage Auto-Save:** Instant browser storage synchronization.
- **Google Sheets Webhook Sync:** Background sync to custom Google Apps Script web endpoints.
- **CSV Export:** One-click spreadsheet download of all metrics.

---

## 📱 Mobile App Installation Guide

### 🤖 Android (Chrome / Edge / Samsung Internet / Brave)
1. Open [https://manjunath8495839565-commits.github.io/study-tracker/](https://manjunath8495839565-commits.github.io/study-tracker/) in Chrome.
2. Tap **"📲 Install App on Phone"** at the top or tap Chrome menu **(⋮)** ➔ **Install App** / **Add to Home Screen**.
3. Tap **Install**. The **GATE 2028** app icon will appear on your phone home screen!

### 🍎 iPhone / iPad (iOS Safari)
1. Open [https://manjunath8495839565-commits.github.io/study-tracker/](https://manjunath8495839565-commits.github.io/study-tracker/) in **Safari**.
2. Tap the **Share button (📤)** in Safari's bottom navigation bar.
3. Scroll down and tap **"Add to Home Screen" (➕)**.
4. Tap **Add**. Launches as a full-screen mobile app!

---

## 🚀 Local Development & Setup

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- `npm`

### Steps
1. **Clone the repository:**
   ```bash
   git clone https://github.com/manjunath8495839565-commits/study-tracker.git
   cd "study tracker"
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start local dev server:**
   ```bash
   npm run dev
   ```

4. **Build production bundle:**
   ```bash
   npm run build
   ```

5. **Deploy to GitHub Pages:**
   ```bash
   npm run deploy
   ```

---

## 🛠 Tech Stack

- **Framework:** React 19 + Vite
- **Styling:** Tailwind CSS + Vanilla CSS Tokens
- **Icons:** Lucide React
- **PWA Specs:** Service Worker (`sw.js`), Web Manifest (`manifest.json`), Web Notifications API
- **Animations:** Canvas Confetti
- **Deployment:** GitHub Pages (`gh-pages`)

---

## 📄 License

MIT License — Free to use for all GATE aspirants! Keep pushing for **GATE 2028**! 🎯🏆
