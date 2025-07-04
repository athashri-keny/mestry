import { resend } from "@/lib/Resend";
import VerificationEmail from "../../Emails/VerificationEmail";
import { ApiResponse } from "@/Types/ApiResponse";

export async function sendVerificationEmail(
    email: string ,
    username: string,
    verifyCode: string
): Promise<ApiResponse> {

   try {
    await resend.emails.send({
  from: 'you@example.com',
  to: email,
  subject: 'Verification Code',
  react: VerificationEmail({username , otp: verifyCode}),
});
    return {success: true , message: " send verification email sucessfully"}

   } catch (emailError) {
    console.error("Error sending verification email" , emailError)
    
    return {success: false , message: "Failed to send verification email"}
   }
}
