import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { Save, Key, Sparkles, Eye, EyeOff } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";

interface AISettings {
  provider: string;
  api_keys: {
    openai?: string;
    gemini?: string;
    claude?: string;
    deepseek?: string;
  };
}

const AI_PROVIDERS = [
  { value: "openai", label: "OpenAI (GPT-4o-mini)", info: "Get key from platform.openai.com" },
  { value: "gemini", label: "Google Gemini Pro", info: "Get key from ai.google.dev" },
  { value: "claude", label: "Anthropic Claude", info: "Get key from console.anthropic.com" },
  { value: "deepseek", label: "DeepSeek", info: "Get key from platform.deepseek.com" },
];

export default function Settings() {
  const { toast } = useToast();
  const [selectedProvider, setSelectedProvider] = useState<string>("openai");
  const [apiKeys, setApiKeys] = useState<Record<string, string>>({});
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({});

  // Fetch user's current settings
  const { data: settings, isLoading } = useQuery({
    queryKey: ['/api/settings/ai'],
  });

  // Hydrate state from fetched settings
  useEffect(() => {
    if (settings && typeof settings === 'object' && 'provider' in settings) {
      setSelectedProvider((settings as any).provider || "openai");
      if ('api_keys' in settings && (settings as any).api_keys) {
        setApiKeys((settings as any).api_keys);
      }
    }
  }, [settings]);

  // Save settings mutation
  const saveMutation = useMutation({
    mutationFn: async (data: AISettings) => {
      return await apiRequest('/api/settings/ai', 'POST', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/settings/ai'] });
      toast({
        title: "Settings saved!",
        description: "Your AI provider settings have been updated successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error saving settings",
        description: error.message || "Failed to save settings. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSave = () => {
    if (!apiKeys[selectedProvider]) {
      toast({
        title: "API Key Required",
        description: `Please enter your ${AI_PROVIDERS.find(p => p.value === selectedProvider)?.label} API key.`,
        variant: "destructive",
      });
      return;
    }

    saveMutation.mutate({
      provider: selectedProvider,
      api_keys: apiKeys,
    });
  };

  const toggleShowKey = (provider: string) => {
    setShowKeys(prev => ({ ...prev, [provider]: !prev[provider] }));
  };

  return (
    <div className="min-h-screen p-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-2"
      >
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          AI Settings
        </h1>
        <p className="text-muted-foreground">
          Configure your AI provider and API keys for personalized research
        </p>
      </motion.div>

      {/* Settings Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="glass-card p-6 relative overflow-hidden">
          {/* Holographic background */}
          <div className="absolute inset-0 holographic opacity-10 pointer-events-none" />

          <div className="relative z-10 space-y-6">
            {/* Provider Selection */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" />
                AI Provider
              </Label>
              <Select
                value={selectedProvider}
                onValueChange={setSelectedProvider}
                data-testid="select-ai-provider"
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select AI provider" />
                </SelectTrigger>
                <SelectContent>
                  {AI_PROVIDERS.map((provider) => (
                    <SelectItem key={provider.value} value={provider.value}>
                      {provider.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                {AI_PROVIDERS.find(p => p.value === selectedProvider)?.info}
              </p>
            </div>

            {/* API Keys Input */}
            <div className="space-y-4">
              <Label className="flex items-center gap-2">
                <Key className="w-4 h-4 text-primary" />
                API Key for {AI_PROVIDERS.find(p => p.value === selectedProvider)?.label}
              </Label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Input
                    type={showKeys[selectedProvider] ? "text" : "password"}
                    value={apiKeys[selectedProvider] || ""}
                    onChange={(e) => setApiKeys(prev => ({ ...prev, [selectedProvider]: e.target.value }))}
                    placeholder={`Enter your ${AI_PROVIDERS.find(p => p.value === selectedProvider)?.label} API key`}
                    className="pr-10"
                    data-testid="input-api-key"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
                    onClick={() => toggleShowKey(selectedProvider)}
                    data-testid="button-toggle-key-visibility"
                  >
                    {showKeys[selectedProvider] ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                🔒 Your API keys are encrypted and stored securely. They're only used to make requests on your behalf.
              </p>
            </div>

            {/* Info Box */}
            <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
              <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                Why Provide Your Own API Key?
              </h4>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• <strong>No rate limits:</strong> Use your own API quota without restrictions</li>
                <li>• <strong>Privacy:</strong> Your queries go directly to the AI provider</li>
                <li>• <strong>Cost control:</strong> Pay only for what you use on your own account</li>
                <li>• <strong>Choice:</strong> Pick the AI model that works best for you</li>
              </ul>
            </div>

            {/* Save Button */}
            <Button
              onClick={handleSave}
              disabled={saveMutation.isPending || !apiKeys[selectedProvider]}
              className="w-full hover-elevate active-elevate-2"
              data-testid="button-save-settings"
            >
              <Save className="w-4 h-4 mr-2" />
              {saveMutation.isPending ? "Saving..." : "Save Settings"}
            </Button>
          </div>

          {/* Neon glow border */}
          <div className="absolute inset-0 rounded-lg border border-primary/30 pointer-events-none" 
               style={{ boxShadow: '0 0 20px rgba(0, 212, 255, 0.2)' }} />
        </Card>
      </motion.div>
    </div>
  );
}
