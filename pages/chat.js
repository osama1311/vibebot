import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

export default function ChatPage() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  const sendMessage = async () => {
    if (message.trim() === '') return;
    const newMessage = { content: message, created_at: new Date().toISOString() };
    setMessages([...messages, newMessage]);
    setMessage('');
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">MoodBot Chat</h1>
      <div className="border p-2 h-64 overflow-y-scroll mb-4">
        {messages.map((msg, i) => (
          <div key={i} className="mb-1">{msg.content}</div>
        ))}
      </div>
      <input className="border p-2 w-full mb-2" placeholder="Type a message..." value={message} onChange={e => setMessage(e.target.value)} />
      <button className="bg-blue-500 text-white p-2 w-full" onClick={sendMessage}>Send</button>
    </div>
  );
}
