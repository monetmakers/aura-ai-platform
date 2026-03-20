import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, MessageSquare, Clock, CheckCircle, AlertCircle, ExternalLink } from "lucide-react";

interface Conversation {
  id: string;
  customerName: string;
  lastMessage: string;
  timestamp: Date;
  status: "resolved" | "open" | "escalated";
  messageCount: number;
  channel: "web" | "messenger" | "whatsapp";
  topic?: string;
}

interface ConversationListProps {
  onSelectConversation?: (id: string) => void;
}

export function ConversationList({ onSelectConversation }: ConversationListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // todo: remove mock functionality
  const conversations: Conversation[] = [
    {
      id: "1",
      customerName: "Sarah Johnson",
      lastMessage: "Thank you for the quick response! That answered my question.",
      timestamp: new Date(Date.now() - 1000 * 60 * 5),
      status: "resolved",
      messageCount: 8,
      channel: "web",
      topic: "Shipping",
    },
    {
      id: "2",
      customerName: "Michael Chen",
      lastMessage: "I'm still having issues with my order. Can someone help?",
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      status: "escalated",
      messageCount: 12,
      channel: "messenger",
      topic: "Order Issues",
    },
    {
      id: "3",
      customerName: "Emily Davis",
      lastMessage: "What are your return policies?",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
      status: "open",
      messageCount: 3,
      channel: "web",
      topic: "Returns",
    },
    {
      id: "4",
      customerName: "James Wilson",
      lastMessage: "Perfect, I'll proceed with the order now.",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5),
      status: "resolved",
      messageCount: 6,
      channel: "whatsapp",
      topic: "Product Info",
    },
    {
      id: "5",
      customerName: "Lisa Thompson",
      lastMessage: "How do I track my shipment?",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8),
      status: "resolved",
      messageCount: 4,
      channel: "web",
      topic: "Shipping",
    },
  ];

  const filteredConversations = conversations.filter((c) => {
    const matchesSearch =
      c.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.lastMessage.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const getStatusBadge = (status: Conversation["status"]) => {
    switch (status) {
      case "resolved":
        return (
          <Badge variant="secondary" className="gap-1">
            <CheckCircle className="h-3 w-3" />
            Resolved
          </Badge>
        );
      case "escalated":
        return (
          <Badge variant="destructive" className="gap-1">
            <AlertCircle className="h-3 w-3" />
            Escalated
          </Badge>
        );
      case "open":
        return (
          <Badge variant="outline" className="gap-1">
            <Clock className="h-3 w-3" />
            Open
          </Badge>
        );
    }
  };

  const getChannelBadge = (channel: Conversation["channel"]) => {
    const labels = { web: "Web", messenger: "Messenger", whatsapp: "WhatsApp" };
    return <Badge variant="outline">{labels[channel]}</Badge>;
  };

  const handleSelect = (id: string) => {
    setSelectedId(id);
    onSelectConversation?.(id);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search conversations..."
            className="pl-9"
            data-testid="input-search-conversations"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[140px]" data-testid="select-status-filter">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="open">Open</SelectItem>
            <SelectItem value="resolved">Resolved</SelectItem>
            <SelectItem value="escalated">Escalated</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <ScrollArea className="h-[500px]">
        <div className="space-y-2 pr-4">
          {filteredConversations.map((conversation) => (
            <Card
              key={conversation.id}
              className={`p-4 cursor-pointer hover-elevate active-elevate-2 transition-colors ${
                selectedId === conversation.id ? "border-primary" : ""
              }`}
              onClick={() => handleSelect(conversation.id)}
              data-testid={`card-conversation-${conversation.id}`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="font-medium">{conversation.customerName}</span>
                    {getStatusBadge(conversation.status)}
                  </div>
                  <p className="text-sm text-muted-foreground truncate mb-2">
                    {conversation.lastMessage}
                  </p>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground flex-wrap">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {formatTime(conversation.timestamp)}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageSquare className="h-3 w-3" />
                      {conversation.messageCount} messages
                    </span>
                    {getChannelBadge(conversation.channel)}
                    {conversation.topic && (
                      <Badge variant="secondary">
                        {conversation.topic}
                      </Badge>
                    )}
                  </div>
                </div>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={(e) => {
                    e.stopPropagation();
                    console.log("View conversation:", conversation.id);
                  }}
                  data-testid={`button-view-conversation-${conversation.id}`}
                >
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          ))}
          {filteredConversations.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <MessageSquare className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>No conversations found</p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
