import { useState } from "react";
import { Button } from "../../design-system/Button";
import { BackButton } from "../../components/BackButton";

export function JoinRoomPage() {
  const [code, setCode] = useState("");

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

        <h2 className="font-display text-3xl font-semibold text-text mb-1">Join Room</h2>
        <p className="text-muted text-sm mb-8 font-body">
          Enter the room code shared by your friend.
        </p>

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
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              className="w-full bg-bg border border-border rounded-lg px-4 py-3 text-text placeholder:text-muted focus:outline-none focus:border-muted transition-colors font-display text-2xl tracking-widest text-center uppercase"
            />
          </div>

          <Button
            variant="primary"
            size="md"
            fullWidth
            disabled={code.length === 0}
            onClick={() => {}}
          >
            Join Room
          </Button>
        </div>
      </div>
    </div>
  );
}
