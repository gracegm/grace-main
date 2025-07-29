# 🌐 PeachieGlow Domain Setup Guide
## Connecting peachyglow.com (GoDaddy) to Netlify

### Overview
This guide will help you connect your `peachyglow.com` domain purchased from GoDaddy to your PeachieGlow Netlify site.

---

## 📋 **Step 1: Configure Domain in Netlify Dashboard**

### 1.1 Access Your Netlify Site
1. Go to [netlify.com](https://netlify.com) and log in
2. Click on your PeachieGlow site from the dashboard
3. Go to **Site Settings** → **Domain Management**

### 1.2 Add Custom Domain
1. Click **"Add custom domain"**
2. Enter: `peachyglow.com`
3. Click **"Verify"**
4. Netlify will show you DNS configuration options

### 1.3 Choose DNS Configuration Method
Netlify will give you two options:

**Option A: Use Netlify DNS (Recommended)**
- Transfer DNS management to Netlify
- Easier to manage
- Better performance

**Option B: External DNS (Keep GoDaddy DNS)**
- Keep DNS with GoDaddy
- Requires manual DNS record setup

---

## 🚀 **Step 2A: Use Netlify DNS (Recommended)**

### 2A.1 Get Netlify Name Servers
1. In Netlify Dashboard → Domain Management
2. Click **"Use Netlify DNS"**
3. Netlify will provide 4 name servers like:
   ```
   dns1.p01.nsone.net
   dns2.p01.nsone.net
   dns3.p01.nsone.net
   dns4.p01.nsone.net
   ```

### 2A.2 Update Name Servers in GoDaddy
1. Log into your **GoDaddy account**
2. Go to **"My Products"** → **"Domains"**
3. Click **"DNS"** next to `peachyglow.com`
4. Scroll down to **"Nameservers"**
5. Click **"Change"**
6. Select **"I'll use my own nameservers"**
7. Enter the 4 Netlify nameservers (one per field)
8. Click **"Save"**

### 2A.3 Wait for Propagation
- DNS changes take 24-48 hours to fully propagate
- Your site will be live at `https://peachyglow.com` once complete

---

## 🔧 **Step 2B: External DNS (Keep GoDaddy DNS)**

### 2B.1 Get Netlify IP Address
1. In Netlify Dashboard → Domain Management
2. Click **"Set up Netlify DNS"** then **"Use external DNS"**
3. Netlify will show you DNS records to add:
   ```
   Type: A
   Name: @
   Value: 75.2.60.5
   
   Type: CNAME
   Name: www
   Value: your-site-name.netlify.app
   ```

### 2B.2 Configure DNS Records in GoDaddy
1. Log into your **GoDaddy account**
2. Go to **"My Products"** → **"Domains"**
3. Click **"DNS"** next to `peachyglow.com`
4. In the **"Records"** section:

**Add A Record:**
- **Type**: A
- **Name**: @ (or leave blank)
- **Value**: `75.2.60.5`
- **TTL**: 1 Hour

**Add CNAME Record:**
- **Type**: CNAME
- **Name**: www
- **Value**: `your-site-name.netlify.app` (replace with your actual Netlify URL)
- **TTL**: 1 Hour

5. Click **"Save"** for each record

---

## ✅ **Step 3: Verify Domain Setup**

### 3.1 Check Domain Status in Netlify
1. Go back to Netlify Dashboard → Domain Management
2. You should see `peachyglow.com` listed
3. Status should show **"Netlify DNS"** or **"External DNS"**
4. SSL certificate should be **"Provisioning"** then **"Active"**

### 3.2 Test Your Domain
Once DNS propagates (up to 48 hours):
- Visit `https://peachyglow.com`
- Visit `https://www.peachyglow.com`
- Both should redirect to your PeachieGlow site

---

## 🔒 **Step 4: SSL Certificate (Automatic)**

Netlify automatically provides free SSL certificates:
1. SSL will be provisioned automatically
2. Your site will be available at `https://peachyglow.com`
3. HTTP traffic will automatically redirect to HTTPS

---

## 📧 **Step 5: Update Environment Variables**

Update your production environment variables:

### 5.1 In Netlify Dashboard
1. Go to **Site Settings** → **Environment Variables**
2. Update `NEXT_PUBLIC_APP_URL` to: `https://peachyglow.com`

### 5.2 In Your Code (Optional)
Update `.env.production`:
```bash
NEXT_PUBLIC_APP_URL=https://peachyglow.com
```

---

## 🎯 **Step 6: Final Verification**

### 6.1 Test All Pages
- **Homepage**: `https://peachyglow.com`
- **Demo Page**: `https://peachyglow.com/demo`
- **Testing Dashboard**: `https://peachyglow.com/testing`

### 6.2 Check SEO Settings
- Verify Open Graph meta tags show correct domain
- Test social media sharing with new domain
- Update any hardcoded URLs in your code

---

## ⏰ **Timeline Expectations**

- **Netlify Configuration**: 5-10 minutes
- **DNS Record Updates**: 5-10 minutes
- **DNS Propagation**: 1-48 hours (usually 2-6 hours)
- **SSL Certificate**: Automatic once DNS is active

---

## 🚨 **Troubleshooting**

### Common Issues:

**1. Domain Not Working After 48 Hours**
- Check DNS records are correct
- Use [DNS Checker](https://dnschecker.org) to verify propagation
- Contact GoDaddy support if needed

**2. SSL Certificate Issues**
- Wait for DNS to fully propagate
- SSL certificates are issued after domain verification
- Contact Netlify support if SSL doesn't activate

**3. www vs non-www Issues**
- Ensure both A record (@) and CNAME (www) are configured
- Netlify handles redirects automatically

**4. Mixed Content Warnings**
- Update any hardcoded HTTP links to HTTPS
- Check browser console for specific issues

---

## 📞 **Support Resources**

- **Netlify Support**: [support.netlify.com](https://support.netlify.com)
- **GoDaddy Support**: [godaddy.com/help](https://godaddy.com/help)
- **DNS Propagation Checker**: [dnschecker.org](https://dnschecker.org)

---

## 🎉 **Success!**

Once complete, your PeachieGlow B2C SaaS landing page will be live at:
- **Primary Domain**: `https://peachyglow.com`
- **With www**: `https://www.peachyglow.com`
- **Automatic HTTPS**: Secure SSL certificate
- **Professional Branding**: Your own custom domain

Your PeachieGlow site will look incredibly professional with the custom domain! 🌟

---

**Need help with any of these steps? Let me know and I'll walk you through it!**
