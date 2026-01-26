import express from "express";
import fetch from "node-fetch";
import "dotenv/config";

// creates server
const app = express ();
// allows  server to read JSON bodies
app.use(express.json());

//test route
app.get("/", (req,res)=>{
    res.send ("backend is running");
});

//chatbot route
app.post("/chat", async(req,res)=>{
    const message = req.body.message;

    // validation
    if (!message){
        return res.status(400).json({error: "Message Required"});
    }

    // ---------- PREWRITTEN REPLIES ----------
    const text = message.toLowerCase();
    const rules = [
        { k: ["pricing", "price"], r: "Our pricing starts from PKR X. What service do you want details on?" },
        { k: ["services", "offer"], r: "We offer medical billing, claims management, and RCM optimization." },
        { k: ["contact", "phone", "email"], r: "You can email us at support@example.com or call +92-XXX-XXXXXXX." },
        { k: ["refund", "cancel"], r: "Refunds are processed within 7–14 business days." }
    ];

    for (const rule of rules) {
        for (const word of rule.k) {
            if (text.includes(word)) {
                return res.json({ reply: rule.r, source: "prewritten" });
            }
        }
    }

    try {
        const aiRes = await fetch ("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                // calling API Key
                "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: "gpt-4o-mini",
                messages: [
                    {role: "system", content: "Your are a helpful assistant."},
                    {role: "user", content: message}
                ]
            })
        });
        // Sedning result back
        const data = await aiRes.json();
        res.json({reply: data.choices[0].message.content});
    }catch(err){
        console.error(err);
        res.status(500).json({error: "AI failed"});
    }
});

// starting the server
app.listen (3000, () => {
    console.log("Server running on http://localhost:3000");
})


