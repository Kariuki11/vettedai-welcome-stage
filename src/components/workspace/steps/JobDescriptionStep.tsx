import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ChatMessage } from "../ChatMessage";
import { Loader2 } from "lucide-react";

interface JobDescriptionStepProps {
  onComplete: (jd: string, summary: string) => void;
}

export const JobDescriptionStep = ({ onComplete }: JobDescriptionStepProps) => {
  const [jd, setJd] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [showSummary, setShowSummary] = useState(false);

  const handleGenerate = async () => {
    setIsGenerating(true);
    
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const summary = "Senior Full-Stack Engineer role requiring 5+ years experience with React, Node.js, and cloud infrastructure. Focus on building scalable systems and mentoring junior developers. Remote-friendly position with competitive compensation.";
    
    setShowSummary(true);
    setIsGenerating(false);
    
    // Auto-advance after showing summary
    setTimeout(() => {
      onComplete(jd, summary);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <ChatMessage
        type="assistant"
        content="Let's start by understanding the role you're hiring for. Paste your Job Description below."
        delay={0}
      />

      <div className="space-y-4">
        <Textarea
          value={jd}
          onChange={(e) => setJd(e.target.value)}
          placeholder="Paste or type the full job description here..."
          className="min-h-[200px] text-base resize-none"
        />
        
        <Button
          onClick={handleGenerate}
          disabled={jd.length < 50 || isGenerating}
          className="w-full sm:w-auto"
          size="lg"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Generating Summary...
            </>
          ) : (
            'Generate Summary'
          )}
        </Button>
      </div>

      {showSummary && (
        <ChatMessage
          type="assistant"
          content={
            <div className="space-y-2">
              <p className="font-medium text-primary">Here's what I understood:</p>
              <p className="text-sm leading-relaxed">
                Senior Full-Stack Engineer role requiring 5+ years experience with React, Node.js, and cloud infrastructure. 
                Focus on building scalable systems and mentoring junior developers. Remote-friendly position with competitive compensation.
              </p>
            </div>
          }
          delay={1}
        />
      )}
    </div>
  );
};
