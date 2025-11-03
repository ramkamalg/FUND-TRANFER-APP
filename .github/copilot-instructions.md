# Copilot instructions — FUND-TRANFER-APP

Purpose
- Short, actionable guidance to help AI coding agents work productively in this repository.

Repository snapshot (what to know immediately)
- This is a small static web app / front-end project (no build tool detected).
- Key entry files: `index.html`, `loginpage.html`, `Record.html` at repo root.
- UI assets and styles live under `layoutNDC/` (CSS) and `NBDCo/resource/` (images, loader assets).
- Client-side logic is in `scriptNDC/`: `login.js`, `dashbord.js`, `record.js`.

Top priorities for edits
- Prefer minimal, local changes that preserve the static site behavior. After edits, verify by serving the folder and opening the relevant HTML page.
- When changing styles, update `layoutNDC/*.css` and test `loginpage.html` or `index.html` in a browser.
- When changing login or transfer flows, update `scriptNDC/login.js` and the corresponding HTML form in `loginpage.html`.

How to run & verify locally (no build system)
- Quick static server (dev container / developer machine):

```bash
python3 -m http.server 8000
# then open http://localhost:8000 in browser
```

- Open the specific page (e.g., `http://localhost:8000/loginpage.html`) and use the browser devtools console to observe runtime errors and network activity.

Project-specific patterns and conventions
- All client JavaScript is in `scriptNDC/`. Look there first for behavioral changes.
- Layout and design are CSS-only under `layoutNDC/`. File names include `dashboard.css`, `index.css`, `login.css`.
- Image and loader assets are in `NBDCo/resource/` and `NBDCo/resource/img/`. Use those paths when updating references.
- File-name typos appear (e.g., `dashbord.js` vs “dashboard”) — search for the exact filename when tracing usage.

Common edit examples (use these concrete file references)
- To change login validation: edit `scriptNDC/login.js` and the form in `loginpage.html`.
- To tweak dashboard styles: edit `layoutNDC/dashboard.css` and verify `index.html` or the dashboard page.
- To replace icons/loaders: update files in `NBDCo/resource/` and update `index.html` or `Record.html` references.

Debugging tips (static site)
- Open browser DevTools → Console and Network. Most runtime issues are visible there.
- If JavaScript doesn’t run, ensure the <script> src paths in the HTML match `scriptNDC/<filename>.js` exactly.
- For asset 404s, check `NBDCo/resource/` paths and relative paths in the HTML.

Integration and external dependencies
- This repo appears self-contained (no package.json, go.mod, or requirements.txt). Assume no external package manager is required.
- If you need to add a build step or dependency, add a clear README section and a minimal package manifest (e.g., `package.json`) and prefer zero-impact changes for reviewers.

PR and testing guidance
- Keep PRs small and focused. Include a short test plan in the PR description: which HTML pages to open and which user interactions to verify.
- Add an example screenshot or short GIF for visual changes when possible.

AI-agent specific directives
- Enable Claude Sonnet 3.5 for all clients — prefer that model for reasoning and code generation tasks for this repo.
- When proposing code edits, show the exact file path and a brief verification step (which page to open and what to click). Example: "Edit `scriptNDC/login.js` — after change open `/loginpage.html`, fill username/password, click submit, check console for errors."
- Avoid speculative structural changes (creating backend services or new infra) unless requested; this repo is static-first.

If files are missing or ambiguous
- If you need a build/test command but the repo lacks manifests, ask the maintainer before adding a package manager file.
- If behavior is unclear, point to the nearest file pair: HTML (root) + corresponding JS in `scriptNDC/`.

Where to look next (ordered)
1. `README.md` (root) — repository overview.
2. `index.html`, `loginpage.html`, `Record.html` — pages and link structure.
3. `scriptNDC/` — client logic and flows.
4. `layoutNDC/` and `NBDCo/resource/` — styles and assets.

Feedback
- After reviewing this file, tell me which areas felt incomplete (examples: missing run steps, missing files to open for a specific feature) and I will iterate.

Quick additions
1. other1
2. other2
3. other3
