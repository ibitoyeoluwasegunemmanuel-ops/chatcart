import { useState } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '@/store';
import type { ContentType } from '@/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import {
  Sparkles,
  Copy,
  Check,
  MessageSquare,
  Hash,
  Megaphone,
  Instagram,
  Zap,
  Plus,
  Trash2,
  Edit3,
  Wand2,
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

const contentTypes: { id: ContentType; label: string; icon: React.ElementType; description: string }[] = [
  {
    id: 'caption',
    label: 'Product Caption',
    icon: MessageSquare,
    description: 'Generate engaging product descriptions',
  },
  {
    id: 'post',
    label: 'Social Media Post',
    icon: Instagram,
    description: 'Create posts for social platforms',
  },
  {
    id: 'ad',
    label: 'Ad Copy',
    icon: Megaphone,
    description: 'Generate compelling advertisement copy',
  },
  {
    id: 'hashtags',
    label: 'Hashtags',
    icon: Hash,
    description: 'Generate relevant hashtags',
  },
];

export function AutomationPage() {
  const { generateContent, saveContent, rules, addRule, deleteRule, toggleRule } = useStore();
  
  const [selectedType, setSelectedType] = useState<ContentType>('caption');
  const [prompt, setPrompt] = useState('');
  const [generatedContent, setGeneratedContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  
  // Automation rule form
  const [showRuleForm, setShowRuleForm] = useState(false);
  const [ruleForm, setRuleForm] = useState({
    name: '',
    trigger: 'new_product' as const,
    action: 'generate_content' as const,
  });

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error('Please enter a prompt');
      return;
    }
    
    setIsGenerating(true);
    const content = await generateContent(selectedType, prompt);
    setGeneratedContent(content);
    setIsGenerating(false);
    
    // Save to history
    saveContent({
      type: selectedType,
      prompt,
      content,
      userId: '1',
    });
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedContent);
    setCopied(true);
    toast.success('Copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAddRule = () => {
    if (!ruleForm.name) {
      toast.error('Please enter a rule name');
      return;
    }
    
    addRule({
      name: ruleForm.name,
      trigger: ruleForm.trigger,
      action: ruleForm.action,
      enabled: true,
      config: {},
      userId: '1',
    });
    
    setShowRuleForm(false);
    setRuleForm({ name: '', trigger: 'new_product', action: 'generate_content' });
    toast.success('Automation rule added!');
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* Header */}
      <motion.div variants={itemVariants}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">AI Automation</h1>
            <p className="text-muted-foreground mt-1">
              Generate marketing content and automate your workflow
            </p>
          </div>
        </div>
      </motion.div>

      <Tabs defaultValue="generator" className="space-y-6">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="generator">Content Generator</TabsTrigger>
          <TabsTrigger value="automation">Automation Rules</TabsTrigger>
        </TabsList>

        {/* Content Generator */}
        <TabsContent value="generator" className="space-y-6">
          <motion.div variants={itemVariants} className="grid gap-6 lg:grid-cols-2">
            {/* Input Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wand2 className="h-5 w-5 text-primary" />
                  Generate Content
                </CardTitle>
                <CardDescription>
                  Select content type and enter your prompt
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Content Type Selection */}
                <div className="grid grid-cols-2 gap-3">
                  {contentTypes.map((type) => {
                    const Icon = type.icon;
                    return (
                      <button
                        key={type.id}
                        onClick={() => setSelectedType(type.id)}
                        className={`p-4 rounded-xl border-2 text-left transition-all ${
                          selectedType === type.id
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:border-primary/50'
                        }`}
                      >
                        <Icon className={`h-5 w-5 mb-2 ${selectedType === type.id ? 'text-primary' : ''}`} />
                        <p className="font-medium text-sm">{type.label}</p>
                        <p className="text-xs text-muted-foreground mt-1">{type.description}</p>
                      </button>
                    );
                  })}
                </div>

                {/* Prompt Input */}
                <div className="space-y-2">
                  <Label htmlFor="prompt">What would you like to create?</Label>
                  <Textarea
                    id="prompt"
                    placeholder={`e.g., "Wireless headphones with noise cancellation"`}
                    rows={4}
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                  />
                </div>

                <Button
                  className="w-full gradient-primary"
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
                      Generate {contentTypes.find(t => t.id === selectedType)?.label}
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Output Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Edit3 className="h-5 w-5 text-primary" />
                  Generated Content
                </CardTitle>
                <CardDescription>
                  Your AI-generated content will appear here
                </CardDescription>
              </CardHeader>
              <CardContent>
                {generatedContent ? (
                  <div className="space-y-4">
                    <div className="bg-muted rounded-lg p-4 min-h-[200px] whitespace-pre-wrap">
                      {generatedContent}
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" className="flex-1" onClick={handleCopy}>
                        {copied ? (
                          <>
                            <Check className="mr-2 h-4 w-4" />
                            Copied!
                          </>
                        ) : (
                          <>
                            <Copy className="mr-2 h-4 w-4" />
                            Copy
                          </>
                        )}
                      </Button>
                      <Button variant="outline" onClick={() => setGeneratedContent('')}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
                    <Sparkles className="h-12 w-12 mb-4 opacity-50" />
                    <p>Generated content will appear here</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Tips */}
          <motion.div variants={itemVariants}>
            <Card className="bg-gradient-to-r from-primary/5 to-violet-500/5 border-primary/20">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Zap className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Pro Tips</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Be specific about your product features and benefits</li>
                      <li>• Include your target audience for better results</li>
                      <li>• Mention any special offers or promotions</li>
                      <li>• Use the generated content across all your marketing channels</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        {/* Automation Rules */}
        <TabsContent value="automation" className="space-y-6">
          <motion.div variants={itemVariants} className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold">Automation Rules</h3>
              <p className="text-sm text-muted-foreground">
                Set up automated actions for your store
              </p>
            </div>
            <Button onClick={() => setShowRuleForm(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Rule
            </Button>
          </motion.div>

          <motion.div variants={itemVariants} className="grid gap-4">
            {rules.map((rule) => (
              <Card key={rule.id} className="card-hover">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                        rule.enabled ? 'bg-primary/10' : 'bg-muted'
                      }`}>
                        <Zap className={`h-5 w-5 ${rule.enabled ? 'text-primary' : 'text-muted-foreground'}`} />
                      </div>
                      <div>
                        <h4 className="font-semibold">{rule.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          When <Badge variant="secondary">{rule.trigger.replace('_', ' ')}</Badge>
                          {' '}→{' '}
                          <Badge variant="secondary">{rule.action.replace('_', ' ')}</Badge>
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Switch
                        checked={rule.enabled}
                        onCheckedChange={() => toggleRule(rule.id)}
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteRule(rule.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {rules.length === 0 && (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Zap className="h-12 w-12 text-muted-foreground mb-4" />
                  <h4 className="font-semibold mb-2">No automation rules yet</h4>
                  <p className="text-sm text-muted-foreground text-center max-w-sm mb-4">
                    Create rules to automate repetitive tasks and save time
                  </p>
                  <Button onClick={() => setShowRuleForm(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Create First Rule
                  </Button>
                </CardContent>
              </Card>
            )}
          </motion.div>
        </TabsContent>
      </Tabs>

      {/* Add Rule Dialog */}
      {showRuleForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-card border border-border rounded-xl p-6 w-full max-w-md mx-4"
          >
            <h3 className="text-lg font-semibold mb-4">Add Automation Rule</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Rule Name</Label>
                <Input
                  placeholder="e.g., Auto-generate captions"
                  value={ruleForm.name}
                  onChange={(e) => setRuleForm({ ...ruleForm, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Trigger</Label>
                <select
                  className="w-full p-2 border rounded-lg bg-background"
                  value={ruleForm.trigger}
                  onChange={(e) => setRuleForm({ ...ruleForm, trigger: e.target.value as any })}
                >
                  <option value="new_product">New Product Added</option>
                  <option value="low_stock">Low Stock Alert</option>
                  <option value="new_order">New Order Received</option>
                  <option value="schedule">Scheduled</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label>Action</Label>
                <select
                  className="w-full p-2 border rounded-lg bg-background"
                  value={ruleForm.action}
                  onChange={(e) => setRuleForm({ ...ruleForm, action: e.target.value as any })}
                >
                  <option value="generate_content">Generate Content</option>
                  <option value="post_social">Post to Social Media</option>
                  <option value="send_email">Send Email</option>
                </select>
              </div>
              <div className="flex gap-3 pt-4">
                <Button variant="outline" className="flex-1" onClick={() => setShowRuleForm(false)}>
                  Cancel
                </Button>
                <Button className="flex-1 gradient-primary" onClick={handleAddRule}>
                  Add Rule
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}
