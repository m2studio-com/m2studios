# Push repository to GitHub

Run these commands locally (requires `git` and a GitHub account).

1. Install Git if missing: https://git-scm.com/downloads

2. Initialize, commit, and push:

```bash
cd /path/to/project
# initialize repo
git init -b main
# add files
git add .
# commit
git commit -m "Initial commit"

# create repo on GitHub (via website) or create via CLI
# Example: Replace USER and REPO below with your GitHub username and repo name
# On GitHub website: create new repo and DO NOT initialize with README

# add remote and push
git remote add origin https://github.com/USER/REPO.git
git push -u origin main
```

3. Link to Vercel (recommended):
- Go to https://vercel.com/new → Import Project → select your GitHub repository.
- Set Environment Variables under Project Settings → Environment Variables (use `.env.local` values).
- Build Command: `npm run build` (or `pnpm build`).

Alternative: create repo via GitHub CLI (requires `gh`):

```bash
# login once
gh auth login
# create repo and push
gh repo create USER/REPO --public --source=. --remote=origin --push
```

If you want, run the commands and tell me when you've pushed. I can then walk you through connecting Vercel and adding environment variables.