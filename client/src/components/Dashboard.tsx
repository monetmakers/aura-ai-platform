import { StatCard } from "./StatCard";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import {
  MessageSquare,
  CheckCircle,
  Clock,
  TrendingUp,
  Users,
  FileText,
  Bot,
  Zap,
  ArrowRight,
  Sparkles,
  DollarSign,
  ShoppingCart,
  Heart,
  Target,
  Smile,
  Meh,
  Frown,
  Lightbulb,
  Check,
  X,
  HelpCircle,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
} from "recharts";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "wouter";
import { useTranslation } from "react-i18next";
import type { Document, Agent, DiscoveredIntent } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";

interface Stats {
  totalDocuments: number;
  totalConversations: number;
  totalMessages: number;
  avgSatisfaction: number;
}

interface RevenueInsights {
  dailyUpsells: number;
  upsellValue: number;
  upsellOpportunities: Array<{ product: string; probability: number; value: number }>;
  abandonedCartSaves: number;
  cartRescueRate: number;
  cartRescueValue: number;
  sentimentCorrelation: {
    positive: { avgSpend: number; count: number };
    neutral: { avgSpend: number; count: number };
    negative: { avgSpend: number; count: number };
  };
}

export function Dashboard() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const { data: stats, isLoading: statsLoading } = useQuery<Stats>({
    queryKey: ["/api/stats"],
  });

  const { data: documents = [] } = useQuery<Document[]>({
    queryKey: ["/api/documents"],
  });

  const { data: agents = [] } = useQuery<Agent[]>({
    queryKey: ["/api/agents"],
  });

  const { data: revenueInsights } = useQuery<RevenueInsights>({
    queryKey: ["/api/revenue/insights"],
  });

  const { data: discoveredIntents = [], isLoading: intentsLoading } = useQuery<DiscoveredIntent[]>({
    queryKey: ["/api/intents"],
  });

  const updateIntentStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      return apiRequest("PATCH", `/api/intents/${id}/status`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/intents"] });
    },
  });

  const pendingIntents = discoveredIntents.filter((i) => i.status === "pending");
  const approvedIntents = discoveredIntents.filter((i) => i.status === "approved");

  const conversationData = [
    { date: "Mon", conversations: stats?.totalConversations ? Math.floor(stats.totalConversations * 0.12) : 0 },
    { date: "Tue", conversations: stats?.totalConversations ? Math.floor(stats.totalConversations * 0.14) : 0 },
    { date: "Wed", conversations: stats?.totalConversations ? Math.floor(stats.totalConversations * 0.13) : 0 },
    { date: "Thu", conversations: stats?.totalConversations ? Math.floor(stats.totalConversations * 0.17) : 0 },
    { date: "Fri", conversations: stats?.totalConversations ? Math.floor(stats.totalConversations * 0.15) : 0 },
    { date: "Sat", conversations: stats?.totalConversations ? Math.floor(stats.totalConversations * 0.14) : 0 },
    { date: "Sun", conversations: stats?.totalConversations ? Math.floor(stats.totalConversations * 0.15) : 0 },
  ];

  const topicData = [
    { topic: "General", count: Math.floor((stats?.totalMessages || 0) * 0.3), fill: "hsl(var(--chart-1))" },
    { topic: "Support", count: Math.floor((stats?.totalMessages || 0) * 0.25), fill: "hsl(var(--chart-2))" },
    { topic: "Product", count: Math.floor((stats?.totalMessages || 0) * 0.2), fill: "hsl(var(--chart-3))" },
    { topic: "Pricing", count: Math.floor((stats?.totalMessages || 0) * 0.15), fill: "hsl(var(--chart-4))" },
    { topic: "Other", count: Math.floor((stats?.totalMessages || 0) * 0.1), fill: "hsl(var(--chart-5))" },
  ];

  const readyDocs = documents.filter(d => d.status === "ready").length;
  const activeAgent = agents.find(a => a.isActive);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-semibold mb-1">{t("dashboard.welcome")}</h1>
          <p className="text-muted-foreground">{t("dashboard.subtitle")}</p>
        </div>
        <Link href="/playground">
          <Button className="gap-2" data-testid="button-view-playground">
            <Sparkles className="h-4 w-4" />
            {t("dashboard.testPlayground")}
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {statsLoading ? (
          <>
            {[...Array(4)].map((_, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <Skeleton className="h-4 w-24 mb-2" />
                  <Skeleton className="h-8 w-16" />
                </CardContent>
              </Card>
            ))}
          </>
        ) : (
          <>
            <StatCard
              title={t("dashboard.conversations")}
              value={String(stats?.totalConversations || 0)}
              icon={MessageSquare}
              description="all time"
              color="violet"
            />
            <StatCard
              title="Total Messages"
              value={String(stats?.totalMessages || 0)}
              icon={CheckCircle}
              description="all time"
              color="emerald"
            />
            <StatCard
              title={t("dashboard.documents")}
              value={`${readyDocs}/${documents.length}`}
              icon={FileText}
              description="ready for training"
              color="sky"
            />
            <StatCard
              title={t("dashboard.avgSatisfaction")}
              value={stats?.avgSatisfaction ? `${stats.avgSatisfaction}/5` : "N/A"}
              icon={Users}
              description="customer rating"
              color="amber"
            />
          </>
        )}
      </div>

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2">
            <CardTitle className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center">
                <TrendingUp className="h-4 w-4 text-amber-600 dark:text-amber-400" />
              </div>
              Conversation Volume
            </CardTitle>
            <Badge variant="secondary">Last 7 days</Badge>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={conversationData}>
                  <defs>
                    <linearGradient id="colorConversations" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" vertical={false} />
                  <XAxis 
                    dataKey="date" 
                    className="text-xs" 
                    tick={{ fill: 'hsl(var(--muted-foreground))' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis 
                    className="text-xs" 
                    tick={{ fill: 'hsl(var(--muted-foreground))' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--popover))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                    }}
                    labelStyle={{ color: 'hsl(var(--foreground))', fontWeight: 500 }}
                  />
                  <Area
                    type="monotone"
                    dataKey="conversations"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    fill="url(#colorConversations)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2">
            <CardTitle className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-sky-100 dark:bg-sky-900/50 flex items-center justify-center">
                <MessageSquare className="h-4 w-4 text-sky-600 dark:text-sky-400" />
              </div>
              Message Topics
            </CardTitle>
            <Badge variant="secondary">This month</Badge>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topicData} layout="vertical" barSize={20}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" horizontal={false} />
                  <XAxis type="number" tick={{ fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
                  <YAxis dataKey="topic" type="category" width={70} tick={{ fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--popover))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                    }}
                    labelStyle={{ color: 'hsl(var(--foreground))', fontWeight: 500 }}
                  />
                  <Bar dataKey="count" radius={[0, 6, 6, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center">
                <Zap className="h-4 w-4 text-amber-600 dark:text-amber-400" />
              </div>
              {t("dashboard.quickActions")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2">
              <Link href="/documents">
                <Card className="hover-elevate cursor-pointer">
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-amber-500 to-yellow-600 flex items-center justify-center">
                      <FileText className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="font-medium">{t("dashboard.uploadDocuments")}</p>
                      <p className="text-sm text-muted-foreground">{t("dashboard.uploadDescription")}</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
              <Link href="/agent">
                <Card className="hover-elevate cursor-pointer">
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center">
                      <Bot className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="font-medium">{t("dashboard.configureAgent")}</p>
                      <p className="text-sm text-muted-foreground">{t("dashboard.configureDescription")}</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
              <Link href="/playground">
                <Card className="hover-elevate cursor-pointer">
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-sky-400 to-blue-500 flex items-center justify-center">
                      <MessageSquare className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="font-medium">{t("dashboard.testPlayground")}</p>
                      <p className="text-sm text-muted-foreground">{t("dashboard.testDescription")}</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
              <Link href="/deploy">
                <Card className="hover-elevate cursor-pointer">
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                      <Sparkles className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="font-medium">{t("nav.deployment")}</p>
                      <p className="text-sm text-muted-foreground">{t("deployment.subtitle")}</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center">
                <Bot className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              </div>
              Agent Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between gap-2 p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/30">
              <span className="text-sm font-medium">Status</span>
              <Badge className="gap-1.5 bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 border-0">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                Online
              </Badge>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm text-muted-foreground flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Documents
                </span>
                <Badge variant="secondary">{readyDocs} files</Badge>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm text-muted-foreground flex items-center gap-2">
                  <Bot className="h-4 w-4" />
                  Active Agent
                </span>
                <Badge variant="secondary">{activeAgent?.name || "Support Bot"}</Badge>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm text-muted-foreground">Tone</span>
                <span className="text-sm font-medium capitalize">{activeAgent?.tone || "friendly"}</span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm text-muted-foreground">Confidence Threshold</span>
                <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">{activeAgent?.confidenceThreshold || 70}%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Discovered Intents Panel */}
      <Card className="bg-gradient-to-br from-amber-50/50 to-yellow-50/50 dark:from-amber-950/20 dark:to-yellow-950/20 border-amber-200/50 dark:border-amber-800/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-amber-500 to-yellow-500 flex items-center justify-center">
              <Lightbulb className="h-4 w-4 text-white" />
            </div>
            Auto-Discovered Intents
          </CardTitle>
          <CardDescription>
            AI automatically identifies customer questions from your uploaded documents
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-4">
            <Badge variant="secondary" className="gap-1">
              <HelpCircle className="h-3 w-3" />
              {pendingIntents.length} Pending Review
            </Badge>
            <Badge variant="outline" className="gap-1 text-emerald-600 border-emerald-300 dark:text-emerald-400 dark:border-emerald-700">
              <Check className="h-3 w-3" />
              {approvedIntents.length} Approved
            </Badge>
          </div>
          
          {intentsLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="p-4 rounded-lg bg-background border">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <Skeleton className="h-5 w-32 mb-2" />
                      <Skeleton className="h-4 w-full mb-2" />
                      <Skeleton className="h-3 w-48" />
                    </div>
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-6 w-20" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : pendingIntents.length > 0 ? (
            <div className="space-y-3" data-testid="intents-list">
              {pendingIntents.slice(0, 5).map((intent) => (
                <div
                  key={intent.id}
                  className="p-4 rounded-lg bg-background border"
                  data-testid={`intent-card-${intent.id}`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium truncate">{intent.intentName}</h4>
                        <Badge variant="secondary" className="text-xs capitalize">
                          {intent.category.replace("_", " ")}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                        {intent.description}
                      </p>
                      {intent.exampleQuestions && intent.exampleQuestions.length > 0 && (
                        <div className="text-xs text-muted-foreground">
                          <span className="font-medium">Example: </span>
                          {intent.exampleQuestions[0]}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="flex items-center gap-1 mr-2">
                        <Progress value={intent.confidence} className="h-1.5 w-12" />
                        <span className="text-xs text-muted-foreground">{intent.confidence}%</span>
                      </div>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="text-emerald-600"
                        onClick={() => updateIntentStatus.mutate({ id: intent.id, status: "approved" })}
                        disabled={updateIntentStatus.isPending}
                        data-testid={`approve-intent-${intent.id}`}
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="text-rose-600"
                        onClick={() => updateIntentStatus.mutate({ id: intent.id, status: "rejected" })}
                        disabled={updateIntentStatus.isPending}
                        data-testid={`reject-intent-${intent.id}`}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
              {pendingIntents.length > 5 && (
                <p className="text-sm text-muted-foreground text-center">
                  +{pendingIntents.length - 5} more intents pending review
                </p>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <Lightbulb className="h-12 w-12 mx-auto text-muted-foreground/30 mb-3" />
              <p className="text-muted-foreground mb-2">No intents discovered yet</p>
              <p className="text-sm text-muted-foreground">
                Upload documents to automatically discover customer intents
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Revenue Insights Panel */}
      <Card className="bg-gradient-to-br from-emerald-50/50 to-teal-50/50 dark:from-emerald-950/20 dark:to-teal-950/20 border-emerald-200/50 dark:border-emerald-800/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
              <DollarSign className="h-4 w-4 text-white" />
            </div>
            Revenue Insights
          </CardTitle>
          <CardDescription>AI-powered revenue opportunities from customer conversations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
            {/* Upsell Opportunities */}
            <Card data-testid="card-upsell-opportunities">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Target className="h-5 w-5 text-amber-500" />
                  Upsell Opportunities
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <p className="text-2xl font-bold">{revenueInsights?.dailyUpsells || 0}</p>
                    <p className="text-xs text-muted-foreground">Detected today</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold text-emerald-600 dark:text-emerald-400">
                      ${revenueInsights?.upsellValue || 0}
                    </p>
                    <p className="text-xs text-muted-foreground">Potential value</p>
                  </div>
                </div>
                {revenueInsights?.upsellOpportunities && revenueInsights.upsellOpportunities.length > 0 ? (
                  <div className="space-y-2">
                    {revenueInsights.upsellOpportunities.slice(0, 3).map((opp, idx) => (
                      <div key={idx} className="p-2 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200/50 dark:border-amber-800/50">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <span className="text-sm font-medium truncate">{opp.product}</span>
                          <Badge variant="secondary" className="text-xs">${opp.value}</Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          <Progress value={opp.probability} className="h-1.5 flex-1" />
                          <span className="text-xs text-muted-foreground">{opp.probability}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <Target className="h-8 w-8 mx-auto text-muted-foreground/30 mb-2" />
                    <p className="text-sm text-muted-foreground">No upsells detected yet</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Cart Rescue Metrics */}
            <Card data-testid="card-cart-rescue">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5 text-amber-500" />
                  Cart Rescue
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 rounded-lg bg-amber-50 dark:bg-amber-950/30">
                    <p className="text-2xl font-bold">{revenueInsights?.abandonedCartSaves || 0}</p>
                    <p className="text-xs text-muted-foreground">Carts Rescued</p>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/30">
                    <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                      ${revenueInsights?.cartRescueValue || 0}
                    </p>
                    <p className="text-xs text-muted-foreground">Revenue Saved</p>
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-sm text-muted-foreground">Rescue Rate</span>
                    <span className="text-sm font-medium">{revenueInsights?.cartRescueRate || 0}%</span>
                  </div>
                  <Progress value={revenueInsights?.cartRescueRate || 0} className="h-2" />
                </div>
                <div className="text-center pt-2">
                  <p className="text-xs text-muted-foreground">
                    AI intervenes when customers show cart abandonment signals
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Sentiment Correlation */}
            <Card data-testid="card-sentiment-correlation">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Heart className="h-5 w-5 text-rose-500" />
                  Happiness vs Spend
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between gap-3 p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/30">
                  <div className="flex items-center gap-2">
                    <Smile className="h-5 w-5 text-emerald-500" />
                    <span className="text-sm">Positive</span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold">
                      ${revenueInsights?.sentimentCorrelation?.positive?.avgSpend || 0}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {revenueInsights?.sentimentCorrelation?.positive?.count || 0} customers
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between gap-3 p-2 rounded-lg bg-amber-50 dark:bg-amber-950/30">
                  <div className="flex items-center gap-2">
                    <Meh className="h-5 w-5 text-amber-500" />
                    <span className="text-sm">Neutral</span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold">
                      ${revenueInsights?.sentimentCorrelation?.neutral?.avgSpend || 0}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {revenueInsights?.sentimentCorrelation?.neutral?.count || 0} customers
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between gap-3 p-2 rounded-lg bg-rose-50 dark:bg-rose-950/30">
                  <div className="flex items-center gap-2">
                    <Frown className="h-5 w-5 text-rose-500" />
                    <span className="text-sm">Negative</span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold">
                      ${revenueInsights?.sentimentCorrelation?.negative?.avgSpend || 0}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {revenueInsights?.sentimentCorrelation?.negative?.count || 0} customers
                    </p>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground text-center pt-1">
                  Correlates customer mood with purchase value
                </p>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
