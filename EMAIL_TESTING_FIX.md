# 🔧 Testing Email Configuration

## Add this to your .env.local file:

```env
# Email Configuration (Resend)
RESEND_API_KEY=your_actual_api_key
RESEND_FROM_EMAIL=onboarding@resend.dev

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000

# 🧪 TESTING: Use your own email for testing (the one you signed up with on Resend)
# This will send ALL emails to this address during development
# Remove this line in production!
TEST_EMAIL=your_verified_email@gmail.com
```

## How it works:

- When `TEST_EMAIL` is set: All emails go to this address (for testing)
- When `TEST_EMAIL` is NOT set: Emails go to actual patient emails (production)

## Steps to test:

1. Add `TEST_EMAIL=your_email@gmail.com` to .env.local (use the email you signed up to Resend with)
2. Restart your dev server: `npm run dev`
3. Book an appointment with ANY email
4. Check YOUR email inbox (the TEST_EMAIL)
5. You'll receive the email! ✅

## For Production:

1. Remove the `TEST_EMAIL` line from .env.local
2. Verify your own domain on Resend
3. Update `RESEND_FROM_EMAIL=noreply@yourdomain.com`
4. Deploy!

