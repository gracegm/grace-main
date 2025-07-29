# 🚀 PeachieGlow Netlify Deployment Guide

## Quick Deployment Steps

### Option 1: Automated Netlify CLI Deployment (Recommended)

1. **Authenticate with Netlify**
   ```bash
   netlify login
   ```
   This will open your browser to log into Netlify.

2. **Initialize Netlify Site**
   ```bash
   netlify init
   ```
   Follow the prompts to create a new site or link to existing one.

3. **Deploy to Production**
   ```bash
   npm run deploy:netlify
   ```
   This runs our custom deployment script with full testing and optimization.

### Option 2: Manual Netlify Dashboard Deployment

1. **Go to Netlify Dashboard**
   - Visit [netlify.com](https://netlify.com) and log in
   - Click "New site from Git"

2. **Connect GitHub Repository**
   - Choose GitHub as your Git provider
   - Select your repository: `gracegm/grace-main`
   - Choose the `master` branch

3. **Configure Build Settings**
   - **Build command**: `npm run build`
   - **Publish directory**: `.next`
   - **Node version**: `18`

4. **Set Environment Variables** (Optional for now)
   - Go to Site Settings > Environment Variables
   - Add variables from `.env.production` as needed

5. **Deploy**
   - Click "Deploy site"
   - Wait for build to complete (~2-5 minutes)

## 🔧 Configuration Files

Your project now includes:

- **`netlify.toml`** - Netlify configuration with build settings, redirects, and headers
- **`.env.production`** - Environment variables template for production
- **`scripts/deploy-netlify.js`** - Automated deployment script with testing
- **`package.json`** - Updated with `deploy:netlify` script

## 🌐 Expected Deployment URL

Once deployed, your site will be available at:
- **Temporary URL**: `https://random-name-123456.netlify.app`
- **Custom URL**: You can change this in Netlify Dashboard > Site Settings > Domain Management

## ✅ Post-Deployment Checklist

After successful deployment:

- [ ] Verify all pages load correctly (`/`, `/demo`, `/testing`)
- [ ] Test responsive design on mobile/tablet
- [ ] Check all animations and interactions work
- [ ] Verify API routes function (they'll use mock data for now)
- [ ] Test form submissions and user interactions
- [ ] Check browser console for any errors

## 🔍 Troubleshooting

### Common Issues:

1. **Build Fails**
   - Check build logs in Netlify dashboard
   - Ensure all dependencies are in `package.json`
   - Verify Node.js version compatibility

2. **API Routes Don't Work**
   - Netlify automatically handles Next.js API routes
   - Check function logs in Netlify dashboard
   - Verify `netlify.toml` configuration

3. **Images/Assets Not Loading**
   - Check image paths are relative
   - Verify assets are in `public/` directory
   - Check build output includes all assets

4. **Environment Variables**
   - Set in Netlify Dashboard > Site Settings > Environment Variables
   - Prefix client-side variables with `NEXT_PUBLIC_`
   - Redeploy after adding new variables

## 🎯 Next Steps After Deployment

1. **Custom Domain** (Optional)
   - Purchase domain from your preferred registrar
   - Add custom domain in Netlify Dashboard
   - Configure DNS settings

2. **SSL Certificate**
   - Automatically provided by Netlify
   - Verify HTTPS is working

3. **Analytics Setup**
   - Add Google Analytics ID to environment variables
   - Enable Netlify Analytics (paid feature)

4. **Performance Monitoring**
   - Use Netlify's built-in performance monitoring
   - Set up uptime monitoring

## 🚨 Important Notes

- **Demo Mode**: The current deployment uses mock data and AI responses
- **API Limitations**: Real AI integration requires API keys (Step 2 of checklist)
- **Database**: Currently using in-memory storage (Step 3 of checklist)
- **Authentication**: No user accounts yet (Step 4 of checklist)
- **Payments**: No subscription system yet (Step 5 of checklist)

## 📞 Support

If you encounter issues:
1. Check Netlify build logs
2. Review browser console errors
3. Verify all configuration files are correct
4. Test locally with `npm run build && npm start`

---

**Ready to deploy? Run: `npm run deploy:netlify`**
