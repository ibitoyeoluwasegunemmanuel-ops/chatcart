import { useState } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '@/store';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import {
  Mic,
  Sparkles,
  Play,
  Pause,
  Volume2,
  Loader2,
  Check,
  Download,
  Music,
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

const voiceTypes = [
  { id: 'neutral', name: 'Neutral', description: 'Balanced, professional tone' },
  { id: 'energetic', name: 'Energetic', description: 'Upbeat and enthusiastic' },
  { id: 'calm', name: 'Calm', description: 'Relaxed and soothing' },
  { id: 'authoritative', name: 'Authoritative', description: 'Confident and commanding' },
  { id: 'friendly', name: 'Friendly', description: 'Warm and approachable' },
  { id: 'dramatic', name: 'Dramatic', description: 'Emotional and intense' },
];

export function VoiceGenerator() {
  const { scripts, voices, generateVoice } = useStore();
  
  const [selectedScript, setSelectedScript] = useState<string>('');
  const [selectedVoice, setSelectedVoice] = useState('neutral');
  const [speed, setSpeed] = useState([1]);
  const [pitch, setPitch] = useState([1]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [playingId, setPlayingId] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!selectedScript) {
      toast.error('Please select a script');
      return;
    }
    
    setIsGenerating(true);
    try {
      await generateVoice(selectedScript, selectedVoice);
      toast.success('Voiceover generated!');
    } catch (error) {
      toast.error('Failed to generate voice');
    }
    setIsGenerating(false);
  };

  const togglePlay = (id: string) => {
    if (playingId === id) {
      setPlayingId(null);
    } else {
      setPlayingId(id);
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
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">AI Voice Generator</h1>
          <p className="text-muted-foreground mt-1">
            Create professional voiceovers for your content
          </p>
        </div>
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Generator Form */}
        <motion.div variants={itemVariants} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-amber-500" />
                Generate Voiceover
              </CardTitle>
              <CardDescription>
                Select a script and customize the voice
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
                          ? 'bg-amber-500/10 border-2 border-amber-500'
                          : 'bg-muted hover:bg-amber-500/5 border-2 border-transparent'
                      }`}
                    >
                      <p className="font-medium">{script.title}</p>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {script.content.substring(0, 100)}...
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

              {/* Voice Type */}
              <div className="space-y-2">
                <Label>Voice Type</Label>
                <div className="grid grid-cols-2 gap-2">
                  {voiceTypes.map((voice) => (
                    <button
                      key={voice.id}
                      onClick={() => setSelectedVoice(voice.id)}
                      className={`p-3 rounded-lg text-left transition-all ${
                        selectedVoice === voice.id
                          ? 'bg-amber-500 text-white'
                          : 'bg-muted hover:bg-amber-500/10'
                      }`}
                    >
                      <p className="font-medium text-sm">{voice.name}</p>
                      <p className={`text-xs ${selectedVoice === voice.id ? 'text-white/70' : 'text-muted-foreground'}`}>
                        {voice.description}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Speed Control */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label>Speed</Label>
                  <span className="text-sm text-muted-foreground">{speed[0]}x</span>
                </div>
                <Slider
                  value={speed}
                  onValueChange={setSpeed}
                  min={0.5}
                  max={2}
                  step={0.1}
                />
              </div>

              {/* Pitch Control */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label>Pitch</Label>
                  <span className="text-sm text-muted-foreground">{pitch[0]}x</span>
                </div>
                <Slider
                  value={pitch}
                  onValueChange={setPitch}
                  min={0.5}
                  max={2}
                  step={0.1}
                />
              </div>

              <Button
                className="w-full bg-gradient-to-r from-amber-500 to-orange-600"
                onClick={handleGenerate}
                disabled={isGenerating || !selectedScript}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating Voice...
                  </>
                ) : (
                  <>
                    <Mic className="mr-2 h-4 w-4" />
                    Generate Voiceover
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Generated Voices */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle>Your Voiceovers</CardTitle>
              <CardDescription>
                Recently generated voiceovers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {voices.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <Mic className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No voiceovers yet</p>
                    <p className="text-sm">Generate your first voiceover to get started</p>
                  </div>
                ) : (
                  voices.map((voice) => (
                    <div
                      key={voice.id}
                      className="p-4 rounded-lg bg-muted/50 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-amber-500/10 flex items-center justify-center">
                            <Music className="h-5 w-5 text-amber-500" />
                          </div>
                          <div>
                            <p className="font-medium">Voiceover #{voice.id.slice(-4)}</p>
                            <p className="text-sm text-muted-foreground">
                              {voice.voiceType} • {new Date(voice.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <Badge 
                          variant={voice.status === 'completed' ? 'default' : 'secondary'}
                        >
                          {voice.status === 'completed' && <Check className="mr-1 h-3 w-3" />}
                          {voice.status.charAt(0).toUpperCase() + voice.status.slice(1)}
                        </Badge>
                      </div>

                      {/* Audio Player */}
                      {voice.status === 'completed' && (
                        <div className="flex items-center gap-3 p-3 bg-background rounded-lg">
                          <Button
                            size="icon"
                            variant="outline"
                            onClick={() => togglePlay(voice.id)}
                          >
                            {playingId === voice.id ? (
                              <Pause className="h-4 w-4" />
                            ) : (
                              <Play className="h-4 w-4" />
                            )}
                          </Button>
                          <div className="flex-1">
                            <div className="h-2 bg-muted rounded-full overflow-hidden">
                              <div className="h-full w-1/3 bg-amber-500 rounded-full" />
                            </div>
                          </div>
                          <span className="text-sm text-muted-foreground">0:30</span>
                          <Button size="icon" variant="ghost">
                            <Volume2 className="h-4 w-4" />
                          </Button>
                        </div>
                      )}

                      {voice.status === 'completed' && (
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" className="flex-1">
                            <Download className="mr-1 h-3 w-3" />
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
