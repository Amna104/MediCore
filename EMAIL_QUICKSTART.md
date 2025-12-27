# 🚀 Quick Start - Email Notifications

## ⚡ 3-Minute Setup

### 1. Get Resend API Key
```bash
1. Go to https://resend.com
2. Sign up (free)
3. Go to API Keys → Create API Key
4. Copy the key
```

### 2. Add to .env.local
```env
RESEND_API_KEY=re_your_api_key_here
RESEND_FROM_EMAIL=onboarding@resend.dev
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Restart Server
```bash
npm run dev
```

### 4. Test It!
- Book an appointment as a patient
- Check the email inbox
- ✅ Done!

## 📧 What Emails Are Sent?

| When | Email Type | Recipient |
|------|-----------|-----------|
| Patient books appointment | Confirmation (Pending) | Patient |
| Admin schedules appointment | Scheduled Confirmation | Patient |
| Admin cancels appointment | Cancellation Notice | Patient |

## 🎨 Email Preview

All emails include:
- ✨ Beautiful branded design
- 📱 Mobile responsive
- 📋 Appointment details
- 🔘 Call-to-action buttons
- 🏢 Professional footer

## 🔍 Where to Find More Info?

See `EMAIL_SETUP.md` for detailed setup instructions and customization options.

---

**That's it! Your patients will now receive emails! 🎉**

