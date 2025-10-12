import { Card, CardContent } from "@/components/ui/card";
import { FileText, Send, Lightbulb } from "lucide-react";

const steps = [
  {
    icon: FileText,
    title: "Share your JD",
    description: "Upload your job description and let our AI understand what you're looking for.",
  },
  {
    icon: Send,
    title: "We find & test",
    description: "We source candidates and have them complete proof-of-work tasks designed for the role.",
  },
  {
    icon: Lightbulb,
    title: "You get insight",
    description: "Receive a shortlist with verified work samples and clear talent intelligence.",
  },
];

export const HowItWorksSection = () => {
  return (
    <section className="px-6 py-20 md:py-32 bg-muted/30">
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold">
            How it works
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