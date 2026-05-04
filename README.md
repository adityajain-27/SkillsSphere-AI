<a name="top"></a>
![----------------------------------------------------](https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/rainbow.png)

![NSOC'26](https://img.shields.io/badge/NSOC-2026-orange?style=for-the-badge)

**This project is officially registered under nexus spring of code 2026.**

![----------------------------------------------------](https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/rainbow.png)

# SkillSphere AI

SkillSphere AI is an AI-powered full-stack platform that connects **learning**, **skill evaluation**, and **career readiness** in one ecosystem.

It helps:

- **Students** learn, practice, and become job-ready
- **Tutors** run live, interactive classes
- **Recruiters** discover skilled and better-matched candidates

The platform combines live classroom experiences with AI/ML-driven career tools such as resume analysis, job matching, interview practice, and performance tracking.

---

## Project Vision

SkillSphere AI aims to simplify the path from learning to hiring by giving users practical, actionable insights at every stage:

- Learn skills in real-time
- Measure progress through dashboards
- Improve career assets (resume and interview performance)
- Connect capabilities to hiring needs

---

## Core Features

1. **Live Interactive Classrooms**  
   Real-time learning sessions with video, chat, and collaboration.

2. **AI Resume Analyzer**  
   Resume scoring with improvement suggestions. (Route: `/resume-analyzer`)
   - Drag & Drop / clipboard paste upload
   - ATS score with detailed analysis dashboard
   - Missing keyword identification
   - Live PDF document preview

3. **Resume vs Job Description Matcher**  
   ML-assisted comparison between candidate profile and role requirements.

4. **AI Mock Interview System**  
   Interview practice with structured feedback for improvement.

5. **Skill Tracking Dashboard**  
   Performance insights to help students and tutors track growth.

6. **Secure Authentication & Email Verification**  
   OTP-based registration and password recovery system.
   - 6-digit email OTP verification
   - Secure Password Reset (Forgot Password) flow
   - Protection against user enumeration
   - OTP attempt limiting for security

---

## Target Users

- **Students**: build skills, improve resumes, and prepare for jobs
- **Tutors**: teach and manage live learning experiences
- **Recruiters**: identify skilled candidates more efficiently

---

## Project Goals

- Simplify the journey from learning to getting hired
- Provide AI-powered guidance for career growth
- Enable meaningful collaboration between learners and educators
- Keep the platform modular, scalable, and open-source friendly

---

## Tech Stack

- **Frontend:** React.js
- **Backend:** Node.js + Express.js
- **Database:** MongoDB
- **Intelligence Layer:** AI/ML for resume analysis, matching, and recommendations

---

## ⚡ Quick Start (Unified Setup)

To simplify setup, you can now run the entire project using root-level scripts.

### Install all dependencies
npm run install-all

### Run the project (client + server together)
npm run dev

This will start:
- Frontend (client)
- Backend (server)

> ⚠️ Backend requires environment variables to run properly. Refer to the Environment Setup section below.

## Scalable Folder Structure

The following structure keeps the project modular and easy to scale for new contributors:

```text
SkillSphere-AI/
├── client/                          # React frontend (Vite)
│   ├── src/
│   │   ├── modules/                 # Feature-based modules (Auth, Resumes, etc.)
│   │   ├── shared/                  # Reusable UI components
│   │   └── services/                # API service layer
├── server/                          # Express backend
│   ├── src/
│   │   ├── modules/                 # Backend business logic by domain
│   │   ├── database/                # Mongoose models and connection
│   │   └── middleware/              # Auth, RBAC, and Upload handlers
├── ai-ml/                           # AI/ML intelligence layer
│   ├── evaluators/                  # Skill, Keyword, and Experience matchers
│   └── pipeline/                    # Unified analysis pipeline
├── docs/                            # Project documentation
└── ...                              # Configuration and root files
```

## API Endpoints (Implemented)

- `GET /health`
- `POST /api/auth/register` (v2: now includes OTP verification)
- `POST /api/auth/verify-email`
- `POST /api/auth/resend-otp`
- `POST /api/auth/forgot-password`
- `POST /api/auth/reset-password`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`
- `POST /api/resume/upload`
- `POST /api/resume/analyze` (v2: uses latest-only upsert flow)
- `GET /api/resume/me/latest`: fetch user's latest parsed resume (no raw resumeText)
- `GET /api/resume/result/:id`

- `GET /uploads/:filename`
- `POST /api/jobs`: create a new job (Recruiter only)
- `GET /api/jobs`: list all published jobs (supports `designation`, `minSalary`, `maxSalary`, `postedWithin` filters)
- `GET /api/jobs/recruiter`: list jobs posted by the authenticated recruiter
- `GET /api/jobs/:id`: get job details

### Why this structure works

- **Feature-first design:** Easier to assign and scale work across teams
- **Clear boundaries:** Frontend, backend, and AI/ML concerns are separated
- **Contributor-friendly:** New developers can quickly find where to work
- **Future-ready:** Supports adding new learning/career modules without major rewrites

---

```md
### Resume Analyzer Backend Progress

Implemented:

- Resume upload support using multer
- Resume parsing using pdf-parse
- Candidate information extraction from uploaded resumes
- Skill comparison between resume skills and job description skills
- Weighted skill score generation
- Detection of matched skills, missing skills, and extra skills
- Explainable feedback for resume vs JD matching
- MongoDB persistence for parsed resume data and skill match results
- Resume schema for storing uploaded file metadata and parsed candidate information
- GET /api/resume/result/:id endpoint to fetch stored resume records
- Reusable `ai-ml/evaluators/keywordEvaluator.js` for resume vs job description text
- Keyword relevance analysis with matched keywords, missing keywords, and weighted keyword score (`weight` default `0.2`)
- Optional `jobDescription` form field on `POST /api/resume/analyze` to run keyword evaluation alongside parsing
- Reusable `ai-ml/evaluators/experienceEvaluator.js` for resume vs job description experience matching
- Experience extraction supports years and months (examples: `18 months`, `1 year 6 months`, `2+ years`)
- Weighted experience scoring with explainable feedback (`score`, `weight`, `candidateExperience`, `requiredExperience`, `experienceGap`)
- Unit tests for experience evaluator at `ai-ml/evaluators/__tests__/experienceEvaluator.test.js`
- `/api/resume/analyze` now includes `experienceMatch` in response and MongoDB resume records
- **Latest-Only Resume Flow**: Implemented singleton resume pattern where each user keeps only one stored parsed record, with new uploads replacing the previous one
- **Resume Service Layer**: Introduced `service.js` in the resumes module to manage upsert and ownership logic
- **Data Privacy**: Enforced exclusion of `resumeText` from all resume API responses


### Authentication & Security Progress

Implemented:

- OTP-based email verification using Nodemailer
- Dual-mode email service (Console logging for dev, SMTP for production)
- Secure password reset flow with enumeration protection
- 6-digit OTP generation with 5-minute expiry logic
- Brute-force protection via OTP attempt limiting (max 5 attempts)
- Reusable `sendEmail` utility for system-wide notifications
- Input validation using Zod schemas for all auth flows
- JWT-based authentication for stateful sessions
- Role-Based Access Control (RBAC) middleware (`student`, `tutor`, `recruiter`)
- Secure Login endpoint with credential verification
- Logout endpoint for client-side session termination
- Get Current User endpoint (`/me`) for profile fetching
- JWT verification middleware for route protection

### Frontend & Shared UI Progress

Implemented:

- Standardized State Components: `LoadingState`, `EmptyState`, `ErrorState`
- Common Page Layouts: `PageHeader` with support for gradient typography
- Barrel exports for shared components to simplify module imports
- Integration of shared states into `ResumeAnalyzerPage`
- **New Feature: Job Description Integration**
  - Added `TextArea` shared component for multi-line inputs
  - Added JD input section to `ResumeAnalyzerPage` with paste and .txt upload support
  - Integrated `resumeService` with real backend API calls using `FormData`
  - Support for sending `jobDescription` alongside resume file for keyword relevance scoring

### Recruiter Job Management Progress

Implemented:

- JobPosting schema with `experienceRequired`, `jobLevel`, and matching-ready fields
- RBAC-protected Job Creation API for Recruiters
- Publicly accessible Job Listing and Detail APIs
- Ownership-based Job Update and Delete APIs
- Populated recruiter information in job responses

### Job Search & Filtering Progress

Implemented:

- **Dynamic Mongoose Query Builder**: Supports filtering by `minSalary`, `maxSalary`, `designation` (regex title search), and `postedWithin` (date range).
- **Recency Filters**: Added logic for `1d`, `7d`, and `30d` timeframe filtering.
- **Database Performance**: Implemented indexes for `title`, `salary`, `status`, and `createdAt` for optimized search.
- **Refactored Routes**: Unified job discovery under `/api/jobs` while preserving recruiter management security.
- **Terminal Test Suite**: Created `server/test-filters.js` for direct validation of filtering logic.
```

## For Open-Source Contributors

If you want to contribute, start by understanding:

1. Which user group your change helps (student, tutor, recruiter)
2. Which module it belongs to (classrooms, resumes, matching, interviews, dashboard)
3. Whether the change impacts frontend, backend, AI/ML, or multiple layers

This approach keeps contributions focused, reviewable, and scalable.

---

## Contributor Resources

- Contribution Guide: `CONTRIBUTING.md`
- Code of Conduct: `CODE_OF_CONDUCT.md`
- Security Policy: `SECURITY.md`
- PR Template: `.github/PULL_REQUEST_TEMPLATE.md`
- Issue Templates: `.github/ISSUE_TEMPLATE/`
- Detailed Structure Notes: `docs/PROJECT_STRUCTURE.md`
- PR Quality Gates: `docs/QUALITY_GATES.md`

## PR Checks and Code Review Safety

Automated checks run on pull requests to `main` through:

- `.github/workflows/pr-quality-checks.yml`

These checks validate docs/workflows and, once app code is added, automatically run lint/test/build for `client`, `server`, and `ai-ml` when their dependency manifests exist.

## 🚀 Running the Project (Manual Setup)

### Client

```bash
cd client
npm install
npm run dev
```

### Server

```bash
cd server
npm install
npm run dev
```

## 🔐 Environment Variables Setup
> ⚠️ The backend will not start without configuring the required environment variables.

### Server

1. Copy example file:

```bash
cd server
cp .env.example .env
```

2. Update required values in `server/.env`:

- `MONGO_URI`
- `JWT_SECRET`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`

- `EMAIL_SERVICE_MODE=console` (Use "smtp" for real emails)
- `EMAIL_HOST=smtp.gmail.com`
- `EMAIL_PORT=587`
- `EMAIL_USER=your-email@gmail.com`
- `EMAIL_PASS=your-app-password`
- `EMAIL_FROM="SkillsSphere AI" <your-email@gmail.com>`

# Evaluator toggles and weights (optional)
EVALUATOR_SKILL_MATCH_ENABLED=true
EVALUATOR_KEYWORD_MATCH_ENABLED=true
EVALUATOR_EXPERIENCE_MATCH_ENABLED=true
EVALUATOR_SKILL_MATCH_WEIGHT=1
EVALUATOR_KEYWORD_MATCH_WEIGHT=0.2
EVALUATOR_EXPERIENCE_MATCH_WEIGHT=0.2

### Client

1. Copy example file:

```bash
cd client
cp .env.example .env
```

2. For local development, keep:

- `VITE_API_URL=http://localhost:5000`

## 🔐 Google OAuth Setup

1. Open Google Cloud Console.
2. Create/select your project.
3. Configure OAuth consent screen.
4. Go to Credentials and create OAuth 2.0 Client ID (Web application).
5. Add Authorized redirect URI exactly as:

```text
http://localhost:5000/api/auth/google/callback
```

6. Copy Client ID and Client Secret into `server/.env`:

```env
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback
FRONTEND_URL=http://localhost:5174
```

7. Restart both backend and frontend after updating env files.

OAuth flow summary:

- Frontend starts OAuth from `/api/auth/google`.
- Google redirects to backend callback (`GOOGLE_CALLBACK_URL`).
- Backend creates JWT and redirects to frontend callback (`FRONTEND_URL/auth/callback`).

## 📧 Email SMTP Setup (Gmail)

To use real email notifications (OTP verification, password reset) via Gmail, follow these steps:

1. **Enable 2-Step Verification**: Go to your [Google Account Security](https://myaccount.google.com/security) and ensure 2-Step Verification is ON.
2. **Generate App Password**:
   - Search for "App Passwords" in your Google Account search bar.
   - Enter a name (e.g., "SkillsSphere AI").
   - Click **Create**.
   - Copy the **16-character code** (e.g., `abcd efgh ijkl mnop`).
3. **Update `server/.env`**:
   ```env
   EMAIL_SERVICE_MODE=smtp
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=abcd efgh ijkl mnop
   EMAIL_FROM="SkillsSphere AI" <your-email@gmail.com>
   ```
4. **Restart the server** to apply changes.
