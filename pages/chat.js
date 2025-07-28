import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

export default function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Supabase fetch error:', error.message);
        return;
      }

      if (!Array.isArray(data)) {
        console.error('Expected array from Supabase:', data);
        return;
      }

      setMessages(data);
      setLoading(false);
    };

    fetchMessages();
  }, []);

  const handleSend = async () => {
    if (!newMessage.trim()) return;

    const { error } = await supabase.from('messages').insert([
      {
        content: newMessage,
        sender: 'user',
      },
    ]);

    if (error) {
      console.error('Supabase insert error:', error.message);
      return;
    }

    setMessages(prev => [...prev, { content: newMessage, sender: 'user' }]);
    setNewMessage('');
  };

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-xl font-bold mb-4">MoodBot Chat</h1>

      <div className="border p-4 h-96 overflow-y-auto mb-4 bg-gray-50 rounded">
        {loading ? (
          <p>Loading messages...</p>
        ) : (
          messages.map((msg, i) => (
            <p key={i} className={msg.sender === 'user' ? 'text-right text-blue-600' : 'text-left text-green-600'}>
              {msg.sender === 'user' ? 'You' : 'Bot'}: {msg.content}
            </p>
          ))
        )}
      </div>

      <div className="flex gap-2">
        <input
          className="flex-1 border rounded p-2"
          placeholder="Type your message..."
          value={newMessage}
          onChange={e => setNewMessage(e.target.value)}
        />
        <button
          onClick={handleSend}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Send
        </button>
      </div>
    </div>
  );
}
