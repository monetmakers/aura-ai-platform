import { StatCard } from "../StatCard";
import { MessageSquare } from "lucide-react";

export default function StatCardExample() {
  return (
    <StatCard
      title="Total Conversations"
      value="1,234"
      icon={MessageSquare}
      trend={{ value: 12, isPositive: true }}
      description="from last month"
    />
  );
}
