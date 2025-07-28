// pages/api/chat.js
export default async function handler(req, res) {
  const { message, personality } = req.body;

  const prompt = personality
    ? `You are a ${personality} chatbot. Respond to the user naturally.\nUser: ${message}`
    : message;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: personality ? `You are a ${personality} chatbot.` : 'You are a helpful chatbot.' },
          { role: 'user', content: message }
        ],
      }),
    });

    const data = await response.json();

    const reply = data.choices?.[0]?.message?.content || "Sorry, I didn’t understand that.";
    res.status(200).json({ reply });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch reply.' });
  }
}
