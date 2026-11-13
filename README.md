# Bonny Eagle Boys Basketball: Website

Team website and "Get Involved" sign-up dashboard for Bonny Eagle Scots boys basketball (Bonny Eagle High School, Standish, ME). Built by [Real Easy Sites](https://getrealeasysites.com) on the Fight Card template.

## Stack
- Node 20 + Express, SQLite (better-sqlite3)
- `server.js` is the entry point. Logic lives in `lib/` (db, auth, mailer) and `routes/` (public form API, admin dashboard)
- Static site in `public/`

## Run locally
```bash
npm install
ADMIN_PASSWORD=choose-one npm start
# http://localhost:3000 and http://localhost:3000/admin
```

## Schedule
The 2026–27 varsity schedule is in `public/index.html` (the `.game` list items, each with a `data-date`). The page greys out games that have been played, highlights the next game, and shows it in the top banner automatically. Source: the team's 2026–2027 schedule poster on Facebook (white = home, green = away). Tip-off times weren't on the poster.

## Environment
| Var | Purpose |
| --- | --- |
| `ADMIN_PASSWORD` | Dashboard password (password only, no username). Login stays disabled until this is set. |
| `SESSION_SECRET` | Signs the admin session cookie |
| `DB_DIR` | Folder for the SQLite file (use a persistent disk on Render, e.g. `/var/data`) |
| `NOTIFY_EMAIL` | Inbox that gets new sign-up alerts |
| `SMTP_HOST` / `SMTP_PORT` / `SMTP_USER` / `SMTP_PASS` | Outgoing mail for alerts (optional) |

## Dashboard
`/admin` lists every sign-up (clinics, sponsors, boosters, alumni, questions). Each one has a status (new, contacted, scheduled, confirmed or closed), private notes, and a Delete button for spam and test entries.
