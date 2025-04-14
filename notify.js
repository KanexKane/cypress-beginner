// notify.js
const axios = require("axios");

const sendTelegramMessage = async (message) => {
    const botToken = '7223917976:AAF1zfnNBE1SLylzlYHHgQlOwXdWnYpz4pY';
    const chatId = '699253874';

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