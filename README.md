# cc — Calculator

A social media-inspired calculator app built with Next.js, TypeScript, and SQLite.

## Features

- ✅ Basic arithmetic operations (+, -, ×, ÷)
- ✅ Percentage calculations
- ✅ Calculation history (SQLite database)
- ✅ Share/copy results
- ✅ Keyboard support
- ✅ Responsive design
- ✅ Social media-inspired UI

## Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Production with Docker

```bash
docker-compose up -d
```

## Environment Variables

| Variable | Description | Default |
|---|---|---|
| `DATABASE_PATH` | Path to SQLite database file | `./database.sqlite` |
| `NEXT_PUBLIC_APP_NAME` | App name | `cc` |

## API Routes

- `POST /api/calculations` — Save a new calculation
- `GET /api/history` — Get last 20 calculations
