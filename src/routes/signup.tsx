import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { friendlyAuthError, useAuth } from "@/hooks/useAuth";
import { AuthButton, AuthCard, AuthField } from "@/components/site/AuthCard";

export const Route = createFileRoute("/signup")({
  head: () => ({
    meta: [
      { title: "Request a Collector Account — Armorer Firearms" },
      { name: "description", content: "Create a collector account to follow the Armorer Firearms archive and manage private inquiries." },
      { property: "og:title", content: "Request a Collector Account — Armorer Firearms" },
      { property: "og:description", content: "Join the collector portal." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: SignupPage,
});

function SignupPage() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password.length < 6) return setError("Please choose a password of at least 6 characters.");
    setBusy(true);
    setError("");
    try {
      await signup(email, password, name.trim());
      navigate({ to: "/profile" });
    } catch (err) {
      setError(friendlyAuthError(err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <AuthCard
      eyebrow="Collector Portal"
      title="Request an account."
      footer={<>Already registered? <Link to="/login" className="text-brass hover:text-brass-light">Sign in</Link></>}
    >
      <form onSubmit={onSubmit} className="space-y-5">
        <AuthField label="Full Name" autoComplete="name" required value={name} onChange={(e) => setName(e.target.value)} />
        <AuthField label="Email" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        <AuthField label="Password" type="password" autoComplete="new-password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} />
        {error && <p className="text-sm text-destructive">{error}</p>}
        <AuthButton busy={busy}>Create Account</AuthButton>
      </form>
    </AuthCard>
  );
}
