import { useState } from "react";
import { Button } from "../../design-system/Button";
import { BackButton } from "../../components/BackButton";
import { useSocket } from "../../contexts/socket";
import { useAuth } from "../../contexts/AuthContext";
import { useGameState } from "../../contexts/GameStateContext";

export function JoinRoomPage() {
  const { socket } = useSocket();
  const { currentUser } = useAuth();
  const { setPlayerId, error } = useGameState();

  const [roomCode, setRoomCode] = useState("");

  const playerId = currentUser?._id || crypto.randomUUID();
  const username = currentUser?._id || "Guest";

  function handleJoinRoom() {
    console.log("clicked");
    setPlayerId(playerId);
    socket?.emit("join-room", { playerId, username, roomCode });
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
          Join Room
        </h2>
        <p className="text-muted text-sm mb-8 font-body">
          Enter the room code shared by your friend.
        </p>

        {error && (
          <div className="mb-4 px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm font-body">
            {error}
          </div>
        )}

        <div className="bg-surface border border-border rounded-xl p-6 shadow-card space-y-4">
          <div className="space-y-1.5">
            <label
              htmlFor="roomCode"
              className="text-xs font-medium text-muted uppercase tracking-widest"
            >
              Room Code
            </label>
            <input
              id="roomCode"
              type="text"
              placeholder="e.g. ABCD-1234"
              maxLength={9}
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
              className="w-full bg-bg border border-border rounded-lg px-4 py-3 text-text placeholder:text-muted focus:outline-none focus:border-muted transition-colors font-display text-2xl tracking-widest text-center uppercase"
            />
          </div>

          <Button
            variant="primary"
            size="md"
            fullWidth
            disabled={roomCode.length === 0}
            onClick={handleJoinRoom}
          >
            Join Room
          </Button>
        </div>
      </div>
    </div>
  );
}
