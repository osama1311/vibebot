const handleSend = async () => {
  if (!newMessage.trim()) return;

  // Save user's message
  const { error: userError } = await supabase.from('messages').insert([
    {
      content: newMessage,
      sender: 'user',
    },
  ]);

  if (userError) {
    console.error('Supabase insert error:', userError.message);
    return;
  }

  setMessages(prev => [...prev, { content: newMessage, sender: 'user' }]);

  // Call your GPT API
  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: newMessage,
        personality: 'helpful', // or let the user pick personality later
      }),
    });

    const data = await res.json();
    const botReply = data.reply || "Sorry, I didn’t understand that.";

    // Save bot's message
    const { error: botError } = await supabase.from('messages').insert([
      {
        content: botReply,
        sender: 'bot',
      },
    ]);

    if (botError) {
      console.error('Supabase bot insert error:', botError.message);
    }

    setMessages(prev => [...prev, { content: botReply, sender: 'bot' }]);
  } catch (err) {
    console.error('Error fetching bot reply:', err.message);
  }

  setNewMessage('');
};
