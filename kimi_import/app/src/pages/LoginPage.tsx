import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore, countries, currencies } from '@/store';
import type { UserRole } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { Spinner } from '@/components/ui/spinner';
import { SplineSceneBasic } from '@/components/ui/demo';
import { toast } from 'sonner';
import {
  Sparkles,
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  ShoppingBag,
  Zap,
  Share2,
  Video,
  MessageSquare,
  Globe,
  Check,
  Building2,
} from 'lucide-react';



export function LoginPage() {
  const { login, register, setSelectedRole } = useStore();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState('login');
  const [step, setStep] = useState<'auth' | 'role' | 'country'>('auth');
  const [selectedRole, setRole] = useState<UserRole | null>(null);

  // Login form
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register form
  const [registerName, setRegisterName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('NG');
  const [agreeTerms, setAgreeTerms] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) {
      toast.error('Please fill in all fields');
      return;
    }
    
    setIsLoading(true);
    const success = await login(loginEmail, loginPassword);
    setIsLoading(false);
    
    if (success) {
      toast.success('Welcome back!');
    } else {
      toast.error('Invalid credentials');
    }
  };

  const handleRoleSelect = (role: UserRole) => {
    setRole(role);
    setSelectedRole(role);
    setStep('country');
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!registerName || !registerEmail || !registerPassword) {
      toast.error('Please fill in all fields');
      return;
    }
    if (!agreeTerms) {
      toast.error('Please agree to the terms');
      return;
    }
    if (!selectedRole) {
      toast.error('Please select a role');
      return;
    }
    
    setIsLoading(true);
    const success = await register(registerName, registerEmail, registerPassword, selectedRole, selectedCountry);
    setIsLoading(false);
    
    if (success) {
      toast.success('Account created successfully!');
    } else {
      toast.error('Registration failed');
    }
  };

  const vendorFeatures = [
    { icon: ShoppingBag, text: 'Product Management' },
    { icon: Zap, text: 'AI Automation' },
    { icon: MessageSquare, text: 'WhatsApp Sales' },
  ];

  const creatorFeatures = [
    { icon: Video, text: 'AI Video Generation' },
    { icon: Share2, text: 'Social Media' },
    { icon: Zap, text: 'Script Writing' },
  ];

  const renderRoleSelection = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div className="text-center space-y-2">
        <h3 className="text-xl font-bold">Choose Your Path</h3>
        <p className="text-muted-foreground">Select what you want to do on ChatCart</p>
      </div>

      <div className="grid gap-4">
        <button
          onClick={() => handleRoleSelect('vendor')}
          className="p-6 rounded-xl border-2 border-border hover:border-primary hover:bg-primary/5 transition-all text-left group"
        >
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
              <Building2 className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-lg">I'm a Vendor</h4>
              <p className="text-sm text-muted-foreground mt-1">
                Sell products with AI automation, WhatsApp sales bot, and social media scheduling
              </p>
              <div className="flex gap-3 mt-3">
                {vendorFeatures.map((f) => (
                  <span key={f.text} className="text-xs flex items-center gap-1 text-muted-foreground">
                    <f.icon className="h-3 w-3" />
                    {f.text}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </button>

        <button
          onClick={() => handleRoleSelect('creator')}
          className="p-6 rounded-xl border-2 border-border hover:border-violet-500 hover:bg-violet-500/5 transition-all text-left group"
        >
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-500/10 group-hover:bg-violet-500/20 transition-colors">
              <Video className="h-6 w-6 text-violet-500" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-lg">I'm a Content Creator</h4>
              <p className="text-sm text-muted-foreground mt-1">
                Generate faceless content with AI scripts, voiceovers, videos, and auto-posting
              </p>
              <div className="flex gap-3 mt-3">
                {creatorFeatures.map((f) => (
                  <span key={f.text} className="text-xs flex items-center gap-1 text-muted-foreground">
                    <f.icon className="h-3 w-3" />
                    {f.text}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </button>
      </div>

      <Button variant="ghost" className="w-full" onClick={() => setStep('auth')}>
        Back
      </Button>
    </motion.div>
  );

  const renderCountrySelection = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div className="text-center space-y-2">
        <h3 className="text-xl font-bold">Select Your Country</h3>
        <p className="text-muted-foreground">This helps us set up your currency and preferences</p>
      </div>

      <div className="grid gap-2 max-h-64 overflow-y-auto">
        {countries.map((country) => {
          const currency = currencies[country.currency];
          return (
            <button
              key={country.code}
              onClick={() => setSelectedCountry(country.code)}
              className={`p-4 rounded-xl border-2 text-left transition-all flex items-center justify-between ${
                selectedCountry === country.code
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/50'
              }`}
            >
              <div className="flex items-center gap-3">
                <Globe className="h-5 w-5 text-muted-foreground" />
                <span className="font-medium">{country.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">{currency.symbol} {country.currency}</span>
                {selectedCountry === country.code && (
                  <Check className="h-4 w-4 text-primary" />
                )}
              </div>
            </button>
          );
        })}
      </div>

      <div className="flex gap-3">
        <Button variant="outline" className="flex-1" onClick={() => setStep('role')}>
          Back
        </Button>
        <Button className="flex-1 gradient-primary" onClick={() => setStep('auth')}>
          Continue
        </Button>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 p-6 xl:p-8 bg-black">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="w-full h-full"
        >
          <SplineSceneBasic className="h-full min-h-[560px]" />
        </motion.div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 bg-background">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md space-y-8"
        >
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl gradient-primary">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-gradient">ChatCart</span>
          </div>

          <AnimatePresence mode="wait">
            {step === 'role' && activeTab === 'register' ? (
              renderRoleSelection()
            ) : step === 'country' && activeTab === 'register' ? (
              renderCountrySelection()
            ) : (
              <motion.div
                key="auth"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="text-center space-y-2 mb-6">
                  <h2 className="text-3xl font-bold">Welcome</h2>
                  <p className="text-muted-foreground">
                    Sign in or create your account
                  </p>
                </div>

                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="login">Sign In</TabsTrigger>
                    <TabsTrigger value="register">Sign Up</TabsTrigger>
                  </TabsList>

                  <TabsContent value="login" className="space-y-4 mt-6">
                    <form onSubmit={handleLogin} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="email"
                            type="email"
                            placeholder="Enter your email"
                            className="pl-10"
                            value={loginEmail}
                            onChange={(e) => setLoginEmail(e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="password"
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Enter your password"
                            className="pl-10 pr-10"
                            value={loginPassword}
                            onChange={(e) => setLoginPassword(e.target.value)}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                          >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                      </div>

                      <Button type="submit" className="w-full gradient-primary btn-shine" disabled={isLoading}>
                        {isLoading ? <Spinner className="h-4 w-4" /> : <><>Sign In</><ArrowRight className="ml-2 h-4 w-4" /></>}
                      </Button>
                    </form>
                  </TabsContent>

                  <TabsContent value="register" className="space-y-4 mt-6">
                    <form onSubmit={handleRegister} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="name"
                            placeholder="Enter your full name"
                            className="pl-10"
                            value={registerName}
                            onChange={(e) => setRegisterName(e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="register-email">Email</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="register-email"
                            type="email"
                            placeholder="Enter your email"
                            className="pl-10"
                            value={registerEmail}
                            onChange={(e) => setRegisterEmail(e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="register-password">Password</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="register-password"
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Create a password"
                            className="pl-10 pr-10"
                            value={registerPassword}
                            onChange={(e) => setRegisterPassword(e.target.value)}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                          >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="terms"
                          checked={agreeTerms}
                          onCheckedChange={(checked) => setAgreeTerms(checked as boolean)}
                        />
                        <Label htmlFor="terms" className="text-sm font-normal">
                          I agree to the <button type="button" className="text-primary hover:underline">Terms of Service</button>
                        </Label>
                      </div>

                      <Button
                        type="button"
                        className="w-full gradient-primary btn-shine"
                        disabled={isLoading}
                        onClick={() => setStep('role')}
                      >
                        {isLoading ? <Spinner className="h-4 w-4" /> : <><>Continue</><ArrowRight className="ml-2 h-4 w-4" /></>}
                      </Button>
                    </form>
                  </TabsContent>
                </Tabs>

                <div className="text-center text-sm text-muted-foreground mt-6">
                  <p>Demo: <span className="font-medium">demo@chatcart.com</span> / <span className="font-medium">password</span></p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
