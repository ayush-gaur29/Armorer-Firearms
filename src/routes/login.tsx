import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { friendlyAuthError, useAuth } from "@/hooks/useAuth";
import { AuthButton, AuthCard, AuthField } from "@/components/site/AuthCard";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Collector Login — Armorer Firearms" },
      { name: "description", content: "Sign in to the Armorer Firearms collector portal to manage your profile and inquiries." },
      { property: "og:title", content: "Collector Login — Armorer Firearms" },
      { property: "og:description", content: "Private collector portal access." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      await login(email, password);
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
      title="Welcome back."
      footer={<>New to the archive? <Link to="/signup" className="text-brass hover:text-brass-light">Request an account</Link></>}
    >
      <form onSubmit={onSubmit} className="space-y-5">
        <AuthField label="Email" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        <AuthField label="Password" type="password" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} />
        {error && <p className="text-sm text-destructive">{error}</p>}
        <AuthButton busy={busy}>Sign In</AuthButton>
      </form>
    </AuthCard>
  );
}
