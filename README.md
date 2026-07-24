![TVDex](public/icon.svg)

# 📺 TVDex

> The smartest way to explore TV channels. Search by number or name, filter by language and genre, and stay up to date with the latest channel lineups.

## ✨ Features

- **🔍 Instant Search** — Search by channel name or number with real-time highlighting
- **🔗 Shareable URLs** — Filters and search queries sync to the URL instantly so you can bookmark or share specific views
- **🌐 Multi-Language Filters** — Filter across 12 Indian languages (Hindi, English, Telugu, Tamil, Kannada, Malayalam, Marathi, Gujarati, Punjabi, Bengali, Assamese, Odia)
- **🎭 Genre Filters** — Entertainment, News, Sports, Movies, Kids, Devotional, Music, and more
- **📊 Grouped View** — Channels organized by Language + Genre with collapsible tables
- **🎨 Premium UI** — Dynamic Glassmorphism theme with Animated Aurora backgrounds and table hover glows
- **📄 PDF Download** — Clean A4-printable channel list with print-optimized styles
- **⚡ Offline-First** — Data cached in localStorage, auto-refreshes when updates are available
- **🔗 REST API** — Public API with search, filter, sort, pagination, and grouping
- **🛡️ Rate Limited** — API protected with Upstash Redis rate limiting (10 req/min/IP)

## 🚀 Live Demo

> Coming soon on Vercel!

## 📡 Supported Platforms

| Platform | Status | Channels |
|----------|--------|----------|
| Jio STB (Set-Top Box) | ✅ Available | 816 |
| Airtel DTH | 🔜 Coming Soon | — |
| Tata Play | 🔜 Coming Soon | — |
| Dish TV | 🔜 Coming Soon | — |
| Videocon d2h | 🔜 Coming Soon | — |

> **Want to add a platform?** See [CONTRIBUTING.md](CONTRIBUTING.md) for details.

## 🛠️ Tech Stack

- **Framework:** [Next.js 16](https://nextjs.org/) (App Router)
- **Language:** TypeScript
- **Styling:** [Tailwind CSS 4](https://tailwindcss.com/)
- **Rate Limiting:** [Upstash Redis](https://upstash.com/) + [@upstash/ratelimit](https://github.com/upstash/ratelimit)
- **Deployment:** [Vercel](https://vercel.com/)
- **Package Manager:** npm

## 📦 Getting Started

### Prerequisites

- Node.js 20+
- npm 10+

### Installation

```bash
# Clone the repo
git clone https://github.com/YOUR_USERNAME/TVDex.git
cd TVDex

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

### Environment Variables (Optional)

Rate limiting requires an Upstash Redis database. Create a free one at [upstash.com](https://upstash.com) and set:

```bash
cp .env.example .env.local
# Edit .env.local with your Upstash credentials
```

| Variable | Description |
|----------|-------------|
| `KV_REST_API_URL` | Upstash Redis REST URL |
| `KV_REST_API_TOKEN` | Upstash Redis REST token |

> Without these, the API works normally — rate limiting is simply skipped.

## 🔗 API Usage

### Endpoint

```
GET /api/channels
```

### Query Parameters

| Param | Type | Description | Example |
|-------|------|-------------|---------|
| `search` | string | Search by name/number | `?search=cartoon` |
| `language` | string | Filter by language | `?language=Telugu,Hindi` |
| `genre` | string | Filter by genre | `?genre=News` |
| `sort` | string | Sort by: `name`, `number`, `genre` | `?sort=name` |
| `order` | string | `asc` or `desc` | `?order=desc` |
| `page` | number | Page number | `?page=2` |
| `limit` | number | Items per page (max 200) | `?limit=25` |
| `group_by` | string | Group: `language`, `genre`, `language_genre` | `?group_by=language` |

### Example

```bash
curl "https://your-app.vercel.app/api/channels?language=Telugu&genre=News&sort=name"
```

## 🤝 Contributing

We welcome contributions! Whether it's adding a new DTH platform, fixing bugs, or improving the UI — all help is appreciated.

See [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines.

## 📄 License

This project is licensed under the GNU GPL v3.0 License — see the [LICENSE](LICENSE) file for details.

## 🙏 Disclaimer

TVDex is not affiliated with, endorsed by, or connected to Jio, Airtel, Tata Play, or any DTH/cable service provider. Channel data is sourced from publicly available official channel lists and is provided for informational purposes only.
