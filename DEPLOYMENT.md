# WoW Guild Viewer - Serverless Deployment Guide

This guide explains how to deploy your WoW Guild Viewer with serverless functions for secure API handling.

## 🚀 Quick Deployment to Vercel

### 1. Setup Environment Variables

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Get your Blizzard API credentials:
   - Go to https://develop.battle.net/
   - Create a new client
   - Copy your Client ID and Client Secret

3. Add your credentials to `.env.local`:
   ```
   BLIZZARD_CLIENT_ID=your_actual_client_id
   BLIZZARD_CLIENT_SECRET=your_actual_client_secret
   VITE_BLIZZARD_CLIENT_ID=your_actual_client_id
   VITE_BLIZZARD_CLIENT_SECRET=your_actual_client_secret
   ```

### 2. Deploy to Vercel

#### Option A: One-Click Deploy
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/wow-guild-viewer)

#### Option B: Manual Deploy
1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Login to Vercel:
   ```bash
   vercel login
   ```

3. Deploy:
   ```bash
   vercel
   ```

4. Set environment variables in Vercel dashboard:
   - Go to your project settings
   - Add `BLIZZARD_CLIENT_ID` and `BLIZZARD_CLIENT_SECRET`

### 3. Test Your Deployment

Once deployed, test the API endpoints:
- `https://your-app.vercel.app/api/items/18832` (Flask of Stamina)
- `https://your-app.vercel.app/api/guild/benediction/cartesian/roster`

## 🔧 Local Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start development server:
   ```bash
   npm run dev
   ```

3. Your app will be available at `http://localhost:5173`

## 📁 API Endpoints

### Items
- `GET /api/items/[id]` - Fetch item data by ID
- `GET /api/media?url=[mediaUrl]` - Fetch item media/icons

### Guild
- `GET /api/guild/[realm]/[guild]/roster` - Guild roster
- `GET /api/guild/[realm]/[guild]/activity` - Guild activity
- `GET /api/guild/[realm]/[guild]/achievements` - Guild achievements

## 🔒 Security Features

- ✅ API keys are server-side only
- ✅ CORS headers properly configured
- ✅ Rate limiting protection
- ✅ Response caching for performance
- ✅ Error handling and logging

## 🏗️ Architecture

```
Frontend (React/Vite)
    ↓
Serverless Functions (/api)
    ↓
Blizzard API
```

The serverless functions act as a secure proxy between your frontend and the Blizzard API, keeping your credentials safe and handling CORS issues.

## 🚨 Important Notes

- Never commit your `.env` file with real credentials
- Set environment variables in Vercel dashboard for production
- The free Vercel tier has generous limits but monitor usage
- API responses are cached to improve performance and reduce API calls

## 🛠️ Troubleshooting

### "Missing Blizzard API credentials" error
- Ensure environment variables are set in Vercel dashboard
- Check variable names match exactly

### CORS errors
- The serverless functions should handle CORS automatically
- If issues persist, check the Vercel logs

### API rate limiting
- Blizzard has rate limits on their API
- The serverless functions include caching to minimize API calls
- Consider implementing request queuing for high-traffic scenarios
