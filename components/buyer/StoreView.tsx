import React, { useState } from 'react';
import { Farmer, Product } from '../../types';
import { CartItem } from './CartDrawer';

interface StoreViewProps {
  farmer: Farmer;
  onBack: () => void;
  cart: CartItem[];
  onAddToCart: (product: Product, farmerName: string) => void;
  onRemoveOne: (productId: string) => void;
}

const StoreView: React.FC<StoreViewProps> = ({ farmer, onBack, cart, onAddToCart, onRemoveOne }) => {
  const [activeTab, setActiveTab] = useState<'products' | 'about'>('products');

  const getCartQuantity = (productId: string) => {
    return cart.find(item => item.id === productId)?.quantity || 0;
  };

  return (
    <div className="bg-stone-50 min-h-full pb-24 animate-in slide-in-from-right duration-300">
      {/* Header */}
      <div className="relative h-64">
        <img src={farmer.image} alt={farmer.farmName} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-900/80 via-transparent to-transparent"></div>
        
        {/* Navbar */}
        <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center z-10">
            <button onClick={onBack} className="bg-white/20 backdrop-blur-md p-2 rounded-full text-white hover:bg-white/30 transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            </button>
        </div>

        {/* Farm Info */}
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <h1 className="text-3xl font-bold mb-2">{farmer.farmName}</h1>
            <div className="flex items-center gap-4 text-sm">
                <span className="bg-green-600 px-2 py-0.5 rounded text-white font-bold flex items-center gap-1">
                    ★ {farmer.rating}
                </span>
                <span className="opacity-90">{farmer.location.address}</span>
            </div>
             <div className="flex gap-2 mt-3">
                 <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${farmer.isOpenNow ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
                      {farmer.isOpenNow ? 'Open Now' : 'Closed'}
                 </span>
                 {farmer.badges?.map((b,i) => (
                      <span key={i} className="text-xs bg-white/20 text-white px-2 py-0.5 rounded-full backdrop-blur-sm">{b}</span>
                  ))}
            </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-stone-200 sticky top-0 z-20 flex shadow-sm">
          <button 
            onClick={() => setActiveTab('products')}
            className={`flex-1 py-4 text-sm font-bold border-b-2 transition-colors ${activeTab === 'products' ? 'border-green-600 text-green-800' : 'border-transparent text-stone-500 hover:text-stone-800'}`}
          >
              Shop Products
          </button>
          <button 
            onClick={() => setActiveTab('about')}
            className={`flex-1 py-4 text-sm font-bold border-b-2 transition-colors ${activeTab === 'about' ? 'border-green-600 text-green-800' : 'border-transparent text-stone-500 hover:text-stone-800'}`}
          >
              About & Schedule
          </button>
      </div>

      {/* Content */}
      <div className="p-4">
          {activeTab === 'products' && (
              <div className="space-y-4">
                  {farmer.products.map(product => {
                       const qty = getCartQuantity(product.id);
                       return (
                        <div key={product.id} className="bg-white p-3 rounded-xl border border-stone-100 shadow-sm flex gap-4 items-center">
                            <div className="w-20 h-20 bg-stone-100 rounded-lg overflow-hidden flex-shrink-0">
                                <img src={product.image || farmer.image} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-bold text-stone-900">{product.name}</h3>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="text-stone-500 text-sm">€{product.price.toFixed(2)} / {product.unit}</span>
                                    {!product.inStock && <span className="text-red-500 text-xs font-bold">Out of Stock</span>}
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                {qty > 0 && (
                                   <button 
                                       onClick={() => onRemoveOne(product.id)}
                                       className="w-8 h-8 rounded-full border border-stone-200 flex items-center justify-center text-stone-500 hover:bg-stone-50"
                                   >
                                       -
                                   </button>
                               )}
                               <button 
                                  onClick={() => onAddToCart(product, farmer.farmName)}
                                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                                      qty > 0 
                                      ? 'bg-green-600 text-white' 
                                      : 'bg-stone-900 text-white hover:bg-green-600'
                                  }`}
                               >
                                  {qty > 0 ? <span className="text-sm font-bold">{qty}</span> : '+'}
                               </button>
                            </div>
                        </div>
                       );
                  })}
                  {farmer.products.length === 0 && (
                      <div className="text-center py-10 text-stone-400">No products available at the moment.</div>
                  )}
              </div>
          )}

          {activeTab === 'about' && (
              <div className="space-y-6">
                  <div className="bg-white p-5 rounded-xl border border-stone-100 shadow-sm">
                      <h3 className="font-bold text-lg mb-2">Our Story</h3>
                      <p className="text-stone-600 leading-relaxed text-sm">{farmer.description}</p>
                  </div>

                  <div className="bg-white p-5 rounded-xl border border-stone-100 shadow-sm">
                      <h3 className="font-bold text-lg mb-4">Market Schedule</h3>
                      <div className="space-y-3">
                          {farmer.schedule.map((item, idx) => (
                              <div key={idx} className="flex justify-between items-center text-sm border-b border-stone-50 last:border-0 pb-2 last:pb-0">
                                  <span className="font-bold text-stone-800 w-24">{item.day}</span>
                                  <div className="text-right">
                                      <span className="block text-green-700 font-medium">{item.location}</span>
                                      <span className="block text-stone-500 text-xs">{item.openTime} - {item.closeTime}</span>
                                  </div>
                              </div>
                          ))}
                          {farmer.schedule.length === 0 && (
                              <p className="text-stone-400 italic text-sm">No schedule posted.</p>
                          )}
                      </div>
                  </div>
                  
                  {farmer.certifications && farmer.certifications.length > 0 && (
                      <div className="bg-white p-5 rounded-xl border border-stone-100 shadow-sm">
                          <h3 className="font-bold text-lg mb-4">Certifications</h3>
                          <div className="flex flex-wrap gap-2">
                              {farmer.certifications.map(c => (
                                  <div key={c.id} className="bg-stone-50 px-3 py-2 rounded-lg border border-stone-100 flex items-center gap-2">
                                      <span>🏅</span>
                                      <div>
                                          <p className="text-xs font-bold text-stone-800">{c.name}</p>
                                          <p className="text-[10px] text-stone-500">{c.issuer}</p>
                                      </div>
                                  </div>
                              ))}
                          </div>
                      </div>
                  )}
              </div>
          )}
      </div>
    </div>
  );
};

export default StoreView;