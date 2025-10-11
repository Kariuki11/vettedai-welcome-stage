import { useState, useEffect } from "react";
import { FileText, ArrowRight, Sparkles, TrendingUp, MessageSquare, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const PerformanceChart = () => {
  const metrics = [
    { label: "Strategic Thinking", value: 8.5, angle: 0 },
    { label: "Communication", value: 9.0, angle: 90 },
    { label: "Product Sense", value: 7.8, angle: 180 },
    { label: "Problem Solving", value: 8.2, angle: 270 },
  ];

  const maxValue = 10;
  const centerX = 80;
  const centerY = 80;
  const radius = 60;

  // Calculate polygon points for the data
  const points = metrics
    .map((metric) => {
      const angleRad = ((metric.angle - 90) * Math.PI) / 180;
      const distance = (metric.value / maxValue) * radius;
      const x = centerX + distance * Math.cos(angleRad);
      const y = centerY + distance * Math.sin(angleRad);
      return `${x},${y}`;
    })
    .join(" ");

  // Calculate background circle points
  const bgPoints = metrics
    .map((metric) => {
      const angleRad = ((metric.angle - 90) * Math.PI) / 180;
      const x = centerX + radius * Math.cos(angleRad);
      const y = centerY + radius * Math.sin(angleRad);
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg viewBox="0 0 160 160" className="w-full h-full">
      {/* Background polygon */}
      <polygon
        points={bgPoints}
        fill="hsl(var(--primary) / 0.05)"
        stroke="hsl(var(--primary) / 0.2)"
        strokeWidth="1"
      />
      
      {/* Grid circles */}
      {[0.33, 0.66, 1].map((factor, i) => (
        <circle
          key={i}
          cx={centerX}
          cy={centerY}
          r={radius * factor}
          fill="none"
          stroke="hsl(var(--muted-foreground) / 0.1)"
          strokeWidth="1"
        />
      ))}
      
      {/* Axis lines */}
      {metrics.map((metric, i) => {
        const angleRad = ((metric.angle - 90) * Math.PI) / 180;
        const x = centerX + radius * Math.cos(angleRad);
        const y = centerY + radius * Math.sin(angleRad);
        return (
          <line
            key={i}
            x1={centerX}
            y1={centerY}
            x2={x}
            y2={y}
            stroke="hsl(var(--muted-foreground) / 0.15)"
            strokeWidth="1"
          />
        );
      })}
      
      {/* Data polygon with animation */}
      <polygon
        points={points}
        fill="hsl(var(--primary) / 0.2)"
        stroke="hsl(var(--primary))"
        strokeWidth="2"
        className="animate-fade-in"
      />
      
      {/* Data points */}
      {metrics.map((metric, i) => {
        const angleRad = ((metric.angle - 90) * Math.PI) / 180;
        const distance = (metric.value / maxValue) * radius;
        const x = centerX + distance * Math.cos(angleRad);
        const y = centerY + distance * Math.sin(angleRad);
        return (
          <circle
            key={i}
            cx={x}
            cy={y}
            r="4"
            fill="hsl(var(--primary))"
            className="animate-pulse-glow"
          />
        );
      })}
    </svg>
  );
};

export const WhyItMattersSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const { ref } = useScrollAnimation();

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section ref={ref as React.RefObject<HTMLElement>} className="px-6 py-24 bg-muted/30">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center space-y-4 mb-16 animate-fade-in-up">
          <h2 className="text-4xl md:text-5xl font-bold">
            From Flat Proxies to Rich Intelligence
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Stop guessing based on keywords. Start deciding with proof.
          </p>
        </div>

        {/* Card Comparison */}
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-start">
          {/* OLD WAY CARD */}
          <div className={`transition-all duration-700 ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"}`}>
            <div className="bg-background border border-border rounded-lg p-6 shadow-sm space-y-4">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-medium text-foreground">Amina Kirigo</h3>
                  <span className="inline-block mt-2 px-3 py-1 text-xs font-medium bg-muted text-muted-foreground rounded-full">
                    Needs Review
                  </span>
                </div>
              </div>

              {/* Resume Link */}
              <div className="flex items-center gap-2 py-3 border-t border-border">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground underline">View Resume.pdf</span>
              </div>

              {/* Manual Notes */}
              <div className="space-y-2 py-3 border-t border-border">
                <p className="text-xs font-medium text-muted-foreground">Manual Notes:</p>
                <p className="text-sm text-muted-foreground italic">
                  "Seems like a good fit based on keywords..."
                </p>
              </div>

              {/* Static Details */}
              <div className="space-y-2 py-3 border-t border-border">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Experience:</span>
                  <span className="text-foreground">5 years</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Education:</span>
                  <span className="text-foreground">MBA, University of Nairobi</span>
                </div>
              </div>

              {/* CTA */}
              <Button variant="outline" className="w-full mt-4">
                Schedule Interview
              </Button>
            </div>

            {/* Explanation */}
            <p className="text-sm text-muted-foreground text-center mt-6 leading-relaxed">
              A flat proxy based on resume keywords and credentials. <br />
              <span className="font-medium">No context, no proof, no confidence.</span>
            </p>
          </div>

          {/* ARROW INDICATOR - Hidden on mobile */}
          <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
            <ArrowRight className="h-8 w-8 text-primary animate-pulse" />
          </div>

          {/* NEW WAY CARD */}
          <div className={`transition-all duration-700 delay-200 ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"}`}>
            <div className="bg-background border-t-4 border-t-primary rounded-lg shadow-lg p-6 space-y-5">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-foreground">Wanjiku Gitari</h3>
                  <span className="inline-block mt-2 px-3 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full">
                    Ready to Review
                  </span>
                </div>
                <span className="text-xs text-muted-foreground">Completed 2h ago</span>
              </div>

              {/* Performance Chart */}
              <div className="space-y-3 py-4">
                <h4 className="text-sm font-semibold text-foreground">Performance Snapshot</h4>
                <div className="flex items-center justify-center h-48">
                  <div className="w-48 h-48">
                    <PerformanceChart />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Strategic Thinking</span>
                    <span className="font-semibold text-primary">8.5</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Communication</span>
                    <span className="font-semibold text-primary">9.0</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Product Sense</span>
                    <span className="font-semibold text-primary">7.8</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Problem Solving</span>
                    <span className="font-semibold text-primary">8.2</span>
                  </div>
                </div>
              </div>

              {/* AI Insights */}
              <div className="space-y-3 py-3 border-t border-border">
                <p className="text-xs font-medium text-muted-foreground">AI-Generated Strengths</p>
                <div className="flex flex-wrap gap-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary rounded-full text-xs font-medium">
                    <Sparkles className="h-3 w-3" />
                    Systems Thinker
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary rounded-full text-xs font-medium">
                    <MessageSquare className="h-3 w-3" />
                    Clear Communicator
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary rounded-full text-xs font-medium">
                    <TrendingUp className="h-3 w-3" />
                    Data-Driven
                  </span>
                </div>
              </div>

              {/* CTA */}
              <Button variant="hero" className="w-full mt-4">
                View Proof of Work →
              </Button>

              {/* Metadata Footer */}
              <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t border-border">
                <span>Assessed via Product Strategy Task</span>
                <span>Completed in 3.5 hours</span>
              </div>
            </div>

            {/* Explanation */}
            <p className="text-sm text-muted-foreground text-center mt-6 leading-relaxed">
              A rich, multi-dimensional view of true ability. <br />
              <span className="font-medium text-primary">See how they think, work, and solve—backed by verifiable proof.</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
