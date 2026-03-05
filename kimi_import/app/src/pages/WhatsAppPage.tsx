import { useState } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '@/store';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import {
  MessageSquare,
  Phone,
  Send,
  Bot,
  User,
  Settings,
  Clock,
} from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4 },
  },
};

export function WhatsAppPage() {
  const { user, conversations, sendWhatsAppMessage, updateUser } = useStore();
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [messageInput, setMessageInput] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  
  const [settings, setSettings] = useState({
    phoneNumber: user?.whatsappSettings?.phoneNumber || '',
    enabled: user?.whatsappSettings?.enabled || false,
    welcomeMessage: user?.whatsappSettings?.welcomeMessage || 'Hello! 👋 How can I help you today?\n\n1️⃣ View Products\n2️⃣ Track Order\n3️⃣ Talk to Vendor',
    autoReply: user?.whatsappSettings?.autoReply ?? true,
  });

  const activeConversation = conversations.find(c => c.id === selectedConversation);

  const handleSendMessage = () => {
    if (!messageInput.trim() || !selectedConversation) return;
    sendWhatsAppMessage(selectedConversation, messageInput, 'vendor');
    setMessageInput('');
  };

  const handleSaveSettings = () => {
    updateUser({
      whatsappSettings: settings,
    });
    toast.success('WhatsApp settings saved');
    setShowSettings(false);
  };



  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">WhatsApp Automation</h1>
          <p className="text-muted-foreground mt-1">
            AI-powered customer service for your business
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => setShowSettings(true)}>
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Button>
        </div>
      </motion.div>

      {/* Status Card */}
      <motion.div variants={itemVariants}>
        <Card className={settings.enabled ? 'border-emerald-500/30' : 'border-amber-500/30'}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${
                  settings.enabled ? 'bg-emerald-500/10' : 'bg-amber-500/10'
                }`}>
                  <Phone className={`h-6 w-6 ${settings.enabled ? 'text-emerald-500' : 'text-amber-500'}`} />
                </div>
                <div>
                  <h3 className="font-semibold">WhatsApp Business</h3>
                  <p className="text-sm text-muted-foreground">
                    {settings.enabled 
                      ? `Connected: ${settings.phoneNumber}` 
                      : 'Not connected. Add your number to start.'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant={settings.enabled ? 'default' : 'secondary'}>
                  {settings.enabled ? 'Active' : 'Inactive'}
                </Badge>
                <Switch 
                  checked={settings.enabled} 
                  onCheckedChange={(checked) => setSettings({ ...settings, enabled: checked })}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Conversations */}
      <motion.div variants={itemVariants} className="grid gap-6 lg:grid-cols-3">
        {/* Conversation List */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-base">Conversations</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-border">
              {conversations.map((conversation) => {
                const lastMessage = conversation.messages[conversation.messages.length - 1];
                const unreadCount = conversation.messages.filter(m => m.sender === 'customer').length;
                
                return (
                  <button
                    key={conversation.id}
                    onClick={() => setSelectedConversation(conversation.id)}
                    className={`w-full p-4 flex items-center gap-3 hover:bg-muted/50 transition-colors text-left ${
                      selectedConversation === conversation.id ? 'bg-primary/5' : ''
                    }`}
                  >
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <User className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="font-medium truncate">{conversation.customerName || conversation.customerPhone}</p>
                        {unreadCount > 0 && (
                          <Badge variant="destructive" className="h-5 min-w-5 text-xs">
                            {unreadCount}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground truncate">
                        {lastMessage?.content.substring(0, 30)}...
                      </p>
                    </div>
                  </button>
                );
              })}
              
              {conversations.length === 0 && (
                <div className="p-8 text-center text-muted-foreground">
                  <MessageSquare className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>No conversations yet</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Chat Area */}
        <Card className="lg:col-span-2">
          {activeConversation ? (
            <>
              <CardHeader className="border-b">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-base">
                        {activeConversation.customerName || activeConversation.customerPhone}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-1">
                        <div className="h-2 w-2 rounded-full bg-emerald-500" />
                        Online
                      </CardDescription>
                    </div>
                  </div>
                  <Badge variant="outline">
                    <Bot className="mr-1 h-3 w-3" />
                    AI Enabled
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="p-0">
                {/* Messages */}
                <div className="h-[400px] overflow-y-auto p-4 space-y-4">
                  {activeConversation.messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${
                        message.sender === 'customer' ? 'justify-start' : 'justify-end'
                      }`}
                    >
                      <div
                        className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                          message.sender === 'customer'
                            ? 'bg-muted'
                            : message.sender === 'ai'
                            ? 'bg-violet-500 text-white'
                            : 'bg-primary text-white'
                        }`}
                      >
                        <p className="text-sm whitespace-pre-line">{message.content}</p>
                        <p className={`text-xs mt-1 ${
                          message.sender === 'customer' ? 'text-muted-foreground' : 'text-white/70'
                        }`}>
                          {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Input */}
                <div className="border-t p-4">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Type a message..."
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    />
                    <Button onClick={handleSendMessage}>
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex gap-2 mt-2">
                    <Button variant="ghost" size="sm" onClick={() => {
                      sendWhatsAppMessage(activeConversation.id, 'Here are our products:\n\n1. Premium Wireless Headphones – ₦45,000\n2. Smart Fitness Watch – ₦32,000\n3. Organic Skincare Set – ₦18,500', 'ai');
                    }}>
                      <Bot className="mr-1 h-3 w-3" />
                      Send Products
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => {
                      sendWhatsAppMessage(activeConversation.id, 'Please provide your order ID to track your order.', 'ai');
                    }}>
                      <Clock className="mr-1 h-3 w-3" />
                      Track Order
                    </Button>
                  </div>
                </div>
              </CardContent>
            </>
          ) : (
            <div className="h-[500px] flex flex-col items-center justify-center text-muted-foreground">
              <MessageSquare className="h-16 w-16 mb-4 opacity-50" />
              <p className="text-lg font-medium">Select a conversation</p>
              <p className="text-sm">Choose a chat from the list to view messages</p>
            </div>
          )}
        </Card>
      </motion.div>

      {/* Settings Dialog */}
      {showSettings && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-card border border-border rounded-xl p-6 w-full max-w-md mx-4"
          >
            <h3 className="text-lg font-semibold mb-4">WhatsApp Settings</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Phone Number</Label>
                <Input
                  placeholder="+2348012345678"
                  value={settings.phoneNumber}
                  onChange={(e) => setSettings({ ...settings, phoneNumber: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Welcome Message</Label>
                <Textarea
                  rows={4}
                  value={settings.welcomeMessage}
                  onChange={(e) => setSettings({ ...settings, welcomeMessage: e.target.value })}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label>Auto-Reply</Label>
                <Switch
                  checked={settings.autoReply}
                  onCheckedChange={(checked) => setSettings({ ...settings, autoReply: checked })}
                />
              </div>
              <div className="flex gap-3 pt-4">
                <Button variant="outline" className="flex-1" onClick={() => setShowSettings(false)}>
                  Cancel
                </Button>
                <Button className="flex-1 gradient-primary" onClick={handleSaveSettings}>
                  Save Settings
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}
