# Finance-Tracking

A modern, responsive personal finance application built with **React, Vite, Firebase, and Tailwind CSS**. Track income and expenses, manage budgets, visualize financial activity, and keep your financial records organized across desktop and mobile devices.

**Live Demo:** [Finance-Tracking](https://finance-tracking-jade.vercel.app/)

**Repository:** [zyrex0315/Finance-Tracking](https://github.com/zyrex0315/Finance-Tracking)

---

## Overview

Finance-Tracking is a personal finance management application designed to make everyday financial tracking simple and accessible. It combines a clean interface with interactive analytics, cloud-backed data storage, and a mobile-friendly experience.

The application uses Firebase Authentication for account management and Cloud Firestore for persistent financial data, while Zustand manages client-side application state.

## Features

### Dashboard
- Overview of total balance, income, and expenses.
- Recent transaction summaries.
- Financial activity and spending visualizations.
- Budget progress and spending alerts.

### Transaction Management
- Record income and expenses.
- Organize transactions by category and date.
- Search and filter financial records.
- View transaction history and summaries.

### Budget Management
- Create budgets for spending categories.
- Track spending against budget limits.
- Monitor budget utilization.
- Identify categories that require attention.

### Analytics
- Visualize financial activity using interactive charts.
- Explore expense categories and spending patterns.
- Review income and expense summaries.

### Authentication
- User registration and login through Firebase Authentication.
- Authenticated application access.
- Persistent authentication state.

### User Experience
- Responsive desktop and mobile layouts.
- Light and dark themes.
- Mobile-friendly navigation.
- Settings and account preferences.

### Android Support
- Built with Capacitor for Android integration.
- Android project available in the `android/` directory.
- Launcher icon assets managed through the `resources/` directory.

---

## Tech Stack

| Technology | Purpose |
|---|---|
| React | Component-based user interface |
| Vite | Development server and production build |
| Tailwind CSS | Responsive styling and UI design |
| React Router | Client-side navigation |
| Zustand | Application state management |
| Firebase Authentication | User authentication |
| Cloud Firestore | Cloud database |
| Recharts | Financial charts and visualizations |
| Lucide React | Interface icons |
| clsx | Conditional CSS class management |
| Capacitor | Android application integration |
| npm | Package and dependency management |

---

## Getting Started

### Prerequisites

Install the following before running the project:

- [Node.js](https://nodejs.org/) — Node.js 22 LTS is a recommended starting point for this project.
- npm, included with Node.js.
- A [Firebase](https://firebase.google.com/) project.
- Git.

For Android development, you will also need [Android Studio](https://developer.android.com/studio) and a configured Android SDK.

### 1. Clone the repository

```bash
git clone https://github.com/zyrex0315/Finance-Tracking.git
cd Finance-Tracking
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure Firebase

Create a Firebase project in the [Firebase Console](https://console.firebase.google.com/).

Enable the following services:

1. **Authentication:** enable the Email/Password sign-in provider.
2. **Cloud Firestore:** create a database and configure appropriate security rules.

In the project root, create a `.env.local` file:

```env
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_firebase_app_id
```

Replace the placeholder values with the corresponding configuration from your Firebase project.

**Important:** never commit `.env.local`, Firebase service-account credentials, private keys, or other secrets to Git.

Firebase client configuration is not a replacement for database security. Configure Firestore Security Rules to ensure each authenticated user can access only their own records.

### 4. Start the development server

```bash
npm run dev
```

Open the local URL printed in your terminal, usually:

```text
http://localhost:5173
```

### 5. Build for production

```bash
npm run build
```

Vite generates the production build in the `dist/` directory.

Preview the production build locally:

```bash
npm run preview
```

---

## Project Structure

```text
Finance-Tracking/
├── android/                   # Capacitor Android project
├── public/                    # Static public assets
├── resources/                 # Application icon source assets
├── src/
│   ├── components/            # Reusable UI components
│   │   ├── layout/            # Shared application layout
│   │   └── ...                # Other reusable components
│   ├── context/               # Zustand application stores
│   │   ├── authStore.js       # Authentication state
│   │   ├── transactionStore.js # Transaction state
│   │   └── budgetStore.js     # Budget state
│   ├── pages/                 # Application pages
│   │   ├── Dashboard.jsx
│   │   ├── Transactions.jsx
│   │   ├── Budgets.jsx
│   │   ├── Analytics.jsx
│   │   └── Settings.jsx
│   ├── ...                    # Other source files
│   └── main.jsx               # Application entry point
├── .gitignore
├── capacitor.config.json
├── index.html
├── package.json
├── package-lock.json
├── postcss.config.cjs
├── tailwind.config.cjs
├── vite.config.js
└── README.md
```

*This is a high-level overview; the exact files and subdirectories may vary as the project evolves.*

---

## Application Pages

| Page | Description |
|---|---|
| Dashboard | Financial overview, summaries, and charts |
| Transactions | Income and expense management |
| Budgets | Budget creation and spending progress |
| Analytics | Financial activity and spending insights |
| Settings | Account and application preferences |

---

## Android Development

Finance-Tracking uses Capacitor to package the web application for Android.

### Synchronize the web application

After making changes to the frontend:

```bash
npm run build
npx cap sync android
```

### Open Android Studio

```bash
npx cap open android
```

Wait for Gradle synchronization to finish, then select an emulator or connected Android device and run the application.

### Build a debug APK

On Linux or macOS:

```bash
cd android
./gradlew assembleDebug
```

The generated APK is normally available at:

```text
android/app/build/outputs/apk/debug/app-debug.apk
```

If you modify the application icon, regenerate the Android icon assets using the project's configured Capacitor asset tooling, then synchronize and rebuild the Android project.

---

## Future Improvements

Potential improvements for future releases include:

- Transaction editing and advanced filtering.
- CSV export and financial report generation.
- Savings goals and progress tracking.
- More detailed monthly and yearly comparisons.
- Persistent notification preferences and budget alerts.
- Automated tests and continuous integration.
- Improved offline handling for mobile devices.

---


## Author

**Zyrex T.**

GitHub: [@zyrex0315](https://github.com/zyrex0315)

---

## License

No license has been specified in this repository yet. If you intend to distribute the project as open source, add a license file that reflects your chosen terms.
