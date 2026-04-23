import { useNavigate } from "react-router-dom";
import { Card } from "../../design-system/Card";
import { BackButton } from "../../components/BackButton";
// import { useSocket } from "../../contexts/socket";

export function OnlinePage() {
  const navigate = useNavigate();

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
          Play Online
        </h2>
        <p className="text-muted text-sm mb-8 font-body">
          Create a private room or jump into one.
        </p>

        <div className="space-y-3">
          <Card
            hoverable
            onClick={() => navigate("/online/create")}
            className="p-5 flex items-center gap-4"
          >
            <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
              <svg
                className="w-5 h-5 text-accent"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </div>
            <div>
              <p className="font-display text-lg text-text">Create Room</p>
              <p className="text-xs text-muted">
                Start a private game with friends
              </p>
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

          <Card
            hoverable
            onClick={() => navigate("/online/join")}
            className="p-5 flex items-center gap-4"
          >
            <div className="w-10 h-10 rounded-lg bg-ludo-blue/10 flex items-center justify-center shrink-0">
              <svg
                className="w-5 h-5 text-ludo-blue"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0"
                />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-display text-lg text-text">Join Room</p>
              <p className="text-xs text-muted">Enter a room code to join</p>
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
        </div>

      </div>
    </div>
  );
}
