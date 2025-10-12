import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Clock } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { BadgeGroup } from "./BadgeSystem";

export const PainSection = () => {
  return (
    <section className="px-6 py-20 md:py-32 bg-muted/30">
      <div className="max-w-[1200px] mx-auto space-y-12">
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold">
            Hiring used to be hard. Now it's chaos.
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8 md:gap-12 mt-16">
          {/* Left: Before - Dense ATS list with similarity labels */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-muted-foreground mb-6">Before</h3>
            <div className="bg-card border border-border rounded-lg p-6 space-y-2">
              {[...Array(12)].map((_, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between gap-3 py-2"
                >
                  <div className="flex items-center gap-2 flex-1">
                    <div className="h-2 bg-muted/70 rounded w-24" />
                    <div className="h-2 bg-muted/50 rounded w-16" />
                    <div className="h-2 bg-muted/70 rounded w-20" />
                  </div>
                  <Badge variant="destructive" className="text-xs shrink-0 bg-destructive/10 text-destructive hover:bg-destructive/20">
                    Similarity 87%
                  </Badge>
                </div>
              ))}
            </div>
            <p className="text-sm text-muted-foreground italic mt-4">
              Hundreds of CVs. All look great. Who can actually do the job?
            </p>
          </div>

          {/* Right: After - Outcome chips + clean candidate cards */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold mb-6">After</h3>
            
            {/* Outcome chips */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              <div className="bg-card border border-success/30 rounded-lg p-4 text-center">
                <TrendingUp className="h-5 w-5 text-success mx-auto mb-2" />
                <p className="text-sm font-medium text-success">Confidence ↑</p>
              </div>
              <div className="bg-card border border-border rounded-lg p-4 text-center">
                <TrendingDown className="h-5 w-5 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm font-medium text-muted-foreground">Noise ↓</p>
              </div>
              <div className="bg-card border border-primary/30 rounded-lg p-4 text-center">
                <Clock className="h-5 w-5 text-primary mx-auto mb-2" />
                <p className="text-xs font-medium text-primary">Time saved<br />12h/week</p>
              </div>
            </div>

            {/* Clean candidate cards with badge system */}
            <div className="space-y-3">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="bg-card border border-primary/30 rounded-lg p-4 shadow-sm"
                >
                  <div className="flex items-start gap-3 mb-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-primary/10 text-primary text-sm">
                        {['JD', 'SK', 'AM'][i]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-1.5">
                      <div className="h-2.5 bg-foreground/80 rounded w-32" />
                      <div className="h-2 bg-muted rounded w-24" />
                    </div>
                  </div>
                  <BadgeGroup />
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
