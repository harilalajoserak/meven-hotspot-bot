import TelegramBot from "node-telegram-bot-api";

// Aza apetraka ato intsony ny token raha hampiasa Railway Variables ianao
const TOKEN = process.env.TELEGRAM_TOKEN || "8385187452:AAH4etR9nueIOAwc_7kOSkLiM4iIVGpO6C8";
const ADMIN_ID = Number(process.env.ADMIN_ID) || 8516247472;

const bot = new TelegramBot(TOKEN, { polling: true });

console.log("✅ Bot started...");

// /start tsotra (tsy mila parametre)
bot.onText(/\/start$/, (msg) => {
  const chatId = msg.chat.id;

  if (chatId !== ADMIN_ID) {
    bot.sendMessage(
      chatId,
      "✅ Demande envoyée.\n⏳ Attendez la validation de l’administrateur."
    );

    bot.sendMessage(ADMIN_ID, `📡 DEMANDE WIFI\n👤 User: ${chatId}`);
  } else {
    bot.sendMessage(chatId, "👑 Admin connecté.");
  }
});fix start command
