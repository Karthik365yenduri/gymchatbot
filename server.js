require("dotenv").config();
const express = require("express");
const axios = require("axios");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware to parse JSON and enable CORS
app.use(express.json());
app.use(cors());

// Serve static files from the "public" folder
app.use(express.static(path.join(__dirname)));

// Check if the Gemini API key is set
if (!process.env.GEMINI_API_KEY) {
  console.error("❌ GEMINI_API_KEY is missing. Please check your .env file.");
  process.exit(1);
}

// Root route to serve the index.html file
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname,  "index.html"));
});

// Chatbot API route
app.post("/api/chat", async (req, res) => {
  const userInput = req.body.message;

  if (!userInput) {
    return res.status(400).json({ reply: "Invalid request. Please send a message." });
  }

  try {
    const API_KEY ="AIzaSyAeGERY6PnZd5JovF182bItNzCMHptUXik" ;
    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${API_KEY}`;

    const response = await axios.post(
      API_URL,
      { contents: [{ parts: [{ text: userInput }] }] },
      { headers: { "Content-Type": "application/json" } }
    );

    const botReply =
      response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "I'm not sure how to respond.";
    res.json({ reply: botReply });
  } catch (error) {
    console.error("❌ Error connecting to Gemini AI:", error.response?.data || error.message);
    res.status(500).json({ reply: "Sorry, I couldn't process your request right now." });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});
