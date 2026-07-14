# R2U Daily Ops Board

A daily IT team activity tracker for Route 2 Uni. Team members log tasks in
the morning and afternoon on a shared board (styled like an airport
departures board — navy/gold R2U theme). At the end of the day, click one
button to generate a branded PDF report and lock the day. Every day's report
also lands in **History**, which works like a live analytics/records page —
always available, real-time, filterable by team member.

## Stack

- Next.js 15 (App Router) + Tailwind CSS 4
- Firebase Firestore (data, real-time sync) — no backend server needed
- jsPDF + jspdf-autotable (client-side PDF generation, no server function needed)
- Deploy target: Vercel

## 1. Firebase setup (5 minutes)

1. Go to https://console.firebase.google.com → **Add project** → name it e.g. `r2u-daily-ops`.
2. Inside the project: **Build → Firestore Database → Create database** → start in **production mode** → pick a region close to Nepal (e.g. `asia-south1`).
3. **Project settings (gear icon) → General → Your apps → Web (</>)** → register an app (no Hosting needed) → copy the `firebaseConfig` values.
4. In this repo, copy `.env.local.example` to `.env.local` and paste those values in.
5. In Firestore → **Rules** tab, paste the contents of `firestore.rules` from this repo and click Publish.
   - This starter uses open read/write rules so the whole team can log tasks without a login screen. See "Locking it down" below before this goes fully live with sensitive data.

## 2. Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000 — pick your name, add tasks under Morning/Afternoon.

## 3. Edit your team roster

Open `lib/team.ts` and edit the `TEAM_MEMBERS` list — add/remove people as needed. Each `id` should be lowercase, no spaces (it's used as part of the Firestore document id).

## 4. Swap in your real logo

`components/Logo.tsx` currently renders a text wordmark ("R2U") in navy/gold as
a placeholder. Drop your actual logo file into `public/logo.png` (or `.svg`)
and swap the placeholder `<div>` for an `<img src="/logo.png" .../>` (or
`next/image`).

## 5. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit: R2U Daily Ops Board"
git branch -M main
git remote add origin https://github.com/Hemraj-Adhikari/r2u-daily-ops-board.git
git push -u origin main
```

(Create the empty repo on GitHub first, or use `gh repo create` if you have the GitHub CLI.)

## 6. Deploy to Vercel

1. https://vercel.com → **Add New → Project** → import the GitHub repo you just pushed.
2. In **Environment Variables**, add the same 6 `NEXT_PUBLIC_FIREBASE_*` values from your `.env.local`.
3. Deploy. Vercel gives you a live URL (e.g. `r2u-daily-ops-board.vercel.app`) — that's the link your team uses daily.

## How the daily flow works

- **Morning** — each person opens the board, picks their name (remembered on that device after), adds tasks under "Morning".
- **Afternoon** — same board, add more tasks under "Afternoon", or tap a task's status pill to mark it Completed (it does a little flip animation, like a departures board flap).
- **End of day** — click **"Generate End-of-Day Report (PDF)"**. This downloads a branded PDF and locks that day's board (so it can't be edited by accident afterward). The record is saved in Firestore permanently.
- **History tab** — shows every day's report for every team member, real-time, with totals and a per-person filter. Anyone can re-download any day's PDF from there — this is your permanent "CRM-style" report archive.

## Locking it down later (optional, recommended before wider rollout)

Right now anyone with the link can read/write. To add real per-user login:

1. Enable **Firebase Authentication** (Email/Password or Google sign-in) in the Firebase console.
2. Replace `components/MemberPicker.tsx`'s button list with a real sign-in form.
3. Update `firestore.rules` to `allow read, write: if request.auth != null;` (or scope writes to `request.auth.uid == resource.data.userId` for tighter control).

## Project structure

```
app/
  page.tsx           -> Today's board (home page)
  history/page.tsx   -> History / analytics page
  layout.tsx, globals.css
components/
  BoardHeader.tsx     -> Top nav + live clock
  Logo.tsx            -> Wordmark (swap for real logo)
  MemberPicker.tsx     -> "Who is logging in?" screen
  TaskForm.tsx         -> Add-task input
  TaskRow.tsx           -> Single task row (split-flap style)
  DailyBoard.tsx        -> Today's board logic
  GenerateReportButton.tsx -> Manual PDF generate + finalize
  HistoryList.tsx        -> History table + stats
lib/
  firebase.ts   -> Firebase init (reads env vars)
  types.ts      -> Task / DailyReport types
  team.ts       -> Editable team roster
  reports.ts    -> Firestore read/write helpers
  generateReportPdf.ts -> Branded PDF layout
firestore.rules -> Firestore security rules (copy into Firebase console)
