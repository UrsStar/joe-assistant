export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { messages } = req.body;

    if (!process.env.GROQ_API_KEY) {
        return res.status(500).json({ error: 'GROQ_API_KEY is not set' });
    }

    try {
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
            },
            body: JSON.stringify({
                model: "llama3-70b-8192",
                messages: messages,
                max_tokens: 2048,
                temperature: 0.85
            })
        });

        const data = await response.json();

        if (!data.choices || !data.choices[0]) {
            return res.status(500).json({ error: 'Groq error', detail: data });
        }

        const reply = data.choices[0].message.content;
        res.status(200).json({ reply });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
