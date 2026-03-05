import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '@/store';
import type { SocialPlatform, ScheduledPost } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import {
  Instagram,
  Facebook,
  Youtube,
  Music2,
  Plus,
  Check,
  Calendar,
  Clock,
  Send,
  Image as ImageIcon,
  X,
  Trash2,
  Share2,
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

const platforms: { id: SocialPlatform; name: string; icon: React.ElementType; color: string }[] = [
  { id: 'instagram', name: 'Instagram', icon: Instagram, color: 'bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500' },
  { id: 'facebook', name: 'Facebook', icon: Facebook, color: 'bg-blue-600' },
  { id: 'tiktok', name: 'TikTok', icon: Music2, color: 'bg-black' },
  { id: 'youtube', name: 'YouTube', icon: Youtube, color: 'bg-red-600' },
];

export function SocialMediaPage() {
  const { user, connectAccount, disconnectAccount, posts, addPost, deletePost } = useStore();
  
  const [activeTab, setActiveTab] = useState('accounts');
  const [showCreatePost, setShowCreatePost] = useState(false);
  
  // Post form state
  const [postContent, setPostContent] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState<SocialPlatform[]>([]);
  const [scheduleDate, setScheduleDate] = useState('');
  const [scheduleTime, setScheduleTime] = useState('');
  const [postImages, setPostImages] = useState<string[]>([]);
  const [isScheduling, setIsScheduling] = useState(false);

  const connectedAccounts = user?.socialAccounts || [];

  const handleConnect = (platform: SocialPlatform) => {
    // Simulate OAuth connection
    const usernames: Record<SocialPlatform, string> = {
      instagram: '@yourstore',
      facebook: 'Your Store',
      tiktok: '@yourstore',
      youtube: 'Your Store',
      twitter: '@yourstore',
    };
    connectAccount(platform, usernames[platform]);
    toast.success(`${platforms.find(p => p.id === platform)?.name} connected!`);
  };

  const handleDisconnect = (platform: SocialPlatform) => {
    disconnectAccount(platform);
    toast.success('Account disconnected');
  };

  const handleCreatePost = (publishNow: boolean = false) => {
    if (!postContent.trim()) {
      toast.error('Please enter post content');
      return;
    }
    if (selectedPlatforms.length === 0) {
      toast.error('Please select at least one platform');
      return;
    }

    const scheduledAt = !publishNow && scheduleDate && scheduleTime
      ? new Date(`${scheduleDate}T${scheduleTime}`).toISOString()
      : undefined;

    addPost({
      content: postContent,
      images: postImages,
      platforms: selectedPlatforms,
      status: publishNow ? 'published' : 'scheduled',
      scheduledAt,
      userId: user?.id || '1',
    });

    toast.success(publishNow ? 'Post published!' : 'Post scheduled!');
    setShowCreatePost(false);
    setPostContent('');
    setSelectedPlatforms([]);
    setScheduleDate('');
    setScheduleTime('');
    setPostImages([]);
  };

  const togglePlatform = (platform: SocialPlatform) => {
    setSelectedPlatforms(prev =>
      prev.includes(platform)
        ? prev.filter(p => p !== platform)
        : [...prev, platform]
    );
  };

  const handleImageUpload = () => {
    // Simulate image upload
    setPostImages(prev => [...prev, `https://picsum.photos/400/400?random=${Math.random()}`]);
  };

  const removeImage = (index: number) => {
    setPostImages(prev => prev.filter((_, i) => i !== index));
  };

  const scheduledPosts = posts.filter(p => p.status === 'scheduled');
  const publishedPosts = posts.filter(p => p.status === 'published');

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
          <h1 className="text-3xl font-bold">Social Media</h1>
          <p className="text-muted-foreground mt-1">
            Manage your social media presence and schedule posts
          </p>
        </div>
        <Button className="gradient-primary" onClick={() => setShowCreatePost(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Create Post
        </Button>
      </motion.div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="accounts">Accounts</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
          <TabsTrigger value="published">Published</TabsTrigger>
        </TabsList>

        {/* Connected Accounts */}
        <TabsContent value="accounts" className="space-y-6">
          <motion.div variants={itemVariants} className="grid gap-4 sm:grid-cols-2">
            {platforms.map((platform) => {
              const Icon = platform.icon;
              const isConnected = connectedAccounts.some(a => a.platform === platform.id);
              const account = connectedAccounts.find(a => a.platform === platform.id);

              return (
                <Card key={platform.id} className="card-hover">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`${platform.color} h-12 w-12 rounded-xl flex items-center justify-center`}>
                          <Icon className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h4 className="font-semibold">{platform.name}</h4>
                          {isConnected ? (
                            <div className="flex items-center gap-2 text-sm text-emerald-600">
                              <Check className="h-4 w-4" />
                              <span>Connected as {account?.username}</span>
                            </div>
                          ) : (
                            <p className="text-sm text-muted-foreground">Not connected</p>
                          )}
                        </div>
                      </div>
                      <Switch
                        checked={isConnected}
                        onCheckedChange={(checked) =>
                          checked ? handleConnect(platform.id) : handleDisconnect(platform.id)
                        }
                      />
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </motion.div>

          {/* Quick Stats */}
          <motion.div variants={itemVariants}>
            <Card className="bg-gradient-to-r from-primary/5 to-violet-500/5">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                    <Share2 className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Social Media Tips</h4>
                    <p className="text-sm text-muted-foreground">
                      Connect your accounts to schedule posts and track engagement across all platforms
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        {/* Scheduled Posts */}
        <TabsContent value="scheduled" className="space-y-6">
          <motion.div variants={itemVariants} className="grid gap-4">
            {scheduledPosts.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
                  <h4 className="font-semibold mb-2">No scheduled posts</h4>
                  <p className="text-sm text-muted-foreground text-center max-w-sm mb-4">
                    Schedule posts to maintain a consistent social media presence
                  </p>
                  <Button onClick={() => setShowCreatePost(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Schedule a Post
                  </Button>
                </CardContent>
              </Card>
            ) : (
              scheduledPosts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  onDelete={() => deletePost(post.id)}
                />
              ))
            )}
          </motion.div>
        </TabsContent>

        {/* Published Posts */}
        <TabsContent value="published" className="space-y-6">
          <motion.div variants={itemVariants} className="grid gap-4">
            {publishedPosts.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Send className="h-12 w-12 text-muted-foreground mb-4" />
                  <h4 className="font-semibold mb-2">No published posts yet</h4>
                  <p className="text-sm text-muted-foreground text-center max-w-sm mb-4">
                    Your published posts will appear here
                  </p>
                  <Button onClick={() => setShowCreatePost(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Create a Post
                  </Button>
                </CardContent>
              </Card>
            ) : (
              publishedPosts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  onDelete={() => deletePost(post.id)}
                />
              ))
            )}
          </motion.div>
        </TabsContent>
      </Tabs>

      {/* Create Post Dialog */}
      <Dialog open={showCreatePost} onOpenChange={setShowCreatePost}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create Post</DialogTitle>
            <DialogDescription>
              Create and schedule content for your social media channels
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Platform Selection */}
            <div className="space-y-2">
              <Label>Select Platforms</Label>
              <div className="flex gap-2 flex-wrap">
                {platforms.map((platform) => {
                  const Icon = platform.icon;
                  const isSelected = selectedPlatforms.includes(platform.id);
                  const isConnected = connectedAccounts.some(a => a.platform === platform.id);
                  
                  return (
                    <button
                      key={platform.id}
                      onClick={() => isConnected && togglePlatform(platform.id)}
                      disabled={!isConnected}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-all ${
                        isSelected
                          ? 'border-primary bg-primary/10'
                          : isConnected
                          ? 'border-border hover:border-primary/50'
                          : 'border-border opacity-50 cursor-not-allowed'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span className="text-sm">{platform.name}</span>
                      {!isConnected && <span className="text-xs text-muted-foreground">(connect)</span>}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Content */}
            <div className="space-y-2">
              <Label htmlFor="content">Post Content</Label>
              <Textarea
                id="content"
                placeholder="What's on your mind?"
                rows={4}
                value={postContent}
                onChange={(e) => setPostContent(e.target.value)}
              />
            </div>

            {/* Images */}
            <div className="space-y-2">
              <Label>Images</Label>
              <div className="flex gap-2">
                <Button variant="outline" type="button" onClick={handleImageUpload}>
                  <ImageIcon className="mr-2 h-4 w-4" />
                  Add Image
                </Button>
              </div>
              {postImages.length > 0 && (
                <div className="flex gap-2 flex-wrap">
                  {postImages.map((image, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={image}
                        alt={`Preview ${index + 1}`}
                        className="h-20 w-20 object-cover rounded-lg"
                      />
                      <button
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 h-6 w-6 bg-destructive text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Scheduling */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Schedule Post</Label>
                <Switch
                  checked={isScheduling}
                  onCheckedChange={setIsScheduling}
                />
              </div>
              
              <AnimatePresence>
                {isScheduling && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="grid gap-4 sm:grid-cols-2"
                  >
                    <div className="space-y-2">
                      <Label htmlFor="date">Date</Label>
                      <Input
                        id="date"
                        type="date"
                        value={scheduleDate}
                        onChange={(e) => setScheduleDate(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="time">Time</Label>
                      <Input
                        id="time"
                        type="time"
                        value={scheduleTime}
                        onChange={(e) => setScheduleTime(e.target.value)}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setShowCreatePost(false)}>
              Cancel
            </Button>
            <Button
              className="gradient-primary"
              onClick={() => handleCreatePost(!isScheduling)}
            >
              {isScheduling ? (
                <>
                  <Calendar className="mr-2 h-4 w-4" />
                  Schedule Post
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Post Now
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}

// Post Card Component
function PostCard({ post, onDelete }: { post: ScheduledPost; onDelete: () => void }) {
  return (
    <Card className="card-hover">
      <CardContent className="p-6">
        <div className="flex gap-4">
          {post.images.length > 0 && (
            <img
              src={post.images[0]}
              alt="Post"
              className="h-24 w-24 object-cover rounded-lg flex-shrink-0"
            />
          )}
          <div className="flex-1 min-w-0">
            <p className="text-sm line-clamp-3 mb-2">{post.content}</p>
            <div className="flex items-center gap-2 flex-wrap">
              {post.platforms.map((platform) => {
                const platformInfo = platforms.find(p => p.id === platform);
                const Icon = platformInfo?.icon || Share2;
                return (
                  <Badge key={platform} variant="secondary" className="text-xs">
                    <Icon className="mr-1 h-3 w-3" />
                    {platformInfo?.name}
                  </Badge>
                );
              })}
              {post.scheduledAt && (
                <Badge variant="outline" className="text-xs">
                  <Clock className="mr-1 h-3 w-3" />
                  {new Date(post.scheduledAt).toLocaleString()}
                </Badge>
              )}
              {post.publishedAt && (
                <Badge variant="outline" className="text-xs status-delivered">
                  <Check className="mr-1 h-3 w-3" />
                  {new Date(post.publishedAt).toLocaleString()}
                </Badge>
              )}
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onDelete} className="text-destructive">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
