# m2studiowebsiteredesign

Minimal README with local setup and deployment steps.

## Requirements
- Node.js 18+ (recommended)
- npm (or pnpm)

## Setup
1. Copy the example env file and fill your Firebase values:

```bash
cp .env.local.example .env.local
# edit .env.local and add your NEXT_PUBLIC_FIREBASE_* values
```

2. Install dependencies:

```bash
npm install
# or
# pnpm install
```

## Local development
```bash
npm run dev
```

## Production build & run locally
```bash
npm run build
npm run start
# visit http://localhost:3000
```

## Deploy
See `DEPLOY.md` for detailed steps for Vercel, Netlify, and Firebase Hosting.

## Notes
- Do not commit `.env.local` to version control.
- Add `NEXT_PUBLIC_FIREBASE_*` variables to your hosting provider before deploying to enable Auth and Firestore.
