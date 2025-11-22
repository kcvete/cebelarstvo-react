import React, { useState } from 'react';
import { Sparkles, Send, MessageCircle } from 'lucide-react';
import { getHoneyRecommendation } from '../services/geminiService';
import { ChatMessage } from '../types';

export const HoneySommelier: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: "Hi! I'm the GoldenDrop AI Sommelier. Tell me what you're eating (e.g., 'Greek yogurt' or 'sharp cheddar'), and I'll pair the perfect honey!" }
  ]);
  const [loading, setLoading] = useState(false);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);

    const response = await getHoneyRecommendation(userMsg);

    setMessages(prev => [...prev, { role: 'model', text: response }]);
    setLoading(false);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 bg-gradient-to-r from-gold-500 to-gold-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 flex items-center gap-2"
      >
        <Sparkles className="w-6 h-6" />
        <span className="font-medium pr-2 hidden md:inline">AI Honey Pairing</span>
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-full max-w-sm bg-white rounded-2xl shadow-2xl border border-gold-100 flex flex-col overflow-hidden animate-in slide-in-from-bottom-10 fade-in duration-300">
      {/* Header */}
      <div className="bg-gold-500 p-4 flex justify-between items-center text-white">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5" />
          <h3 className="font-bold">Honey Sommelier</h3>
        </div>
        <button onClick={() => setIsOpen(false)} className="hover:bg-gold-600 p-1 rounded text-white/80 hover:text-white transition-colors">
          Close
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 h-80 overflow-y-auto bg-stone-50 space-y-4">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-xl text-sm ${
                msg.role === 'user'
                  ? 'bg-gold-500 text-white rounded-tr-none'
                  : 'bg-white border border-stone-200 text-stone-800 rounded-tl-none shadow-sm'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        {loading && (
           <div className="flex justify-start">
             <div className="bg-white border border-stone-200 p-3 rounded-xl rounded-tl-none shadow-sm flex items-center gap-1">
               <div className="w-2 h-2 bg-gold-400 rounded-full animate-bounce"></div>
               <div className="w-2 h-2 bg-gold-400 rounded-full animate-bounce delay-75"></div>
               <div className="w-2 h-2 bg-gold-400 rounded-full animate-bounce delay-150"></div>
             </div>
           </div>
        )}
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="p-4 bg-white border-t border-stone-100">
        <div className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask for a pairing..."
            className="w-full pl-4 pr-12 py-3 rounded-lg border border-stone-200 focus:border-gold-500 focus:ring-2 focus:ring-gold-200 transition-all outline-none text-sm"
          />
          <button
            type="submit"
            disabled={loading}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-gold-600 hover:bg-gold-50 rounded-md transition-colors disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
};