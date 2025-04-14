// notify.js
const axios = require("axios");

const sendTelegramMessage = async (message) => {
    const botToken = '<BOT_API_TOKEN>';
    const chatId = '<CHAT_ID>';

    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;

    try {
        await axios.post(url, {
            chat_id: chatId,
            text: message,
        });
    } catch (error) {
        console.error("Error sending Telegram message:", error.message);
    }
};



module.exports = sendTelegramMessage;