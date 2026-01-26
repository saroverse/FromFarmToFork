import React, { useState, useEffect, useRef } from 'react';
import { Farmer } from '../../types';
import { generateFarmDescription } from '../../services/geminiService';
import { geocodeAddress, searchAddressSuggestions } from '../../services/geocodingService';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { useData } from '../../contexts/DataContext';

interface SellerOverviewProps {
  farmer: Farmer;
  updateFarmer: (f: Farmer) => void;
}

const SellerOverview: React.FC<SellerOverviewProps> = ({ farmer, updateFarmer }) => {
  const { farmers } = useData(); // Access other farmers for collaboration
  const [draftProfile, setDraftProfile] = useState({
    farmName: farmer.farmName,
    name: farmer.name,
    address: farmer.location.address,
    description: farmer.description
  });
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [isGeneratingBio, setIsGeneratingBio] = useState(false);
  const [collabRequests, setCollabRequests] = useState<string[]>([]);

  // Address Verification & Autocomplete State
  const [suggestions, setSuggestions] = useState<Array<{lat: number, lng: number, display_name: string}>>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifiedCoords, setVerifiedCoords] = useState<{lat: number, lng: number} | null>(null);
  const [locationStatus, setLocationStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  // Field Data Simulation
  const [fieldSegments] = useState(() => 
     Array.from({ length: 24 }).map((_, i) => ({
        id: i,
        moisture: Math.floor(Math.random() * (78 - 45) + 45), // Random 45-78%
        temp: Math.floor(Math.random() * 5) + 18, // 18-23C
     }))
  );

  useEffect(() => {
    setDraftProfile({
        farmName: farmer.farmName,
        name: farmer.name,
        address: farmer.location.address,
        description: farmer.description
    });
    // Reset verification state when farmer prop updates (e.g. initial load)
    setLocationStatus('idle');
    setVerifiedCoords(null);
  }, [farmer]);

  // Handle Address Input with Autocomplete
  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      setDraftProfile(prev => ({...prev, address: val}));
      
      // Reset verification when user types
      setVerifiedCoords(null);
      setLocationStatus('idle');

      if (debounceRef.current) clearTimeout(debounceRef.current);

      if (val.length > 2) {
          debounceRef.current = setTimeout(async () => {
              const results = await searchAddressSuggestions(val);
              setSuggestions(results);
              setShowSuggestions(true);
          }, 300);
      } else {
          setSuggestions([]);
          setShowSuggestions(false);
      }
  };

  const handleSelectSuggestion = (suggestion: {lat: number, lng: number, display_name: string}) => {
      setDraftProfile(prev => ({...prev, address: suggestion.display_name}));
      setVerifiedCoords({ lat: suggestion.lat, lng: suggestion.lng });
      setLocationStatus('success');
      setShowSuggestions(false);
      setSuggestions([]);
  };

  const handleVerifyLocation = async () => {
      if (!draftProfile.address.trim()) return;
      
      setIsVerifying(true);
      setLocationStatus('idle');
      setShowSuggestions(false);
      
      const result = await geocodeAddress(draftProfile.address);
      
      setIsVerifying(false);
      
      if (result) {
          setVerifiedCoords({ lat: result.lat, lng: result.lng });
          setLocationStatus('success');
      } else {
          setVerifiedCoords(null);
          setLocationStatus('error');
      }
  };

  const handleSaveProfile = async () => {
    setSaveStatus('saving');

    try {
        let newLocation = { ...farmer.location, address: draftProfile.address };
        
        // Logic: Use verified coords if available. 
        // If not, but address changed, try to geocode one last time.
        if (verifiedCoords) {
             newLocation = { ...verifiedCoords, address: draftProfile.address };
        } else if (draftProfile.address !== farmer.location.address) {
             const coords = await geocodeAddress(draftProfile.address);
             if (coords) {
                newLocation = { ...coords, address: draftProfile.address };
             }
        }

        updateFarmer({
            ...farmer,
            farmName: draftProfile.farmName,
            name: draftProfile.name,
            location: newLocation,
            description: draftProfile.description
        });
        
        setSaveStatus('saved');
        setTimeout(() => setSaveStatus('idle'), 2000);
    } catch (e) {
        setSaveStatus('error');
        setTimeout(() => setSaveStatus('idle'), 3000);
    }
  };

  const handleGenerateBio = async () => {
    setIsGeneratingBio(true);
    const productsList = farmer.products.map(p => p.name);
    const newDesc = await generateFarmDescription(draftProfile.farmName, productsList);
    setDraftProfile(prev => ({ ...prev, description: newDesc }));
    setIsGeneratingBio(false);
  };

  const handleCollab = (id: string) => {
    setCollabRequests(prev => [...prev, id]);
  };

  const salesData = [
    { name: 'Mon', sales: 120 },
    { name: 'Tue', sales: 150 },
    { name: 'Wed', sales: 180 },
    { name: 'Thu', sales: 100 },
    { name: 'Fri', sales: 240 },
    { name: 'Sat', sales: 400 },
    { name: 'Sun', sales: 320 },
  ];

  const otherFarms = farmers.filter(f => f.id !== farmer.id);

  const avgMoisture = Math.floor(fieldSegments.reduce((acc, curr) => acc + curr.moisture, 0) / fieldSegments.length);

  return (
    <div className="space-y-8">
      {/* --- SECTION 1: Profile & Settings --- */}
      <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-6">
        <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-stone-800">Farm Details</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Farm Name</label>
                <input 
                    type="text" 
                    value={draftProfile.farmName}
                    onChange={(e) => setDraftProfile({...draftProfile, farmName: e.target.value})}
                    className="w-full bg-white text-stone-900 rounded-lg border border-stone-300 shadow-sm focus:ring-green-500 focus:border-green-500 p-2.5"
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Owner Name</label>
                <input 
                    type="text" 
                    value={draftProfile.name}
                    onChange={(e) => setDraftProfile({...draftProfile, name: e.target.value})}
                    className="w-full bg-white text-stone-900 rounded-lg border border-stone-300 shadow-sm focus:ring-green-500 focus:border-green-500 p-2.5"
                />
            </div>
            
            {/* Address Input with Autocomplete & Verification */}
            <div className="md:col-span-2">
                <label className="block text-sm font-medium text-stone-700 mb-1">Address / Main Location</label>
                <div className="grid grid-cols-[1fr,auto] gap-2 items-start relative z-20">
                    <div className="relative">
                        <input 
                            type="text" 
                            value={draftProfile.address}
                            onChange={handleAddressChange}
                            onFocus={() => { if(suggestions.length > 0) setShowSuggestions(true); }}
                            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                            className={`w-full bg-white text-stone-900 rounded-lg border shadow-sm focus:ring-green-500 focus:border-green-500 p-2.5 pr-10 ${
                                locationStatus === 'success' ? 'border-green-500 ring-1 ring-green-500' : 
                                locationStatus === 'error' ? 'border-amber-300' : 
                                'border-stone-300'
                            }`}
                            placeholder="e.g. 123 Farm Lane, City, Country"
                            autoComplete="off"
                        />
                        
                         {/* Status Indicator Icon in Input */}
                        <div className="absolute right-3 top-[11px] pointer-events-none">
                            {isVerifying && <svg className="animate-spin h-5 w-5 text-stone-400" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>}
                            {!isVerifying && locationStatus === 'success' && <span className="text-green-500 font-bold">✓</span>}
                            {!isVerifying && locationStatus === 'error' && <span className="text-amber-400 font-bold" title="Address not found">?</span>}
                        </div>

                         {/* Autocomplete Dropdown */}
                        {showSuggestions && suggestions.length > 0 && (
                            <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-stone-200 rounded-lg shadow-xl max-h-60 overflow-y-auto z-50">
                                {suggestions.map((s, idx) => (
                                    <div 
                                        key={idx}
                                        onMouseDown={() => handleSelectSuggestion(s)}
                                        className="p-3 hover:bg-green-50 cursor-pointer border-b border-stone-100 last:border-0 text-sm text-stone-700"
                                    >
                                        {s.display_name}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <button 
                        type="button"
                        onClick={handleVerifyLocation}
                        disabled={isVerifying}
                        className="bg-stone-100 text-stone-600 border border-stone-200 px-4 py-2.5 rounded-lg hover:bg-stone-200 transition-colors text-sm font-medium h-[42px] whitespace-nowrap disabled:opacity-50"
                    >
                        {isVerifying ? 'Checking...' : 'Check Map'}
                    </button>
                </div>

                {locationStatus === 'success' && (
                     <p className="text-xs mt-1 text-green-600 flex items-center gap-1">
                        <span>📍 Location confirmed on map.</span>
                     </p>
                )}
                {locationStatus === 'error' && (
                     <p className="text-xs mt-1 text-amber-600">
                        ⚠️ Address not found. Please try a more specific address or select a suggestion.
                     </p>
                )}
            </div>
        </div>

        <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium text-stone-700">Bio / Description</label>
            <button 
            onClick={handleGenerateBio}
            disabled={isGeneratingBio}
            className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full hover:bg-purple-200 transition-colors flex items-center gap-1"
            >
            {isGeneratingBio ? 'Generating...' : '✨ Enhance with AI'}
            </button>
        </div>
        <textarea
            className="w-full bg-white text-stone-900 border border-stone-300 rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500 p-2.5"
            rows={4}
            value={draftProfile.description}
            onChange={(e) => setDraftProfile({...draftProfile, description: e.target.value})}
        />

        <div className="mt-6 flex justify-end">
            <button
                onClick={handleSaveProfile}
                disabled={saveStatus === 'saving'}
                className={`px-6 py-2.5 rounded-lg font-medium text-white transition-all duration-200 flex items-center gap-2 ${
                    saveStatus === 'saved' 
                    ? 'bg-green-600' 
                    : saveStatus === 'error'
                    ? 'bg-red-600'
                    : 'bg-stone-800 hover:bg-stone-900'
                }`}
            >
                {saveStatus === 'idle' && (
                    <>
                        <span>Save Changes</span>
                    </>
                )}
                {saveStatus === 'saving' && (
                    <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                        Saving...
                    </>
                )}
                {saveStatus === 'saved' && (
                    <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                        Saved!
                    </>
                )}
                {saveStatus === 'error' && (
                        <>Error Saving</>
                )}
            </button>
        </div>
        </div>

      {/* --- SECTION 2: SMART FARM --- */}
      <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-6 overflow-hidden">
        <h3 className="text-xl font-bold text-stone-800 mb-6 flex items-center gap-2">
            <span className="bg-purple-100 text-purple-700 p-1.5 rounded-lg text-lg">🛰️</span> 
            Your Smart Farm
        </h3>

        {/* Moisture Analytics Dashboard */}
        <div className="mb-8 rounded-xl overflow-hidden border border-stone-200 bg-stone-900 text-white shadow-lg">
            <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Left: The Visual Map */}
                <div className="lg:col-span-2">
                    <div className="flex justify-between items-end mb-4">
                        <div>
                            <h4 className="font-bold text-lg flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                                Live Soil Moisture Map
                            </h4>
                            <p className="text-stone-400 text-sm">Field A • Sensor Array Gen-2</p>
                        </div>
                        <div className="flex gap-3 text-xs font-medium">
                            <div className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-amber-500"></span> Dry (&lt;50%)</div>
                            <div className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-green-500"></span> Optimal</div>
                            <div className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-blue-500"></span> Wet (&gt;72%)</div>
                        </div>
                    </div>

                    {/* The Grid Visualization */}
                    <div className="grid grid-cols-8 gap-1.5 aspect-[2.5/1] sm:aspect-[3/1] lg:aspect-[2.2/1] w-full bg-stone-800/50 p-2 rounded-lg border border-stone-700/50">
                        {fieldSegments.map((seg) => {
                             let colorClass = 'bg-green-500';
                             if (seg.moisture < 55) colorClass = 'bg-amber-500';
                             else if (seg.moisture > 72) colorClass = 'bg-blue-500';
                             
                             return (
                                 <div 
                                    key={seg.id} 
                                    className={`${colorClass} rounded-sm opacity-80 hover:opacity-100 transition-all cursor-pointer relative group`}
                                 >
                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 font-bold text-xs text-white drop-shadow-md select-none">
                                        {seg.moisture}%
                                    </div>
                                 </div>
                             )
                        })}
                    </div>
                </div>

                {/* Right: Statistics Panel */}
                <div className="flex flex-col justify-center space-y-6 border-l border-stone-700/50 pl-0 lg:pl-8 pt-4 lg:pt-0">
                    <div>
                        <span className="text-stone-400 text-xs uppercase tracking-wider font-bold">Average Moisture</span>
                        <div className="text-4xl font-bold text-white mt-1">
                            {avgMoisture}% <span className="text-sm font-normal text-green-400 ml-1">Optimal</span>
                        </div>
                    </div>

                    <div className="space-y-4">
                         <div>
                            <div className="flex justify-between text-sm mb-1">
                                <span className="text-stone-300">Irrigation Status</span>
                                <span className="text-blue-400 font-bold">Active</span>
                            </div>
                            <div className="w-full bg-stone-700 rounded-full h-2 overflow-hidden">
                                <div className="bg-blue-500 h-full w-2/3 animate-pulse"></div>
                            </div>
                            <p className="text-[10px] text-stone-500 mt-1">Pump B running • 25 mins remaining</p>
                         </div>

                         <div className="grid grid-cols-2 gap-4 pt-2">
                             <div className="bg-stone-800 p-3 rounded-lg border border-stone-700">
                                 <div className="text-stone-400 text-[10px] uppercase font-bold">Soil Temp</div>
                                 <div className="text-xl font-bold">18°C</div>
                             </div>
                             <div className="bg-stone-800 p-3 rounded-lg border border-stone-700">
                                 <div className="text-stone-400 text-[10px] uppercase font-bold">pH Level</div>
                                 <div className="text-xl font-bold">6.8</div>
                             </div>
                         </div>
                    </div>
                    
                    <button className="w-full py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm font-bold transition-colors flex items-center justify-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                        Detailed Analytics
                    </button>
                </div>
            </div>
        </div>

        {/* Analytics & Insights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
             {/* 1. Analytics Button/Card */}
             <button className="bg-stone-50 p-5 rounded-xl border border-stone-200 hover:border-green-300 hover:shadow-md transition-all text-left group">
                 <div className="text-3xl mb-2 group-hover:scale-110 transition-transform origin-left">📊</div>
                 <h4 className="font-bold text-stone-800">Your Analytics</h4>
                 <p className="text-xs text-stone-500 mt-1">View historical yield data & sales trends.</p>
             </button>

             {/* 2. Expected Demand */}
             <div className="bg-blue-50 p-5 rounded-xl border border-blue-100 flex flex-col justify-between">
                 <div>
                    <div className="flex justify-between items-start mb-1">
                        <span className="text-2xl">📈</span>
                        <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-bold uppercase">Forecast</span>
                    </div>
                    <h4 className="font-bold text-blue-900">Demand Next Season</h4>
                 </div>
                 <div className="mt-3 text-xs text-blue-800 space-y-1 font-medium">
                     <p>⬆️ High demand for <span className="underline">Kale</span></p>
                     <p>⬇️ Lower demand for <span className="underline">Turnips</span></p>
                 </div>
             </div>

             {/* 3. AI Recommendations */}
             <div className="bg-purple-50 p-5 rounded-xl border border-purple-100 flex flex-col justify-between col-span-1 md:col-span-2 lg:col-span-1">
                 <div>
                    <div className="flex justify-between items-start mb-1">
                        <span className="text-2xl">🤖</span>
                        <span className="text-[10px] bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-bold uppercase">AI Insight</span>
                    </div>
                    <h4 className="font-bold text-purple-900">Next Season Plan</h4>
                 </div>
                 <div className="mt-3 text-xs text-purple-800 bg-white/50 p-2 rounded-lg border border-purple-100">
                     "Plant <span className="font-bold">15% less carrots</span> and <span className="font-bold">10% more cabbage</span> based on regional trends."
                 </div>
             </div>

             {/* 4. Sustainability Metrics */}
             <button className="bg-green-50 p-5 rounded-xl border border-green-100 hover:border-green-300 hover:shadow-md transition-all text-left flex flex-col justify-between">
                 <div className="flex justify-between items-start">
                     <span className="text-3xl">🌍</span>
                     <span className="text-green-600 font-bold text-xs">Saved Metrics</span>
                 </div>
                 <div className="mt-3 grid grid-cols-3 gap-1 text-center">
                     <div>
                         <div className="font-bold text-green-800">CO₂</div>
                         <div className="text-[10px] text-green-600">-120kg</div>
                     </div>
                     <div>
                         <div className="font-bold text-blue-800">H₂O</div>
                         <div className="text-[10px] text-blue-600">-5k L</div>
                     </div>
                     <div>
                         <div className="font-bold text-amber-800">Waste</div>
                         <div className="text-[10px] text-amber-600">-15%</div>
                     </div>
                 </div>
             </button>
        </div>

        {/* Data Collaboration Section */}
        <div className="border-t border-stone-100 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-6 gap-4">
                <div>
                    <h4 className="font-bold text-lg text-stone-800 flex items-center gap-2">
                        <span>🤝</span> Farm Collaboration Network
                    </h4>
                    <p className="text-sm text-stone-500 mt-2 max-w-xl leading-relaxed">
                        You can share <span className="font-bold text-stone-700">anonymized data</span> (soil health, pest patterns, yield rates) with other farms to improve regional prediction models without revealing trade secrets.
                    </p>
                </div>
                <button className="bg-stone-100 text-stone-600 px-4 py-2 rounded-lg text-xs font-bold hover:bg-stone-200 transition-colors">
                    Review Privacy Policy
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {otherFarms.slice(0, 4).map(other => {
                    const isRequested = collabRequests.includes(other.id);
                    return (
                        <div key={other.id} className="flex items-center justify-between p-4 rounded-xl border border-stone-200 hover:border-green-300 transition-colors bg-stone-50/50">
                            <div className="flex items-center gap-3">
                                <img src={other.image} alt={other.farmName} className="w-10 h-10 rounded-full object-cover bg-stone-200" />
                                <div>
                                    <h5 className="font-bold text-sm text-stone-900">{other.farmName}</h5>
                                    <p className="text-[10px] text-stone-500">{other.location.address.split(',')[0]}</p>
                                </div>
                            </div>
                            <button 
                                onClick={() => handleCollab(other.id)}
                                disabled={isRequested}
                                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                                    isRequested 
                                    ? 'bg-green-100 text-green-700 cursor-default' 
                                    : 'bg-stone-900 text-white hover:bg-green-600 shadow-sm'
                                }`}
                            >
                                {isRequested ? 'Request Sent' : 'Collab'}
                            </button>
                        </div>
                    );
                })}
                {otherFarms.length === 0 && (
                    <div className="col-span-full text-center py-8 text-stone-400 text-sm italic">
                        No other farms found nearby for collaboration.
                    </div>
                )}
            </div>
        </div>

      </div>

      {/* --- SECTION 3: Sales Overview (Existing) --- */}
      <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-6">
        <h3 className="text-lg font-bold text-stone-800 mb-6">Weekly Sales Overview</h3>
        <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
            <BarChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6b7280'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#6b7280'}} />
                <Tooltip 
                contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                cursor={{fill: '#f3f4f6'}}
                />
                <Bar dataKey="sales" fill="#166534" radius={[4, 4, 0, 0]} />
            </BarChart>
            </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default SellerOverview;