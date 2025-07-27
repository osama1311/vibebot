import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

export default function ChatPage() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .order('created_at', { ascending: true });

    if (!error) setMessages(data);
  };

  const sendMessage = async () => {
    if (message.trim() === '') return;

    const { data: userMsg } = await supabase
      .from('messages')
      .insert([{ content: message, sender: 'user' }])
      .select();

    setMessages(prev => [...prev, ...userMsg]);
    setMessage('');

    const botReply = getBotReply(message);

    const { data: botMsg } = await supabase
      .from('messages')
      .insert([{ content: botReply, sender: 'bot' }])
      .select();

    setMessages(prev => [...prev, ...botMsg]);
  };

  const getBotReply = (input) => {
    const msg = input.toLowerCase();
    if (msg.includes('hi') || msg.includes('hello')) return "Hey there! 😊";
    if (msg.includes('sad')) return "I'm here for you. Want to talk about it?";
    if (msg.includes('happy')) return "Yay! I'm glad to hear that! 🌟";
    return "Tell me more...";
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">MoodBot Chat</h1>
      <div className="border p-2 h-64 overflow-y-scroll mb-4 bg-gray-50 rounded">
        {messages.map((msg, i) => (
          <div key={i} className={msg.sender === 'bot' ? 'text-green-600' : 'text-black'}>
            <b>{msg.sender === 'bot' ? 'Bot' : 'You'}:</b> {msg.content}
          </div>
        ))}
      </div>
      <input
        className="border p-2 w-full mb-2"
        placeholder="Type a message..."
        value={message}
        onChange={e => setMessage(e.target.value)}
      />
      <button className="bg-blue-500 text-white p-2 w-full rounded" onClick={sendMessage}>Send</button>
    </div>
  );
}
