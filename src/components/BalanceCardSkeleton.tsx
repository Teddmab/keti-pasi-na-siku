import { Skeleton } from "@/components/ui/skeleton";

const BalanceCardSkeleton = () => {
  return (
    <div className="balance-card">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Skeleton className="w-5 h-5 rounded bg-white/20" />
          <Skeleton className="h-4 w-20 bg-white/20" />
        </div>
        <Skeleton className="w-8 h-8 rounded-full bg-white/20" />
      </div>
      <div className="flex items-baseline gap-2">
        <Skeleton className="h-10 w-40 bg-white/20" />
        <Skeleton className="h-6 w-8 bg-white/20" />
      </div>
    </div>
  );
};

export default BalanceCardSkeleton;
