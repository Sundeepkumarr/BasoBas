import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiOutlineChat, HiOutlineX, HiOutlinePaperAirplane } from 'react-icons/hi';

interface Message {
  id: string;
  sender: 'user' | 'bot';
  content: string;
}

const quickReplies = [
  'How do I list a property?',
  'What are the fees?',
  'How is verification done?',
  'Help me find a property',
];

const botResponses: Record<string, string> = {
  'how do i list a property?': 'To list a property, register as an Owner, complete your profile verification, and click "Add Property" from your dashboard. Our team will verify your listing within 24-48 hours.',
  'what are the fees?': 'Browsing and searching is completely free! We charge a small service fee only when a successful transaction is completed. Check our pricing page for details.',
  'how is verification done?': 'Our team physically inspects properties and verifies all ownership documents. We check land registration papers, ownership certificates, and property tax records.',
  'help me find a property': 'I\'d love to help! You can browse properties at /properties with filters for location, price, type, and more. What kind of property are you looking for?',
};

export default function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: '0', sender: 'bot', content: 'Hi! 👋 I\'m Basobas AI Assistant. How can I help you today?' },
  ]);
  const [input, setInput] = useState('');

  const sendMessage = (content: string) => {
    if (!content.trim()) return;
    const userMsg: Message = { id: Date.now().toString(), sender: 'user', content };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');

    // Simulate bot response
    setTimeout(() => {
      const reply = botResponses[content.toLowerCase()] || 'Thank you for your question! Our team will get back to you shortly. You can also reach us at info@basobas.com or call +977 980-0000000.';
      setMessages((prev) => [...prev, { id: (Date.now() + 1).toString(), sender: 'bot', content: reply }]);
    }, 800);
  };

  return (
    <>
      {/* Floating Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-2xl bg-gradient-primary text-white shadow-soft-xl hover:shadow-2xl transition-shadow flex items-center justify-center"
          >
            <HiOutlineChat className="w-6 h-6" />
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-accent text-[8px] font-bold text-white flex items-center justify-center">AI</span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 w-[380px] h-[520px] rounded-2xl bg-white shadow-soft-xl border border-gray-100 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-primary p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
                  <span className="text-white text-lg">🤖</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">Basobas AI</p>
                  <p className="text-[10px] text-white/70">Always here to help</p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="p-1.5 rounded-lg hover:bg-white/20 transition-colors">
                <HiOutlineX className="w-5 h-5 text-white" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin">
              {messages.map((msg) => (
                <motion.div key={msg.id} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[85%] px-3.5 py-2.5 rounded-2xl text-sm ${
                    msg.sender === 'user'
                      ? 'bg-primary-700 text-white rounded-br-md'
                      : 'bg-gray-100 text-gray-700 rounded-bl-md'
                  }`}>
                    {msg.content}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Quick Replies */}
            {messages.length <= 2 && (
              <div className="px-4 pb-2 flex flex-wrap gap-1.5">
                {quickReplies.map((qr) => (
                  <button key={qr} onClick={() => sendMessage(qr)} className="px-3 py-1.5 rounded-full border border-primary-200 text-primary-700 text-xs hover:bg-primary-50 transition-colors">
                    {qr}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <form onSubmit={(e) => { e.preventDefault(); sendMessage(input); }} className="p-3 border-t border-gray-100 flex gap-2">
              <input type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask anything..." className="flex-1 px-3 py-2 rounded-xl bg-gray-50 text-sm border border-gray-200 focus:outline-none focus:border-primary-500" />
              <button type="submit" className="p-2.5 rounded-xl bg-primary-700 text-white hover:bg-primary-800 transition-colors">
                <HiOutlinePaperAirplane className="w-4 h-4 rotate-90" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
