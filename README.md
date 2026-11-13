# ParikshaBank: Indian Banking Competitive Examination Platform
> **Enterprise-Grade Online Examination & Analytics Engine for SBI, IBPS, RBI, and NABARD Aspirants**

Inspired by the authentic **TCS iON / IBPS** examination interface, ParikshaBank is a full-stack, production-ready competitive examination and learning platform engineered specifically for Indian banking recruitments.

---

## 🏛️ 1. Supported Examination Categories

The platform provides complete examination-specific patterns, sectional timing configurations, and marking schemes for:

* **State Bank of India (SBI)**:
  * **SBI PO** (Prelims: 60 mins, 3 sections with 20m sectional locks, 100 marks; Mains: 180 mins + Descriptive test)
  * **SBI Clerk** (Junior Associates)
  * **SBI Specialist Officer (SO)**
* **Institute of Banking Personnel Selection (IBPS)**:
  * **IBPS PO** (Probationary Officers / Management Trainees)
  * **IBPS Clerk**
  * **IBPS RRB Officer Scale I (PO)** (80 Qs, 45 mins composite time)
  * **IBPS RRB Office Assistant (Clerk)**
  * **IBPS Specialist Officer (SO)** (IT Officer, Law Officer, Agriculture Field Officer)
* **Reserve Bank of India (RBI)**:
  * **RBI Grade B (Phase-I & Phase-II)** (General Awareness 80 Qs, Reasoning 60 Qs, English 30 Qs, Quant 30 Qs)
  * **RBI Assistant**
* **National Bank for Agriculture and Rural Development (NABARD)**:
  * **NABARD Grade A & Grade B**
* **Custom Exams**:
  * Dynamic exam creator allows administrators to configure custom institutions, sectional rules, and marking schemes.

---

## 📚 2. Subjects, Topics & High-Yield Banking Question Bank

The centralized question bank categorizes questions with granular topic and difficulty metadata:

* **Quantitative Aptitude**:
  * Simplification & Approximation (Vedic math techniques, BODMAS, square/cube roots)
  * Quadratic Equations (Sign method shortcuts: finding roots in < 10 seconds)
  * Number Series (Missing series, wrong number series)
  * Data Interpretation (Tabular DI, Bar Charts, Line Graphs, Pie Charts, Caselets, Radar Charts)
  * Arithmetic (Profit & Loss, SI/CI 2-year difference formula $D = P(R/100)^2$, Time & Work efficiency, Time Speed & Distance, Probability & PnC, Mixture & Alligation, Mensuration).
* **Reasoning Ability**:
  * Puzzles (Floor & Flat, Box Puzzles, Day/Month/Year schedules, Uncertain number of persons)
  * Seating Arrangement (Circular in/out facing, Linear double row facing North/South, Square/Rectangular)
  * Syllogism (Modern "Only a few", Reverse Syllogism, Possibility deductions)
  * Inequalities (Open Gate method)
  * Blood Relations & Direction-Distance
  * Input-Output & Data Sufficiency.
* **English Language**:
  * Reading Comprehension (Financial editorials, CBDC/e-Rupee, Macroeconomics, central banking)
  * Error Detection (Grammar rules, correlative conjunctions, subject-verb agreement)
  * Cloze Test, Para Jumbles, Sentence Rearrangement, Vocabulary & Word Usage.
* **General & Banking Awareness**:
  * RBI Monetary Policy (Repo, SDF, MSF, CRR, SLR, LAF corridor)
  * Banking Regulations (DICGC ₹5 Lakh limit, PCA framework, PSL targets 40% domestic / 75% RRBs)
  * Government Schemes (PM Jan Dhan Yojana ₹10,000 OD, PMJJBY, PMSBY, APY)
  * Union Budget & Economic Survey.
* **Computer Aptitude**:
  * Networking (OSI Layers, TCP/IP, Port addressing), DBMS, Cybersecurity (DDoS, Phishing, Malware), MS Office.

---

## 🖥️ 3. Online Examination Engine (TCS iON / IBPS Pattern)

* **Official 5-State Question Navigation Legend**:
  1. 🟩 **Answered**: Green badge with check (Saved and evaluated)
  2. 🟥 **Not Answered**: Red badge (Visited but option not selected)
  3. ⬜ **Not Visited**: Gray square badge (Has not reached question yet)
  4. 🟪 **Marked for Review**: Purple circular badge (Candidate wishes to revisit)
  5. 🟣 **Answered & Marked for Review**: Purple circle with green dot (**Crucial: Considered for evaluation if left marked upon auto-submission**)
* **Sectional Navigation Locks**:
  * Adheres strictly to SBI/IBPS Prelims rules: Section 1 (English) runs for exactly 20:00 minutes. Candidate cannot jump to Section 2 (Quant) until the 20 minutes elapse or the section finishes, preventing unfair time re-allocation.
* **Server-Authoritative Countdown Timer**:
  * Synchronized server timer in `HH:MM:SS`.
  * Visual warnings at **15 minutes**, **5 minutes**, and **1 minute**.
  * Auto-submission upon timeout with zero data loss.
* **Autosave & Network Fault Tolerance**:
  * Dual-layer persistence: Every response change is synchronously recorded to local state and cached in `localStorage`. Accidental browser refresh or crash immediately restores selected answers, remaining timer seconds, and active question without loss.
* **Examination Security & Anti-Cheat Best-Effort Audit**:
  * Full-screen mode recommendation with escape detector.
  * Browser tab visibility (`visibilitychange`) and window focus loss (`blur`) listeners.
  * Right-click and context menu lockout.
  * Security violation counter and audit trail logged to server.

---

## 📄 4. PDF Question Paper Extraction & OCR Studio

* Upload standard banking question paper PDFs and answer keys.
* Automatic parsing of question statements, 5 options ($A, B, C, D, E$), correct keys, and explanations.
* **Group Integrity Preservation**: Questions sharing a reading comprehension passage, circular puzzle rules, or tabular DI dataset remain tied to their shared `QuestionGroup`.
* **Human-in-the-Loop Review Screen**: Administrators inspect side-by-side extractions, verify confidence scores, adjust text/options, and approve questions before publishing. **Never silently publishes unverified questions.**

---

## 💡 5. Detailed Solutions & Pedagogical Module

* Review questions filtered by: **All**, **Correct**, **Incorrect**, **Skipped**.
* Shows candidate's selected choice vs. official correct key with net mark impact ($+1.00$ or $-0.25$).
* **Step-by-Step Derivation**: Full mathematical and grammatical explanations.
* **Vedic Math & Exam Shortcuts**: Highlights tricks to solve questions in $<30$ seconds.
* **Reasoning Deduction Grids**: Step-by-step case elimination tables for circular and floor puzzles.
* Faculty verification badge and reviewer credentials.

---

## 📊 6. Advanced Student Analytics & Competition Leaderboard

* **Scorecard**: Net Marks, All-India Rank, Percentile, Accuracy %, Time taken per question.
* **Estimated Category Cut-offs**: SBI PO Prelims benchmark comparisons for UR, OBC, EWS, SC, and ST (clearly labeled as estimates, not official).
* **Section-wise Diagnostics**: Net score, accuracy, time spent, and cutoff clearance per section.
* **Topic-wise Strengths & Weaknesses**: Visual classification into Strong (>80%), Average (50-80%), and Weak (<50%).
* **Speed vs. Accuracy 4-Quadrant Matrix**:
  * *Quad 1 (Fast & Accurate)*: Ideal scoring fortress.
  * *Quad 2 (Slow & Accurate)*: Needs speed drills.
  * *Quad 3 (Fast & Inaccurate)*: Careless negative marking zone.
  * *Quad 4 (Slow & Inaccurate)*: High-risk questions to skip in Prelims.
* **All-India Leaderboard**: Real-time rank distribution with toppers' benchmark.
* **Personalized AI Action Plan**: Identifies weak areas and prescribes target question sets.

---

## 🗄️ 7. PostgreSQL Database Architecture

Production PostgreSQL DDL schema is provided in `schema.sql` with 21 normalized tables, foreign keys, enums, and performance indexes:
* `users`, `institutions`, `exam_categories`, `subjects`, `topics`, `subtopics`
* `question_groups`, `questions`, `question_options`, `solutions`
* `exams`, `exam_sections`, `exam_section_questions`
* `exam_attempts`, `student_responses`, `exam_violations`
* `question_paper_uploads`, `analytics_snapshots`

---

## 🚀 8. Quick Start & Execution Guide

### Prerequisites
* Node.js v18+ (Node v20.18.0 LTS is configured in `scratch/tools/node-v20.18.0-win-x64`).

### Running the Application

1. Open PowerShell and navigate to the project directory:
   ```powershell
   cd C:\Users\vicky\.gemini\antigravity\scratch\banking-exam-platform
   ```

2. Start the unified Full-Stack Production Server (Port 5000):
   ```powershell
   $env:PATH = "C:\Users\vicky\.gemini\antigravity\scratch\tools\node-v20.18.0-win-x64;$env:PATH"
   node server/index.js
   ```

3. Open your browser and navigate to:
   ```
   http://localhost:5000
   ```

### Alternatively, Running in Development Mode (Vite HMR):
```powershell
$env:PATH = "C:\Users\vicky\.gemini\antigravity\scratch\tools\node-v20.18.0-win-x64;$env:PATH"
npm run dev
```
Navigate to `http://localhost:5173`.
