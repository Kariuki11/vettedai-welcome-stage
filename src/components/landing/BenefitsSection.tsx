import { Zap, Shield, TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/card";

const benefits = [
  {
    icon: Zap,
    title: "Speed",
    description: "Get vetted shortlists in 48 hours. No more weeks of manual screening and guesswork.",
  },
  {
    icon: Shield,
    title: "Proof",
    description: "Every candidate completes real work tasks. No more résumé inflation or interview theater.",
  },
  {
    icon: TrendingUp,
    title: "Confidence",
    description: "Hire with verified intelligence. Multi-dimensional proof replaces one-page proxies.",
  },
];

export const BenefitsSection = () => {
  return (
    <section className="px-6 py-24 bg-background">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <Card 
                key={benefit.title}
                className="p-8 shadow-elegant hover:shadow-glow transition-smooth border-border/50 animate-fade-in"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold">{benefit.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};
