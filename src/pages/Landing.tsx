import { Activity, Eye, Bell, Zap, Shield, BarChart3, ArrowRight, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const features = [
  { icon: Eye, title: 'Visual Change Detection', desc: 'Monitor any website for content changes with smart diffing algorithms.' },
  { icon: Zap, title: 'Instant Alerts', desc: 'Get notified the moment a change is detected on your tracked pages.' },
  { icon: Shield, title: 'Error Monitoring', desc: 'Track HTTP errors, downtime, and blocked requests automatically.' },
  { icon: BarChart3, title: 'Analytics Dashboard', desc: 'Beautiful stats and history for all your monitored websites.' },
  { icon: Bell, title: 'Smart Filters', desc: 'Organize monitors with tags and filter by status or category.' },
  { icon: Activity, title: 'Diff Viewer', desc: 'Side-by-side comparison of old vs new content with highlights.' },
];

const pricingPlans = [
  { name: 'Free', price: '$0', period: '/forever', features: ['5 monitors', 'Manual checks', 'Basic diff view', 'JSON export'], cta: 'Get Started' },
  { name: 'Pro', price: '$9', period: '/month', features: ['Unlimited monitors', 'Auto-check every 5 min', 'Email notifications', 'Priority support', 'API access'], cta: 'Start Free Trial', popular: true },
  { name: 'Enterprise', price: '$29', period: '/month', features: ['Everything in Pro', 'Team collaboration', 'Webhook integrations', 'Custom intervals', 'SLA guarantee'], cta: 'Contact Sales' },
];

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen gradient-bg">
      {/* Nav */}
      <nav className="glass sticky top-0 z-50 border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg gradient-primary flex items-center justify-center">
              <Activity className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold gradient-text">Smart Detector</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition-colors">Features</a>
            <a href="#pricing" className="hover:text-foreground transition-colors">Pricing</a>
            <a href="#faq" className="hover:text-foreground transition-colors">FAQ</a>
          </div>
          <Button onClick={() => navigate('/dashboard')} className="gradient-primary border-0">
            Go to Dashboard <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px]" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-[120px]" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-border/50 bg-secondary/50 text-sm text-muted-foreground mb-8">
            <Zap className="w-3.5 h-3.5 text-accent" /> Now with real-time monitoring
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold tracking-tight mb-6">
            <span className="gradient-text">Detect Website Changes</span>
            <br />
            <span className="text-foreground">Before Anyone Else</span>
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
            Monitor any website for content changes, price drops, restocks, or competitor updates. Get instant alerts with a beautiful diff view.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={() => navigate('/dashboard')} className="gradient-primary border-0 text-base px-8 h-12">
              Start Monitoring — Free <ArrowRight className="w-5 h-5" />
            </Button>
            <Button size="lg" variant="outline" className="text-base px-8 h-12 border-border/50">
              Watch Demo
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mt-4">No credit card required · 5 free monitors</p>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-foreground">Everything you need to stay ahead</h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">Powerful monitoring tools wrapped in a beautiful, intuitive interface.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f) => (
            <div key={f.title} className="group p-6 rounded-2xl border border-border/30 bg-card/40 hover:bg-card/70 transition-all hover:border-primary/30 hover:glow-primary">
              <div className="w-11 h-11 rounded-xl gradient-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <f.icon className="w-5 h-5 text-primary-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">{f.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-foreground">Simple, transparent pricing</h2>
          <p className="text-muted-foreground text-lg">Start free. Upgrade when you need more power.</p>
        </div>
        <div className="grid sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {pricingPlans.map((plan) => (
            <div key={plan.name} className={`relative p-6 rounded-2xl border transition-all ${plan.popular ? 'border-primary/50 bg-card/70 glow-primary scale-105' : 'border-border/30 bg-card/40'}`}>
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-xs font-medium gradient-primary text-primary-foreground">
                  Most Popular
                </div>
              )}
              <h3 className="text-lg font-semibold text-foreground mb-1">{plan.name}</h3>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                <span className="text-muted-foreground text-sm">{plan.period}</span>
              </div>
              <ul className="space-y-3 mb-8">
                {plan.features.map((feat) => (
                  <li key={feat} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Check className="w-4 h-4 text-success shrink-0" /> {feat}
                  </li>
                ))}
              </ul>
              <Button className={`w-full ${plan.popular ? 'gradient-primary border-0' : ''}`} variant={plan.popular ? 'default' : 'outline'} onClick={() => navigate('/dashboard')}>
                {plan.cta}
              </Button>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="rounded-2xl gradient-card border border-border/30 p-12 text-center glow-primary">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">Ready to start monitoring?</h2>
          <p className="text-muted-foreground text-lg mb-8 max-w-lg mx-auto">Join thousands of users tracking website changes in real-time.</p>
          <Button size="lg" onClick={() => navigate('/dashboard')} className="gradient-primary border-0 text-base px-8 h-12">
            Get Started for Free <ArrowRight className="w-5 h-5" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/30 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-primary" />
            <span className="font-medium text-foreground">Smart Detector</span>
          </div>
          <p>© {new Date().getFullYear()} Smart Detector. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
