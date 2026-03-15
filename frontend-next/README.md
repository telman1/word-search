# Word Search MVP - Frontend (Next.js)

This is the Next.js frontend for the Word Search MVP application.

## Setup Instructions

### Prerequisites
- Node.js 18+
- npm
- Backend Strapi server running (see backend README)

### Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.local.example .env.local
   ```
   
   Update `.env.local` with your Strapi backend URL if different from `http://localhost:1337`

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Access the application:**
   - Open http://localhost:3000
   - Search for words using the search input
   - Click on words to view detailed information

## Features

### Search Page (/)
- Debounced search input (300ms delay)
- Real-time search results from Strapi API
- Shows word lemma, language, part of speech
- Displays related words grouped by relation type
- Clickable links to word detail pages

### Word Detail Page (/word/[id])
- Complete word information display
- All linguistic fields (lemma, affix, root, stem, etc.)
- Grouped relations by type (synonym, translation, stem, derived, related)
- Clickable links to related words
- Notes and comments display

## API Integration

The frontend connects to Strapi backend endpoints:

- `GET /api/words?filters[lemma][$contains]=query&populate=...` - Search words
- `GET /api/words/:id?populate=*` - Get word details with all relations

## Styling

- Uses SCSS for styling
- Responsive design with mobile-first approach
- Clean, modern UI with hover effects
- Color-coded relation types and parts of speech

## Development

- **Framework:** Next.js 14 with App Router
- **Language:** TypeScript
- **Styling:** SCSS
- **API:** REST API calls to Strapi backend

## Production Notes

For production deployment:
1. Update `NEXT_PUBLIC_API_BASE_URL` to your production Strapi URL
2. Build the application: `npm run build`
3. Start production server: `npm start`
4. Configure proper CORS settings in Strapi backend
