import React, { useState } from 'react';
import { Farmer, Product, Coordinates } from '../../types';
import { CartItem } from './CartDrawer';

interface MarketViewProps {
  registeredFarmers: Farmer[];
  userLocation: Coordinates | null;
  cart: CartItem[];
  onAddToCart: (product: Product, farmerName: string) => void;
  onRemoveOne: (productId: string) => void;
}

const MarketView: React.FC<MarketViewProps> = ({ registeredFarmers, userLocation, cart, onAddToCart, onRemoveOne }) => {
  const [selectedProductCategory, setSelectedProductCategory] = useState('All');
  
  const allProducts = registeredFarmers.flatMap(f => f.products.map(p => ({...p, farmer: f})));
  
  // Filter products based on category
  const filteredProducts = selectedProductCategory === 'All' 
    ? allProducts 
    : allProducts.filter(p => {
        // Simple mock category logic based on name for demo
        const lowerName = p.name.toLowerCase();
        const cat = selectedProductCategory.toLowerCase();
        if (cat === 'vegetables') return ['tomato', 'kale', 'carrot', 'spinach', 'corn'].some(k => lowerName.includes(k));
        if (cat === 'fruits') return ['apple', 'peach', 'berry', 'melon'].some(k => lowerName.includes(k));
        if (cat === 'dairy') return ['milk', 'cheese', 'yogurt', 'egg'].some(k => lowerName.includes(k));
        if (cat === 'bakery') return ['bread', 'pie', 'cake'].some(k => lowerName.includes(k));
        return true; 
    });

  const getDeliveryFee = (farmLoc: {lat: number, lng: number}) => {
    if (!userLocation) return 2.99;
    return (Math.abs(farmLoc.lat - userLocation.latitude) * 100).toFixed(2);
  };

  const getCartQuantity = (productId: string) => {
    return cart.find(item => item.id === productId)?.quantity || 0;
  };

  return (
    <div className="pb-32"> {/* Increased padding for floating cart button */}
       <div className="bg-white sticky top-0 z-10 px-4 py-4 shadow-sm">
          <div className="relative mb-4">
              <input 
                  type="text" 
                  placeholder="Search food, farms..." 
                  className="w-full pl-10 pr-4 py-3 bg-stone-100 border-none rounded-xl text-stone-900 focus:ring-2 focus:ring-green-500"
              />
              <svg className="w-5 h-5 text-stone-400 absolute left-3 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </div>
          
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {['All', 'Vegetables', 'Fruits', 'Dairy', 'Bakery'].map(cat => (
                  <button 
                      key={cat}
                      onClick={() => setSelectedProductCategory(cat)}
                      className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-colors ${
                          selectedProductCategory === cat 
                          ? 'bg-green-800 text-white' 
                          : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                      }`}
                  >
                      {cat}
                  </button>
              ))}
          </div>
       </div>

       <div className="p-4 space-y-6">
          <h2 className="font-bold text-lg text-stone-800">Fresh Near You</h2>
          {filteredProducts.map((item) => {
             const qty = getCartQuantity(item.id);
             return (
              <div key={`${item.farmer.id}-${item.id}`} className="bg-white p-4 rounded-2xl shadow-sm border border-stone-100 flex gap-4">
                  <div className="w-24 h-24 flex-shrink-0 bg-stone-200 rounded-xl overflow-hidden relative">
                      <img src={item.image || item.farmer.image} alt={item.name} className="w-full h-full object-cover" />
                      {qty > 0 && (
                        <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                            <span className="bg-white text-green-800 text-xs font-bold px-2 py-1 rounded-full shadow-sm">
                                {qty} in cart
                            </span>
                        </div>
                      )}
                  </div>
                  <div className="flex-grow flex flex-col justify-between">
                      <div>
                          <div className="flex justify-between items-start">
                              <div>
                                  <h3 className="font-bold text-stone-900 text-lg leading-tight">{item.name}</h3>
                                  <p className="text-sm text-stone-500 flex items-center gap-1 mt-1">
                                      {item.farmer.farmName} 
                                      <span className="text-amber-500 flex items-center text-xs font-bold">★ {item.farmer.rating}</span>
                                  </p>
                              </div>
                              <span className="font-bold text-green-700">€{item.price.toFixed(2)}</span>
                          </div>
                          
                          <div className="mt-2 flex flex-wrap gap-1">
                              {item.farmer.badges?.slice(0, 2).map((badge, idx) => (
                                  <span key={idx} className="text-[10px] px-1.5 py-0.5 bg-green-50 text-green-700 rounded border border-green-100">
                                      {badge}
                                  </span>
                              ))}
                          </div>
                      </div>

                      <div className="mt-3 flex justify-between items-end">
                           <span className="text-xs text-stone-400 mb-1">Delivery: €{getDeliveryFee(item.farmer.location)}</span>
                           
                           {/* Add to Cart Button Logic */}
                           <div className="flex items-center gap-2">
                               {qty > 0 && (
                                   <button 
                                       onClick={() => onRemoveOne(item.id)}
                                       className="w-8 h-8 rounded-full border border-stone-200 flex items-center justify-center text-stone-500 hover:bg-stone-50 transition-colors"
                                   >
                                       -
                                   </button>
                               )}
                               <button 
                                  onClick={() => onAddToCart(item, item.farmer.farmName)}
                                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 shadow-sm active:scale-90 ${
                                      qty > 0 
                                      ? 'bg-green-600 text-white' 
                                      : 'bg-stone-900 text-white hover:bg-green-600'
                                  }`}
                               >
                                  {qty > 0 ? (
                                      <span className="text-sm font-bold">{qty}</span>
                                  ) : (
                                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                                  )}
                               </button>
                           </div>
                      </div>
                  </div>
              </div>
          )})}
          {filteredProducts.length === 0 && (
              <div className="text-center py-10 text-stone-400">
                  <p>No products found in this category.</p>
              </div>
          )}
       </div>
    </div>
  );
};

export default MarketView;