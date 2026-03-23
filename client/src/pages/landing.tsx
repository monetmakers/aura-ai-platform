import { useState } from "react";
import { useLocation } from "wouter";
import { ChevronRight, Check, Zap, BarChart3, MessageSquare, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function LandingV2() {
  const [, navigate] = useLocation();
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleWaitlist = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
      setTimeout(() => {
        navigate("/register?email=" + email);
      }, 1500);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 transition-colors">
      {/* Theme Toggle - Top Right */}
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>

      {/* HERO SECTION */}
      <section className="relative overflow-hidden">
        {/* Animated background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-white to-blue-50 dark:from-emerald-950/20 dark:via-slate-950 dark:to-blue-950/20" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-200/20 rounded-full blur-3xl dark:bg-emerald-900/10" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl dark:bg-blue-900/10" />

        <div className="relative max-w-7xl mx-auto px-6 py-24 lg:py-32">
          <div className="text-center space-y-8 max-w-3xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center px-4 py-2 bg-emerald-100/50 dark:bg-emerald-900/30 rounded-full border border-emerald-200 dark:border-emerald-800">
              <Zap className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mr-2" />
              <span className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
                AI-Powered Customer Support That Actually Works
              </span>
            </div>

            {/* Main Headline */}
            <div className="space-y-4">
              <h1 className="text-5xl lg:text-7xl font-bold text-slate-900 dark:text-white leading-tight">
                Your AI Agent,{" "}
                <span className="bg-gradient-to-r from-emerald-500 to-blue-600 bg-clip-text text-transparent">
                  Always On Call
                </span>
              </h1>
              <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
                Stop hiring support teams. Build an AI agent trained on your business docs. Deploy to WhatsApp, Messenger, Instagram in minutes. Handle customer questions 24/7.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button
                size="lg"
                className="bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 text-white px-8 h-12 text-base group"
                onClick={() => navigate("/register")}
              >
                Get Started Free
                <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="px-8 h-12 text-base border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-900"
                onClick={() => {
                  document.getElementById("features")?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                See How It Works
              </Button>
            </div>

            {/* Trust metrics */}
            <div className="flex flex-col sm:flex-row gap-8 justify-center pt-8 text-sm text-slate-600 dark:text-slate-400">
              <div>
                <div className="text-2xl font-bold text-slate-900 dark:text-white">500+</div>
                <div>Businesses Powered</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-slate-900 dark:text-white">1M+</div>
                <div>Questions Answered</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-slate-900 dark:text-white">99.9%</div>
                <div>Uptime Guaranteed</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section id="features" className="py-24 border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl font-bold text-slate-900 dark:text-white">
              Everything You Need to Succeed
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              Powerful features designed to keep your customers happy and your team productive.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 hover:shadow-lg dark:hover:shadow-emerald-500/10 transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center mb-4">
                  <MessageSquare className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                </div>
                <CardTitle>Smart Conversations</CardTitle>
                <CardDescription>
                  AI learns from your documents and responds like your team would
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span className="text-slate-600 dark:text-slate-400">Multi-language support</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span className="text-slate-600 dark:text-slate-400">Context-aware answers</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span className="text-slate-600 dark:text-slate-400">Human handoff when needed</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Feature 2 */}
            <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 hover:shadow-lg dark:hover:shadow-emerald-500/10 transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mb-4">
                  <BarChart3 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <CardTitle>Instant Insights</CardTitle>
                <CardDescription>
                  Track agent performance, customer satisfaction, and trends in real-time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <span className="text-slate-600 dark:text-slate-400">Live dashboards</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <span className="text-slate-600 dark:text-slate-400">Detailed analytics</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <span className="text-slate-600 dark:text-slate-400">Exportable reports</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Feature 3 */}
            <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 hover:shadow-lg dark:hover:shadow-emerald-500/10 transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mb-4">
                  <Settings className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <CardTitle>One-Click Deploy</CardTitle>
                <CardDescription>
                  Launch to WhatsApp, Messenger, or Instagram with a single click
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    <span className="text-slate-600 dark:text-slate-400">No code needed</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    <span className="text-slate-600 dark:text-slate-400">Instant activation</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    <span className="text-slate-600 dark:text-slate-400">Auto-updates</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* PRICING SECTION */}
      <section className="py-24 bg-slate-50 dark:bg-slate-900/50 border-y border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl font-bold text-slate-900 dark:text-white">
              Simple, Transparent Pricing
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300">
              Start free. Scale as you grow. No surprises.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Free Plan */}
            <Card className="border-slate-200 dark:border-slate-800">
              <CardHeader>
                <CardTitle>Free</CardTitle>
                <CardDescription>Perfect for testing</CardDescription>
                <div className="mt-4">
                  <div className="text-3xl font-bold text-slate-900 dark:text-white">$0</div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Forever free</p>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-3 text-sm">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span>1 AI Agent</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span>100 conversations/month</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span>Basic analytics</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span>Community support</span>
                  </li>
                </ul>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => navigate("/register")}
                >
                  Get Started
                </Button>
              </CardContent>
            </Card>

            {/* Growth Plan */}
            <Card className="border-emerald-500 dark:border-emerald-600 bg-gradient-to-br from-emerald-50 to-white dark:from-emerald-950/20 dark:to-slate-900 relative">
              <div className="absolute top-4 right-4 bg-emerald-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                Popular
              </div>
              <CardHeader>
                <CardTitle>Growth</CardTitle>
                <CardDescription>For growing businesses</CardDescription>
                <div className="mt-4">
                  <div className="text-3xl font-bold text-slate-900 dark:text-white">$29</div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">/month</p>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-3 text-sm">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span>5 AI Agents</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span>10,000 conversations/month</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span>Advanced analytics</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span>Email support</span>
                  </li>
                </ul>
                <Button
                  className="w-full bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600"
                  onClick={() => navigate("/register?plan=growth")}
                >
                  Start Free Trial
                </Button>
              </CardContent>
            </Card>

            {/* Pro Plan */}
            <Card className="border-slate-200 dark:border-slate-800">
              <CardHeader>
                <CardTitle>Pro</CardTitle>
                <CardDescription>Enterprise-ready</CardDescription>
                <div className="mt-4">
                  <div className="text-3xl font-bold text-slate-900 dark:text-white">$79</div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">/month</p>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-3 text-sm">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span>Unlimited agents</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span>Unlimited conversations</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span>Full API access</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span>24/7 priority support</span>
                  </li>
                </ul>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => navigate("/register?plan=pro")}
                >
                  Start Free Trial
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-24">
        <div className="max-w-3xl mx-auto px-6 text-center space-y-8">
          <h2 className="text-4xl font-bold text-slate-900 dark:text-white">
            Ready to Transform Your Support?
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-300">
            Join 500+ businesses already using Aura. Start free, upgrade anytime.
          </p>

          <form onSubmit={handleWaitlist} className="flex gap-2 max-w-md mx-auto">
            <input
              type="email"
              placeholder="you@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 px-4 py-3 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-950 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400"
              required
            />
            <Button
              type="submit"
              className="bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 text-white px-6"
            >
              {submitted ? "✓ Check Email" : "Get Started"}
            </Button>
          </form>

          <p className="text-sm text-slate-500 dark:text-slate-400">
            No credit card required. Free forever plan available.
          </p>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-200 dark:border-slate-800 py-12 bg-slate-50 dark:bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-semibold text-slate-900 dark:text-white mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                <li><a href="#" className="hover:text-emerald-600">Features</a></li>
                <li><a href="#" className="hover:text-emerald-600">Pricing</a></li>
                <li><a href="#" className="hover:text-emerald-600">Docs</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-slate-900 dark:text-white mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                <li><a href="#" className="hover:text-emerald-600">Blog</a></li>
                <li><a href="#" className="hover:text-emerald-600">About</a></li>
                <li><a href="#" className="hover:text-emerald-600">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-slate-900 dark:text-white mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                <li><a href="#" className="hover:text-emerald-600">Privacy</a></li>
                <li><a href="#" className="hover:text-emerald-600">Terms</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-slate-900 dark:text-white mb-4">Follow</h4>
              <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                <li><a href="#" className="hover:text-emerald-600">Twitter</a></li>
                <li><a href="#" className="hover:text-emerald-600">LinkedIn</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-200 dark:border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-slate-600 dark:text-slate-400">
            <p>&copy; 2026 Aura. All rights reserved.</p>
            <p>Built with ❤️ for support teams</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
