function SkeletonRows({ rows = 8 }) {
  return (
    <div role="status" aria-live="polite" className="space-y-2">
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="h-10 w-full animate-pulse rounded bg-zinc-100"
        />
      ))}
    </div>
  );
}

export default SkeletonRows;
