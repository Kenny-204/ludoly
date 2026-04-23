import { Link, useNavigate } from "react-router-dom";
import { Button } from "../../design-system/Button";
import { BackButton } from "../../components/BackButton";
import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";

export default function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  async function handleSubmit(e) {
    try {
      setLoading(true);
      setError(null);
      e.preventDefault();
      const data = { email, password, username, passwordConfirm };
      await signup(data);
      navigate("/");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err);
        console.log(err.message);
      }
      console.log(err);
    } finally {
      setLoading(false);
    }
  }

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

        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display text-4xl font-semibold text-text mb-1">
            Create account
          </h1>
          <p className="text-muted text-sm">Join Ludoly and start playing</p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 flex items-start gap-3 rounded-lg border border-ludo-red/30 bg-ludo-red/10 px-4 py-3">
            <svg className="w-4 h-4 text-ludo-red mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
            <p className="text-sm text-ludo-red">{error.message}</p>
          </div>
        )}

        {/* Card */}
        <div className="bg-surface border border-border rounded-xl p-6 shadow-card">
          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Username */}
            <div className="space-y-1.5">
              <label
                htmlFor="username"
                className="text-xs font-medium text-muted uppercase tracking-widest"
              >
                Username
              </label>
              <input
                id="username"
                type="text"
                placeholder="e.g. kingkehinde"
                className="w-full bg-bg border border-border rounded-lg px-4 py-2.5 text-sm text-text placeholder:text-muted focus:outline-none focus:border-muted transition-colors"
                onChange={(e) => setUsername(e.target.value)}
                value={username}
              />
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label
                htmlFor="email"
                className="text-xs font-medium text-muted uppercase tracking-widest"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                className="w-full bg-bg border border-border rounded-lg px-4 py-2.5 text-sm text-text placeholder:text-muted focus:outline-none focus:border-muted transition-colors"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
              />
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label
                htmlFor="password"
                className="text-xs font-medium text-muted uppercase tracking-widest"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                className="w-full bg-bg border border-border rounded-lg px-4 py-2.5 text-sm text-text placeholder:text-muted focus:outline-none focus:border-muted transition-colors"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
              />
            </div>

            {/* Confirm Password */}
            <div className="space-y-1.5">
              <label
                htmlFor="passwordConfirm"
                className="text-xs font-medium text-muted uppercase tracking-widest"
              >
                Confirm Password
              </label>
              <input
                id="passwordConfirm"
                type="password"
                placeholder="••••••••"
                className="w-full bg-bg border border-border rounded-lg px-4 py-2.5 text-sm text-text placeholder:text-muted focus:outline-none focus:border-muted transition-colors"
                onChange={(e) => setPasswordConfirm(e.target.value)}
                value={passwordConfirm}
              />
            </div>

            <div className="pt-2">
              <Button
                variant="primary"
                size="md"
                fullWidth
                type="submit"
                disabled={loading}
              >
                Create Account
              </Button>
            </div>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-muted mt-6">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-text hover:text-accent transition-colors font-medium"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
