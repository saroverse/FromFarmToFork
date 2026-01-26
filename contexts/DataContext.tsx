import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Farmer, Message } from '../types';
import { storageService } from '../services/storageService';
import { useAuth } from './AuthContext';

interface DataContextType {
  farmers: Farmer[];
  messages: Message[];
  refreshData: () => void;
  updateFarmer: (farmer: Farmer) => void;
  sendMessage: (text: string, receiverId: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { currentUser } = useAuth();
  const [farmers, setFarmers] = useState<Farmer[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);

  const refreshData = () => {
    setFarmers(storageService.getFarmers());
    setMessages(storageService.getMessages());
  };

  // Initial load
  useEffect(() => {
    // storageService.initialize() is no longer needed here as getters handle it
    refreshData();
  }, []);

  // Refresh when user changes (login/logout) to ensure fresh state
  useEffect(() => {
    refreshData();
  }, [currentUser]);

  const updateFarmer = (updatedFarmer: Farmer) => {
    // Optimistic Update
    setFarmers(prev => prev.map(f => f.id === updatedFarmer.id ? updatedFarmer : f));
    storageService.saveFarmer(updatedFarmer);
  };

  const sendMessage = (text: string, receiverId: string) => {
    if (!currentUser) return;

    const isSeller = currentUser.role === 'seller';
    const senderId = isSeller && currentUser.farmerId ? currentUser.farmerId : currentUser.id;
    
    // Determine sender name
    let senderName = currentUser.name;
    if (isSeller && currentUser.farmerId) {
        const myFarm = farmers.find(f => f.id === currentUser.farmerId);
        senderName = myFarm ? myFarm.farmName : currentUser.name;
    }

    const newMessage: Message = {
        id: Date.now().toString(),
        senderId,
        receiverId,
        senderName,
        text,
        timestamp: Date.now(),
        isRead: false
    };

    setMessages(prev => [...prev, newMessage]);
    storageService.saveMessage(newMessage);
  };

  return (
    <DataContext.Provider value={{ farmers, messages, refreshData, updateFarmer, sendMessage }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error('useData must be used within a DataProvider');
  return context;
};