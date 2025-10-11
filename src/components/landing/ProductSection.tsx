import { Zap, Sparkles, Grid3x3 } from "lucide-react";
import { Card } from "@/components/ui/card";

const benefits = [
  {
    icon: Zap,
    title: "Find your signal, faster.",
    description: "Automate the noise, so you can focus on what matters: connecting with the right people.",
  },
  {
    icon: Sparkles,
    title: "Generate Proof of Work.",
    description: "Our AI Co-pilot helps you design tasks that mirror the actual role, revealing how candidates truly think, create, and solve.",
  },
  {
    icon: Grid3x3,
    title: "Decide with the TI Matrix.",
    description: "Go beyond a score. The Talent Intelligence Matrix is your multi-dimensional view of ability—verifiable proof you can stand behind.",
  },
];

export const ProductSection = () => {
  return (
    <section className="px-6 py-24 bg-background">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-4xl md:text-5xl font-bold">
            Your workspace for hiring intelligence.
          </h2>
        </div>
        
        {/* Benefits Grid */}
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
