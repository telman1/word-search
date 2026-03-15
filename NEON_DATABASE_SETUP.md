# Neon Database Setup for Render

## Your Database URL

```
postgresql://neondb_owner:npg_Nq9hQmEsF5uO@ep-winter-frog-aebb3x28-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require
```

## Setup Instructions

### Option 1: Using Blueprint (render.yaml)

1. Deploy using Blueprint (it will create services but skip database)
2. After services are created, go to your backend service
3. Navigate to **Environment** tab
4. Add/Update the `DATABASE_URL` environment variable:
   ```
   postgresql://neondb_owner:npg_Nq9hQmEsF5uO@ep-winter-frog-aebb3x28-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require
   ```
5. Save and redeploy

### Option 2: Manual Setup

1. Create your backend service in Render
2. In the **Environment Variables** section, add:
   ```
   DATABASE_URL=postgresql://neondb_owner:npg_Nq9hQmEsF5uO@ep-winter-frog-aebb3x28-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require
   DATABASE_CLIENT=postgres
   DATABASE_SSL_REJECT_UNAUTHORIZED=false
   ```
3. Deploy the service

## Important Notes

### SSL Configuration
- Neon requires SSL connections
- The connection string already includes `sslmode=require`
- Set `DATABASE_SSL_REJECT_UNAUTHORIZED=false` in Render

### Connection Pooling
- Your URL uses Neon's pooler endpoint (notice `-pooler` in the hostname)
- This is recommended for serverless/server environments
- Better connection management and performance

### Security
⚠️ **Important**: Your database URL contains credentials. 
- Never commit it to public repositories
- Use Render's environment variables (they're encrypted)
- Consider rotating credentials if exposed

## Testing the Connection

After deployment, check the logs:
1. Go to your backend service in Render
2. Click **"Logs"** tab
3. Look for:
   - ✅ "Database connection successful"
   - ✅ "Bootstrap completed successfully"
   - ❌ Any database connection errors

## Troubleshooting

### Connection Timeout
- Check if Neon database is active
- Verify firewall/network settings
- Ensure SSL is properly configured

### SSL Errors
- Make sure `DATABASE_SSL_REJECT_UNAUTHORIZED=false`
- Verify `sslmode=require` is in the URL

### Authentication Errors
- Verify username and password in the connection string
- Check if database user has proper permissions

## Neon Dashboard

You can monitor your database at:
- https://console.neon.tech
- View connection stats
- Monitor queries
- Check database size

## Database Schema

When Strapi starts, it will:
1. Connect to your Neon database
2. Automatically create all tables
3. Run the bootstrap script to create sample data

No manual schema setup needed! 🚀

