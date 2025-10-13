export const PerformanceGraphSection = () => {
  return (
    <section className="px-6 py-24 bg-background">
      <div className="max-w-4xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold">
            Faster decisions. Better outcomes.
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            With VettedAI, you move from <em>"maybe this person"</em> to <em>"definitely this person"</em>—without wasting time on 10 interviews.
          </p>
        </div>
        
        {/* Visual Comparison: Before vs After */}
        <div className="grid md:grid-cols-2 gap-8 mt-16">
          {/* Before VettedAI */}
          <div className="p-8 rounded-lg border border-border/50 bg-card space-y-4">
            <h3 className="text-2xl font-semibold text-muted-foreground">Before VettedAI</h3>
            <ul className="space-y-3 text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-destructive">•</span>
                <span>Dozens of similar-looking CVs</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-destructive">•</span>
                <span>Guesswork on who can actually do the job</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-destructive">•</span>
                <span>Weeks spent scheduling and interviewing</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-destructive">•</span>
                <span>Low confidence in final decision</span>
              </li>
            </ul>
          </div>
          
          {/* After VettedAI */}
          <div className="p-8 rounded-lg border border-primary/50 bg-primary/5 space-y-4 shadow-elegant">
            <h3 className="text-2xl font-semibold text-primary">After VettedAI</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <span className="text-primary">✓</span>
                <span>Verified proof of work from each candidate</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">✓</span>
                <span>Clear signal: who can deliver, who can't</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">✓</span>
                <span>48-72 hour shortlist with confidence scores</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">✓</span>
                <span>Interview only the candidates who've proven themselves</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};