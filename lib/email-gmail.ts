import nodemailer from "nodemailer";

import { getOTPEmailTemplate } from "./email-templates/otp-template";

// Gmail configuration
const GMAIL_USER = process.env.GMAIL_USER;
const GMAIL_APP_PASSWORD = process.env.GMAIL_APP_PASSWORD;

// Create transporter
let transporter: nodemailer.Transporter | null = null;

if (GMAIL_USER && GMAIL_APP_PASSWORD) {
  transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: GMAIL_USER,
      pass: GMAIL_APP_PASSWORD,
    },
  });
}

/**
 * Send OTP verification email using Gmail
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
    if (!transporter) {
      return {
        success: false,
        error: new Error(
          "Gmail not configured. Set GMAIL_USER and GMAIL_APP_PASSWORD in your environment."
        ),
      };
    }

    const recipientEmail = process.env.TEST_EMAIL || userEmail;

    const mailOptions = {
      from: `"MediCore" <${GMAIL_USER}>`,
      to: recipientEmail,
      subject: "Verify Your Email - MediCore",
      html: getOTPEmailTemplate({
        userName,
        otp,
      }),
    };

    const info = await transporter.sendMail(mailOptions);

    console.log(`OTP email sent successfully to ${recipientEmail}:`, info.messageId);
    return { success: true, data: info };
  } catch (error) {
    console.error("Error sending OTP email:", error);
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
    if (!transporter) {
      return {
        success: false,
        error: new Error("Gmail not configured."),
      };
    }

    const recipientEmail = process.env.TEST_EMAIL || patientEmail;

    const mailOptions = {
      from: `"MediCore" <${GMAIL_USER}>`,
      to: recipientEmail,
      subject: "Appointment Confirmation - MediCore",
      html: getAppointmentConfirmationTemplate({
        patientName,
        doctorName,
        appointmentDate,
        appointmentTime,
      }),
    };

    const info = await transporter.sendMail(mailOptions);

    console.log(
      `Appointment confirmation email sent successfully to ${recipientEmail}:`,
      info.messageId
    );
    return { success: true, data: info };
  } catch (error) {
    console.error("Error sending appointment confirmation email:", error);
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
    if (!transporter) {
      return {
        success: false,
        error: new Error("Gmail not configured."),
      };
    }

    const recipientEmail = process.env.TEST_EMAIL || patientEmail;

    const mailOptions = {
      from: `"MediCore" <${GMAIL_USER}>`,
      to: recipientEmail,
      subject: "Appointment Scheduled - MediCore",
      html: getAppointmentScheduledTemplate({
        patientName,
        doctorName,
        appointmentDate,
        appointmentTime,
      }),
    };

    const info = await transporter.sendMail(mailOptions);

    console.log(
      `Appointment scheduled email sent successfully to ${recipientEmail}:`,
      info.messageId
    );
    return { success: true, data: info };
  } catch (error) {
    console.error("Error sending appointment scheduled email:", error);
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
    if (!transporter) {
      return {
        success: false,
        error: new Error("Gmail not configured."),
      };
    }

    const recipientEmail = process.env.TEST_EMAIL || patientEmail;

    const mailOptions = {
      from: `"MediCore" <${GMAIL_USER}>`,
      to: recipientEmail,
      subject: "Appointment Cancelled - MediCore",
      html: getAppointmentCancellationTemplate({
        patientName,
        doctorName,
        appointmentDate,
        appointmentTime,
        cancellationReason,
      }),
    };

    const info = await transporter.sendMail(mailOptions);

    console.log(
      `Appointment cancellation email sent successfully to ${recipientEmail}:`,
      info.messageId
    );
    return { success: true, data: info };
  } catch (error) {
    console.error("Error sending appointment cancellation email:", error);
    return { success: false, error };
  }
};

// Email templates (same as before)
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
                <tr>
                  <td style="background: linear-gradient(135deg, #24AE7C 0%, #79B5EC 100%); padding: 40px 20px; text-align: center;">
                    <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">MediCore</h1>
                    <p style="margin: 10px 0 0 0; color: #ffffff; font-size: 16px;">Healthcare Made Simple</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 40px 30px;">
                    <h2 style="margin: 0 0 20px 0; color: #0D0F10; font-size: 24px;">Appointment Request Received</h2>
                    <p style="margin: 0 0 20px 0; color: #76828D; font-size: 16px; line-height: 1.6;">
                      Dear ${patientName},
                    </p>
                    <p style="margin: 0 0 20px 0; color: #76828D; font-size: 16px; line-height: 1.6;">
                      Thank you for booking an appointment with MediCore. We have received your appointment request.
                    </p>
                    <div style="background-color: #f8f9fa; border-left: 4px solid #24AE7C; padding: 20px; margin: 30px 0; border-radius: 4px;">
                      <h3 style="margin: 0 0 15px 0; color: #0D0F10; font-size: 18px;">Appointment Details</h3>
                      <p style="margin: 5px 0; color: #76828D;"><strong>Doctor:</strong> Dr. ${doctorName}</p>
                      <p style="margin: 5px 0; color: #76828D;"><strong>Date:</strong> ${appointmentDate}</p>
                      <p style="margin: 5px 0; color: #76828D;"><strong>Time:</strong> ${appointmentTime}</p>
                      <p style="margin: 5px 0; color: #79B5EC;"><strong>Status:</strong> Pending Confirmation</p>
                    </div>
                    <p style="margin: 30px 0 0 0; color: #76828D; font-size: 14px;">
                      Best regards,<br>
                      <strong>The MediCore Team</strong>
                    </p>
                  </td>
                </tr>
                <tr>
                  <td style="background-color: #0D0F10; padding: 30px; text-align: center;">
                    <p style="margin: 0; color: #ABB8C4; font-size: 14px;">
                      © ${new Date().getFullYear()} MediCore. All rights reserved.
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
                <tr>
                  <td style="background: linear-gradient(135deg, #24AE7C 0%, #79B5EC 100%); padding: 40px 20px; text-align: center;">
                    <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">Appointment Confirmed!</h1>
                    <p style="margin: 10px 0 0 0; color: #ffffff; font-size: 16px;">Your appointment has been scheduled</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 40px 30px;">
                    <p style="margin: 0 0 20px 0; color: #76828D; font-size: 16px; line-height: 1.6;">
                      Dear ${patientName},
                    </p>
                    <p style="margin: 0 0 20px 0; color: #76828D; font-size: 16px; line-height: 1.6;">
                      Great news! Your appointment has been confirmed.
                    </p>
                    <div style="background-color: #f0fdf4; border-left: 4px solid #24AE7C; padding: 20px; margin: 30px 0; border-radius: 4px;">
                      <h3 style="margin: 0 0 15px 0; color: #0D0F10; font-size: 18px;">Confirmed Appointment Details</h3>
                      <p style="margin: 5px 0; color: #76828D;"><strong>Doctor:</strong> Dr. ${doctorName}</p>
                      <p style="margin: 5px 0; color: #76828D;"><strong>Date:</strong> ${appointmentDate}</p>
                      <p style="margin: 5px 0; color: #76828D;"><strong>Time:</strong> ${appointmentTime}</p>
                      <p style="margin: 5px 0; color: #24AE7C;"><strong>Status:</strong> ✓ Confirmed</p>
                    </div>
                    <p style="margin: 30px 0 0 0; color: #76828D; font-size: 14px;">
                      Best regards,<br>
                      <strong>The MediCore Team</strong>
                    </p>
                  </td>
                </tr>
                <tr>
                  <td style="background-color: #0D0F10; padding: 30px; text-align: center;">
                    <p style="margin: 0; color: #ABB8C4; font-size: 14px;">
                      © ${new Date().getFullYear()} MediCore. All rights reserved.
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
                <tr>
                  <td style="background: linear-gradient(135deg, #F37877 0%, #DC2626 100%); padding: 40px 20px; text-align: center;">
                    <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">Appointment Cancelled</h1>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 40px 30px;">
                    <p style="margin: 0 0 20px 0; color: #76828D; font-size: 16px; line-height: 1.6;">
                      Dear ${patientName},
                    </p>
                    <p style="margin: 0 0 20px 0; color: #76828D; font-size: 16px; line-height: 1.6;">
                      Your appointment has been cancelled.
                    </p>
                    <div style="background-color: #fef2f2; border-left: 4px solid #F37877; padding: 20px; margin: 30px 0; border-radius: 4px;">
                      <h3 style="margin: 0 0 15px 0; color: #0D0F10; font-size: 18px;">Cancelled Appointment Details</h3>
                      <p style="margin: 5px 0; color: #76828D;"><strong>Doctor:</strong> Dr. ${doctorName}</p>
                      <p style="margin: 5px 0; color: #76828D;"><strong>Date:</strong> ${appointmentDate}</p>
                      <p style="margin: 5px 0; color: #76828D;"><strong>Time:</strong> ${appointmentTime}</p>
                      ${cancellationReason ? `<p style="margin: 10px 0 0 0; color: #76828D;"><strong>Reason:</strong> ${cancellationReason}</p>` : ""}
                    </div>
                    <p style="margin: 30px 0 0 0; color: #76828D; font-size: 14px;">
                      Best regards,<br>
                      <strong>The MediCore Team</strong>
                    </p>
                  </td>
                </tr>
                <tr>
                  <td style="background-color: #0D0F10; padding: 30px; text-align: center;">
                    <p style="margin: 0; color: #ABB8C4; font-size: 14px;">
                      © ${new Date().getFullYear()} MediCore. All rights reserved.
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

