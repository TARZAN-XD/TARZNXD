import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import fetch from "node-fetch";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "/"))); // عرض index.html مباشرة

// 🔥 مفتاح Gemini API الخاص بك
const GEMINI_API_KEY = "AIzaSyA4xPE8rP5KjiCOY26xJdNLoSjBRSRTJAY";

app.post("/chat", async (req, res) => {
  const userMessage = req.body.message;

  try {
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=" + GEMINI_API_KEY,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: userMessage }] }]
        })
      }
    );

    const data = await response.json();
    const botReply = data?.candidates?.[0]?.content?.parts?.[0]?.text || "😅 لم أفهم رسالتك";

    res.json({ reply: botReply });

  } catch (err) {
    console.error(err);
    res.json({ reply: "❌ حصل خطأ في الاتصال بالذكاء الاصطناعي" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 السيرفر شغال على http://localhost:${PORT}`));
