import TelegramBot from "node-telegram-bot-api";
import { MongoClient } from "mongodb";

const token = process.env.BOT_TOKEN;      // BotFather API token
const mongoUrl = process.env.MONGO_URL;   // Railway MongoDB connection

const bot = new TelegramBot(token, { polling: true });
const client = new MongoClient(mongoUrl);

async function connectDB() {
  try {
    await client.connect();
    console.log("✅ MongoDB Connected!");
  } catch (err) {
    console.error("MongoDB connection failed:", err);
  }
}
connectDB();

bot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  const db = client.db("telegrambot");
  const users = db.collection("messages");

  // Save message into MongoDB
  await users.insertOne({
    userId: msg.from.id,
    username: msg.from.username,
    text: msg.text,
    date: new Date()
  });

  bot.sendMessage(chatId, "✅ Your message is saved to MongoDB!");
});
