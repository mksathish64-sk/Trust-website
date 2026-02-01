const nodemailer = require('nodemailer');

// Create transporter
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: process.env.SMTP_PORT == 465, // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

// Templates for different email types
const templates = {
    donation: (name) => ({
        subject: '✨ A Heartfelt Thank You from HopeHarbor Foundation',
        html: `
            <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333; line-height: 1.6;">
                <div style="background: #0f172a; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
                    <h1 style="color: white; margin: 0; font-size: 24px;">HopeHarbor Foundation</h1>
                </div>
                <div style="padding: 30px; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 10px 10px; background: #fff;">
                    <p style="font-size: 16px;">Dear <strong>${name}</strong>,</p>
                    
                    <p>Thank you for reaching out to us with such a kind and generous heart. We are deeply moved by your interest in supporting our cause.</p>
                    
                    <p style="background-color: #f8fafc; padding: 20px; border-left: 4px solid #2563eb; font-style: italic; color: #475569;">
                        "We make a living by what we get, but we make a life by what we give."
                    </p>

                    <p>Your willingness to contribute helps us bring light, hope, and transformation to those who need it most. Every act of kindness creates a ripple effect of positive change in our community.</p>

                    <p>Our team has received your message and will review it meticulously. We will get back to you shortly with details on how we can proceed together to make a difference.</p>
                    
                    <p>With deepest gratitude,</p>
                    <p><strong>The HopeHarbor Team</strong></p>
                </div>
                <div style="text-align: center; padding: 20px; color: #94a3b8; font-size: 12px;">
                    &copy; ${new Date().getFullYear()} HopeHarbor Foundation. All rights reserved.
                </div>
            </div>
        `
    }),
    general: (name) => ({
        subject: 'We Received Your Message - HopeHarbor Foundation',
        html: `
            <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333; line-height: 1.6;">
                <div style="background: #0f172a; padding: 20px; text-align: center; border-radius: 10px 10px 0 0;">
                    <h1 style="color: white; margin: 0; font-size: 20px;">HopeHarbor Foundation</h1>
                </div>
                <div style="padding: 30px; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 10px 10px; background: #fff;">
                    <p>Dear <strong>${name}</strong>,</p>
                    
                    <p>Thank you for contacting HopeHarbor Foundation. We have successfully received your message and appreciate you taking the time to write to us.</p>
                    
                    <p>Our team is reviewing your inquiry and will respond as soon as possible.</p>
                    
                    <p>Warm regards,</p>
                    <p><strong>The HopeHarbor Team</strong></p>
                </div>
            </div>
        `
    }),
    passwordChanged: (name) => ({
        subject: '🔒 Your Password Has Been Changed - HopeHarbor Foundation',
        html: `
            <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333; line-height: 1.6;">
                <div style="background: #0f172a; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
                    <h1 style="color: white; margin: 0; font-size: 24px;">HopeHarbor Foundation</h1>
                </div>
                <div style="padding: 30px; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 10px 10px; background: #fff;">
                    <p>Dear <strong>${name}</strong>,</p>
                    
                    <p style="color: #16a34a; font-weight: bold;">✓ Your password has been successfully changed.</p>
                    
                    <p>If you did not make this change or have any concerns about your account security, please contact our support team immediately.</p>
                    
                    <p style="background-color: #fef2f2; padding: 15px; border-left: 4px solid #dc2626; color: #7f1d1d;">
                        <strong>Security Tip:</strong> Always use a strong, unique password and never share your credentials with anyone.
                    </p>
                    
                    <p>Best regards,</p>
                    <p><strong>The HopeHarbor Team</strong></p>
                </div>
            </div>
        `
    })
};

/**
 * Send an auto-reply email based on the context
 * @param {string} toEmail - Recipient email
 * @param {string} name - Recipient name
 * @param {boolean} isDonation - Whether the enquiry is related to donation
 */
const sendAutoReply = async (toEmail, name, isDonation = false) => {
    try {
        // Skip if SMTP config is missing (development safety)
        if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
            console.warn('⚠️ SMTP Configuration missing. Email not sent.');
            return false;
        }

        const template = isDonation ? templates.donation(name) : templates.general(name);

        const info = await transporter.sendMail({
            from: process.env.SMTP_FROM || '"HopeHarbor Foundation" <no-reply@hopeharbor.org>',
            to: toEmail,
            subject: template.subject,
            html: template.html
        });

        console.log('📧 Auto-reply sent:', info.messageId);
        return true;
    } catch (error) {
        console.error('❌ Error sending email:', error);
        return false;
    }
};

/**
 * Send password change confirmation email
 * @param {string} toEmail - Recipient email
 * @param {string} name - Recipient name
 */
const sendPasswordChangeEmail = async (toEmail, name) => {
    try {
        if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
            console.warn('⚠️ SMTP Configuration missing. Email not sent.');
            return false;
        }

        const template = templates.passwordChanged(name);

        const info = await transporter.sendMail({
            from: process.env.SMTP_FROM || '"HopeHarbor Foundation" <no-reply@hopeharbor.org>',
            to: toEmail,
            subject: template.subject,
            html: template.html
        });

        console.log('📧 Password change email sent:', info.messageId);
        return true;
    } catch (error) {
        console.error('❌ Error sending password change email:', error);
        return false;
    }
};

module.exports = { sendAutoReply, sendPasswordChangeEmail };
