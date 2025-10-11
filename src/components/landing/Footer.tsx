export const Footer = () => {
  return (
    <footer className="px-6 py-12 border-t border-border/50 bg-background">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-primary">VettedAI</h3>
            <p className="text-sm text-muted-foreground">
              The Talent Intelligence Workspace
            </p>
          </div>
          
          {/* Links */}
          <div className="flex gap-6 text-sm">
            <a 
              href="#" 
              className="text-muted-foreground hover:text-primary transition-fast"
            >
              Privacy Policy
            </a>
            <a 
              href="#" 
              className="text-muted-foreground hover:text-primary transition-fast"
            >
              Terms of Service
            </a>
          </div>
        </div>
        
        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-border/30 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} VettedAI • The Talent Intelligence Workspace
        </div>
      </div>
    </footer>
  );
};
