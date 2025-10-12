export const PerformanceGraphSection = () => {
  return (
    <section className="px-6 py-32 bg-muted/30">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center space-y-6 mb-16">
          <h2 className="text-4xl md:text-5xl font-bold">Powered by the Performance Graph.</h2>
          <p className="text-lg md:text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Our proprietary Performance Graph learns from every hire. It looks beyond <em>what</em> a candidate submits
            to understand <em>how</em> they work—capturing the behavioral signals that actually predict success, so you
            can repeat it, with confidence.
          </p>
          <p className="text-base font-medium text-primary pt-2">
            The more you hire with VettedAI, the smarter it gets.
          </p>
        </div>

        {/* Performance Graph Visualization */}
        <div className="relative h-80 flex items-center justify-center">
          <svg viewBox="0 0 600 400" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            {/* Connections (animated paths) */}
            <g className="opacity-40">
              <path
                d="M 100 200 Q 200 150 300 200"
                stroke="hsl(var(--primary-glow))"
                strokeWidth="2"
                fill="none"
                className="animate-pulse"
              />
              <path
                d="M 300 200 Q 400 150 500 200"
                stroke="hsl(var(--primary-glow))"
                strokeWidth="2"
                fill="none"
                className="animate-pulse"
                style={{ animationDelay: "0.3s" }}
              />
              <path
                d="M 100 200 Q 150 100 200 100"
                stroke="hsl(var(--primary-glow))"
                strokeWidth="2"
                fill="none"
                className="animate-pulse"
                style={{ animationDelay: "0.6s" }}
              />
              <path
                d="M 200 100 Q 250 100 300 120"
                stroke="hsl(var(--primary-glow))"
                strokeWidth="2"
                fill="none"
                className="animate-pulse"
                style={{ animationDelay: "0.9s" }}
              />
              <path
                d="M 300 120 Q 400 100 500 100"
                stroke="hsl(var(--primary-glow))"
                strokeWidth="2"
                fill="none"
                className="animate-pulse"
                style={{ animationDelay: "1.2s" }}
              />
              <path
                d="M 100 200 Q 150 300 200 300"
                stroke="hsl(var(--primary-glow))"
                strokeWidth="2"
                fill="none"
                className="animate-pulse"
                style={{ animationDelay: "1.5s" }}
              />
              <path
                d="M 200 300 Q 250 300 300 280"
                stroke="hsl(var(--primary-glow))"
                strokeWidth="2"
                fill="none"
                className="animate-pulse"
                style={{ animationDelay: "1.8s" }}
              />
              <path
                d="M 300 280 Q 400 300 500 300"
                stroke="hsl(var(--primary-glow))"
                strokeWidth="2"
                fill="none"
                className="animate-pulse"
                style={{ animationDelay: "2.1s" }}
              />
            </g>

            {/* Nodes (pulsing circles) */}
            <g>
              <circle cx="100" cy="200" r="12" fill="hsl(var(--primary))" className="animate-pulse-glow" />
              <circle
                cx="200"
                cy="100"
                r="10"
                fill="hsl(var(--primary))"
                className="animate-pulse-glow"
                style={{ animationDelay: "0.3s" }}
              />
              <circle
                cx="200"
                cy="300"
                r="10"
                fill="hsl(var(--primary))"
                className="animate-pulse-glow"
                style={{ animationDelay: "0.6s" }}
              />
              <circle
                cx="300"
                cy="200"
                r="14"
                fill="hsl(var(--primary))"
                className="animate-pulse-glow"
                style={{ animationDelay: "0.9s" }}
              />
              <circle
                cx="300"
                cy="120"
                r="9"
                fill="hsl(var(--primary))"
                className="animate-pulse-glow"
                style={{ animationDelay: "1.2s" }}
              />
              <circle
                cx="300"
                cy="280"
                r="9"
                fill="hsl(var(--primary))"
                className="animate-pulse-glow"
                style={{ animationDelay: "1.5s" }}
              />
              <circle
                cx="400"
                cy="200"
                r="11"
                fill="hsl(var(--primary))"
                className="animate-pulse-glow"
                style={{ animationDelay: "1.8s" }}
              />
              <circle
                cx="500"
                cy="100"
                r="10"
                fill="hsl(var(--primary))"
                className="animate-pulse-glow"
                style={{ animationDelay: "2.1s" }}
              />
              <circle
                cx="500"
                cy="200"
                r="12"
                fill="hsl(var(--primary))"
                className="animate-pulse-glow"
                style={{ animationDelay: "2.4s" }}
              />
              <circle
                cx="500"
                cy="300"
                r="10"
                fill="hsl(var(--primary))"
                className="animate-pulse-glow"
                style={{ animationDelay: "2.7s" }}
              />
            </g>
          </svg>
        </div>
      </div>
    </section>
  );
};
