import { motion } from 'framer-motion';
import { useStore } from '@/store';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Users,
  Store,
  Video,
  DollarSign,
  CreditCard,
  ShoppingCart,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
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

export function AdminDashboard() {
  const { adminStats } = useStore();

  const stats = [
    {
      title: 'Total Users',
      value: adminStats.totalUsers,
      icon: Users,
      trend: '+12%',
      trendUp: true,
      color: 'bg-blue-500',
    },
    {
      title: 'Vendors',
      value: adminStats.totalVendors,
      icon: Store,
      trend: '+8%',
      trendUp: true,
      color: 'bg-violet-500',
    },
    {
      title: 'Creators',
      value: adminStats.totalCreators,
      icon: Video,
      trend: '+15%',
      trendUp: true,
      color: 'bg-pink-500',
    },
    {
      title: 'Total Revenue',
      value: `$${adminStats.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      trend: '+23%',
      trendUp: true,
      color: 'bg-emerald-500',
    },
    {
      title: 'Active Subscriptions',
      value: adminStats.activeSubscriptions,
      icon: CreditCard,
      trend: '+18%',
      trendUp: true,
      color: 'bg-amber-500',
    },
    {
      title: 'Daily Orders',
      value: adminStats.dailyOrders,
      icon: ShoppingCart,
      trend: '+5%',
      trendUp: true,
      color: 'bg-cyan-500',
    },
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
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Platform overview and key metrics
        </p>
      </motion.div>

      {/* Stats Grid */}
      <motion.div variants={itemVariants} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.title} className="card-hover">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className={`${stat.color} p-3 rounded-xl`}>
                  <stat.icon className="h-5 w-5 text-white" />
                </div>
                <div className="flex items-center gap-1 text-sm">
                  {stat.trendUp ? (
                    <ArrowUpRight className="h-4 w-4 text-emerald-500" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4 text-red-500" />
                  )}
                  <span className={stat.trendUp ? 'text-emerald-500' : 'text-red-500'}>
                    {stat.trend}
                  </span>
                </div>
              </div>
              <div className="mt-4">
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.title}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      {/* Recent Activity & Quick Actions */}
      <motion.div variants={itemVariants} className="grid gap-6 lg:grid-cols-2">
        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common administrative tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <Button variant="outline" className="h-auto py-4 flex flex-col items-center gap-2">
                <Users className="h-6 w-6" />
                <span className="text-sm">Manage Users</span>
              </Button>
              <Button variant="outline" className="h-auto py-4 flex flex-col items-center gap-2">
                <CreditCard className="h-6 w-6" />
                <span className="text-sm">Subscriptions</span>
              </Button>
              <Button variant="outline" className="h-auto py-4 flex flex-col items-center gap-2">
                <DollarSign className="h-6 w-6" />
                <span className="text-sm">Payments</span>
              </Button>
              <Button variant="outline" className="h-auto py-4 flex flex-col items-center gap-2">
                <TrendingUp className="h-6 w-6" />
                <span className="text-sm">Analytics</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Pending Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Pending Actions</CardTitle>
            <CardDescription>Items requiring attention</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-amber-500/20 flex items-center justify-center">
                    <DollarSign className="h-5 w-5 text-amber-600" />
                  </div>
                  <div>
                    <p className="font-medium">Payment Confirmations</p>
                    <p className="text-sm text-muted-foreground">
                      {adminStats.pendingPayments} payments awaiting confirmation
                    </p>
                  </div>
                </div>
                <Button size="sm">Review</Button>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                    <Users className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">New Registrations</p>
                    <p className="text-sm text-muted-foreground">
                      24 new users registered today
                    </p>
                  </div>
                </div>
                <Button size="sm" variant="outline">View</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
