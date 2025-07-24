import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

export default function ChatPage() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    let { data, error } = await supabase
      .from('messages')
      .select('*')
      .order('created_at', { ascending: true });

    if (!error) setMessages(data);
  };

  const sendMessage = async () => {
    if (message.trim() === '') return;

    // Save user's message
    const { data: userMsg } = await supabase
      .from('messages')
      .insert([{ content: message, sender: 'user' }])
      .select();

    setMessages(prev => [...prev, ...userMsg]);
    setMessage('');

    // Fake AI reply for now (replace with real GPT later)
    const botReply = getBotReply(message);

    const { data: botMsg } = await supabase
      .from('messages')
      .insert([{ content: botReply, sender: 'bot' }])
      .select();

    setMessages(prev => [...prev, ...botMsg]);
  };

 const getBotReply = (input) => {
  const msg = input.toLowerCase();
  if (msg.includes('sad')) return "I'm here for you. Want to talk about it?";
  if (msg.includes('hi') || msg.includes('hello')) return "Hey there! 😊 How are you feeling today?";
  if (msg.includes('happy')) return "Yay! I'm glad to hear that! 🌟";
  return "Tell me more...";
};

