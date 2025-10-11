import { useState, useEffect } from "react";
import { FileText, Mail, Table, Calendar } from "lucide-react";

export const WhyItMattersSection = () => {
  const [showNewWay, setShowNewWay] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setShowNewWay((prev) => !prev);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="px-6 py-24 bg-background">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center space-y-6 mb-16">
          <h2 className="text-4xl md:text-5xl font-bold">
            Hiring's foundation is broken.
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            It's a maze of AI-generated resumes, inflated claims, and unreliable proxies. We've lived this chaos, and we're rebuilding the process from first principles: fast, focused, and fundamentally fair.
          </p>
        </div>

        {/* Visual Comparison */}
        <div className="relative h-64 flex items-center justify-center">
          {/* Old Way */}
          <div
            className={`absolute inset-0 flex items-center justify-center transition-all duration-700 ${
              showNewWay ? "opacity-0 scale-95" : "opacity-100 scale-100"
            }`}
          >
            <div className="grid grid-cols-2 gap-4 p-8">
              <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center transform rotate-3 opacity-60">
                <FileText className="h-8 w-8 text-muted-foreground" />
              </div>
              <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center transform -rotate-2 opacity-70">
                <Mail className="h-8 w-8 text-muted-foreground" />
              </div>
              <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center transform -rotate-6 opacity-50">
                <Table className="h-8 w-8 text-muted-foreground" />
              </div>
              <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center transform rotate-12 opacity-65">
                <Calendar className="h-8 w-8 text-muted-foreground" />
              </div>
            </div>
            <p className="absolute -bottom-8 text-sm text-muted-foreground">The Old Way</p>
          </div>

          {/* New Way */}
          <div
            className={`absolute inset-0 flex items-center justify-center transition-all duration-700 ${
              showNewWay ? "opacity-100 scale-100" : "opacity-0 scale-95"
            }`}
          >
            <div className="text-center space-y-4">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-primary/10 rounded-xl">
                <span className="text-3xl font-bold text-primary">V</span>
              </div>
              <p className="text-lg font-semibold text-primary">VettedAI</p>
            </div>
            <p className="absolute -bottom-8 text-sm text-primary">The New Way</p>
          </div>
        </div>
      </div>
    </section>
  );
};
