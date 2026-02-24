# Deployment Checklist

This file summarizes recommended steps to deploy the Next.js site and required environment variables for Firebase.

## Required environment variables
Set the following environment variables in your hosting provider (Vercel, Netlify, Firebase) and locally in `.env.local` (do not commit `.env.local`). You can copy `.env.local.example` to `.env.local` and fill values.

- NEXT_PUBLIC_FIREBASE_API_KEY
- NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
- NEXT_PUBLIC_FIREBASE_PROJECT_ID
- NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
- NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
- NEXT_PUBLIC_FIREBASE_APP_ID

## Vercel (recommended)
1. Push your repository to GitHub/GitLab/Bitbucket.
2. Go to https://vercel.com and import the repo (New Project → Import).
3. Under Project Settings → Environment Variables, add the `NEXT_PUBLIC_FIREBASE_*` keys and their values for Production (and Preview/Development as needed).
4. Set the Build Command to `npm run build` (or `pnpm build` if you use pnpm).
5. Set the Output Directory to the default (leave blank for Next.js).
6. Deploy. After deployment, verify the production URL and test sign in flows.

## Netlify
1. Push your repo to GitHub.
2. In Netlify, create a new site from Git and choose the repo.
3. Set Environment variables in Site Settings → Build & deploy → Environment.
4. Build command: `npm run build` and Publish directory: (leave blank; Netlify will detect Next.js)
5. Deploy and verify.

## Firebase Hosting
1. Install Firebase CLI: `npm i -g firebase-tools` and run `firebase login`.
2. Initialize hosting: `firebase init hosting` and choose your project.
3. Add environment variables via Firebase functions or use a serverless approach; for client-side `NEXT_PUBLIC_` vars, configure them in your CI or during build.
4. Build: `npm run build` then `firebase deploy --only hosting`.

## Local verification (production-like)
```bash
# copy example and fill values
cp .env.local.example .env.local
# install deps
npm install
# build
npm run build
# start production server
npm run start
# visit http://localhost:3000
```

## Notes & Troubleshooting
- Ensure `.env.local` is listed in `.gitignore` so secrets are not committed.
- If you see console warnings about missing Firebase config, set the `NEXT_PUBLIC_FIREBASE_*` values in your host env settings.
- For Vercel preview deployments, add the env vars under both Production and Preview if you want auth to work in preview branches.

If you want, I can also generate a short `README.md` with the most important commands for local development and deployment.
