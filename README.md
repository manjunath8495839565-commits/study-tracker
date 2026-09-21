# 🎓 GATE 2028 Interactive Study Tracker & Timeline Optimizer

An interactive web application for tracking, analyzing, and optimizing GATE 2028 preparation across Computer Science (CS) and Data Science & AI (DA) streams.

---

## 🔥 Features & Capabilities

### 📚 Complete Syllabus Module Breakdown
- **Full GATE Syllabus Integration**: Covers 12 GATE CS subjects & 8 GATE DA subjects with granular topic breakdowns.
- **Auto-Generated Task Checkboxes**: Generates custom task workflows based on topic complexity (`small`, `medium`, `large`):
  - Theory Reading & Core Concepts
  - Concept Derivations & Notes
  - Standard Practice Sets
  - Comprehensive GATE Past Year Questions (PYQs)
  - Timed Test & Speed Drills
- **Subject Master Milestones**: Formula sheet creation, comprehensive subject revision, and mini mock tests.

### ⏱️ Search-Based Minimum Required Study Time
- **Research-Backed Minimum Time Benchmarks**:
  - `Small Topic`: **4 Hours minimum** (1.5h theory + 2.5h practice/PYQs)
  - `Medium Topic`: **10 Hours minimum** (3h theory + 2h derivations + 3h practice + 2h PYQs)
  - `Large Topic`: **20 Hours minimum** (5h comprehensive theory + 3h proofs + 6h practice sets + 3h PYQs + 3h speed drill)
- **Live Minimum Time Progress Bar**: Displays logged study hours vs. minimum benchmark requirement with visual completion badges (`Logged: X.Xh / YYh`).
- **Editable Custom Minimum Targets**: Adjust target minimum study hours per topic to match personal preparation intensity.

### 🎯 Best Exam Target Date & Schedule Planner
- **Optimal Completion Target Date**: Dynamically calculates the best finish deadline for each topic leading up to the GATE Exam Date (`Feb 2028` / `Dec 31, 2027` target completion).
- **Exam Countdown**: Live day countdown until GATE Exam.
- **Recommended Daily Pace**: Displays recommended daily study allocation (e.g. `1.5 - 2.0 h/day`).

### ⚡ Velocity Calculator & Progress Analytics
- **Pace Calculator**: Input daily task capacity to calculate projected completion date and schedule status (`Ahead` / `Behind`).
- **Weak Topic Analytics**: Auto-flags topics with <60% accuracy for priority revision drills.
- **Streak & Today's Focus Panel**: Daily task drawer with streak counter and customizable focus tasks.

### 💾 Storage & Data Export
- **Auto LocalStorage Persistence**: Automatically saves all progress in real time.
- **Google Sheets Sync**: Option to link a Google Apps Script web app endpoint for cloud backup.
- **One-Click CSV Export**: Download complete syllabus metrics in spreadsheet format.

---

## 🚀 Quick Start Guide

### Prerequisites
- [Node.js](https://nodejs.org/) (v16 or higher)
- `npm` (comes with Node.js)

### Installation & Running Locally

1. **Clone the repository**:
   ```bash
   git clone <repo-url>
   cd "study tracker"
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the interactive development server**:
   ```bash
   npm run dev
   ```
   Or double-click `start.command` on macOS to launch the app directly in your browser.

4. **Build for production**:
   ```bash
   npm run build
   ```

---

## 🛠 Tech Stack

- **Frontend**: React (Vite)
- **Styling**: Tailwind CSS / Custom CSS Design Tokens
- **Icons**: Lucide React
- **Animations**: Canvas Confetti
- **Storage**: Browser LocalStorage & Google Sheets Webhook Sync
