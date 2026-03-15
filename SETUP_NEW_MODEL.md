# Setup: New Word Entry Model

This project has been updated with a new data model for the translation dictionary.

## Data Model Overview

### Book (updated)
- `nameArmenian` - Book name in Armenian (Eastern/Western combined)
- `nameOriginalLanguage` - Book name in original language
- `originalLanguageType` - english, french, german, italian, other

### Translator (updated)
- `nameArmenian` - Translator name in Armenian
- `nameOriginalLanguage` - Translator name in original language
- `originalLanguageType` - english, french, german, italian, other

### Word Entry (new)
Each row represents one complete word unit entry with:
- **Selectable:** Book, Translator (from existing records)
- **Word units:** Eastern Armenian, Western Armenian, Original language
- **Suggested equivalents:** Armenian, Original
- **Extra:** Translator commentary, Word meaning/sense
- **Context:** Armenian passage, Original passage

## First-Time Setup

### 1. Reset database (if you have old data)

Since the schema changed, you may need to reset:

```bash
cd backend-strapi
# Remove database and restart (Docker)
docker-compose down -v
docker-compose up
```

Or for local PostgreSQL, drop and recreate the database.

### 2. Restart Strapi

```bash
cd backend-strapi
npm run develop
```

On first run, Strapi will:
- Create the new Word Entry content type
- Apply the Book and Translator schema changes
- Run bootstrap: grant Public API permissions and create sample data (if empty)

### 3. Strapi Admin

1. Go to http://localhost:1337/admin
2. **Content Manager** → Create entries:
   - **Book** – Add books (name in Armenian + original language)
   - **Translator** – Add translators
   - **Word Entry** – Create word entries; select Book and Translator from dropdowns, fill all table columns

### 4. Frontend

```bash
cd frontend-next
npm run dev
```

Visit http://localhost:3000 — search is case-insensitive and runs across the first 5 word columns in real time.

## API Permissions

The bootstrap script grants the Public role `find` and `findOne` for:
- `api::word-entry.word-entry`
- `api::book.book`
- `api::translator.translator`

If you see 403 errors, check **Settings → Users & Permissions → Roles → Public** and ensure these permissions are enabled.
