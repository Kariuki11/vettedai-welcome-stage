export const WhyItMattersSection = () => {
  return (
    <section className="px-6 py-24 bg-muted/30">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Heading */}
        <div className="text-center space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold leading-tight">
            Why this matters.
          </h2>
        </div>
        
        {/* Main Content */}
        <div className="space-y-8 text-lg md:text-xl text-muted-foreground leading-relaxed">
          <p>
            Every recruiter knows the problem: resumes look better than ever. 
            AI can make anyone <em>sound</em> perfect. But who can actually do the job?
          </p>
          
          <p>
            VettedAI gives you something you can't get from a CV: <strong className="text-foreground">proof of work</strong>. 
            Real tasks. Real results. Real signal.
          </p>
          
          <p>
            We help you cut through the noise, not by filtering harder, but by <em>seeing better</em>. 
            Our workspace is designed to reveal who people actually are—not who they claim to be.
          </p>
        </div>
      </div>
    </section>
  );
};