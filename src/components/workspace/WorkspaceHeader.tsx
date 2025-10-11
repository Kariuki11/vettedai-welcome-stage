export const WorkspaceHeader = () => {
  return (
    <header className="border-b border-border bg-card">
      <div className="max-w-[960px] mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">V</span>
            </div>
            <span className="text-foreground font-semibold">
              Recruiter GPT <span className="text-muted-foreground font-normal">• Validation Build</span>
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
