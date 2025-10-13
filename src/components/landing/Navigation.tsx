import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export const Navigation = () => {
  const navigate = useNavigate();

  return (
    <nav 
      className="sticky top-0 z-50 backdrop-blur-md bg-background/80 border-b border-border/50"
      aria-label="Main navigation"
    >
      <div className="max-w-[1200px] mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center">
          <h3 className="text-lg font-semibold text-primary">VettedAI</h3>
        </div>
        
        <Button 
          variant="default" 
          size="sm"
          onClick={() => navigate('/signup')}
          className="text-sm"
        >
          Get Started
        </Button>
      </div>
    </nav>
  );
};
