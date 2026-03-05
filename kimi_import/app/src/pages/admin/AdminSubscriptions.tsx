import { motion } from 'framer-motion';
import { useStore, subscriptionPlans } from '@/store';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  CreditCard,
  TrendingUp,
  Users,
  DollarSign,
  Check,
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

export function AdminSubscriptions() {
  const { adminStats } = useStore();

  const planDistribution = [
    { plan: 'Free', count: 570, percentage: 45, color: 'bg-gray-500' },
    { plan: 'Starter', count: 340, percentage: 27, color: 'bg-blue-500' },
    { plan: 'Pro', count: 280, percentage: 22, color: 'bg-violet-500' },
    { plan: 'Business', count: 60, percentage: 6, color: 'bg-amber-500' },
  ];

  const revenueByPlan = [
    { plan: 'Starter', revenue: 3400, color: 'bg-blue-500' },
    { plan: 'Pro', revenue: 8400, color: 'bg-violet-500' },
    { plan: 'Business', revenue: 4140, color: 'bg-amber-500' },
  ];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* Header */}
      <motion.div variants={itemVariants}>
        <h1 className="text-3xl font-bold">Subscriptions</h1>
        <p className="text-muted-foreground mt-1">
          Manage subscription plans and revenue
        </p>
      </motion.div>

      {/* Stats */}
      <motion.div variants={itemVariants} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-violet-500/10 flex items-center justify-center">
                <CreditCard className="h-6 w-6 text-violet-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{adminStats.activeSubscriptions}</p>
                <p className="text-sm text-muted-foreground">Active Subscriptions</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-emerald-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">${adminStats.totalRevenue.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Monthly Revenue</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">+23%</p>
                <p className="text-sm text-muted-foreground">Growth Rate</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-amber-500/10 flex items-center justify-center">
                <Users className="h-6 w-6 text-amber-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">54%</p>
                <p className="text-sm text-muted-foreground">Conversion Rate</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Plan Distribution & Revenue */}
      <motion.div variants={itemVariants} className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Plan Distribution</CardTitle>
            <CardDescription>Users by subscription plan</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {planDistribution.map((item) => (
                <div key={item.plan} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{item.plan}</span>
                    <span className="text-sm text-muted-foreground">
                      {item.count} users ({item.percentage}%)
                    </span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${item.color} rounded-full transition-all`}
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Revenue by Plan</CardTitle>
            <CardDescription>Monthly recurring revenue</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {revenueByPlan.map((item) => (
                <div key={item.plan} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-3">
                    <div className={`h-3 w-3 rounded-full ${item.color}`} />
                    <span className="font-medium">{item.plan}</span>
                  </div>
                  <span className="font-bold">${item.revenue.toLocaleString()}/mo</span>
                </div>
              ))}
              <div className="border-t pt-4 mt-4">
                <div className="flex items-center justify-between">
                  <span className="font-semibold">Total MRR</span>
                  <span className="text-2xl font-bold text-emerald-500">
                    ${revenueByPlan.reduce((sum, item) => sum + item.revenue, 0).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Plan Details */}
      <motion.div variants={itemVariants}>
        <h2 className="text-lg font-semibold mb-4">Subscription Plans</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Object.entries(subscriptionPlans).map(([key, plan]) => (
            <Card key={key} className={plan.popular ? 'border-primary/50' : ''}>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">${plan.price}</p>
                <p className="text-sm text-muted-foreground mb-4">/month</p>
                <ul className="space-y-2">
                  {plan.features.slice(0, 3).map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm">
                      <Check className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
