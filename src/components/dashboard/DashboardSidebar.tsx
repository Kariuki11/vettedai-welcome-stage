import { Link, useLocation, useNavigate } from "react-router-dom";
import { FolderOpen, Settings, CreditCard, Users, LogOut } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

const navigationItems = [
  { name: "All Projects", href: "/workspace", icon: FolderOpen, enabled: true },
  { name: "Account Settings", href: "/settings", icon: Settings, enabled: true },
  { name: "Billing History", href: "/billing", icon: CreditCard, enabled: false },
  { name: "Invite Team Members", href: "/team", icon: Users, enabled: false },
];

export const DashboardSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, signOut } = useAuth();

  const metadataName = user?.user_metadata && typeof user.user_metadata.full_name === "string"
    ? user.user_metadata.full_name
    : undefined;
  const normalizedName = metadataName?.trim();
  const fullName = normalizedName && normalizedName.length > 0 ? normalizedName : (user?.email ?? "Account");
  const initials = fullName
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0]?.toUpperCase())
    .join("")
    .slice(0, 2) || "V";

  const handleSignOut = async () => {
    const { error } = await signOut();

    if (error) {
      toast({
        title: "Sign out failed",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    navigate("/login");
  };

  return (
    <aside className="w-64 border-r border-border bg-card p-6 flex flex-col">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-primary">VettedAI</h2>
        <p className="text-xs text-muted-foreground mt-1">Recruiter workspace</p>
      </div>

      <nav className="space-y-2">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.href;

          if (!item.enabled) {
            return (
              <TooltipProvider key={item.name}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div
                      className={cn(
                        "flex items-center gap-3 px-4 py-3 rounded-lg",
                        "text-muted-foreground cursor-not-allowed opacity-50"
                      )}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="text-sm font-medium">{item.name}</span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Coming Soon</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            );
          }

          return (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-foreground hover:bg-muted"
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="text-sm font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto pt-6 border-t border-border/60 space-y-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium text-foreground">{fullName}</p>
            <p className="text-xs text-muted-foreground">Signed in</p>
          </div>
        </div>

        <Button variant="outline" className="w-full justify-start gap-2" onClick={handleSignOut}>
          <LogOut className="w-4 h-4" />
          Sign out
        </Button>
      </div>
    </aside>
  );
}
