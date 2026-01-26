import React, { useState } from 'react';
import { Farmer, Message } from '../../types';
import { storageService } from '../../services/storageService';

interface AccountViewProps {
  registeredFarmers: Farmer[];
  messages: Message[];
  currentBuyerId: string;
  onOpenChat: (farmerId: string) => void;
  onLogout: () => void;
}

type AccountViewType = 'dashboard' | 'orders' | 'list' | 'reviews' | 'tips' | 'saved' | 'settings' | 'inbox';

const AccountView: React.FC<AccountViewProps> = ({ registeredFarmers, messages, currentBuyerId, onOpenChat, onLogout }) => {
  const [accountView, setAccountView] = useState<AccountViewType>('dashboard');
  const [shoppingList, setShoppingList] = useState([
    { id: 1, text: 'Organic Carrots', checked: false },
    { id: 2, text: 'Oat Milk', checked: true },
    { id: 3, text: 'Sourdough Bread', checked: false },
  ]);
  const [newItem, setNewItem] = useState('');

  const HeaderWithBack = ({ title }: { title: string }) => (
      <div className="flex items-center gap-3 mb-6">
          <button 
              onClick={() => setAccountView('dashboard')}
              className="p-2 -ml-2 rounded-full hover:bg-stone-100 text-stone-600"
          >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          </button>
          <h2 className="text-xl font-bold text-stone-900">{title}</h2>
      </div>
  );

  if (accountView === 'dashboard') {
      return (
          <div className="pb-24 p-6">
              <div className="flex items-center gap-4 mb-8">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-2xl border-2 border-white shadow-md">👤</div>
                  <div>
                      <h2 className="text-2xl font-bold text-stone-900">Hello, Buyer</h2>
                      <p className="text-sm text-stone-500">Member since 2024</p>
                  </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                  <div className="bg-green-600 text-white p-5 rounded-2xl shadow-lg shadow-green-200 col-span-2 flex items-center justify-between">
                      <div>
                          <h3 className="font-bold text-lg">My Footprint</h3>
                          <p className="text-green-100 text-sm mt-1">You've saved <span className="font-bold text-white">24kg CO2</span></p>
                      </div>
                      <div className="text-4xl opacity-50">👣</div>
                  </div>

                  <button onClick={() => setAccountView('orders')} className="bg-white p-4 rounded-xl border border-stone-100 shadow-sm hover:shadow-md transition-shadow text-left flex flex-col justify-between h-32">
                      <span className="text-2xl">📦</span>
                      <span className="font-bold text-stone-800 text-sm">Previous Orders</span>
                  </button>
                  <button onClick={() => setAccountView('list')} className="bg-white p-4 rounded-xl border border-stone-100 shadow-sm hover:shadow-md transition-shadow text-left flex flex-col justify-between h-32">
                      <span className="text-2xl">📝</span>
                      <span className="font-bold text-stone-800 text-sm">Shopping List</span>
                  </button>
                  <button onClick={() => setAccountView('reviews')} className="bg-white p-4 rounded-xl border border-stone-100 shadow-sm hover:shadow-md transition-shadow text-left flex flex-col justify-between h-32">
                      <span className="text-2xl">⭐</span>
                      <span className="font-bold text-stone-800 text-sm">My Reviews</span>
                  </button>
                  <button onClick={() => setAccountView('tips')} className="bg-yellow-50 p-4 rounded-xl border border-yellow-100 shadow-sm hover:shadow-md transition-shadow text-left flex flex-col justify-between h-32">
                      <span className="text-2xl">💡</span>
                      <span className="font-bold text-stone-800 text-sm">Ideas & Tips</span>
                  </button>
                  <button onClick={() => setAccountView('saved')} className="bg-white p-4 rounded-xl border border-stone-100 shadow-sm hover:shadow-md transition-shadow text-left flex flex-col justify-between h-32">
                      <span className="text-2xl">❤️</span>
                      <span className="font-bold text-stone-800 text-sm">Saved Farms</span>
                  </button>
                  <button onClick={() => setAccountView('inbox')} className="bg-blue-50 p-4 rounded-xl border border-blue-100 shadow-sm hover:shadow-md transition-shadow text-left flex flex-col justify-between h-32">
                      <span className="text-2xl">💬</span>
                      <span className="font-bold text-stone-800 text-sm">Inbox</span>
                  </button>
                  <button onClick={() => setAccountView('settings')} className="bg-stone-50 p-4 rounded-xl border border-stone-100 shadow-sm hover:shadow-md transition-shadow text-left flex flex-col justify-between h-32">
                      <span className="text-2xl">⚙️</span>
                      <span className="font-bold text-stone-800 text-sm">Settings</span>
                  </button>
              </div>
          </div>
      );
  }

  return (
    <div className="pb-24 p-6 min-h-full bg-stone-50">
      {accountView === 'orders' && (
        <div className="space-y-4">
            <HeaderWithBack title="Previous Orders" />
            {[
                { id: 'ORD-291', date: 'Oct 24, 2024', farm: 'Green Valley Organics', items: 'Tomatoes, Eggs (x2)', total: 18.50 },
                { id: 'ORD-188', date: 'Oct 15, 2024', farm: 'Highland Orchards', items: 'Honeycrisp Apples (3lb)', total: 8.97 },
                { id: 'ORD-102', date: 'Oct 02, 2024', farm: 'Green Valley Organics', items: 'Kale, Sourdough', total: 12.00 },
            ].map(order => (
                <div key={order.id} className="bg-white p-4 rounded-xl border border-stone-100 shadow-sm">
                    <div className="flex justify-between items-start mb-2">
                        <div>
                            <h4 className="font-bold text-stone-800">{order.farm}</h4>
                            <p className="text-xs text-stone-500">{order.date} • {order.id}</p>
                        </div>
                        <span className="font-bold text-green-700">€{order.total.toFixed(2)}</span>
                    </div>
                    <p className="text-sm text-stone-600 mb-3">{order.items}</p>
                    <button className="text-sm font-medium text-green-600 hover:text-green-700 flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                        Reorder
                    </button>
                </div>
            ))}
        </div>
      )}

       {accountView === 'list' && (
        <div className="space-y-4">
            <HeaderWithBack title="Shopping List" />
            <form onSubmit={(e) => {
                e.preventDefault();
                if(newItem.trim()) {
                    setShoppingList([...shoppingList, { id: Date.now(), text: newItem, checked: false }]);
                    setNewItem('');
                }
            }} className="flex gap-2">
                <input 
                    type="text" 
                    value={newItem}
                    onChange={(e) => setNewItem(e.target.value)}
                    placeholder="Add item..."
                    className="flex-1 bg-white border border-stone-300 rounded-lg px-4 py-2 focus:ring-green-500 focus:border-green-500"
                />
                <button type="submit" className="bg-green-600 text-white p-2 rounded-lg hover:bg-green-700">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                </button>
            </form>
            <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
                {shoppingList.map(item => (
                    <div key={item.id} className="flex items-center p-3 border-b border-stone-100 last:border-0 hover:bg-stone-50">
                        <input 
                            type="checkbox" 
                            checked={item.checked}
                            onChange={() => setShoppingList(shoppingList.map(i => i.id === item.id ? {...i, checked: !i.checked} : i))}
                            className="w-5 h-5 text-green-600 rounded border-stone-300 focus:ring-green-500 mr-3"
                        />
                        <span className={`flex-1 ${item.checked ? 'text-stone-400 line-through' : 'text-stone-800'}`}>{item.text}</span>
                        <button 
                            onClick={() => setShoppingList(shoppingList.filter(i => i.id !== item.id))}
                            className="text-stone-400 hover:text-red-500"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                    </div>
                ))}
            </div>
        </div>
      )}
      {accountView === 'reviews' && (
        <div className="space-y-4">
            <HeaderWithBack title="My Reviews" />
            {[
                { farm: 'Green Valley Organics', rating: 5, date: 'Oct 26', text: 'Absolutely love the heirloom tomatoes! The taste is unmatched compared to supermarkets.' },
                { farm: 'Highland Orchards', rating: 4, date: 'Sep 12', text: 'Great apples, but the parking was a bit tricky on Saturday.' }
            ].map((review, i) => (
                <div key={i} className="bg-white p-4 rounded-xl border border-stone-100 shadow-sm">
                    <div className="flex justify-between mb-2">
                        <h4 className="font-bold text-stone-800">{review.farm}</h4>
                        <span className="text-xs text-stone-500">{review.date}</span>
                    </div>
                    <div className="flex text-amber-400 mb-2">
                        {[...Array(5)].map((_, i) => (
                            <span key={i}>{i < review.rating ? '★' : '☆'}</span>
                        ))}
                    </div>
                    <p className="text-sm text-stone-600 italic">"{review.text}"</p>
                </div>
            ))}
        </div>
      )}
      {accountView === 'tips' && (
        <div className="space-y-4">
            <HeaderWithBack title="Ideas & Tips" />
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl border border-green-100">
                <h3 className="font-bold text-green-800 mb-2">Tip of the Day</h3>
                <p className="text-green-700 text-sm">Buying "ugly" produce helps reduce food waste. Irregularly shaped fruits and veggies taste just as good!</p>
            </div>
            <h3 className="font-bold text-stone-800 mt-6">Personalized for You</h3>
            <div className="grid grid-cols-1 gap-4">
                {[
                    { title: 'Recipe: Roasted Root Veggies', desc: 'Perfect for your recent carrot purchase.', icon: '🥕' },
                    { title: 'Storage Hack', desc: 'Keep your kale fresh for 2 weeks with this trick.', icon: '🥬' },
                    { title: 'Event Nearby', desc: 'Sustainable Farming Workshop this Sunday.', icon: '📅' }
                ].map((tip, i) => (
                    <div key={i} className="flex gap-4 bg-white p-4 rounded-xl border border-stone-100 shadow-sm">
                        <div className="w-10 h-10 bg-stone-100 rounded-full flex items-center justify-center text-xl">{tip.icon}</div>
                        <div>
                            <h4 className="font-bold text-stone-800 text-sm">{tip.title}</h4>
                            <p className="text-xs text-stone-500 mt-1">{tip.desc}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      )}
      {accountView === 'saved' && (
        <div className="space-y-4">
            <HeaderWithBack title="Saved Farms" />
            {registeredFarmers.map(farmer => (
                <div key={farmer.id} className="flex gap-4 bg-white p-4 rounded-xl border border-stone-100 shadow-sm">
                    <img src={farmer.image} alt={farmer.farmName} className="w-16 h-16 rounded-lg object-cover" />
                    <div className="flex-1">
                        <div className="flex justify-between items-start">
                            <h4 className="font-bold text-stone-800">{farmer.farmName}</h4>
                            <button className="text-red-500">
                                <svg className="w-5 h-5 fill-current" viewBox="0 0 20 20"><path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" /></svg>
                            </button>
                        </div>
                        <p className="text-xs text-stone-500 mt-1">{farmer.location.address}</p>
                        <div className="flex gap-2 mt-2 items-center justify-between">
                            <div className="flex gap-1">
                                {farmer.badges?.slice(0, 2).map((b, i) => (
                                    <span key={i} className="text-[10px] bg-stone-100 text-stone-600 px-2 py-0.5 rounded">{b}</span>
                                ))}
                            </div>
                            <button 
                                onClick={() => onOpenChat(farmer.id)}
                                className="text-xs bg-green-50 text-green-700 px-3 py-1.5 rounded-full font-medium flex items-center gap-1 hover:bg-green-100"
                            >
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                                Message
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
      )}
      
      {accountView === 'inbox' && (
        <div className="space-y-4">
            <HeaderWithBack title="Messages" />
            {Array.from(new Set(messages.filter(m => m.receiverId === currentBuyerId || m.senderId === currentBuyerId)
                .map(m => m.senderId === currentBuyerId ? m.receiverId : m.senderId)))
                .map(partnerId => {
                    const msgs = messages.filter(m => (m.senderId === partnerId || m.receiverId === partnerId) && (m.senderId === currentBuyerId || m.receiverId === currentBuyerId))
                        .sort((a,b) => b.timestamp - a.timestamp);
                    const partner = registeredFarmers.find(f => f.id === partnerId);
                    const lastMessage = msgs[0];
                    if (!lastMessage) return null;
                    
                    return (
                        <button 
                            key={partnerId}
                            onClick={() => onOpenChat(partnerId)}
                            className="w-full bg-white p-4 rounded-xl border border-stone-100 shadow-sm flex items-center gap-4 hover:bg-stone-50"
                        >
                            <img src={partner?.image || ''} alt="Farm" className="w-12 h-12 rounded-full object-cover" />
                            <div className="flex-1 text-left">
                                <div className="flex justify-between items-center mb-1">
                                    <h4 className="font-bold text-stone-800">{partner?.farmName || 'Farm'}</h4>
                                    <span className="text-xs text-stone-400">{new Date(lastMessage.timestamp).toLocaleDateString()}</span>
                                </div>
                                <p className="text-sm text-stone-500 truncate">{lastMessage.text}</p>
                            </div>
                        </button>
                    )
                })}
             {messages.filter(m => m.receiverId === currentBuyerId || m.senderId === currentBuyerId).length === 0 && (
                <div className="text-center text-stone-400 py-10">No conversations yet.</div>
            )}
        </div>
      )}

      {accountView === 'settings' && (
        <div className="space-y-6">
            <HeaderWithBack title="Settings" />
            <div className="bg-white rounded-xl border border-stone-200 divide-y divide-stone-100">
                <div className="p-4 flex justify-between items-center">
                    <span className="text-stone-800">Push Notifications</span>
                    <div className="w-10 h-6 bg-green-500 rounded-full relative cursor-pointer"><div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div></div>
                </div>
                <div className="p-4 flex justify-between items-center">
                     <span className="text-stone-800">Reset App Data</span>
                     <button 
                        onClick={() => {
                            if(confirm("This will delete all accounts, messages, and product changes. Are you sure?")) {
                                storageService.resetAllData();
                            }
                        }}
                        className="text-xs bg-red-100 text-red-700 px-3 py-1.5 rounded-lg font-medium hover:bg-red-200 transition-colors"
                     >
                        Reset to Defaults
                     </button>
                </div>
            </div>
            <button onClick={onLogout} className="w-full py-3 text-red-600 bg-red-50 rounded-xl font-medium">Log Out</button>
        </div>
      )}
    </div>
  )
};

export default AccountView;