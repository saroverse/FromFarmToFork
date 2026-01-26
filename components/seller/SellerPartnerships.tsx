import React, { useState } from 'react';
import { Farmer } from '../../types';
import { storageService } from '../../services/storageService';

interface Partner {
  id: string;
  name: string;
  type: 'Restaurant' | 'Cafe' | 'NGO' | 'Co-op' | 'Shop';
  description: string;
  needs: string[];
  distance: string;
  image: string;
  status: 'active' | 'pending' | 'none';
  matchScore: number;
}

interface LogisticsRun {
    id: string;
    route: string;
    day: string;
    capacityLeft: number;
    cost: string;
    organizer: string;
}

interface SellerPartnershipsProps {
    farmer: Farmer;
    onSendMessage: (text: string, receiverId: string) => void;
}

const SellerPartnerships: React.FC<SellerPartnershipsProps> = ({ farmer, onSendMessage }) => {
  const [filter, setFilter] = useState<'All' | 'Commercial' | 'NGO' | 'Logistics'>('All');
  
  // -- Mock Data State --
  const [partners, setPartners] = useState<Partner[]>([
      {
          id: 'p1',
          name: 'Bistro 55',
          type: 'Restaurant',
          description: 'Farm-to-table French bistro focusing on seasonal root vegetables.',
          needs: ['Potatoes', 'Onions', 'Herbs'],
          distance: '2.5km',
          image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=200',
          status: 'none',
          matchScore: 95
      },
      {
          id: 'p2',
          name: 'The Daily Grind',
          type: 'Cafe',
          description: 'Community cafe. We need fresh milk and eggs daily.',
          needs: ['Eggs', 'Milk', 'Honey'],
          distance: '1.2km',
          image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&q=80&w=200',
          status: 'active',
          matchScore: 88
      },
      {
          id: 'p3',
          name: 'St. Mary\'s Kitchen',
          type: 'NGO',
          description: 'Feeding the homeless. We happily accept "ugly" produce donations.',
          needs: ['Any Vegetables', 'Bread', 'Fruit'],
          distance: '3.0km',
          image: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&q=80&w=200',
          status: 'none',
          matchScore: 100
      },
      {
          id: 'p4',
          name: 'EcoShop Downtown',
          type: 'Shop',
          description: 'Zero-waste grocery store looking for local bulk suppliers.',
          needs: ['Apples', 'Carrots', 'Grain'],
          distance: '4.5km',
          image: 'https://images.unsplash.com/photo-1604719312566-b76d4686eb3e?auto=format&fit=crop&q=80&w=200',
          status: 'pending',
          matchScore: 75
      }
  ]);

  const [logisticsRuns, setLogisticsRuns] = useState<LogisticsRun[]>([
      { id: 'l1', route: 'Maastricht Centre Loop', day: 'Mon & Thu', capacityLeft: 40, cost: '€12/run', organizer: 'South Co-op' },
      { id: 'l2', route: 'Heerlen Market Express', day: 'Saturday', capacityLeft: 15, cost: '€20/run', organizer: 'Green Logistics' },
  ]);

  // -- Modal States --
  const [modalType, setModalType] = useState<'none' | 'message' | 'book_logistics' | 'add_logistics'>('none');
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);
  const [selectedRun, setSelectedRun] = useState<LogisticsRun | null>(null);
  const [messageText, setMessageText] = useState('');
  const [toast, setToast] = useState<{msg: string, type: 'success' | 'info'} | null>(null);

  // -- Handlers --

  const showToast = (msg: string, type: 'success' | 'info' = 'success') => {
      setToast({ msg, type });
      setTimeout(() => setToast(null), 3000);
  };

  const handleConnect = (id: string) => {
      setPartners(prev => prev.map(p => p.id === id ? { ...p, status: 'pending' } : p));
      showToast('Connection request sent!');
  };

  const handleOpenMessage = (partner: Partner) => {
      setSelectedPartner(partner);
      setModalType('message');
      setMessageText('');
  };

  const handleSendMessage = (e: React.FormEvent) => {
      e.preventDefault();
      if (selectedPartner && messageText.trim()) {
          // 1. Send active message
          onSendMessage(messageText, selectedPartner.id);
          
          // 2. Simulate reply for better UX (stored in global message history)
          setTimeout(() => {
             const reply = {
                 id: Date.now().toString(),
                 senderId: selectedPartner.id,
                 receiverId: farmer.id,
                 senderName: selectedPartner.name,
                 text: "Thanks for reaching out! We'd love to discuss a partnership. When are you free?",
                 timestamp: Date.now(),
                 isRead: false
             };
             storageService.saveMessage(reply);
             // Note: This won't trigger a live update on the parent unless DataContext polls, 
             // but user will see it when they switch tabs or reload.
          }, 2000);

          setModalType('none');
          showToast(`Message sent to ${selectedPartner.name}`);
      }
  };

  const handleBookLogistics = (run: LogisticsRun) => {
      setSelectedRun(run);
      setModalType('book_logistics');
  };

  const confirmBooking = () => {
      if (selectedRun) {
          setLogisticsRuns(prev => prev.map(r => r.id === selectedRun.id ? { ...r, capacityLeft: r.capacityLeft - 10 } : r));
          setModalType('none');
          showToast('Space booked successfully!');
      }
  };

  const handleAddLogistics = (e: React.FormEvent) => {
      e.preventDefault();
      // Mock adding
      const newRun: LogisticsRun = {
          id: Date.now().toString(),
          route: 'My Custom Route',
          day: 'Friday',
          capacityLeft: 100,
          cost: 'Contact for price',
          organizer: farmer.farmName
      };
      setLogisticsRuns(prev => [...prev, newRun]);
      setModalType('none');
      showToast('Your logistics run has been listed');
  };

  const getFilteredPartners = () => {
      if (filter === 'All') return partners;
      if (filter === 'NGO') return partners.filter(p => p.type === 'NGO');
      if (filter === 'Commercial') return partners.filter(p => ['Restaurant', 'Cafe', 'Shop'].includes(p.type));
      return [];
  };

  return (
    <div className="space-y-6 relative">
        {/* Toast Notification */}
        {toast && (
            <div className="fixed top-24 right-6 z-50 bg-stone-900 text-white px-6 py-3 rounded-lg shadow-xl animate-in fade-in slide-in-from-top-4 duration-300 flex items-center gap-2">
                <span className="text-green-400">✓</span> {toast.msg}
            </div>
        )}

        {/* Header Stats */}
        <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start mb-6 gap-4">
                <div>
                    <h2 className="text-xl font-bold text-stone-800">Partnerships & Distribution</h2>
                    <p className="text-stone-500">Connect with local businesses and share logistics to cut costs.</p>
                </div>
                <div className="flex gap-2">
                     <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-bold">1 Active Partner</span>
                     <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-bold">120kg Donated</span>
                </div>
            </div>

            <div className="flex gap-2 border-b border-stone-100 pb-4 mb-4 overflow-x-auto">
                {['All', 'Commercial', 'NGO', 'Logistics'].map(f => (
                    <button 
                        key={f}
                        onClick={() => setFilter(f as any)}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
                            filter === f 
                            ? 'bg-stone-800 text-white' 
                            : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                        }`}
                    >
                        {f === 'Commercial' ? 'Restaurants & Shops' : f === 'NGO' ? 'Donations (NGO)' : f === 'Logistics' ? 'Logistics Pooling' : 'All Partners'}
                    </button>
                ))}
            </div>

            {/* Logistics View */}
            {filter === 'Logistics' && (
                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl flex gap-4 items-start">
                         <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-2xl">🚛</div>
                         <div>
                             <h3 className="font-bold text-blue-900">Why Pool Logistics?</h3>
                             <p className="text-blue-800 text-sm mt-1">
                                 Sharing delivery runs with other farmers reduces your carbon footprint and can save you up to 
                                 <span className="font-bold"> 60% on fuel and time</span>.
                             </p>
                         </div>
                    </div>

                    <h3 className="font-bold text-stone-800 mt-4">Available Delivery Runs</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {logisticsRuns.map(run => (
                            <div key={run.id} className="border border-stone-200 rounded-xl p-5 hover:border-green-400 transition-colors bg-white relative overflow-hidden group">
                                <div className="absolute top-0 right-0 bg-stone-100 px-3 py-1 rounded-bl-lg text-xs font-bold text-stone-600">
                                    {run.organizer}
                                </div>
                                <h4 className="font-bold text-lg text-stone-800 mb-1">{run.route}</h4>
                                <div className="flex items-center gap-2 text-stone-500 text-sm mb-4">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                    {run.day}
                                </div>
                                
                                <div className="flex justify-between items-end">
                                    <div>
                                        <p className="text-xs text-stone-400 uppercase tracking-wider font-bold">Space Left</p>
                                        <div className="w-32 h-2 bg-stone-100 rounded-full mt-1 overflow-hidden">
                                            <div className="h-full bg-green-500" style={{ width: `${run.capacityLeft}%` }}></div>
                                        </div>
                                        <p className="text-xs text-stone-500 mt-1">{run.capacityLeft}% capacity available</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-lg font-bold text-green-700">{run.cost}</p>
                                        <button 
                                            onClick={() => handleBookLogistics(run)}
                                            className="bg-stone-900 text-white text-xs px-3 py-1.5 rounded-lg mt-1 hover:bg-green-700 transition-colors"
                                        >
                                            Book Space
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                         {/* Add New Run Card */}
                         <button 
                            onClick={() => setModalType('add_logistics')}
                            className="border-2 border-dashed border-stone-200 rounded-xl p-5 flex flex-col items-center justify-center text-stone-400 hover:border-green-300 hover:text-green-600 transition-colors cursor-pointer min-h-[160px] bg-stone-50/50"
                         >
                            <span className="text-3xl mb-2">+</span>
                            <span className="font-medium">Offer Your Own Van</span>
                        </button>
                    </div>
                </div>
            )}

            {/* Partners Grid */}
            {filter !== 'Logistics' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    {getFilteredPartners().map(partner => (
                        <div key={partner.id} className="border border-stone-200 rounded-xl p-4 bg-white hover:shadow-md transition-shadow">
                            <div className="flex gap-4">
                                <img src={partner.image} alt={partner.name} className="w-20 h-20 rounded-lg object-cover bg-stone-100" />
                                <div className="flex-1">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h4 className="font-bold text-stone-900">{partner.name}</h4>
                                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                                                partner.type === 'NGO' ? 'bg-purple-100 text-purple-700' :
                                                partner.type === 'Restaurant' ? 'bg-orange-100 text-orange-700' :
                                                'bg-blue-100 text-blue-700'
                                            }`}>
                                                {partner.type}
                                            </span>
                                        </div>
                                        {partner.status === 'active' && <span className="text-green-600 text-xs font-bold">Connected ✓</span>}
                                        {partner.status === 'pending' && <span className="text-amber-600 text-xs font-bold">Pending...</span>}
                                    </div>
                                    <p className="text-xs text-stone-500 mt-2 line-clamp-2">{partner.description}</p>
                                    
                                    {/* Needs Tags */}
                                    <div className="flex gap-1 flex-wrap mt-2">
                                        {partner.needs.map((n, i) => (
                                            <span key={i} className="text-[10px] bg-stone-50 border border-stone-100 text-stone-600 px-1.5 py-0.5 rounded">
                                                Needs: {n}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-between mt-4 pt-3 border-t border-stone-100">
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-bold text-green-700 bg-green-50 px-2 py-1 rounded-md">
                                        {partner.matchScore}% Match
                                    </span>
                                    <span className="text-xs text-stone-400">{partner.distance} away</span>
                                </div>
                                {partner.status === 'none' && (
                                    <button 
                                        onClick={() => handleConnect(partner.id)}
                                        className={`text-sm font-medium px-4 py-1.5 rounded-lg transition-colors ${
                                            partner.type === 'NGO' 
                                            ? 'bg-purple-600 text-white hover:bg-purple-700' 
                                            : 'bg-green-600 text-white hover:bg-green-700'
                                        }`}
                                    >
                                        {partner.type === 'NGO' ? 'Donate Surplus' : 'Connect'}
                                    </button>
                                )}
                                {partner.status !== 'none' && (
                                     <button 
                                        onClick={() => handleOpenMessage(partner)}
                                        className="text-stone-500 hover:text-green-600 text-sm font-medium flex items-center gap-1 bg-stone-50 px-3 py-1.5 rounded-lg transition-colors"
                                     >
                                         <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                                         Message
                                     </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>

        {/* --- Modals --- */}

        {/* Message Modal */}
        {modalType === 'message' && selectedPartner && (
            <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setModalType('none')}></div>
                <div className="bg-white rounded-xl shadow-2xl w-full max-w-md z-10 overflow-hidden animate-in zoom-in-95 duration-200">
                    <div className="p-4 bg-stone-50 border-b border-stone-100 flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <img src={selectedPartner.image} className="w-8 h-8 rounded-full object-cover" />
                            <h3 className="font-bold text-stone-800">Message {selectedPartner.name}</h3>
                        </div>
                        <button onClick={() => setModalType('none')} className="text-stone-400 hover:text-stone-600">✕</button>
                    </div>
                    <form onSubmit={handleSendMessage} className="p-4">
                        <textarea 
                            value={messageText}
                            onChange={(e) => setMessageText(e.target.value)}
                            className="w-full h-32 p-3 bg-white border border-stone-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:outline-none resize-none"
                            placeholder="Introduce your farm and what you can offer..."
                            autoFocus
                        />
                        <div className="flex justify-end mt-4">
                            <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-green-700 transition-colors">
                                Send Message
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        )}

        {/* Booking Confirmation Modal */}
        {modalType === 'book_logistics' && selectedRun && (
            <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setModalType('none')}></div>
                <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm z-10 p-6 animate-in zoom-in-95 duration-200 text-center">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">🚛</div>
                    <h3 className="text-xl font-bold text-stone-900 mb-2">Confirm Booking</h3>
                    <p className="text-stone-500 mb-6">
                        Reserve space on the <strong>{selectedRun.route}</strong> run this {selectedRun.day}?<br/>
                        <span className="text-sm">Cost: {selectedRun.cost}</span>
                    </p>
                    <div className="flex gap-3">
                        <button onClick={() => setModalType('none')} className="flex-1 py-2.5 rounded-lg border border-stone-200 text-stone-600 font-medium hover:bg-stone-50">Cancel</button>
                        <button onClick={confirmBooking} className="flex-1 py-2.5 rounded-lg bg-green-600 text-white font-bold hover:bg-green-700">Confirm</button>
                    </div>
                </div>
            </div>
        )}

        {/* Add Logistics Modal */}
        {modalType === 'add_logistics' && (
            <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setModalType('none')}></div>
                <div className="bg-white rounded-xl shadow-2xl w-full max-w-md z-10 overflow-hidden animate-in zoom-in-95 duration-200">
                    <div className="p-4 border-b border-stone-100">
                        <h3 className="font-bold text-lg text-stone-900">Offer Logistics Run</h3>
                    </div>
                    <form onSubmit={handleAddLogistics} className="p-6 space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-stone-700 mb-1">Route Name</label>
                            <input required className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-green-500 focus:outline-none" placeholder="e.g. Farm -> City Center" />
                        </div>
                         <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-stone-700 mb-1">Day</label>
                                <select className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-green-500 focus:outline-none">
                                    <option>Monday</option><option>Tuesday</option><option>Wednesday</option><option>Thursday</option><option>Friday</option><option>Saturday</option><option>Sunday</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-stone-700 mb-1">Cost Share</label>
                                <input required className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-green-500 focus:outline-none" placeholder="e.g. €10" />
                            </div>
                         </div>
                        <button type="submit" className="w-full bg-stone-900 text-white py-3 rounded-lg font-bold hover:bg-green-700 transition-colors mt-2">
                            List Route
                        </button>
                    </form>
                </div>
            </div>
        )}
    </div>
  );
};

export default SellerPartnerships;