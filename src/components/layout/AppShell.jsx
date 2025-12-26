import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";

const navItems = {
  public: [{ to: "/public/snippets", label: "Explore", icon: "globe" }],
  auth: [
    { to: "/dashboard", label: "Dashboard", icon: "home", end: true },
    { to: "/dashboard/snippets", label: "Snippets", icon: "code" },
    { to: "/dashboard/create", label: "Create", icon: "plus" },
    { to: "/dashboard/favorites", label: "Favorites", icon: "star" },
    { to: "/dashboard/profile", label: "Profile", icon: "user" },
  ],
  guest: [
    { to: "/login", label: "Sign in", icon: "login" },
    { to: "/register", label: "Sign up", icon: "register" },
  ],
};

function Icon({ name, className = "" }) {
  const icons = {
    globe: (
      <svg
        className={className}
        fill="none"
        viewBox="0 0 16 16"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <circle cx="8" cy="8" r="6.25" />
        <path d="M1.75 8h12.5M8 1.75c-2 2-2.5 4-2.5 6.25s.5 4.25 2.5 6.25c2-2 2.5-4 2.5-6.25S10 3.75 8 1.75z" />
      </svg>
    ),
    home: (
      <svg className={className} fill="none" viewBox="0 0 16 16" stroke="currentColor" strokeWidth="1.5">
        <path d="M2 6.5L8 2l6 4.5v7a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5V10H6v3.5a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-7z" />
      </svg>
    ),
    code: (
      <svg className={className} fill="none" viewBox="0 0 16 16" stroke="currentColor" strokeWidth="1.5">
        <path d="M5.5 4.5L2 8l3.5 3.5M10.5 4.5L14 8l-3.5 3.5" />
      </svg>
    ),
    plus: (
      <svg className={className} fill="none" viewBox="0 0 16 16" stroke="currentColor" strokeWidth="1.5">
        <path d="M8 3v10M3 8h10" />
      </svg>
    ),
    star: (
      <svg className={className} fill="none" viewBox="0 0 16 16" stroke="currentColor" strokeWidth="1.5">
        <path d="M8 2l1.5 4.5H14l-3.5 3 1.5 4.5L8 11l-4 3 1.5-4.5L2 6.5h4.5L8 2z" />
      </svg>
    ),
    user: (
      <svg className={className} fill="none" viewBox="0 0 16 16" stroke="currentColor" strokeWidth="1.5">
        <circle cx="8" cy="5" r="2.5" />
        <path d="M3 14c0-2.5 2.5-4 5-4s5 1.5 5 4" />
      </svg>
    ),
    login: (
      <svg className={className} fill="none" viewBox="0 0 16 16" stroke="currentColor" strokeWidth="1.5">
        <path d="M6 2h7a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H6M2 8h8M7.5 5L10 8l-2.5 3" />
      </svg>
    ),
    register: (
      <svg className={className} fill="none" viewBox="0 0 16 16" stroke="currentColor" strokeWidth="1.5">
        <path d="M11 5v6M8 8h6M2 14c0-2.5 2-4 4.5-4S11 11.5 11 14M6.5 3a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5z" />
      </svg>
    ),
    sun: (
      <svg className={className} fill="none" viewBox="0 0 16 16" stroke="currentColor" strokeWidth="1.5">
        <circle cx="8" cy="8" r="3" />
        <path d="M8 1v2M8 13v2M1 8h2M13 8h2M3.05 3.05l1.41 1.41M11.54 11.54l1.41 1.41M3.05 12.95l1.41-1.41M11.54 4.46l1.41-1.41" />
      </svg>
    ),
    moon: (
      <svg className={className} fill="none" viewBox="0 0 16 16" stroke="currentColor" strokeWidth="1.5">
        <path d="M13.5 10.5a6 6 0 1 1-8-8 5 5 0 1 0 8 8z" />
      </svg>
    ),
    logout: (
      <svg className={className} fill="none" viewBox="0 0 16 16" stroke="currentColor" strokeWidth="1.5">
        <path d="M6 2h7a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H6M10 8H2M4.5 5L2 8l2.5 3" />
      </svg>
    ),
  };
  return icons[name] || null;
}

function NavItem({ to, label, icon, end }) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        `group flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-all duration-150 ${
          isActive
            ? "bg-[var(--accent-subtle)] text-[var(--accent)] border-l-2 border-l-[var(--accent)] -ml-px pl-[11px]"
            : "text-[var(--text-secondary)] hover:bg-[var(--surface-2)] hover:text-[var(--text)]"
        }`
      }
    >
      <Icon
        name={icon}
        className="w-4 h-4 flex-shrink-0 transition-transform duration-150 group-hover:scale-110"
      />
      <span>{label}</span>
    </NavLink>
  );
}

export function AppShell({ children }) {
  const navigate = useNavigate();
  const { logout, isLoading, user, isVerified } = useAuth();
  const { toggle, isDark } = useTheme();

  const onLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-[var(--bg)] flex">
      <aside className="w-64 border-r border-[var(--border)] bg-[var(--surface)] flex flex-col">
        <div className="p-4 border-b border-[var(--border)]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-md bg-[var(--accent)] flex items-center justify-center">
              <span className="text-xs font-bold text-white">SV</span>
            </div>
            <div>
              <div className="text-sm font-semibold text-[var(--text)]">
                SnippetVault
              </div>
              <div className="text-xs text-[var(--muted)]">
                {user?.username ? `@${user.username}` : "Code snippets"}
              </div>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          <div className="mb-3">
            <div className="px-3 py-1.5 text-xs font-semibold text-[var(--muted)] uppercase tracking-wider">
              Discover
            </div>
            {navItems.public.map((item) => (
              <NavItem key={item.to} {...item} />
            ))}
          </div>

          {isVerified && (
            <div className="mb-3">
              <div className="px-3 py-1.5 text-xs font-semibold text-[var(--muted)] uppercase tracking-wider">
                Workspace
              </div>
              {navItems.auth.map((item) => (
                <NavItem key={item.to} {...item} />
              ))}
            </div>
          )}

          {!isVerified && (
            <div className="mb-3">
              <div className="px-3 py-1.5 text-xs font-semibold text-[var(--muted)] uppercase tracking-wider">
                Account
              </div>
              {navItems.guest.map((item) => (
                <NavItem key={item.to} {...item} />
              ))}
            </div>
          )}
        </nav>

        <div className="p-3 border-t border-[var(--border)] space-y-2">
          <button
            type="button"
            onClick={toggle}
            className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-[var(--text-secondary)] rounded-md hover:bg-[var(--surface-2)] hover:text-[var(--text)] transition-all duration-150"
          >
            <Icon
              name={isDark ? "sun" : "moon"}
              className="w-4 h-4"
            />
            <span>{isDark ? "Light mode" : "Dark mode"}</span>
          </button>

          {isVerified && (
            <button
              onClick={onLogout}
              disabled={isLoading}
              className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-[var(--danger)] rounded-md hover:bg-[var(--danger-muted)] transition-all duration-150 disabled:opacity-50"
            >
              <Icon name="logout" className="w-4 h-4" />
              <span>{isLoading ? "Signing out..." : "Sign out"}</span>
            </button>
          )}
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-14 px-6 border-b border-[var(--border)] bg-[var(--surface)] flex items-center justify-between gap-4">
          <div className="text-sm text-[var(--muted)]">
            Store, organize, and share your code snippets
          </div>
          <button
            type="button"
            onClick={() =>
              isVerified ? navigate("/dashboard/create") : navigate("/login")
            }
            className="btn btn-primary"
          >
            <Icon name="plus" className="w-4 h-4" />
            New Snippet
          </button>
        </header>

        <div className="flex-1 p-6 overflow-y-auto">
          <div className="fade-in">{children}</div>
        </div>
      </main>
    </div>
  );
}
