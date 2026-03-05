import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useStore, useSubscription } from '@/store';
import { SplineSceneBasic } from '@/components/ui/demo';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  FileText,
  Video,
  Mic,
  Calendar,
  Sparkles,
  ArrowRight,
  Zap,
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

export function CreatorDashboard() {
  const { 
    scripts, 
    videos, 
    voices, 
    posts, 
    isLoading, 
    setLoading, 
    setCurrentPage,
    user,
  } = useStore();
  
  const { planConfig, isFree } = useSubscription();

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, [setLoading]);

  const stats = [
    {
      title: 'AI Scripts',
      value: scripts.length,
      icon: FileText,
      color: 'bg-violet-500',
      onClick: () => setCurrentPage('scripts'),
    },
    {
      title: 'Videos Generated',
      value: videos.length,
      icon: Video,
      color: 'bg-pink-500',
      onClick: () => setCurrentPage('videos'),
    },
    {
      title: 'Voiceovers',
      value: voices.length,
      icon: Mic,
      color: 'bg-amber-500',
      onClick: () => setCurrentPage('voices'),
    },
    {
      title: 'Scheduled Posts',
      value: posts.filter(p => p.status === 'scheduled').length,
      icon: Calendar,
      color: 'bg-emerald-500',
      onClick: () => setCurrentPage('scheduler'),
    },
  ];

  const quickActions = [
    {
      title: 'Generate Script',
      description: 'Create AI-powered video scripts',
      icon: FileText,
      color: 'from-violet-500 to-purple-600',
      onClick: () => setCurrentPage('scripts'),
    },
    {
      title: 'Create Video',
      description: 'Generate faceless videos',
      icon: Video,
      color: 'from-pink-500 to-rose-600',
      onClick: () => setCurrentPage('videos'),
    },
    {
      title: 'Generate Voice',
      description: 'Create AI voiceovers',
      icon: Mic,
      color: 'from-amber-500 to-orange-600',
      onClick: () => setCurrentPage('voices'),
    },
  ];

  const recentScripts = scripts.slice(0, 3);
  const scheduledPosts = posts.filter(p => p.status === 'scheduled').slice(0, 3);

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Creator Studio</h1>
          <p className="text-muted-foreground mt-1">
            Generate faceless content with AI
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => setCurrentPage('scripts')}>
            <FileText className="mr-2 h-4 w-4" />
            New Script
          </Button>
          <Button 
            className="bg-gradient-to-r from-violet-500 to-purple-600"
            onClick={() => setCurrentPage('videos')}
          >
            <Sparkles className="mr-2 h-4 w-4" />
            Create Video
          </Button>
        </div>
      </motion.div>

      <motion.div variants={itemVariants}>
        <SplineSceneBasic />
      </motion.div>

      {/* Usage Alert for Free Users */}
      {isFree && (
        <motion.div variants={itemVariants}>
          <Card className="bg-amber-500/10 border-amber-500/30">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-amber-500/20 flex items-center justify-center">
                  <Zap className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <p className="font-medium">Free Plan Active</p>
                  <p className="text-sm text-muted-foreground">
                    {user?.usage.aiScriptsUsed || 0} / {planConfig.limits.aiScripts} scripts used today
                  </p>
                </div>
              </div>
              <Button 
                size="sm" 
                className="bg-gradient-to-r from-violet-500 to-purple-600"
                onClick={() => setCurrentPage('subscription')}
              >
                Upgrade
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Stats Grid */}
      <motion.div variants={itemVariants} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <motion.div
            key={stat.title}
            variants={itemVariants}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
          >
            <Card 
              className="cursor-pointer card-hover overflow-hidden"
              onClick={stat.onClick}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className={`${stat.color} p-3 rounded-xl`}>
                    <stat.icon className="h-5 w-5 text-white" />
                  </div>
                </div>
                <div className="mt-4">
                  {isLoading ? (
                    <Skeleton className="h-8 w-24" />
                  ) : (
                    <>
                      <p className="text-2xl font-bold">{stat.value}</p>
                      <p className="text-sm text-muted-foreground">{stat.title}</p>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Quick Actions */}
      <motion.div variants={itemVariants}>
        <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {quickActions.map((action) => (
            <Card 
              key={action.title}
              className="cursor-pointer card-hover group overflow-hidden"
              onClick={action.onClick}
            >
              <CardContent className="p-6">
                <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <action.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold">{action.title}</h3>
                <p className="text-sm text-muted-foreground">{action.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </motion.div>

      {/* Recent Activity */}
      <motion.div variants={itemVariants} className="grid gap-6 lg:grid-cols-2">
        {/* Recent Scripts */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Scripts</CardTitle>
              <CardDescription>Your latest AI-generated scripts</CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setCurrentPage('scripts')}>
              View All
              <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentScripts.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <FileText className="mx-auto h-12 w-12 mb-3 opacity-50" />
                  <p>No scripts yet</p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-3"
                    onClick={() => setCurrentPage('scripts')}
                  >
                    Generate Your First Script
                  </Button>
                </div>
              ) : (
                recentScripts.map((script) => (
                  <div
                    key={script.id}
                    className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-500/10">
                      <FileText className="h-5 w-5 text-violet-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{script.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {script.niche} • {script.duration}s • {script.tone}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Scheduled Posts */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Scheduled Posts</CardTitle>
              <CardDescription>Upcoming content releases</CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setCurrentPage('scheduler')}>
              View All
              <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {scheduledPosts.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Calendar className="mx-auto h-12 w-12 mb-3 opacity-50" />
                  <p>No scheduled posts</p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-3"
                    onClick={() => setCurrentPage('scheduler')}
                  >
                    Schedule Content
                  </Button>
                </div>
              ) : (
                scheduledPosts.map((post) => (
                  <div
                    key={post.id}
                    className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-pink-500/10">
                      <Clock className="h-5 w-5 text-pink-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium line-clamp-1">{post.content}</p>
                      <p className="text-sm text-muted-foreground">
                        {post.scheduledAt && new Date(post.scheduledAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
