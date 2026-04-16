import { Resend } from "resend";
import ApiError from "./ApiError.js";

/* ================= GET RESEND INSTANCE ================= */

const getResend = () => {
  if (!process.env.RESEND_API_KEY) {
    throw new ApiError(500, "Missing RESEND_API_KEY");
  }

  return new Resend(process.env.RESEND_API_KEY);
};

/* ================= GENERIC SEND MAIL ================= */

const sendMail = async ({ to, subject, html, text }) => {
  try {
    if (!process.env.EMAIL_FROM) {
      throw new ApiError(500, "Missing EMAIL_FROM");
    }

    const resend = getResend();

    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM,
      to,
      subject,
      html,
      text
    });

    if (error) {
      console.error("Resend error:", error);
      throw new ApiError(500, error.message || "Failed to send email");
    }

    return data;
  } catch (err) {
    console.error("Email send failed:", err.message);
    throw err;
  }
};

/* ================= SEND OTP EMAIL ================= */

export const sendOtpEmail = async (to, otp) => {
  await sendMail({
    to,
    subject: "Your OTP for AI PR Review Platform",
    text: `Your OTP is ${otp}. It will expire in 10 minutes.`,
    html: `
      <div style="font-family: Arial, sans-serif;">
        <h2>OTP Verification</h2>
        <p>Your OTP is:</p>
        <h1 style="color:#2563eb;">${otp}</h1>
        <p>This OTP will expire in 10 minutes.</p>
      </div>
    `
  });
};

/* ================= SEND RESET PASSWORD EMAIL ================= */

export const sendResetPasswordEmail = async (to, resetLink) => {
  await sendMail({
    to,
    subject: "Reset Your Password - AI PR Review Platform",
    html: `
      <div style="font-family: Arial, sans-serif;">
        <h3>Password Reset Request</h3>
        <p>Click the button below to reset your password:</p>
        <a href="${resetLink}"
           style="padding:10px 20px; background:#2563eb; color:white; text-decoration:none; border-radius:5px;">
          Reset Password
        </a>
        <p>This link expires in 15 minutes.</p>
        <p>If you did not request this, please ignore this email.</p>
      </div>
    `
  });
};

/* ================= SEND INVITATION EMAIL ================= */

export const sendInvitationEmail = async (
  to,
  inviterName,
  repoName,
  acceptLink,
  declineLink
) => {
  await sendMail({
    to,
    subject: `${inviterName} invited you to collaborate on ${repoName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>You have been invited!</h2>
        <p>
          <strong>${inviterName}</strong> has invited you to collaborate 
          on the repository <strong>${repoName}</strong>.
        </p>
        <p>Click below to respond to this invitation:</p>
        <div style="margin: 20px 0;">
          <a href="${acceptLink}"
             style="padding:12px 24px; background:#16a34a; color:white; 
                    text-decoration:none; border-radius:6px; margin-right:10px;">
            Accept Invitation
          </a>
          <a href="${declineLink}"
             style="padding:12px 24px; background:#dc2626; color:white; 
                    text-decoration:none; border-radius:6px;">
            Decline Invitation
          </a>
        </div>
        <p style="color:#6b7280; font-size:14px;">
          This invitation expires in 7 days.
        </p>
      </div>
    `
  });
};