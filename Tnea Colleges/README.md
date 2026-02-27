# UniGuide Ai - Comprehensive Engineering Admissions Assistant

UniGuide Ai is an advanced academic guidance platform designed mainly for students in Tamil Nadu navigating the TNEA (Tamil Nadu Engineering Admissions) process. Going beyond simple cutoff prediction, it offers a suite of intelligent tools to help students find scholarships, optimize their choice filling, and even discover alternate career pathways if they miss their dream branch.

![UniGuide Ai Banner](client/src/assets/logo_icon.png)

## 🚀 Key Features

### 1. 🎓 TNEA College Predictor
*   **Precision Prediction:** Calculates your engineering cutoff (out of 200) and predicts eligible colleges based on community reservation (OC, BC, MBC, etc.).
*   **Tier-Based Filtering:** View results categorized by standard Tiers (Tier 1 to Tier 5) to identify top-performing institutions quickly.
*   **Branch-Specific Insights:** Filter predictions by specific engineering branches (CSE, ECE, Mech, etc.).

### 7. ♿ Inclusivity & Accessibility Support
*   **PwD Quota Logic:** The predictor automatically adjusts cutoff eligibility for **Differently Abled (PwD)** candidates (with >40% disability), applying a **relaxment buffer** to show eligible top-tier colleges that might otherwise be hidden.
*   **Campus Accessibility Insights:** Each college profile displays critical accessibility data, including **Wheelchair Access**, **Hostel Support**, and **Medical Facilities Availability**.
*   **Smart Accessibility Widget:** Built-in assistive tools for visual and motor impairments:
    *   🗣️ **Screen Reader:** Reads page content aloud.
    *   🎙️ **Voice Commands:** Navigate the site using voice.
    *   👁️ **High Contrast & Font Sizing:** Adjustable UI for better readability.

### 2. 🔀 Alternate Path Predictor (New!)
*   **Career Recovery Engine:** A dedicated module for students who might miss their "dream branch" cutoff.
*   **Goal-Based Analysis:** Input a career goal (e.g., "Software Developer", "Cyber Security Expert") instead of just a branch.
*   **Smart Mapping:** Suggests alternate engineering branches that lead to the same career outcome (e.g., taking IT or ECE to become a Software Engineer).
*   **Skill Roadmaps:** Provides a year-by-year learning path and certification recommendations to bridge the gap between an alternate branch and the dream career.

### 3. 🤖 AI Choice Filler
*   **Optimized Preference Lists:** Helps students generate a smart choice-filling list for the TNEA counselling portal.
*   **Mark-Based Logic:** Suggests an ordered list of colleges and branches that maximizes the probability of allotment.

### 4. 💰 Scholarship Finder
*   **Financial Aid Database:** A searchable directory of government and private scholarships available for engineering students.
*   **Eligibility Matching:** Helps students identify scholarships they qualify for based on their profile.

### 5. 🏛️ Comprehensive College Database
*   **Detailed Profiles:** In-depth information about college infrastructure, courses offered, and location.
*   **Tier Classification:** Colleges are rigorously classified into Tiers (1, 2, 3...) based on placement records and academic performance.

### 6. ✨ Premium User Experience
*   **Modern UI:** Built with **React 19** and **Tailwind CSS v4**, featuring glassmorphism effects and smooth Framer Motion animations.
*   **Dark Mode:** Fully supported system-wide dark mode.
*   **Secure Auth:** Google Sign-In integration via Firebase.

---

## 🛠️ Technology Stack

### Frontend
*   **Framework:** [React](https://reactjs.org/) (v19)
*   **Build Tool:** [Vite](https://vitejs.dev/)
*   **Styling:** [Tailwind CSS](https://tailwindcss.com/) (v4)
*   **Icons:** [Lucide React](https://lucide.dev/)
*   **Animations:** [Framer Motion](https://www.framer.com/motion/)
*   **Authentication:** [Firebase](https://firebase.google.com/) (Google Auth)
*   **Routing:** React Router v7

### Backend
*   **Runtime:** [Node.js](https://nodejs.org/)
*   **Framework:** [Express.js](https://expressjs.com/)
*   **Database:** [MongoDB](https://www.mongodb.com/) (Mongoose ODM)
*   **Data Processing:** `xlsx` library for processing high-volume TNEA data sheets.

---

## 📂 Project Structure

```
UniGuide-Ai/
├── client/                 # Frontend React Application
│   ├── src/
│   │   ├── components/     # Navbar, AccessibilityWidget, etc.
│   │   ├── context/        # Auth & Accessibility Contexts
│   │   ├── pages/          # Home, Results, AlternatePathPredictor, etc.
│   │   ├── assets/         # Static assets
│   │   └── firebase.js     # Firebase Config
├── server/                 # Backend Node.js Application
│   ├── models/             # Mongoose Schemas (College, CareerMapping, etc.)
│   ├── routes/             # API Endpoints
│   ├── scripts/            # Data Seeding & Import Scripts
│   └── server.js           # Entry Point
└── README.md               # Documentation
```

---

## ⚙️ Installation & Setup

### Prerequisites
*   [Node.js](https://nodejs.org/) (v16 or higher)
*   [MongoDB](https://www.mongodb.com/try/download/community) installed and running locally on port `27017`.

### 1. Backend Setup
```bash
cd server
npm install
# Seed the Alternate Path Database (Required for first run)
node scripts/seedAlternatePaths.js
# Start the Server
npm start
```
*Server runs on `http://localhost:5000`*

### 2. Frontend Setup
```bash
cd client
npm install
# Start the Development Server
npm run dev
```
*Client runs on `http://localhost:5173`*

### 3. Quick Start (Windows)
Simply run the provided batch script in the root directory:
```bash
./start_app.cmd
```

---

## 📊 Data & Accuracy
The application relies on processed historical data from TNEA 2023-2024 reports. While the predictor uses statistical probability based on previous years' cutoffs, actual admission results may vary due to changing demand and seat availability.

## 🤝 Contributing
Contributions are welcome! Please fork the repository and submit a pull request.

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).

---
© 2025 UniGuide Ai. All Rights Reserved.
