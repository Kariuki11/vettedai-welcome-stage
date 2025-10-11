import { ReactNode } from "react";

interface ChatContainerProps {
  children: ReactNode;
}

export const ChatContainer = ({ children }: ChatContainerProps) => {
  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-[960px] mx-auto px-6 py-8">
        <div className="space-y-4">
          {children}
        </div>
      </div>
    </div>
  );
};
