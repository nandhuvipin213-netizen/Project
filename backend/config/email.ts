
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

export const sendDriverCredentialsEmail = async (
    name: string,
    email: string,
    temporaryPassword: string
) => {
    await transporter.sendMail({
        from: `"Smart Logistics" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "Your Smart Logistics Driver Account",
        text: `
Hello ${name},

Your Smart Logistics driver account has been created.

Login Email: ${email}
Temporary Password: ${temporaryPassword}

Please log in and change your temporary password.

Login URL: ${process.env.FRONTEND_URL}/driver/login

Regards,
Smart Logistics Team
        `,
        html: `
            <h2>Welcome to Smart Logistics!</h2>
            <p>Hello ${name},</p>
            <p>Your driver account has been created successfully.</p>
            <p><strong>Login Email:</strong> ${email}</p>
            <p><strong>Temporary Password:</strong> ${temporaryPassword}</p>
            <p>Please log in and change your temporary password.</p>
            <a href="${process.env.FRONTEND_URL}/driver/login">
                Login to Driver Portal
            </a>
            <p>Regards,<br/>Smart Logistics Team</p>
        `,
    });
};
