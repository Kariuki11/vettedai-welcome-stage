import { Zap, Eye, Target } from "lucide-react";
import { Card } from "@/components/ui/card";

const benefits = [
  {
    icon: Zap,
    title: "Find your signal, faster.",
    description: "Replace weeks of manual screening with an intelligent, automated process. We handle the vetting, so you can focus on what matters: connecting with the right people.",
  },
  {
    icon: Eye,
    title: "Look beyond the resume.",
    description: "Every candidate completes a task that mirrors the real work. See their process, their thinking, and their final output—a true measure of their potential.",
  },
  {
    icon: Target,
    title: "Hire with conviction.",
    description: "The Talent Intelligence Matrix isn't just a score; it's a story. A multi-dimensional view that empowers you and your team to make the right hire, with confidence you can defend.",
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
