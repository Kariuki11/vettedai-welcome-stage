import { CheckCircle2 } from "lucide-react";

export const PainSection = () => {
  return (
    <section className="px-6 py-20 md:py-32 bg-muted/30">
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold">
            Hiring used to be hard. Now it's chaos.
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8 md:gap-12 mt-16">
          {/* Left: Chaos Panel */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-muted-foreground mb-6">The Old Way</h3>
            <div className="bg-card border border-border rounded-lg p-6 space-y-3">
              {[...Array(10)].map((_, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 motion-safe:animate-shimmer"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <div className="flex-1 h-3 bg-muted/50 rounded" />
                  <div className="px-2 py-1 bg-muted/30 rounded-full">
                    <div className="h-2 w-12 bg-muted/50 rounded" />
                  </div>
                </div>
              ))}
            </div>
            <p className="text-sm text-muted-foreground italic mt-4">
              Hundreds of CVs. All look great. Who can actually do the job?
            </p>
          </div>

          {/* Right: Clarity Panel */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold mb-6">The VettedAI Way</h3>
            <div className="space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="bg-card border border-primary/30 rounded-lg p-5 shadow-sm motion-safe:animate-fade-in"
                  style={{ animationDelay: `${200 + i * 150}ms` }}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex-shrink-0" />
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="h-3 bg-foreground/80 rounded w-32" />
                        <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                      </div>
                      <div className="h-2 bg-muted rounded w-full" />
                      <div className="h-2 bg-muted rounded w-3/4" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-sm text-foreground mt-4 font-medium">
              Clear signal. Verifiable proof. Confident decisions.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};