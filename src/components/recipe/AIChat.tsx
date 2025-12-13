import React, { useState, useRef, useEffect } from "react";
import { Send, Bot, User, X, ChefHat, Utensils, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AIChatProps {
    recipeName: string;
    ingredients: string[];
}

const AIChat: React.FC<AIChatProps> = ({ recipeName, ingredients }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<{ role: string; text: string }[]>([]);
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const endRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom
    useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isTyping]);

    // Initial Greeting
    useEffect(() => {
        if (messages.length === 0 && isOpen) {
            const hour = new Date().getHours();
            const greeting = hour < 12 ? "Selamat Pagi" : hour < 18 ? "Selamat Sore" : "Selamat Malam";
            setMessages([{
                role: "ai",
                text: `👋 ${greeting}! Saya AI Chef. Ada yang bisa saya bantu tentang resep **${recipeName}**?`
            }]);
        }
    }, [isOpen, recipeName]);

    const sendMessage = async (text: string) => {
        if (!text.trim()) return;

        // 1. Update UI with User Message
        const newMessages = [...messages, { role: "user", text }];
        setMessages(newMessages);
        setInput("");
        setIsTyping(true);

        try {
            // 2. Format history for API
            // FIX: We exclude the very first message if it comes from the AI (the Greeting)
            // because the Gemini API crashes if history starts with 'model'.
            let historyForApi = newMessages.slice(0, -1);

            if (historyForApi.length > 0 && historyForApi[0].role === 'ai') {
                historyForApi = historyForApi.slice(1);
            }

            const apiHistory = historyForApi.map(msg => ({
                role: msg.role === 'ai' ? 'model' : 'user',
                parts: [{ text: msg.text }]
            }));

            // 3. Determine API Endpoint
            // In production (Vercel), we use the relative path '/api/chat' which hits our Serverless Function.
            // In development, we use 'http://localhost:3001/chat' via server.js.
            const isProduction = import.meta.env.PROD;
            const apiUrl = isProduction ? '/api/chat' : 'http://localhost:3001/chat';

            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: text,
                    history: apiHistory,
                    recipeContext: {
                        recipeName: recipeName,
                        ingredients: ingredients
                    }
                })
            });

            const data = await response.json();

            if (data.error) throw new Error(data.error);

            // 4. Update UI with AI Response
            setMessages(prev => [...prev, { role: "ai", text: data.reply }]);

        } catch (error) {
            console.error("Chat Error:", error);
            setMessages(prev => [...prev, { role: "ai", text: "⚠️ Maaf, saya kehilangan koneksi ke dapur (Server Error). Pastikan 'node server.js' menyala!" }]);
        } finally {
            setIsTyping(false);
        }
    };

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-6 right-6 bg-gradient-to-br from-violet-600 via-purple-600 to-pink-500 text-white p-4 rounded-full shadow-xl hover:scale-105 transition-all z-50 flex items-center gap-2"
            >
                <ChefHat className="h-6 w-6" />
                <span className="font-bold text-sm">Tanya AI Chef</span>
            </button>
        );
    }

    return (
        <div className="fixed bottom-6 right-6 w-[350px] h-[500px] bg-white rounded-2xl shadow-2xl overflow-hidden z-50 flex flex-col border border-gray-200 font-sans">
            {/* Header */}
            <div className="bg-gradient-to-r from-violet-600 to-purple-500 p-4 flex justify-between items-center shadow-md">
                <div className="flex items-center gap-2 text-white">
                    <ChefHat className="h-6 w-6" />
                    <div>
                        <h3 className="font-bold text-sm leading-tight">AI Chef Assistant</h3>
                        <p className="text-[10px] opacity-90">Powered by Gemini</p>
                    </div>
                </div>
                <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white"><X className="h-5 w-5" /></button>
            </div>

            {/* Context Bar */}
            <div className="bg-purple-50 px-4 py-2 text-xs text-purple-700 font-medium border-b flex items-center gap-2">
                <Utensils className="h-3 w-3" />
                <span className="truncate">Membahas: {recipeName}</span>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                {messages.map((msg, i) => (
                    <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                        <div className={`max-w-[85%] px-4 py-2 rounded-2xl text-sm shadow-sm ${msg.role === "user"
                            ? "bg-purple-600 text-white rounded-br-none"
                            : "bg-white text-gray-800 border border-gray-100 rounded-bl-none"
                            }`}>
                            <p className="whitespace-pre-wrap leading-relaxed">{msg.text}</p>
                        </div>
                    </div>
                ))}

                {isTyping && (
                    <div className="flex justify-start">
                        <div className="bg-white border px-4 py-3 rounded-2xl rounded-bl-none shadow-sm flex gap-1">
                            <span className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce"></span>
                            <span className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce delay-75"></span>
                            <span className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce delay-150"></span>
                        </div>
                    </div>
                )}
                <div ref={endRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={(e) => { e.preventDefault(); sendMessage(input); }} className="p-3 bg-white border-t flex gap-2">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Tanya resep ini..."
                    className="flex-1 px-4 py-2 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-purple-200 transition-all"
                />
                <Button type="submit" className="rounded-full bg-purple-600 hover:bg-purple-700 w-10 h-10 shadow-sm p-0" disabled={!input.trim() || isTyping}>
                    <Send className="h-4 w-4" />
                </Button>
            </form>
        </div>
    );
};

export default AIChat;