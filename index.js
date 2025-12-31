import TelegramBot from "node-telegram-bot-api";

const TOKEN = process.env.TOKEN;
const ADMIN_ID = Number(process.env.ADMIN_ID);

if (!TOKEN || !ADMIN_ID) {
  console.error("❌ TOKEN ou ADMIN_ID manquant");
  process.exit(1);
}

const bot = new TelegramBot(TOKEN, { polling: true });

console.log("🤖 Bot démarré avec succès");

bot.onText(/\/start(?:\s+(.*))?/, (msg, match) => {
  const chatId = msg.chat.id;
  const data = match && match[1] ? match[1] : "Aucune info";

  if (chatId !== ADMIN_ID) {
    bot.sendMessage(
      chatId,
      "✅ Demande envoyée.\n⏳ Attendez la validation de l’administrateur."
    );

    bot.sendMessage(
      ADMIN_ID,
      `📩 DEMANDE WIFI\n👤 User: ${chatId}\nℹ️ Info: ${data}`
    );
  } else {
    bot.sendMessage(chatId, "👑 Admin connecté");
  }
});
