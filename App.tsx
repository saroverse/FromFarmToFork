import React from 'react';
import Layout from './components/Layout';
import Auth from './components/Auth';
import SellerDashboard from './components/SellerDashboard';
import BuyerDashboard from './components/BuyerDashboard';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { DataProvider, useData } from './contexts/DataContext';
import { useGeolocation } from './hooks/useGeolocation';

// Internal component to handle content rendering based on Auth state
const AppContent: React.FC = () => {
  const { currentUser, login, register, error, setError, logout } = useAuth();
  const { farmers, messages, updateFarmer, sendMessage } = useData();
  const { location: userLocation } = useGeolocation();

  if (!currentUser) {
    return (
      <Layout user={null} onLogout={() => {}}>
        <Auth onLogin={login} onRegister={register} error={error} setError={setError} />
      </Layout>
    );
  }

  if (currentUser.role === 'seller') {
    const myFarmerProfile = farmers.find(f => f.id === currentUser.farmerId);
    
    // Graceful fallback if profile is missing
    if (!myFarmerProfile) {
      return (
        <Layout user={currentUser} onLogout={logout}>
           <div className="p-8 text-center">
             <h2 className="text-xl font-bold text-red-600">Profile Error</h2>
             <p className="text-stone-600">Could not load farm profile data. Please contact support.</p>
             <button onClick={logout} className="mt-4 text-sm underline text-stone-500">Log out</button>
           </div>
        </Layout>
      );
    }

    return (
      <Layout user={currentUser} onLogout={logout}>
        <SellerDashboard 
          farmer={myFarmerProfile} 
          updateFarmer={updateFarmer}
          messages={messages}
          onSendMessage={sendMessage}
        />
      </Layout>
    );
  }

  if (currentUser.role === 'buyer') {
    return (
      <Layout user={currentUser} onLogout={logout}>
        <BuyerDashboard 
          registeredFarmers={farmers}
          userLocation={userLocation}
          currentBuyerId={currentUser.id}
          messages={messages}
          onSendMessage={sendMessage}
          onLogout={logout}
        />
      </Layout>
    );
  }

  return null;
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <DataProvider>
        <AppContent />
      </DataProvider>
    </AuthProvider>
  );
};

export default App;