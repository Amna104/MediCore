/**
 * OTP Email Template for MediCore
 * This template generates the HTML for OTP verification emails
 */

export function getOTPEmailTemplate({
  userName,
  otp,
}: {
  userName: string;
  otp: string;
}): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verify Your Email</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 20px;">
          <tr>
            <td align="center">
              <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                <!-- Header -->
                <tr>
                  <td style="background: linear-gradient(135deg, #24AE7C 0%, #79B5EC 100%); padding: 40px 20px; text-align: center;">
                    <div style="width: 80px; height: 80px; background-color: rgba(255,255,255,0.2); border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 15px;">
                      <span style="font-size: 40px; color: white;">🔐</span>
                    </div>
                    <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">Email Verification</h1>
                    <p style="margin: 10px 0 0 0; color: #ffffff; font-size: 16px;">MediCore Healthcare</p>
                  </td>
                </tr>
                
                <!-- Content -->
                <tr>
                  <td style="padding: 40px 30px;">
                    <h2 style="margin: 0 0 20px 0; color: #0D0F10; font-size: 24px;">Welcome to MediCore!</h2>
                    
                    <p style="margin: 0 0 20px 0; color: #76828D; font-size: 16px; line-height: 1.6;">
                      Hi ${userName},
                    </p>
                    
                    <p style="margin: 0 0 20px 0; color: #76828D; font-size: 16px; line-height: 1.6;">
                      Thank you for registering with MediCore. To complete your registration and ensure the security of your account, please verify your email address using the OTP below.
                    </p>
                    
                    <!-- OTP Box -->
                    <div style="background: linear-gradient(135deg, #f0fdf4 0%, #e0f2fe 100%); border: 2px solid #24AE7C; padding: 30px; margin: 30px 0; border-radius: 12px; text-align: center;">
                      <p style="margin: 0 0 15px 0; color: #76828D; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">
                        Your Verification Code
                      </p>
                      <div style="background-color: #ffffff; border-radius: 8px; padding: 20px; display: inline-block;">
                        <p style="margin: 0; color: #0D0F10; font-size: 42px; font-weight: bold; letter-spacing: 8px; font-family: 'Courier New', monospace;">
                          ${otp}
                        </p>
                      </div>
                      <p style="margin: 15px 0 0 0; color: #76828D; font-size: 14px;">
                        This code expires in <strong style="color: #24AE7C;">10 minutes</strong>
                      </p>
                    </div>
                    
                    <!-- Instructions -->
                    <div style="background-color: #fff7ed; border-left: 4px solid #f59e0b; padding: 20px; margin: 30px 0; border-radius: 4px;">
                      <h3 style="margin: 0 0 10px 0; color: #0D0F10; font-size: 16px;">📋 Next Steps:</h3>
                      <ol style="margin: 10px 0 0 0; padding-left: 20px; color: #76828D; font-size: 14px; line-height: 1.8;">
                        <li>Enter the 6-digit code on the verification page</li>
                        <li>Complete your registration</li>
                        <li>Start booking appointments with our doctors</li>
                      </ol>
                    </div>
                    
                    <p style="margin: 20px 0; color: #76828D; font-size: 16px; line-height: 1.6;">
                      If you didn't request this verification code, you can safely ignore this email. The code will expire automatically.
                    </p>
                    
                    <!-- Security Note -->
                    <div style="background-color: #fef2f2; border-left: 4px solid #DC2626; padding: 15px; margin: 30px 0; border-radius: 4px;">
                      <p style="margin: 0; color: #991b1b; font-size: 14px; line-height: 1.6;">
                        <strong>⚠️ Security Reminder:</strong> Never share this code with anyone. MediCore staff will never ask for your verification code.
                      </p>
                    </div>
                    
                    <p style="margin: 30px 0 0 0; color: #76828D; font-size: 14px;">
                      Best regards,<br>
                      <strong>The MediCore Team</strong>
                    </p>
                  </td>
                </tr>
                
                <!-- Footer -->
                <tr>
                  <td style="background-color: #0D0F10; padding: 30px; text-align: center;">
                    <p style="margin: 0 0 10px 0; color: #ABB8C4; font-size: 14px;">
                      © ${new Date().getFullYear()} MediCore. All rights reserved.
                    </p>
                    <p style="margin: 0; color: #76828D; font-size: 12px;">
                      Next-Generation Healthcare Management
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;
}

