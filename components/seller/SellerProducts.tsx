import React from 'react';
import { Farmer, Product } from '../../types';

interface SellerProductsProps {
  farmer: Farmer;
  updateFarmer: (f: Farmer) => void;
}

const SellerProducts: React.FC<SellerProductsProps> = ({ farmer, updateFarmer }) => {
  
  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const name = (form.elements.namedItem('pName') as HTMLInputElement).value;
    const price = parseFloat((form.elements.namedItem('pPrice') as HTMLInputElement).value);
    const unit = (form.elements.namedItem('pUnit') as HTMLSelectElement).value;
    
    if (name && price && unit) {
      const newProduct: Product = {
        id: Date.now().toString(),
        name,
        price,
        unit,
        inStock: true,
        image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&q=80&w=300' // Default placeholder
      };
      updateFarmer({ ...farmer, products: [...farmer.products, newProduct] });
      form.reset();
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-6">
      <h3 className="text-lg font-bold text-stone-800 mb-6">Current Harvest</h3>
      <div className="space-y-4 mb-8">
        {farmer.products.map(product => (
          <div key={product.id} className="flex items-center justify-between p-4 bg-stone-50 rounded-lg border border-stone-100">
            <div className="flex items-center gap-4">
               <div className={`w-3 h-3 rounded-full ${product.inStock ? 'bg-green-500' : 'bg-red-500'}`} />
               <span className="font-medium text-stone-800">{product.name}</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-stone-600">${product.price.toFixed(2)} / {product.unit}</span>
              <button 
                onClick={() => {
                  const updated = farmer.products.filter(p => p.id !== product.id);
                  updateFarmer({...farmer, products: updated});
                }}
                className="text-red-500 hover:text-red-700 text-sm font-medium"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
        {farmer.products.length === 0 && (
            <p className="text-stone-400 italic text-center py-4">No products listed. Add some below!</p>
        )}
      </div>

      <h4 className="text-sm font-bold text-stone-500 uppercase tracking-wider mb-4">Add New Product</h4>
      <form onSubmit={handleAddProduct} className="flex gap-4 flex-wrap sm:flex-nowrap items-end">
        <div className="flex-1 min-w-[200px]">
            <label className="block text-xs font-medium text-stone-500 mb-1">Product Name</label>
            <input name="pName" placeholder="e.g. Carrots" required className="w-full bg-white text-stone-900 rounded-lg border border-stone-300 shadow-sm focus:border-green-500 focus:ring-green-500 px-3 py-2" />
        </div>
        
        <div className="w-24 sm:w-32">
            <label className="block text-xs font-medium text-stone-500 mb-1">Price</label>
            <input name="pPrice" type="number" step="0.01" placeholder="0.00" required className="w-full bg-white text-stone-900 rounded-lg border border-stone-300 shadow-sm focus:border-green-500 focus:ring-green-500 px-3 py-2" />
        </div>

        <div className="w-28 sm:w-36">
             <label className="block text-xs font-medium text-stone-500 mb-1">Unit</label>
             <select name="pUnit" className="w-full bg-white text-stone-900 rounded-lg border border-stone-300 shadow-sm focus:border-green-500 focus:ring-green-500 px-3 py-2">
                <option value="lb">per lb</option>
                <option value="kg">per kg</option>
                <option value="oz">per oz</option>
                <option value="doz">per doz</option>
                <option value="bunch">per bunch</option>
                <option value="piece">per piece</option>
                <option value="box">per box</option>
                <option value="jar">per jar</option>
                <option value="bag">per bag</option>
             </select>
        </div>
        
        <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 font-medium h-[42px]">Add</button>
      </form>
    </div>
  );
};

export default SellerProducts;