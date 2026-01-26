import React, { useEffect, useRef } from 'react';
import { Farmer, Coordinates } from '../../types';

interface MapViewProps {
    userLocation: Coordinates | null;
    registeredFarmers: Farmer[];
    onSelectFarm: (farmer: Farmer) => void;
}

export const MapView: React.FC<MapViewProps> = ({ userLocation, registeredFarmers, onSelectFarm }) => {
    const mapContainer = useRef<HTMLDivElement>(null);
    const mapInstance = useRef<any>(null);

    useEffect(() => {
        if (!mapContainer.current) return;
        // If map already exists, just resize it
        if (mapInstance.current) {
            mapInstance.current.invalidateSize();
            return;
        }

        const L = (window as any).L;
        if (!L) return;

        const initialLat = userLocation?.latitude || 50.8514;
        const initialLng = userLocation?.longitude || 5.6910;

        const map = L.map(mapContainer.current, { zoomControl: false }).setView([initialLat, initialLng], 13);
        
        L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
            maxZoom: 20
        }).addTo(map);

        L.control.zoom({ position: 'bottomright' }).addTo(map);

        if (userLocation) {
             const userIcon = L.divIcon({
                className: 'custom-user-marker',
                html: `<div style="background-color: #3b82f6; width: 16px; height: 16px; border-radius: 50%; border: 3px solid white; box-shadow: 0 4px 6px rgba(0,0,0,0.2);"></div>`,
                iconSize: [16, 16],
                iconAnchor: [8, 8]
            });
            L.marker([userLocation.latitude, userLocation.longitude], { icon: userIcon }).addTo(map);
        }

        registeredFarmers.forEach(farmer => {
            const farmIcon = L.divIcon({
                className: 'custom-farm-marker',
                html: `<div style="background-color: #166534; width: 32px; height: 32px; border-radius: 50% 50% 50% 0; border: 2px solid white; transform: rotate(-45deg); display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 6px rgba(0,0,0,0.3); transition: transform 0.2s;"><span style="transform: rotate(45deg); color: white; font-size: 16px;">🌱</span></div>`,
                iconSize: [32, 32],
                iconAnchor: [16, 32],
                popupAnchor: [0, -32]
            });

            L.marker([farmer.location.lat, farmer.location.lng], { icon: farmIcon })
                .addTo(map)
                .on('click', () => {
                    onSelectFarm(farmer);
                });
        });

        mapInstance.current = map;
        
        // Force resize calculation
        setTimeout(() => {
            map.invalidateSize();
        }, 100);

        // Cleanup function for when this component unmounts (tab switch)
        return () => {
            if (mapInstance.current) {
                mapInstance.current.remove();
                mapInstance.current = null;
            }
        };
    }, [userLocation, registeredFarmers, onSelectFarm]);

    return <div ref={mapContainer} className="h-full w-full z-0" />;
};

export const MapOverlay: React.FC<{
  selectedFarm: Farmer | null;
  onClose: () => void;
  onMessage: (farmerId: string) => void;
  onVisitStore: (farmer: Farmer) => void;
}> = ({ selectedFarm, onClose, onMessage, onVisitStore }) => {
  if (!selectedFarm) return null;
  
  return (
    <div className="absolute bottom-0 left-0 right-0 sm:bottom-8 sm:left-8 sm:right-auto sm:w-96 bg-white sm:rounded-3xl shadow-2xl z-[1000] flex flex-col max-h-[85vh] sm:max-h-[80vh] animate-in slide-in-from-bottom-10 fade-in duration-300 overflow-hidden border border-stone-100 ring-1 ring-black/5">
      
      {/* Hero Image Section */}
      <div className="relative h-44 bg-stone-200 flex-shrink-0">
        <img src={selectedFarm.image} alt={selectedFarm.farmName} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
        
        <button 
          onClick={(e) => { e.stopPropagation(); onClose(); }}
          className="absolute top-4 right-4 p-2 bg-white/20 backdrop-blur-md rounded-full hover:bg-white/40 text-white transition-colors"
        >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>

        <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
            <h3 className="font-bold text-2xl leading-tight shadow-sm">{selectedFarm.farmName}</h3>
             <div className="flex items-center gap-2 text-sm text-stone-200 mt-1">
                <span className="text-amber-400 font-bold flex items-center gap-1">★ {selectedFarm.rating}</span>
                <span>•</span>
                <span className="truncate opacity-90">{selectedFarm.location.address}</span>
            </div>
        </div>
      </div>

      {/* Content Scroll Area */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-6 bg-white">
          
          {/* Status & Badges */}
          <div className="flex flex-wrap items-center gap-2 mb-6">
             <span className={`text-xs font-bold px-3 py-1 rounded-full border ${selectedFarm.isOpenNow ? 'bg-green-50 text-green-700 border-green-100' : 'bg-red-50 text-red-700 border-red-100'}`}>
                  {selectedFarm.isOpenNow ? '● Open Now' : '○ Closed'}
              </span>
              {selectedFarm.badges?.map((b,i) => (
                  <span key={i} className="text-xs bg-stone-50 text-stone-600 px-3 py-1 rounded-full border border-stone-200 font-medium">{b}</span>
              ))}
          </div>

          <div className="mb-8">
             <p className="text-stone-600 leading-relaxed text-sm">{selectedFarm.description}</p>
          </div>

          {/* Schedule */}
           <div className="mb-4">
             <h4 className="font-bold text-stone-900 text-sm mb-3 flex items-center gap-2">
                 <svg className="w-4 h-4 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                 Opening Hours
             </h4>
             <div className="bg-stone-50 rounded-xl p-4 border border-stone-100 space-y-3">
                {selectedFarm.schedule && selectedFarm.schedule.length > 0 ? (
                     selectedFarm.schedule.map((item, idx) => (
                         <div key={idx} className="flex justify-between items-center text-sm">
                             <span className="font-medium text-stone-600">{item.day}</span>
                             <div className="text-right">
                                 <span className="block text-stone-900 font-bold">{item.openTime} - {item.closeTime}</span>
                                 <span className="block text-[10px] text-stone-500 uppercase tracking-wide">{item.location}</span>
                             </div>
                         </div>
                     ))
                 ) : (
                     <p className="text-sm text-stone-400 italic text-center py-2">No specific hours listed.</p>
                 )}
             </div>
          </div>
      </div>

       {/* Sticky Bottom Actions */}
       <div className="p-4 border-t border-stone-100 bg-white grid grid-cols-2 gap-3 safe-area-bottom flex-shrink-0 z-10">
            <button 
                onClick={(e) => {
                   e.stopPropagation();
                   if (selectedFarm) onVisitStore(selectedFarm);
                }}
                className="flex items-center justify-center gap-2 py-3.5 rounded-xl bg-green-700 text-white font-bold hover:bg-green-800 shadow-lg shadow-green-100 transition-transform active:scale-95"
            >
                Visit Store
            </button>
            <button 
                onClick={(e) => {
                   e.stopPropagation();
                   onMessage(selectedFarm.id);
                }}
                className="flex items-center justify-center gap-2 py-3.5 rounded-xl border-2 border-stone-100 text-stone-700 font-bold hover:bg-stone-50 hover:border-stone-200 transition-colors"
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                Message
            </button>
       </div>
    </div>
  )
};