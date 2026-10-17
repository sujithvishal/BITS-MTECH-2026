# BITS Pilani M.Tech AIML — Notice Board (Now Page)

A minimalist, distraction-free "Now Page" academic bulletin board for the **BITS Pilani M.Tech in Artificial Intelligence & Machine Learning (AIML)** cohort.

Designed for rapid glanceability across desktop and mobile, with live real-time countdowns for active assessments and upcoming schedule milestones.

---

## 🌟 Highlights

- **Live Countdown Timers**:
  - **Ongoing Events**: Displays live **Time Left** countdown on the top right with second-by-second updates.
  - **Upcoming Events**: Displays live **Time to Start** countdown.
- **Single Subject Filter**:
  - Filter notices by **All Subjects** or individually by **Deep Learning**, **Machine Learning**, **ISM**, or **MFML**.
- **Mobile-First & Touch-Friendly**:
  - Thumb-zone segment controls (`All Notices`, `Ongoing`, `Upcoming`).
  - Minimum 44px touch targets with no accidental iOS Safari auto-zooming.
- **Accurate Indian Standard Time (IST)**:
  - Formatted with explicit day of the week (e.g. *Friday, 16 Oct 2026, 12:01 AM IST*).
- **Read-Only by Design**:
  - No bloated client-side database or login forms. Events are maintained directly in code via a clean, structured JSON file.
- **GitHub Pages Ready**:
  - Pre-configured GitHub Actions workflow (`.github/workflows/deploy.yml`) for automated builds and deployment.

---

## 📅 Supported Subjects

The app references a strict, type-safe `SubjectEnum`:

| Enum Key | Display Name |
| :--- | :--- |
| `DEEP_LEARNING` | Deep Learning |
| `MACHINE_LEARNING` | Machine Learning |
| `ISM` | ISM |
| `MFML` | MFML |
| `GENERAL` | General & Institutional |

---

## ✏️ How to Add or Edit Events

All events live in [`src/data/noticeTemplate.json`](./src/data/noticeTemplate.json). Open this file in your favorite code editor to add, update, or remove notices:

```json
[
  {
    "id": "event-ml-quiz2",
    "title": "Machine Learning: Quiz 2",
    "miniDescription": "Online proctored Quiz 2 assessment window is live for all enrolled students.",
    "category": "SUBJECT",
    "subject": "MACHINE_LEARNING",
    "startDate": "2026-10-16T00:01:00+05:30",
    "endDate": "2026-10-22T23:59:00+05:30"
  },
  {
    "id": "event-ism-quiz2",
    "title": "ISM: Quiz 2",
    "miniDescription": "Information Security Management Quiz 2 online assessment window.",
    "category": "SUBJECT",
    "subject": "ISM",
    "startDate": "2026-10-23T18:00:00+05:30",
    "endDate": "2026-10-25T23:55:00+05:30"
  }
]
```

### Event Fields:
- `id` *(string)*: Unique identifier (e.g. `"event-01"`).
- `title` *(string)*: Clear notice headline.
- `miniDescription` *(string)*: 1–2 sentence summary or syllabus scope.
- `category` *(string)*: `"SUBJECT"` or `"GENERAL"`.
- `subject` *(string)*: `"DEEP_LEARNING"`, `"MACHINE_LEARNING"`, `"ISM"`, `"MFML"`, or `"GENERAL"`.
- `startDate` *(string)*: ISO 8601 timestamp with timezone (e.g. `"2026-10-16T00:01:00+05:30"`).
- `endDate` *(string)*: ISO 8601 timestamp with timezone (e.g. `"2026-10-22T23:59:00+05:30"`).

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ or 20+
- npm

### Installation
```bash
# Clone the repository
git clone <your-repo-url>
cd <repo-folder>

# Install dependencies
npm install

# Start local development server
npm run dev
```

The app will run at `http://localhost:3000`.

### Production Build
```bash
npm run build
```
Built assets will be emitted to the `dist/` directory.

---

## 🚢 Deploying to GitHub Pages

1. Push this repository to GitHub.
2. In your GitHub repository, navigate to **Settings** → **Pages** (under *Code and automation*).
3. Under **Build and deployment** → **Source**, select **GitHub Actions**.
4. Any push to `main` or `master` will automatically trigger `.github/workflows/deploy.yml` and publish the site.

---

## 🛠️ Tech Stack

- **Framework**: React 19 + TypeScript
- **Bundler**: Vite
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React
- **CI/CD**: GitHub Actions
