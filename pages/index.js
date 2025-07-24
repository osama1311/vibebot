import { useState } from 'react';
import { supabase } from '../supabaseClient';
import { useRouter } from 'next/router';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setError(error.message);
    else router.push('/chat');
  };

  const handleSignup = async () => {
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) setError(error.message);
    else router.push('/chat');
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">MoodBot Login</h1>
      <input className="border p-2 mb-2 w-full" placeholder="Email" onChange={e => setEmail(e.target.value)} />
      <input className="border p-2 mb-2 w-full" placeholder="Password" type="password" onChange={e => setPassword(e.target.value)} />
      {error && <p className="text-red-500 mb-2">{error}</p>}
      <button className="bg-blue-500 text-white p-2 mr-2" onClick={handleLogin}>Log In</button>
      <button className="bg-green-500 text-white p-2" onClick={handleSignup}>Sign Up</button>
    </div>
  );
}
// Redeploy trigger
