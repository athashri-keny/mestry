import nodemailer from 'nodemailer'

interface EmailPayload {
  to: string
  subject: string
  html: string
}

export async function sendEmail({ to, subject, html }: EmailPayload) {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,           // your Gmail (e.g., athashrikeny38@gmail.com)
        pass: process.env.GMAIL_APP_PASSWORD    // app password (not real password)
      }
    })

    const mailOptions = {
      from: `"True Feedback" <${process.env.GMAIL_USER}>`,
      to,
      subject,
      html
    }

    const info = await transporter.sendMail(mailOptions)
    console.log('Email sent:', info.response)
    return true
  } catch (error) {
    console.error('Error sending email:', error)
    return false
  }
}
