require('dotenv').config();
const nodemailer = require('nodemailer');

async function testEmail() {
    console.log('🔄 Testing Email Configuration...');
    console.log('--------------------------------');
    console.log('Host:', process.env.SMTP_HOST);
    console.log('User:', process.env.SMTP_USER);
    // Do not log password for security

    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
        console.error('\n❌ ERROR: SMTP credentials missing in .env file.');
        console.error('Please set SMTP_USER and SMTP_PASS.');
        return;
    }

    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: process.env.SMTP_PORT || 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        }
    });

    try {
        // 1. Verify connection
        console.log('\n📡 Verifying SMTP connection...');
        await transporter.verify();
        console.log('✅ Connection Successful!');

        // 2. Send test email
        console.log('\n📧 Sending test email to yourself...');
        const info = await transporter.sendMail({
            from: process.env.SMTP_FROM || process.env.SMTP_USER,
            to: process.env.SMTP_USER, // Send to self
            subject: '✅ HopeHarbor Email Test',
            text: 'If you are reading this, your email configuration is working perfectly!',
            html: '<h3>Success!</h3><p>If you are reading this, your email configuration is working perfectly!</p>'
        });

        console.log('✅ Test Email Sent!');
        console.log('Message ID:', info.messageId);
        console.log('\n🎉 You are all set! The website will now send emails automatically.');

    } catch (error) {
        console.error('\n❌ Email Test Failed!');
        console.error('Error:', error.message);

        if (error.code === 'EAUTH') {
            console.error('\nPossible Causes:');
            console.error('1. Invalid email or App Password.');
            console.error('2. You are using your normal Gmail password instead of an App Password.');
            console.error('3. 2-Step Verification is not enabled on your Google Account.');
        }
    }
}

testEmail();
