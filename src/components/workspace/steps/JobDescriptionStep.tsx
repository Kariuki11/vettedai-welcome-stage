import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";

interface JobDescriptionStepProps {
  onComplete: (jd: string, summary: string, jobTitle: string) => void;
  onAddMessage: (msg: { type: 'user' | 'assistant'; content: string | React.ReactNode }) => void;
  onSetTyping: (isTyping: boolean) => void;
}

export const JobDescriptionStep = ({ onComplete, onAddMessage, onSetTyping }: JobDescriptionStepProps) => {
  const [jd, setJd] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleSubmit = async () => {
    setIsGenerating(true);
    
    // Add user's JD as message
    onAddMessage({
      type: 'user',
      content: `[Job Description submitted]`
    });
    
    // Show typing indicator
    onSetTyping(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    onSetTyping(false);
    
    // Generate summary and title for the next step
    const generatedSummary = "Senior Full-Stack Engineer role requiring 5+ years experience with React, Node.js, and cloud infrastructure. Focus on building scalable systems and mentoring junior developers. Remote-friendly position with competitive compensation.";
    const extractedJobTitle = "Senior Full-Stack Engineer";
    
    onAddMessage({
      type: 'assistant',
      content: "Great! Let me analyze that for you..."
    });
    
    setIsGenerating(false);
    onComplete(jd, generatedSummary, extractedJobTitle);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <Textarea
          value={jd}
          onChange={(e) => setJd(e.target.value)}
          placeholder="Paste or type the full job description here..."
          className="min-h-[200px] text-base resize-none"
        />
        
        <Button
          onClick={handleSubmit}
          disabled={jd.length < 50 || isGenerating}
          className="w-full sm:w-auto"
          size="lg"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Analyzing...
            </>
          ) : (
            'Continue'
          )}
        </Button>
      </div>
    </div>
  );
};
