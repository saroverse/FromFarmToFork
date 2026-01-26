import React, { useState } from 'react';
import { Farmer, Message } from '../../types';

interface SellerMessagesProps {
  farmer: Farmer;
  messages: Message[];
  onSendMessage: (text: string, receiverId: string) => void;
}

const SellerMessages: React.FC<SellerMessagesProps> = ({ farmer, messages, onSendMessage }) => {
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  // Derive Conversations for the logged-in farmer
  const myMessages = messages.filter(m => m.receiverId === farmer.id || m.senderId === farmer.id);
  // Group by the other person (Buyer)
  const conversations = Array.from(new Set(myMessages.map(m => m.senderId === farmer.id ? m.receiverId : m.senderId))).map(otherId => {
      const msgs = myMessages.filter(m => m.senderId === otherId || m.receiverId === otherId).sort((a,b) => b.timestamp - a.timestamp);
      return {
          otherId,
          lastMessage: msgs[0],
          name: msgs.find(m => m.senderId === otherId)?.senderName || 'Buyer'
      };
  });

  const activeMessages = selectedConversationId 
      ? myMessages.filter(m => m.senderId === selectedConversationId || m.receiverId === selectedConversationId).sort((a,b) => a.timestamp - b.timestamp)
      : [];

  const handleSendReply = (e: React.FormEvent) => {
      e.preventDefault();
      if (!selectedConversationId || !replyText.trim()) return;
      onSendMessage(replyText, selectedConversationId);
      setReplyText('');
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden h-[600px] flex">
        {/* Conversations List */}
        <div className="w-1/3 border-r border-stone-100 flex flex-col">
            <div className="p-4 border-b border-stone-100">
                <h3 className="font-bold text-stone-800">Inbox</h3>
            </div>
            <div className="overflow-y-auto flex-1">
                {conversations.map(conv => (
                    <button 
                        key={conv.otherId}
                        onClick={() => setSelectedConversationId(conv.otherId)}
                        className={`w-full p-4 text-left hover:bg-stone-50 transition-colors border-b border-stone-100 ${selectedConversationId === conv.otherId ? 'bg-green-50 border-green-200' : ''}`}
                    >
                        <div className="flex justify-between items-start mb-1">
                            <span className="font-bold text-sm text-stone-900">{conv.name}</span>
                            <span className="text-xs text-stone-400">{new Date(conv.lastMessage.timestamp).toLocaleDateString()}</span>
                        </div>
                        <p className="text-sm text-stone-500 truncate">{conv.lastMessage.text}</p>
                    </button>
                ))}
                {conversations.length === 0 && (
                    <div className="p-8 text-center text-stone-400 text-sm">No messages yet.</div>
                )}
            </div>
        </div>

        {/* Chat Window */}
        <div className="flex-1 flex flex-col bg-stone-50">
            {selectedConversationId ? (
                <>
                    <div className="p-4 bg-white border-b border-stone-100 flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 text-sm font-bold">B</div>
                        <span className="font-bold text-stone-800">Buyer</span>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {activeMessages.map(msg => {
                            const isMe = msg.senderId === farmer.id;
                            return (
                                <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[70%] p-3 rounded-2xl text-sm ${
                                        isMe 
                                        ? 'bg-green-600 text-white rounded-tr-none' 
                                        : 'bg-white border border-stone-200 text-stone-800 rounded-tl-none'
                                    }`}>
                                        {msg.text}
                                    </div>
                                </div>
                            )
                        })}
                    </div>

                    <form onSubmit={handleSendReply} className="p-4 bg-white border-t border-stone-200 flex gap-2">
                        <input 
                            className="flex-1 bg-stone-50 border border-stone-200 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                            placeholder="Type a message..."
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                        />
                        <button type="submit" className="bg-green-600 text-white p-2 rounded-full hover:bg-green-700">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                        </button>
                    </form>
                </>
            ) : (
                <div className="flex-1 flex items-center justify-center text-stone-400 text-sm">
                    Select a conversation to start chatting
                </div>
            )}
        </div>
    </div>
  );
};

export default SellerMessages;