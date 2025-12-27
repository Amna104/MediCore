# 📧 Email Notification Setup Guide

This guide will help you set up email notifications for appointment bookings in CarePulse.

## ✅ What's Been Implemented

Email notifications are now sent to patients when:

1. **Booking an Appointment** - Patient receives a confirmation email that their appointment request is pending
2. **Appointment Scheduled** - Patient receives a confirmation email when admin approves the appointment
3. **Appointment Cancelled** - Patient receives a cancellation email with the reason (if provided)

## 🚀 Setup Instructions

### Step 1: Sign up for Resend

1. Go to [https://resend.com](https://resend.com)
2. Click "Sign Up" (it's free!)
3. Verify your email address
4. Login to your dashboard

### Step 2: Get Your API Key

1. In the Resend dashboard, click on **"API Keys"** in the left sidebar
2. Click **"Create API Key"**
3. Give it a name (e.g., "CarePulse Development")
4. Select permissions: **"Full Access"** or **"Sending access"**
5. Click **"Create"**
6. **Copy the API key** (you won't see it again!)

### Step 3: Set Up Environment Variables

Create a `.env.local` file in your project root and add:

```env
# Email Configuration (Resend)
RESEND_API_KEY=re_your_actual_api_key_here

# For development, use Resend's test email
RESEND_FROM_EMAIL=onboarding@resend.dev

# Your app URL (for email links)
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Step 4: Configure Your Domain (Optional - For Production)

For development, you can use `onboarding@resend.dev` as the sender email. But for production:

1. Go to **"Domains"** in Resend dashboard
2. Click **"Add Domain"**
3. Enter your domain (e.g., `yourdomain.com`)
4. Follow the DNS configuration instructions
5. Wait for verification (usually takes a few minutes)
6. Update your `.env.local`:

```env
RESEND_FROM_EMAIL=noreply@yourdomain.com
```

### Step 5: Test the Email Functionality

1. Make sure your development server is running:
   ```bash
   npm run dev
   ```

2. Book an appointment through the patient portal

3. Check the terminal/console for email sending logs

4. Check your email inbox (the patient's email address used during booking)

## 📝 Important Notes

### Free Tier Limits
- **100 emails per day**
- **3,000 emails per month**
- Perfect for development and small projects

### Production Considerations
- Use a custom domain for professional emails
- Consider upgrading if you need more emails
- Add proper error handling for failed email sends
- Monitor email delivery rates

## 🎨 Email Templates

The emails include:

- **Beautiful HTML templates** with your brand colors (green and blue)
- **Responsive design** that works on all devices
- **Professional layout** with appointment details
- **Call-to-action buttons** to view appointments
- **Footer** with branding and copyright

## 🔧 Customization

To customize the email templates, edit `lib/email.ts`:

### Change Colors
Look for the gradient styles:
```typescript
background: linear-gradient(135deg, #24AE7C 0%, #79B5EC 100%);
```

### Change Email Content
Modify the HTML templates in these functions:
- `getAppointmentConfirmationTemplate()`
- `getAppointmentScheduledTemplate()`
- `getAppointmentCancellationTemplate()`

### Add More Email Types
Create new functions following the same pattern:
```typescript
export const sendCustomEmail = async ({
  patientName,
  patientEmail,
  // ... other params
}) => {
  try {
    const { data, error } = await resend.emails.send({
      from: `CarePulse <${FROM_EMAIL}>`,
      to: [patientEmail],
      subject: "Your Subject",
      html: getYourCustomTemplate(),
    });
    
    return { success: true, data };
  } catch (error) {
    console.error("Error:", error);
    return { success: false, error };
  }
};
```

## 🐛 Troubleshooting

### Emails Not Sending?

1. **Check API Key**
   - Make sure `RESEND_API_KEY` is set in `.env.local`
   - Verify the key is correct (no extra spaces)

2. **Check Console Logs**
   - Look for error messages in your terminal
   - Check browser console for any errors

3. **Verify Email Address**
   - Make sure the patient email is valid
   - Check spam/junk folder

4. **Development Email Limits**
   - With `onboarding@resend.dev`, you can only send to verified emails
   - Add your test email in Resend dashboard under "Settings" > "Test Emails"

### Common Errors

**"Missing API key"**
```bash
Solution: Add RESEND_API_KEY to .env.local and restart the dev server
```

**"Domain not verified"**
```bash
Solution: Use onboarding@resend.dev for testing, or verify your domain
```

**"Rate limit exceeded"**
```bash
Solution: You've hit the free tier limit. Wait 24 hours or upgrade your plan
```

## 📊 Monitoring Email Delivery

1. Go to Resend dashboard
2. Click **"Emails"** in the sidebar
3. View all sent emails with their status:
   - ✅ Delivered
   - 📧 Sent
   - ❌ Failed
   - ⏳ Queued

## 🔐 Security Best Practices

1. **Never commit `.env.local`** to version control
2. **Use different API keys** for development and production
3. **Rotate API keys** periodically
4. **Monitor usage** to detect unusual activity
5. **Use environment variables** for all sensitive data

## 📚 Additional Resources

- [Resend Documentation](https://resend.com/docs)
- [Resend API Reference](https://resend.com/docs/api-reference)
- [Email Best Practices](https://resend.com/docs/best-practices)

## 🎉 Success!

If you've followed these steps, your CarePulse application should now be sending beautiful email notifications to patients when they book appointments!

Need help? Check the [Resend documentation](https://resend.com/docs) or open an issue in the project repository.

---

**Happy Coding! 🚀**

