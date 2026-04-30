export default function ProductSkeleton() {
  return (
    <div className="rounded-xl border bg-card shadow-sm overflow-hidden flex flex-col animate-pulse">
      <div className="aspect-[4/5] bg-muted" />
      <div className="p-4 space-y-3">
        <div className="h-3 w-1/3 bg-muted rounded" />
        <div className="h-4 w-3/4 bg-muted rounded" />
        <div className="h-6 w-1/4 bg-muted rounded mt-auto" />
      </div>
    </div>
  );
}
