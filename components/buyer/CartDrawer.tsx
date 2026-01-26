import React, { useState } from 'react';
import { Product } from '../../types';

export interface CartItem extends Product {
  quantity: number;
  farmerName: string;
}

interface CartDrawerProps {
    cart: CartItem[];
    onClose: () => void;
    onAdd: (product: Product, farmName: string) => void;
    onRemove: (id: string) => void;
    onClear: () => void;
}

const CartDrawer: React.FC<CartDrawerProps> = ({ cart, onClose, onAdd, onRemove, onClear }) => {
    const [isCheckingOut, setIsCheckingOut] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const delivery = 2.99; // Flat fee for demo
    const total = subtotal + delivery;

    const handleCheckout = () => {
        setIsCheckingOut(true);
        setTimeout(() => {
            setIsCheckingOut(false);
            setIsSuccess(true);
            setTimeout(() => {
                onClear();
                onClose();
            }, 2500);
        }, 1500);
    };

    if (isSuccess) {
        return (
            <div className="fixed inset-0 z-[2000] bg-white flex flex-col items-center justify-center p-6 animate-in fade-in duration-300">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6 animate-bounce">
                    <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                </div>
                <h2 className="text-2xl font-bold text-stone-900 mb-2">Order Placed!</h2>
                <p className="text-stone-500 text-center">Your fresh food is on its way. You can track it in the Account tab.</p>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-[1500]">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
            
            {/* Drawer */}
            <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl max-h-[90vh] flex flex-col animate-in slide-in-from-bottom duration-300">
                <div className="p-6 border-b border-stone-100 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-stone-900">Your Basket <span className="text-stone-400 font-normal">({cart.reduce((a,b)=>a+b.quantity,0)})</span></h2>
                    <button onClick={onClose} className="p-2 bg-stone-100 rounded-full text-stone-500 hover:bg-stone-200">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {cart.map(item => (
                        <div key={item.id} className="flex gap-4">
                            <div className="w-16 h-16 bg-stone-100 rounded-lg overflow-hidden flex-shrink-0">
                                <img src={item.image} alt="" className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between items-start mb-1">
                                    <h4 className="font-bold text-stone-900 text-sm">{item.name}</h4>
                                    <span className="font-bold text-stone-900 text-sm">€{(item.price * item.quantity).toFixed(2)}</span>
                                </div>
                                <p className="text-xs text-stone-500 mb-2">{item.farmerName}</p>
                                <div className="flex items-center gap-3">
                                    <button onClick={() => onRemove(item.id)} className="w-6 h-6 rounded-full border border-stone-300 flex items-center justify-center text-stone-500 text-xs">-</button>
                                    <span className="text-sm font-medium w-4 text-center">{item.quantity}</span>
                                    <button onClick={() => onAdd(item, item.farmerName)} className="w-6 h-6 rounded-full border border-stone-300 flex items-center justify-center text-stone-500 text-xs">+</button>
                                </div>
                            </div>
                        </div>
                    ))}
                    {cart.length === 0 && (
                        <div className="text-center py-10 text-stone-400">
                            Your basket is empty.
                        </div>
                    )}
                </div>

                <div className="p-6 bg-stone-50 border-t border-stone-100 safe-area-bottom">
                    <div className="space-y-2 mb-4 text-sm">
                        <div className="flex justify-between text-stone-600">
                            <span>Subtotal</span>
                            <span>€{subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-stone-600">
                            <span>Delivery</span>
                            <span>€{delivery.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-stone-900 font-bold text-lg pt-2 border-t border-stone-200">
                            <span>Total</span>
                            <span>€{total.toFixed(2)}</span>
                        </div>
                    </div>
                    <button 
                        onClick={handleCheckout}
                        disabled={cart.length === 0 || isCheckingOut}
                        className="w-full bg-green-800 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:bg-green-900 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {isCheckingOut ? (
                            <>
                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Processing...
                            </>
                        ) : 'Checkout'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CartDrawer;