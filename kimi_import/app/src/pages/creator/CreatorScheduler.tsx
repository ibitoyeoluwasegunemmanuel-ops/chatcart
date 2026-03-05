import { useState } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '@/store';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { toast } from 'sonner';
import {
  Calendar as CalendarIcon,
  Clock,
  Instagram,
  Youtube,
  Music2,
  Facebook,
  Send,
  Video,
  FileText,
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

export function CreatorScheduler() {
  const { videos, scripts, posts, addPost, canSchedulePost } = useStore();
  
  const [selectedContent, setSelectedContent] = useState<{ type: 'video' | 'script', id: string } | null>(null);
  const [caption, setCaption] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState('09:00');

  const platforms = [
    { id: 'tiktok', name: 'TikTok', icon: Music2, color: 'bg-black' },
    { id: 'youtube', name: 'YouTube Shorts', icon: Youtube, color: 'bg-red-600' },
    { id: 'instagram', name: 'Instagram Reels', icon: Instagram, color: 'bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500' },
    { id: 'facebook', name: 'Facebook', icon: Facebook, color: 'bg-blue-600' },
  ];

  const handleSchedule = () => {
    if (!selectedContent) {
      toast.error('Please select content to schedule');
      return;
    }
    if (!caption.trim()) {
      toast.error('Please enter a caption');
      return;
    }
    if (selectedPlatforms.length === 0) {
      toast.error('Please select at least one platform');
      return;
    }
    if (!selectedDate) {
      toast.error('Please select a date');
      return;
    }

    if (!canSchedulePost()) {
      toast.error('Weekly post limit reached. Upgrade to schedule more.');
      return;
    }

    const scheduledAt = new Date(selectedDate);
    const [hours, minutes] = selectedTime.split(':');
    scheduledAt.setHours(parseInt(hours), parseInt(minutes));

    addPost({
      content: caption,
      images: [],
      platforms: selectedPlatforms as any,
      status: 'scheduled',
      scheduledAt: scheduledAt.toISOString(),
      userId: '1',
    });

    toast.success('Content scheduled successfully!');
    
    // Reset form
    setSelectedContent(null);
    setCaption('');
    setSelectedPlatforms([]);
    setSelectedDate(undefined);
  };

  const togglePlatform = (platformId: string) => {
    setSelectedPlatforms(prev =>
      prev.includes(platformId)
        ? prev.filter(p => p !== platformId)
        : [...prev, platformId]
    );
  };

  const scheduledPosts = posts.filter(p => p.status === 'scheduled');

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
          <h1 className="text-3xl font-bold">Content Scheduler</h1>
          <p className="text-muted-foreground mt-1">
            Plan and schedule your content releases
          </p>
        </div>
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Schedule Form */}
        <motion.div variants={itemVariants} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarIcon className="h-5 w-5 text-emerald-500" />
                Schedule Content
              </CardTitle>
              <CardDescription>
                Choose content and schedule your posts
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Content Selection */}
              <div className="space-y-2">
                <Label>Select Content</Label>
                <div className="grid grid-cols-2 gap-2">
                  {/* Videos */}
                  {videos.filter(v => v.status === 'completed').map((video) => (
                    <button
                      key={video.id}
                      onClick={() => setSelectedContent({ type: 'video', id: video.id })}
                      className={`p-3 rounded-lg text-left transition-all ${
                        selectedContent?.type === 'video' && selectedContent?.id === video.id
                          ? 'bg-emerald-500 text-white'
                          : 'bg-muted hover:bg-emerald-500/10'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Video className="h-4 w-4" />
                        <span className="text-sm font-medium truncate">{video.title}</span>
                      </div>
                    </button>
                  ))}
                  {/* Scripts */}
                  {scripts.map((script) => (
                    <button
                      key={script.id}
                      onClick={() => setSelectedContent({ type: 'script', id: script.id })}
                      className={`p-3 rounded-lg text-left transition-all ${
                        selectedContent?.type === 'script' && selectedContent?.id === script.id
                          ? 'bg-emerald-500 text-white'
                          : 'bg-muted hover:bg-emerald-500/10'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        <span className="text-sm font-medium truncate">{script.title}</span>
                      </div>
                    </button>
                  ))}
                </div>
                {videos.filter(v => v.status === 'completed').length === 0 && scripts.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No content available. Generate videos or scripts first.
                  </p>
                )}
              </div>

              {/* Caption */}
              <div className="space-y-2">
                <Label htmlFor="caption">Caption</Label>
                <Textarea
                  id="caption"
                  placeholder="Write your caption..."
                  rows={4}
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                />
              </div>

              {/* Platform Selection */}
              <div className="space-y-2">
                <Label>Platforms</Label>
                <div className="grid grid-cols-2 gap-2">
                  {platforms.map((platform) => (
                    <button
                      key={platform.id}
                      onClick={() => togglePlatform(platform.id)}
                      className={`p-3 rounded-lg flex items-center gap-2 transition-all ${
                        selectedPlatforms.includes(platform.id)
                          ? 'bg-emerald-500 text-white'
                          : 'bg-muted hover:bg-emerald-500/10'
                      }`}
                    >
                      <platform.icon className="h-4 w-4" />
                      <span className="text-sm">{platform.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Date & Time */}
              <div className="space-y-4">
                <Label>Schedule Date</Label>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-md border"
                  disabled={(date) => date < new Date()}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="time">Time</Label>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <Input
                    id="time"
                    type="time"
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                  />
                </div>
              </div>

              <Button
                className="w-full bg-gradient-to-r from-emerald-500 to-teal-600"
                onClick={handleSchedule}
                disabled={!selectedContent || !caption || selectedPlatforms.length === 0 || !selectedDate}
              >
                <Send className="mr-2 h-4 w-4" />
                Schedule Post
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Scheduled Posts */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Posts</CardTitle>
              <CardDescription>
                Your scheduled content calendar
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {scheduledPosts.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <CalendarIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No scheduled posts</p>
                    <p className="text-sm">Schedule your first post to get started</p>
                  </div>
                ) : (
                  scheduledPosts.map((post) => (
                    <div
                      key={post.id}
                      className="p-4 rounded-lg bg-muted/50 space-y-3"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium line-clamp-2">{post.content}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant="outline" className="text-xs">
                              <Clock className="mr-1 h-3 w-3" />
                              {post.scheduledAt && new Date(post.scheduledAt).toLocaleString()}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {post.platforms.map((platform) => {
                          const platformInfo = platforms.find(p => p.id === platform);
                          return platformInfo ? (
                            <div
                              key={platform}
                              className={`${platformInfo.color} h-6 w-6 rounded flex items-center justify-center`}
                            >
                              <platformInfo.icon className="h-3 w-3 text-white" />
                            </div>
                          ) : null;
                        })}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}
