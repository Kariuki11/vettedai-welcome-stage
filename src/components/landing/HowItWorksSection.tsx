import { Card, CardContent } from "@/components/ui/card";
import { FileText, Send, CheckCircle } from "lucide-react";
import { BadgeGroup } from "./BadgeSystem";

const steps = [
  {
    icon: FileText,
    title: "Paste your job description",
    description: "Our AI co-pilot suggests a short, realistic task that mirrors the role.",
  },
  {
    icon: Send,
    title: "Send it to your candidates",
    description: "They complete it right in their browser—no setup, no extra tools.",
  },
  {
    icon: CheckCircle,
    title: "See your shortlist",
    description: "We highlight the strongest performers with clear, verifiable proof of skill.",
    showBadges: true,
  },
];

export const HowItWorksSection = () => {
  return (
    <section className="px-6 py-20 md:py-32 bg-muted/30">
      <div className="max-w-[1200px] mx-auto space-y-12">
        <div className="text-center space-y-4">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold">
            Here's how it works:
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mt-16 relative">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={step.title} className="relative">
                <Card className="border-border/50 shadow-sm h-full">
                  <CardContent className="pt-8 pb-6 space-y-4">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold">{step.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {step.description}
                    </p>
                    
                    {/* Show badge preview in step 3 */}
                    {step.showBadges && (
                      <div className="pt-4 mt-4 border-t border-border/30">
                        <p className="text-xs text-muted-foreground mb-3">Example proof badges:</p>
                        <BadgeGroup />
                      </div>
                    )}
                  </CardContent>
                </Card>
                
                {/* Connector line */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-16 -right-4 w-8 h-0.5 bg-border" />
                )}
              </div>
            );
          })}
        </div>

        <p className="text-center text-lg text-muted-foreground mt-12 max-w-2xl mx-auto">
          From job description to high-confidence shortlist in 48 hours.
        </p>
      </div>
    </section>
  );
};
