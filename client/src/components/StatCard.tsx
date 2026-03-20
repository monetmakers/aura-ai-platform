import { Card, CardContent } from "@/components/ui/card";
import { type LucideIcon, TrendingUp, TrendingDown } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: "violet" | "emerald" | "sky" | "amber" | "rose";
}

const colorVariants = {
  violet: {
    bg: "bg-amber-50 dark:bg-amber-950/30",
    icon: "bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400",
    ring: "ring-amber-200 dark:ring-amber-800/50",
  },
  emerald: {
    bg: "bg-emerald-50 dark:bg-emerald-950/30",
    icon: "bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400",
    ring: "ring-emerald-200 dark:ring-emerald-800/50",
  },
  sky: {
    bg: "bg-sky-50 dark:bg-sky-950/30",
    icon: "bg-sky-100 dark:bg-sky-900/50 text-sky-600 dark:text-sky-400",
    ring: "ring-sky-200 dark:ring-sky-800/50",
  },
  amber: {
    bg: "bg-amber-50 dark:bg-amber-950/30",
    icon: "bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400",
    ring: "ring-amber-200 dark:ring-amber-800/50",
  },
  rose: {
    bg: "bg-rose-50 dark:bg-rose-950/30",
    icon: "bg-rose-100 dark:bg-rose-900/50 text-rose-600 dark:text-rose-400",
    ring: "ring-rose-200 dark:ring-rose-800/50",
  },
};

export function StatCard({ title, value, description, icon: Icon, trend, color = "violet" }: StatCardProps) {
  const colors = colorVariants[color];
  
  return (
    <Card className={`${colors.bg} border-0 ring-1 ${colors.ring}`}>
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
            <p className="text-2xl font-bold tracking-tight">{value}</p>
            {(description || trend) && (
              <div className="flex items-center gap-1.5 mt-2 text-sm">
                {trend && (
                  <span className={`flex items-center gap-0.5 font-medium ${
                    trend.isPositive 
                      ? "text-emerald-600 dark:text-emerald-400" 
                      : "text-rose-600 dark:text-rose-400"
                  }`}>
                    {trend.isPositive ? (
                      <TrendingUp className="h-3.5 w-3.5" />
                    ) : (
                      <TrendingDown className="h-3.5 w-3.5" />
                    )}
                    {trend.value}%
                  </span>
                )}
                {description && (
                  <span className="text-muted-foreground">{description}</span>
                )}
              </div>
            )}
          </div>
          <div className={`shrink-0 rounded-xl p-2.5 ${colors.icon}`}>
            <Icon className="h-5 w-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
