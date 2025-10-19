# Vercel Deployment Instructions for DeFi Sentinel

## Files Created/Modified

I've added the following files to make your app work on Vercel:

1. ✅ `vercel.json` - Vercel configuration
2. ✅ `api/index.ts` - Simplified serverless API handler  
3. ✅ Updated `server/index.ts` - Exports the Express app for Vercel
4. ✅ Installed `@vercel/node` package

## Deploy to Vercel - Updated Steps

### Step 1: Push Changes to GitHub

```bash
git add .
git commit -m "Add Vercel deployment configuration"
git push origin main
```

### Step 2: Redeploy on Vercel

**Option A: Via Vercel Dashboard**
1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click on your **DeFi Sentinel** project
3. Go to **Deployments** tab
4. Click the **⋯** menu on the latest deployment
5. Click **Redeploy**
6. ✅ **Check "Use existing Build Cache"** is OFF
7. Click **Redeploy**

**Option B: Via Vercel CLI**
```bash
# Redeploy with fresh build
vercel --prod --force
```

### Step 3: Verify Environment Variables

Make sure these are still set in Vercel:
1. Go to **Settings** → **Environment Variables**
2. Verify all 4 variables exist:
   - `OPENAI_API_KEY`
   - `SESSION_SECRET`
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`

### Step 4: Test Your Deployment

Once deployed, test these URLs:

```
https://your-app.vercel.app/api/pools/stats
https://your-app.vercel.app/api/pools
https://your-app.vercel.app
```

You should see:
- ✅ Pool data loading on the dashboard
- ✅ Stats cards showing numbers (not "Loading...")
- ✅ Pool cards appearing in the "Available Opportunities" section

## Troubleshooting

### If you still see 404 errors:

1. **Check Vercel Function Logs:**
   - Dashboard → Your Project → Deployments → Latest → Functions
   - Look for any error messages

2. **Check Build Logs:**
   - Make sure build completed successfully
   - Look for "✓ built in X.XXs" message

3. **Clear Cache and Redeploy:**
   - Deployments → ⋯ → Redeploy
   - Uncheck "Use existing Build Cache"

### If data still doesn't load:

1. **Verify Database Connection:**
   - Check Supabase URL and anon key are correct
   - Visit Supabase dashboard → Table Editor
   - Confirm `pools` table has data

2. **Check Browser Console (F12):**
   - Look for specific error messages
   - Share error messages if you need help

## What Changed?

**For Vercel Serverless:**
- Express app now exports itself for Vercel's serverless functions
- Added `@vercel/node` adapter to handle Node.js runtime
- Created simplified API routes in `api/index.ts`
- Server checks for `VERCEL` environment variable to avoid starting a port listener

## Support

If you encounter issues:
1. Check the Vercel deployment logs
2. Check browser console (F12) for errors
3. Share specific error messages for faster help

Good luck! 🚀
