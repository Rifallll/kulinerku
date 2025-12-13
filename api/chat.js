export default async function handler(req, res) {
    // CORS configuration
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    // Helper to handle OPTIONS requests for CORS preflight
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    try {
        const { GoogleGenerativeAI } = await import('@google/generative-ai');

        // Ensure API Key is present
        if (!process.env.GEMINI_API_KEY) {
            throw new Error('Missing GEMINI_API_KEY environment variable');
        }

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
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

        res.status(200).json({ reply: text });

    } catch (error) {
        console.error("Serverless Function Error:", error);
        res.status(500).json({ error: error.message || "Something went wrong" });
    }
}
