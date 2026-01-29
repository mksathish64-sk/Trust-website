const axios = require('axios');

async function sendToTelegram(message) {
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!botToken || !chatId) {
        console.warn('Telegram configuration missing. Message not sent.');
        return false;
    }

    try {
        const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
        await axios.post(url, {
            chat_id: chatId,
            text: message,
            parse_mode: 'HTML'
        });
        return true;
    } catch (error) {
        console.error('Error sending to Telegram:', error.message);
        return false;
    }
}

function formatContactMessage(data) {
    return `
🔔 <b>New Contact Enquiry</b>

👤 <b>Name:</b> ${data.name}
📧 <b>Email:</b> ${data.email}
📱 <b>Phone:</b> ${data.phone || 'N/A'}
📌 <b>Subject:</b> ${data.subject || 'N/A'}

💬 <b>Message:</b>
${data.message}

⏰ <b>Time:</b> ${new Date().toLocaleString()}
    `.trim();
}

module.exports = {
    sendToTelegram,
    formatContactMessage
};
