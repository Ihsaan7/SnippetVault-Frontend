import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";

const linkBase =
  "block px-3 py-2 border-b border-[var(--border)] text-sm hover:bg-[var(--surface-2)]";

const linkActive = "bg-[var(--surface-2)] text-[var(--text)]";

export function AppShell({ children }) {
  const navigate = useNavigate();
  const { logout, isLoading, user } = useAuth();
  const { mode, accent, setMode, setAccent, modes, palettes } = useTheme();

  const onLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-[var(--border)] bg-[var(--surface)]">
        <div className="px-4 py-4 border-b border-[var(--border)]">
          <div className="text-sm font-semibold tracking-wide">
            SnippetVault
          </div>
          <div className="text-xs text-[var(--muted)]">
            {user?.username ? `@${user.username}` : ""}
          </div>
        </div>

        <nav className="">
          <NavLink
            to="/dashboard"
            end
            className={({ isActive }) =>
              `${linkBase} ${isActive ? linkActive : "text-[var(--muted)]"}`
            }
          >
            Dashboard
          </NavLink>
          <NavLink
            to="/dashboard/snippets"
            className={({ isActive }) =>
              `${linkBase} ${isActive ? linkActive : "text-[var(--muted)]"}`
            }
          >
            Snippets
          </NavLink>
          <NavLink
            to="/dashboard/create"
            className={({ isActive }) =>
              `${linkBase} ${isActive ? linkActive : "text-[var(--muted)]"}`
            }
          >
            Create
          </NavLink>
          <NavLink
            to="/dashboard/favorites"
            className={({ isActive }) =>
              `${linkBase} ${isActive ? linkActive : "text-[var(--muted)]"}`
            }
          >
            Favorites
          </NavLink>
          <NavLink
            to="/dashboard/profile"
            className={({ isActive }) =>
              `${linkBase} ${isActive ? linkActive : "text-[var(--muted)]"}`
            }
          >
            Profile
          </NavLink>
          <NavLink
            to="/public/snippets"
            className={({ isActive }) =>
              `${linkBase} ${isActive ? linkActive : "text-[var(--muted)]"}`
            }
          >
            Public
          </NavLink>
        </nav>

        <div className="px-4 py-4 border-t border-[var(--border)] space-y-3">
          <div className="text-xs text-[var(--muted)]">Theme</div>
          <select
            value={mode}
            onChange={(e) => setMode(e.target.value)}
            className="w-full bg-[var(--surface)] border border-[var(--border)] px-2 py-2 text-sm text-[var(--text)] focus:outline-none focus:border-[var(--accent)]"
          >
            {modes.map((m) => (
              <option key={m.id} value={m.id}>
                {m.label}
              </option>
            ))}
          </select>

          <div className="text-xs text-[var(--muted)]">Palette</div>
          <select
            value={accent}
            onChange={(e) => setAccent(e.target.value)}
            className="w-full bg-[var(--surface)] border border-[var(--border)] px-2 py-2 text-sm text-[var(--text)] focus:outline-none focus:border-[var(--accent)]"
          >
            {palettes.map((p) => (
              <option key={p.id} value={p.id}>
                {p.label}
              </option>
            ))}
          </select>

          <button
            onClick={onLogout}
            disabled={isLoading}
            className="w-full px-3 py-2 bg-[var(--accent)] text-[var(--accent-contrast)] text-sm font-semibold border border-[var(--accent)] hover:brightness-95 active:translate-y-px disabled:opacity-60"
          >
            {isLoading ? "Working..." : "Logout"}
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1">
        <div className="px-6 py-5 border-b border-[var(--border)] bg-[var(--surface)]">
          <div className="flex items-center justify-between gap-4">
            <div className="text-sm text-[var(--muted)]">
              Store, search, share — clean.
            </div>
            <button
              type="button"
              onClick={() => navigate("/dashboard/create")}
              className="px-3 py-2 bg-[var(--surface)] border border-[var(--border)] text-sm hover:border-[var(--accent)] hover:text-[var(--accent)]"
            >
              + New Snippet
            </button>
          </div>
        </div>

        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}
