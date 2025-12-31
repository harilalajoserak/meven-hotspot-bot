import TelegramBot from "node-telegram-bot-api";

// Railway Environment Variables
const TOKEN = process.env.TOKEN;
const ADMIN_ID = Number(process.env.ADMIN_ID);

if (!TOKEN || !ADMIN_ID) {
  console.error("TOKEN ou ADMIN_ID manquant");
  process.exit(1);
}

const bot = new TelegramBot(TOKEN, { polling: true });

console.log("🤖 Bot Telegram MEVEN HOTSPOT en marche...");

// /start command
bot.onText(/\/start(?:\s+(.*))?/, (msg, match) => {
  const chatId = msg.chat.id;
  const data = match && match[1] ? match[1] : "Aucune info";

  // User
  if (chatId !== ADMIN_ID) {
    bot.sendMessage(
      chatId,
      "✅ Demande envoyee.\n⏳ Attendez la validation de l administrateur."
    );

    bot.sendMessage(
      ADMIN_ID,
      `📡 DEMANDE WIFI\n👤 User ID: ${chatId}\nℹ️ Info: ${data}`
    );
  }
  // Admin
  else {
    bot.sendMessage(chatId, "👑 Admin connecte.");
  }
});
