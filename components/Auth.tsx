import React, { useState } from 'react';
import { UserRole, User } from '../types';

interface AuthProps {
  onLogin: (email: string, pass: string) => void;
  onRegister: (name: string, email: string, pass: string, role: UserRole) => void;
  error?: string;
  setError: (msg: string) => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin, onRegister, error, setError }) => {
  const [isLogin, setIsLogin] = useState(true);
  
  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<UserRole>('buyer');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLogin) {
        onLogin(email, password);
    } else {
        onRegister(name, email, password, role);
    }
  };

  return (
    // Changed justify-center to justify-start and added pt-10/pb-24 to ensure content flows naturally 
    // and shortcuts are never clipped at the bottom of the viewport.
    <div className="flex flex-col items-center justify-start pt-10 pb-24 px-4 w-full h-full">
      <div className="text-center mb-8">
        <span className="text-6xl mb-4 block">🌱</span>
        <h1 className="text-4xl font-bold text-green-900 mb-2 tracking-tight">From Farm To Fork</h1>
        <p className="text-stone-600">Local food, directly from the source.</p>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-xl border border-stone-100 max-w-md w-full relative z-10">
        <h2 className="text-2xl font-bold text-stone-900 mb-6 text-center">
            {isLogin ? 'Welcome Back' : 'Create Account'}
        </h2>
        
        {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4 border border-red-100">
                {error}
            </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
                <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1">Full Name</label>
                    <input 
                        type="text" 
                        required 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-4 py-2 bg-white text-stone-900 rounded-lg border border-stone-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                    />
                </div>
            )}
            
            <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Email Address</label>
                <input 
                    type="email" 
                    required 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2 bg-white text-stone-900 rounded-lg border border-stone-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Password</label>
                <input 
                    type="password" 
                    required 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-2 bg-white text-stone-900 rounded-lg border border-stone-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                />
            </div>

            {!isLogin && (
                <div className="pt-2">
                    <label className="block text-sm font-medium text-stone-700 mb-2">I want to...</label>
                    <div className="grid grid-cols-2 gap-4">
                        <button
                            type="button"
                            onClick={() => setRole('buyer')}
                            className={`p-3 rounded-xl border-2 text-center transition-all ${
                                role === 'buyer' 
                                ? 'border-green-600 bg-green-50 text-green-800' 
                                : 'border-stone-200 hover:border-green-300'
                            }`}
                        >
                            <span className="text-2xl block mb-1">🥕</span>
                            <span className="font-bold text-sm">Buy Food</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => setRole('seller')}
                            className={`p-3 rounded-xl border-2 text-center transition-all ${
                                role === 'seller' 
                                ? 'border-green-600 bg-green-50 text-green-800' 
                                : 'border-stone-200 hover:border-green-300'
                            }`}
                        >
                            <span className="text-2xl block mb-1">🚜</span>
                            <span className="font-bold text-sm">Sell Food</span>
                        </button>
                    </div>
                </div>
            )}

            <button 
                type="submit" 
                className="w-full bg-green-700 text-white font-bold py-3 rounded-xl hover:bg-green-800 transition-colors shadow-lg shadow-green-200"
            >
                {isLogin ? 'Sign In' : 'Sign Up'}
            </button>
        </form>

        <div className="mt-6 text-center text-sm text-stone-500">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button 
                onClick={() => { setIsLogin(!isLogin); setError(''); }}
                className="text-green-700 font-bold hover:underline"
            >
                {isLogin ? 'Sign Up' : 'Log In'}
            </button>
        </div>
        
        {/* Test Shortcuts - High contrast styling and ensured visibility */}
        <div className="mt-8 border-t-2 border-dashed border-stone-200 pt-6 relative z-10">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-white px-2 text-xs font-bold text-stone-400 uppercase tracking-widest">
                Test Shortcuts
            </div>
            
            <div className="grid grid-cols-2 gap-3 mb-3">
                <button onClick={() => onLogin('seller@gmail.com', 'Joe')} className="bg-purple-50 hover:bg-purple-100 text-purple-700 text-sm py-3 rounded-xl font-bold transition-colors border border-purple-200 shadow-sm">
                    Seller (Joe)
                </button>
                <button onClick={() => onLogin('buyer@gmail.com', 'Joe')} className="bg-blue-50 hover:bg-blue-100 text-blue-700 text-sm py-3 rounded-xl font-bold transition-colors border border-blue-200 shadow-sm">
                    Buyer (Joe)
                </button>
            </div>
            <div className="grid grid-cols-3 gap-2">
                <button onClick={() => onLogin('info@bananabox.nl', 'password')} className="bg-stone-50 hover:bg-stone-100 text-stone-600 text-xs py-2 rounded-lg font-medium transition-colors border border-stone-200">
                    Bananabox
                </button>
                <button onClick={() => onLogin('sarah@greenvalley.com', 'password')} className="bg-stone-50 hover:bg-stone-100 text-stone-600 text-xs py-2 rounded-lg font-medium transition-colors border border-stone-200">
                    Green Valley
                </button>
                 <button onClick={() => onLogin('buyer@example.com', 'password')} className="bg-stone-50 hover:bg-stone-100 text-stone-600 text-xs py-2 rounded-lg font-medium transition-colors border border-stone-200">
                    Alex Buyer
                </button>
            </div>
        </div>

      </div>
    </div>
  );
};

export default Auth;