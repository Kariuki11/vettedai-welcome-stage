import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { FolderOpen, Settings, CreditCard, Users } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const navigationItems = [
  { name: "All Projects", href: "/workspace", icon: FolderOpen, enabled: true },
  { name: "Account Settings", href: "/settings", icon: Settings, enabled: false },
  { name: "Billing History", href: "/billing", icon: CreditCard, enabled: false },
  { name: "Invite Team Members", href: "/team", icon: Users, enabled: false },
];

export const DashboardSidebar = () => {
  const location = useLocation();

  return (
    <aside className="w-64 border-r border-border bg-card p-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-primary">VettedAI</h2>
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
    </aside>
  );
}
