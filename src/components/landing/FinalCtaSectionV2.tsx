import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface FinalCtaSectionV2Props {
  onCtaClick?: () => void;
}

export const FinalCtaSectionV2 = ({ onCtaClick }: FinalCtaSectionV2Props) => {
  const navigate = useNavigate();
  
  const handleCtaClick = () => {
    if (onCtaClick) {
      onCtaClick();
    } else {
      navigate('/signup');
    }
  };

  return (
    <section className="px-6 py-32 md:py-40 bg-muted/30">
      <div className="max-w-4xl mx-auto text-center space-y-8">
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
          See who's real. Skip the rest.
        </h2>
        <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          VettedAI brings clarity back to hiring so you can spend less time guessing and more time meeting the right people.
        </p>
        <div className="pt-6 space-y-4">
          <Button 
            variant="hero" 
            size="lg" 
            onClick={handleCtaClick}
            className="text-base px-8 py-6 h-auto"
          >
            Get started
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          <p className="text-sm text-muted-foreground">
            See your first shortlist in 48 hours
          </p>
        </div>
      </div>
    </section>
  );
};