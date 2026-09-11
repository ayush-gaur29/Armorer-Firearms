import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { friendlyAuthError, useAuth } from "@/hooks/useAuth";
import { AuthButton, AuthCard, AuthField } from "@/components/site/AuthCard";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Armorer Firearms" },
      { name: "description", content: "Manage your Armorer Firearms collector profile." },
      { property: "og:title", content: "Armorer Firearms" },
      { property: "og:description", content: "Collector portal profile." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ProfilePage,
});

function ProfilePage() {
  const { user, ready, logout, updateName } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (ready && !user) navigate({ to: "/login", replace: true });
  }, [ready, user, navigate]);
  useEffect(() => setName(user?.displayName ?? ""), [user]);

  if (!ready || !user) {
    return (
      <AuthCard eyebrow="Collector Portal" title="Verifying…">
        <p className="animate-pulse text-sm text-parchment-dim">Checking your session.</p>
      </AuthCard>
    );
  }

  async function onSave(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      await updateName(name.trim());
      toast.success("Profile updated.");
    } catch (err) {
      toast.error(friendlyAuthError(err));
    } finally {
      setBusy(false);
    }
  }

  async function onLogout() {
    await logout();
    navigate({ to: "/", replace: true });
  }

  const initial = (user.displayName || user.email || "C").charAt(0).toUpperCase();

  return (
    <AuthCard
      eyebrow="Collector Profile"
      title={user.displayName ? `Good day, ${user.displayName.split(" ")[0]}.` : "Your profile."}
      footer={
        <div className="flex items-center justify-between gap-4">
          <Link to="/collection" className="text-brass hover:text-brass-light">Browse the archive</Link>
          <button onClick={onLogout} className="text-[0.68rem] tracking-[0.2em] uppercase text-parchment-dim hover:text-brass">Sign out</button>
        </div>
      }
    >
      <div className="flex items-center gap-4 border border-brass-border bg-obsidian-3 p-4">
        <span className="grid size-12 shrink-0 place-items-center border border-brass font-serif text-xl text-brass">{initial}</span>
        <div className="min-w-0">
          <p className="truncate text-sm text-ivory">{user.email}</p>
          <p className="font-mono text-[0.6rem] tracking-[0.2em] text-brass-dark">COLLECTOR ID · {user.uid.slice(0, 8).toUpperCase()}</p>
        </div>
      </div>
      <form onSubmit={onSave} className="mt-6 space-y-5">
        <AuthField label="Display Name" value={name} onChange={(e) => setName(e.target.value)} placeholder="How should we address you?" />
        <AuthButton busy={busy}>Save Changes</AuthButton>
      </form>
    </AuthCard>
  );
}
