import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Send, Bot, User, RefreshCw, Sparkles, ThumbsUp, ThumbsDown, Loader2, AlertCircle } from "lucide-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Agent, Message } from "@shared/schema";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  confidence?: number | null;
}

interface ChatPlaygroundProps {
  agentName?: string;
}

export function ChatPlayground({ agentName }: ChatPlaygroundProps) {
  const { toast } = useToast();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [conversationId, setConversationId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const { data: agents = [] } = useQuery<Agent[]>({
    queryKey: ["/api/agents"],
  });

  const activeAgent = agents.find(a => a.isActive) || agents[0];
  const displayName = agentName || activeAgent?.name || "AI Agent";

  useEffect(() => {
    if (activeAgent && messages.length === 0) {
      setMessages([{
        id: "greeting",
        role: "assistant",
        content: activeAgent.greeting,
        timestamp: new Date(),
        confidence: 100,
      }]);
    }
  }, [activeAgent]);

  useEffect(() => {
    if (scrollRef.current) {
      const scrollElement = scrollRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollElement) {
        scrollElement.scrollTop = scrollElement.scrollHeight;
      }
    }
  }, [messages]);

  const chatMutation = useMutation({
    mutationFn: async (message: string) => {
      const response = await apiRequest("POST", "/api/chat", {
        message,
        conversationId,
        agentId: activeAgent?.id || "default-agent",
      });
      return response.json();
    },
    onSuccess: (data) => {
      if (data.conversationId) {
        setConversationId(data.conversationId);
      }
      if (data.message) {
        setMessages(prev => [...prev, {
          id: data.message.id,
          role: "assistant",
          content: data.message.content,
          timestamp: new Date(data.message.createdAt),
          confidence: data.message.confidence,
        }]);
      }
    },
    onError: (error: Error) => {
      setMessages(prev => [...prev, {
        id: Date.now().toString() + "-error",
        role: "assistant",
        content: "I'm sorry, I encountered an error processing your request. Please try again.",
        timestamp: new Date(),
        confidence: 0,
      }]);
      toast({
        title: "Chat Error",
        description: "Failed to get a response. Please try again.",
        variant: "destructive",
      });
    },
  });

  const sendMessage = () => {
    if (!input.trim() || chatMutation.isPending) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    chatMutation.mutate(input);
    setInput("");
  };

  const resetChat = () => {
    setConversationId(null);
    setMessages(activeAgent ? [{
      id: "greeting",
      role: "assistant",
      content: activeAgent.greeting,
      timestamp: new Date(),
      confidence: 100,
    }] : []);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 85) return "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300";
    if (confidence >= 70) return "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300";
    return "bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300";
  };

  return (
    <Card className="flex flex-col h-[600px]">
      <CardHeader className="border-b shrink-0 bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-950/30 dark:to-yellow-950/30">
        <CardTitle className="flex items-center gap-3">
          <Avatar className="h-10 w-10 ring-2 ring-amber-200 dark:ring-amber-800">
            <AvatarFallback className="bg-gradient-to-br from-amber-500 to-yellow-600 text-white">
              <Bot className="h-5 w-5" />
            </AvatarFallback>
          </Avatar>
          <div>
            <span className="font-semibold">{displayName}</span>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-xs text-muted-foreground">Online</span>
            </div>
          </div>
        </CardTitle>
      </CardHeader>
      
      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${message.role === "user" ? "justify-end" : ""}`}
            >
              {message.role === "assistant" && (
                <Avatar className="h-8 w-8 shrink-0 ring-2 ring-amber-200 dark:ring-amber-800">
                  <AvatarFallback className="bg-gradient-to-br from-amber-500 to-yellow-600 text-white">
                    <Bot className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
              )}
              <div className={`max-w-[80%] ${message.role === "user" ? "order-first" : ""}`}>
                <div
                  className={`rounded-2xl p-4 ${
                    message.role === "user"
                      ? "bg-gradient-to-br from-amber-500 to-yellow-600 text-white rounded-tr-md"
                      : "bg-muted rounded-tl-md"
                  }`}
                >
                  <p className="text-sm leading-relaxed">{message.content}</p>
                </div>
                <div className={`flex items-center gap-2 mt-2 flex-wrap ${message.role === "user" ? "justify-end" : ""}`}>
                  <span className="text-xs text-muted-foreground">
                    {formatTime(message.timestamp)}
                  </span>
                  {message.role === "assistant" && message.confidence && (
                    <>
                      <Badge
                        variant="secondary"
                        className={`border-0 ${getConfidenceColor(message.confidence)}`}
                      >
                        <Sparkles className="h-3 w-3 mr-1" />
                        {message.confidence}% confident
                      </Badge>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          data-testid={`button-thumbs-up-${message.id}`}
                        >
                          <ThumbsUp className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          data-testid={`button-thumbs-down-${message.id}`}
                        >
                          <ThumbsDown className="h-3 w-3" />
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              </div>
              {message.role === "user" && (
                <Avatar className="h-8 w-8 shrink-0 ring-2 ring-sky-200 dark:ring-sky-800">
                  <AvatarFallback className="bg-gradient-to-br from-sky-400 to-blue-500 text-white">
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}
          {chatMutation.isPending && (
            <div className="flex gap-3">
              <Avatar className="h-8 w-8 shrink-0 ring-2 ring-amber-200 dark:ring-amber-800">
                <AvatarFallback className="bg-gradient-to-br from-amber-500 to-yellow-600 text-white">
                  <Bot className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
              <div className="bg-muted rounded-2xl rounded-tl-md p-4">
                <div className="flex gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-amber-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="h-2 w-2 rounded-full bg-amber-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="h-2 w-2 rounded-full bg-amber-400 animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      <div className="p-4 border-t shrink-0 bg-muted/30">
        <div className="flex gap-2">
          <Button
            size="icon"
            variant="outline"
            onClick={resetChat}
            data-testid="button-reset-chat"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Type a message to test your agent..."
            className="flex-1"
            disabled={chatMutation.isPending}
            data-testid="input-chat-message"
          />
          <Button 
            onClick={sendMessage} 
            disabled={!input.trim() || chatMutation.isPending} 
            className="gap-2" 
            data-testid="button-send-message"
          >
            {chatMutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
            Send
          </Button>
        </div>
      </div>
    </Card>
  );
}
