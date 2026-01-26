import React, { useState } from 'react';
import { Farmer, Coordinates, Message, Product } from '../types';
import MarketView from './buyer/MarketView';
import { MapView, MapOverlay } from './buyer/MapView';
import EducationView from './buyer/EducationView';
import AccountView from './buyer/AccountView';
import CartDrawer, { CartItem } from './buyer/CartDrawer';
import StoreView from './buyer/StoreView';

interface BuyerDashboardProps {
  registeredFarmers: Farmer[];
  userLocation: Coordinates | null;
  currentBuyerId: string;
  messages: Message[];
  onSendMessage: (text: string, receiverId: string) => void;
  onLogout: () => void;
}

type Tab = 'market' | 'map' | 'education' | 'account';

const BuyerDashboard: React.FC<BuyerDashboardProps> = ({ registeredFarmers, userLocation, currentBuyerId, messages, onSendMessage, onLogout }) => {
  const [activeTab, setActiveTab] = useState<Tab>('market');
  
  // Cart State
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Map State
  const [selectedFarm, setSelectedFarm] = useState<Farmer | null>(null);

  // Store View State - This controls the full-page store view
  const [activeStore, setActiveStore] = useState<Farmer | null>(null);

  // Chat State
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatReceiverId, setChatReceiverId] = useState<string | null>(null);
  const [chatText, setChatText] = useState('');

  // --- Handlers ---

  const handleVisitStore = (farmer: Farmer) => {
    setActiveStore(farmer);
    // Optionally clear selected farm to reset map state when returning
    setSelectedFarm(null);
  };

  const handleBackFromStore = () => {
    setActiveStore(null);
  };

  const handleAddToCart = (product: Product, farmerName: string) => {
    setCart(prev => {
        const existing = prev.find(p => p.id === product.id);
        if (existing) {
            return prev.map(p => p.id === product.id ? {...p, quantity: p.quantity + 1} : p);
        }
        return [...prev, {...product, quantity: 1, farmerName }];
    });
  };

  const handleRemoveOneFromCart = (productId: string) => {
    setCart(prev => {
        const existing = prev.find(p => p.id === productId);
        if (existing && existing.quantity > 1) {
            return prev.map(p => p.id === productId ? {...p, quantity: p.quantity - 1} : p);
        }
        return prev.filter(p => p.id !== productId);
    });
  };

  const handleClearCart = () => setCart([]);

  const openChatWith = (farmerId: string) => {
      setChatReceiverId(farmerId);
      setIsChatOpen(true);
      if (activeTab === 'map') setSelectedFarm(null);
  };

  const handleSendChatMessage = (e: React.FormEvent) => {
      e.preventDefault();
      if(chatText.trim() && chatReceiverId) {
          onSendMessage(chatText, chatReceiverId);
          setChatText('');
      }
  };
  
  const chatPartner = chatReceiverId ? registeredFarmers.find(f => f.id === chatReceiverId) : null;
  const currentConversation = chatReceiverId 
    ? messages.filter(m => (m.senderId === currentBuyerId && m.receiverId === chatReceiverId) || (m.senderId === chatReceiverId && m.receiverId === currentBuyerId))
              .sort((a,b) => a.timestamp - b.timestamp)
    : [];
    
  const cartTotalItems = cart.reduce((a, b) => a + b.quantity, 0);
  const cartTotalPrice = cart.reduce((a, b) => a + (b.price * b.quantity), 0);

  // Determine if we show tabs (only when NOT in store view)
  const showTabs = !activeStore;

  return (
    <div className="h-[calc(100vh-64px)] bg-stone-50 flex flex-col relative overflow-hidden">
        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto custom-scrollbar relative">
            {activeStore ? (
                <StoreView 
                    farmer={activeStore}
                    onBack={handleBackFromStore}
                    cart={cart}
                    onAddToCart={handleAddToCart}
                    onRemoveOne={handleRemoveOneFromCart}
                />
            ) : (
                <>
                    {activeTab === 'market' && (
                        <MarketView 
                            registeredFarmers={registeredFarmers} 
                            userLocation={userLocation} 
                            cart={cart}
                            onAddToCart={handleAddToCart}
                            onRemoveOne={handleRemoveOneFromCart}
                        />
                    )}
                    {activeTab === 'map' && (
                        <div className="h-full w-full relative">
                            <MapView 
                                userLocation={userLocation} 
                                registeredFarmers={registeredFarmers} 
                                onSelectFarm={setSelectedFarm} 
                            />
                            <MapOverlay 
                                selectedFarm={selectedFarm} 
                                onClose={() => setSelectedFarm(null)} 
                                onMessage={openChatWith}
                                onVisitStore={handleVisitStore}
                            />
                        </div>
                    )}
                    {activeTab === 'education' && <EducationView onNavigateToMap={() => setActiveTab('map')} />}
                    {activeTab === 'account' && (
                        <AccountView 
                            registeredFarmers={registeredFarmers}
                            messages={messages}
                            currentBuyerId={currentBuyerId}
                            onOpenChat={openChatWith}
                            onLogout={onLogout}
                        />
                    )}
                </>
            )}
        </div>

        {/* Floating Cart Button (Visible on Market View or Store View) */}
        {(activeTab === 'market' || activeStore) && cart.length > 0 && (
            <div className="absolute bottom-24 right-4 z-30 animate-in slide-in-from-right">
                <button 
                    onClick={() => setIsCartOpen(true)}
                    className="bg-green-800 text-white p-4 rounded-full shadow-xl flex items-center gap-3 hover:bg-green-900 transition-transform hover:scale-105 active:scale-95"
                >
                    <div className="relative">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-green-800">
                            {cartTotalItems}
                        </span>
                    </div>
                    <span className="font-bold">€{cartTotalPrice.toFixed(2)}</span>
                </button>
            </div>
        )}

        {/* Bottom Navigation */}
        {showTabs && (
            <div className="bg-white border-t border-stone-200 p-2 flex justify-around items-center h-16 z-40">
                <button onClick={() => setActiveTab('market')} className={`flex flex-col items-center p-2 rounded-lg transition-colors ${activeTab === 'market' ? 'text-green-700' : 'text-stone-400 hover:text-stone-600'}`}>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                    <span className="text-[10px] font-medium mt-1">Market</span>
                </button>
                <button onClick={() => setActiveTab('map')} className={`flex flex-col items-center p-2 rounded-lg transition-colors ${activeTab === 'map' ? 'text-green-700' : 'text-stone-400 hover:text-stone-600'}`}>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 7m0 13V7" /></svg>
                    <span className="text-[10px] font-medium mt-1">Map</span>
                </button>
                <button onClick={() => setActiveTab('education')} className={`flex flex-col items-center p-2 rounded-lg transition-colors ${activeTab === 'education' ? 'text-green-700' : 'text-stone-400 hover:text-stone-600'}`}>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                    <span className="text-[10px] font-medium mt-1">Learn</span>
                </button>
                <button onClick={() => setActiveTab('account')} className={`flex flex-col items-center p-2 rounded-lg transition-colors ${activeTab === 'account' ? 'text-green-700' : 'text-stone-400 hover:text-stone-600'}`}>
                    <div className="relative">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                        {messages.filter(m => m.receiverId === currentBuyerId && !m.isRead).length > 0 && (
                            <span className="absolute -top-1 -right-1 bg-red-500 w-3 h-3 rounded-full border-2 border-white"></span>
                        )}
                    </div>
                    <span className="text-[10px] font-medium mt-1">Account</span>
                </button>
            </div>
        )}

        {/* Cart Drawer */}
        {isCartOpen && (
            <CartDrawer 
                cart={cart}
                onAdd={handleAddToCart}
                onRemove={handleRemoveOneFromCart}
                onClear={handleClearCart}
                onClose={() => setIsCartOpen(false)}
            />
        )}

        {/* Global Chat Modal */}
        {isChatOpen && chatPartner && (
            <div className="fixed inset-0 z-[2000] flex items-end sm:items-center justify-center">
                {/* Backdrop - blocks interactions with Map */}
                <div 
                    className="absolute inset-0 bg-black/20 backdrop-blur-sm transition-opacity" 
                    onClick={() => setIsChatOpen(false)}
                />
                
                <div className="relative w-full sm:w-96 bg-white shadow-2xl rounded-t-2xl sm:rounded-2xl border border-stone-200 flex flex-col max-h-[80vh] animate-in slide-in-from-bottom duration-300 z-10">
                    <div className="p-4 bg-green-800 text-white rounded-t-2xl flex justify-between items-center flex-shrink-0">
                        <div className="flex items-center gap-2">
                            <img src={chatPartner.image} alt="" className="w-8 h-8 rounded-full border border-white/30 object-cover" />
                            <span className="font-bold">{chatPartner.farmName}</span>
                        </div>
                        <button onClick={() => setIsChatOpen(false)} className="text-white/80 hover:text-white">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-stone-50 min-h-[300px]">
                        {currentConversation.map(msg => {
                            const isMe = msg.senderId === currentBuyerId;
                            return (
                                <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                                        isMe 
                                        ? 'bg-green-600 text-white rounded-tr-none' 
                                        : 'bg-white border border-stone-200 text-stone-800 rounded-tl-none'
                                    }`}>
                                        {msg.text}
                                    </div>
                                </div>
                            )
                        })}
                        {currentConversation.length === 0 && (
                            <div className="text-center text-stone-400 text-xs mt-4">Start a conversation with {chatPartner.name}</div>
                        )}
                    </div>

                    <form onSubmit={handleSendChatMessage} className="p-3 border-t border-stone-100 flex gap-2 bg-white rounded-b-2xl flex-shrink-0">
                        <input 
                            value={chatText}
                            onChange={(e) => setChatText(e.target.value)}
                            placeholder="Type a message..."
                            className="flex-1 bg-stone-100 border-none rounded-full px-4 py-2 text-sm focus:ring-2 focus:ring-green-500"
                            autoFocus
                        />
                        <button type="submit" className="bg-green-600 text-white p-2 rounded-full hover:bg-green-700 flex-shrink-0">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                        </button>
                    </form>
                </div>
            </div>
        )}
    </div>
  );
};

export default BuyerDashboard;