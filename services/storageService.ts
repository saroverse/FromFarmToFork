import { User, Farmer, Message } from '../types';

const KEYS = {
  USERS: 'fc_users',
  FARMERS: 'fc_farmers',
  MESSAGES: 'fc_messages',
  CURRENT_USER_ID: 'fc_current_user_id'
};

// --- Mock Data ---

const MOCK_FARMERS: Farmer[] = [
  {
    id: '1',
    name: 'Sarah Jenkins',
    farmName: 'Green Valley Organics',
    description: 'Family-owned certified organic farm specializing in heirloom vegetables and heritage breed eggs. We believe in regenerative agriculture.',
    rating: 4.8,
    badges: ['#1 in Bio', 'Carbon Neutral'],
    certifications: [
      { id: 'c1', name: 'USDA Organic', issuer: 'USDA', year: '2023', image: '' },
      { id: 'c2', name: 'Regenerative Organic Certified', issuer: 'Regenerative Organic Alliance', year: '2024', image: '' }
    ],
    sustainabilityMetrics: {
      carbonSaved: '120kg/yr',
      method: 'Regenerative Soil'
    },
    products: [
      { id: '101', name: 'Heirloom Tomatoes', price: 4.50, unit: 'lb', inStock: true, image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&q=80&w=300' },
      { id: '102', name: 'Free Range Eggs', price: 7.00, unit: 'doz', inStock: true, image: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?auto=format&fit=crop&q=80&w=300' },
      { id: '103', name: 'Kale', price: 3.00, unit: 'bunch', inStock: true, image: 'https://images.unsplash.com/photo-1524179091875-bf99a9a6af57?auto=format&fit=crop&q=80&w=300' }
    ],
    schedule: [
      { id: 's1', day: 'Saturday', location: 'Market Square', openTime: '08:00', closeTime: '13:00' },
      { id: 's2', day: 'Wednesday', location: 'On-Farm Stand', openTime: '10:00', closeTime: '18:00' }
    ],
    isOpenNow: true,
    location: { lat: 50.8450, lng: 5.6850, address: 'Sint Pietersberg 12, Maastricht' }, 
    image: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: '2',
    name: 'Robert Field',
    farmName: 'Highland Orchards',
    description: 'Third-generation orchard bringing you the sweetest apples, peaches, and berries. Come visit our U-Pick events!',
    rating: 4.5,
    badges: ['Customer Favorite', 'Zero Waste'],
    certifications: [],
    sustainabilityMetrics: {
      carbonSaved: '85kg/yr',
      method: 'Solar Powered'
    },
    products: [
      { id: '201', name: 'Honeycrisp Apples', price: 2.99, unit: 'lb', inStock: true, image: 'https://images.unsplash.com/photo-1567306301408-9b74779a11af?auto=format&fit=crop&q=80&w=300' },
      { id: '202', name: 'Peach Jam', price: 8.50, unit: 'jar', inStock: true, image: 'https://images.unsplash.com/photo-1597362925123-77861d3fbac7?auto=format&fit=crop&q=80&w=300' }
    ],
    schedule: [
      { id: 's3', day: 'Sunday', location: 'Wyck Market', openTime: '09:00', closeTime: '14:00' }
    ],
    isOpenNow: false,
    location: { lat: 50.8600, lng: 5.7100, address: 'Heugemerweg 45, Maastricht' },
    image: 'https://images.unsplash.com/photo-1623067140787-8d14739502b4?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: '3',
    name: 'Jan & Sofie',
    farmName: 'Bananabox',
    description: 'For 3 generations, the Bananabox family has been connecting Belgian & Dutch farmers to Maastricht. We are famous for our wide selection of seasonal fruits and reliable presence at the weekly markets.',
    rating: 4.9,
    badges: ['Family Owned', 'Market Legend', '3rd Gen'],
    certifications: [],
    sustainabilityMetrics: {
        carbonSaved: '200kg/yr',
        method: 'Efficient Logistics'
    },
    products: [
        { id: '301', name: 'Premium Bananas', price: 1.99, unit: 'bunch', inStock: true, image: 'https://images.unsplash.com/photo-1571771896612-61871f0a5866?auto=format&fit=crop&q=80&w=300' },
        { id: '302', name: 'Seasonal Mix Box', price: 15.00, unit: 'box', inStock: true, image: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&q=80&w=300' },
        { id: '303', name: 'Fresh Strawberries', price: 4.50, unit: 'punnet', inStock: true, image: 'https://images.unsplash.com/photo-1464965911861-746a04b4b0a2?auto=format&fit=crop&q=80&w=300' }
    ],
    schedule: [
        { id: 's_bb_1', day: 'Wednesday', location: 'Maastricht Market (De Markt)', openTime: '08:00', closeTime: '15:00' },
        { id: 's_bb_2', day: 'Friday', location: 'Maastricht Market (De Markt)', openTime: '08:00', closeTime: '15:00' }
    ],
    isOpenNow: true,
    location: { lat: 50.851368, lng: 5.690973, address: 'Markt, 6211 CH Maastricht' }, // Exact coords of De Markt
    image: 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'test_farmer_joe',
    name: 'Joe Seller',
    farmName: "Joe's Test Farm",
    description: 'A dedicated test farm to verify application functionality. We grow digital vegetables and provide rapid logistical data.',
    rating: 5.0,
    badges: ['Test Account', 'Dev Certified'],
    certifications: [],
    sustainabilityMetrics: {
      carbonSaved: '0g',
      method: 'Virtual Farming'
    },
    products: [
      { id: 't1', name: 'Debug Potato', price: 1.50, unit: 'kg', inStock: true, image: 'https://images.unsplash.com/photo-1518977676605-dc56455512a5?auto=format&fit=crop&q=80&w=300' },
      { id: 't2', name: 'Beta Carrot', price: 0.80, unit: 'bunch', inStock: true, image: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&q=80&w=300' }
    ],
    schedule: [],
    isOpenNow: true,
    location: { lat: 50.8550, lng: 5.6950, address: 'Test Lane 404, Maastricht' },
    image: 'https://images.unsplash.com/photo-1605000797499-95a51c5269ae?auto=format&fit=crop&q=80&w=800'
  }
];

const MOCK_USERS: User[] = [
  { id: 'u1', email: 'sarah@greenvalley.com', password: 'password', name: 'Sarah Jenkins', role: 'seller', farmerId: '1' },
  { id: 'u2', email: 'robert@highland.com', password: 'password', name: 'Robert Field', role: 'seller', farmerId: '2' },
  { id: 'u3', email: 'buyer@example.com', password: 'password', name: 'Alex Buyer', role: 'buyer' },
  { id: 'u4', email: 'info@bananabox.nl', password: 'password', name: 'Jan Bananabox', role: 'seller', farmerId: '3' },
  // Joe's Test Accounts
  { id: 'u_joe_seller', email: 'seller@gmail.com', password: 'Joe', name: 'Joe Seller', role: 'seller', farmerId: 'test_farmer_joe' },
  { id: 'u_joe_buyer', email: 'buyer@gmail.com', password: 'Joe', name: 'Joe Buyer', role: 'buyer' }
];

const MOCK_MESSAGES: Message[] = [
  { id: 'm1', senderId: 'u3', receiverId: '1', senderName: 'Me', text: 'Do you have purple carrots today?', timestamp: Date.now() - 10000000, isRead: true },
  { id: 'm2', senderId: '1', receiverId: 'u3', senderName: 'Green Valley Organics', text: 'Yes! We just harvested them.', timestamp: Date.now() - 9000000, isRead: false },
  { id: 'm3', senderId: 'u3', receiverId: '1', senderName: 'Me', text: 'Great, I will stop by around noon.', timestamp: Date.now() - 8000000, isRead: true },
];

// --- Service ---

const ensureInitialized = () => {
  // 1. Ensure basic tables exist
  if (!localStorage.getItem(KEYS.USERS)) {
    localStorage.setItem(KEYS.USERS, JSON.stringify(MOCK_USERS));
  }
  if (!localStorage.getItem(KEYS.FARMERS)) {
    localStorage.setItem(KEYS.FARMERS, JSON.stringify(MOCK_FARMERS));
  }
  if (!localStorage.getItem(KEYS.MESSAGES)) {
    localStorage.setItem(KEYS.MESSAGES, JSON.stringify(MOCK_MESSAGES));
  }

  // 2. FORCE INJECT/UPDATE 'Joe' accounts if they are missing or old
  // This ensures the requested shortcut always works and updates from 'Tim' to 'Joe' if present.
  const storedUsers: User[] = JSON.parse(localStorage.getItem(KEYS.USERS) || '[]');
  const joeSeller = MOCK_USERS.find(u => u.email === 'seller@gmail.com');
  const joeBuyer = MOCK_USERS.find(u => u.email === 'buyer@gmail.com');
  let usersChanged = false;

  if (joeSeller) {
      const idx = storedUsers.findIndex(u => u.email === 'seller@gmail.com');
      if (idx !== -1) {
          storedUsers[idx] = joeSeller; // Update existing
          usersChanged = true;
      } else {
          storedUsers.push(joeSeller); // Add new
          usersChanged = true;
      }
  }

  if (joeBuyer) {
      const idx = storedUsers.findIndex(u => u.email === 'buyer@gmail.com');
      if (idx !== -1) {
          storedUsers[idx] = joeBuyer; // Update existing
          usersChanged = true;
      } else {
          storedUsers.push(joeBuyer); // Add new
          usersChanged = true;
      }
  }

  if (usersChanged) {
      localStorage.setItem(KEYS.USERS, JSON.stringify(storedUsers));
  }

  // 3. FORCE INJECT/UPDATE Joe's Farm
  const storedFarmers: Farmer[] = JSON.parse(localStorage.getItem(KEYS.FARMERS) || '[]');
  const joeFarm = MOCK_FARMERS.find(f => f.id === 'test_farmer_joe');
  
  if (joeFarm) {
      const idx = storedFarmers.findIndex(f => f.id === 'test_farmer_joe');
      if (idx !== -1) {
          storedFarmers[idx] = joeFarm;
      } else {
          storedFarmers.push(joeFarm);
      }
      // Also ensure we don't have dangling Tim farms if we care to clean up, 
      // but strictly speaking we just need Joe's farm to exist.
      localStorage.setItem(KEYS.FARMERS, JSON.stringify(storedFarmers));
  }
};

export const storageService = {
  // We keep the explicit initialize method but it basically just delegates to ensureInitialized
  // This can be used to reset data if we want to force it later (with clear first)
  initialize: () => {
    ensureInitialized();
  },

  getUsers: (): User[] => {
    ensureInitialized();
    return JSON.parse(localStorage.getItem(KEYS.USERS) || '[]');
  },

  saveUser: (user: User) => {
    ensureInitialized();
    const users = storageService.getUsers();
    const index = users.findIndex(u => u.id === user.id);
    if (index >= 0) {
      users[index] = user;
    } else {
      users.push(user);
    }
    localStorage.setItem(KEYS.USERS, JSON.stringify(users));
  },

  getFarmers: (): Farmer[] => {
    ensureInitialized();
    return JSON.parse(localStorage.getItem(KEYS.FARMERS) || '[]');
  },

  saveFarmer: (farmer: Farmer) => {
    ensureInitialized();
    const farmers = storageService.getFarmers();
    const index = farmers.findIndex(f => f.id === farmer.id);
    if (index >= 0) {
      farmers[index] = farmer;
    } else {
      farmers.push(farmer);
    }
    localStorage.setItem(KEYS.FARMERS, JSON.stringify(farmers));
  },

  getMessages: (): Message[] => {
    ensureInitialized();
    return JSON.parse(localStorage.getItem(KEYS.MESSAGES) || '[]');
  },

  saveMessage: (message: Message) => {
    ensureInitialized();
    const messages = storageService.getMessages();
    messages.push(message);
    localStorage.setItem(KEYS.MESSAGES, JSON.stringify(messages));
  },

  setCurrentUserSession: (userId: string) => {
    localStorage.setItem(KEYS.CURRENT_USER_ID, userId);
  },

  getCurrentUserSession: (): string | null => {
    return localStorage.getItem(KEYS.CURRENT_USER_ID);
  },

  clearSession: () => {
    localStorage.removeItem(KEYS.CURRENT_USER_ID);
  },

  // Debug/Dev tool to reset data
  resetAllData: () => {
    localStorage.clear();
    ensureInitialized();
    window.location.reload();
  }
};