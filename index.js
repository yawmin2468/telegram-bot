import { MongoClient } from "mongodb";
import TelegramBot from "node-telegram-bot-api";

// Railway Variables
const user = process.env.MONGOUSER;
const pass = process.env.MONGOPASSWORD;
const host = process.env.MONGOHOST;
const port = process.env.MONGOPORT;

const token = process.env.BOT_TOKEN; // Telegram BotFather token

// MongoDB Connection URL ကို Build လုပ်တယ်
const mongoUrl = `mongodb://${user}:${pass}@${host}:${port}/?authSource=admin`;

const bot = new TelegramBot(token, { polling: true });
const client = new MongoClient(mongoUrl);

async function connectDB() {
  try {
    await client.connect();
    console.log("✅ MongoDB Connected!");
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err);
  }
}
connectDB();

bot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  const db = client.db("telegrambot");  // database name
  const users = db.collection("messages");

  await users.insertOne({
    userId: msg.from.id,
    username: msg.from.username,
    text: msg.text,
    date: new Date()
  });

  bot.sendMessage(chatId, "✅ Your message is saved to MongoDB!");
});

