# Deployment Guide for Render

This guide will help you deploy both the Strapi backend and Next.js frontend to Render.

## Prerequisites

1. A GitHub account with your repository pushed
2. A Render account (sign up at https://render.com)

## Step 1: Database Setup

### Using Your Neon Database (External Database)

You're using a **Neon PostgreSQL database**. Here's how to configure it:

1. **Get your database URL** (you already have it):
   ```
   postgresql://neondb_owner:npg_Nq9hQmEsF5uO@ep-winter-frog-aebb3x28-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require
   ```

2. **When deploying**, you'll need to set the `DATABASE_URL` environment variable manually in Render dashboard (see Step 2 below)

### Alternative: Create New Database on Render

If you prefer to use Render's database instead:
1. Go to your Render Dashboard
2. Click **"New +"** → **"PostgreSQL"**
3. Configure and create the database
4. Use the connection string from Render

## Step 2: Deploy Strapi Backend

### Option A: Using render.yaml (Recommended)

1. Go to Render Dashboard
2. Click **"New +"** → **"Blueprint"**
3. Connect your GitHub repository
4. Render will detect the `render.yaml` file
5. Review the configuration and click **"Apply"**
6. Render will create all services automatically
7. **After services are created**, go to your backend service → **Environment** tab
8. Add the `DATABASE_URL` environment variable with your Neon database URL:
   ```
   postgresql://neondb_owner:npg_Nq9hQmEsF5uO@ep-winter-frog-aebb3x28-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require
   ```
9. Save and the service will automatically redeploy

### Option B: Manual Setup

1. Go to Render Dashboard
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Configure:
   - **Name**: `word-search-backend`
   - **Root Directory**: `backend-strapi`
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Plan**: Starter (Free tier available)

5. **Environment Variables** - Add these:
   ```
   NODE_ENV=production
   HOST=0.0.0.0
   PORT=1337
   DATABASE_CLIENT=postgres
   DATABASE_URL=postgresql://neondb_owner:npg_Nq9hQmEsF5uO@ep-winter-frog-aebb3x28-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require
   DATABASE_SSL_REJECT_UNAUTHORIZED=false
   ```
   
   **Important**: Replace the DATABASE_URL with your actual Neon database URL if different.

6. **Generate Secrets** - Click "Generate" for these (Render will auto-generate):
   - `APP_KEYS`
   - `API_TOKEN_SALT`
   - `ADMIN_JWT_SECRET`
   - `JWT_SECRET`
   - `TRANSFER_TOKEN_SALT`

7. Click **"Create Web Service"**

8. Wait for deployment (5-10 minutes)

9. Once deployed, note your backend URL (e.g., `https://word-search-backend.onrender.com`)

## Step 3: Deploy Next.js Frontend

1. Go to Render Dashboard
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Configure:
   - **Name**: `word-search-frontend`
   - **Root Directory**: `frontend-next`
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Plan**: Starter (Free tier available)

5. **Environment Variables** - Add:
   ```
   NODE_ENV=production
   NEXT_PUBLIC_API_BASE_URL=https://word-search-backend.onrender.com
   ```
   (Replace with your actual backend URL from Step 2)

6. Click **"Create Web Service"**

7. Wait for deployment (5-10 minutes)

## Step 4: Configure CORS (Important!)

After the backend is deployed:

1. Go to your Strapi backend service in Render
2. Go to **Environment** tab
3. Add this environment variable:
   ```
   CORS_ORIGIN=https://word-search-frontend.onrender.com
   ```
   (Replace with your actual frontend URL)

4. Or update `backend-strapi/config/middlewares.js` to allow your frontend domain

## Step 5: Access Your Application

- **Frontend**: `https://word-search-frontend.onrender.com`
- **Backend API**: `https://word-search-backend.onrender.com/api`
- **Strapi Admin**: `https://word-search-backend.onrender.com/admin`

## Step 6: Database Schema & Initial Data

### Automatic Schema Creation

When Strapi starts for the first time, it will:
1. **Automatically create all database tables** based on your collection types (Word, Author, Translator, Book, etc.)
2. **Run the bootstrap script** which creates sample data:
   - Sample Author, Translator, and Book
   - 4 sample words with translations
   - Connections between words

### First-Time Admin Setup

1. Visit your Strapi Admin URL: `https://word-search-backend.onrender.com/admin`
2. Create your admin account (first user)
3. The bootstrap script runs automatically on first start
4. Sample data will be available immediately

### Database Migrations

Strapi handles database migrations automatically. When you:
- Add new fields to collection types
- Create new collection types
- Modify relations

Strapi will automatically update the database schema on the next deployment.

### Viewing Database

To view your database:
1. Go to Render Dashboard
2. Click on your `word-search-db` database
3. Click **"Connect"** tab
4. Use the connection string with any PostgreSQL client (pgAdmin, DBeaver, etc.)

## Troubleshooting

### Backend won't start
- Check the logs in Render Dashboard
- Verify all environment variables are set
- Ensure `DATABASE_URL` is correct

### Frontend can't connect to backend
- Verify `NEXT_PUBLIC_API_BASE_URL` is set correctly
- Check CORS settings in Strapi
- Ensure backend is running and accessible

### Database connection errors
- Verify `DATABASE_URL` uses the Internal Database URL
- Check that database is running
- Ensure `DATABASE_SSL_REJECT_UNAUTHORIZED=false` is set

## Free Tier Limitations

- Services spin down after 15 minutes of inactivity
- First request after spin-down takes ~30 seconds
- Consider upgrading to paid plan for always-on service

## Custom Domain (Optional)

1. In Render Dashboard, go to your service
2. Click **"Settings"** → **"Custom Domains"**
3. Add your domain
4. Follow DNS configuration instructions

## Environment Variables Reference

### Backend (Strapi)
- `NODE_ENV=production`
- `HOST=0.0.0.0`
- `PORT=1337`
- `DATABASE_CLIENT=postgres`
- `DATABASE_URL` (from database service)
- `DATABASE_SSL_REJECT_UNAUTHORIZED=false`
- `APP_KEYS` (auto-generated)
- `API_TOKEN_SALT` (auto-generated)
- `ADMIN_JWT_SECRET` (auto-generated)
- `JWT_SECRET` (auto-generated)
- `TRANSFER_TOKEN_SALT` (auto-generated)
- `CORS_ORIGIN` (your frontend URL)

### Frontend (Next.js)
- `NODE_ENV=production`
- `NEXT_PUBLIC_API_BASE_URL` (your backend URL)

