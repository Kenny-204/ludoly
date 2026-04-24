import { BackButton } from "../../components/BackButton";
import { Button } from "../../design-system/Button";
import { useGameState } from "../../contexts/GameStateContext";
import { CrownIcon, CopyIcon } from "./components/Icons";
import { useSocket } from "../../contexts/socket";

const playerColorMap: Record<
  string,
  { hex: string; glow: string; label: string }
> = {
  red: { hex: "#ef4444", glow: "rgba(239,68,68,0.4)", label: "Red" },
  green: { hex: "#22c55e", glow: "rgba(34,197,94,0.4)", label: "Green" },
  blue: { hex: "#3b82f6", glow: "rgba(59,130,246,0.4)", label: "Blue" },
  yellow: { hex: "#eab308", glow: "rgba(234,179,8,0.4)", label: "Yellow" },
};

export function LobbyPage() {
  const { gameState, playerId, error } = useGameState();
  const { socket } = useSocket();

  if (!gameState) {
    return <>loading...</>;
  }

  const { roomCode, numPlayers: totalSlots, players } = gameState;
  
  const host = players[0];
  const currentPlayer = players.find((player) => player.id === playerId);
  let isHost = false;

  const allReady = players.every((player) => player.isReady === true);
  if (playerId === host.id) {
    isHost = true;
  }
  const filledCount = players.length;

  function handlePlayerReady() {
    console.log(playerId);
    socket?.emit("ready-player", { roomCode, playerId });
  }

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
            {players.map((player) => (
              <div
                key={player.id}
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 border border-border bg-surface-2 transition-colors"
              >
                <div
                  className="w-4 h-4 rounded-full shrink-0 border border-white/10"
                  style={{
                    backgroundColor: playerColorMap[player.color]?.hex,
                    boxShadow: `0 0 10px 0 ${playerColorMap[player.color]?.glow}`,
                  }}
                />
                <span className="flex-1 font-display text-sm text-text">
                  {player.username}
                </span>
                <div className="flex items-center gap-2">
                  {player.id === host.id ? (
                    <span className="flex items-center gap-1 text-xs text-accent font-medium">
                      <CrownIcon />
                      Host
                    </span>
                  ) : (
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
              </div>
            ))}

            {Array.from({ length: totalSlots - filledCount }).map((_, i) => (
              <div
                key={`empty-${i}`}
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 border border-border/50 bg-bg/40 opacity-50"
              >
                <div className="w-4 h-4 rounded-full shrink-0 bg-border" />
                <span className="flex-1 font-display text-sm text-muted italic">
                  Waiting…
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm font-body">
            {error}
          </div>
        )}

        {/* Action button */}
        {isHost ? (
          allReady && filledCount === totalSlots ? (
            <Button variant="primary" size="md" fullWidth onClick={() => {}}>
              Start Game
            </Button>
          ) : (
            <p className="text-center text-sm text-muted font-body">
              Waiting for everyone to ready up…
            </p>
          )
        ) : (
          <Button
            variant={currentPlayer?.isReady ? "secondary" : "primary"}
            size="md"
            fullWidth
            onClick={handlePlayerReady}
          >
            {currentPlayer?.isReady ? "Not Ready" : "Ready"}
          </Button>
        )}
      </div>
    </div>
  );
}
