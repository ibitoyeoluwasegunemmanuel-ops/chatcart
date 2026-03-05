import { useState } from 'react';
import { motion } from 'framer-motion';
import { useStore, useSubscription } from '@/store';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import {
  Video,
  Sparkles,
  Play,
  Check,
  Loader2,
  Instagram,
  Youtube,
  Music2,
  Facebook,
  Calendar,
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

const videoStyles = [
  { id: 'faceless', name: 'Faceless', description: 'No person on camera' },
  { id: 'talking-head', name: 'AI Avatar', description: 'AI-generated presenter' },
  { id: 'screen-record', name: 'Screen Record', description: 'Screen with voiceover' },
  { id: 'b-roll', name: 'B-Roll', description: 'Stock footage montage' },
];

export function VideoGenerator() {
  const { scripts, videos, generateVideo, canUseAI } = useStore();
  const { planConfig, isFree } = useSubscription();
  
  const [selectedScript, setSelectedScript] = useState<string>('');
  const [videoTitle, setVideoTitle] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('faceless');
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!selectedScript || !videoTitle) {
      toast.error('Please select a script and enter a title');
      return;
    }
    
    if (!canUseAI()) {
      toast.error('Daily AI limit reached. Upgrade to continue.');
      return;
    }
    
    setIsGenerating(true);
    try {
      await generateVideo(selectedScript, videoTitle);
      toast.success('Video generation started! This may take a few minutes.');
    } catch (error) {
      toast.error('Failed to generate video');
    }
    setIsGenerating(false);
  };

  const togglePlatform = (platform: string) => {
    setSelectedPlatforms(prev =>
      prev.includes(platform)
        ? prev.filter(p => p !== platform)
        : [...prev, platform]
    );
  };

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
          <h1 className="text-3xl font-bold">AI Video Generator</h1>
          <p className="text-muted-foreground mt-1">
            Create faceless videos from your scripts
          </p>
        </div>
      </motion.div>

      {/* Usage Bar */}
      {isFree && (
        <motion.div variants={itemVariants}>
          <Card className="bg-pink-500/5 border-pink-500/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Video className="h-4 w-4 text-pink-500" />
                  <span className="text-sm">Daily Videos: {useStore.getState().user?.usage.aiVideosUsed || 0} / {planConfig.limits.aiVideos}</span>
                </div>
                <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-pink-500 rounded-full transition-all"
                    style={{ width: `${Math.min(((useStore.getState().user?.usage.aiVideosUsed || 0) / planConfig.limits.aiVideos) * 100, 100)}%` }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Generator Form */}
        <motion.div variants={itemVariants} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-pink-500" />
                Create Video
              </CardTitle>
              <CardDescription>
                Select a script and customize your video
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Script Selection */}
              <div className="space-y-2">
                <Label>Select Script</Label>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {scripts.map((script) => (
                    <button
                      key={script.id}
                      onClick={() => setSelectedScript(script.id)}
                      className={`w-full p-3 rounded-lg text-left transition-all ${
                        selectedScript === script.id
                          ? 'bg-pink-500/10 border-2 border-pink-500'
                          : 'bg-muted hover:bg-pink-500/5 border-2 border-transparent'
                      }`}
                    >
                      <p className="font-medium">{script.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {script.niche} • {script.duration}s
                      </p>
                    </button>
                  ))}
                  {scripts.length === 0 && (
                    <div className="text-center py-4 text-muted-foreground text-sm">
                      No scripts available. Generate a script first.
                    </div>
                  )}
                </div>
              </div>

              {/* Video Title */}
              <div className="space-y-2">
                <Label htmlFor="title">Video Title</Label>
                <Input
                  id="title"
                  placeholder="Enter video title"
                  value={videoTitle}
                  onChange={(e) => setVideoTitle(e.target.value)}
                />
              </div>

              {/* Video Style */}
              <div className="space-y-2">
                <Label>Video Style</Label>
                <div className="grid grid-cols-2 gap-2">
                  {videoStyles.map((style) => (
                    <button
                      key={style.id}
                      onClick={() => setSelectedStyle(style.id)}
                      className={`p-3 rounded-lg text-left transition-all ${
                        selectedStyle === style.id
                          ? 'bg-pink-500 text-white'
                          : 'bg-muted hover:bg-pink-500/10'
                      }`}
                    >
                      <p className="font-medium text-sm">{style.name}</p>
                      <p className={`text-xs ${selectedStyle === style.id ? 'text-white/70' : 'text-muted-foreground'}`}>
                        {style.description}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Platform Selection */}
              <div className="space-y-2">
                <Label>Target Platforms</Label>
                <div className="flex flex-wrap gap-2">
                  {[
                    { id: 'tiktok', icon: Music2, label: 'TikTok' },
                    { id: 'youtube', icon: Youtube, label: 'YouTube Shorts' },
                    { id: 'instagram', icon: Instagram, label: 'Instagram Reels' },
                    { id: 'facebook', icon: Facebook, label: 'Facebook' },
                  ].map((platform) => (
                    <button
                      key={platform.id}
                      onClick={() => togglePlatform(platform.id)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
                        selectedPlatforms.includes(platform.id)
                          ? 'bg-pink-500 text-white'
                          : 'bg-muted hover:bg-pink-500/10'
                      }`}
                    >
                      <platform.icon className="h-4 w-4" />
                      <span className="text-sm">{platform.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <Button
                className="w-full bg-gradient-to-r from-pink-500 to-rose-600"
                onClick={handleGenerate}
                disabled={isGenerating || !selectedScript}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating Video...
                  </>
                ) : (
                  <>
                    <Video className="mr-2 h-4 w-4" />
                    Generate Video
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Generated Videos */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle>Your Videos</CardTitle>
              <CardDescription>
                Recently generated videos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {videos.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <Video className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No videos yet</p>
                    <p className="text-sm">Generate your first video to get started</p>
                  </div>
                ) : (
                  videos.map((video) => (
                    <div
                      key={video.id}
                      className="p-4 rounded-lg bg-muted/50 space-y-3"
                    >
                      <div className="aspect-video bg-black rounded-lg relative overflow-hidden">
                        {video.status === 'completed' ? (
                          <>
                            <img
                              src={video.thumbnailUrl}
                              alt={video.title}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                              <Button size="icon" variant="secondary">
                                <Play className="h-6 w-6" />
                              </Button>
                            </div>
                          </>
                        ) : video.status === 'generating' ? (
                          <div className="w-full h-full flex items-center justify-center">
                            <div className="text-center">
                              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2 text-pink-500" />
                              <p className="text-sm text-muted-foreground">Generating...</p>
                            </div>
                          </div>
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <p className="text-sm text-muted-foreground">Failed to generate</p>
                          </div>
                        )}
                      </div>
                      <div>
                        <h4 className="font-medium">{video.title}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge 
                            variant={video.status === 'completed' ? 'default' : 'secondary'}
                            className="text-xs"
                          >
                            {video.status === 'completed' && <Check className="mr-1 h-3 w-3" />}
                            {video.status === 'generating' && <Loader2 className="mr-1 h-3 w-3 animate-spin" />}
                            {video.status.charAt(0).toUpperCase() + video.status.slice(1)}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {new Date(video.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      {video.status === 'completed' && (
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" className="flex-1">
                            <Calendar className="mr-1 h-3 w-3" />
                            Schedule
                          </Button>
                          <Button size="sm" variant="outline" className="flex-1">
                            Download
                          </Button>
                        </div>
                      )}
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
