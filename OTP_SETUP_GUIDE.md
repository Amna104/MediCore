# 🔐 OTP Email Verification Setup Guide

## Overview

This feature adds email OTP (One-Time Password) verification to the patient registration flow. Users must verify their email before proceeding to book appointments.

## ✨ What's New

When users register:
1. 📝 User fills in name, email, and phone number
2. 📧 System sends 6-digit OTP to their email
3. 🔐 User enters OTP on verification page
4. ✅ After verification, user proceeds to complete registration
5. 📅 User can now book appointments

## 🏗️ Architecture

### Flow Diagram
```
Patient Form → Generate OTP → Send Email → OTP Verification → Create User → Registration
```

### Components Created

1. **`lib/otp.ts`** - OTP generation and verification logic
   - `generateOTP()` - Creates 6-digit code
   - `storeOTP()` - Saves to Appwrite database
   - `verifyOTP()` - Validates user input
   - `resendOTP()` - Resends with rate limiting
   - `isEmailVerified()` - Checks verification status

2. **`lib/email-templates/otp-template.ts`** - Beautiful HTML email template
   - Branded design with green/blue gradient
   - Large 6-digit code display
   - Security reminders
   - Next steps instructions

3. **`components/OTPVerification.tsx`** - Verification UI component
   - 6-digit OTP input with auto-focus
   - Real-time validation
   - Resend functionality with cooldown
   - Error/success messages
   - Animated UI with Framer Motion

4. **`app/api/verify-otp/route.ts`** - API endpoint for verification
5. **`app/api/resend-otp/route.ts`** - API endpoint for resending

6. **Updated `components/forms/PatientForm.tsx`** - Added OTP flow

## 🚀 Setup Instructions

### Step 1: Create OTP Collection in Appwrite

1. Go to your Appwrite Console: https://cloud.appwrite.io
2. Select your project
3. Go to **Databases** → Select your database
4. Click **Create Collection**
5. Name it: `otp_verifications`
6. Create the following attributes:

| Attribute | Type | Size | Required | Default |
|-----------|------|------|----------|---------|
| `email` | String | 255 | Yes | - |
| `otp` | String | 6 | Yes | - |
| `expiresAt` | DateTime | - | Yes | - |
| `verified` | Boolean | - | Yes | false |

7. **Set Permissions:**
   - Read: `any()`
   - Create: `any()`
   - Update: `any()`
   - Delete: `any()`

8. **Copy the Collection ID**

### Step 2: Update Environment Variables

Add to your `.env.local`:

```env
# Existing variables
RESEND_API_KEY=your_resend_api_key
RESEND_FROM_EMAIL=onboarding@resend.dev
TEST_EMAIL=your_test_email@gmail.com

# NEW: OTP Collection ID
OTP_COLLECTION_ID=your_otp_collection_id_here
```

### Step 3: Restart Development Server

```bash
# Stop the server (Ctrl+C)
npm run dev
```

### Step 4: Test the Feature

1. Go to `http://localhost:3000/patient`
2. Fill in your name, email, and phone
3. Click "Get Started"
4. Check your email for the 6-digit OTP
5. Enter the OTP on the verification page
6. Click "Verify Email"
7. You'll be redirected to complete registration

## 📧 Email Template Preview

The OTP email includes:
- 🔐 Lock icon and branded header
- 📋 6-digit code in large, easy-to-read format
- ⏰ Expiration time (10 minutes)
- 📝 Next steps instructions
- ⚠️ Security reminder
- 💡 Helpful tips

## 🎨 UI Features

### OTP Verification Page
- ✨ Smooth animations with Framer Motion
- 🎯 6-box OTP input (auto-focus next box)
- ✅ Real-time validation
- 🔄 Resend button with 60-second cooldown
- ❌ Clear error messages
- ✓ Success confirmation
- 💡 Help information box
- 🔙 Change email option

## 🔐 Security Features

1. **OTP Expiration**: Codes expire after 10 minutes
2. **Single Use**: Each OTP can only be used once
3. **Rate Limiting**: 1-minute cooldown between resend requests
4. **Email Validation**: Verified before proceeding
5. **Automatic Cleanup**: Old OTPs are deleted
6. **Secure Storage**: OTPs stored in Appwrite database

## ⚡ Features

### User Experience
- ✅ Beautiful, professional UI
- ✅ Auto-advances when 6 digits entered
- ✅ Clear error/success feedback
- ✅ Easy resend functionality
- ✅ Helpful tips and instructions
- ✅ Mobile responsive
- ✅ Smooth animations

### Developer Experience
- ✅ Type-safe with TypeScript
- ✅ Server actions for security
- ✅ API routes for flexibility
- ✅ Reusable components
- ✅ Well-documented code
- ✅ Error handling built-in

## 🐛 Troubleshooting

### "Email not sending"
**Solution:**
1. Check `RESEND_API_KEY` in `.env.local`
2. Make sure `TEST_EMAIL` is set to your verified email
3. Check console logs for errors
4. Verify Resend dashboard for email status

### "OTP Collection ID not found"
**Solution:**
1. Create the OTP collection in Appwrite
2. Copy the collection ID
3. Add `OTP_COLLECTION_ID` to `.env.local`
4. Restart the dev server

### "Invalid or expired OTP"
**Reasons:**
- OTP is older than 10 minutes (expired)
- Wrong code entered
- OTP already used
- Network/database error

**Solution:**
- Click "Resend Code"
- Check email for new code
- Make sure you're entering all 6 digits

### "Failed to verify OTP"
**Solution:**
1. Check Appwrite permissions on OTP collection
2. Verify `DATABASE_ID` and `OTP_COLLECTION_ID` in `.env.local`
3. Check browser console for errors
4. Check server terminal for errors

## 📊 Database Schema

### OTP Verifications Collection

```typescript
{
  $id: string;              // Auto-generated
  email: string;            // User's email (lowercase)
  otp: string;              // 6-digit code
  expiresAt: string;        // ISO datetime (10 min from creation)
  verified: boolean;        // Whether OTP was used
  $createdAt: string;       // Auto-generated
  $updatedAt: string;       // Auto-generated
}
```

## 🔄 User Flow

1. **Initial Registration**
   ```
   User enters: Name, Email, Phone
   ↓
   System generates 6-digit OTP
   ↓
   System stores OTP in database (expires in 10 min)
   ↓
   System sends OTP email
   ↓
   Show OTP verification page
   ```

2. **OTP Verification**
   ```
   User enters 6-digit code
   ↓
   System verifies against database
   ↓
   If valid:
     - Mark OTP as verified
     - Create user account
     - Redirect to registration
   If invalid:
     - Show error message
     - Allow retry or resend
   ```

3. **Resend OTP**
   ```
   User clicks "Resend Code"
   ↓
   Check rate limit (1 minute cooldown)
   ↓
   Generate new OTP
   ↓
   Delete old OTPs for this email
   ↓
   Store new OTP
   ↓
   Send new email
   ↓
   Start 60-second cooldown
   ```

## 💡 Customization

### Change OTP Length
In `lib/otp.ts`:
```typescript
// Change from 6 to 4 digits
export function generateOTP(): string {
  return Math.floor(1000 + Math.random() * 9000).toString();
}
```

### Change Expiration Time
In `lib/otp.ts`:
```typescript
// Change from 10 to 15 minutes
const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString();
```

### Change Cooldown Time
In `components/OTPVerification.tsx`:
```typescript
// Change from 60 to 30 seconds
setResendCooldown(30);
```

### Customize Email Template
Edit `lib/email-templates/otp-template.ts`:
- Change colors in gradient backgrounds
- Modify text content
- Add your logo
- Adjust styling

## 📈 Monitoring

### Check Email Delivery
1. Go to Resend Dashboard
2. Click "Emails"
3. Filter by subject: "Verify Your Email"
4. Check delivery status

### Check OTP Usage
1. Go to Appwrite Console
2. Navigate to your OTP collection
3. View documents to see:
   - Active OTPs
   - Expired OTPs
   - Verified OTPs

### Clean Up Old OTPs
OTPs are automatically deleted when:
- A new OTP is generated for the same email
- They are expired and verification is attempted

For manual cleanup, create a scheduled function in Appwrite to delete expired OTPs.

## 🎯 Best Practices

1. **Security**
   - Never log OTPs in production
   - Use HTTPS in production
   - Implement brute-force protection
   - Consider adding CAPTCHA for multiple failed attempts

2. **User Experience**
   - Keep expiration time reasonable (10 min is good)
   - Provide clear error messages
   - Allow easy resend
   - Show helpful tips

3. **Performance**
   - Clean up expired OTPs regularly
   - Index the `email` field in Appwrite
   - Cache email templates
   - Use server actions for security

## 🚀 Production Checklist

- [ ] Create OTP collection in Appwrite
- [ ] Set proper Appwrite permissions
- [ ] Add `OTP_COLLECTION_ID` to environment variables
- [ ] Verify your email domain on Resend
- [ ] Update `RESEND_FROM_EMAIL` to your domain
- [ ] Remove `TEST_EMAIL` from production env
- [ ] Test the complete flow
- [ ] Set up monitoring/alerts
- [ ] Add rate limiting middleware
- [ ] Consider adding CAPTCHA
- [ ] Set up automated OTP cleanup

## 📚 Additional Resources

- [Appwrite Database Documentation](https://appwrite.io/docs/databases)
- [Resend Email API](https://resend.com/docs)
- [Input OTP Component](https://ui.shadcn.com/docs/components/input-otp)
- [Framer Motion Animations](https://www.framer.com/motion/)

## 🎉 Success!

If you've followed all steps, your application now has:
- ✅ Secure email verification
- ✅ Beautiful OTP UI
- ✅ Professional email templates
- ✅ Great user experience
- ✅ Production-ready security

Need help? Check the troubleshooting section or review the code comments!

---

**Made with ❤️ for CarePulse - Next-Generation Healthcare Management**

