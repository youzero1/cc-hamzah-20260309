# cc — Social Calculator

A fully functional calculator with a social media-inspired design, built with Next.js, TypeScript, and SQLite.

## Features

- **Calculator**: Full arithmetic support (+, −, ×, ÷, %, ±, decimal)
- **Keyboard Support**: Type numbers and operators directly
- **Calculation History**: Persisted to SQLite, shown in the sidebar
- **Community Feed**: Share calculations publicly; other users can like them
- **Modern UI**: Dark theme with purple/pink gradient accents

## Getting Started

### Prerequisites

- Node.js 20+
- npm

### Local Development

```bash
# Install dependencies
npm i

# Start development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000).

### Environment Variables

The `.env` file is pre-configured:

```
DATABASE_PATH=./data/cc.sqlite
NEXT_PUBLIC_APP_NAME=cc
```

The `data/` directory is created automatically on first run.

### Production Build

```bash
npm run build
npm start
```

### Docker

```bash
# Build and run with Docker Compose
docker-compose up -d

# Or build manually
docker build -t cc .
docker run -p 3000:3000 -v cc_data:/app/data cc
```

## Usage

1. **Calculate**: Click buttons or use your keyboard.
2. **Share**: After evaluating an expression, click **"Share to Community"** to post it to the feed.
3. **Like**: Click the heart button on any shared calculation in the community feed.
4. **History**: Your recent calculations appear below the calculator. Click any to restore it.

## Tech Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **TypeORM** + **better-sqlite3**
- **CSS Variables** (no external CSS framework)

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── calculations/      # CRUD for calculations
│   │   └── history/           # Shared feed + likes
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── Button.tsx
│   ├── Calculator.tsx
│   ├── CalculationHistory.tsx
│   ├── Display.tsx
│   └── SharedCalculations.tsx
├── entities/
│   └── Calculation.ts
├── lib/
│   └── database.ts
└── types/
    └── index.ts
```
