# 🚀 OTP Verification - Quick Setup (5 Minutes)

## ✅ What Was Implemented

**Email OTP verification for patient registration:**
- User registers → Receives 6-digit OTP email → Verifies email → Proceeds to booking

## 📋 Setup Checklist

### 1. Create Appwrite Collection (2 minutes)
```
1. Go to Appwrite Console → Your Database
2. Create Collection: "otp_verifications"
3. Add Attributes:
   - email (String, 255, Required)
   - otp (String, 6, Required)
   - expiresAt (DateTime, Required)
   - verified (Boolean, Required, Default: false)
4. Permissions: Set all to any()
5. Copy Collection ID
```

### 2. Update Environment Variables (1 minute)
Add to `.env.local`:
```env
OTP_COLLECTION_ID=your_collection_id_here
```

### 3. Restart Server (30 seconds)
```bash
npm run dev
```

### 4. Test It! (1 minute)
```
1. Go to http://localhost:3000/patient
2. Fill in name, email, phone
3. Click "Get Started"
4. Check your email (check spam folder)
5. Enter the 6-digit code
6. Click "Verify Email"
7. ✅ Done!
```

## 📧 Email Example

```
🔐 Email Verification

Hi John Doe,

Your Verification Code:

┌─────────┐
│ 123456  │  ← Expires in 10 minutes
└─────────┘

Next Steps:
1. Enter the code on verification page
2. Complete your registration
3. Start booking appointments
```

## 🎯 Key Features

| Feature | Description |
|---------|-------------|
| **Security** | OTP expires in 10 min, single use only |
| **UX** | Auto-advance input, smooth animations |
| **Resend** | 60-second cooldown between requests |
| **Validation** | Real-time error/success feedback |
| **Design** | Beautiful branded email template |

## 🐛 Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| No email received | Check spam folder, verify TEST_EMAIL is set |
| "Invalid OTP" | Code expired (>10 min) or already used |
| "Collection not found" | Create OTP collection in Appwrite |
| Can't resend | Wait for cooldown (60 seconds) |

## 📁 Files Created

```
lib/otp.ts                          ← OTP logic
lib/email-templates/otp-template.ts ← Email HTML
components/OTPVerification.tsx      ← UI component
app/api/verify-otp/route.ts         ← Verification API
app/api/resend-otp/route.ts         ← Resend API
```

## 📁 Files Modified

```
components/forms/PatientForm.tsx    ← Added OTP flow
lib/email.ts                        ← Added sendOTPEmail()
```

## 🔗 Full Documentation

See `OTP_SETUP_GUIDE.md` for:
- Complete setup instructions
- Troubleshooting guide
- Customization options
- Security best practices
- Production checklist

## ✨ That's It!

Your CarePulse app now has secure email verification! 🎉

**Test Flow:**
Register → Get OTP Email → Verify → Book Appointment ✅

---

**Need help?** Check `OTP_SETUP_GUIDE.md` or the troubleshooting section above.

