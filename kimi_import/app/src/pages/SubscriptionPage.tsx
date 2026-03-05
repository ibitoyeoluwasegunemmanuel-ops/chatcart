import { useState } from 'react';
import { motion } from 'framer-motion';
import { useStore, subscriptionPlans, useSubscription } from '@/store';
import type { SubscriptionPlan } from '@/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import {
  Check,
  Sparkles,
  Zap,
  Crown,
  Building2,
  ArrowRight,
  CreditCard,
  AlertCircle,
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

export function SubscriptionPage() {
  const { user, upgradeSubscription } = useStore();
  const { plan: currentPlan, planConfig } = useSubscription();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [showPayment, setShowPayment] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);

  const handleUpgrade = (plan: SubscriptionPlan) => {
    if (plan === currentPlan) {
      toast.info('You are already on this plan');
      return;
    }
    setSelectedPlan(plan);
    setShowPayment(true);
  };

  const confirmUpgrade = () => {
    if (selectedPlan) {
      upgradeSubscription(selectedPlan);
      toast.success(`Upgraded to ${subscriptionPlans[selectedPlan].name} plan!`);
      setShowPayment(false);
      setSelectedPlan(null);
    }
  };

  const plans: SubscriptionPlan[] = ['free', 'starter', 'pro', 'business'];

  const getPlanIcon = (plan: SubscriptionPlan) => {
    switch (plan) {
      case 'free':
        return Sparkles;
      case 'starter':
        return Zap;
      case 'pro':
        return Crown;
      case 'business':
        return Building2;
    }
  };

  const getPlanColor = (plan: SubscriptionPlan) => {
    switch (plan) {
      case 'free':
        return 'from-gray-500 to-gray-600';
      case 'starter':
        return 'from-blue-500 to-blue-600';
      case 'pro':
        return 'from-primary to-violet-600';
      case 'business':
        return 'from-amber-500 to-orange-600';
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="text-center max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold">Choose Your Plan</h1>
        <p className="text-muted-foreground mt-2">
          Start free and upgrade as you grow. No credit card required for free plan.
        </p>
        
        {/* Billing Toggle */}
        <div className="flex items-center justify-center gap-4 mt-6">
          <span className={`text-sm ${billingCycle === 'monthly' ? 'font-medium' : 'text-muted-foreground'}`}>
            Monthly
          </span>
          <Switch
            checked={billingCycle === 'yearly'}
            onCheckedChange={(checked) => setBillingCycle(checked ? 'yearly' : 'monthly')}
          />
          <span className={`text-sm ${billingCycle === 'yearly' ? 'font-medium' : 'text-muted-foreground'}`}>
            Yearly
          </span>
          {billingCycle === 'yearly' && (
            <Badge variant="secondary" className="text-xs">Save 20%</Badge>
          )}
        </div>
      </motion.div>

      {/* Current Plan */}
      {currentPlan !== 'free' && (
        <motion.div variants={itemVariants}>
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Crown className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Current Plan: {planConfig.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      Your subscription renews on {new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <Badge>Active</Badge>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Pricing Cards */}
      <motion.div variants={itemVariants} className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {plans.map((plan) => {
          const config = subscriptionPlans[plan];
          const Icon = getPlanIcon(plan);
          const isCurrentPlan = plan === currentPlan;
          const price = billingCycle === 'yearly' 
            ? Math.round(config.price * 0.8 * 12) 
            : config.price;

          return (
            <Card 
              key={plan} 
              className={`relative overflow-hidden ${
                isCurrentPlan ? 'border-primary ring-2 ring-primary/20' : ''
              } ${config.popular ? 'border-primary/50' : ''}`}
            >
              {config.popular && (
                <div className="absolute top-0 right-0 bg-primary text-white text-xs px-3 py-1 rounded-bl-lg">
                  Most Popular
                </div>
              )}
              
              <CardHeader className="pb-4">
                <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${getPlanColor(plan)} flex items-center justify-center mb-4`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-xl">{config.name}</CardTitle>
                <CardDescription>{config.description}</CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <div>
                  <span className="text-4xl font-bold">
                    {config.price === 0 ? 'Free' : `$${billingCycle === 'yearly' ? Math.round(config.price * 0.8) : config.price}`}
                  </span>
                  {config.price > 0 && (
                    <span className="text-muted-foreground">/{billingCycle === 'yearly' ? 'month' : 'month'}</span>
                  )}
                  {billingCycle === 'yearly' && config.price > 0 && (
                    <p className="text-sm text-muted-foreground">
                      ${price} billed annually
                    </p>
                  )}
                </div>

                <div className="space-y-3">
                  {config.features.map((feature) => (
                    <div key={feature} className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>

                <Button
                  className={`w-full ${isCurrentPlan ? '' : 'gradient-primary'}`}
                  variant={isCurrentPlan ? 'outline' : 'default'}
                  disabled={isCurrentPlan}
                  onClick={() => handleUpgrade(plan)}
                >
                  {isCurrentPlan ? (
                    'Current Plan'
                  ) : plan === 'free' ? (
                    'Get Started'
                  ) : (
                    <>
                      Upgrade
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </motion.div>

      {/* Usage Limits Info */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle>Your Current Limits</CardTitle>
            <CardDescription>Track your usage on the {planConfig.name} plan</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div className="p-4 rounded-lg bg-muted">
                <p className="text-sm text-muted-foreground">AI Messages</p>
                <p className="text-2xl font-bold mt-1">
                  {user?.usage.aiMessagesUsed || 0} / {planConfig.limits.aiMessages === Infinity ? '∞' : planConfig.limits.aiMessages}
                </p>
                <div className="h-2 bg-muted-foreground/20 rounded-full mt-2 overflow-hidden">
                  <div 
                    className="h-full bg-primary rounded-full transition-all"
                    style={{ 
                      width: planConfig.limits.aiMessages === Infinity 
                        ? '0%' 
                        : `${Math.min(((user?.usage.aiMessagesUsed || 0) / planConfig.limits.aiMessages) * 100, 100)}%` 
                    }}
                  />
                </div>
              </div>

              <div className="p-4 rounded-lg bg-muted">
                <p className="text-sm text-muted-foreground">Products</p>
                <p className="text-2xl font-bold mt-1">
                  {/* Product count would come from store */} 4 / {planConfig.limits.products === Infinity ? '∞' : planConfig.limits.products}
                </p>
                <div className="h-2 bg-muted-foreground/20 rounded-full mt-2 overflow-hidden">
                  <div 
                    className="h-full bg-primary rounded-full transition-all"
                    style={{ 
                      width: planConfig.limits.products === Infinity 
                        ? '0%' 
                        : `${Math.min((4 / planConfig.limits.products) * 100, 100)}%` 
                    }}
                  />
                </div>
              </div>

              <div className="p-4 rounded-lg bg-muted">
                <p className="text-sm text-muted-foreground">Scheduled Posts</p>
                <p className="text-2xl font-bold mt-1">
                  {user?.usage.scheduledPostsUsed || 0} / {planConfig.limits.scheduledPosts === Infinity ? '∞' : planConfig.limits.scheduledPosts}
                </p>
                <div className="h-2 bg-muted-foreground/20 rounded-full mt-2 overflow-hidden">
                  <div 
                    className="h-full bg-primary rounded-full transition-all"
                    style={{ 
                      width: planConfig.limits.scheduledPosts === Infinity 
                        ? '0%' 
                        : `${Math.min(((user?.usage.scheduledPostsUsed || 0) / planConfig.limits.scheduledPosts) * 100, 100)}%` 
                    }}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Payment Dialog */}
      {showPayment && selectedPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-card border border-border rounded-xl p-6 w-full max-w-md mx-4"
          >
            <h3 className="text-lg font-semibold mb-4">Confirm Upgrade</h3>
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-muted">
                <p className="text-sm text-muted-foreground">Selected Plan</p>
                <p className="text-xl font-bold">{subscriptionPlans[selectedPlan].name}</p>
                <p className="text-2xl font-bold text-primary mt-1">
                  ${billingCycle === 'yearly' 
                    ? Math.round(subscriptionPlans[selectedPlan].price * 0.8 * 12)
                    : subscriptionPlans[selectedPlan].price
                  }
                  <span className="text-sm text-muted-foreground font-normal">
                    /{billingCycle === 'yearly' ? 'year' : 'month'}
                  </span>
                </p>
              </div>

              <div className="flex items-start gap-2 text-sm text-muted-foreground">
                <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <p>This is a demo. In production, you would be redirected to a payment gateway.</p>
              </div>

              <div className="flex gap-3 pt-4">
                <Button variant="outline" className="flex-1" onClick={() => setShowPayment(false)}>
                  Cancel
                </Button>
                <Button className="flex-1 gradient-primary" onClick={confirmUpgrade}>
                  <CreditCard className="mr-2 h-4 w-4" />
                  Confirm Payment
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}
