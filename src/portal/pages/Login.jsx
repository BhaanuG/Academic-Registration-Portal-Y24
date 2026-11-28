import { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router";
import Brand from "../components/common/Brand";
import DatePicker from "../components/common/DatePicker";
import PasswordInput from "../components/common/PasswordInput";
import PortalFooter from "../components/layout/PortalFooter";
import { useAuth } from "../hooks/useAuth";
import {
  createSession,
  rememberDateOfBirth,
  hasCustomPassword,
  verifyAdminPassword,
  verifyStudentCredential,
  isAdministratorId,
  DEFAULT_STUDENT_DOB,
} from "../services/authService";
import { findStudentById } from "../services/studentData";
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
  const isAdmin = isFull10Digits && isAdministratorId(studentId);
  const studentHasCustomPassword = useMemo(() => {
    if (!isFull10Digits || isAdmin) return false;
    return hasCustomPassword(studentId);
  }, [studentId, isFull10Digits, isAdmin]);

  // Determine credential input mode dynamically:
  // 1. Admin ID: password field
  // 2. Student ID with changed custom password: password field
  // 3. Student ID with default credentials: DOB calendar picker
  const requiresPassword = isAdmin || studentHasCustomPassword;

  const submit = async (event) => {
    event.preventDefault();
    if (!isValidStudentId(studentId)) {
      return setError("University ID must contain exactly 10 digits.");
    }

    if (isAdmin) {
      if (!password) return setError("Enter the administrator password.");
      const isCorrect = await verifyAdminPassword(password);
      if (!isCorrect) return setError("The administrator password entered is incorrect.");

      setError("");
      createSession(studentId, "admin");
      signIn(studentId);
      navigate("/KLEF/3-2/Admin/G-Bhaanu-Sai/Dashboard");
      return;
    }

    // Student Authentication via secure cryptographic hash
    const foundStudent = findStudentById(studentId);
    if (!foundStudent) {
      return setError("Student ID not found in enrolled records. Please verify your ID.");
    }

    if (studentHasCustomPassword) {
      if (!password) return setError("Enter your account password.");
      const valid = await verifyStudentCredential(studentId, password, true);
      if (!valid) {
        return setError("Incorrect password. Please enter the password configured in your profile.");
      }
    } else {
      if (!dateOfBirth) {
        return setError("Select your date of birth using the calendar.");
      }
      const valid = await verifyStudentCredential(studentId, dateOfBirth, false);
      if (!valid) {
        return setError(
          "The entered Date of Birth does not match university records (Default: 01 Jan 2007)."
        );
      }
    }

    setError("");
    createSession(studentId, "student");
    const formattedRouteName = (foundStudent.name || "Student").trim().replace(/\s+/g, "-");
    if (dateOfBirth) rememberDateOfBirth(studentId, dateOfBirth);
    signIn(studentId);
    navigate(portalPath(studentId, formattedRouteName, "overview"));
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
            <p className="eyebrow">{isAdmin ? "Admin Access" : "Student Access"}</p>
            <h2>Sign in to continue</h2>
            <p className="muted">
              Enter your 10-digit university {isAdmin ? "Admin ID" : "Student ID"} and registered credential.
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
                    const clean = e.target.value.replace(/\D/g, "");
                    setStudentId(clean);
                    setPassword("");
                    setDateOfBirth("");
                    setError("");
                  }}
                  placeholder="Enter 10-digit ID"
                />
                <small>
                  {isAdmin
                    ? "Administrator identified · Enter password below"
                    : isFull10Digits
                    ? studentHasCustomPassword
                      ? "Custom password enabled · Enter your updated account password"
                      : "Default credential: Date of Birth (01 Jan 2007)"
                    : "Enter your 10-digit university ID"}
                </small>
              </label>

              <div
                className="credential-state"
                key={requiresPassword ? "password-mode" : "dob-calendar-mode"}
              >
                {requiresPassword ? (
                  <label>
                    Password
                    <PasswordInput
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      placeholder="Enter account password"
                      autoComplete="current-password"
                      required
                    />
                    <small>
                      {isAdmin
                        ? "Enter your secure administrator credential"
                        : "Enter the custom password set in your profile"}
                    </small>
                  </label>
                ) : (
                  <label className="date-login-field">
                    Date of birth (Password)
                    <DatePicker
                      label="Select DOB"
                      value={dateOfBirth}
                      onChange={setDateOfBirth}
                    />
                    <small>Default DOB: 01 January 2007 (Select from calendar)</small>
                  </label>
                )}
              </div>

              {error && <p className="form-error">{error}</p>}

              <button className="primary-btn wide" type="submit">
                Sign in
              </button>
            </form>

            <div className="login-help">
              <span>Forgot password or cannot sign in?</span>
              <Link to="/reset-password">Reset password</Link>
            </div>
          </div>
        </section>
      </main>
      <PortalFooter returnTo="/" />
    </div>
  );
}
