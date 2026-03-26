import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import AppSidebar from "@/components/AppSidebar";
import "@/lib/i18n";

import NotFound from "@/pages/not-found";
import DashboardPage from "@/pages/dashboard";
import DocumentsPage from "@/pages/documents";
import AgentPage from "@/pages/agent";
import PlaygroundPage from "@/pages/playground";
import ConversationsPage from "@/pages/conversations";
import DeployPage from "@/pages/deploy";
import SettingsPage from "@/pages/settings";
import HelpPage from "@/pages/help";
import InsightsPage from "@/pages/insights";
import RevenuePage from "@/pages/revenue";
import IntegrationsPage from "@/pages/integrations";
import LandingPage from "@/pages/landing";
import RegisterPage from "@/pages/register";
import LoginPage from "@/pages/login";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

function AppRouter() {
  return (
    <Switch>
      <Route path="/dashboard" component={DashboardPage} />
      <Route path="/documents" component={DocumentsPage} />
      <Route path="/agent" component={AgentPage} />
      <Route path="/playground" component={PlaygroundPage} />
      <Route path="/conversations" component={ConversationsPage} />
      <Route path="/insights" component={InsightsPage} />
      <Route path="/revenue" component={RevenuePage} />
      <Route path="/integrations" component={IntegrationsPage} />
      <Route path="/deploy" component={DeployPage} />
      <Route path="/settings" component={SettingsPage} />
      <Route path="/help" component={HelpPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function AppWithSidebar() {
  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden", background: "#0f172a" }}>
      <AppSidebar />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", minWidth: 0, background: "#0f172a" }}>
        <AppRouter />
      </div>
    </div>
  );
}

function App() {
  const [location] = useLocation();
  const isLandingPage  = location === "/" || location === "/landing";
  const isRegisterPage = location === "/register";
  const isLoginPage    = location === "/login";

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        {isLandingPage  ? <LandingPage />   :
         isRegisterPage ? <RegisterPage />   :
         isLoginPage    ? <LoginPage />      :
         <AppWithSidebar />}
        <LanguageSwitcher />
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
