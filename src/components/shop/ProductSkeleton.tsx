export default function ProductSkeleton() {
  return (
    <div className="overflow-hidden rounded-[1.25rem] sm:rounded-[1.75rem] lg:rounded-[2rem] bg-white dark:bg-[#1A1A1A] shadow-[0_12px_40px_rgba(0,0,0,0.06)] ring-1 ring-[#E8E8EA]/80 dark:ring-[#2A2A2A] animate-pulse">
      <div className="aspect-square bg-linear-to-b from-[#F8F6F2] to-[#EEEAE3] dark:from-[#242424] dark:to-[#161616]" />
      <div className="space-y-2 px-3.5 py-3.5 sm:px-5 sm:py-4">
        <div className="h-2.5 w-1/4 rounded bg-[#EEEAE3] dark:bg-[#2A2A2A]" />
        <div className="h-4 w-2/3 rounded bg-[#EEEAE3] dark:bg-[#2A2A2A]" />
        <div className="h-3 w-1/2 rounded bg-[#EEEAE3] dark:bg-[#2A2A2A]" />
      </div>
    </div>
  );
}
