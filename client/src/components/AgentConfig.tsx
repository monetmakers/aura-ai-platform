import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X, Bot, Smile, Briefcase, MessageSquare, Shield, Zap, Loader2, Save, CheckCircle } from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Agent } from "@shared/schema";

export interface AgentConfiguration {
  name: string;
  greeting: string;
  tone: "professional" | "friendly" | "casual";
  formality: number;
  responseLength: number;
  confidenceThreshold: number;
  boundaries: string[];
}

export function AgentConfig() {
  const { toast } = useToast();
  const [newBoundary, setNewBoundary] = useState("");
  const [hasChanges, setHasChanges] = useState(false);

  const { data: agents = [], isLoading } = useQuery<Agent[]>({
    queryKey: ["/api/agents"],
  });

  const activeAgent = agents.find(a => a.isActive) || agents[0];

  const [config, setConfig] = useState<AgentConfiguration>({
    name: "Support Bot",
    greeting: "Hello! How can I help you today?",
    tone: "friendly",
    formality: 50,
    responseLength: 50,
    confidenceThreshold: 70,
    boundaries: [],
  });

  useEffect(() => {
    if (activeAgent) {
      setConfig({
        name: activeAgent.name,
        greeting: activeAgent.greeting,
        tone: activeAgent.tone as AgentConfiguration["tone"],
        formality: activeAgent.formality,
        responseLength: activeAgent.responseLength,
        confidenceThreshold: activeAgent.confidenceThreshold,
        boundaries: activeAgent.boundaries || [],
      });
    }
  }, [activeAgent]);

  const updateMutation = useMutation({
    mutationFn: async (updates: Partial<AgentConfiguration>) => {
      if (!activeAgent) return;
      const response = await apiRequest("PATCH", `/api/agents/${activeAgent.id}`, updates);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/agents"] });
      setHasChanges(false);
      toast({
        title: "Agent Updated",
        description: "Your agent configuration has been saved successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to save agent configuration. Please try again.",
        variant: "destructive",
      });
    },
  });

  const updateConfig = (updates: Partial<AgentConfiguration>) => {
    setConfig(prev => ({ ...prev, ...updates }));
    setHasChanges(true);
  };

  const saveConfig = () => {
    updateMutation.mutate(config);
  };

  const addBoundary = () => {
    if (newBoundary.trim() && !config.boundaries.includes(newBoundary.trim())) {
      updateConfig({ boundaries: [...config.boundaries, newBoundary.trim()] });
      setNewBoundary("");
    }
  };

  const removeBoundary = (boundary: string) => {
    updateConfig({ boundaries: config.boundaries.filter((b) => b !== boundary) });
  };

  const toneOptions = [
    { value: "professional", label: "Professional", icon: Briefcase, description: "Formal and business-like", color: "sky" },
    { value: "friendly", label: "Friendly", icon: Smile, description: "Warm and approachable", color: "emerald" },
    { value: "casual", label: "Casual", icon: MessageSquare, description: "Relaxed and conversational", color: "amber" },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {hasChanges && (
        <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 p-4 -mx-6 -mt-6 mb-6 border-b">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">You have unsaved changes</p>
            <Button onClick={saveConfig} disabled={updateMutation.isPending} className="gap-2" data-testid="button-save-agent">
              {updateMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              Save Changes
            </Button>
          </div>
        </div>
      )}

      <Card>
        <CardHeader className="bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-950/30 dark:to-yellow-950/30 rounded-t-lg">
          <CardTitle className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-amber-500 to-yellow-600 flex items-center justify-center shadow-lg shadow-amber-500/25">
              <Bot className="h-5 w-5 text-white" />
            </div>
            Agent Identity
          </CardTitle>
          <CardDescription>
            Give your agent a name and welcome message
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="agent-name" className="text-sm font-medium">Agent Name</Label>
            <Input
              id="agent-name"
              value={config.name}
              onChange={(e) => updateConfig({ name: e.target.value })}
              placeholder="e.g., Support Bot"
              data-testid="input-agent-name"
            />
            <p className="text-xs text-muted-foreground">
              This name will be shown to customers in the chat widget
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="greeting" className="text-sm font-medium">Greeting Message</Label>
            <Textarea
              id="greeting"
              value={config.greeting}
              onChange={(e) => updateConfig({ greeting: e.target.value })}
              placeholder="How your agent greets customers..."
              className="resize-none"
              data-testid="input-agent-greeting"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/25">
              <Smile className="h-5 w-5 text-white" />
            </div>
            Personality Settings
          </CardTitle>
          <CardDescription>
            Choose how your agent communicates with customers
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <Label className="text-sm font-medium">Conversation Tone</Label>
            <RadioGroup
              value={config.tone}
              onValueChange={(v) => updateConfig({ tone: v as AgentConfiguration["tone"] })}
              className="grid grid-cols-1 md:grid-cols-3 gap-3"
            >
              {toneOptions.map((option) => (
                <div key={option.value}>
                  <RadioGroupItem
                    value={option.value}
                    id={option.value}
                    className="peer sr-only"
                    data-testid={`radio-tone-${option.value}`}
                  />
                  <Label
                    htmlFor={option.value}
                    className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 cursor-pointer transition-all
                      peer-data-[state=unchecked]:border-muted peer-data-[state=unchecked]:bg-muted/30
                      peer-data-[state=checked]:border-amber-500 peer-data-[state=checked]:bg-amber-50 dark:peer-data-[state=checked]:bg-amber-950/30
                      hover:bg-muted/50`}
                  >
                    <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                      option.color === "sky" ? "bg-sky-100 dark:bg-sky-900/50 text-sky-600 dark:text-sky-400" :
                      option.color === "emerald" ? "bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400" :
                      "bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400"
                    }`}>
                      <option.icon className="h-5 w-5" />
                    </div>
                    <span className="font-medium">{option.label}</span>
                    <span className="text-xs text-muted-foreground text-center">{option.description}</span>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <Label className="text-sm font-medium">Formality Level</Label>
                <Badge variant="secondary" className="font-mono">{config.formality}%</Badge>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-muted-foreground w-16">Casual</span>
                <Slider
                  value={[config.formality]}
                  onValueChange={([v]) => updateConfig({ formality: v })}
                  max={100}
                  step={1}
                  className="flex-1"
                  data-testid="slider-formality"
                />
                <span className="text-xs text-muted-foreground w-16 text-right">Formal</span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <Label className="text-sm font-medium">Response Length</Label>
                <Badge variant="secondary" className="font-mono">{config.responseLength}%</Badge>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-muted-foreground w-16">Concise</span>
                <Slider
                  value={[config.responseLength]}
                  onValueChange={([v]) => updateConfig({ responseLength: v })}
                  max={100}
                  step={1}
                  className="flex-1"
                  data-testid="slider-response-length"
                />
                <span className="text-xs text-muted-foreground w-16 text-right">Detailed</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/25">
              <Zap className="h-5 w-5 text-white" />
            </div>
            Escalation Settings
          </CardTitle>
          <CardDescription>
            When should your agent suggest connecting to a human?
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-2">
              <Label className="text-sm font-medium">Confidence Threshold</Label>
              <Badge variant="secondary" className="font-mono">{config.confidenceThreshold}%</Badge>
            </div>
            <Slider
              value={[config.confidenceThreshold]}
              onValueChange={([v]) => updateConfig({ confidenceThreshold: v })}
              max={100}
              step={1}
              data-testid="slider-confidence"
            />
            <p className="text-xs text-muted-foreground">
              When confidence is below this threshold, the agent will suggest connecting to a human.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-rose-400 to-pink-500 flex items-center justify-center shadow-lg shadow-rose-500/25">
              <Shield className="h-5 w-5 text-white" />
            </div>
            Knowledge Boundaries
          </CardTitle>
          <CardDescription>
            Topics your agent should avoid or redirect to human support
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {config.boundaries.map((boundary) => (
              <Badge
                key={boundary}
                variant="secondary"
                className="gap-1.5 py-1.5 px-3 bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300 border-0"
              >
                {boundary}
                <button
                  onClick={() => removeBoundary(boundary)}
                  className="ml-1 hover:text-rose-900 dark:hover:text-rose-100"
                  data-testid={`button-remove-boundary-${boundary}`}
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
          <div className="flex gap-2">
            <Input
              value={newBoundary}
              onChange={(e) => setNewBoundary(e.target.value)}
              placeholder="Add a topic to avoid..."
              onKeyDown={(e) => e.key === "Enter" && addBoundary()}
              data-testid="input-new-boundary"
            />
            <Button onClick={addBoundary} data-testid="button-add-boundary">
              Add
            </Button>
          </div>
          {config.boundaries.length === 0 && (
            <p className="text-sm text-muted-foreground">
              No boundaries set. Your agent will attempt to answer all questions.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
