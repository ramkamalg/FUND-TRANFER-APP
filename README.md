# FUND-TRANFER-APP

Full-stack demo e-wallet / fund transfer application.

This project combines a static front-end with a simple Node.js + Express + SQLite backend. It lets you register/login, transfer funds between demo users, and view transaction history.

## Quick start

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables (optional)

Copy `.env.example` to `.env` and tweak as needed:

```bash
cp .env.example .env
```

| Variable | Purpose | Default |
| --- | --- | --- |
| `PORT` | HTTP server port | `3000` |
| `JWT_SECRET` | Secret key for signing JWT access tokens | `super-secret-change-me` |
| `DB_FILE` | Path to SQLite database file | `data.sqlite` |
| `DEFAULT_SEED_PASSWORD` | Password used for seeding demo users | `password` |
| `LOCALE` | Locale for currency formatting | `en-US` |
| `DEFAULT_CURRENCY` | Currency code for formatting | `USD` |

### 3. Run the server

```bash
npm start
# server listens on http://localhost:3000
```

Open `http://localhost:3000/loginpage.html` in your browser.

Demo accounts are seeded automatically:

- `alice / password`
- `bob / password`

## Running tests

Automated tests (Jest + Supertest) cover login, profile retrieval, transfers, and transaction listing.

```bash
npm test
```

Tests spin up the API using an isolated SQLite database under `tests/test.sqlite`.

## Project structure

```text
FUND-TRANFER-APP/
├── index.html            # splash / redirect page
├── loginpage.html        # login + registration UI
├── Record.html           # authenticated dashboard
├── server.js             # Express API + SQLite storage
├── package.json          # dependencies & scripts
├── .env.example          # reference for config
├── scriptNDC/            # front-end JavaScript
│   ├── login.js
│   └── record.js
├── layoutNDC/            # CSS
├── NBDCo/resource/       # images / assets
└── tests/                # Jest API tests
```

## Development tips

- Tokens are stored in `localStorage` (`ft_token`). Clearing it forces re-login.
- Transaction history highlights incoming vs outgoing transfers and shows formatted amounts.
- Currency/locale formatting is driven by `LOCALE` and `DEFAULT_CURRENCY` env vars.
- `data.sqlite` is ignored by default; delete it to reset the database.

## Contributing

1. Create a feature branch from `main` or keep working on the existing `feature/backend` branch.
2. Run `npm test` to verify backend endpoints.
3. Update this README or add docs when introducing new flows.
4. Include a test plan in PRs: which pages you opened and what you verified.

## License

See the `LICENSE` file at the repo root.
