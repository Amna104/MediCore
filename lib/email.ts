import { Resend } from "resend";
import { getOTPEmailTemplate } from "./email-templates/otp-template";

// Initialize Resend with API key
const resend = new Resend(process.env.RESEND_API_KEY || "dummy_key_for_dev");

// Email configuration
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";

/**
 * Send OTP verification email
 */
export const sendOTPEmail = async ({
  userName,
  userEmail,
  otp,
}: {
  userName: string;
  userEmail: string;
  otp: string;
}) => {
  try {
    // Use TEST_EMAIL for development if set
    const recipientEmail = process.env.TEST_EMAIL || userEmail;
    
    const { data, error } = await resend.emails.send({
      from: `MediCore <${FROM_EMAIL}>`,
      to: [recipientEmail],
      subject: "Verify Your Email - MediCore",
      html: getOTPEmailTemplate({
        userName,
        otp,
      }),
    });

    if (error) {
      console.error("Error sending OTP email:", error);
      return { success: false, error };
    }

    console.log(`OTP email sent successfully to ${recipientEmail}:`, data);
    return { success: true, data };
  } catch (error) {
    console.error("Error in sendOTPEmail:", error);
    return { success: false, error };
  }
};

/**
 * Send appointment confirmation email to patient
 */
export const sendAppointmentConfirmationEmail = async ({
  patientName,
  patientEmail,
  doctorName,
  appointmentDate,
  appointmentTime,
}: {
  patientName: string;
  patientEmail: string;
  doctorName: string;
  appointmentDate: string;
  appointmentTime: string;
}) => {
  try {
    // In development with onboarding@resend.dev, emails can only be sent to verified addresses
    // Use TEST_EMAIL env variable to override recipient for testing
    const recipientEmail = process.env.TEST_EMAIL || patientEmail;
    
    const { data, error } = await resend.emails.send({
      from: `MediCore <${FROM_EMAIL}>`,
      to: [recipientEmail],
      subject: "Appointment Confirmation - MediCore",
      html: getAppointmentConfirmationTemplate({
        patientName,
        doctorName,
        appointmentDate,
        appointmentTime,
      }),
    });

    if (error) {
      console.error("Error sending appointment confirmation email:", error);
      return { success: false, error };
    }

    console.log(`Appointment confirmation email sent successfully to ${recipientEmail}:`, data);
    return { success: true, data };
  } catch (error) {
    console.error("Error in sendAppointmentConfirmationEmail:", error);
    return { success: false, error };
  }
};

/**
 * Send appointment scheduled email (when admin confirms)
 */
export const sendAppointmentScheduledEmail = async ({
  patientName,
  patientEmail,
  doctorName,
  appointmentDate,
  appointmentTime,
}: {
  patientName: string;
  patientEmail: string;
  doctorName: string;
  appointmentDate: string;
  appointmentTime: string;
}) => {
  try {
    // In development with onboarding@resend.dev, emails can only be sent to verified addresses
    // Use TEST_EMAIL env variable to override recipient for testing
    const recipientEmail = process.env.TEST_EMAIL || patientEmail;
    
    const { data, error } = await resend.emails.send({
      from: `MediCore <${FROM_EMAIL}>`,
      to: [recipientEmail],
      subject: "Appointment Scheduled - MediCore",
      html: getAppointmentScheduledTemplate({
        patientName,
        doctorName,
        appointmentDate,
        appointmentTime,
      }),
    });

    if (error) {
      console.error("Error sending appointment scheduled email:", error);
      return { success: false, error };
    }

    console.log(`Appointment scheduled email sent successfully to ${recipientEmail}:`, data);
    return { success: true, data };
  } catch (error) {
    console.error("Error in sendAppointmentScheduledEmail:", error);
    return { success: false, error };
  }
};

/**
 * Send appointment cancellation email
 */
export const sendAppointmentCancellationEmail = async ({
  patientName,
  patientEmail,
  doctorName,
  appointmentDate,
  appointmentTime,
  cancellationReason,
}: {
  patientName: string;
  patientEmail: string;
  doctorName: string;
  appointmentDate: string;
  appointmentTime: string;
  cancellationReason?: string;
}) => {
  try {
    // In development with onboarding@resend.dev, emails can only be sent to verified addresses
    // Use TEST_EMAIL env variable to override recipient for testing
    const recipientEmail = process.env.TEST_EMAIL || patientEmail;
    
    const { data, error } = await resend.emails.send({
      from: `MediCore <${FROM_EMAIL}>`,
      to: [recipientEmail],
      subject: "Appointment Cancelled - MediCore",
      html: getAppointmentCancellationTemplate({
        patientName,
        doctorName,
        appointmentDate,
        appointmentTime,
        cancellationReason,
      }),
    });

    if (error) {
      console.error("Error sending appointment cancellation email:", error);
      return { success: false, error };
    }

    console.log(`Appointment cancellation email sent successfully to ${recipientEmail}:`, data);
    return { success: true, data };
  } catch (error) {
    console.error("Error in sendAppointmentCancellationEmail:", error);
    return { success: false, error };
  }
};

/**
 * HTML template for appointment confirmation (when patient books)
 */
function getAppointmentConfirmationTemplate({
  patientName,
  doctorName,
  appointmentDate,
  appointmentTime,
}: {
  patientName: string;
  doctorName: string;
  appointmentDate: string;
  appointmentTime: string;
}) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Appointment Confirmation</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 20px;">
          <tr>
            <td align="center">
              <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                <!-- Header -->
                <tr>
                  <td style="background: linear-gradient(135deg, #24AE7C 0%, #79B5EC 100%); padding: 40px 20px; text-align: center;">
                    <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">MediCore</h1>
                    <p style="margin: 10px 0 0 0; color: #ffffff; font-size: 16px;">Healthcare Made Simple</p>
                  </td>
                </tr>
                
                <!-- Content -->
                <tr>
                  <td style="padding: 40px 30px;">
                    <h2 style="margin: 0 0 20px 0; color: #0D0F10; font-size: 24px;">Appointment Request Received</h2>
                    
                    <p style="margin: 0 0 20px 0; color: #76828D; font-size: 16px; line-height: 1.6;">
                      Dear ${patientName},
                    </p>
                    
                    <p style="margin: 0 0 20px 0; color: #76828D; font-size: 16px; line-height: 1.6;">
                      Thank you for booking an appointment with MediCore. We have received your appointment request and it is currently <strong style="color: #79B5EC;">pending confirmation</strong> from our admin team.
                    </p>
                    
                    <!-- Appointment Details Box -->
                    <div style="background-color: #f8f9fa; border-left: 4px solid #24AE7C; padding: 20px; margin: 30px 0; border-radius: 4px;">
                      <h3 style="margin: 0 0 15px 0; color: #0D0F10; font-size: 18px;">Appointment Details</h3>
                      
                      <table width="100%" cellpadding="8" cellspacing="0">
                        <tr>
                          <td style="color: #76828D; font-size: 14px; padding: 8px 0;">
                            <strong>Doctor:</strong>
                          </td>
                          <td style="color: #0D0F10; font-size: 14px; padding: 8px 0; text-align: right;">
                            Dr. ${doctorName}
                          </td>
                        </tr>
                        <tr>
                          <td style="color: #76828D; font-size: 14px; padding: 8px 0;">
                            <strong>Date:</strong>
                          </td>
                          <td style="color: #0D0F10; font-size: 14px; padding: 8px 0; text-align: right;">
                            ${appointmentDate}
                          </td>
                        </tr>
                        <tr>
                          <td style="color: #76828D; font-size: 14px; padding: 8px 0;">
                            <strong>Time:</strong>
                          </td>
                          <td style="color: #0D0F10; font-size: 14px; padding: 8px 0; text-align: right;">
                            ${appointmentTime}
                          </td>
                        </tr>
                        <tr>
                          <td style="color: #76828D; font-size: 14px; padding: 8px 0;">
                            <strong>Status:</strong>
                          </td>
                          <td style="color: #79B5EC; font-size: 14px; padding: 8px 0; text-align: right;">
                            <strong>Pending Confirmation</strong>
                          </td>
                        </tr>
                      </table>
                    </div>
                    
                    <p style="margin: 0 0 20px 0; color: #76828D; font-size: 16px; line-height: 1.6;">
                      You will receive another email and SMS notification once your appointment is confirmed by our team. This usually happens within 24 hours.
                    </p>
                    
                    <p style="margin: 0 0 30px 0; color: #76828D; font-size: 16px; line-height: 1.6;">
                      If you have any questions or need to make changes, please don't hesitate to contact us.
                    </p>
                    
                    <!-- CTA Button -->
                    <div style="text-align: center; margin: 30px 0;">
                      <a href="${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}" 
                         style="display: inline-block; background-color: #24AE7C; color: #ffffff; text-decoration: none; padding: 14px 30px; border-radius: 50px; font-size: 16px; font-weight: bold;">
                        View Dashboard
                      </a>
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

/**
 * HTML template for appointment scheduled (when admin confirms)
 */
function getAppointmentScheduledTemplate({
  patientName,
  doctorName,
  appointmentDate,
  appointmentTime,
}: {
  patientName: string;
  doctorName: string;
  appointmentDate: string;
  appointmentTime: string;
}) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Appointment Scheduled</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 20px;">
          <tr>
            <td align="center">
              <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                <!-- Header -->
                <tr>
                  <td style="background: linear-gradient(135deg, #24AE7C 0%, #79B5EC 100%); padding: 40px 20px; text-align: center;">
                    <div style="width: 60px; height: 60px; background-color: rgba(255,255,255,0.2); border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 15px;">
                      <span style="font-size: 30px;">✓</span>
                    </div>
                    <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">Appointment Confirmed!</h1>
                    <p style="margin: 10px 0 0 0; color: #ffffff; font-size: 16px;">Your appointment has been scheduled</p>
                  </td>
                </tr>
                
                <!-- Content -->
                <tr>
                  <td style="padding: 40px 30px;">
                    <p style="margin: 0 0 20px 0; color: #76828D; font-size: 16px; line-height: 1.6;">
                      Dear ${patientName},
                    </p>
                    
                    <p style="margin: 0 0 20px 0; color: #76828D; font-size: 16px; line-height: 1.6;">
                      Great news! Your appointment has been <strong style="color: #24AE7C;">confirmed</strong> by our team. We look forward to seeing you.
                    </p>
                    
                    <!-- Appointment Details Box -->
                    <div style="background-color: #f0fdf4; border-left: 4px solid #24AE7C; padding: 20px; margin: 30px 0; border-radius: 4px;">
                      <h3 style="margin: 0 0 15px 0; color: #0D0F10; font-size: 18px;">Confirmed Appointment Details</h3>
                      
                      <table width="100%" cellpadding="8" cellspacing="0">
                        <tr>
                          <td style="color: #76828D; font-size: 14px; padding: 8px 0;">
                            <strong>Doctor:</strong>
                          </td>
                          <td style="color: #0D0F10; font-size: 14px; padding: 8px 0; text-align: right;">
                            Dr. ${doctorName}
                          </td>
                        </tr>
                        <tr>
                          <td style="color: #76828D; font-size: 14px; padding: 8px 0;">
                            <strong>Date:</strong>
                          </td>
                          <td style="color: #0D0F10; font-size: 14px; padding: 8px 0; text-align: right;">
                            ${appointmentDate}
                          </td>
                        </tr>
                        <tr>
                          <td style="color: #76828D; font-size: 14px; padding: 8px 0;">
                            <strong>Time:</strong>
                          </td>
                          <td style="color: #0D0F10; font-size: 14px; padding: 8px 0; text-align: right;">
                            ${appointmentTime}
                          </td>
                        </tr>
                        <tr>
                          <td style="color: #76828D; font-size: 14px; padding: 8px 0;">
                            <strong>Status:</strong>
                          </td>
                          <td style="color: #24AE7C; font-size: 14px; padding: 8px 0; text-align: right;">
                            <strong>✓ Confirmed</strong>
                          </td>
                        </tr>
                      </table>
                    </div>
                    
                    <!-- Important Notes -->
                    <div style="background-color: #fff7ed; border-left: 4px solid #f59e0b; padding: 20px; margin: 30px 0; border-radius: 4px;">
                      <h3 style="margin: 0 0 10px 0; color: #0D0F10; font-size: 16px;">Important Reminders:</h3>
                      <ul style="margin: 0; padding-left: 20px; color: #76828D; font-size: 14px; line-height: 1.8;">
                        <li>Please arrive 10-15 minutes before your appointment time</li>
                        <li>Bring your insurance card and identification</li>
                        <li>Bring any relevant medical records or test results</li>
                        <li>If you need to cancel or reschedule, please notify us at least 24 hours in advance</li>
                      </ul>
                    </div>
                    
                    <!-- CTA Button -->
                    <div style="text-align: center; margin: 30px 0;">
                      <a href="${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}" 
                         style="display: inline-block; background-color: #24AE7C; color: #ffffff; text-decoration: none; padding: 14px 30px; border-radius: 50px; font-size: 16px; font-weight: bold;">
                        View Appointment Details
                      </a>
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

/**
 * HTML template for appointment cancellation
 */
function getAppointmentCancellationTemplate({
  patientName,
  doctorName,
  appointmentDate,
  appointmentTime,
  cancellationReason,
}: {
  patientName: string;
  doctorName: string;
  appointmentDate: string;
  appointmentTime: string;
  cancellationReason?: string;
}) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Appointment Cancelled</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 20px;">
          <tr>
            <td align="center">
              <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                <!-- Header -->
                <tr>
                  <td style="background: linear-gradient(135deg, #F37877 0%, #DC2626 100%); padding: 40px 20px; text-align: center;">
                    <div style="width: 60px; height: 60px; background-color: rgba(255,255,255,0.2); border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 15px;">
                      <span style="font-size: 30px; color: white;">✕</span>
                    </div>
                    <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">Appointment Cancelled</h1>
                    <p style="margin: 10px 0 0 0; color: #ffffff; font-size: 16px;">Your appointment has been cancelled</p>
                  </td>
                </tr>
                
                <!-- Content -->
                <tr>
                  <td style="padding: 40px 30px;">
                    <p style="margin: 0 0 20px 0; color: #76828D; font-size: 16px; line-height: 1.6;">
                      Dear ${patientName},
                    </p>
                    
                    <p style="margin: 0 0 20px 0; color: #76828D; font-size: 16px; line-height: 1.6;">
                      We regret to inform you that your appointment has been <strong style="color: #DC2626;">cancelled</strong>.
                    </p>
                    
                    <!-- Appointment Details Box -->
                    <div style="background-color: #fef2f2; border-left: 4px solid #F37877; padding: 20px; margin: 30px 0; border-radius: 4px;">
                      <h3 style="margin: 0 0 15px 0; color: #0D0F10; font-size: 18px;">Cancelled Appointment Details</h3>
                      
                      <table width="100%" cellpadding="8" cellspacing="0">
                        <tr>
                          <td style="color: #76828D; font-size: 14px; padding: 8px 0;">
                            <strong>Doctor:</strong>
                          </td>
                          <td style="color: #0D0F10; font-size: 14px; padding: 8px 0; text-align: right;">
                            Dr. ${doctorName}
                          </td>
                        </tr>
                        <tr>
                          <td style="color: #76828D; font-size: 14px; padding: 8px 0;">
                            <strong>Date:</strong>
                          </td>
                          <td style="color: #0D0F10; font-size: 14px; padding: 8px 0; text-align: right;">
                            ${appointmentDate}
                          </td>
                        </tr>
                        <tr>
                          <td style="color: #76828D; font-size: 14px; padding: 8px 0;">
                            <strong>Time:</strong>
                          </td>
                          <td style="color: #0D0F10; font-size: 14px; padding: 8px 0; text-align: right;">
                            ${appointmentTime}
                          </td>
                        </tr>
                        <tr>
                          <td style="color: #76828D; font-size: 14px; padding: 8px 0;">
                            <strong>Status:</strong>
                          </td>
                          <td style="color: #DC2626; font-size: 14px; padding: 8px 0; text-align: right;">
                            <strong>Cancelled</strong>
                          </td>
                        </tr>
                        ${
                          cancellationReason
                            ? `
                        <tr>
                          <td colspan="2" style="padding-top: 15px;">
                            <div style="background-color: #ffffff; padding: 15px; border-radius: 4px; margin-top: 10px;">
                              <p style="margin: 0; color: #76828D; font-size: 14px;"><strong>Reason:</strong></p>
                              <p style="margin: 5px 0 0 0; color: #0D0F10; font-size: 14px;">${cancellationReason}</p>
                            </div>
                          </td>
                        </tr>
                        `
                            : ""
                        }
                      </table>
                    </div>
                    
                    <p style="margin: 0 0 20px 0; color: #76828D; font-size: 16px; line-height: 1.6;">
                      We apologize for any inconvenience this may cause. You're welcome to book another appointment at your convenience.
                    </p>
                    
                    <!-- CTA Button -->
                    <div style="text-align: center; margin: 30px 0;">
                      <a href="${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/patient" 
                         style="display: inline-block; background-color: #24AE7C; color: #ffffff; text-decoration: none; padding: 14px 30px; border-radius: 50px; font-size: 16px; font-weight: bold;">
                        Book New Appointment
                      </a>
                    </div>
                    
                    <p style="margin: 30px 0 0 0; color: #76828D; font-size: 14px;">
                      If you have any questions or concerns, please don't hesitate to contact us.<br><br>
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


/**
 * HTML template for OTP verification email
 */
