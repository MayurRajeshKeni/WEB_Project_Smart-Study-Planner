# Smart Study Planner & Student Portfolio

Welcome to my academic project repository. This project consists of two main parts: a professional **Student Portfolio** and a **Smart Study Planner** designed to optimize study habits using intelligent scheduling.

## 🔗 Live Links
- **[Student Portfolio](https://mayurrajeshkeni.github.io/WEB_Project_Smart-Study-Planner/student-profile/stu.%20profile.html)**
- **[Smart Study Planner](https://mayurrajeshkeni.github.io/WEB_Project_Smart-Study-Planner/)**

---

## 📅 Smart Study Planner
A fully serverless, browser-based application built with **React 19** and **Vite**. It helps students organize their study sessions, track discipline streaks, and visualize long-term progress.

### 🚀 Key Features
- **Intelligent Scheduler**: Automatically distributes study hours across the week based on task deadlines, difficulty, and your daily availability.
- **Dynamic Views**: Switch between **Day**, **Week**, and **Month** views. Highlighted focus for the current day.
- **Discipline Tracker**: 🔥 Current Streak and 🏆 Max Streak tracking to keep you motivated.
- **GitHub-style Heatmap**: Historical tracking in the Month view allows you to see your consistency over time (Prev Month navigation).
- **Control & Flexibility**:
  - `Undo Block`: Mistakenly marked a task done? Undo it with one click.
  - `Bonus Hours`: Finished your day early? Pull tomorrow's tasks into today on demand.
  - `Auto-Rescheduling`: Incomplete tasks automatically move to future days to ensure you stay on track.
- **Rich UI/UX**:
  - 🌙 Light / Dark mode support.
  - Onboarding flow for personalized experience.
  - Subject-based auto-color coding (Pastel themes).
- **Data & Privacy**: 🔒 All user data is stored **exclusively in your browser** via `localStorage`. No data is ever sent to a server.

---

## 🏗️ Project Overview & Organization

The repository is structured as a multi-part web project:

```text
WEB_Project_Smart-Study-Planner/
├── student-profile/             # Portfolio Section
│   └── stu. profile.html        # Main HTML structure with Glassmorphism design
├── smart-study-planner/         # React Application
│   ├── src/
│   │   ├── components/          # UI Components
│   │   │   ├── ProfileSetup.jsx # First-time onboarding
│   │   │   ├── TaskList.jsx     # Managed task entries
│   │   │   ├── SchedulePanel.jsx# Calendar & Schedule views
│   │   │   └── InputPanel.jsx   # Task creation & validation
│   │   ├── utils/
│   │   │   └── scheduler.js     # CORE: Scheduling algorithm & history logic
│   │   ├── App.jsx              # Main App state & Routing
│   │   ├── App.css              # Dashboard styling
│   │   └── index.css            # Global Theme Variables (Light/Dark)
│   ├── public/                  # Static assets
│   └── vite.config.js           # Build & Deployment configuration
├── README.md                    # Project documentation
└── .gitignore                   # Version control exclusions
```

---

## 🛠️ Technical Stack
- **Frontend**: React 19, JavaScript (ES6+), HTML5, CSS3.
- **Build Tool**: Vite.
- **Persistence**: Browser `localStorage`.
- **Deployment**: GitHub Pages.

## 💻 Local Development

1. **Clone the repository**:
   ```bash
   git clone https://github.com/MayurRajeshKeni/WEB_Project_Smart-Study-Planner.git
   ```
2. **Setup the Planner**:
   ```bash
   cd smart-study-planner
   npm install
   npm run dev
   ```
3. **Open the Profile**:
   Simply open `student-profile/stu. profile.html` in any modern browser.

## 🚀 Deployment

To deploy updates to the live site:
```bash
cd smart-study-planner
npm run deploy  # Rebuilds and pushes to gh-pages branch
```
