import React, { ReactNode } from 'react';
import { User } from '../types';

interface LayoutProps {
  children: ReactNode;
  user: User | null;
  onLogout: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, user, onLogout }) => {
  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 flex flex-col">
      <header className="bg-green-800 text-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2 cursor-pointer">
            <span className="text-2xl">🌱</span>
            <h1 className="text-xl font-bold tracking-tight">From Farm To Fork</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            {user && (
              <div className="flex items-center gap-3">
                 <div className="hidden md:flex flex-col items-end">
                    <span className="text-sm font-bold">{user.name}</span>
                    <span className="text-[10px] bg-green-900/50 px-2 py-0.5 rounded-full text-green-100 uppercase tracking-wider">
                        {user.role === 'seller' ? 'Farmer' : 'Buyer'}
                    </span>
                 </div>
                 <button 
                    onClick={onLogout}
                    className="text-sm bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg transition-colors text-white"
                >
                    Log Out
                </button>
              </div>
            )}
          </div>
        </div>
      </header>
      <main className="flex-grow">
        {children}
      </main>
      <footer className="bg-stone-900 text-stone-400 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm">© 2024 From Farm To Fork. Connecting communities to earth's bounty.</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;