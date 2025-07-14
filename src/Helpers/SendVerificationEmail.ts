import { sendEmail } from "@/utils/sendemail";
import { ApiResponse } from "@/Types/ApiResponse";

export async function sendVerificationEmail(
  email: string,
  username: string,
  verifyCode: string
): Promise<ApiResponse> {
  const html = `
    <div style="font-family: sans-serif">
      <h2>Hello ${username},</h2>
      <p>Thank you for registering. Your verification code is:</p>
      <h3>${verifyCode}</h3>
      <p>If you didn’t request this, you can ignore this email.</p>
    </div>
  `;

  try {
    await sendEmail({
      to: email,
      subject: "Verification Code - True Feedback",
      html,
    });

    return { success: true, message: "Verification email sent successfully" };
  } catch (error) {
    console.error("Error sending verification email:", error);
    return { success: false, message: "Failed to send verification email" };
  }
}
