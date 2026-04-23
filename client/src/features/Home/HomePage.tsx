import { Button } from "../../design-system/Button";
import { Badge } from "../../design-system/Badge";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const ludoColors = [
  { color: "#ef4444", shadow: "rgba(239,68,68,0.4)" },
  { color: "#22c55e", shadow: "rgba(34,197,94,0.4)" },
  { color: "#3b82f6", shadow: "rgba(59,130,246,0.4)" },
  { color: "#eab308", shadow: "rgba(234,179,8,0.4)" },
];

export function HomePage() {
  const { currentUser } = useAuth();
  return (
    <div className="min-h-screen bg-bg flex flex-col items-center justify-center px-6 py-12">
      <div className="fixed top-4 right-6 z-20 flex items-center gap-2">
        {!currentUser && (
          <>
            <Link
              to="/login"
              className="px-4 py-1.5 rounded-lg text-sm font-medium text-muted hover:text-text transition-colors duration-150"
            >
              Sign In
            </Link>
            <Link
              to="/signup"
              className="px-4 py-1.5 rounded-lg text-sm font-medium border border-border text-text hover:border-muted hover:bg-surface-2 transition-all duration-150"
            >
              Sign Up
            </Link>
          </>
        )}
        {currentUser && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center shrink-0">
              <span className="font-display text-sm font-semibold text-bg leading-none">
                {currentUser.username[0]}
              </span>
            </div>
            <span className="text-sm font-medium text-text">
              {currentUser.username}
            </span>
          </div>
        )}
      </div>

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

      <div className="relative z-10 flex flex-col items-center">
        {/* Decorative pieces */}
        <div className="flex gap-3 justify-center mb-8">
          {ludoColors.map((p, i) => (
            <div
              key={i}
              className="w-4 h-4 rounded-full border-2 border-white/10"
              style={{
                backgroundColor: p.color,
                boxShadow: `0 0 14px 0 ${p.shadow}`,
              }}
            />
          ))}
        </div>

        <h1 className="font-display text-7xl font-semibold text-text mb-2 tracking-tight">
          Ludo<span className="text-accent">ly</span>
        </h1>
        <p className="text-muted text-sm mb-12 font-body">
          Roll the dice. Race to glory.
        </p>

        <div className="w-full max-w-xs space-y-3">
          <Link to="/online" className="block">
            <Button variant="primary" size="lg" fullWidth>
              Play Online
            </Button>
          </Link>

          <Link to="player-select" className="block">
            <Button variant="secondary" size="lg" fullWidth>
              Pass and Play
            </Button>
          </Link>

          <div className="relative">
            <Button disabled size="lg" fullWidth>
              Play with Computer
            </Button>
            <span className="absolute -top-2 -right-2">
              <Badge variant="coming-soon">Soon</Badge>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
