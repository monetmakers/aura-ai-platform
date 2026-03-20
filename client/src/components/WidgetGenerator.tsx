import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Copy, Check, Code, MessageCircle, Bot, Palette, Sparkles } from "lucide-react";

interface WidgetConfig {
  primaryColor: string;
  position: "bottom-right" | "bottom-left";
  greeting: string;
  botName: string;
}

interface WidgetGeneratorProps {
  agentId?: string;
}

export function WidgetGenerator({ agentId = "agent_123" }: WidgetGeneratorProps) {
  const [config, setConfig] = useState<WidgetConfig>({
    primaryColor: "#7c3aed",
    position: "bottom-right",
    greeting: "Hello! How can I help you today?",
    botName: "Support Bot",
  });
  const [copied, setCopied] = useState(false);

  const embedCode = `<!-- Aura Widget -->
<script>
  window.auraConfig = {
    agentId: "${agentId}",
    primaryColor: "${config.primaryColor}",
    position: "${config.position}",
    greeting: "${config.greeting}",
    botName: "${config.botName}"
  };
</script>
<script src="https://widget.aura.app/v1/embed.js" async></script>`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(embedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const colorPresets = [
    { color: "#7c3aed", name: "Violet" },
    { color: "#2563eb", name: "Blue" },
    { color: "#059669", name: "Emerald" },
    { color: "#ea580c", name: "Orange" },
    { color: "#dc2626", name: "Red" },
    { color: "#0891b2", name: "Cyan" },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="space-y-6">
        <Card>
          <CardHeader className="bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-950/30 dark:to-yellow-950/30 rounded-t-lg">
            <CardTitle className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-amber-500 to-yellow-600 flex items-center justify-center shadow-lg shadow-amber-500/25">
                <Palette className="h-5 w-5 text-white" />
              </div>
              Widget Appearance
            </CardTitle>
            <CardDescription>
              Customize how your chat widget looks on your website
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
            <div className="space-y-3">
              <Label className="text-sm font-medium">Brand Color</Label>
              <div className="flex gap-2 flex-wrap">
                {colorPresets.map((preset) => (
                  <button
                    key={preset.color}
                    onClick={() => setConfig({ ...config, primaryColor: preset.color })}
                    className={`h-10 w-10 rounded-lg transition-all ${
                      config.primaryColor === preset.color
                        ? "ring-2 ring-offset-2 ring-amber-500 scale-110"
                        : "hover:scale-105"
                    }`}
                    style={{ backgroundColor: preset.color }}
                    title={preset.name}
                    data-testid={`color-preset-${preset.name.toLowerCase()}`}
                  />
                ))}
                <div className="relative">
                  <Input
                    type="color"
                    value={config.primaryColor}
                    onChange={(e) => setConfig({ ...config, primaryColor: e.target.value })}
                    className="h-10 w-10 p-1 cursor-pointer rounded-lg"
                    data-testid="input-custom-color"
                  />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Input
                  value={config.primaryColor}
                  onChange={(e) => setConfig({ ...config, primaryColor: e.target.value })}
                  className="font-mono w-28"
                  data-testid="input-color-hex"
                />
                <span className="text-sm text-muted-foreground">Custom hex color</span>
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-sm font-medium">Widget Position</Label>
              <RadioGroup
                value={config.position}
                onValueChange={(v) => setConfig({ ...config, position: v as WidgetConfig["position"] })}
                className="grid grid-cols-2 gap-3"
              >
                <div>
                  <RadioGroupItem value="bottom-right" id="bottom-right" className="peer sr-only" data-testid="radio-position-bottom-right" />
                  <Label
                    htmlFor="bottom-right"
                    className="flex items-center justify-center p-4 rounded-xl border-2 cursor-pointer transition-all
                      peer-data-[state=unchecked]:border-muted peer-data-[state=unchecked]:bg-muted/30
                      peer-data-[state=checked]:border-amber-500 peer-data-[state=checked]:bg-amber-50 dark:peer-data-[state=checked]:bg-amber-950/30
                      hover:bg-muted/50"
                  >
                    <div className="text-center">
                      <div className="h-8 w-12 border-2 border-dashed border-muted-foreground/30 rounded relative mb-2 mx-auto">
                        <div className="absolute bottom-0.5 right-0.5 h-2 w-2 rounded-full" style={{ backgroundColor: config.primaryColor }} />
                      </div>
                      <span className="text-sm font-medium">Bottom Right</span>
                    </div>
                  </Label>
                </div>
                <div>
                  <RadioGroupItem value="bottom-left" id="bottom-left" className="peer sr-only" data-testid="radio-position-bottom-left" />
                  <Label
                    htmlFor="bottom-left"
                    className="flex items-center justify-center p-4 rounded-xl border-2 cursor-pointer transition-all
                      peer-data-[state=unchecked]:border-muted peer-data-[state=unchecked]:bg-muted/30
                      peer-data-[state=checked]:border-amber-500 peer-data-[state=checked]:bg-amber-50 dark:peer-data-[state=checked]:bg-amber-950/30
                      hover:bg-muted/50"
                  >
                    <div className="text-center">
                      <div className="h-8 w-12 border-2 border-dashed border-muted-foreground/30 rounded relative mb-2 mx-auto">
                        <div className="absolute bottom-0.5 left-0.5 h-2 w-2 rounded-full" style={{ backgroundColor: config.primaryColor }} />
                      </div>
                      <span className="text-sm font-medium">Bottom Left</span>
                    </div>
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bot-name" className="text-sm font-medium">Bot Name</Label>
              <Input
                id="bot-name"
                value={config.botName}
                onChange={(e) => setConfig({ ...config, botName: e.target.value })}
                placeholder="Support Bot"
                data-testid="input-bot-name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="greeting" className="text-sm font-medium">Greeting Message</Label>
              <Textarea
                id="greeting"
                value={config.greeting}
                onChange={(e) => setConfig({ ...config, greeting: e.target.value })}
                placeholder="Hello! How can I help you today?"
                className="resize-none"
                data-testid="input-greeting"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-sky-400 to-blue-500 flex items-center justify-center shadow-lg shadow-sky-500/25">
                <Code className="h-5 w-5 text-white" />
              </div>
              Embed Code
            </CardTitle>
            <CardDescription>
              Copy this code and paste it before the closing &lt;/body&gt; tag
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <ScrollArea className="h-40 w-full rounded-lg border bg-muted/50 p-4">
                <pre className="text-sm font-mono whitespace-pre-wrap break-all text-muted-foreground">{embedCode}</pre>
              </ScrollArea>
              <Button
                variant={copied ? "default" : "secondary"}
                size="sm"
                className="absolute top-2 right-2 gap-1.5"
                onClick={copyToClipboard}
                data-testid="button-copy-embed-code"
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    Copy Code
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="h-fit">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/25">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            Live Preview
          </CardTitle>
          <CardDescription>
            See how your widget will appear on your website
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 rounded-xl h-[500px] overflow-hidden">
            <div className="absolute inset-4 bg-background rounded-lg border flex items-center justify-center">
              <div className="text-center">
                <div className="h-12 w-12 rounded-lg bg-muted mx-auto mb-3" />
                <p className="text-muted-foreground text-sm">Your website</p>
              </div>
            </div>
            
            <div
              className={`absolute ${config.position === "bottom-right" ? "right-6" : "left-6"} bottom-6`}
            >
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center cursor-pointer shadow-xl transition-transform hover:scale-110"
                style={{ backgroundColor: config.primaryColor }}
                data-testid="preview-widget-button"
              >
                <MessageCircle className="h-6 w-6 text-white" />
              </div>
            </div>

            <div
              className={`absolute ${config.position === "bottom-right" ? "right-6" : "left-6"} bottom-24 w-80 bg-background rounded-2xl shadow-2xl border overflow-hidden`}
            >
              <div
                className="p-4 text-white"
                style={{ backgroundColor: config.primaryColor }}
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center">
                    <Bot className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold">{config.botName}</p>
                    <div className="flex items-center gap-1.5">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
                      </span>
                      <span className="text-xs opacity-90">Online</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-4">
                <div className="bg-muted rounded-2xl rounded-tl-md p-3 text-sm">
                  {config.greeting}
                </div>
              </div>
              <div className="p-4 pt-0">
                <div className="flex gap-2">
                  <Input placeholder="Type a message..." className="text-sm" disabled />
                  <Button size="icon" style={{ backgroundColor: config.primaryColor }} disabled>
                    <MessageCircle className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
