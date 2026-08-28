<<<<<<< HEAD
# 🚀 PlacePrep — Campus Placement Preparation & Recruitment Portal

> A full-stack **MERN** (MongoDB, Express.js, React.js, Node.js) web platform engineered to empower college students, training & placement officers (TPO), and corporate recruiters with automated readiness scoring, aptitude & coding practice engines, and recruitment pipeline tracking.

---

## 🌟 Key Highlights & Platform Features

### 🎓 1. Student Portal
* **Dynamic Placement Readiness Engine**: Real-time evaluation based on weighted aptitude accuracy, DSA problem-solving, core CS technical questions, HR behavioral preparation, ATS resume match, and profile completion.
* **Timed Aptitude Assessment Hub**: Category-filtered quizzes (Quantitative, Logical Reasoning, Verbal Ability, Data Interpretation) with countdown timers, instant answer evaluations, and in-depth step-by-step explanations.
* **Interactive Coding & DSA Sandbox**: LeetCode-style algorithmic challenges across Arrays, Strings, Trees, Dynamic Programming, and Stacks with multi-language code runner and algorithmic approach breakdowns.
* **Interview Preparation Library**: Curated technical questions (JavaScript, React, Node, DBMS, OS, OOP) with code snippets + HR behavioral questions modeled on the **STAR framework**.
* **ATS-Optimized Resume Builder**: Multi-section resume builder with real-time printable ATS-clean preview and 1-click PDF download.
* **Campus Job Board & Eligibility Verifier**: 1-click eligibility check (CGPA cutoff, allowed branches, active backlogs) and instant application submission.
* **Application Lifecycle Tracker**: Visual multi-stage progression timeline (*Applied* ➔ *Shortlisted* ➔ *Aptitude Test* ➔ *Technical Interview* ➔ *HR Interview* ➔ *Selected*), complete with interview dates, time slots, and virtual meeting links.

---

### 🏢 2. Recruiter Portal
* **Recruitment Pipeline Dashboard**: Real-time tracking of active job openings, candidate funnel metrics, and candidate progression.
* **Job Posting Suite**: Publish job openings with custom package CTC breakdown, CGPA thresholds, backlogs criteria, and branch filters.
* **Applicant Review & Stage Transition**: Advance candidates through hiring stages or schedule live technical/HR interviews with Google Meet integration.
* **Company Profile Manager**: Manage branding, compensation brackets, company logos, and official website URLs.

---

### ⚙️ 3. Placement Administrator (TPO) Portal
* **Placement Cell Analytics & Recharts**: Visual charts showing branch-wise placement percentages, recruiting partner stats, and salary distributions.
* **Student Directory & Audit**: Filter student records by CGPA, branch, and placement status with account moderation controls.
* **Partner Companies Management**: Monitor recruiting partners and tier classification (Tier-1 Dream, Core, Mass).
* **On-Campus Drive Scheduler**: Schedule placement drive dates and broadcast automated notifications to eligible students.
* **Placement Reports Generator**: Official accreditation-ready annual placement audit reports with 1-click print/export.
* **Campus Question Bank**: Repository of verified quantitative, logical, and DSA challenges.

---

## 📊 Placement Readiness Score Formulation

The overall readiness index is calculated dynamically through a multi-metric weighted formula:

$$\text{Readiness Score} = 0.20 \times \text{Aptitude} + 0.20 \times \text{Coding} + 0.20 \times \text{Technical} + 0.15 \times \text{Interview} + 0.15 \times \text{Resume} + 0.10 \times \text{Profile}$$

* **Aptitude (20%)**: Derived from accuracy across completed quantitative and logical timed assessments.
* **Coding DSA (20%)**: Evaluated from total algorithmic challenges solved.
* **Technical CS (20%)**: Measured against completed core CS topic question sets.
* **HR Interview (15%)**: Based on practice with behavioral STAR responses.
* **ATS Resume (15%)**: Computed from complete project portfolios, work experience, and ATS summary.
* **Profile Completeness (10%)**: Verification of academic CGPA, verified roll number, and skills.

---

## 🛠️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | React 18, React Router DOM v6, Vite, Tailwind CSS, Lucide Icons, Recharts, jsPDF |
| **Backend** | Node.js, Express.js, REST API, JSON Web Tokens (JWT), bcryptjs, Morgan |
| **Database Layer** | MongoDB / Mongoose (with automated High-Speed In-Memory Document Fallback Engine) |
| **State Management** | React Context API (`AuthContext`, `NotificationContext`) |

---

## 🔑 Pre-Seeded Demo Credentials

Instant 1-click demo login buttons are built directly into the login screen:

| Role | Email | Password |
| :--- | :--- | :--- |
| **Student** | `student@placeprep.edu` | `student123` |
| **Recruiter** | `recruiter@google.com` | `recruiter123` |
| **Placement Admin** | `admin@placeprep.edu` | `admin123` |

---

## ⚡ Getting Started & Running Locally

### 1. Prerequisites
* **Node.js** (v18 or newer)
* **npm**

### 2. Run Both Frontend and Backend Concurrently

From the root directory (`placeprep/`):

```bash
# Start both backend (Port 5000) and frontend (Port 5173) concurrently:
npm run dev
```

Alternatively, run in separate terminals:

```bash
# Terminal 1: Backend Server (Port 5000)
cd server
npm run dev

# Terminal 2: Frontend Client (Port 5173)
cd client
npm run dev
```

Visit the application in your browser:
* **Frontend Web App**: `http://localhost:5173`
* **Backend API Base**: `http://localhost:5000/api`

---

## 🧪 Testing

To execute the backend automated test suite:

```bash
cd server
npm test
```

All 14 comprehensive integration tests (Auth, Eligibility, Applications, Readiness Engine, Practice, Recruiter, Admin) will execute and report passing status.
=======
# Placeprep
>>>>>>> 95250b823deb49ef7a60a39ab3a1c34471a32a4e
