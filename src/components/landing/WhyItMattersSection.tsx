import { useState, useEffect } from "react";
import { FileText, ArrowRight, Sparkles, TrendingUp, MessageSquare, Gauge, ListChecks, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

interface PerformanceChartProps {
  animate?: boolean;
}

const advantages = [
  {
    icon: Gauge,
    title: "Confidence without the chaos",
    description: "Go from guesses to grounded decisions. Every shortlist pairs a confidence signal with the proof behind it.",
  },
  {
    icon: ListChecks,
    title: "Signals your team can align on",
    description: "Structured scoring makes it simple to compare candidates against the work that actually matters to your role.",
  },
  {
    icon: CheckCircle2,
    title: "Proof delivered in hours, not weeks",
    description: "VettedAI handles the busywork—crafting role-specific tasks, collecting responses, and surfacing what stands out.",
  },
];

const PerformanceChart = ({ animate = false }: PerformanceChartProps) => {
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
        strokeDasharray="1000"
        className={animate ? "animate-draw-polygon" : ""}
        style={!animate ? { strokeDashoffset: 0 } : {}}
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
  const [activeSlide, setActiveSlide] = useState(0);
  const { ref } = useScrollAnimation();

  return (
    <section ref={ref as React.RefObject<HTMLElement>} className="px-6 py-24 bg-muted/30">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center space-y-4 mb-16 animate-fade-in-up">
          <span className="inline-flex items-center justify-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-primary">
            Why it matters
          </span>
          <h2 className="text-4xl md:text-5xl font-bold">
            The problem isn't filtering harder. It's seeing better.
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Traditional hiring tools stop at the resume. They leave you hoping the keywords translate to the work. VettedAI delivers the proof: how candidates think, collaborate, and execute when the stakes are real.
          </p>
        </div>

        {/* Carousel Container */}
        <div 
          className="relative"
          role="region"
          aria-label="Comparison carousel"
          aria-live="polite"
        >
          {/* Slide Indicators */}
          <div className="flex justify-center gap-2 mb-8">
            <div className={`h-2 rounded-full transition-all duration-300 ${activeSlide === 0 ? 'w-8 bg-primary' : 'w-2 bg-muted-foreground/30'}`} />
            <div className={`h-2 rounded-full transition-all duration-300 ${activeSlide === 1 ? 'w-8 bg-primary' : 'w-2 bg-muted-foreground/30'}`} />
          </div>

          {/* SLIDE 1: THE OLD WAY */}
          <div 
            className={`transition-all duration-500 ${
              activeSlide === 0 
                ? 'opacity-100 translate-x-0 relative' 
                : 'opacity-0 -translate-x-8 absolute inset-0 pointer-events-none'
            }`}
          >
            <div className="max-w-md mx-auto">
              {/* Slide Label */}
              <h3 className="text-xs font-bold tracking-widest text-muted-foreground uppercase text-center mb-6">
                THE OLD WAY: GUESSING WITH PROXIES
              </h3>

              {/* Old Way Card */}
              <div className="bg-background border border-border rounded-lg p-6 shadow-sm space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-lg font-medium text-foreground">Wanjiku Gitari</h4>
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

              {/* Caption */}
              <p className="text-sm text-muted-foreground text-center mt-8 leading-relaxed max-w-sm mx-auto">
                You get a one-dimensional summary of keywords and credentials. No context, no proof, no confidence.
              </p>

              {/* Navigation Button */}
              <div className="flex justify-center mt-8">
                <Button 
                  onClick={() => setActiveSlide(1)}
                  size="lg"
                  className="gap-2"
                  aria-label="View the VettedAI way"
                >
                  See the New Way
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* SLIDE 2: THE VETTEDAI WAY */}
          <div 
            className={`transition-all duration-500 ${
              activeSlide === 1 
                ? 'opacity-100 translate-x-0 relative' 
                : 'opacity-0 translate-x-8 absolute inset-0 pointer-events-none'
            }`}
          >
            <div className="max-w-md mx-auto">
              {/* Slide Label */}
              <h3 className="text-xs font-bold tracking-widest text-primary uppercase text-center mb-6">
                THE VETTEDAI WAY: DECIDING WITH PROOF
              </h3>

              {/* New Way Card */}
              <div className="bg-background border-t-4 border-t-primary rounded-lg shadow-lg p-6 space-y-5">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-lg font-semibold text-foreground">Wanjiku Gitari</h4>
                    <span className="inline-block mt-2 px-3 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full">
                      Ready to Review
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground">Completed 2h ago</span>
                </div>

                {/* Performance Chart */}
                <div className="space-y-3 py-4">
                  <h5 className="text-sm font-semibold text-foreground">Performance Snapshot</h5>
                  <div className="flex items-center justify-center h-48">
                    <div className="w-48 h-48">
                      <PerformanceChart animate={activeSlide === 1} />
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

                {/* AI Insights with staggered animation */}
                <div className="space-y-3 py-3 border-t border-border">
                  <p className="text-xs font-medium text-muted-foreground">AI-Generated Strengths</p>
                  <div className="flex flex-wrap gap-2">
                    <span 
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary rounded-full text-xs font-medium transition-all duration-500 ${
                        activeSlide === 1 ? 'opacity-100 translate-y-0 delay-[400ms]' : 'opacity-0 translate-y-4'
                      }`}
                    >
                      <Sparkles className="h-3 w-3" />
                      Systems Thinker
                    </span>
                    <span 
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary rounded-full text-xs font-medium transition-all duration-500 ${
                        activeSlide === 1 ? 'opacity-100 translate-y-0 delay-[600ms]' : 'opacity-0 translate-y-4'
                      }`}
                    >
                      <MessageSquare className="h-3 w-3" />
                      Clear Communicator
                    </span>
                    <span 
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary rounded-full text-xs font-medium transition-all duration-500 ${
                        activeSlide === 1 ? 'opacity-100 translate-y-0 delay-[800ms]' : 'opacity-0 translate-y-4'
                      }`}
                    >
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

              {/* Caption */}
              <p className="text-sm text-muted-foreground text-center mt-8 leading-relaxed max-w-sm mx-auto">
                You get a multi-dimensional analysis of their actual skill. See how they think, work, and solve—backed by verifiable proof.
              </p>

              {/* Navigation Button */}
              <div className="flex justify-center mt-8">
                <Button 
                  onClick={() => setActiveSlide(0)}
                  variant="outline"
                  size="lg"
                  className="gap-2"
                  aria-label="Go back to old way"
                >
                  <ArrowRight className="h-4 w-4 rotate-180" />
                  Go Back
                </Button>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-20 grid gap-6 md:grid-cols-3">
          {advantages.map((advantage) => {
            const Icon = advantage.icon;
            return (
              <div
                key={advantage.title}
                className="rounded-2xl border border-border bg-background/80 p-6 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-5 text-lg font-semibold text-foreground">{advantage.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{advantage.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
