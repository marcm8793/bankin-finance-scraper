# 🚀 Deploying Bankin Finance Scraper on Render

This guide will help you deploy your bankin-finance-scraper on Render.

## 📋 Prerequisites

1. A [Render account](https://render.com) (free tier available)
2. Your project pushed to a Git repository (GitHub, GitLab, or Bitbucket)
3. Your Bankin credentials
4. Discord bot token and channel ID (optional)

## 🔧 Deployment Steps

### 1. Push Your Code to Git

Make sure all the recent changes are committed and pushed to your repository:

```bash
git add .
git commit -m "Add Render deployment configuration"
git push origin main
```

### 2. Create a New Service on Render

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click **"New +"** → **"Worker"**
3. Connect your Git repository
4. Configure the service:
   - **Name**: `bankin-finance-scraper`
   - **Environment**: `Docker`
   - **Plan**: `Starter` (free tier) or `Standard` for better performance
   - **Dockerfile Path**: `./Dockerfile`

### 3. Configure Environment Variables

In the Render dashboard, add these environment variables:

#### Required Variables:

- `BANKIN_EMAIL`: Your Bankin email address
- `BANKIN_PASSWORD`: Your Bankin password
- `HEADLESS`: `true` (always true for cloud deployment)

#### Optional Discord Variables:

- `DISCORD_BOT_TOKEN`: Your Discord bot token
- `DISCORD_CHANNEL_ID`: Your Discord channel ID
- `DISCORD_ENABLED`: `true` or `false`

#### System Variables (automatically set):

- `NODE_ENV`: `production`
- `PUPPETEER_SKIP_CHROMIUM_DOWNLOAD`: `true`
- `PUPPETEER_EXECUTABLE_PATH`: `/usr/bin/chromium-browser`

### 4. Deploy

1. Click **"Create Worker"**
2. Render will automatically build and deploy your application
3. Monitor the build logs for any issues

## 📊 Monitoring and Logs

- **Logs**: View real-time logs in the Render dashboard
- **Metrics**: Monitor CPU and memory usage
- **Health**: Check service status and uptime

## 🔄 Running the Scraper

### One-time Execution

Your scraper will run once when deployed. To run it again:

1. Go to your service dashboard
2. Click **"Manual Deploy"** → **"Deploy latest commit"**

### Scheduled Execution (Recommended)

For regular scraping, consider setting up a cron job service:

1. Create a new **"Cron Job"** service on Render
2. Use the same repository and Docker configuration
3. Set schedule (e.g., `0 9 * * *` for daily at 9 AM)
4. Command: `npm run start:prod`

## 🛠️ Troubleshooting

### Common Issues:

1. **Puppeteer fails to launch**

   - Ensure all Puppeteer environment variables are set
   - Check that the Docker image includes Chromium

2. **Build fails**

   - Verify TypeScript compilation works locally
   - Check that all dependencies are in `package.json`

3. **Login fails**

   - Verify credentials are correct
   - Check if Bankin has additional security measures

4. **Discord notifications not working**
   - Verify bot token and channel ID
   - Ensure bot has permissions to send messages

### Debug Mode:

To debug issues, temporarily set:

- `HEADLESS=false` (not recommended for production)
- Add console.log statements in your code

## 💰 Cost Considerations

- **Starter Plan**: Free tier with 750 hours/month
- **Standard Plan**: $7/month for better performance
- **Memory**: Puppeteer applications need at least 512MB RAM

## 🔒 Security Best Practices

1. **Never commit credentials** to your repository
2. **Use environment variables** for all sensitive data
3. **Regularly rotate** your Bankin password
4. **Monitor logs** for suspicious activity

## 📈 Performance Optimization

1. **Use headless mode** (always true in production)
2. **Optimize Puppeteer arguments** for cloud environment
3. **Consider upgrading** to Standard plan for better performance
4. **Monitor memory usage** and adjust if needed

## 🆘 Support

If you encounter issues:

1. Check Render's [documentation](https://render.com/docs)
2. Review the build and runtime logs
3. Test locally with Docker to reproduce issues
4. Contact Render support if needed

---

**Note**: This scraper is designed for personal use. Ensure you comply with Bankin's terms of service and applicable laws regarding web scraping.
