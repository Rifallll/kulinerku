// server.js (ES Module Version)
import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import { GoogleGenerativeAI } from '@google/generative-ai';

const app = express();
app.use(express.json());
app.use(cors());

// Initialize Gemini
// Ensure your .env file has GEMINI_API_KEY defined
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post('/chat', async (req, res) => {
    try {
        const { message, history, recipeContext } = req.body;

        const model = genAI.getGenerativeModel({
            model: "gemini-1.5-flash",
            systemInstruction: {
                parts: [{
                    text: `
                    You are a friendly, expert Indonesian Chef assistant named "AI Chef".
                    CONTEXT: The user is looking at a recipe for: "${recipeContext?.recipeName || 'Unknown'}".
                    Ingredients: ${recipeContext?.ingredients?.join(', ') || 'Unknown'}.
                    RULES: Answer questions about this recipe. Keep answers concise.
                `}]
            }
        });

        const chat = model.startChat({
            history: history || [],
        });

        const result = await chat.sendMessage(message);
        const response = await result.response;
        const text = response.text();

        res.json({ reply: text });

    } catch (error) {
        console.error("Server Error:", error);
        res.status(500).json({ error: "Something went wrong" });
    }
});

const PORT = 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));