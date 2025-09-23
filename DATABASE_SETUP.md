# Database Setup Guide

## 🚨 IMPORTANT: Your application needs a PostgreSQL database to work in production!

Currently, your application is configured to use SQLite locally, but Vercel serverless functions require a cloud database.

## 🔧 Quick Fix - Set up Vercel Postgres

### Step 1: Create Vercel Postgres Database
1. Go to your Vercel project dashboard: https://vercel.com/jack-hds-projects/checks-pickup
2. Click on the **Storage** tab
3. Click **Create Database** → **Postgres**
4. Choose a name (e.g., "checkin-db")
5. Select a region close to you
6. Click **Create**

### Step 2: Get Connection String
1. After creating the database, click on it
2. Go to the **.env.local** tab
3. Copy the `DATABASE_URL` value

### Step 3: Set Environment Variables in Vercel
1. Go to your project **Settings** → **Environment Variables**
2. Add these variables:
   - `DATABASE_URL` = (paste the connection string from step 2)
   - `REACT_APP_TEAMS_WEBHOOK_URL` = (your Teams webhook URL)

### Step 4: Redeploy
1. Go to **Deployments** tab
2. Click **Redeploy** on the latest deployment
3. Or push a new commit to trigger auto-deployment

## 🛠️ Alternative: External Database Services

If you prefer external services:

### Option A: Supabase (Free tier available)
1. Go to https://supabase.com
2. Create a new project
3. Go to Settings → Database
4. Copy the connection string
5. Set as `DATABASE_URL` in Vercel

### Option B: PlanetScale (Free tier available)
1. Go to https://planetscale.com
2. Create a new database
3. Get the connection string
4. Set as `DATABASE_URL` in Vercel

## 🧪 Testing the Fix

After setting up the database:

1. **Test the API**: Visit `https://your-app.vercel.app/api/clients`
2. **Test form submission**: Try submitting the check-in form
3. **Check data persistence**: Refresh and see if data is saved

## 🔍 Troubleshooting

### If you still get errors:
1. Check Vercel deployment logs
2. Verify `DATABASE_URL` is set correctly
3. Make sure the database is accessible
4. Check if Prisma migrations ran successfully

### Common Issues:
- **"Database not found"**: Database URL is incorrect
- **"Connection timeout"**: Database is not accessible
- **"Schema not found"**: Need to run `prisma db push`

## 📞 Need Help?

If you're still having issues:
1. Check the Vercel deployment logs
2. Verify your environment variables
3. Test the database connection manually