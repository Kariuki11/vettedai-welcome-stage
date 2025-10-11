import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ChatMessage } from "../ChatMessage";
import { Loader2, Check, Edit } from "lucide-react";

interface JobDescriptionStepProps {
  onComplete: (jd: string, summary: string) => void;
  onAddMessage: (msg: { type: 'user' | 'assistant'; content: string | React.ReactNode }) => void;
  onSetTyping: (isTyping: boolean) => void;
}

export const JobDescriptionStep = ({ onComplete, onAddMessage, onSetTyping }: JobDescriptionStepProps) => {
  const [jd, setJd] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [summary, setSummary] = useState("");
  const [summaryGenerated, setSummaryGenerated] = useState(false);

  const handleGenerate = async () => {
    setIsGenerating(true);
    
    // Add user's JD as message
    onAddMessage({
      type: 'user',
      content: `[Job Description submitted: ${jd.substring(0, 100)}...]`
    });
    
    // Show typing indicator
    onSetTyping(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    onSetTyping(false);
    
    const generatedSummary = "Senior Full-Stack Engineer role requiring 5+ years experience with React, Node.js, and cloud infrastructure. Focus on building scalable systems and mentoring junior developers. Remote-friendly position with competitive compensation.";
    
    setSummary(generatedSummary);
    setSummaryGenerated(true);
    setIsGenerating(false);
    
    // Add summary as assistant message
    onAddMessage({
      type: 'assistant',
      content: (
        <div className="space-y-2">
          <p className="font-medium text-primary">Here's what I understood:</p>
          <p className="text-sm leading-relaxed">
            {generatedSummary}
          </p>
        </div>
      )
    });
  };

  const handleConfirm = () => {
    onAddMessage({
      type: 'user',
      content: "Looks right! Let's proceed."
    });
    
    onAddMessage({
      type: 'assistant',
      content: "Perfect! Now let's find your candidates."
    });
    
    onComplete(jd, summary);
  };

  const handleEdit = () => {
    setSummaryGenerated(false);
    setSummary("");
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

      {summaryGenerated && (
        <div className="flex justify-end gap-3 animate-fade-in">
          <Button
            variant="outline"
            onClick={handleEdit}
            className="gap-2"
          >
            <Edit className="w-4 h-4" />
            Edit JD
          </Button>
          <Button
            onClick={handleConfirm}
            className="gap-2"
          >
            <Check className="w-4 h-4" />
            Looks Right
          </Button>
        </div>
      )}
    </div>
  );
};
