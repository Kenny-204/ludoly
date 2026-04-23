import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { Button } from "../../design-system/Button";
import { BackButton } from "../../components/BackButton";

export function Profile() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate("/");
  }

  if (!currentUser) return null;

  return (
    <div className="min-h-screen bg-bg flex flex-col items-center justify-center px-6 py-12">
      {/* Grid background */}
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

        {/* Avatar */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-20 h-20 rounded-full bg-accent flex items-center justify-center mb-4 shadow-accent">
            <span className="font-display text-4xl font-semibold text-bg leading-none">
              {currentUser.username.charAt(0).toUpperCase()}
            </span>
          </div>
          <h1 className="font-display text-3xl font-semibold text-text">
            {currentUser.username}
          </h1>
          <p className="text-muted text-sm mt-1">{currentUser.email}</p>
        </div>

        {/* Logout */}
        <Button variant="danger" size="md" fullWidth onClick={handleLogout}>
          Log Out
        </Button>
      </div>
    </div>
  );
}
