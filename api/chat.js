export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { messages } = req.body;

    // ✅ Validate input
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Invalid messages format' });
    }

    // ✅ Check API key
    if (!process.env.GROQ_API_KEY) {
      return res.status(500).json({ error: 'GROQ_API_KEY is not set' });
    }

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages,
        max_tokens: 1024,
        temperature: 0.7
      })
    });

    // ✅ Handle bad HTTP response
    if (!response.ok) {
      const errorText = await response.text();
      return res.status(response.status).json({
        error: 'Groq API error',
        detail: errorText
      });
    }

    const data = await response.json();

    // ✅ Safe access
    const reply = data?.choices?.[0]?.message?.content;

    if (!reply) {
      return res.status(500).json({
        error: 'Invalid response from Groq',
        detail: data
      });
    }

    // ✅ Return BOTH formats (flexible frontend)
    return res.status(200).json({
      reply,
      choices: data.choices
    });

  } catch (error) {
    return res.status(500).json({
      error: 'Server error',
      detail: error.message
    });
  }
}
