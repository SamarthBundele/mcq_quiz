# Deploy to Vercel

## Option 1: Via Vercel Website (Recommended)

1. Go to https://vercel.com
2. Sign up or login with GitHub/GitLab/Bitbucket
3. Click "Add New Project"
4. Import this repository or drag and drop the folder
5. Click "Deploy"
6. Your site will be live in seconds!

## Option 2: Via Vercel CLI

### Install Vercel CLI
```bash
npm install -g vercel
```

### Deploy
```bash
vercel
```

Follow the prompts:
- Set up and deploy? Yes
- Which scope? (select your account)
- Link to existing project? No
- Project name? (press enter for default)
- Directory? ./ (press enter)
- Override settings? No

Your site will be deployed and you'll get a live URL!

## Files Included
- index.html - Main page
- style.css - Styling
- script.js - Quiz logic
- mcqs.json - All 318 questions
- vercel.json - Vercel configuration

## Note
The Excel file and Python conversion script are excluded from deployment (see .gitignore)
