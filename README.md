# Word Search MVP

A minimal working MVP for a "word search + admin" site similar to formlang.am, built with Strapi (backend/admin) and Next.js (frontend).

## 🚀 Quick Start

### Option 1: Docker Compose (Recommended)

1. **Start both services:**
   ```bash
   cd backend-strapi
   docker-compose up
   ```

2. **In a new terminal, start the frontend:**
   ```bash
   cd frontend-next
   npm install
   npm run dev
   ```

3. **Access the applications:**
   - **Frontend:** http://localhost:3000
   - **Strapi Admin:** http://localhost:1337/admin
   - **Strapi API:** http://localhost:1337/api

### Option 2: Manual Setup

1. **Start PostgreSQL:**
   ```bash
   cd backend-strapi
   docker-compose up postgres -d
   ```

2. **Start Strapi backend:**
   ```bash
   cd backend-strapi
   npm install
   npm run develop
   ```

3. **Start Next.js frontend:**
   ```bash
   cd frontend-next
   npm install
   npm run dev
   ```

## 📁 Project Structure

```
word-search-mvp/
├── backend-strapi/          # Strapi backend with PostgreSQL
│   ├── src/api/            # Collection types (Language, Word, Relation)
│   ├── src/bootstrap.js    # Seed data with Armenian words
│   ├── docker-compose.yml  # PostgreSQL + Strapi setup
│   └── README.md           # Backend setup instructions
├── frontend-next/          # Next.js frontend
│   ├── src/app/            # App router pages
│   ├── src/styles/         # SCSS styles
│   └── README.md           # Frontend setup instructions
└── README.md               # This file
```

## 🎯 Features

### Admin (Strapi)
- ✅ Create/manage words, languages, and relations
- ✅ Built-in admin UI at `/admin`
- ✅ REST API endpoints for frontend
- ✅ Sample Armenian words with linguistic relations

### Frontend (Next.js)
- ✅ `/search` page with debounced search (300ms)
- ✅ `/word/[id]` detail page with grouped relations
- ✅ Responsive SCSS styling
- ✅ Real-time API integration

## 🗄️ Data Model

### Language
- `name` (string) - e.g., "Armenian"
- `code` (string) - e.g., "hy"

### Word
- `lemma` (string) - The word form
- `lemma_part`, `affix`, `affix_number`, `affix_type`
- `root`, `root_number`, `stem`, `ordinal`
- `part_of_speech`, `notes`
- `language` (relation to Language)

### Relation
- `from_word` (relation to Word)
- `to_word` (relation to Word)
- `relation_type` (enum: synonym, translation, stem, derived, related)
- `weight` (integer) - for ranking
- `comment` (string)

## 🔌 API Examples

**Search words containing "տուն":**
```bash
curl "http://localhost:1337/api/words?filters[lemma][$contains]=տուն&populate=language,relations_from.to_word,relations_to.from_word"
```

**Get word details:**
```bash
curl "http://localhost:1337/api/words/1?populate=*"
```

## 📊 Sample Data

The bootstrap script creates:
- Armenian language (hy)
- 8 Armenian words related to "տուն" (house)
- 7 relations showing linguistic relationships:
  - Stem relations (տան, տանը, տներ, տներում)
  - Derived relations (տնակ, տնային, տնակային)

## 🛠️ Development

### Backend (Strapi)
- **Database:** PostgreSQL via Docker
- **Environment:** `.env` file with database settings
- **Bootstrap:** Automatic seed data on first run

### Frontend (Next.js)
- **Framework:** Next.js 14 with App Router
- **Styling:** SCSS with responsive design
- **API:** REST calls to Strapi backend
- **Environment:** `.env.local` for API URL

## 🚀 Production deployment

**Push to deploy:** connect the repo to Render once using the root [`render.yaml`](render.yaml) (Blueprint), then keep pushing to `main` — Render rebuilds backend + frontend automatically. Details: **[DEPLOYMENT.md](./DEPLOYMENT.md)**.

### Backend
- [ ] Update `.env` with production database credentials (see `backend-strapi/.env.example`)
- [ ] Generate new secrets for APP_KEYS, API_TOKEN_SALT, etc.
- [ ] Use SSL for managed Postgres (`DATABASE_URL` / provider docs)
- [ ] Set `CORS_ORIGIN` to your frontend’s public HTTPS origin

### Frontend
- [ ] Set `NEXT_PUBLIC_API_BASE_URL` to production Strapi URL (`frontend-next/.env.local.example`)
- [ ] Build: `npm run build` — deploy the `frontend-next` app on your host

## 🎉 Verification

After setup, you should be able to:

1. **Access Strapi Admin:** http://localhost:1337/admin
   - Create admin account on first run
   - View sample Armenian words and relations
   - Create new words and relations

2. **Use Frontend Search:** http://localhost:3000
   - Search for "տուն" and see results
   - Click on words to view detailed information
   - Navigate between related words

3. **Test API Endpoints:**
   - Search API returns words with relations
   - Word detail API returns complete word data
   - Relations are properly grouped by type

## 📝 Next Steps

To make this production-ready:
- Add authentication/authorization
- Implement caching (Redis/Meilisearch)
- Add more languages and word types
- Enhance search with fuzzy matching
- Add word frequency and usage statistics
- Implement user favorites and history
