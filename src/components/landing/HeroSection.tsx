import { Button } from "@/components/ui/button";
import { ArrowRight, ShieldCheck, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface HeroSectionProps {
  onCtaClick?: () => void;
}

const shortlist = [
  {
    name: "Aisha Mwangi",
    role: "Operations Lead",
    confidence: "92%",
    signal: "Process signal is strong",
    status: "Decision: Advance",
    accent: "bg-emerald-50 text-emerald-700",
  },
  {
    name: "Luis Martins",
    role: "Customer Success",
    confidence: "88%",
    signal: "Noise removed • Scope clarity",
    status: "Decision: Advance",
    accent: "bg-sky-50 text-sky-700",
  },
  {
    name: "Tara Singh",
    role: "Chief of Staff",
    confidence: "84%",
    signal: "Proof of work delivered",
    status: "Decision: Review",
    accent: "bg-amber-50 text-amber-700",
  },
];

export const HeroSection = ({ onCtaClick }: HeroSectionProps) => {
  const navigate = useNavigate();

  const handleCtaClick = () => {
    if (onCtaClick) {
      onCtaClick();
    } else {
      navigate("/signup");
    }
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-background via-white to-muted/40">
      <div className="absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-primary/10 via-transparent to-transparent" />
      <div className="absolute -top-16 -right-24 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
      <div className="absolute -bottom-32 -left-12 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />

      <div className="max-w-6xl mx-auto px-6 py-24 lg:py-28">
        <div className="grid lg:grid-cols-[minmax(0,1.1fr),minmax(0,420px)] gap-16 items-center">
          <div className="space-y-8">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-white/80 px-4 py-2 text-sm font-medium text-primary shadow-sm">
              <Sparkles className="h-4 w-4" /> The Talent Intelligence Workspace
            </span>

      {/* Content Container */}
      <div className="max-w-4xl mx-auto text-center space-y-8 animate-fade-in relative z-10">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-subtle border border-primary/20 text-primary text-sm font-medium mb-4">
          <Sparkles className="h-4 w-4" />
          The Talent Intelligence Workspace
        </div>
        {/* Headline */}
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight tracking-tight">
          Hire on proof, <span className="text-primary">not promise.</span>
        </h1>

        {/* Subheadline */}
        <p className="text-lg md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed animate-fade-in-delayed">
          Drowning in perfect resumes that fall apart at interview? VettedAI lets you see how people actually work—so you
          can move forward with confidence, not guesswork.
        </p>

        {/* CTA Button */}
        <div className="pt-6 animate-slide-in-up">
          <Button variant="hero" size="lg" onClick={handleCtaClick} className="text-base px-7 py-4 h-auto">
            Create my recruiter workspace
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>

        {/* Trust Badge */}
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground pt-4 animate-fade-in-delayed">
          <ShieldCheck className="h-4 w-4 text-primary" />
          Verifiable proof in 48-72 hours
        </div>
      </div>
    </section>
  );
};
