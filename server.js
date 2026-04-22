import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const API_KEY = "YOUR_OPENAI_API_KEY"; // 🔑 put your key here

app.post("/chat", async (req, res) => {
  try {
    const { messages } = req.body;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + API_KEY
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "You are Joe, a smart, thoughtful AI assistant. You explain clearly, think deeply, and talk naturally like a real person."
          },
          ...messages
        ]
      })
    });

    const data = await response.json();
    res.json(data);

  } catch (err) {
    res.status(500).json({ error: "Something went wrong" });
  }
});

app.listen(3000, () => {
  console.log("🚀 Server running on http://localhost:3000");
});
