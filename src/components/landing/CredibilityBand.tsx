export const CredibilityBand = () => {
  return (
    <section className="px-6 py-16 bg-muted/30">
      <div className="max-w-4xl mx-auto text-center space-y-6">
        <p className="text-sm font-medium text-primary uppercase tracking-wide">
          Trusted by Forward-Thinking Recruiters
        </p>
        <blockquote className="text-lg text-muted-foreground italic max-w-2xl mx-auto">
          "Traditional signals like resumes have lost their meaning. VettedAI gives us verified talent intelligence that actually predicts performance."
        </blockquote>
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <span className="font-medium text-foreground">Validation Build</span>
          <span>·</span>
          <span>Proof-of-Work Platform</span>
          <span>·</span>
          <span>48-Hour Delivery</span>
        </div>
      </div>
    </section>
  );
};
