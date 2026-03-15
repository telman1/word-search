# Database Setup Guide

## Overview

Your application uses **PostgreSQL** as the database. The database setup is **fully automated** when using the Render Blueprint.

## Automatic Setup (Using render.yaml)

When you deploy using the Blueprint, Render will:

1. ✅ **Automatically create** a PostgreSQL database named `word-search-db`
2. ✅ **Automatically connect** it to your Strapi backend
3. ✅ **Automatically configure** the connection string via `DATABASE_URL`

**No manual database setup needed!**

## Database Configuration

The database is configured in `render.yaml`:

```yaml
databases:
  - name: word-search-db
    plan: starter          # Free tier available
    region: oregon         # Choose your region
    databaseName: word_search
    user: word_search_user
```

## What Happens on First Deploy

### 1. Database Creation
- Render creates an empty PostgreSQL database
- Connection string is automatically provided to Strapi

### 2. Schema Creation (Automatic)
When Strapi starts for the first time, it will:
- Read all your collection type schemas (Word, Author, Translator, Book, etc.)
- **Automatically create all database tables**
- Set up all relations and indexes
- No migrations needed - Strapi handles this!

### 3. Initial Data (Bootstrap)
The `bootstrap.js` script runs automatically and creates:
- 1 Sample Author
- 1 Sample Translator  
- 1 Sample Book
- 4 Sample Words with translations
- Connections between words

## Database Schema

Your database will contain these tables (created automatically):

### Collection Types
- `words` - Main word entries
- `authors` - Book authors
- `translators` - Book translators
- `books` - Books containing words
- `relations` - Word relations (if you keep this)

### System Tables (Strapi)
- `strapi_core_store_settings` - Strapi settings
- `strapi_migrations` - Migration history
- `strapi_database_schema` - Schema metadata
- `up_users` - User accounts (if using Users & Permissions)
- `up_roles` - User roles
- `up_permissions` - Permissions

## Database Connection

The connection is configured via environment variables:

```env
DATABASE_CLIENT=postgres
DATABASE_URL=<automatically provided by Render>
DATABASE_SSL_REJECT_UNAUTHORIZED=false
```

The `DATABASE_URL` from Render includes:
- Host
- Port
- Database name
- Username
- Password
- SSL configuration

## Accessing Your Database

### Option 1: Render Dashboard
1. Go to Render Dashboard
2. Click on `word-search-db`
3. View connection info in the **"Info"** tab
4. Use **"Connect"** tab for external tools

### Option 2: External Tools
You can connect using:
- **pgAdmin** (GUI)
- **DBeaver** (GUI)
- **psql** (Command line)
- **TablePlus** (Mac/Windows)

Connection details are in your Render dashboard under the database service.

## Database Backups

### Render Free Tier
- Automatic daily backups
- 7 days retention
- Manual backup option available

### Upgrading
- Paid plans offer longer retention
- Point-in-time recovery available
- Automated backup scheduling

## Database Migrations

### Automatic Migrations
Strapi automatically handles schema changes:
- When you add new fields → Tables update automatically
- When you create new collection types → New tables created
- When you modify relations → Foreign keys updated

### Manual Migrations (Advanced)
If you need custom migrations, you can:
1. Create migration files in `database/migrations/`
2. Strapi will run them on startup

## Production Considerations

### Database Size
- Free tier: 1 GB storage
- Monitor usage in Render dashboard
- Upgrade if needed

### Performance
- Free tier: Shared resources
- Paid plans: Dedicated resources
- Consider indexes for large datasets

### Connection Pooling
Strapi automatically handles connection pooling:
- Min connections: 2
- Max connections: 10
- Configured in `config/database.js`

## Troubleshooting

### Database Connection Errors

**Error: "Connection refused"**
- Check database is running in Render
- Verify `DATABASE_URL` is set correctly
- Check firewall/network settings

**Error: "SSL required"**
- Ensure `DATABASE_SSL_REJECT_UNAUTHORIZED=false` is set
- Render databases require SSL

**Error: "Database does not exist"**
- Database should auto-create
- Check database name matches configuration

### Schema Issues

**Tables not created**
- Check Strapi logs for errors
- Verify collection type schemas are valid
- Check database permissions

**Bootstrap script not running**
- Check logs for bootstrap errors
- Verify bootstrap.js is in `src/` directory
- Check if data already exists (bootstrap skips if data exists)

## Local Development vs Production

### Local (SQLite)
- Uses `.tmp/data.db` file
- No setup needed
- Good for development

### Production (PostgreSQL)
- Managed PostgreSQL on Render
- Better performance
- Production-ready
- Automatic backups

## Summary

✅ **Database is fully automated** - No manual setup needed
✅ **Schema auto-creates** - Strapi handles everything
✅ **Initial data auto-loads** - Bootstrap script runs automatically
✅ **Migrations auto-apply** - Schema changes handled automatically

Just deploy and it works! 🚀

