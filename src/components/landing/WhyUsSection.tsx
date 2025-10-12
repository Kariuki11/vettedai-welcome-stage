import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export const WhyUsSection = () => {
  return (
    <section className="px-6 py-20 md:py-32 bg-background">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
          {/* Left: Avatar Group */}
          <div className="flex justify-center md:justify-start">
            <div className="relative">
              <div className="flex items-center -space-x-4">
                <Avatar className="w-20 h-20 border-4 border-background shadow-lg">
                  <AvatarFallback className="bg-primary/20 text-primary text-xl font-semibold">VT</AvatarFallback>
                </Avatar>
                <Avatar className="w-20 h-20 border-4 border-background shadow-lg">
                  <AvatarFallback className="bg-primary/30 text-primary text-xl font-semibold">AI</AvatarFallback>
                </Avatar>
                <Avatar className="w-20 h-20 border-4 border-background shadow-lg">
                  <AvatarFallback className="bg-primary/40 text-primary text-xl font-semibold">TM</AvatarFallback>
                </Avatar>
              </div>
            </div>
          </div>

          {/* Right: Copy */}
          <div className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold">
              Built by people who've been there.
            </h2>
            <div className="space-y-4 text-lg text-muted-foreground leading-relaxed">
              <p>
                We're not theorists. We've spent years on the front lines of Africa's talent market, 
                trying to hire great people and hitting the same walls everyone else does.
              </p>
              <p>
                The tools built for hiring weren't designed for how work actually happens. 
                So we built something better: a workspace that reveals who people really are, 
                not who they claim to be.
              </p>
              <p className="text-foreground font-medium">
                Built by recruiters for recruiters.
              </p>
            </div>
            <div className="pt-4 border-t border-border/30">
              <p className="text-sm text-muted-foreground italic">
                — The VettedAI Team
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};