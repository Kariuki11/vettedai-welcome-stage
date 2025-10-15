import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import vettedLandscapeLogo from "@/assets/vetted-landscape-logo.png";

export const LandingNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isSignupPage = location.pathname.startsWith("/signup");

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <button
          onClick={() => navigate("/")}
          className="flex items-center hover:opacity-80 transition-opacity"
          aria-label="Go to home"
        >
          <img 
            src={vettedLandscapeLogo} 
            alt="VettedAI" 
            className="h-8 w-auto"
          />
        </button>

        <nav className="flex items-center gap-6">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="text-sm font-medium"
          >
            Home
          </Button>
          <Button
            variant="ghost"
            onClick={() => navigate("/login")}
            className="text-sm font-medium"
          >
            Sign In
          </Button>
          {!isSignupPage && (
            <Button
              onClick={() => navigate("/signup")}
              size="sm"
            >
              Get Started
            </Button>
          )}
        </nav>
      </div>
    </header>
  );
};
