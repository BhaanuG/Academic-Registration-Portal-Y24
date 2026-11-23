import { useState } from "react";
import { Link, useNavigate } from "react-router";
import Brand from "../components/common/Brand";
import DatePicker from "../components/common/DatePicker";
import PasswordInput from "../components/common/PasswordInput";
import PortalFooter from "../components/layout/PortalFooter";
import { useAuth } from "../hooks/useAuth";
import { createSession, rememberDateOfBirth } from "../services/authService";
import { portalPath } from "../utils/routes";
import { isValidStudentId } from "../utils/validation";
export default function Login() {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [studentId, setStudentId] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const isFull10Digits = studentId.length === 10;
  const isAdmin = isFull10Digits && studentId === "8897337687";
  const now = new Date();
  const isEvenSemester = now.getMonth() === 11 || (now.getMonth() === 10 && now.getDate() >= 30);
  const submit = async (event) => {
    event.preventDefault();
    if (!isValidStudentId(studentId)) return setError("Student ID must contain exactly 10 digits.");
    if (isAdmin && !password) return setError("Enter the administrator password.");
    if (isAdmin && password !== "Janu@143") return setError("The administrator password entered is incorrect.");
    if (!isAdmin && !dateOfBirth) {
      return setError("Select your date of birth to continue.");
    }
    // Demonstration-only frontend authentication
    setError("");
    if (isAdmin) {
      createSession(studentId, "admin");
      signIn(studentId);
      navigate("/KLEF/3-2/Admin/G-Bhaanu-Sai/Dashboard");
      return;
    }

    createSession(studentId, "student");
    const demoStudentName = "Anirudh-Varma";
    if (dateOfBirth) rememberDateOfBirth(studentId, dateOfBirth);
    signIn(studentId);
    navigate(portalPath(studentId, demoStudentName, "overview"));
  };
  return (
    <div className="login-page">
      <main className="login-shell">
        <section className="login-context">
          <Brand />
          <div className="login-intro">
            <p className="eyebrow">CSE-2 · Academic Year 2026–27</p>
            <h1>Academic Registration Portal</h1>
            <p>
              Select semester subjects, record faculty preferences, and maintain your student
              profile in one focused academic workspace.
            </p>
          </div>
          <div className="term-note">
            <span>Current registration period</span>
            <strong>Semester 6 • Even semester</strong>
          </div>
        </section>
        <section className="login-panel">
          <div className="login-form-wrap">
            <div className="mobile-brand">
              <Brand />
            </div>
            <p className="eyebrow">{isAdmin ? "Admin Access" : "Student access"}</p>
            <h2>Sign in to continue</h2>
            <p className="muted">
              Enter your university {isAdmin ? "Admin ID" : "Student ID"} and registered credential.
            </p>
            <form onSubmit={submit} className="login-form">
              <label>
                {isAdmin ? "Admin ID" : "Student ID"}
                <input
                  inputMode="numeric"
                  autoComplete="username"
                  maxLength={10}
                  value={studentId}
                  onChange={(e) => {
                    setStudentId(e.target.value.replace(/\D/g, ""));
                    setPassword("");
                    setDateOfBirth("");
                  }}
                  placeholder="Enter 10-digit ID"
                />
                <small>
                  {isAdmin
                    ? "Administrator identified · Enter password below"
                    : "Enter your 10-digit university ID"}
                </small>
              </label>
              <div className="credential-state" key={isAdmin ? "password" : "date-of-birth"}>
                {isAdmin ? (
                  <label>
                    Password
                    <PasswordInput
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      placeholder="Enter your account password"
                      autoComplete="current-password"
                      required
                    />
                    <small>Enter your secure administrator credential.</small>
                  </label>
                ) : (
                  <label className="date-login-field">
                    Date of birth
                    <DatePicker
                      label="Registered DOB"
                      value={dateOfBirth}
                      onChange={setDateOfBirth}
                    />
                    <small>Select the registered date in DD Month name YYYY format</small>
                  </label>
                )}
              </div>
              {error && <p className="form-error">{error}</p>}
              <button className="primary-btn wide" type="submit">
                Sign in
              </button>
            </form>
            <div className="login-help">
              <span>Demonstration portal · Development access</span>
              <Link to="/reset-password">Reset password</Link>
            </div>
          </div>
        </section>
      </main>
      <PortalFooter returnTo="/" />
    </div>
  );
}
