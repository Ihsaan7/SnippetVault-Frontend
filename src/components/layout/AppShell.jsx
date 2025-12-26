import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";

const linkBase =
  "block px-4 py-3 border-b border-[var(--border)] text-base hover:bg-[var(--surface-2)] hover:translate-x-[1px]";

const linkActive =
  "bg-[var(--surface-2)] text-[var(--text)] border-l-2 border-l-[var(--accent)]";

export function AppShell({ children }) {
  const navigate = useNavigate();
  const { logout, isLoading, user, isVerified } = useAuth();
  const { mode, toggle } = useTheme();

  const onLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] flex">
      {/* Sidebar */}
      <aside className="w-72 border-r border-[var(--border)] bg-[var(--surface)]">
        <div className="px-5 py-5 border-b border-[var(--border)]">
          <div className="flex items-center gap-3">
            <span
              className="inline-flex h-5 w-5 items-center justify-center border border-[var(--border)] bg-[var(--surface-2)]"
              aria-hidden="true"
            >
              <span className="text-[10px] font-bold text-[var(--accent)]">SV</span>
            </span>
            <div className="text-base font-bold tracking-tight">SnippetVault</div>
          </div>
          <div className="text-xs text-[var(--muted)]">
            {user?.username ? `@${user.username}` : isVerified ? "" : "Public mode"}
          </div>
        </div>

        <nav>
          <NavLink
            to="/public/snippets"
            className={({ isActive }) =>
              `${linkBase} ${isActive ? linkActive : "text-[var(--muted)]"}`
            }
          >
            Public
          </NavLink>

          {isVerified && (
            <>
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
            </>
          )}

          {!isVerified && (
            <>
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  `${linkBase} ${isActive ? linkActive : "text-[var(--muted)]"}`
                }
              >
                Login
              </NavLink>
              <NavLink
                to="/register"
                className={({ isActive }) =>
                  `${linkBase} ${isActive ? linkActive : "text-[var(--muted)]"}`
                }
              >
                Register
              </NavLink>
            </>
          )}
        </nav>

        <div className="px-5 py-5 border-t border-[var(--border)] space-y-3">
          <button
            type="button"
            onClick={toggle}
            className="w-full px-4 py-3 border border-[var(--border)] bg-[var(--surface)] text-base font-semibold hover:border-[var(--accent)] hover:text-[var(--accent)] active:translate-y-px"
            title="Toggle light/dark"
          >
            Theme: {mode === "auto" ? "Auto" : mode === "dark" ? "Dark" : "Light"}
          </button>

          {isVerified && (
            <button
              onClick={onLogout}
              disabled={isLoading}
              className="w-full px-4 py-3 bg-[var(--accent)] text-[var(--accent-contrast)] text-base font-bold border border-[var(--accent)] hover:brightness-95 active:translate-y-px disabled:opacity-60"
            >
              {isLoading ? "Working..." : "Logout"}
            </button>
          )}
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1">
        <div className="px-6 py-6 border-b border-[var(--border)] bg-[var(--surface)]">
          <div className="flex items-center justify-between gap-4">
            <div className="text-base text-[var(--muted)]">
              Store, search, share — clean.
            </div>
            <button
              type="button"
              onClick={() => (isVerified ? navigate("/dashboard/create") : navigate("/login"))}
              className="px-4 py-3 bg-[var(--surface)] border border-[var(--border)] text-base font-semibold hover:border-[var(--accent)] hover:text-[var(--accent)] hover:translate-y-[-1px] active:translate-y-px"
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
