const founders = [
  {
    initials: "TL",
    name: "Tobi Lafinhan",
    role: "Co-founder & CEO",
  },
  {
    initials: "AA",
    name: "Aanu Adediran",
    role: "Co-founder & COO",
  },
];

export const FoundersNoteSection = () => {
  return (
    <section className="px-6 py-24 bg-background">
      <div className="max-w-4xl mx-auto text-center space-y-8">
        <span className="inline-flex items-center justify-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-primary">
          Built by recruiters
        </span>
        <h2 className="text-3xl md:text-4xl font-bold">
          Built by people who've been on the hiring frontlines.
        </h2>
        <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
          We’re not theorists. We’ve spent years hiring across Africa’s fastest-growing teams, feeling the same pain recruiters still face today. VettedAI is the product we needed in those rooms.
        </p>

        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-6">
          {founders.map((founder) => (
            <div key={founder.name} className="flex items-center gap-3 rounded-2xl border border-border/40 bg-white px-4 py-3 shadow-sm">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                {founder.initials}
              </span>
              <div className="text-left">
                <p className="text-sm font-medium text-foreground">{founder.name}</p>
                <p className="text-xs text-muted-foreground">{founder.role}</p>
              </div>
            </div>
          ))}
        </div>

        <blockquote className="mx-auto max-w-3xl rounded-3xl border border-border/40 bg-white/80 p-8 text-lg leading-relaxed text-foreground shadow-inner">
          "Proof of work used to take weeks of coordination. VettedAI packages it into a workspace that feels human and fast—so you can spend time with the people who will actually move your business forward."
          <footer className="mt-6 text-sm text-muted-foreground">— The VettedAI Team</footer>
        </blockquote>
      </div>
    </section>
  );
};
