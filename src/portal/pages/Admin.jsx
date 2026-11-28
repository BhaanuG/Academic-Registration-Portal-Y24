import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router";
import {
  BookOpen,
  Boxes,
  GraduationCap,
  KeyRound,
  LayoutDashboard,
  LogOut,
  Menu,
  ShieldCheck,
  UserRound,
  X,
  ChevronRight,
} from "lucide-react";
import Brand from "../components/common/Brand";

import AdminDashboard from "./admin/DashboardPage";
import StudentsPage from "./admin/StudentsPage";
import FacultyPage from "./admin/FacultyPage";
import BucketsPage from "./admin/BucketsPage";
import CoursesPage from "./admin/CoursesPage";
import AdminProfilePage from "./admin/AdminProfilePage";
import AdminResetPasswordPage from "./admin/ResetPasswordPage";
import RecordModal from "./admin/RecordModal";
import {
  adminNavigation,
  resources,
  singularLabels,
  fields,
  normalizeForm,
} from "./admin/adminConfig";

const iconMap = {
  Dashboard: LayoutDashboard,
  Students: GraduationCap,
  Faculty: UserRound,
  Buckets: Boxes,
  Courses: BookOpen,
  "Reset-Password": KeyRound,
  "My-Profile": ShieldCheck,
};

export default function Admin() {
  const { pageName = "Dashboard" } = useParams();
  const navigate = useNavigate();
  const active = adminNavigation.some(([key]) => key === pageName) ? pageName : "Dashboard";
  const [admin, setAdmin] = useState(null);
  const [records, setRecords] = useState([]);
  const [buckets, setBuckets] = useState([]);
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({});
  const [status, setStatus] = useState("");
  const [loadingRecords, setLoadingRecords] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [summary, setSummary] = useState({ students: [], faculty: [], buckets: [], courses: [] });
  const resource = resources[active];

  useEffect(() => {
    // Development-only demonstration administrator verification
    const role = sessionStorage.getItem("klef-demo-role");
    const demoAdmin = {
      id: "admin-gbs",
      name: "G. Bhaanu Sai",
      email: "Bhaanugali@gmail.com",
      role: "admin",
      department: "Central Administration",
      phone: "+91 8897337687",
    };
    setAdmin(demoAdmin);
  }, [navigate]);

  const load = async () => {
    if (!resource) return;
    setLoadingRecords(true);
    try {
      const localKey = `klef-admin-${resource}`;
      const localData = JSON.parse(localStorage.getItem(localKey) || "null");
      if (localData) {
        setRecords(localData);
      } else {
        let initial = [];
        if (resource === "students") {
          initial = [
            {
              id: "student-1",
              name: "Anirudh Varma",
              username: "2400030952",
              dateOfBirth: "2007-01-01",
              universityEmail: "2400030952@kluniversity.in",
              personalEmail: "anirudh.varma@gmail.com",
              mobileNumber: "9876543210",
              gender: "Male",
              aadhaarNumber: "1234 5678 9012",
              aapaarNumber: "APAAR-9876-5432",
              residencyStatus: "Hosteler",
              parentName: "K. R. Varma",
              parentPhoneNumber: "9876500000",
              cluster: "Cluster 2",
              counselor: {
                name: "Dr. Arvind Rao",
                employeeId: "KLEF1184",
                designation: "Associate Professor",
                mobileNumber: "9876541111",
                email: "arvind.rao@kluniversity.in",
              },
              updatedAt: new Date().toISOString(),
            },
          ];
        } else if (resource === "faculty") {
          const { faculty: defaultFaculty } = require("../services/academicData");
          initial = defaultFaculty.map((f, i) => ({
            id: `fac-${i + 1}`,
            employeeId: f.id,
            facultyName: f.name,
            designation: f.designation,
            department: f.department,
            section: "S - 1",
            component: f.components,
            courseCode: "24CS3105",
            courseName: f.subjects[0] || "Core Course",
            updatedAt: new Date().toISOString(),
          }));
        } else if (resource === "buckets") {
          const { buckets: defaultBuckets } = require("../services/academicData");
          initial = defaultBuckets.map((b, i) => ({
            id: `bucket-${b.id}`,
            code: b.id,
            shortName: b.short,
            title: b.title,
            sortOrder: i + 1,
            active: true,
            updatedAt: new Date().toISOString(),
          }));
        } else if (resource === "courses") {
          const { buckets: defaultBuckets } = require("../services/academicData");
          initial = defaultBuckets.flatMap((b) =>
            b.subjects.map((s, idx) => ({
              id: `course-${b.id}-${idx}`,
              bucket: b.id,
              courseCode: s.code,
              name: s.name,
              credits: s.credits,
              lectureHours: s.ltps[0],
              tutorialHours: s.ltps[1],
              practicalHours: s.ltps[2],
              skillHours: s.ltps[3],
              components: s.components,
              description: s.description || "",
              prerequisite: s.prerequisite || "",
              active: true,
              updatedAt: new Date().toISOString(),
            })),
          );
        }
        localStorage.setItem(localKey, JSON.stringify(initial));
        setRecords(initial);
      }
    } finally {
      setLoadingRecords(false);
    }
  };

  const loadBuckets = async () => {
    try {
      const localBuckets = JSON.parse(localStorage.getItem("klef-admin-buckets") || "null");
      if (localBuckets) {
        setBuckets(localBuckets);
      } else {
        const { buckets: defaultBuckets } = require("../services/academicData");
        const initBuckets = defaultBuckets.map((b, i) => ({
          id: `bucket-${b.id}`,
          code: b.id,
          shortName: b.short,
          title: b.title,
          sortOrder: i + 1,
          active: true,
        }));
        setBuckets(initBuckets);
      }
    } catch {
      // fallback
    }
  };

  const loadSummary = async () => {
    try {
      const getFallback = (key, defaultArr) => {
        const local = JSON.parse(localStorage.getItem(`klef-admin-${key}`) || "null");
        return local || defaultArr;
      };

      const { faculty: defaultFaculty, buckets: defaultBuckets } = require("../services/academicData");

      setSummary({
        students: getFallback("students", [
          {
            id: "student-1",
            name: "Anirudh Varma",
            username: "2400030952",
          },
        ]),
        faculty: getFallback("faculty", defaultFaculty),
        buckets: getFallback("buckets", defaultBuckets),
        courses: getFallback("courses", defaultBuckets.flatMap((b) => b.subjects)),
      });
    } catch {
      // fallback
    }
  };

  useEffect(() => {
    setStatus("");
    setQuery("");
    if (active === "Dashboard") {
      loadSummary();
    } else {
      load();
    }
    loadBuckets();
  }, [active]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return records;
    return records.filter((r) => {
      const searchFields = [
        r.name,
        r.username,
        r.facultyName,
        r.employeeId,
        r.title,
        r.code,
        r.courseCode,
        r.shortName,
      ].filter(Boolean);
      return searchFields.some((f) => String(f).toLowerCase().includes(q));
    });
  }, [records, query]);

  const beginCreate = (targetActive = active) => {
    const initial = {};
    (fields[targetActive] || []).forEach((field) => {
      initial[field.name] = field.type === "number" ? 0 : field.type === "checkbox" ? true : "";
    });
    setForm(initial);
    setEditing("new");
  };

  const handleQuickCreate = (targetResourceKey) => {
    navigate(`/KLEF/3-2/Admin/G-Bhaanu-Sai/${targetResourceKey}`);
    setTimeout(() => {
      beginCreate(targetResourceKey);
    }, 50);
  };

  const beginEdit = (record) => {
    const initial = {};
    (fields[active] || []).forEach((field) => {
      const val = record[field.name];
      if (val !== undefined) {
        if (typeof val === "object" && val !== null) {
          initial[field.name] = val.id || val.code || "";
        } else {
          initial[field.name] = val;
        }
      } else {
        initial[field.name] = field.type === "number" ? 0 : field.type === "checkbox" ? true : "";
      }
    });
    setForm(initial);
    setEditing(record);
  };

  const save = async () => {
    const formData = normalizeForm(form, fields[active]);
    const localKey = `klef-admin-${resource}`;
    let currentList = JSON.parse(localStorage.getItem(localKey) || "null") || records;

    if (editing === "new") {
      const newRec = { id: `local-${Date.now()}`, ...formData, updatedAt: new Date().toISOString() };
      currentList = [newRec, ...currentList];
    } else {
      const updatedRec = { ...editing, ...formData, updatedAt: new Date().toISOString() };
      currentList = currentList.map((r) => (r.id === editing.id ? updatedRec : r));
    }

    localStorage.setItem(localKey, JSON.stringify(currentList));
    setRecords(currentList);
    setEditing(null);
    setStatus("Demonstration record saved locally.");
  };

  const remove = async (record) => {
    if (!window.confirm("Are you sure you want to delete this record?")) return;
    const localKey = `klef-admin-${resource}`;
    const updatedList = records.filter((r) => r.id !== record.id);
    localStorage.setItem(localKey, JSON.stringify(updatedList));
    setRecords(updatedList);
    setStatus("Demonstration record deleted.");
  };

  const resetPassword = async (record) => {
    if (!record.dateOfBirth) return setStatus("Add a date of birth before resetting this password.");
    setStatus(`Demonstration reset: Password for ${record.name} set to Date of Birth (${record.dateOfBirth}).`);
  };

  const logout = async () => {
    sessionStorage.clear();
    navigate("/");
  };

  if (!admin) return <main className="admin-loading">Verifying administrator access…</main>;

  return (
    <div className="app-shell page-shell-admin">
      {/* Top Application Header identical to Student Portal */}
      <header className="topbar">
        <div className="topbar-inner">
          <div className="flex items-center gap-4">
            <button
              type="button"
              className="student-mobile-menu-btn text-slate-300 hover:text-white"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle navigation menu"
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
            <Brand compact />
          </div>

          <div className="portal-title">
            <strong>Academic Registration Portal</strong>
            <span>Central Administration · Administrator Console</span>
          </div>

          <div className="account-menu">
            <div className="account-user-badge">
              <div className="account-avatar-sm">
                <ShieldCheck size={15} />
              </div>
              <div className="account-info-text">
                <span className="account-role-label">Administrator</span>
                <strong className="account-id-label">{admin.name}</strong>
              </div>
            </div>

            <button type="button" className="signout-button" onClick={logout} title="Sign out of admin console">
              <LogOut size={15} />
              <span>Sign out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Primary Sub-Navigation Bar matching Student Portal */}
      <nav className={`main-nav ${menuOpen ? "mobile-open" : ""}`} aria-label="Admin navigation">
        <div className="nav-inner">
          {adminNavigation.map(([key, label]) => {
            const Icon = iconMap[key];
            const isActive = active === key;
            return (
              <button
                key={key}
                type="button"
                className={`nav-item-btn ${isActive ? "active" : ""}`}
                onClick={() => {
                  setMenuOpen(false);
                  navigate(`/KLEF/3-2/Admin/G-Bhaanu-Sai/${key}`);
                }}
              >
                <Icon size={16} className={isActive ? "text-blue-600" : "text-slate-400"} />
                <span>{label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Active Breadcrumb Ribbon matching Student Portal */}
      <div className="portal-breadcrumb-ribbon">
        <div className="breadcrumb-inner">
          <span className="breadcrumb-root">Admin Portal</span>
          <ChevronRight size={13} className="text-slate-400" />
          <span className="breadcrumb-current">
            {adminNavigation.find(([k]) => k === active)?.[1] || active}
          </span>
        </div>
      </div>

      <main className="content admin-content-workspace">
        <div className="page-transition" key={active}>
          {active === "Dashboard" && (
            <AdminDashboard
              summary={summary}
              onNavigate={(key) => navigate(`/KLEF/3-2/Admin/G-Bhaanu-Sai/${key}`)}
              onQuickCreate={handleQuickCreate}
            />
          )}

          {active === "Students" && (
            <StudentsPage
              records={records}
              filtered={filtered}
              query={query}
              setQuery={setQuery}
              loading={loadingRecords}
              status={status}
              onRefresh={load}
              onAdd={beginCreate}
              onEdit={beginEdit}
              onDelete={remove}
              onResetPassword={resetPassword}
            />
          )}

          {active === "Faculty" && (
            <FacultyPage
              records={records}
              filtered={filtered}
              query={query}
              setQuery={setQuery}
              loading={loadingRecords}
              status={status}
              onRefresh={load}
              onAdd={beginCreate}
              onEdit={beginEdit}
              onDelete={remove}
            />
          )}

          {active === "Buckets" && (
            <BucketsPage
              records={records}
              filtered={filtered}
              query={query}
              setQuery={setQuery}
              loading={loadingRecords}
              status={status}
              onRefresh={load}
              onAdd={beginCreate}
              onEdit={beginEdit}
              onDelete={remove}
            />
          )}

          {active === "Courses" && (
            <CoursesPage
              records={records}
              filtered={filtered}
              query={query}
              setQuery={setQuery}
              loading={loadingRecords}
              status={status}
              onRefresh={load}
              onAdd={beginCreate}
              onEdit={beginEdit}
              onDelete={remove}
            />
          )}

          {active === "Reset-Password" && (
            <AdminResetPasswordPage />
          )}

          {active === "My-Profile" && (
            <AdminProfilePage admin={admin} />
          )}
        </div>
      </main>

      {editing && (
        <RecordModal
          editing={editing}
          active={active}
          singularLabel={singularLabels[active]}
          fields={fields[active]}
          form={form}
          setForm={setForm}
          buckets={buckets}
          onSave={save}
          onClose={() => setEditing(null)}
        />
      )}
    </div>
  );
}
