// ============================================
// USER & AUTHENTICATION TYPES
// ============================================

export type UserRole = 'vendor' | 'creator' | 'admin';

export type SubscriptionPlan = 'free' | 'starter' | 'pro' | 'business';

export interface Subscription {
  plan: SubscriptionPlan;
  status: 'active' | 'cancelled' | 'expired';
  startDate: string;
  endDate?: string;
  price: number;
}

export interface UsageLimits {
  products: number;          // Max products (vendor)
  aiMessages: number;        // AI messages per day
  scheduledPosts: number;    // Scheduled posts per week
  aiScripts: number;         // AI scripts per day (creator)
  aiVideos: number;          // AI videos per day (creator)
  whatsappMessages: number;  // WhatsApp AI responses per day
}

export interface UsageTracking {
  aiMessagesUsed: number;
  aiScriptsUsed: number;
  aiVideosUsed: number;
  scheduledPostsUsed: number;
  lastResetDate: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: UserRole;
  country: string;
  currency: Currency;
  subscription: Subscription;
  usage: UsageTracking;
  createdAt: string;
  socialAccounts: SocialAccount[];
  whatsappSettings?: WhatsAppSettings;
  bankDetails?: BankDetails;
}

export interface BankDetails {
  bankName: string;
  accountName: string;
  accountNumber: string;
}

export interface WhatsAppSettings {
  phoneNumber: string;
  enabled: boolean;
  welcomeMessage: string;
  autoReply: boolean;
}

// ============================================
// CURRENCY TYPES
// ============================================

export type Currency = 'NGN' | 'USD' | 'GBP' | 'EUR';

export interface CurrencyConfig {
  code: Currency;
  symbol: string;
  name: string;
  rate: number;
}

// ============================================
// PRODUCT TYPES
// ============================================

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: Currency;
  images: string[];
  stockQuantity: number;
  createdAt: string;
  updatedAt: string;
  vendorId: string;
  category?: string;
}

// ============================================
// ORDER TYPES (Updated with Payment Flow)
// ============================================

export type OrderStatus = 
  | 'pending' 
  | 'awaiting_payment'
  | 'payment_uploaded'
  | 'payment_confirmed'
  | 'processing' 
  | 'shipped' 
  | 'delivered' 
  | 'cancelled';

export interface PaymentProof {
  imageUrl: string;
  uploadedAt: string;
  confirmedAt?: string;
  confirmedBy?: string;
}

export interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  productId: string;
  productName: string;
  quantity: number;
  totalPrice: number;
  currency: Currency;
  status: OrderStatus;
  paymentProof?: PaymentProof;
  paymentMethod: 'manual_transfer' | 'card' | 'wallet';
  createdAt: string;
  updatedAt: string;
  vendorId: string;
  notes?: string;
}

// ============================================
// SOCIAL MEDIA TYPES
// ============================================

export type SocialPlatform = 'instagram' | 'facebook' | 'tiktok' | 'youtube' | 'twitter';

export interface SocialAccount {
  id: string;
  platform: SocialPlatform;
  username: string;
  connected: boolean;
  connectedAt?: string;
}

export type PostStatus = 'draft' | 'scheduled' | 'published' | 'failed';

export interface ScheduledPost {
  id: string;
  content: string;
  images: string[];
  platforms: SocialPlatform[];
  status: PostStatus;
  scheduledAt?: string;
  publishedAt?: string;
  createdAt: string;
  userId: string;
}

// ============================================
// AI CONTENT TYPES
// ============================================

export type ContentType = 'caption' | 'post' | 'ad' | 'hashtags' | 'script' | 'voiceover';

export interface AIContent {
  id: string;
  type: ContentType;
  prompt: string;
  content: string;
  createdAt: string;
  userId: string;
}

// ============================================
// CONTENT CREATOR TYPES
// ============================================

export interface GeneratedScript {
  id: string;
  title: string;
  content: string;
  niche: string;
  duration: number; // in seconds
  tone: string;
  createdAt: string;
  userId: string;
}

export interface GeneratedVideo {
  id: string;
  scriptId: string;
  title: string;
  thumbnailUrl: string;
  videoUrl?: string;
  status: 'generating' | 'completed' | 'failed';
  platforms: SocialPlatform[];
  createdAt: string;
  userId: string;
}

export interface GeneratedVoice {
  id: string;
  scriptId: string;
  text: string;
  voiceType: string;
  audioUrl?: string;
  status: 'generating' | 'completed' | 'failed';
  createdAt: string;
  userId: string;
}

// ============================================
// WHATSAPP AUTOMATION TYPES
// ============================================

export interface WhatsAppConversation {
  id: string;
  customerPhone: string;
  customerName?: string;
  messages: WhatsAppMessage[];
  status: 'active' | 'closed';
  createdAt: string;
  updatedAt: string;
  vendorId: string;
}

export interface WhatsAppMessage {
  id: string;
  content: string;
  sender: 'customer' | 'ai' | 'vendor';
  timestamp: string;
}

// ============================================
// AUTOMATION TYPES
// ============================================

export interface AutomationRule {
  id: string;
  name: string;
  trigger: 'new_product' | 'low_stock' | 'new_order' | 'schedule' | 'payment_received';
  action: 'generate_content' | 'post_social' | 'send_email' | 'send_whatsapp';
  enabled: boolean;
  config: Record<string, any>;
  userId: string;
}

// ============================================
// ANALYTICS TYPES
// ============================================

export interface AnalyticsData {
  date: string;
  sales: number;
  orders: number;
  visitors: number;
  aiUsage: number;
}

export type ActivityType = 'order' | 'product' | 'post' | 'automation' | 'payment' | 'subscription';

export interface Activity {
  id: string;
  type: ActivityType;
  title: string;
  description: string;
  timestamp: string;
  userId?: string;
}

// ============================================
// SUBSCRIPTION PLAN TYPES
// ============================================

export interface PlanConfig {
  id: SubscriptionPlan;
  name: string;
  price: number;
  description: string;
  features: string[];
  limits: UsageLimits;
  popular?: boolean;
}

// ============================================
// ADMIN TYPES
// ============================================

export interface AdminStats {
  totalUsers: number;
  totalVendors: number;
  totalCreators: number;
  totalRevenue: number;
  activeSubscriptions: number;
  pendingPayments: number;
  dailyOrders: number;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  subscription: Subscription;
  status: 'active' | 'suspended' | 'pending';
  createdAt: string;
  lastActive?: string;
}

// ============================================
// NAVIGATION TYPES
// ============================================

export type VendorPageType = 
  | 'dashboard' 
  | 'products' 
  | 'orders' 
  | 'automation' 
  | 'whatsapp'
  | 'social-media' 
  | 'analytics' 
  | 'settings'
  | 'subscription';

export type CreatorPageType = 
  | 'dashboard' 
  | 'scripts' 
  | 'videos' 
  | 'voices' 
  | 'scheduler' 
  | 'social-media' 
  | 'analytics' 
  | 'settings'
  | 'subscription';

export type AdminPageType = 
  | 'dashboard'
  | 'users'
  | 'vendors'
  | 'creators'
  | 'subscriptions'
  | 'payments'
  | 'orders'
  | 'analytics'
  | 'settings';

export type PageType = VendorPageType | CreatorPageType | AdminPageType;
