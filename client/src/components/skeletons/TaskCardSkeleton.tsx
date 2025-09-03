import { Skeleton } from "@/components/ui/skeleton";

export function TaskCardSkeleton() {
  return (
    <div className="bg-zinc-100 shadow-lg w-full rounded-md overflow-hidden p-3 border-2 border-zinc-100 space-y-3">
      {/* priority indicator */}
      <div className="h-3 mb-2 flex items-center">
        <Skeleton className="h-2 w-10 rounded-full bg-zinc-300" />
      </div>

      {/* title */}
      <Skeleton className="h-4 w-3/4 bg-zinc-300" />

      {/* bottom row */}
      <div className="flex space-x-1">
        {/* due date pill */}
        <Skeleton className="h-5 w-20 rounded-full bg-zinc-300" />
        {/* assignedTo avatar */}
        <Skeleton className="h-5 w-5 rounded-full bg-zinc-300" />
        {/* description icon */}
        <Skeleton className="h-5 w-5 rounded-full bg-zinc-300" />
      </div>
    </div>
  );
}

export function TaskListSkeleton({ length = 3 }: { length?: number }) {
  return (
    <div className="flex flex-col gap-2 w-full">
      {Array.from({ length }).map((_, i) => (
        <TaskCardSkeleton key={i} />
      ))}
    </div>
  );
}
