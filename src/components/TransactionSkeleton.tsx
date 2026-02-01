import { Skeleton } from "@/components/ui/skeleton";

interface TransactionSkeletonProps {
  count?: number;
}

const TransactionSkeleton = ({ count = 3 }: TransactionSkeletonProps) => {
  return (
    <div className="card-elevated overflow-hidden">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className={`p-4 flex items-center gap-4 ${index < count - 1 ? "border-b border-border" : ""}`}
        >
          {/* Avatar skeleton */}
          <Skeleton className="w-12 h-12 rounded-full" />
          
          {/* Content skeleton */}
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-24" />
          </div>
          
          {/* Amount skeleton */}
          <div className="text-right space-y-2">
            <Skeleton className="h-4 w-20 ml-auto" />
            <Skeleton className="h-3 w-16 ml-auto" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default TransactionSkeleton;
