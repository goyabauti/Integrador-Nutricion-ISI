# My App

Fullstack starter built with **Next.js 14** + **TypeScript**.  
Frontend and backend live in the same project via Next.js App Router and API Routes.

---

## Stack

| Layer    | Tech                          |
|----------|-------------------------------|
| Frontend | Next.js 14 (App Router)       |
| Backend  | Next.js API Routes            |
| Language | TypeScript                    |
| Linting  | ESLint + Prettier             |

---

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Set up environment variables

```bash
cp .env.example .env.local
# Edit .env.local with your values
```

### 3. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Project Structure

```
src/
├── app/
│   ├── layout.tsx        # Root layout
│   ├── page.tsx          # Home page
│   ├── globals.css       # Global styles
│   └── api/
│       └── hello/
│           └── route.ts  # Example API route → GET/POST /api/hello
├── components/
│   └── ui/               # Reusable UI components
└── lib/
    └── utils.ts          # Shared utility functions
```

---

## API Routes

API routes live under `src/app/api/`. Each folder maps to a URL:

| File                          | URL            |
|-------------------------------|----------------|
| `src/app/api/hello/route.ts`  | `/api/hello`   |

---

## Available Scripts

| Command         | Description                    |
|-----------------|--------------------------------|
| `npm run dev`   | Start dev server               |
| `npm run build` | Build for production           |
| `npm run start` | Start production server        |
| `npm run lint`  | Run ESLint                     |
| `npm run format`| Format code with Prettier      |

---

## Push to GitHub

```bash
# 1. Create a new repo on github.com (or via CLI)
gh repo create my-app --public --source=. --remote=origin --push

# — OR — manually:
git init
git add .
git commit -m "chore: initial project setup"
git remote add origin https://github.com/YOUR_USERNAME/my-app.git
git branch -M main
git push -u origin main
```

> 💡 Install the [GitHub CLI](https://cli.github.com/) to use `gh repo create`.
