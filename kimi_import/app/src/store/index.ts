import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { 
  User, 
  Product, 
  Order, 
  ScheduledPost, 
  AIContent, 
  AutomationRule,
  AnalyticsData,
  Activity,
  Currency,
  SocialAccount,
  VendorPageType,
  CreatorPageType,
  AdminPageType,
  OrderStatus,
  SocialPlatform,
  ContentType,
  UserRole,
  SubscriptionPlan,
  PlanConfig,
  GeneratedScript,
  GeneratedVideo,
  GeneratedVoice,
  WhatsAppConversation,
  AdminStats,
  AdminUser,
} from '@/types';

// ============================================
// SUBSCRIPTION PLANS CONFIGURATION
// ============================================

export const subscriptionPlans: Record<SubscriptionPlan, PlanConfig> = {
  free: {
    id: 'free',
    name: 'Free',
    price: 0,
    description: 'Perfect for testing the platform',
    features: [
      '5 products maximum',
      '20 AI messages/day',
      '3 scheduled posts/week',
      'Basic analytics',
      'Watermark on content',
    ],
    limits: {
      products: 5,
      aiMessages: 20,
      scheduledPosts: 3,
      aiScripts: 3,
      aiVideos: 2,
      whatsappMessages: 10,
    },
  },
  starter: {
    id: 'starter',
    name: 'Starter',
    price: 10,
    description: 'For growing businesses',
    features: [
      '50 products',
      '200 AI responses/day',
      'Social media scheduling',
      'No watermark',
      'Email support',
    ],
    limits: {
      products: 50,
      aiMessages: 200,
      scheduledPosts: 50,
      aiScripts: 10,
      aiVideos: 5,
      whatsappMessages: 100,
    },
  },
  pro: {
    id: 'pro',
    name: 'Pro',
    price: 30,
    description: 'For serious sellers',
    features: [
      'Unlimited products',
      'Unlimited AI responses',
      'WhatsApp automation',
      'Advanced analytics',
      'Auto social posting',
      'Priority support',
    ],
    limits: {
      products: Infinity,
      aiMessages: Infinity,
      scheduledPosts: Infinity,
      aiScripts: 50,
      aiVideos: 20,
      whatsappMessages: 1000,
    },
    popular: true,
  },
  business: {
    id: 'business',
    name: 'Business',
    price: 69,
    description: 'For enterprises',
    features: [
      'Multiple stores',
      'Advanced AI marketing',
      'Team accounts (5)',
      'Priority AI processing',
      'Dedicated support',
      'Custom integrations',
    ],
    limits: {
      products: Infinity,
      aiMessages: Infinity,
      scheduledPosts: Infinity,
      aiScripts: Infinity,
      aiVideos: Infinity,
      whatsappMessages: Infinity,
    },
  },
};

// ============================================
// CURRENCY CONFIGURATION
// ============================================

export const currencies: Record<Currency, { symbol: string; name: string; rate: number }> = {
  NGN: { symbol: '₦', name: 'Nigerian Naira', rate: 1 },
  USD: { symbol: '$', name: 'US Dollar', rate: 0.00065 },
  GBP: { symbol: '£', name: 'British Pound', rate: 0.00052 },
  EUR: { symbol: '€', name: 'Euro', rate: 0.00061 },
};

export const countries = [
  { code: 'NG', name: 'Nigeria', currency: 'NGN' as Currency },
  { code: 'US', name: 'United States', currency: 'USD' as Currency },
  { code: 'GB', name: 'United Kingdom', currency: 'GBP' as Currency },
  { code: 'DE', name: 'Germany', currency: 'EUR' as Currency },
  { code: 'FR', name: 'France', currency: 'EUR' as Currency },
  { code: 'CA', name: 'Canada', currency: 'USD' as Currency },
  { code: 'AU', name: 'Australia', currency: 'USD' as Currency },
  { code: 'ZA', name: 'South Africa', currency: 'USD' as Currency },
  { code: 'KE', name: 'Kenya', currency: 'USD' as Currency },
  { code: 'GH', name: 'Ghana', currency: 'USD' as Currency },
];

// ============================================
// MOCK DATA GENERATORS
// ============================================

const generateMockProducts = (): Product[] => [
  {
    id: '1',
    name: 'Premium Wireless Headphones',
    description: 'High-quality wireless headphones with noise cancellation',
    price: 45000,
    currency: 'NGN',
    images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400'],
    stockQuantity: 25,
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    vendorId: '1',
    category: 'Electronics',
  },
  {
    id: '2',
    name: 'Smart Fitness Watch',
    description: 'Track your fitness goals with this advanced smartwatch',
    price: 32000,
    currency: 'NGN',
    images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400'],
    stockQuantity: 18,
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    vendorId: '1',
    category: 'Electronics',
  },
  {
    id: '3',
    name: 'Organic Skincare Set',
    description: 'Natural skincare products for glowing skin',
    price: 18500,
    currency: 'NGN',
    images: ['https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400'],
    stockQuantity: 42,
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    vendorId: '1',
    category: 'Beauty',
  },
  {
    id: '4',
    name: 'Designer Handbag',
    description: 'Elegant designer handbag for any occasion',
    price: 75000,
    currency: 'NGN',
    images: ['https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400'],
    stockQuantity: 8,
    createdAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(),
    vendorId: '1',
    category: 'Fashion',
  },
];

const generateMockOrders = (): Order[] => [
  {
    id: 'ORD-001',
    customerName: 'Sarah Johnson',
    customerEmail: 'sarah@example.com',
    customerPhone: '+2348012345678',
    productId: '1',
    productName: 'Premium Wireless Headphones',
    quantity: 1,
    totalPrice: 45000,
    currency: 'NGN',
    status: 'delivered',
    paymentMethod: 'manual_transfer',
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    vendorId: '1',
  },
  {
    id: 'ORD-002',
    customerName: 'Michael Chen',
    customerEmail: 'michael@example.com',
    customerPhone: '+2348098765432',
    productId: '2',
    productName: 'Smart Fitness Watch',
    quantity: 2,
    totalPrice: 64000,
    currency: 'NGN',
    status: 'payment_confirmed',
    paymentMethod: 'manual_transfer',
    paymentProof: {
      imageUrl: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400',
      uploadedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    vendorId: '1',
  },
  {
    id: 'ORD-003',
    customerName: 'Amara Okafor',
    customerEmail: 'amara@example.com',
    customerPhone: '+2348056789012',
    productId: '3',
    productName: 'Organic Skincare Set',
    quantity: 1,
    totalPrice: 18500,
    currency: 'NGN',
    status: 'payment_uploaded',
    paymentMethod: 'manual_transfer',
    paymentProof: {
      imageUrl: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400',
      uploadedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    },
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    vendorId: '1',
  },
  {
    id: 'ORD-004',
    customerName: 'David Adeleke',
    customerEmail: 'david@example.com',
    customerPhone: '+2348034567890',
    productId: '1',
    productName: 'Premium Wireless Headphones',
    quantity: 1,
    totalPrice: 45000,
    currency: 'NGN',
    status: 'awaiting_payment',
    paymentMethod: 'manual_transfer',
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    vendorId: '1',
  },
  {
    id: 'ORD-005',
    customerName: 'Fatima Bello',
    customerEmail: 'fatima@example.com',
    customerPhone: '+2348078901234',
    productId: '4',
    productName: 'Designer Handbag',
    quantity: 1,
    totalPrice: 75000,
    currency: 'NGN',
    status: 'pending',
    paymentMethod: 'manual_transfer',
    createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    vendorId: '1',
  },
];

const generateMockPosts = (): ScheduledPost[] => [
  {
    id: '1',
    content: '🎧 New arrival! Premium wireless headphones now available. Experience crystal-clear sound with active noise cancellation. Shop now! #Tech #Audio #NewArrival',
    images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400'],
    platforms: ['instagram', 'facebook'],
    status: 'published',
    publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    userId: '1',
  },
  {
    id: '2',
    content: '✨ Transform your skincare routine with our organic skincare set. Natural ingredients for radiant skin. Limited stock available! #Skincare #Organic #Beauty',
    images: ['https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400'],
    platforms: ['instagram', 'tiktok'],
    status: 'scheduled',
    scheduledAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    userId: '1',
  },
];

const generateMockScripts = (): GeneratedScript[] => [
  {
    id: '1',
    title: '5 Productivity Hacks',
    content: 'Want to boost your productivity? Here are 5 game-changing hacks...',
    niche: 'Productivity',
    duration: 60,
    tone: 'energetic',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    userId: '2',
  },
  {
    id: '2',
    title: 'Morning Routine for Success',
    content: 'Start your day right with this powerful morning routine...',
    niche: 'Self Improvement',
    duration: 45,
    tone: 'motivational',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    userId: '2',
  },
];

const generateMockWhatsAppConversations = (): WhatsAppConversation[] => [
  {
    id: '1',
    customerPhone: '+2348012345678',
    customerName: 'John Doe',
    messages: [
      {
        id: '1',
        content: 'Hi',
        sender: 'customer',
        timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      },
      {
        id: '2',
        content: 'Hello! 👋 How can I help you today?\n\n1️⃣ View Products\n2️⃣ Track Order\n3️⃣ Talk to Vendor',
        sender: 'ai',
        timestamp: new Date(Date.now() - 29 * 60 * 1000).toISOString(),
      },
      {
        id: '3',
        content: '1',
        sender: 'customer',
        timestamp: new Date(Date.now() - 28 * 60 * 1000).toISOString(),
      },
      {
        id: '4',
        content: 'Here are our available products:\n\n1. Premium Wireless Headphones – ₦45,000\n2. Smart Fitness Watch – ₦32,000\n3. Organic Skincare Set – ₦18,500\n4. Designer Handbag – ₦75,000\n\nWhich one interests you?',
        sender: 'ai',
        timestamp: new Date(Date.now() - 27 * 60 * 1000).toISOString(),
      },
    ],
    status: 'active',
    createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 27 * 60 * 1000).toISOString(),
    vendorId: '1',
  },
];

const generateMockAnalytics = (): AnalyticsData[] => {
  const data: AnalyticsData[] = [];
  for (let i = 29; i >= 0; i--) {
    data.push({
      date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      sales: Math.floor(Math.random() * 50000) + 20000,
      orders: Math.floor(Math.random() * 10) + 2,
      visitors: Math.floor(Math.random() * 200) + 50,
      aiUsage: Math.floor(Math.random() * 50) + 10,
    });
  }
  return data;
};

const generateMockActivities = (): Activity[] => [
  {
    id: '1',
    type: 'order',
    title: 'New Order Received',
    description: 'Order #ORD-005 from Fatima Bello',
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    userId: '1',
  },
  {
    id: '2',
    type: 'payment',
    title: 'Payment Confirmed',
    description: 'Order #ORD-002 payment confirmed by vendor',
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    userId: '1',
  },
  {
    id: '3',
    type: 'product',
    title: 'Product Added',
    description: 'Organic Skincare Set was added to inventory',
    timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    userId: '1',
  },
  {
    id: '4',
    type: 'post',
    title: 'Post Published',
    description: 'Social media post published to Instagram and Facebook',
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    userId: '1',
  },
  {
    id: '5',
    type: 'automation',
    title: 'AI Content Generated',
    description: 'Marketing content generated for Premium Wireless Headphones',
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    userId: '1',
  },
];

// ============================================
// STORE INTERFACE
// ============================================

interface StoreState {
  // Auth
  user: User | null;
  isAuthenticated: boolean;
  selectedRole: UserRole | null;
  login: (email: string, _password: string) => Promise<boolean>;
  register: (name: string, email: string, _password: string, role: UserRole, country: string) => Promise<boolean>;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
  setSelectedRole: (role: UserRole | null) => void;
  upgradeSubscription: (plan: SubscriptionPlan) => void;
  
  // Usage tracking
  canUseAI: () => boolean;
  canAddProduct: () => boolean;
  canSchedulePost: () => boolean;
  incrementAIUsage: () => void;
  incrementScheduledPostUsage: () => void;
  resetUsageIfNeeded: () => void;
  
  // Products
  products: Product[];
  addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => boolean;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  getProductById: (id: string) => Product | undefined;
  
  // Orders
  orders: Order[];
  addOrder: (order: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateOrderStatus: (id: string, status: OrderStatus) => void;
  uploadPaymentProof: (orderId: string, imageUrl: string) => void;
  confirmPayment: (orderId: string) => void;
  getOrdersByVendor: (vendorId: string) => Order[];
  getPendingPayments: () => Order[];
  
  // Social Media
  posts: ScheduledPost[];
  addPost: (post: Omit<ScheduledPost, 'id' | 'createdAt'>) => boolean;
  updatePost: (id: string, post: Partial<ScheduledPost>) => void;
  deletePost: (id: string) => void;
  connectAccount: (platform: SocialPlatform, username: string) => void;
  disconnectAccount: (platform: SocialPlatform) => void;
  
  // AI Content
  contents: AIContent[];
  generateContent: (type: ContentType, _prompt: string) => Promise<string>;
  saveContent: (content: Omit<AIContent, 'id' | 'createdAt'>) => void;
  
  // Content Creator
  scripts: GeneratedScript[];
  generateScript: (niche: string, duration: number, tone: string) => Promise<GeneratedScript>;
  videos: GeneratedVideo[];
  generateVideo: (scriptId: string, title: string) => Promise<GeneratedVideo>;
  voices: GeneratedVoice[];
  generateVoice: (scriptId: string, voiceType: string) => Promise<GeneratedVoice>;
  
  // WhatsApp
  conversations: WhatsAppConversation[];
  sendWhatsAppMessage: (conversationId: string, content: string, sender: 'customer' | 'ai' | 'vendor') => void;
  getOrCreateConversation: (phone: string, vendorId: string) => WhatsAppConversation;
  
  // Automation
  rules: AutomationRule[];
  addRule: (rule: Omit<AutomationRule, 'id'>) => void;
  updateRule: (id: string, rule: Partial<AutomationRule>) => void;
  deleteRule: (id: string) => void;
  toggleRule: (id: string) => void;
  
  // UI
  currentPage: VendorPageType | CreatorPageType | AdminPageType;
  sidebarCollapsed: boolean;
  isLoading: boolean;
  setCurrentPage: (page: VendorPageType | CreatorPageType | AdminPageType) => void;
  toggleSidebar: () => void;
  setLoading: (loading: boolean) => void;
  
  // Analytics
  data: AnalyticsData[];
  activities: Activity[];
  getRevenue: (currency: Currency) => number;
  getTotalOrders: () => number;
  getPendingOrders: () => number;
  getTotalProducts: () => number;
  getPendingPaymentsCount: () => number;
  
  // Admin
  adminStats: AdminStats;
  adminUsers: AdminUser[];
  suspendUser: (userId: string) => void;
  approveUser: (userId: string) => void;
}

// ============================================
// STORE IMPLEMENTATION
// ============================================

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      // ============================================
      // AUTH STATE
      // ============================================
      user: null,
      isAuthenticated: false,
      selectedRole: null,
      
      setSelectedRole: (role) => set({ selectedRole: role }),
      
      login: async (email, _password) => {
        await new Promise(resolve => setTimeout(resolve, 1000));
        const mockUser: User = {
          id: '1',
          email,
          name: 'Demo Vendor',
          role: 'vendor',
          country: 'NG',
          currency: 'NGN',
          subscription: {
            plan: 'free',
            status: 'active',
            startDate: new Date().toISOString(),
            price: 0,
          },
          usage: {
            aiMessagesUsed: 0,
            aiScriptsUsed: 0,
            aiVideosUsed: 0,
            scheduledPostsUsed: 0,
            lastResetDate: new Date().toISOString(),
          },
          createdAt: new Date().toISOString(),
          socialAccounts: [
            { id: '1', platform: 'instagram', username: '@demostore', connected: true, connectedAt: new Date().toISOString() },
            { id: '2', platform: 'facebook', username: 'Demo Store', connected: true, connectedAt: new Date().toISOString() },
          ],
          whatsappSettings: {
            phoneNumber: '+2348012345678',
            enabled: true,
            welcomeMessage: 'Hello! 👋 How can I help you today?',
            autoReply: true,
          },
          bankDetails: {
            bankName: 'First Bank of Nigeria',
            accountName: 'Demo Store Ltd',
            accountNumber: '0123456789',
          },
        };
        set({ user: mockUser, isAuthenticated: true });
        return true;
      },
      
      register: async (name, email, _password, role, country) => {
        await new Promise(resolve => setTimeout(resolve, 1000));
        const countryInfo = countries.find(c => c.code === country);
        const mockUser: User = {
          id: Math.random().toString(36).substr(2, 9),
          email,
          name,
          role,
          country,
          currency: countryInfo?.currency || 'USD',
          subscription: {
            plan: 'free',
            status: 'active',
            startDate: new Date().toISOString(),
            price: 0,
          },
          usage: {
            aiMessagesUsed: 0,
            aiScriptsUsed: 0,
            aiVideosUsed: 0,
            scheduledPostsUsed: 0,
            lastResetDate: new Date().toISOString(),
          },
          createdAt: new Date().toISOString(),
          socialAccounts: [],
          whatsappSettings: {
            phoneNumber: '',
            enabled: false,
            welcomeMessage: 'Hello! 👋 How can I help you today?',
            autoReply: true,
          },
        };
        set({ user: mockUser, isAuthenticated: true, selectedRole: role });
        return true;
      },
      
      logout: () => {
        set({ user: null, isAuthenticated: false, selectedRole: null });
      },
      
      updateUser: (userData) => {
        set(state => ({ user: state.user ? { ...state.user, ...userData } : null }));
      },
      
      upgradeSubscription: (plan) => {
        const planConfig = subscriptionPlans[plan];
        set(state => ({
          user: state.user ? {
            ...state.user,
            subscription: {
              plan,
              status: 'active',
              startDate: new Date().toISOString(),
              price: planConfig.price,
            },
          } : null,
        }));
      },
      
      // ============================================
      // USAGE TRACKING
      // ============================================
      canUseAI: () => {
        const { user } = get();
        if (!user) return false;
        const limit = subscriptionPlans[user.subscription.plan].limits.aiMessages;
        if (limit === Infinity) return true;
        get().resetUsageIfNeeded();
        return user.usage.aiMessagesUsed < limit;
      },
      
      canAddProduct: () => {
        const { user, products } = get();
        if (!user) return false;
        const limit = subscriptionPlans[user.subscription.plan].limits.products;
        if (limit === Infinity) return true;
        return products.filter(p => p.vendorId === user.id).length < limit;
      },
      
      canSchedulePost: () => {
        const { user } = get();
        if (!user) return false;
        const limit = subscriptionPlans[user.subscription.plan].limits.scheduledPosts;
        if (limit === Infinity) return true;
        get().resetUsageIfNeeded();
        return user.usage.scheduledPostsUsed < limit;
      },
      
      incrementAIUsage: () => {
        set(state => ({
          user: state.user ? {
            ...state.user,
            usage: {
              ...state.user.usage,
              aiMessagesUsed: state.user.usage.aiMessagesUsed + 1,
            },
          } : null,
        }));
      },
      
      incrementScheduledPostUsage: () => {
        set(state => ({
          user: state.user ? {
            ...state.user,
            usage: {
              ...state.user.usage,
              scheduledPostsUsed: state.user.usage.scheduledPostsUsed + 1,
            },
          } : null,
        }));
      },
      
      resetUsageIfNeeded: () => {
        const { user } = get();
        if (!user) return;
        const lastReset = new Date(user.usage.lastResetDate);
        const now = new Date();
        if (lastReset.getDate() !== now.getDate() || lastReset.getMonth() !== now.getMonth()) {
          set(state => ({
            user: state.user ? {
              ...state.user,
              usage: {
                aiMessagesUsed: 0,
                aiScriptsUsed: 0,
                aiVideosUsed: 0,
                scheduledPostsUsed: 0,
                lastResetDate: now.toISOString(),
              },
            } : null,
          }));
        }
      },
      
      // ============================================
      // PRODUCTS
      // ============================================
      products: generateMockProducts(),
      addProduct: (product) => {
        if (!get().canAddProduct()) return false;
        const newProduct: Product = {
          ...product,
          id: Math.random().toString(36).substr(2, 9),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        set(state => ({ products: [...state.products, newProduct] }));
        return true;
      },
      updateProduct: (id, productData) => {
        set(state => ({
          products: state.products.map(p => 
            p.id === id ? { ...p, ...productData, updatedAt: new Date().toISOString() } : p
          ),
        }));
      },
      deleteProduct: (id) => {
        set(state => ({ products: state.products.filter(p => p.id !== id) }));
      },
      getProductById: (id) => {
        return get().products.find(p => p.id === id);
      },
      
      // ============================================
      // ORDERS
      // ============================================
      orders: generateMockOrders(),
      addOrder: (order) => {
        const newOrder: Order = {
          ...order,
          id: `ORD-${String(get().orders.length + 1).padStart(3, '0')}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        set(state => ({ orders: [...state.orders, newOrder] }));
      },
      updateOrderStatus: (id, status) => {
        set(state => ({
          orders: state.orders.map(o => 
            o.id === id ? { ...o, status, updatedAt: new Date().toISOString() } : o
          ),
        }));
      },
      uploadPaymentProof: (orderId, imageUrl) => {
        set(state => ({
          orders: state.orders.map(o => 
            o.id === orderId ? {
              ...o,
              status: 'payment_uploaded',
              paymentProof: {
                imageUrl,
                uploadedAt: new Date().toISOString(),
              },
              updatedAt: new Date().toISOString(),
            } : o
          ),
        }));
      },
      confirmPayment: (orderId) => {
        set(state => ({
          orders: state.orders.map(o => 
            o.id === orderId ? {
              ...o,
              status: 'payment_confirmed',
              paymentProof: {
                ...o.paymentProof!,
                confirmedAt: new Date().toISOString(),
                confirmedBy: state.user?.id,
              },
              updatedAt: new Date().toISOString(),
            } : o
          ),
        }));
      },
      getOrdersByVendor: (vendorId) => {
        return get().orders.filter(o => o.vendorId === vendorId);
      },
      getPendingPayments: () => {
        return get().orders.filter(o => o.status === 'payment_uploaded');
      },
      
      // ============================================
      // SOCIAL MEDIA
      // ============================================
      posts: generateMockPosts(),
      addPost: (post) => {
        if (!get().canSchedulePost()) return false;
        const newPost: ScheduledPost = {
          ...post,
          id: Math.random().toString(36).substr(2, 9),
          createdAt: new Date().toISOString(),
        };
        set(state => ({ posts: [...state.posts, newPost] }));
        get().incrementScheduledPostUsage();
        return true;
      },
      updatePost: (id, postData) => {
        set(state => ({
          posts: state.posts.map(p => p.id === id ? { ...p, ...postData } : p),
        }));
      },
      deletePost: (id) => {
        set(state => ({ posts: state.posts.filter(p => p.id !== id) }));
      },
      connectAccount: (platform, username) => {
        set(state => {
          if (!state.user) return state;
          const newAccount: SocialAccount = {
            id: Math.random().toString(36).substr(2, 9),
            platform,
            username,
            connected: true,
            connectedAt: new Date().toISOString(),
          };
          return {
            user: {
              ...state.user,
              socialAccounts: [...state.user.socialAccounts.filter(a => a.platform !== platform), newAccount],
            },
          };
        });
      },
      disconnectAccount: (platform) => {
        set(state => {
          if (!state.user) return state;
          return {
            user: {
              ...state.user,
              socialAccounts: state.user.socialAccounts.filter(a => a.platform !== platform),
            },
          };
        });
      },
      
      // ============================================
      // AI CONTENT
      // ============================================
      contents: [],
      generateContent: async (type, _prompt) => {
        if (!get().canUseAI()) {
          throw new Error('AI usage limit reached. Please upgrade your plan.');
        }
        await new Promise(resolve => setTimeout(resolve, 1500));
        get().incrementAIUsage();
        const templates: Record<ContentType, string> = {
          caption: `✨ Elevate your style with our premium product! \n\nDiscover quality that speaks for itself. Shop now and experience the difference.\n\n#PremiumQuality #ShopNow #MustHave #NewArrival`,
          post: `🎉 Exciting News! 🎉\n\nWe're thrilled to announce the launch of our latest product! After months of development, we can't wait for you to experience what we've created.\n\n✅ Premium quality materials\n✅ Designed with you in mind\n✅ Limited edition availability\n\nDon't miss out - grab yours today! Link in bio.\n\n#LaunchDay #NewProduct #Excited #ShopNow`,
          ad: `🔥 FLASH SALE ALERT! 🔥\n\nGet 20% OFF our bestselling products for the next 24 hours only!\n\nUse code: FLASH20\n\n✨ Premium quality guaranteed\n🚚 Free shipping on orders over ₦30,000\n💯 Satisfaction guaranteed\n\nShop now before it's too late!`,
          hashtags: `#ShopLocal #SmallBusiness #Entrepreneur #QualityProducts #CustomerFirst #ShopNow #MustHave #NewArrival #PremiumQuality #SupportSmallBusiness #MadeWithLove #Handcrafted #Exclusive #LimitedEdition #Trending`,
          script: `Hook: Stop scrolling! You need to see this...\n\nProblem: Tired of [pain point]? You're not alone.\n\nSolution: Our product solves this by [benefit].\n\nProof: Over 10,000 happy customers can't be wrong!\n\nCTA: Click the link in bio to get yours today!`,
          voiceover: `Welcome to the future of [niche]. Today, we're going to show you something amazing that will change the way you think about [topic]. Stay tuned until the end for a special surprise!`,
        };
        return templates[type];
      },
      saveContent: (content) => {
        const newContent: AIContent = {
          ...content,
          id: Math.random().toString(36).substr(2, 9),
          createdAt: new Date().toISOString(),
        };
        set(state => ({ contents: [...state.contents, newContent] }));
      },
      
      // ============================================
      // CONTENT CREATOR
      // ============================================
      scripts: generateMockScripts(),
      generateScript: async (niche, duration, tone) => {
        const newScript: GeneratedScript = {
          id: Math.random().toString(36).substr(2, 9),
          title: `${niche} Content Idea`,
          content: `Hook: Stop scrolling! This ${niche} tip will change everything...\n\nMain Content: [Your ${duration}s script here with ${tone} tone]\n\nCall to Action: Follow for more ${niche} tips!`,
          niche,
          duration,
          tone,
          createdAt: new Date().toISOString(),
          userId: get().user?.id || '1',
        };
        set(state => ({ scripts: [...state.scripts, newScript] }));
        return newScript;
      },
      videos: [],
      generateVideo: async (scriptId, title) => {
        const newVideo: GeneratedVideo = {
          id: Math.random().toString(36).substr(2, 9),
          scriptId,
          title,
          thumbnailUrl: `https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400`,
          status: 'generating',
          platforms: [],
          createdAt: new Date().toISOString(),
          userId: get().user?.id || '1',
        };
        set(state => ({ videos: [...state.videos, newVideo] }));
        // Simulate video generation
        setTimeout(() => {
          set(state => ({
            videos: state.videos.map(v => 
              v.id === newVideo.id ? { ...v, status: 'completed', videoUrl: 'https://example.com/video.mp4' } : v
            ),
          }));
        }, 5000);
        return newVideo;
      },
      voices: [],
      generateVoice: async (scriptId, voiceType) => {
        const newVoice: GeneratedVoice = {
          id: Math.random().toString(36).substr(2, 9),
          scriptId,
          text: 'Generated voiceover text...',
          voiceType,
          status: 'generating',
          createdAt: new Date().toISOString(),
          userId: get().user?.id || '1',
        };
        set(state => ({ voices: [...state.voices, newVoice] }));
        return newVoice;
      },
      
      // ============================================
      // WHATSAPP
      // ============================================
      conversations: generateMockWhatsAppConversations(),
      sendWhatsAppMessage: (conversationId, content, sender) => {
        const newMessage = {
          id: Math.random().toString(36).substr(2, 9),
          content,
          sender,
          timestamp: new Date().toISOString(),
        };
        set(state => ({
          conversations: state.conversations.map(c => 
            c.id === conversationId 
              ? { ...c, messages: [...c.messages, newMessage], updatedAt: new Date().toISOString() }
              : c
          ),
        }));
      },
      getOrCreateConversation: (phone, vendorId) => {
        const existing = get().conversations.find(c => c.customerPhone === phone && c.vendorId === vendorId);
        if (existing) return existing;
        
        const newConversation: WhatsAppConversation = {
          id: Math.random().toString(36).substr(2, 9),
          customerPhone: phone,
          messages: [],
          status: 'active',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          vendorId,
        };
        set(state => ({ conversations: [...state.conversations, newConversation] }));
        return newConversation;
      },
      
      // ============================================
      // AUTOMATION
      // ============================================
      rules: [
        {
          id: '1',
          name: 'Auto-generate product captions',
          trigger: 'new_product',
          action: 'generate_content',
          enabled: true,
          config: {},
          userId: '1',
        },
        {
          id: '2',
          name: 'WhatsApp auto-reply',
          trigger: 'new_order',
          action: 'send_whatsapp',
          enabled: false,
          config: {},
          userId: '1',
        },
      ],
      addRule: (rule) => {
        const newRule: AutomationRule = {
          ...rule,
          id: Math.random().toString(36).substr(2, 9),
        };
        set(state => ({ rules: [...state.rules, newRule] }));
      },
      updateRule: (id, ruleData) => {
        set(state => ({
          rules: state.rules.map(r => r.id === id ? { ...r, ...ruleData } : r),
        }));
      },
      deleteRule: (id) => {
        set(state => ({ rules: state.rules.filter(r => r.id !== id) }));
      },
      toggleRule: (id) => {
        set(state => ({
          rules: state.rules.map(r => r.id === id ? { ...r, enabled: !r.enabled } : r),
        }));
      },
      
      // ============================================
      // UI STATE
      // ============================================
      currentPage: 'dashboard',
      sidebarCollapsed: false,
      isLoading: false,
      setCurrentPage: (page) => set({ currentPage: page }),
      toggleSidebar: () => set(state => ({ sidebarCollapsed: !state.sidebarCollapsed })),
      setLoading: (loading) => set({ isLoading: loading }),
      
      // ============================================
      // ANALYTICS
      // ============================================
      data: generateMockAnalytics(),
      activities: generateMockActivities(),
      getRevenue: (currency) => {
        const orders = get().orders.filter(o => o.status !== 'cancelled' && o.status !== 'pending' && o.status !== 'awaiting_payment');
        const totalNGN = orders.reduce((sum, o) => sum + o.totalPrice, 0);
        return Math.round(totalNGN * currencies[currency].rate);
      },
      getTotalOrders: () => get().orders.length,
      getPendingOrders: () => get().orders.filter(o => o.status === 'pending' || o.status === 'awaiting_payment').length,
      getTotalProducts: () => get().products.length,
      getPendingPaymentsCount: () => get().orders.filter(o => o.status === 'payment_uploaded').length,
      
      // ============================================
      // ADMIN
      // ============================================
      adminStats: {
        totalUsers: 1250,
        totalVendors: 850,
        totalCreators: 400,
        totalRevenue: 45000,
        activeSubscriptions: 680,
        pendingPayments: 12,
        dailyOrders: 45,
      },
      adminUsers: [
        { id: '1', name: 'Demo Vendor', email: 'demo@chatcart.com', role: 'vendor', subscription: { plan: 'free', status: 'active', startDate: new Date().toISOString(), price: 0 }, status: 'active', createdAt: new Date().toISOString() },
        { id: '2', name: 'Content Creator', email: 'creator@chatcart.com', role: 'creator', subscription: { plan: 'pro', status: 'active', startDate: new Date().toISOString(), price: 30 }, status: 'active', createdAt: new Date().toISOString() },
      ],
      suspendUser: (userId) => {
        set(state => ({
          adminUsers: state.adminUsers.map(u => u.id === userId ? { ...u, status: 'suspended' as const } : u),
        }));
      },
      approveUser: (userId) => {
        set(state => ({
          adminUsers: state.adminUsers.map(u => u.id === userId ? { ...u, status: 'active' as const } : u),
        }));
      },
    }),
    {
      name: 'chatcart-storage',
      partialize: (state) => ({ 
        user: state.user, 
        isAuthenticated: state.isAuthenticated,
        selectedRole: state.selectedRole,
        products: state.products,
        orders: state.orders,
        posts: state.posts,
        rules: state.rules,
        contents: state.contents,
        scripts: state.scripts,
        videos: state.videos,
        voices: state.voices,
        conversations: state.conversations,
      }),
    }
  )
);

// ============================================
// HELPER HOOKS
// ============================================

export const useCurrency = () => {
  const { user } = useStore();
  const currency = user?.currency || 'NGN';
  const { symbol, rate } = currencies[currency];
  
  const formatPrice = (priceInNGN: number) => {
    const converted = Math.round(priceInNGN * rate);
    return `${symbol}${converted.toLocaleString()}`;
  };
  
  return { currency, symbol, rate, formatPrice };
};

export const useSubscription = () => {
  const { user } = useStore();
  const plan = user?.subscription.plan || 'free';
  const planConfig = subscriptionPlans[plan];
  
  return {
    plan,
    planConfig,
    isFree: plan === 'free',
    isPaid: plan !== 'free',
    canUpgrade: plan !== 'business',
  };
};
