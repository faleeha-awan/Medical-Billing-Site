export default async (req, context) => {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" }
    });
  }

  try {
    const { message } = await req.json();

    if (!message) {
      return new Response(JSON.stringify({ error: "Message is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    // ---------- PREWRITTEN REPLIES ----------
    const text = message.toLowerCase();

    const rules = [
      { k: ["pricing", "price"], r: "Our pricing depends on the services you need. Would you like details on medical billing, credentialing, or RCM?" },
      { k: ["services", "offer"], r: "We offer medical billing, claims management, credentialing, and revenue cycle management." },
      { k: ["contact", "phone", "email"], r: "You can contact us via email or through the contact form on our website." },
      { k: ["refund", "cancel"], r: "Refund and cancellation policies depend on your contract. Please contact our support team for details." }
    ];

    for (const rule of rules) {
      for (const keyword of rule.k) {
        if (text.includes(keyword)) {
          return new Response(JSON.stringify({
            reply: rule.r,
            source: "prewritten"
          }), {
            status: 200,
            headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*"
            }
          });
        }
      }
    }

    // ---------- AI FALLBACK ----------
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      console.error("OPENAI_API_KEY not configured");
      return new Response(JSON.stringify({
        reply: "AI service is temporarily unavailable.",
        source: "error"
      }), {
        status: 200, // important: NOT 500
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      });
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a helpful assistant for BillSureMD, a medical billing company."
          },
          {
            role: "user",
            content: message
          }
        ],
        max_tokens: 300,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      console.error("OpenAI API failed");
      return new Response(JSON.stringify({
        reply: "I'm having trouble answering right now. Please try again later.",
        source: "ai-error"
      }), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      });
    }

    const data = await response.json();
    const aiMessage = data.choices?.[0]?.message?.content
      || "Sorry, I couldn't process that request.";

    return new Response(JSON.stringify({
      reply: aiMessage,
      source: "ai"
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      }
    });

  } catch (error) {
    console.error("Function error:", error);
    return new Response(JSON.stringify({
      reply: "Something went wrong on the server.",
      source: "server-error"
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      }
    });
  }
};


