# Word Search MVP - Backend (Strapi)

This is the Strapi backend for the Word Search MVP application.

## Setup Instructions

### Prerequisites
- Node.js 18+ 
- Docker and Docker Compose
- npm

### Quick Start with Docker Compose

1. **Start PostgreSQL and Strapi:**
   ```bash
   docker-compose up
   ```

2. **Access Strapi Admin:**
   - Open http://localhost:1337/admin
   - Create your admin account on first run
   - The bootstrap script will automatically create sample Armenian words and relations

### Manual Setup (Alternative)

1. **Start PostgreSQL:**
   ```bash
   docker-compose up postgres -d
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start Strapi:**
   ```bash
   npm run develop
   ```

4. **Access Strapi Admin:**
   - Open http://localhost:1337/admin
   - Create your admin account

## API Endpoints

The following REST API endpoints are available:

- `GET /api/languages` - List all languages
- `GET /api/words` - List all words
- `GET /api/words/:id` - Get specific word
- `GET /api/words?filters[lemma][$contains]=տուն&populate=language,relations_from,relations_to` - Search words
- `GET /api/relations` - List all relations

### Example API Requests

**Search for words containing "տուն":**
```bash
curl "http://localhost:1337/api/words?filters[lemma][$contains]=տուն&populate=language,relations_from,relations_to"
```

**Get a specific word with all relations:**
```bash
curl "http://localhost:1337/api/words/1?populate=*"
```

## Collection Types

### Language
- `name` (string, required) - Language name (e.g., "Armenian")
- `code` (string, required) - Language code (e.g., "hy")

### Word
- `lemma` (string, required) - The word form
- `lemma_part` (string) - Part of lemma if needed
- `affix` (string) - Affix information
- `affix_number` (string) - Affix number
- `affix_type` (enum) - prefix, suffix, infix, none
- `root` (string) - Root form
- `root_number` (string) - Root number
- `stem` (string) - Stem form
- `ordinal` (string) - Ordinal information
- `part_of_speech` (string) - Part of speech
- `notes` (richtext) - Additional notes
- `language` (relation) - Associated language

### Relation
- `from_word` (relation) - Source word
- `to_word` (relation) - Target word
- `relation_type` (enum) - synonym, translation, stem, derived, related
- `weight` (integer) - Relation weight for ranking
- `comment` (string) - Additional comment

## Sample Data

The bootstrap script creates:
- Armenian language (hy)
- 8 sample Armenian words related to "տուն" (house)
- 7 relations showing various linguistic relationships

## Development

- **Database:** PostgreSQL (configured in docker-compose.yml)
- **Environment:** Development settings in .env
- **Bootstrap:** Sample data is created automatically on first run

## Production Notes

For production deployment:
1. Update .env with production database credentials
2. Generate new secrets for APP_KEYS, API_TOKEN_SALT, etc.
3. Set DATABASE_SSL=true for secure connections
4. Configure proper CORS settings for your frontend domain
