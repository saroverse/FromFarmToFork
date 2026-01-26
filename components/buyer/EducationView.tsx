import React, { useState } from 'react';

interface EducationViewProps {
  onNavigateToMap: () => void;
}

const EducationView: React.FC<EducationViewProps> = ({ onNavigateToMap }) => {
  const [activeTab, setActiveTab] = useState<'chain' | 'impact' | 'stories'>('chain');

  return (
    <div className="pb-24 bg-stone-50 min-h-full">
      {/* Hero Section */}
      <div className="relative h-64 overflow-hidden">
         <img 
            src="https://images.unsplash.com/photo-1595981267035-7b04ca84a82d?auto=format&fit=crop&q=80&w=1000" 
            alt="Farmer holding produce" 
            className="w-full h-full object-cover"
         />
         <div className="absolute inset-0 bg-gradient-to-r from-green-900/90 to-transparent flex flex-col justify-center p-8">
            <span className="text-green-300 font-bold tracking-wider text-xs uppercase mb-2">The Knowledge Hub</span>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 max-w-lg">Empowering Local Farmers</h1>
            <p className="text-green-50 text-sm md:text-base max-w-md leading-relaxed">
               Discover how Short Food Supply Chains (SFSC) are revolutionizing the way we eat, cutting out middlemen, and bringing the farm back to your fork.
            </p>
         </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex px-6 -mt-6 relative z-10 overflow-x-auto scrollbar-hide gap-3">
         {[
             { id: 'chain', label: 'The Supply Chain', icon: '🔗' },
             { id: 'impact', label: 'Real Impact', icon: '📈' },
             { id: 'stories', label: 'Farmer Stories', icon: '👨‍🌾' }
         ].map(tab => (
             <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl shadow-md font-bold transition-all whitespace-nowrap ${
                    activeTab === tab.id 
                    ? 'bg-green-600 text-white scale-105' 
                    : 'bg-white text-stone-600 hover:bg-stone-50'
                }`}
             >
                 <span>{tab.icon}</span>
                 {tab.label}
             </button>
         ))}
      </div>

      <div className="p-6">
          {/* TAB 1: The Supply Chain Visualization */}
          {activeTab === 'chain' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-200">
                      <h2 className="text-xl font-bold text-stone-900 mb-6">Where does your money go?</h2>
                      
                      {/* Traditional Model */}
                      <div className="mb-8 opacity-70 grayscale transition-all hover:grayscale-0 hover:opacity-100">
                          <div className="flex justify-between items-end mb-2">
                              <span className="font-bold text-stone-500 text-sm">Traditional Supermarket</span>
                              <span className="text-xs text-red-500 font-bold">Farmer gets ~15%</span>
                          </div>
                          <div className="h-16 bg-stone-100 rounded-xl flex items-center p-2 gap-2 overflow-hidden relative">
                              <div className="w-full absolute top-1/2 left-0 h-0.5 bg-stone-300 -z-10"></div>
                              <div className="w-10 h-10 bg-white rounded-full border border-stone-300 flex items-center justify-center text-lg z-10" title="Farmer">👨‍🌾</div>
                              <div className="flex-1 flex justify-evenly">
                                  <div className="w-8 h-8 bg-stone-200 rounded-full flex items-center justify-center text-xs text-stone-500" title="Transport">🚚</div>
                                  <div className="w-8 h-8 bg-stone-200 rounded-full flex items-center justify-center text-xs text-stone-500" title="Wholesale">🏭</div>
                                  <div className="w-8 h-8 bg-stone-200 rounded-full flex items-center justify-center text-xs text-stone-500" title="Distributor">📦</div>
                                  <div className="w-8 h-8 bg-stone-200 rounded-full flex items-center justify-center text-xs text-stone-500" title="Retail">🏪</div>
                              </div>
                              <div className="w-10 h-10 bg-green-100 rounded-full border border-green-300 flex items-center justify-center text-lg z-10" title="You">🍽️</div>
                          </div>
                      </div>

                      {/* SFSC Model */}
                      <div>
                          <div className="flex justify-between items-end mb-2">
                              <span className="font-bold text-green-800 text-sm">FarmConnect (Short Chain)</span>
                              <span className="text-xs text-green-600 font-bold">Farmer gets ~85%</span>
                          </div>
                          <div className="h-20 bg-green-50 rounded-xl flex items-center p-2 gap-2 overflow-hidden relative border border-green-200 shadow-sm">
                              <div className="w-full absolute top-1/2 left-0 h-1 bg-green-200 -z-10 animate-pulse"></div>
                              <div className="w-12 h-12 bg-white rounded-full border-2 border-green-500 flex items-center justify-center text-2xl z-10 shadow-lg">👨‍🌾</div>
                              <div className="flex-1 text-center">
                                  <span className="bg-white px-3 py-1 rounded-full text-[10px] font-bold text-green-700 shadow-sm border border-green-100">
                                      Direct Connection
                                  </span>
                              </div>
                              <div className="w-12 h-12 bg-green-600 rounded-full border-2 border-green-800 flex items-center justify-center text-2xl z-10 shadow-lg text-white">🍽️</div>
                          </div>
                      </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-blue-50 p-5 rounded-2xl border border-blue-100">
                          <h3 className="font-bold text-blue-900 mb-2">Why "Logistics" is Key</h3>
                          <p className="text-sm text-blue-800 leading-relaxed">
                              One of the biggest hurdles for local farmers is delivery. By <strong>pooling logistics</strong> (like the "Pantry" model), farmers can combine deliveries into a single route, saving fuel and time.
                          </p>
                      </div>
                      <div className="bg-orange-50 p-5 rounded-2xl border border-orange-100">
                          <h3 className="font-bold text-orange-900 mb-2">Digital Inclusion</h3>
                          <p className="text-sm text-orange-800 leading-relaxed">
                              Not every farmer is an IT expert. Platforms like this provide the <strong>digital storefront</strong> they need, so they can focus on what they do best: growing food.
                          </p>
                      </div>
                  </div>
              </div>
          )}

          {/* TAB 2: Impact Metrics */}
          {activeTab === 'impact' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right duration-500">
                  <div className="text-center mb-4">
                      <h2 className="text-xl font-bold text-stone-900">The Multiplier Effect</h2>
                      <p className="text-stone-500 text-sm">Every Euro spent locally works harder.</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white p-4 rounded-2xl shadow-sm border border-stone-200 text-center">
                          <div className="text-3xl font-bold text-green-600 mb-1">3x</div>
                          <div className="text-xs text-stone-500 uppercase font-bold tracking-wider">Economic Velocity</div>
                          <p className="text-xs text-stone-400 mt-2">Money stays in the community 3x longer.</p>
                      </div>
                      <div className="bg-white p-4 rounded-2xl shadow-sm border border-stone-200 text-center">
                          <div className="text-3xl font-bold text-green-600 mb-1">-60%</div>
                          <div className="text-xs text-stone-500 uppercase font-bold tracking-wider">Carbon Footprint</div>
                          <p className="text-xs text-stone-400 mt-2">Less travel time, less refrigeration.</p>
                      </div>
                      <div className="bg-white p-4 rounded-2xl shadow-sm border border-stone-200 text-center">
                          <div className="text-3xl font-bold text-green-600 mb-1">100%</div>
                          <div className="text-xs text-stone-500 uppercase font-bold tracking-wider">Traceability</div>
                          <p className="text-xs text-stone-400 mt-2">Know exactly who grew your food.</p>
                      </div>
                      <div className="bg-white p-4 rounded-2xl shadow-sm border border-stone-200 text-center">
                          <div className="text-3xl font-bold text-green-600 mb-1">0%</div>
                          <div className="text-xs text-stone-500 uppercase font-bold tracking-wider">Hidden Costs</div>
                          <p className="text-xs text-stone-400 mt-2">No artificial ripening or warehousing.</p>
                      </div>
                  </div>

                  <div className="bg-stone-900 text-white p-6 rounded-2xl shadow-lg mt-6 relative overflow-hidden">
                      <div className="relative z-10">
                          <h3 className="text-lg font-bold mb-2">Join the Movement</h3>
                          <p className="text-stone-300 text-sm mb-4">You aren't just buying groceries; you are funding a family, preserving land, and building a resilient future.</p>
                          <button 
                            onClick={onNavigateToMap}
                            className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-green-700 transition-colors"
                          >
                              Find a Farm Near You
                          </button>
                      </div>
                      <div className="absolute right-0 bottom-0 text-9xl opacity-10 select-none">🌱</div>
                  </div>
              </div>
          )}

          {/* TAB 3: Stories */}
          {activeTab === 'stories' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right duration-500">
                  <div className="bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden">
                      <div className="h-40 bg-purple-100 relative">
                          <img src="https://images.unsplash.com/photo-1623067140787-8d14739502b4?auto=format&fit=crop&q=80&w=600" className="w-full h-full object-cover" />
                          <div className="absolute bottom-0 left-0 bg-white/90 px-4 py-1 rounded-tr-lg font-bold text-xs text-purple-900">
                              Featured Story
                          </div>
                      </div>
                      <div className="p-6">
                          <h3 className="font-bold text-lg text-stone-900 mb-2">The Pantry Journey</h3>
                          <p className="text-stone-600 text-sm leading-relaxed mb-4">
                              "Before pooling logistics, I spent 4 hours a day driving. The 'Pantry' model changed that. We now pool deliveries with neighbors, saving fuel and time while keeping prices fair."
                          </p>
                          <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-stone-200 overflow-hidden">
                                  <img src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&q=80&w=100" />
                              </div>
                              <div>
                                  <p className="text-xs font-bold text-stone-900">Lukas M.</p>
                                  <p className="text-[10px] text-stone-500">Organic Farmer</p>
                              </div>
                          </div>
                          
                          <div className="mt-4 pt-4 border-t border-stone-100">
                              <a 
                                href="https://eu4advice.eu/empowering-local-farmers-lukas-on-pantrys-journey-and-the-future-of-short-food-supply-chain/" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="inline-flex items-center text-xs text-green-600 font-bold hover:underline"
                              >
                                  <span>Read the full story on EU4Advice</span>
                                  <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                              </a>
                          </div>
                      </div>
                  </div>

                  <div className="space-y-3">
                      <h3 className="font-bold text-stone-400 text-xs uppercase tracking-wider">More Success Stories</h3>
                      {[1, 2].map(i => (
                          <div key={i} className="bg-white p-4 rounded-xl border border-stone-100 flex gap-4 hover:shadow-md transition-shadow cursor-pointer">
                              <div className="w-16 h-16 bg-stone-100 rounded-lg overflow-hidden flex-shrink-0">
                                  <img src={`https://picsum.photos/100?random=${i}`} className="w-full h-full object-cover" />
                              </div>
                              <div>
                                  <h4 className="font-bold text-stone-800 text-sm">From Waste to Taste</h4>
                                  <p className="text-xs text-stone-500 mt-1 line-clamp-2">How the "Ugly Veg" box subscription saved 500kg of food from compost this month.</p>
                              </div>
                          </div>
                      ))}
                  </div>
              </div>
          )}
      </div>
    </div>
  );
};

export default EducationView;