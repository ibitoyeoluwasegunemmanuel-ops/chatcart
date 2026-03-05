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
  FileText,
  Sparkles,
  Copy,
  Check,
  Clock,
  Zap,
  ArrowRight,
  TrendingUp,
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

const niches = [
  'Productivity',
  'Self Improvement',
  'Finance',
  'Health & Fitness',
  'Technology',
  'Business',
  'Education',
  'Entertainment',
];

const tones = [
  { value: 'energetic', label: 'Energetic' },
  { value: 'calm', label: 'Calm' },
  { value: 'professional', label: 'Professional' },
  { value: 'funny', label: 'Funny' },
  { value: 'motivational', label: 'Motivational' },
  { value: 'storytelling', label: 'Storytelling' },
];

const durations = [
  { value: 30, label: '30 seconds' },
  { value: 60, label: '1 minute' },
  { value: 90, label: '1.5 minutes' },
  { value: 120, label: '2 minutes' },
];

export function ScriptGenerator() {
  const { scripts, generateScript, canUseAI } = useStore();
  const { planConfig, isFree } = useSubscription();
  
  const [selectedNiche, setSelectedNiche] = useState('Productivity');
  const [selectedTone, setSelectedTone] = useState('energetic');
  const [selectedDuration, setSelectedDuration] = useState(60);
  const [topic, setTopic] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!canUseAI()) {
      toast.error('Daily AI limit reached. Upgrade to continue.');
      return;
    }
    
    setIsGenerating(true);
    try {
      await generateScript(selectedNiche, selectedDuration, selectedTone);
      toast.success('Script generated successfully!');
    } catch (error) {
      toast.error('Failed to generate script');
    }
    setIsGenerating(false);
  };

  const handleCopy = (id: string, content: string) => {
    navigator.clipboard.writeText(content);
    setCopiedId(id);
    toast.success('Copied to clipboard!');
    setTimeout(() => setCopiedId(null), 2000);
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
          <h1 className="text-3xl font-bold">AI Script Generator</h1>
          <p className="text-muted-foreground mt-1">
            Create engaging video scripts with AI
          </p>
        </div>
      </motion.div>

      {/* Usage Bar */}
      {isFree && (
        <motion.div variants={itemVariants}>
          <Card className="bg-violet-500/5 border-violet-500/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-violet-500" />
                  <span className="text-sm">Daily Scripts: {useStore.getState().user?.usage.aiScriptsUsed || 0} / {planConfig.limits.aiScripts}</span>
                </div>
                <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-violet-500 rounded-full transition-all"
                    style={{ width: `${Math.min(((useStore.getState().user?.usage.aiScriptsUsed || 0) / planConfig.limits.aiScripts) * 100, 100)}%` }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Generator Form */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-violet-500" />
                Generate Script
              </CardTitle>
              <CardDescription>
                Customize your script parameters
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Niche Selection */}
              <div className="space-y-2">
                <Label>Content Niche</Label>
                <div className="flex flex-wrap gap-2">
                  {niches.map((niche) => (
                    <button
                      key={niche}
                      onClick={() => setSelectedNiche(niche)}
                      className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                        selectedNiche === niche
                          ? 'bg-violet-500 text-white'
                          : 'bg-muted hover:bg-violet-500/10'
                      }`}
                    >
                      {niche}
                    </button>
                  ))}
                </div>
              </div>

              {/* Topic Input */}
              <div className="space-y-2">
                <Label htmlFor="topic">Topic (Optional)</Label>
                <Input
                  id="topic"
                  placeholder="e.g., Morning routines for success"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                />
              </div>

              {/* Tone Selection */}
              <div className="space-y-2">
                <Label>Tone</Label>
                <div className="grid grid-cols-3 gap-2">
                  {tones.map((tone) => (
                    <button
                      key={tone.value}
                      onClick={() => setSelectedTone(tone.value)}
                      className={`p-2 rounded-lg text-sm transition-all ${
                        selectedTone === tone.value
                          ? 'bg-violet-500 text-white'
                          : 'bg-muted hover:bg-violet-500/10'
                      }`}
                    >
                      {tone.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Duration Selection */}
              <div className="space-y-2">
                <Label>Duration</Label>
                <div className="grid grid-cols-4 gap-2">
                  {durations.map((duration) => (
                    <button
                      key={duration.value}
                      onClick={() => setSelectedDuration(duration.value)}
                      className={`p-2 rounded-lg text-sm transition-all ${
                        selectedDuration === duration.value
                          ? 'bg-violet-500 text-white'
                          : 'bg-muted hover:bg-violet-500/10'
                      }`}
                    >
                      {duration.label}
                    </button>
                  ))}
                </div>
              </div>

              <Button
                className="w-full bg-gradient-to-r from-violet-500 to-purple-600"
                onClick={handleGenerate}
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    >
                      <Sparkles className="mr-2 h-4 w-4" />
                    </motion.div>
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Generate Script
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Generated Scripts */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle>Your Scripts</CardTitle>
              <CardDescription>
                Recently generated scripts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-[500px] overflow-y-auto">
                {scripts.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No scripts yet</p>
                    <p className="text-sm">Generate your first script to get started</p>
                  </div>
                ) : (
                  scripts.map((script) => (
                    <div
                      key={script.id}
                      className="p-4 rounded-lg bg-muted/50 space-y-3"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-medium">{script.title}</h4>
                          <div className="flex gap-2 mt-1">
                            <Badge variant="secondary" className="text-xs">
                              {script.niche}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              <Clock className="mr-1 h-3 w-3" />
                              {script.duration}s
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {script.tone}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleCopy(script.id, script.content)}
                          >
                            {copiedId === script.id ? (
                              <Check className="h-4 w-4 text-emerald-500" />
                            ) : (
                              <Copy className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                      <div className="bg-background rounded-lg p-3 text-sm whitespace-pre-line">
                        {script.content}
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="flex-1">
                          <ArrowRight className="mr-1 h-3 w-3" />
                          Create Video
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1">
                          <TrendingUp className="mr-1 h-3 w-3" />
                          Generate Voice
                        </Button>
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
