import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X, Check } from "lucide-react";

export const InsightSection = () => {
  return (
    <section className="px-6 py-20 md:py-32 bg-background">
      <div className="max-w-5xl mx-auto space-y-12">
        <div className="text-center space-y-6 max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold">
            The problem isn't filtering harder. It's seeing better.
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
            Traditional hiring tools were built for a world where resumes told the truth. 
            That world is gone. VettedAI gives you what CVs can't: proof of how people actually work.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mt-16">
          {/* Old Way */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-muted-foreground">
                <X className="h-5 w-5" />
                Old Way
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground mt-2 flex-shrink-0" />
                <p className="text-muted-foreground">Guessing from CVs</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground mt-2 flex-shrink-0" />
                <p className="text-muted-foreground">Endless screening</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground mt-2 flex-shrink-0" />
                <p className="text-muted-foreground">Unverified claims</p>
              </div>
            </CardContent>
          </Card>

          {/* New Way */}
          <Card className="border-primary/50 shadow-elegant">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-primary">
                <Check className="h-5 w-5" />
                New Way
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                <p className="text-foreground">Seeing real work</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                <p className="text-foreground">Confident shortlist</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                <p className="text-foreground">Verifiable proof</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};