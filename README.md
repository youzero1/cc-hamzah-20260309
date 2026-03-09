# cc — Calculator App

A social media-inspired calculator built with Next.js, TypeScript, and SQLite.

## Features

- Basic arithmetic operations (+, -, ×, ÷)
- Percentage and negation
- Persistent calculation history (SQLite via TypeORM)
- Social-style history feed with relative timestamps
- Share button to copy results to clipboard
- Keyboard input support
- Responsive dark UI

## Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Docker

```bash
docker-compose up --build
```

## Environment Variables

| Variable | Default | Description |
|---|---|---|
| `DATABASE_PATH` | `./data/calculator.sqlite` | Path to SQLite database |
| `NEXT_PUBLIC_APP_NAME` | `cc` | App display name |
