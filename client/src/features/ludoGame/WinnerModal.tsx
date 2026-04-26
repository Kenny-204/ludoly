import { useNavigate } from "react-router-dom";

const playerColorMap: Record<string, { glow: string; hex: string }> = {
  red:    { glow: "rgba(239,68,68,0.35)",  hex: "#ef4444" },
  green:  { glow: "rgba(34,197,94,0.35)",  hex: "#22c55e" },
  blue:   { glow: "rgba(59,130,246,0.35)", hex: "#3b82f6" },
  yellow: { glow: "rgba(234,179,8,0.35)",  hex: "#eab308" },
};

const rankLabel = ["1st", "2nd", "3rd", "4th"];

type Player = { id: string; color: string; score: number };

export function WinnerModal({ players }: { players: Player[] }) {
  const navigate = useNavigate();
  const sorted = [...players].sort((a, b) => b.score - a.score);
  const winner = sorted[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-6">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-bg/80 backdrop-blur-sm" />

      {/* Card */}
      <div className="relative z-10 w-full max-w-sm bg-surface border border-border rounded-2xl shadow-card p-8 flex flex-col items-center gap-6">

        {/* Winner spotlight */}
        <div className="flex flex-col items-center gap-3">
          <div
            className="w-16 h-16 rounded-full border-4 border-white/10"
            style={{
              backgroundColor: playerColorMap[winner.color]?.hex,
              boxShadow: `0 0 32px 0 ${playerColorMap[winner.color]?.glow}`,
            }}
          />
          <div className="text-center">
            <p className="text-xs text-muted uppercase tracking-widest font-medium mb-1">Winner</p>
            <p
              className="font-display text-4xl font-semibold capitalize"
              style={{ color: playerColorMap[winner.color]?.hex }}
            >
              {winner.color}
            </p>
          </div>
        </div>

        {/* Rankings */}
        <div className="w-full space-y-2">
          {sorted.map((player, i) => (
            <div
              key={player.id}
              className={`flex items-center gap-3 rounded-lg px-4 py-3 border ${
                i === 0
                  ? "border-accent/30 bg-accent/5"
                  : "border-border bg-surface-2"
              }`}
            >
              <span className="text-xs text-muted font-medium w-6">{rankLabel[i]}</span>
              <div
                className="w-3.5 h-3.5 rounded-full shrink-0 border border-white/10"
                style={{
                  backgroundColor: playerColorMap[player.color]?.hex,
                  boxShadow: `0 0 8px 0 ${playerColorMap[player.color]?.glow}`,
                }}
              />
              <span className="font-display text-sm capitalize flex-1 text-text">
                {player.color}
              </span>
              <span className="font-display text-base font-semibold text-accent">
                {player.score}
              </span>
            </div>
          ))}
        </div>

        {/* Actions */}
        <button
          onClick={() => navigate("/")}
          className="w-full py-3 rounded-xl bg-accent text-bg font-display text-base font-semibold cursor-pointer hover:opacity-90 active:scale-95 transition-all duration-150"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
}
