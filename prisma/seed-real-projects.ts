import { PrismaClient } from "@prisma/client";

// Seeds Neri's five real projects (copy derived from each repo's README/code).
// Run: npx tsx prisma/seed-real-projects.ts
const prisma = new PrismaClient();

type Status = "completed" | "in_progress" | "archived";

interface P {
  id: string;
  titleHe: string;
  titleEn: string;
  shortHe: string;
  shortEn: string;
  descHe: string;
  descEn: string;
  tags: string[];
  slug: string; // matches /public/covers/<slug>.webp
  status: Status;
  year: number;
  featured: boolean;
  order: number;
  /** Public URL of the running app. Absent for local/desktop builds — those
   *  render the steady "completed" badge instead of the pulsing "live" one. */
  liveUrl?: string;
  /** Only set this for repos that are public. A private repo 404s for every
   *  visitor while still loading fine for the signed-in owner, so a link to one
   *  looks healthy in testing and is broken for everyone else. */
  githubUrl?: string;
}

const projects: P[] = [
  {
    id: "sqlconfig",
    titleHe: "מחולל קובצי תצורה ל-SQL Server",
    titleEn: "SQL Server Config Generator",
    shortHe:
      "כלי דפדפן להפקת ConfigurationFile.ini להתקנה שקטה של SQL Server — אשף מודרך, תצוגה חיה והורדה מוכנה, ללא שרת.",
    shortEn:
      "A browser tool that builds a SQL Server ConfigurationFile.ini for unattended installs — guided wizard, live preview, ready-to-run download, no backend.",
    descHe:
      "כלי צד-לקוח לחלוטין שמייצר קובץ ConfigurationFile.ini להתקנה שקטה (Unattended) של SQL Server. המשתמש עובר אשף בן 12 שלבים — גרסה, סוג התקנה, instance, רכיבים, חשבונות שירות, אימות, מנהלי מערכת, נתיבי נתונים, TempDB, פרוטוקולי רשת ורישוי — ורואה בזמן אמת כיצד נבנים קובץ ה-ini, פקודת ה-setup.exe וסקריפט PowerShell.\n\nהכלי כולל ולידציה חכמה (חוקי שם instance, מד חוזק לסיסמת SA, בדיקת נתיבים), ייצוא ל-ZIP (ini + install.cmd + install.ps1), קישור-שיתוף שמקודד את כל התצורה ב-URL (בלי הסיסמה), מצב כהה/בהיר, תמיכת מקלדת מלאה ו-ARIA, ועובד אופליין כ-PWA. הכול רץ בדפדפן — שום מידע לא נשלח לשרת.",
    descEn:
      "A fully client-side tool that generates a SQL Server ConfigurationFile.ini for unattended installs. A 12-step wizard covers version, install type, instance, features, service accounts, authentication, administrators, data directories, TempDB, network protocols and licensing, with a live preview of the .ini file, the setup.exe command and a PowerShell script as you type.\n\nIt adds smart validation (instance-name rules, an SA-password strength meter, path checks), ZIP export (.ini + install.cmd + install.ps1), a share link that encodes the whole config in the URL (never the password), light/dark themes, full keyboard + ARIA support, and offline use as an installable PWA. Everything runs in the browser — nothing is ever sent to a server.",
    tags: ["HTML", "CSS", "JavaScript", "PWA"],
    slug: "sqlconfig",
    status: "completed",
    year: 2026,
    featured: true,
    order: 1,
    liveUrl: "https://generate-sql-server-configuration-i.vercel.app/",
    githubUrl: "https://github.com/neriedri/Generate-SQL-Server-Configuration_ini",
  },
  {
    id: "fincoreai",
    titleHe: "FinCoreAI — מערכת לניהול פיננסי אישי",
    titleEn: "FinCoreAI — Personal Finance Intelligence System",
    shortHe:
      "מערכת לניהול פיננסי ופנסיוני אישי בשלוש חזיתות — API, אפליקציית דסקטופ ואתר — עם מנוע סיווג עסקאות חכם ותמיכת RTL מלאה.",
    shortEn:
      "A tri-surface personal-finance & pension system — REST API, desktop app and web client — with a smart transaction-classification engine and full RTL support.",
    descHe:
      "מערכת לניהול פיננסי ופנסיוני אישי הבנויה בארכיטקטורת שכבות נקייה: שכבת API מבוססת FastAPI, שכבת שירותים עסקית, שכבת נתונים מבוססת SQLAlchemy מעל SQLite (מתוכננת למעבר ל-PostgreSQL), ושתי חזיתות משתמש — אפליקציית דסקטופ ב-PySide6 (Qt) ואתר React/TypeScript — שתיהן מדברות עם אותו ה-API.\n\nהמערכת כוללת מנוע \"אינטליגנציה\" לעיבוד עסקאות: סיווג אוטומטי מבוסס-חוקים בשילוב AI, זיהוי כפילויות, זיהוי העברות בין חשבונות ונורמליזציה, לצד ייבוא מ-CSV/Excel (Pandas), דשבורד KPI, אימות מקומי עם סיסמאות מוצפנות (bcrypt) והצפנת שדות רגישים (AES-256-GCM). הממשק נבנה RTL-first לעברית.",
    descEn:
      "A personal finance and pension management system built on a clean layered architecture: a FastAPI REST layer, a business service layer, a SQLAlchemy data layer over SQLite (designed to migrate to PostgreSQL), and two user surfaces — a PySide6 (Qt) desktop app and a React/TypeScript web client — both talking to the same API.\n\nIt features an \"intelligence\" engine for transactions: rule-based plus AI-assisted auto-classification, duplicate detection, inter-account transfer detection and normalization, alongside CSV/Excel import (Pandas), a KPI dashboard, local authentication with hashed passwords (bcrypt) and field-level encryption of sensitive data (AES-256-GCM). The interface is built RTL-first for Hebrew.",
    tags: ["Python", "FastAPI", "PySide6", "React", "TypeScript", "SQLAlchemy", "Tailwind CSS", "AI"],
    slug: "fincoreai",
    status: "in_progress",
    year: 2026,
    featured: true,
    order: 2,
  },
  {
    id: "embytrial",
    titleHe: "embyIL Trial Creator — יוצר חשבונות אוטומטי",
    titleEn: "embyIL Trial Creator",
    shortHe:
      "כלי דסקטופ ב-Python שמבצע תהליך הרשמה אוטומטי מלא — דפדפן אוטומטי, מייל חד-פעמי, אימות, שמירה ל-DB והתראות Telegram.",
    shortEn:
      "A Python desktop tool that runs a full automated sign-up flow — browser automation, disposable email, verification, DB storage and Telegram alerts.",
    descHe:
      "כלי דסקטופ ב-Python המבצע את תהליך ההרשמה המלא לפלטפורמת embyIL ללא מגע יד אדם. הכלי מפעיל דפדפן Chromium דרך Playwright, יוצר כתובת מייל חד-פעמית דרך ה-API של mail.tm, ממלא ושולח את טופס ההרשמה, סורק את תיבת הדואר עד למציאת קישור האימות, מאשר את החשבון, מתחבר ויוצר משתמש צופה — הכול ברצף, אוטומטית.\n\nכל החשבונות נשמרים ב-SQLite מקומי, מיוצאים ל-CSV ונשלחים בזמן אמת ל-Telegram. הממשק הוא דשבורד כהה ב-Tkinter/ttk עם טבלת חשבונות ממוינת, לוג אירועים צבעוני ומעקב התקדמות חי, כשהאוטומציה רצה ב-thread רקע כדי לשמור על ממשק מגיב.",
    descEn:
      "A single-file Python desktop tool that runs embyIL's entire trial-account registration flow with no manual interaction. It launches a Chromium browser via Playwright, creates a disposable email through the mail.tm API, fills and submits the sign-up form, polls the inbox for the verification link, confirms the account, logs in and creates a viewer user — all in sequence, automatically.\n\nEvery account is stored in a local SQLite database, exported to CSV, and pushed to Telegram in real time. The GUI is a dark Tkinter/ttk dashboard with a sortable accounts table, a color-coded event log and live progress tracking, with the automation running on a background thread to keep the UI responsive.",
    tags: ["Python", "Playwright", "Tkinter", "SQLite", "Automation", "Telegram Bot"],
    slug: "embytrial",
    status: "completed",
    year: 2026,
    featured: false,
    order: 3,
  },
  {
    id: "ardani",
    titleHe: "Ardani Setup System — אוטומציית התקנת SQL Server",
    titleEn: "Ardani Setup System",
    shortHe:
      "אפליקציית דסקטופ ל-Windows שמאוטמטת התקנה והגדרה של SQL Server (2017–2025) — אשף עברית RTL, סריקת סביבה, הגדרת רשת/חומת-אש וייצוא סקריפטים.",
    shortEn:
      "A Windows desktop app that automates SQL Server (2017–2025) install & configuration — a Hebrew RTL wizard, environment scan, networking/firewall setup and script export.",
    descHe:
      "אפליקציית דסקטופ ל-Windows ב-Python שמייעלת התקנה, הגדרה והקמת סביבה של SQL Server. הכלי מציג אשף בן 6 עמודים ב-PySide6 (Qt) עם עברית RTL מלאה, שער סיסמה ומעבר בין מצב כהה/בהיר, ותומך בגרסאות SQL Server 2017, 2019, 2022 ו-2025.\n\nמתחת למכסה: סריקת סביבה אוטומטית (instances קיימים, SSMS, פורטים), הגדרת Mixed Mode ו-TCP/IP דרך WMI ו-Windows Registry, ניהול חוקי חומת-אש ושירותים דרך PowerShell, יצירת מבנה תיקיות והרשאות, וייצוא סקריפטי התקנה עצמאיים (PowerShell / Batch / Python). משימות כבדות רצות ב-QThread, והאפליקציה נארזת לקובץ exe יחיד עם PyInstaller.",
    descEn:
      "A Windows Python desktop application that streamlines SQL Server installation, configuration and environment setup. It presents a 6-page PySide6 (Qt) wizard with full Hebrew RTL, a password gate and light/dark theming, and supports SQL Server 2017, 2019, 2022 and 2025.\n\nUnder the hood: automatic environment scanning (existing instances, SSMS, ports), Mixed Mode and TCP/IP configuration via WMI and the Windows Registry, firewall-rule and service management via PowerShell, folder-structure and permission creation, and export of standalone install scripts (PowerShell / Batch / Python). Long-running work runs on QThreads, and the app packages to a single .exe with PyInstaller.",
    tags: ["Python", "PySide6", "PowerShell", "WMI", "PyInstaller", "SQL Server"],
    slug: "ardani",
    status: "completed",
    year: 2026,
    featured: false,
    order: 4,
  },
  {
    id: "zfb",
    titleHe: "ZFB Order Center — ניהול הזמנות והצעות מחיר",
    titleEn: "ZFB Order Center",
    shortHe:
      "מערכת Full-stack לניהול הזמנות והצעות מחיר לעסק (קייטרינג/מאפייה) — FastAPI אסינכרוני, PostgreSQL, Celery/Redis והפקת PDF בעברית, מול ממשק React.",
    shortEn:
      "A full-stack orders & quotes system for a catering/bakery business — async FastAPI, PostgreSQL, Celery/Redis and Hebrew PDF generation, with a React frontend.",
    descHe:
      "מערכת Full-stack לניהול הזמנות והצעות מחיר לעסק. ה-Backend בנוי ב-Python/FastAPI אסינכרוני מעל PostgreSQL (SQLAlchemy 2.0 async + asyncpg, מיגרציות Alembic), עם אימות JWT וכן refresh tokens (python-jose + passlib/bcrypt), הגבלת קצב (slowapi), ומשימות רקע ותזמון עם Celery + Redis.\n\nהמערכת מפיקה הצעות מחיר כ-PDF בעברית RTL (Playwright/ReportLab + python-bidi + Jinja2) ושולחת מיילים דרך Resend. ה-Frontend בנוי ב-React + TypeScript + Vite + Tailwind, עם ניהול state ב-TanStack Query ו-Zustand, טפסים ב-react-hook-form + Zod, גרפים ב-Recharts ואנימציות ב-Framer Motion. כל המערך ארוז ב-Docker (PostgreSQL, Redis, Nginx).",
    descEn:
      "A full-stack orders and quotes system for a business. The backend is built in async Python/FastAPI over PostgreSQL (SQLAlchemy 2.0 async + asyncpg, Alembic migrations), with JWT authentication plus refresh tokens (python-jose + passlib/bcrypt), rate limiting (slowapi), and background tasks and scheduling via Celery + Redis.\n\nIt generates quotes as Hebrew RTL PDFs (Playwright/ReportLab + python-bidi + Jinja2) and sends email through Resend. The frontend is React + TypeScript + Vite + Tailwind, with TanStack Query and Zustand for state, react-hook-form + Zod for forms, Recharts for charts and Framer Motion for animation. The whole stack is containerized with Docker (PostgreSQL, Redis, Nginx).",
    tags: ["Python", "FastAPI", "PostgreSQL", "Celery", "Redis", "React", "TypeScript", "Docker"],
    slug: "zfb",
    status: "in_progress",
    year: 2026,
    featured: true,
    order: 5,
    liveUrl: "https://zfborder.org",
  },
];

async function main() {
  const ids = projects.map((p) => p.id);

  for (const p of projects) {
    const data = {
      titleHe: p.titleHe,
      titleEn: p.titleEn,
      shortDescriptionHe: p.shortHe,
      shortDescriptionEn: p.shortEn,
      descriptionHe: p.descHe,
      descriptionEn: p.descEn,
      // Real screenshots, committed under public/ so they ship with the build —
      // public/uploads is gitignored and never reaches the deployment.
      coverImage: `/covers/${p.slug}.webp`,
      images: [],
      tags: p.tags,
      featured: p.featured,
      order: p.order,
      visible: true,
      year: p.year,
      status: p.status as never,
      liveUrl: p.liveUrl ?? null,
      githubUrl: p.githubUrl ?? null,
    };
    await prisma.project.upsert({
      where: { id: p.id },
      create: { id: p.id, ...data },
      update: data,
    });
    console.log("upserted", p.id);
  }

  // Hide the earlier mock/demo projects so the home shows only the real work.
  const hidden = await prisma.project.updateMany({
    where: { id: { notIn: ids } },
    data: { visible: false },
  });
  console.log(`hid ${hidden.count} non-real (mock) projects`);
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
