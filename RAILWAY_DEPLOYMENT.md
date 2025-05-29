# 🚂 Deploying Bankin Finance Scraper on Railway

This guide will help you deploy your bankin-finance-scraper on Railway.

## 📋 Prerequisites

1. A [Railway account](https://railway.app) (free tier available)
2. Your project pushed to a Git repository (GitHub, GitLab, or Bitbucket)
3. Your Bankin credentials
4. Discord bot token and channel ID (optional)

## 🔧 Deployment Steps

### 1. Push Your Code to Git

Make sure all the recent changes are committed and pushed to your repository:

```bash
git add .
git commit -m "Add Railway deployment configuration"
git push origin main
```

### 2. Create a New Project on Railway

1. Go to [Railway Dashboard](https://railway.app/dashboard)
2. Click **"New Project"**
3. Select **"Deploy from GitHub repo"**
4. Choose your repository
5. Railway will automatically detect the Dockerfile

### 3. Configure Environment Variables

In the Railway dashboard, go to your project and add these environment variables:

#### Required Variables:

- `BANKIN_EMAIL`: Your Bankin email address
- `BANKIN_PASSWORD`: Your Bankin password
- `HEADLESS`: `true` (always true for cloud deployment)

#### Optional Discord Variables:

- `DISCORD_BOT_TOKEN`: Your Discord bot token
- `DISCORD_CHANNEL_ID`: Your Discord channel ID
- `DISCORD_ENABLED`: `true` or `false`

#### System Variables (automatically set by Railway):

- `NODE_ENV`: `production`
- `PUPPETEER_SKIP_CHROMIUM_DOWNLOAD`: `true`
- `PUPPETEER_EXECUTABLE_PATH`: `/usr/bin/chromium-browser`

### 4. Deploy

1. Railway will automatically start building and deploying
2. Monitor the build logs in the Railway dashboard
3. The deployment will complete automatically

## 📊 Monitoring and Logs

- **Logs**: View real-time logs in the Railway dashboard
- **Metrics**: Monitor CPU, memory, and network usage
- **Deployments**: Track deployment history and status

## 🔄 Running the Scraper

### One-time Execution

Your scraper will run once when deployed. To run it again:

1. Go to your project dashboard
2. Click **"Redeploy"** or push a new commit to trigger deployment

### Scheduled Execution (Recommended)

For regular scraping, you have several options:

#### Option 1: Railway Cron Jobs

1. In your project settings, go to **"Cron"**
2. Add a new cron job with schedule (e.g., `0 9 * * *` for daily at 9 AM)
3. Command: `npm run start:prod`

#### Option 2: GitHub Actions (Free alternative)

Create `.github/workflows/scheduled-scraper.yml`:

```yaml
name: Scheduled Bankin Scraper
on:
  schedule:
    - cron: "0 9 * * *" # Daily at 9 AM UTC
  workflow_dispatch: # Allow manual trigger

jobs:
  trigger-railway:
    runs-on: ubuntu-latest
    steps:
      - name: Trigger Railway Deployment
        run: |
          curl -X POST "${{ secrets.RAILWAY_WEBHOOK_URL }}"
```

## 🛠️ Troubleshooting

### Common Issues:

1. **Puppeteer fails to launch**

   - Railway has excellent Puppeteer support out of the box
   - Ensure environment variables are set correctly

2. **Build fails**

   - Check the build logs in Railway dashboard
   - Verify TypeScript compilation works locally

3. **Login fails**

   - Verify credentials are correct
   - Check if Bankin has additional security measures

4. **Discord notifications not working**
   - Verify bot token and channel ID
   - Ensure bot has permissions to send messages

### Debug Mode:

To debug issues:

- Check the logs in Railway dashboard
- Add console.log statements in your code
- Use Railway's built-in monitoring tools

## 💰 Cost Considerations

Railway pricing (as of 2024):

- **Hobby Plan**: $5/month with $5 usage credit included
- **Pro Plan**: $20/month with $20 usage credit included
- **Usage-based**: Pay only for what you use after credits

Your scraper should cost very little to run:

- Estimated cost: $0.10-$0.50 per month for occasional runs
- Memory usage: ~200-500MB during execution
- CPU usage: Minimal when not running

## 🔒 Security Best Practices

1. **Never commit credentials** to your repository
2. **Use Railway's environment variables** for all sensitive data
3. **Regularly rotate** your Bankin password
4. **Monitor logs** for suspicious activity
5. **Use Railway's built-in security features**

## 📈 Performance Optimization

1. **Railway auto-scaling**: Automatically handles resource allocation
2. **Fast cold starts**: Railway has excellent cold start performance
3. **Built-in monitoring**: Use Railway's metrics to optimize performance
4. **Resource limits**: Set appropriate CPU and memory limits

## 🚀 Advanced Features

### Custom Domains

- Add a custom domain in Railway dashboard
- Useful if you want to create a web interface later

### Database Integration

- Easily add PostgreSQL, MySQL, or Redis
- Store scraping results for historical analysis

### Multiple Environments

- Create staging and production environments
- Test changes before deploying to production

## 🆘 Support

If you encounter issues:

1. Check Railway's [documentation](https://docs.railway.app)
2. Review the deployment and runtime logs
3. Join Railway's [Discord community](https://discord.gg/railway)
4. Contact Railway support through their dashboard

## 🔄 Continuous Deployment

Railway automatically deploys when you push to your main branch:

1. Make changes to your code
2. Commit and push to GitHub
3. Railway automatically builds and deploys
4. Monitor the deployment in the dashboard

## 📱 Railway CLI (Optional)

Install Railway CLI for local development:

```bash
npm install -g @railway/cli
railway login
railway link  # Link to your project
railway run npm run dev  # Run with Railway environment variables
```

---

**Note**: This scraper is designed for personal use. Ensure you comply with Bankin's terms of service and applicable laws regarding web scraping.

## 🎯 Why Railway vs Other Platforms?

- **Better Puppeteer support**: Railway handles browser automation excellently
- **Simpler deployment**: No complex configuration needed
- **Fair pricing**: Pay only for what you use
- **Excellent developer experience**: Great dashboard and tooling
- **Fast deployments**: Quick build and deployment times
- **Built-in monitoring**: Comprehensive logs and metrics
