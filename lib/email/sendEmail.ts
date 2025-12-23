import { transporter } from "./config";

type EmailData = {
    to: string;
    subject: string;
    html: string;
    from?: string
}

export const sendEmail = async ({ to, subject, html, from }: EmailData) => {
    const mailOptions = {
        from: from || `DayMark <${process.env.EMAIL_USER}>`,
        to,
        subject,
        html
    }

    try {
        const info = await transporter.sendMail(mailOptions);
        return {
            success: true,
            info
        }
    } catch (error) {
        console.error('Email sending failed:', error);
        return { success: false, error };
    }
}