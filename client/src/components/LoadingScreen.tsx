export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 bg-bg flex flex-col items-center justify-center gap-4 z-50">
      <div className="w-14 h-14 rounded-full border-4 border-surface-2 border-t-accent animate-spin" />
      <p className="font-display text-accent text-lg tracking-wide">Loading…</p>
    </div>
  );
}
