import { BackButton } from "../../components/BackButton";
import { Button } from "../../design-system/Button";
import { useGameState } from "../../contexts/GameStateContext";

const playerColorMap: Record<
  string,
  { hex: string; glow: string; label: string }
> = {
  red: { hex: "#ef4444", glow: "rgba(239,68,68,0.4)", label: "Red" },
  green: { hex: "#22c55e", glow: "rgba(34,197,94,0.4)", label: "Green" },
  blue: { hex: "#3b82f6", glow: "rgba(59,130,246,0.4)", label: "Blue" },
  yellow: { hex: "#eab308", glow: "rgba(234,179,8,0.4)", label: "Yellow" },
};

const slotColors = ["red", "green", "blue", "yellow"];

// --- mock data for UI preview ---
const mockPlayers = [
  { id: "1", username: "Kehinde", color: "red", isHost: true, isReady: true },
  { id: "2", username: "Amara", color: "green", isHost: false, isReady: true },
  { id: "3", username: "Tunde", color: "blue", isHost: false, isReady: false },
];
const mockIsHost = true;
const mockIsReady = false;
// --- end mock data ---

function CrownIcon() {
  return (
    <svg
      className="w-3.5 h-3.5 text-accent"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M2 19h20v2H2v-2zM2 7l5 5 5-7 5 7 5-5-2 10H4L2 7z" />
    </svg>
  );
}

function CopyIcon() {
  return (
    <svg
      className="w-4 h-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <rect
        x="9"
        y="9"
        width="13"
        height="13"
        rx="2"
        ry="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"
      />
    </svg>
  );
}

export function LobbyPage() {
  const { roomCode, numPlayers: totalSlots, players } = useGameState();

  const filledCount = players.length;
  // const totalSlots = mockTotalSlots;

  return (
    <div className="min-h-screen bg-bg flex flex-col items-center justify-center px-6 py-12">
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(58,53,96,0.35) 1px, transparent 1px),
            linear-gradient(90deg, rgba(58,53,96,0.35) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative z-10 w-full max-w-sm">
        <BackButton />

        <h2 className="font-display text-3xl font-semibold text-text mb-1">
          Lobby
        </h2>
        <p className="text-muted text-sm mb-8 font-body">
          Waiting for players to join…
        </p>

        {/* Room code card */}
        <div className="bg-surface border border-border rounded-xl p-5 mb-4 shadow-card">
          <p className="text-xs font-medium text-muted uppercase tracking-widest mb-2">
            Room Code
          </p>
          <div className="flex items-center justify-between gap-3">
            <span className="font-display text-3xl tracking-widest text-text">
              {roomCode ?? "ABCD-1234"}
            </span>
            <button
              onClick={() => {}}
              className="flex items-center gap-1.5 text-xs text-muted hover:text-text transition-colors px-3 py-1.5 rounded-lg border border-border hover:border-muted"
            >
              <CopyIcon />
              Copy
            </button>
          </div>
        </div>

        {/* Players card */}
        <div className="bg-surface border border-border rounded-xl p-5 mb-6 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs font-medium text-muted uppercase tracking-widest">
              Players
            </p>
            <span className="text-xs font-display text-muted">
              {filledCount}
              <span className="text-border">/{totalSlots}</span>
            </span>
          </div>

          <div className="space-y-2.5">
            {slotColors.slice(0, totalSlots).map((colorKey) => {
              const colorMeta = playerColorMap[colorKey];
              const player = mockPlayers.find((p) => p.color === colorKey);
              const isEmpty = !player;

              return (
                <div
                  key={colorKey}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2.5 border transition-colors ${
                    isEmpty
                      ? "border-border/50 bg-bg/40 opacity-50"
                      : "border-border bg-surface-2"
                  }`}
                >
                  {/* Color dot */}
                  <div
                    className="w-4 h-4 rounded-full shrink-0 border border-white/10"
                    style={{
                      backgroundColor: colorMeta.hex,
                      boxShadow: isEmpty
                        ? "none"
                        : `0 0 10px 0 ${colorMeta.glow}`,
                    }}
                  />

                  {/* Name / waiting */}
                  <span
                    className={`flex-1 font-display text-sm ${
                      isEmpty ? "text-muted italic" : "text-text"
                    }`}
                  >
                    {isEmpty ? "Waiting…" : player.username}
                  </span>

                  {/* Badges */}
                  {!isEmpty && (
                    <div className="flex items-center gap-2">
                      {player.isHost && (
                        <span className="flex items-center gap-1 text-xs text-accent font-medium">
                          <CrownIcon />
                          Host
                        </span>
                      )}
                      {!player.isHost && (
                        <span
                          className={`text-xs font-medium px-2 py-0.5 rounded-full border ${
                            player.isReady
                              ? "text-green-400 border-green-400/30 bg-green-400/10"
                              : "text-muted border-border"
                          }`}
                        >
                          {player.isReady ? "Ready" : "Not Ready"}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Action button */}
        {mockIsHost ? (
          <Button variant="primary" size="md" fullWidth onClick={() => {}}>
            Start Game
          </Button>
        ) : (
          <Button
            variant={mockIsReady ? "secondary" : "primary"}
            size="md"
            fullWidth
            onClick={() => {}}
          >
            {mockIsReady ? "Not Ready" : "Ready"}
          </Button>
        )}
      </div>
    </div>
  );
}
