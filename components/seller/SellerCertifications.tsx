import React, { useState } from 'react';
import { Farmer, Certification } from '../../types';

interface SellerCertificationsProps {
  farmer: Farmer;
  updateFarmer: (f: Farmer) => void;
}

const SellerCertifications: React.FC<SellerCertificationsProps> = ({ farmer, updateFarmer }) => {
  const [newCertName, setNewCertName] = useState('');
  const [newCertIssuer, setNewCertIssuer] = useState('');
  const [newCertYear, setNewCertYear] = useState('');
  const [newCertImage, setNewCertImage] = useState<string>('');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewCertImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddCertification = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCertName && newCertIssuer && newCertYear) {
      const newCert: Certification = {
        id: Date.now().toString(),
        name: newCertName,
        issuer: newCertIssuer,
        year: newCertYear,
        image: newCertImage
      };
      const currentCerts = farmer.certifications || [];
      updateFarmer({ ...farmer, certifications: [...currentCerts, newCert] });
      
      // Reset form
      setNewCertName('');
      setNewCertIssuer('');
      setNewCertYear('');
      setNewCertImage('');
    }
  };

  const handleDeleteCertification = (id: string) => {
    const currentCerts = farmer.certifications || [];
    updateFarmer({ ...farmer, certifications: currentCerts.filter(c => c.id !== id) });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-6">
       <h3 className="text-lg font-bold text-stone-800 mb-2">Certifications & Awards</h3>
       <p className="text-stone-500 text-sm mb-6">Showcase your sustainable practices and achievements to buyers.</p>

       <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
         {farmer.certifications?.map(cert => (
           <div key={cert.id} className="relative bg-stone-50 border border-stone-200 rounded-lg p-4 flex gap-4 items-start group hover:border-green-300 transition-colors">
             <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center border border-stone-100 flex-shrink-0">
               {cert.image ? (
                 <img src={cert.image} alt="" className="w-10 h-10 rounded-full object-cover" />
               ) : (
                 <span className="text-2xl">🏅</span>
               )}
             </div>
             <div className="flex-1">
               <h4 className="font-bold text-stone-800 leading-tight">{cert.name}</h4>
               <p className="text-xs text-stone-500 mt-1">{cert.issuer} • {cert.year}</p>
             </div>
             <button 
               onClick={() => handleDeleteCertification(cert.id)}
               className="text-stone-300 hover:text-red-500 transition-colors"
             >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
             </button>
           </div>
         ))}
         {(!farmer.certifications || farmer.certifications.length === 0) && (
            <div className="col-span-full text-center py-8 text-stone-400 italic">
              No certifications uploaded yet.
            </div>
         )}
       </div>

       <h4 className="text-sm font-bold text-stone-500 uppercase tracking-wider mb-4 pt-4 border-t border-stone-100">Upload New</h4>
       <form onSubmit={handleAddCertification} className="grid grid-cols-1 md:grid-cols-2 gap-4">
         <div>
            <label className="block text-xs font-medium text-stone-500 mb-1">Certification / Award Name</label>
            <input 
              value={newCertName}
              onChange={(e) => setNewCertName(e.target.value)}
              placeholder="e.g. USDA Organic"
              required
              className="w-full bg-white text-stone-900 rounded-lg border border-stone-300 focus:ring-green-500 focus:border-green-500 px-3 py-2 shadow-sm"
            />
         </div>
         <div>
            <label className="block text-xs font-medium text-stone-500 mb-1">Issuing Organization</label>
            <input 
              value={newCertIssuer}
              onChange={(e) => setNewCertIssuer(e.target.value)}
              placeholder="e.g. Dept of Agriculture"
              required
              className="w-full bg-white text-stone-900 rounded-lg border border-stone-300 focus:ring-green-500 focus:border-green-500 px-3 py-2 shadow-sm"
            />
         </div>
         <div>
            <label className="block text-xs font-medium text-stone-500 mb-1">Year</label>
            <input 
              value={newCertYear}
              onChange={(e) => setNewCertYear(e.target.value)}
              placeholder="e.g. 2024"
              required
              className="w-full bg-white text-stone-900 rounded-lg border border-stone-300 focus:ring-green-500 focus:border-green-500 px-3 py-2 shadow-sm"
            />
         </div>
         <div>
            <label className="block text-xs font-medium text-stone-500 mb-1">Document/Badge Image</label>
            <input 
              type="file" 
              accept="image/*"
              onChange={handleFileUpload}
              className="w-full text-sm text-stone-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
            />
            {newCertImage && (
              <p className="text-xs text-green-600 mt-1">Image selected ✓</p>
            )}
         </div>
         <div className="md:col-span-2 pt-2">
           <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-green-700 transition-colors shadow-sm w-full md:w-auto">
             Add Certification
           </button>
         </div>
       </form>
     </div>
  );
};

export default SellerCertifications;