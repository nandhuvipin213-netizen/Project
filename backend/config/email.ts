
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


export const sendPasswordResetOTPEmail = async (
    name: string,
    email: string,
    otp: string
) => {
    await transporter.sendMail({
        from: `"Smart Logistics" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "Smart Logistics - Password Reset OTP",
        text: `Hello ${name},

Your password reset OTP is: ${otp}

This OTP is valid for 5 minutes.

If you did not request a password reset, please ignore this email.

Smart Logistics Team`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto; padding: 20px;">
                <h2 style="color: #4f46e5;">Smart Logistics</h2>
                <p>Hello ${name},</p>
                <p>Use the OTP below to reset your password:</p>
                <div style="font-size: 30px; font-weight: bold; letter-spacing: 8px; color: #4f46e5; padding: 15px 0;">
                    ${otp}
                </div>
                <p>This OTP is valid for <strong>5 minutes</strong>.</p>
                <p>If you did not request a password reset, please ignore this email.</p>
                <p>Smart Logistics Team</p>
            </div>
        `,
    });
};
