# FUND-TRANFER-APP

Online e‑wallet (static frontend)

This repository contains a small static front-end for a demo "fund transfer" / e‑wallet UI. It is a client-only project (HTML, CSS, JavaScript) with no backend included. Use this project as a UI prototype or lightweight demo.

Quick start

1. Serve the folder locally from the repository root:

```bash
python3 -m http.server 8000
# open http://localhost:8000 in your browser
```

2. Visit the pages to test flows:
- `loginpage.html` — login flow
- `index.html` — landing / dashboard
- `Record.html` — transaction/records page

Where the code lives
- `scriptNDC/` — all client-side JavaScript (`login.js`, `dashbord.js`, `record.js`). Note: some filenames have typos (e.g. `dashbord.js`).
- `layoutNDC/` — CSS and layout styles (`index.css`, `login.css`, `dashboard.css`).
- `NBDCo/resource/` — images and loader assets used by the pages.

How to verify a change
- Make a small change (example: update `layoutNDC/login.css`).
- Run the local server and open `loginpage.html` in a browser.
- Use DevTools Console and Network tab to inspect runtime errors and asset 404s.

AI / agent guidance
- This repo includes `.github/copilot-instructions.md` with guidance for AI agents (run steps, key files, and conventions). See that file for details.

Contributing
- Keep PRs small and focused. In PR descriptions state which pages to open and which interactions to verify (for example: "Open `loginpage.html`, try sign-in with sample credentials, check console for no errors").

License
- See the `LICENSE` file at the repo root (if present).

If you want, I can add a short checklist or example test cases to this README — tell me which pages or flows to document.
