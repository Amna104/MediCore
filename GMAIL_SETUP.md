# 📧 Switch to Gmail for Email Sending

## Quick Setup (5 minutes)

### Step 1: Get Gmail App Password

1. Go to your Gmail account: https://myaccount.google.com/
2. Click **"Security"** in the left menu
3. Enable **"2-Step Verification"** (if not already enabled)
4. After 2FA is enabled, go back to Security
5. Search for **"App passwords"** or go to: https://myaccount.google.com/apppasswords
6. Click **"Select app"** → Choose **"Mail"**
7. Click **"Select device"** → Choose **"Other"** → Type **"MediCore"**
8. Click **"Generate"**
9. Copy the 16-character password (it looks like: `abcd efgh ijkl mnop`)

### Step 2: Update Environment Variables

**Local (.env.local):**
```env
# Remove or comment out Resend
# RESEND_API_KEY=...
# RESEND_FROM_EMAIL=...

# Add Gmail credentials
GMAIL_USER=amnaarshad019@gmail.com
GMAIL_APP_PASSWORD=your_16_char_app_password_here
```

**Vercel:**
1. Go to: https://vercel.com/ → medicore1 → Settings → Environment Variables
2. Delete or disable: `RESEND_API_KEY` and `RESEND_FROM_EMAIL`
3. Add new variables:
   - `GMAIL_USER` = `amnaarshad019@gmail.com`
   - `GMAIL_APP_PASSWORD` = `your_16_char_app_password`

### Step 3: Update Email Import

Change the import in `app/api/send-otp/route.ts`:

```typescript
// Old:
import { sendOTPEmail } from "@/lib/email";

// New:
import { sendOTPEmail } from "@/lib/email-gmail";
```

### Step 4: Test!

Restart your dev server and test the OTP - it should work instantly!

## Benefits of Gmail:
✅ No domain verification needed
✅ Works immediately  
✅ Free up to 500 emails/day
✅ Reliable delivery
✅ No DNS setup required

## Limits:
- 500 emails per day (plenty for testing and small apps)
- For production with high volume, consider SendGrid or AWS SES

