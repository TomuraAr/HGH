# HGH Well Intelligence System — Deployment Guide

## What this is
A live web app that scores abandoned oil wells for the HGH hybrid geothermal system.
Two tools: Well Scorer + Well Database with Fleet Intelligence.

---

## Step 1 — Get an Anthropic API Key (free $5 credit)

1. Go to https://console.anthropic.com
2. Click "Sign Up" — use any email
3. Verify your email
4. Go to "Billing" in the left menu → add a card (won't charge until $5 used)
5. Go to "API Keys" in the left menu
6. Click "Create Key" → give it a name → copy the key (starts with sk-ant-)
7. Save it somewhere — you only see it once

---

## Step 2 — Put this folder on GitHub

1. Go to https://github.com and sign up
2. Click the "+" icon top right → "New repository"
3. Name it: hgh-system
4. Set to Public
5. Click "Create repository"
6. On the next page click "uploading an existing file"
7. Upload ALL files from this folder keeping the same folder structure:
   - package.json
   - vite.config.js
   - vercel.json
   - index.html
   - api/analyze.js
   - src/main.jsx
   - src/App.jsx
   - src/WellScorer.jsx
   - src/WellDatabase.jsx
8. Click "Commit changes"

---

## Step 3 — Deploy on Vercel (free)

1. Go to https://vercel.com
2. Click "Sign Up" → choose "Continue with GitHub"
3. Click "Add New Project"
4. Find "hgh-system" in the list → click "Import"
5. Leave all settings as default
6. Click "Deploy"
7. Wait ~2 minutes — you'll get a live URL like hgh-system.vercel.app

---

## Step 4 — Add your API key to Vercel

1. In Vercel, go to your project dashboard
2. Click "Settings" tab
3. Click "Environment Variables" in the left menu
4. Click "Add New"
5. Name: ANTHROPIC_API_KEY
6. Value: paste your key from Step 1
7. Click "Save"
8. Go to "Deployments" tab → click the three dots on your deployment → "Redeploy"

---

## Done
Your app is live. Share the URL with your partners.

The API key is hidden on Vercel's servers — nobody can steal it.
Your $5 free credit = roughly 50-100 well analyses.

---

## If anything goes wrong
- Make sure ALL files are uploaded with the exact same folder structure
- Make sure the environment variable is named exactly: ANTHROPIC_API_KEY
- After adding the env variable you MUST redeploy for it to take effect
