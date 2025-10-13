import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface FinalCtaSectionProps {
  onCtaClick?: () => void;
}

export const FinalCtaSection = ({ onCtaClick }: FinalCtaSectionProps) => {
  const navigate = useNavigate();
  
  const handleCtaClick = () => {
    if (onCtaClick) {
      onCtaClick();
    } else {
      navigate('/signup');
    }
  };
  return (
    <section className="px-6 py-32 bg-gradient-to-b from-background to-muted/30">
      <div className="max-w-4xl mx-auto text-center space-y-8">
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
          Hire like it's the future.
        </h2>
        <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Discover a workspace that makes hiring feel like progress, not paperwork.
        </p>
        <div className="pt-4">
          <Button 
            variant="hero" 
            size="lg" 
            onClick={handleCtaClick}
            className="text-base px-8 py-6 h-auto"
          >
            Get Started
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </section>
  );
};