import React, { useState, useEffect, useRef } from 'react';
import { Farmer, ScheduleItem } from '../../types';
import { geocodeAddress, searchAddressSuggestions } from '../../services/geocodingService';

interface SellerScheduleProps {
  farmer: Farmer;
  updateFarmer: (f: Farmer) => void;
}

const SellerSchedule: React.FC<SellerScheduleProps> = ({ farmer, updateFarmer }) => {
  // Form State
  const [day, setDay] = useState('Saturday');
  const [locationName, setLocationName] = useState('');
  const [openTime, setOpenTime] = useState('');
  const [closeTime, setCloseTime] = useState('');
  
  // Verification & Suggestion State
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifiedCoords, setVerifiedCoords] = useState<{lat: number, lng: number} | undefined>(undefined);
  const [verifiedAddressLabel, setVerifiedAddressLabel] = useState<string | null>(null);
  const [locationStatus, setLocationStatus] = useState<'idle' | 'success' | 'error'>('idle');
  
  // Autocomplete State
  const [suggestions, setSuggestions] = useState<Array<{lat: number, lng: number, display_name: string}>>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const resetForm = () => {
      setDay('Saturday');
      setLocationName('');
      setOpenTime('');
      setCloseTime('');
      setVerifiedCoords(undefined);
      setVerifiedAddressLabel(null);
      setLocationStatus('idle');
      setSuggestions([]);
      setShowSuggestions(false);
  };

  // Handle Input Change with Debounced Search
  const handleLocationInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      setLocationName(val);
      setVerifiedCoords(undefined);
      setVerifiedAddressLabel(null);
      setLocationStatus('idle');

      if (debounceRef.current) clearTimeout(debounceRef.current);

      if (val.length > 2) {
          debounceRef.current = setTimeout(async () => {
              const results = await searchAddressSuggestions(val);
              setSuggestions(results);
              setShowSuggestions(true);
          }, 300); // 300ms delay
      } else {
          setSuggestions([]);
          setShowSuggestions(false);
      }
  };

  const handleSelectSuggestion = (suggestion: {lat: number, lng: number, display_name: string}) => {
      setLocationName(suggestion.display_name);
      setVerifiedCoords({ lat: suggestion.lat, lng: suggestion.lng });
      setVerifiedAddressLabel(suggestion.display_name);
      setLocationStatus('success');
      setShowSuggestions(false);
      setSuggestions([]);
  };

  // Manual Check Button logic
  const handleVerifyLocation = async () => {
      if (!locationName.trim()) return;
      
      setIsVerifying(true);
      setLocationStatus('idle');
      setShowSuggestions(false); // Hide suggestions when manually checking
      
      const result = await geocodeAddress(locationName);
      
      setIsVerifying(false);
      
      if (result) {
          // If the API changed the name slightly (formatting), we update it to show we understood
          // But we keep user input if it's very different to avoid confusion, storing the formal address in verifiedAddressLabel
          setVerifiedCoords({ lat: result.lat, lng: result.lng });
          setVerifiedAddressLabel(result.display_name);
          setLocationStatus('success');
      } else {
          setVerifiedCoords(undefined);
          setVerifiedAddressLabel(null);
          setLocationStatus('error');
      }
  };

  const handleUseFarmLocation = () => {
      setLocationName(farmer.location.address);
      setVerifiedCoords({ lat: farmer.location.lat, lng: farmer.location.lng });
      setVerifiedAddressLabel("Farm Location (Verified)");
      setLocationStatus('success');
      setShowSuggestions(false);
  };

  const handleAddSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (day && locationName && openTime && closeTime) {
      const newItem: ScheduleItem = {
        id: Date.now().toString(),
        day,
        location: locationName,
        openTime,
        closeTime,
        coordinates: verifiedCoords
      };
      updateFarmer({ ...farmer, schedule: [...farmer.schedule, newItem] });
      resetForm();
    }
  };

  const handleRemoveSchedule = (id: string) => {
      updateFarmer({ ...farmer, schedule: farmer.schedule.filter(s => s.id !== id) });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-6">
      <h3 className="text-lg font-bold text-stone-800 mb-2">Market & Farm Schedule</h3>
      <p className="text-stone-500 text-sm mb-6">Manage your weekly availability and locations.</p>
      
      <div className="space-y-4 mb-8">
        {farmer.schedule.map(item => (
          <div key={item.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-stone-200 rounded-lg hover:border-green-300 transition-colors group">
            <div>
              <span className="font-bold text-stone-800 block">{item.day}</span>
              <div className="flex items-center gap-2">
                 <span className="text-green-700 font-medium truncate max-w-[200px] sm:max-w-xs">{item.location}</span>
                 {item.coordinates && (
                     <span className="text-[10px] bg-green-50 text-green-600 px-1.5 py-0.5 rounded border border-green-100 flex-shrink-0" title="Location Verified">✓ Map Ready</span>
                 )}
              </div>
            </div>
            <div className="flex items-center gap-4 mt-2 sm:mt-0">
              <span className="text-stone-500 bg-stone-100 px-3 py-1 rounded-full text-sm">
                {item.openTime} - {item.closeTime}
              </span>
              <button 
                onClick={() => handleRemoveSchedule(item.id)}
                className="p-1 text-stone-400 hover:text-red-500 transition-colors"
                title="Remove schedule item"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
              </button>
            </div>
          </div>
        ))}
        {farmer.schedule.length === 0 && (
            <div className="text-center py-6 bg-stone-50 rounded-lg border border-dashed border-stone-300 text-stone-500">
                No schedule items added yet.
            </div>
        )}
      </div>

      <h4 className="text-sm font-bold text-stone-500 uppercase tracking-wider mb-4 pt-4 border-t border-stone-100">Add Schedule Item</h4>
      <form onSubmit={handleAddSchedule} className="grid grid-cols-1 md:grid-cols-12 gap-4">
        
        {/* Day Selection */}
        <div className="md:col-span-3">
            <label className="block text-xs font-medium text-stone-500 mb-1">Day</label>
            <select 
                value={day} 
                onChange={e => setDay(e.target.value)}
                className="w-full bg-white text-stone-900 rounded-lg border border-stone-300 focus:ring-green-500 focus:border-green-500 shadow-sm p-2.5" 
                required
            >
                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(d => (
                    <option key={d} value={d}>{d}</option>
                ))}
            </select>
        </div>

        {/* Location Input with Autocomplete */}
        <div className="md:col-span-9 grid grid-cols-1 sm:grid-cols-[1fr,auto] gap-2 items-end">
            <div className="relative z-20">
                <label className="block text-xs font-medium text-stone-500 mb-1">
                    Location Address
                    <button 
                        type="button" 
                        onClick={handleUseFarmLocation}
                        className="ml-2 text-green-600 hover:underline cursor-pointer"
                    >
                        (Use Farm Address)
                    </button>
                </label>
                
                <input 
                    value={locationName} 
                    onChange={handleLocationInputChange}
                    onFocus={() => { if(suggestions.length > 0) setShowSuggestions(true); }}
                    // We delay blur slightly so onClick on suggestions fires first
                    onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                    placeholder="e.g. 123 Market St, City" 
                    className={`w-full bg-white text-stone-900 rounded-lg border shadow-sm focus:ring-green-500 focus:border-green-500 p-2.5 pr-10 ${
                        locationStatus === 'success' ? 'border-green-500 ring-1 ring-green-500' : 
                        locationStatus === 'error' ? 'border-amber-300' : 
                        'border-stone-300'
                    }`} 
                    required 
                    autoComplete="off"
                />

                {/* Status Indicator Icon in Input */}
                <div className="absolute right-3 top-[34px] pointer-events-none">
                    {isVerifying && <svg className="animate-spin h-4 w-4 text-stone-400" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>}
                    {!isVerifying && locationStatus === 'success' && <span className="text-green-500 font-bold">✓</span>}
                    {!isVerifying && locationStatus === 'error' && <span className="text-amber-400 font-bold" title="Address not found">?</span>}
                </div>

                {/* Autocomplete Dropdown */}
                {showSuggestions && suggestions.length > 0 && (
                    <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-stone-200 rounded-lg shadow-xl max-h-60 overflow-y-auto z-50">
                        {suggestions.map((s, idx) => (
                            <div 
                                key={idx}
                                onMouseDown={() => handleSelectSuggestion(s)} // MouseDown fires before Blur
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
                className="bg-stone-100 text-stone-600 border border-stone-200 px-3 py-2.5 rounded-lg hover:bg-stone-200 transition-colors text-sm font-medium h-[42px] whitespace-nowrap disabled:opacity-50"
            >
                {isVerifying ? 'Checking...' : 'Check Map'}
            </button>
        </div>

        {/* Validation Message Area */}
        {locationStatus === 'success' && verifiedAddressLabel && (
            <div className="md:col-span-12 text-xs text-green-600 flex items-center gap-1 -mt-2">
                <span>📍 Verified: {verifiedAddressLabel}</span>
            </div>
        )}
        {locationStatus === 'error' && (
             <div className="md:col-span-12 text-xs text-amber-600 flex items-center gap-1 -mt-2">
                <span>⚠️ Could not find exact location on the map. Please select a suggestion or try a clearer address.</span>
            </div>
        )}

        {/* Times */}
        <div className="md:col-span-2">
            <label className="block text-xs font-medium text-stone-500 mb-1">Open</label>
            <input 
                type="time" 
                value={openTime}
                onChange={e => setOpenTime(e.target.value)}
                className="w-full bg-white text-stone-900 rounded-lg border border-stone-300 focus:ring-green-500 focus:border-green-500 shadow-sm p-2.5" 
                required 
            />
        </div>
        <div className="md:col-span-2">
            <label className="block text-xs font-medium text-stone-500 mb-1">Close</label>
            <input 
                type="time" 
                value={closeTime}
                onChange={e => setCloseTime(e.target.value)}
                className="w-full bg-white text-stone-900 rounded-lg border border-stone-300 focus:ring-green-500 focus:border-green-500 shadow-sm p-2.5" 
                required 
            />
        </div>
        
        {/* Spacer to push button to right on desktop */}
        <div className="hidden md:block md:col-span-5"></div>

        <div className="md:col-span-3 flex items-end">
            <button type="submit" className="w-full bg-green-600 text-white p-2.5 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center font-bold shadow-sm">
                <span className="mr-2">+</span> Add to Schedule
            </button>
        </div>
      </form>
    </div>
  );
};

export default SellerSchedule;