export function TextShimmer({
  children,
  className,
  duration = 3,
}: {
  children: React.ReactNode;
  className?: string;
  duration?: number;
}) {
  return (
    <span
      className={`inline-block bg-clip-text text-transparent animate-text-shimmer ${className ?? ""}`}
      style={{
        backgroundImage:
          "linear-gradient(90deg, #6366f1 0%, #a5b4fc 30%, #c4b5fd 50%, #a5b4fc 70%, #6366f1 100%)",
        animationDuration: `${duration}s`,
      }}
    >
      {children}
    </span>
  );
}
