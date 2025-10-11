import { Badge } from "@/components/ui/badge";

interface StatusBadgeProps {
  status: 'awaiting' | 'scoring' | 'ready';
}

export const StatusBadge = ({ status }: StatusBadgeProps) => {
  switch (status) {
    case 'awaiting':
      return (
        <Badge className="bg-[#D6D1FF] text-[#5A4FCF] hover:bg-[#D6D1FF]">
          Awaiting Vetting
        </Badge>
      );
    case 'scoring':
      return (
        <Badge className="bg-[#FEF3C7] text-[#F59E0B] hover:bg-[#FEF3C7]">
          <span className="flex items-center gap-2">
            Scoring
            <span className="w-2 h-2 rounded-full bg-[#F59E0B] animate-pulse" />
          </span>
        </Badge>
      );
    case 'ready':
      return (
        <Badge className="bg-[#D1FAE5] text-[#22C55E] hover:bg-[#D1FAE5]">
          Shortlist Ready
        </Badge>
      );
  }
};
