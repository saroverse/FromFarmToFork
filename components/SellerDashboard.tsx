import React, { useState } from 'react';
import { Farmer, Message } from '../types';
import SellerOverview from './seller/SellerOverview';
import SellerProducts from './seller/SellerProducts';
import SellerSchedule from './seller/SellerSchedule';
import SellerCertifications from './seller/SellerCertifications';
import SellerMessages from './seller/SellerMessages';
import SellerPartnerships from './seller/SellerPartnerships';

interface SellerDashboardProps {
  farmer: Farmer;
  updateFarmer: (f: Farmer) => void;
  messages: Message[];
  onSendMessage: (text: string, receiverId: string) => void;
}

const SellerDashboard: React.FC<SellerDashboardProps> = ({ farmer, updateFarmer, messages, onSendMessage }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'schedule' | 'messages' | 'certifications' | 'partnerships'>('overview');

  const handleToggleOpen = () => {
    updateFarmer({ ...farmer, isOpenNow: !farmer.isOpenNow });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Navigation */}
        <nav className="space-y-2 lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-6 text-center">
            <img 
              src={farmer.image} 
              alt="Farm" 
              className="w-24 h-24 rounded-full mx-auto object-cover mb-4 ring-4 ring-green-50"
            />
            <h2 className="text-xl font-bold text-stone-800">{farmer.farmName}</h2>
            <p className="text-stone-500 text-sm mb-4">{farmer.name}</p>
            
            <button
              onClick={handleToggleOpen}
              className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
                farmer.isOpenNow 
                  ? 'bg-green-100 text-green-800 border border-green-200' 
                  : 'bg-stone-100 text-stone-600 border border-stone-200'
              }`}
            >
              {farmer.isOpenNow ? '● Open for Business' : '○ Currently Closed'}
            </button>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden">
            <button 
              onClick={() => setActiveTab('overview')}
              className={`w-full text-left px-6 py-4 font-medium ${activeTab === 'overview' ? 'bg-green-50 text-green-800 border-l-4 border-green-600' : 'text-stone-600 hover:bg-stone-50'}`}
            >
              Profile & Overview
            </button>
            <button 
              onClick={() => setActiveTab('products')}
              className={`w-full text-left px-6 py-4 font-medium ${activeTab === 'products' ? 'bg-green-50 text-green-800 border-l-4 border-green-600' : 'text-stone-600 hover:bg-stone-50'}`}
            >
              Manage Products
            </button>
            <button 
              onClick={() => setActiveTab('schedule')}
              className={`w-full text-left px-6 py-4 font-medium ${activeTab === 'schedule' ? 'bg-green-50 text-green-800 border-l-4 border-green-600' : 'text-stone-600 hover:bg-stone-50'}`}
            >
              Market Schedule
            </button>
            <button 
              onClick={() => setActiveTab('partnerships')}
              className={`w-full text-left px-6 py-4 font-medium ${activeTab === 'partnerships' ? 'bg-green-50 text-green-800 border-l-4 border-green-600' : 'text-stone-600 hover:bg-stone-50'}`}
            >
              Partnerships & Distribution
            </button>
            <button 
              onClick={() => setActiveTab('certifications')}
              className={`w-full text-left px-6 py-4 font-medium ${activeTab === 'certifications' ? 'bg-green-50 text-green-800 border-l-4 border-green-600' : 'text-stone-600 hover:bg-stone-50'}`}
            >
              Awards & Certs
            </button>
             <button 
              onClick={() => setActiveTab('messages')}
              className={`w-full text-left px-6 py-4 font-medium flex justify-between items-center ${activeTab === 'messages' ? 'bg-green-50 text-green-800 border-l-4 border-green-600' : 'text-stone-600 hover:bg-stone-50'}`}
            >
              <span>Messages</span>
              {messages.filter(m => m.receiverId === farmer.id && !m.isRead).length > 0 && (
                  <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                      {messages.filter(m => m.receiverId === farmer.id && !m.isRead).length}
                  </span>
              )}
            </button>
          </div>
        </nav>

        {/* Main Content Area */}
        <div className="lg:col-span-3 space-y-6">
          {activeTab === 'overview' && <SellerOverview farmer={farmer} updateFarmer={updateFarmer} />}
          {activeTab === 'products' && <SellerProducts farmer={farmer} updateFarmer={updateFarmer} />}
          {activeTab === 'schedule' && <SellerSchedule farmer={farmer} updateFarmer={updateFarmer} />}
          {activeTab === 'certifications' && <SellerCertifications farmer={farmer} updateFarmer={updateFarmer} />}
          {activeTab === 'partnerships' && <SellerPartnerships farmer={farmer} onSendMessage={onSendMessage} />}
          {activeTab === 'messages' && <SellerMessages farmer={farmer} messages={messages} onSendMessage={onSendMessage} />}
        </div>
      </div>
    </div>
  );
};

export default SellerDashboard;