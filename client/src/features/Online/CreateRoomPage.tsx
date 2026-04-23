import { useNavigate } from "react-router-dom";
import { Card } from "../../design-system/Card";
import { BackButton } from "../../components/BackButton";
import { useSocket } from "../../contexts/socket";
import { useAuth } from "../../contexts/AuthContext";
import { useEffect } from "react";

const playerOptions: { count: 2 | 3 | 4; colors: string[]; label: string }[] = [
  { count: 2, colors: ["#ef4444", "#eab308"], label: "Red vs Yellow" },
  {
    count: 3,
    colors: ["#ef4444", "#22c55e", "#3b82f6"],
    label: "Red, Green & Blue",
  },
  {
    count: 4,
    colors: ["#ef4444", "#22c55e", "#3b82f6", "#eab308"],
    label: "All four colors",
  },
];

export function CreateRoomPage() {
  const navigate = useNavigate();
  const { socket } = useSocket();
  const { currentUser } = useAuth();

  useEffect(
    function () {
      if (!socket) {
        return;
      }

      const handleCreateRoom = (data) => {
        console.log(data);
      
      };

      socket.on("room-created", handleCreateRoom);

      return () => {
        socket.off("room-created", handleCreateRoom);
      };
    },
    [socket],
  );
  const playerId = currentUser?._id || crypto.randomUUID();

  function handleCreateRoom(numPlayers: number) {
    console.log("clicked", socket);
    socket?.emit("create-room", { playerId, numPlayers });
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
          Create Room
        </h2>
        <p className="text-muted text-sm mb-8 font-body">
          How many players are joining?
        </p>

        <div className="space-y-3">
          {playerOptions.map(({ count, colors, label }) => (
            <Card
              key={count}
              hoverable
              onClick={() => handleCreateRoom(count)}
              className="p-5 flex items-center gap-5"
            >
              <div className="flex gap-1.5 shrink-0">
                {colors.map((c, i) => (
                  <div
                    key={i}
                    className="w-5 h-5 rounded-full border border-white/10"
                    style={{
                      backgroundColor: c,
                      boxShadow: `0 0 8px 0 ${c}66`,
                    }}
                  />
                ))}
              </div>

              <div className="flex-1">
                <p className="font-display text-xl text-text">
                  {count} Players
                </p>
                <p className="text-xs text-muted">{label}</p>
              </div>

              <svg
                className="w-4 h-4 text-muted ml-auto"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
