import { useState } from 'react';
import { motion } from 'framer-motion';
import { HiOutlinePaperAirplane, HiOutlinePhotograph, HiOutlineSearch } from 'react-icons/hi';

const mockChats = [
  { id: '1', name: 'Ramesh Shrestha', avatar: 'R', lastMessage: 'Yes, the property is still available.', time: '2m ago', unread: 2, online: true },
  { id: '2', name: 'Sita Gurung', avatar: 'S', lastMessage: 'Can we schedule a visit?', time: '1h ago', unread: 0, online: false },
  { id: '3', name: 'Basobas Support', avatar: 'B', lastMessage: 'Your document has been verified.', time: '2h ago', unread: 1, online: true },
];

const mockMessages = [
  { id: '1', senderId: 'other', content: 'Hello! I saw your listing for the house in Budhanilkantha.', time: '10:30 AM' },
  { id: '2', senderId: 'me', content: 'Hi! Yes, the property is still available. Would you like to schedule a visit?', time: '10:32 AM' },
  { id: '3', senderId: 'other', content: 'That would be great! Is this weekend okay?', time: '10:33 AM' },
  { id: '4', senderId: 'me', content: 'Saturday morning works for me. I\'ll send you the exact location on the map.', time: '10:35 AM' },
  { id: '5', senderId: 'other', content: 'Yes, the property is still available.', time: '10:36 AM' },
];

export default function ChatPage() {
  const [selectedChat, setSelectedChat] = useState(mockChats[0]);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState(mockMessages);

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    setMessages([...messages, { id: Date.now().toString(), senderId: 'me', content: message, time: 'Now' }]);
    setMessage('');
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="container-custom py-4 h-[calc(100vh-80px)]">
        <div className="card h-full flex overflow-hidden">
          {/* Chat List */}
          <div className="w-80 border-r border-gray-100 flex flex-col">
            <div className="p-4 border-b border-gray-100">
              <h2 className="font-semibold text-gray-900 mb-3">Messages</h2>
              <div className="relative">
                <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="text" placeholder="Search conversations..." className="input pl-10 py-2 text-sm" />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto scrollbar-thin">
              {mockChats.map((chat) => (
                <button key={chat.id} onClick={() => setSelectedChat(chat)}
                  className={`w-full flex items-center gap-3 p-4 hover:bg-gray-50 transition-colors ${selectedChat.id === chat.id ? 'bg-primary-50' : ''}`}
                >
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                      <span className="text-primary-700 font-semibold text-sm">{chat.avatar}</span>
                    </div>
                    {chat.online && <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500 border-2 border-white" />}
                  </div>
                  <div className="flex-1 min-w-0 text-left">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-900 truncate">{chat.name}</p>
                      <span className="text-[10px] text-gray-400">{chat.time}</span>
                    </div>
                    <p className="text-xs text-gray-500 truncate">{chat.lastMessage}</p>
                  </div>
                  {chat.unread > 0 && (
                    <span className="w-5 h-5 rounded-full bg-primary-700 text-white text-[10px] font-bold flex items-center justify-center">{chat.unread}</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Chat Window */}
          <div className="flex-1 flex flex-col">
            {/* Chat Header */}
            <div className="flex items-center gap-3 p-4 border-b border-gray-100">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                  <span className="text-primary-700 font-semibold">{selectedChat.avatar}</span>
                </div>
                {selectedChat.online && <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500 border-2 border-white" />}
              </div>
              <div>
                <p className="font-semibold text-gray-900 text-sm">{selectedChat.name}</p>
                <p className="text-xs text-gray-500">{selectedChat.online ? 'Online' : 'Offline'}</p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin">
              {messages.map((msg) => (
                <motion.div key={msg.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.senderId === 'me' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[70%] px-4 py-2.5 rounded-2xl ${msg.senderId === 'me' ? 'bg-primary-700 text-white rounded-br-md' : 'bg-gray-100 text-gray-800 rounded-bl-md'}`}>
                    <p className="text-sm">{msg.content}</p>
                    <p className={`text-[10px] mt-1 ${msg.senderId === 'me' ? 'text-primary-200' : 'text-gray-400'}`}>{msg.time}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Message Input */}
            <form onSubmit={sendMessage} className="p-4 border-t border-gray-100 flex items-center gap-3">
              <button type="button" className="p-2 rounded-xl hover:bg-gray-100 transition-colors text-gray-400">
                <HiOutlinePhotograph className="w-5 h-5" />
              </button>
              <input type="text" value={message} onChange={(e) => setMessage(e.target.value)}
                placeholder="Type a message..." className="input flex-1 py-2.5" />
              <button type="submit" className="p-3 rounded-xl bg-primary-700 text-white hover:bg-primary-800 transition-colors">
                <HiOutlinePaperAirplane className="w-5 h-5 rotate-90" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
