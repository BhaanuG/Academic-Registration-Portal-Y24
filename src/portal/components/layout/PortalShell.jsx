import { useState } from "react";
import Brand from "../common/Brand";
import PortalFooter from "./PortalFooter";
import {
  LayoutDashboard,
  Layers,
  BookOpen,
  UserCheck,
  FolderSearch,
  BookmarkCheck,
  User,
  LogOut,
  ChevronRight,
  Menu,
  X,
  ShieldCheck,
  GraduationCap,
} from "lucide-react";

const navItems = [
  { key: "overview", label: "Academic Overview", icon: LayoutDashboard, badge: null },
  { key: "cluster", label: "Cluster Selection", icon: Layers, badge: null },
  { key: "subjects", label: "Course Selection", icon: BookOpen, badge: null },
  { key: "preferences", label: "Faculty Preferences", icon: UserCheck, badge: null },
  { key: "directory", label: "Faculty Directory", icon: FolderSearch, badge: null },
  { key: "my-preference", label: "My Preference", icon: BookmarkCheck, badge: null },
  { key: "profile", label: "My Profile", icon: User, badge: null },
];

export default function PortalShell({ page, setPage, onLogout, studentId, children }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const now = new Date();
  const semester = now.getMonth() === 11 || (now.getMonth() === 10 && now.getDate() >= 30) ? 6 : 5;

  const currentNav = navItems.find((item) => item.key === page) || navItems[0];

  return (
    <div className={`app-shell page-shell-${page}`}>
      {/* Top Application Header */}
      <header className="topbar">
        <div className="topbar-inner">
          <div className="flex items-center gap-4">
            <button
              type="button"
              className="student-mobile-menu-btn text-slate-300 hover:text-white"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
            <Brand compact />
          </div>

          <div className="portal-title">
            <strong>Academic Registration Portal</strong>
            <span>CSE-2 · Academic Semester {semester}</span>
          </div>

          <div className="account-menu">
            <div className="account-user-badge">
              <div className="account-avatar-sm">
                <GraduationCap size={15} />
              </div>
              <div className="account-info-text">
                <span className="account-role-label">Registration No</span>
                <strong className="account-id-label">{studentId}</strong>
              </div>
            </div>

            <button type="button" className="signout-button" onClick={onLogout} title="Sign out of student portal">
              <LogOut size={15} />
              <span>Sign out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Primary Sub-Navigation Bar */}
      <nav className={`main-nav ${mobileMenuOpen ? "mobile-open" : ""}`} aria-label="Main navigation">
        <div className="nav-inner">
          {navItems.map(({ key, label, icon: Icon, badge }) => {
            const isActive = page === key;
            return (
              <button
                key={key}
                type="button"
                className={`nav-item-btn ${isActive ? "active" : ""}`}
                onClick={() => {
                  setPage(key);
                  setMobileMenuOpen(false);
                }}
              >
                <Icon size={18} className={isActive ? "text-blue-600" : "text-slate-500"} />
                <span className="tracking-tight">{label}</span>
                {badge && <span className={`nav-item-badge ${isActive ? "active-badge" : ""}`}>{badge}</span>}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Main Page Workspace */}
      <main className={`content page-${page}`}>
        <div className="page-transition" key={page}>
          {children}
        </div>
      </main>

      {/* Standard Unified Footer */}
      <PortalFooter returnTo={window.location.pathname} />
    </div>
  );
}
