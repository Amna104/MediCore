# MediCore - Vercel Deployment Guide

## 🚀 Deploy Your MediCore Healthcare App to Vercel

This guide will walk you through deploying your Next.js healthcare application to Vercel.

---

## 📋 Prerequisites

Before deploying, make sure you have:

1. ✅ A [Vercel account](https://vercel.com) (free tier is fine)
2. ✅ A [GitHub account](https://github.com)
3. ✅ Your code pushed to a GitHub repository
4. ✅ All required API keys and credentials ready

---

## 🔑 Required Environment Variables

You'll need to set up these environment variables in Vercel:

### **1. Appwrite Configuration**
```bash
# Appwrite Project
PROJECT_ID=your_appwrite_project_id
API_KEY=your_appwrite_api_key
DATABASE_ID=your_database_id
PATIENT_COLLECTION_ID=your_patient_collection_id
APPOINTMENT_COLLECTION_ID=your_appointment_collection_id
DOCTOR_COLLECTION_ID=your_doctor_collection_id
OTP_COLLECTION_ID=your_otp_collection_id
DOCTOR_AVAILABILITY_COLLECTION_ID=your_availability_collection_id
DOCTOR_BLOCKED_SLOTS_COLLECTION_ID=your_blocked_slots_collection_id

# Appwrite Endpoints
NEXT_PUBLIC_ENDPOINT=https://cloud.appwrite.io/v1
NEXT_PUBLIC_BUCKET_ID=your_bucket_id
```

### **2. Admin Configuration**
```bash
NEXT_PUBLIC_ADMIN_PASSKEY=111111
```

### **3. Email Service (Resend)**
```bash
RESEND_API_KEY=your_resend_api_key
RESEND_FROM_EMAIL=onboarding@resend.dev
TEST_EMAIL=your_test_email@gmail.com  # Optional for testing
```

### **4. SMS Service (Twilio)**
```bash
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number
```

### **5. Error Monitoring (Sentry)**
```bash
SENTRY_AUTH_TOKEN=your_sentry_auth_token
SENTRY_ORG=your_sentry_org
SENTRY_PROJECT=your_sentry_project
```

---

## 📦 Step-by-Step Deployment

### **Step 1: Push Code to GitHub**

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit changes
git commit -m "Initial commit - MediCore Healthcare App"

# Add remote repository
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# Push to GitHub
git push -u origin main
```

---

### **Step 2: Connect to Vercel**

1. **Go to [Vercel](https://vercel.com)**
2. **Click "Add New..."** → **"Project"**
3. **Import your GitHub repository:**
   - Click "Import" next to your repository
   - If you don't see it, click "Adjust GitHub App Permissions"

---

### **Step 3: Configure Project Settings**

1. **Framework Preset:** Next.js (auto-detected)
2. **Root Directory:** `./` (leave as default)
3. **Build Command:** `npm run build` (default)
4. **Output Directory:** `.next` (default)
5. **Install Command:** `npm install` (default)

---

### **Step 4: Add Environment Variables**

1. **In Vercel project settings:**
   - Click on **"Settings"** tab
   - Go to **"Environment Variables"**
   - Add all variables from the list above

2. **Important:** Set variables for all environments:
   - ✅ Production
   - ✅ Preview
   - ✅ Development

3. **How to add:**
   ```
   Key: PROJECT_ID
   Value: your_actual_project_id
   Environment: [x] Production [x] Preview [x] Development
   ```

---

### **Step 5: Deploy**

1. **Click "Deploy"**
2. Wait for the build to complete (2-5 minutes)
3. Your app will be live at: `https://your-project-name.vercel.app`

---

## 🔧 Post-Deployment Configuration

### **1. Configure Appwrite for Production**

Update Appwrite settings to allow your Vercel domain:

1. Go to [Appwrite Console](https://cloud.appwrite.io)
2. Select your project
3. Go to **Settings** → **Platforms**
4. Add your Vercel domain:
   - **Name:** MediCore Production
   - **Type:** Web
   - **Hostname:** `your-project-name.vercel.app`
   - Click **"Add Platform"**

---

### **2. Configure Resend Domain (Optional)**

For production email:

1. Go to [Resend Dashboard](https://resend.com)
2. Add and verify your custom domain
3. Update `RESEND_FROM_EMAIL` to use your domain:
   ```
   RESEND_FROM_EMAIL=noreply@yourdomain.com
   ```

---

### **3. Update Twilio Settings**

1. Go to [Twilio Console](https://www.twilio.com/console)
2. Verify your production phone numbers
3. Update webhook URLs if needed

---

## ⚡ Custom Domain (Optional)

### **Add Your Own Domain:**

1. **In Vercel Dashboard:**
   - Go to **"Settings"** → **"Domains"**
   - Click **"Add Domain"**
   - Enter your domain (e.g., `medicore.com`)

2. **Update DNS Records:**
   - Add the provided DNS records to your domain provider
   - Wait for DNS propagation (can take up to 48 hours)

3. **Update Appwrite:**
   - Add your custom domain to Appwrite platforms
   - Update environment variables if needed

---

## 🐛 Troubleshooting

### **Build Fails:**

```bash
# Check build logs in Vercel dashboard
# Common issues:
# 1. Missing environment variables
# 2. TypeScript errors
# 3. Missing dependencies
```

**Solution:**
- Ensure all environment variables are set
- Run `npm run build` locally first
- Check for TypeScript errors: `npm run type-check`

---

### **Runtime Errors:**

```bash
# Check Function logs in Vercel dashboard
# Common issues:
# 1. Appwrite endpoint not configured
# 2. API keys invalid
# 3. CORS issues
```

**Solution:**
- Verify all API keys are correct
- Check Appwrite platform settings
- Review server logs in Vercel

---

### **Images Not Loading:**

```bash
# Update next.config.mjs to allow Appwrite CDN
```

**Solution:**
Add to `next.config.mjs`:
```javascript
images: {
  remotePatterns: [
    {
      protocol: 'https',
      hostname: 'cloud.appwrite.io',
    },
  ],
},
```

---

## 🔄 Continuous Deployment

Every time you push to GitHub:
- ✅ Vercel automatically deploys
- ✅ Preview deployments for branches
- ✅ Production deployment for `main` branch

```bash
# Make changes
git add .
git commit -m "Update feature"
git push

# Vercel will auto-deploy! 🚀
```

---

## 📊 Monitoring Your App

### **Vercel Analytics:**
1. Go to **"Analytics"** tab in Vercel
2. View real-time traffic and performance

### **Sentry Error Tracking:**
1. Go to [Sentry Dashboard](https://sentry.io)
2. Monitor errors and performance issues

---

## 🔒 Security Best Practices

1. ✅ **Never commit `.env.local`** to GitHub
2. ✅ Use strong **ADMIN_PASSKEY**
3. ✅ Enable **Vercel Authentication** for admin routes
4. ✅ Set up **Rate Limiting** in Appwrite
5. ✅ Use **Vercel Edge Middleware** for protection
6. ✅ Enable **HTTPS only** (automatic in Vercel)

---

## 💡 Performance Tips

1. **Enable Vercel Speed Insights:**
   - Go to **"Speed Insights"** in dashboard
   - Click **"Enable"**

2. **Optimize Images:**
   - All images automatically optimized by Vercel
   - Uses WebP format when supported

3. **Edge Functions:**
   - API routes run on Vercel Edge Network
   - Global low-latency access

---

## 📱 Testing Your Deployment

### **1. Test Core Features:**
- ✅ Patient registration with OTP
- ✅ Appointment booking
- ✅ Email notifications
- ✅ SMS notifications
- ✅ Admin dashboard access
- ✅ Doctor availability calendar
- ✅ PDF downloads

### **2. Test on Multiple Devices:**
- ✅ Desktop browsers
- ✅ Mobile browsers
- ✅ Different screen sizes

---

## 🎉 Your App is Live!

Your MediCore healthcare app is now deployed at:
```
https://your-project-name.vercel.app
```

### **Share Your App:**
- 📧 Email link to users
- 📱 Add to mobile home screen
- 🔗 Share on social media

---

## 📚 Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Appwrite Documentation](https://appwrite.io/docs)
- [Resend Documentation](https://resend.com/docs)
- [Twilio Documentation](https://www.twilio.com/docs)

---

## 🆘 Need Help?

If you encounter issues:

1. Check Vercel Function Logs
2. Review Appwrite Logs
3. Test environment variables
4. Verify API endpoints
5. Check Sentry for errors

---

**Congratulations! Your MediCore Healthcare App is now live! 🏥✨**


