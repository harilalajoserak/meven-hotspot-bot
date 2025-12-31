import TelegramBot from "node-telegram-bot-api";

const TOKEN = "7953446954:AAHiSx2wD6GapU5ccthbEsC-l8pryvM703c";
const ADMIN_ID = 8516247472;

const bot = new TelegramBot(TOKEN, { polling: true });

bot.onText(/\/start (.+)/, (msg, match) => {
  const chatId = msg.chat.id;
  const data = match[1]; // ex: MAC_1 na MAC_3

  if (chatId !== ADMIN_ID) {
    bot.sendMessage(chatId,
      "✅ Demande envoyee.\n⏳ Attendez la validation de l administrateur."
    );

    bot.sendMessage(ADMIN_ID,
      `📡 DEMANDE WIFI\nUser: ${chatId}\nInfo: ${data}`
    );
  } else {
    bot.sendMessage(chatId, "Admin connecte");
  }
});
