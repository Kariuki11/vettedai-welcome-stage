import { ChatMessage } from "../ChatMessage";
import { FileUploadZone } from "../FileUploadZone";
import { Button } from "@/components/ui/button";
import { useFileUpload } from "@/hooks/useFileUpload";
import { ArrowRight } from "lucide-react";

interface ResumeUploadStepProps {
  onComplete: (files: any[]) => void;
}

export const ResumeUploadStep = ({ onComplete }: ResumeUploadStepProps) => {
  const uploadProps = useFileUpload();
  
  const allFilesComplete = uploadProps.files.length > 0 && 
    uploadProps.files.every(f => f.status === 'complete');

  const handleContinue = () => {
    onComplete(uploadProps.files);
  };

  return (
    <div className="space-y-6">
      <ChatMessage
        type="assistant"
        content="Great! Upload up to 20 candidate resumes. I'll analyze them against your job requirements."
        delay={0}
      />

      <FileUploadZone
        files={uploadProps.files}
        isDragging={uploadProps.isDragging}
        onDragEnter={uploadProps.handleDragEnter}
        onDragLeave={uploadProps.handleDragLeave}
        onDragOver={uploadProps.handleDragOver}
        onDrop={uploadProps.handleDrop}
        onFilesSelected={uploadProps.handleFiles}
        onRemoveFile={uploadProps.removeFile}
      />

      {allFilesComplete && (
        <div className="flex justify-center animate-fade-in">
          <Button onClick={handleContinue} size="lg">
            Continue to Tier Selection
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      )}
    </div>
  );
};
