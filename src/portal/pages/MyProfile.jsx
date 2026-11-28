import { useEffect, useState } from "react";
import DatePicker from "../components/common/DatePicker";
import PageHeading from "../components/common/PageHeading";
import PasswordInput from "../components/common/PasswordInput";
import { passwordsMatch } from "../utils/validation";
import {
  setStudentCustomPassword,
  getStudentCustomPassword,
  getStudentDateOfBirth,
  DEFAULT_STUDENT_DOB,
} from "../services/authService";
import { Check, CheckCircle2, Lock, Shield, User, KeyRound, AlertCircle, Edit3 } from "lucide-react";

export default function Profile({ studentId }) {
  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState({
    name: "Anirudh Varma",
    rollNumber: studentId || "2400030952",
    department: "Computer Science & Engineering",
    specialization: "Generative AI & Multi-modal Intelligence",
    batch: "2024-2028",
    term: "Third Year · Semester 5",
    gender: "Male",
    dateOfBirth: "2007-01-01",
    aadhaarNumber: "1234 5678 9012",
    apaarNumber: "APAAR-9876-5432",
    residencyStatus: "Hosteler",
    parentName: "K. R. Varma",
    parentPhoneNumber: "+91 98765 00000",
  });
  const [email] = useState(`${studentId}@kluniversity.in`);
  const [personalEmail, setPersonalEmail] = useState("anirudh.varma@gmail.com");
  const [mobile, setMobile] = useState("+91 98765 43210");
  const [passwordMessage, setPasswordMessage] = useState("");
  const [passwordStatus, setPasswordStatus] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [currentDob, setCurrentDob] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const save = async () => {
    setLoading(true);
    // Pure frontend state update for demonstration
    setTimeout(() => {
      setLoading(false);
      setEditing(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    }, 200);
  };

  return (
    <>
      <PageHeading
        title="My Profile"
        description="Review your verified university enrollment credentials and manage student contact information."
      />

      <div className="profile-layout">
        {/* Main Profile Information Form */}
        <section className="plain-section profile-card-main">
          <div className="section-title">
            <div className="profile-header-title">
              <div className="profile-avatar-wrap">
                <User size={24} className="text-blue-600" />
              </div>
              <div>
                <h2>Student Information</h2>
              </div>
            </div>

            {editing ? (
              <div className="profile-actions-row">
                <button
                  type="button"
                  className="secondary-btn"
                  onClick={() => setEditing(false)}
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="primary-btn"
                  onClick={save}
                  disabled={loading}
                >
                  {loading ? "Saving…" : "Save Changes"}
                </button>
              </div>
            ) : (
              <button
                type="button"
                className="secondary-btn edit-toggle-btn"
                onClick={() => setEditing(true)}
              >
                <Edit3 size={15} />
                <span>Edit Contact Details</span>
              </button>
            )}
          </div>

          <div className="profile-fields-grid">
            <div className="field-block">
              <span className="field-label">Full Name</span>
              <input disabled value={profile?.name || "Student"} readOnly className="field-input readonly" />
            </div>

            <div className="field-block">
              <span className="field-label">Student ID</span>
              <input disabled value={studentId} readOnly className="field-input readonly" />
            </div>

            <div className="field-block">
              <span className="field-label">Date of Birth</span>
              <input
                disabled
                value={
                  profile?.dateOfBirth
                    ? new Date(profile.dateOfBirth).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                      })
                    : "—"
                }
                readOnly
                className="field-input readonly"
              />
              <small className="field-help-text">Managed by Central Academic Office</small>
            </div>

            <div className="field-block">
              <span className="field-label">University Email</span>
              <input disabled value={profile?.universityEmail || email} readOnly className="field-input readonly" />
            </div>

            <div className={`field-block ${editing ? "editable-highlight" : ""}`}>
              <span className="field-label">Personal Email</span>
              <input
                disabled={!editing}
                type="email"
                value={personalEmail}
                onChange={(e) => setPersonalEmail(e.target.value)}
                placeholder="Enter personal email"
                className="field-input"
              />
            </div>

            <div className={`field-block ${editing ? "editable-highlight" : ""}`}>
              <span className="field-label">Mobile Number</span>
              <input
                disabled={!editing}
                type="tel"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                placeholder="+91 XXXXX XXXXX"
                className="field-input"
              />
            </div>

            <div className="field-block">
              <span className="field-label">Gender</span>
              <input disabled value={profile?.gender || "—"} readOnly className="field-input readonly" />
            </div>

            <div className="field-block">
              <span className="field-label">Aadhaar Number</span>
              <input disabled value={profile?.aadhaarNumber || "—"} readOnly className="field-input readonly" />
            </div>

            <div className="field-block">
              <span className="field-label">APAAR Number</span>
              <input disabled value={profile?.aapaarNumber || "—"} readOnly className="field-input readonly" />
            </div>

            <div className="field-block">
              <span className="field-label">Residential Status</span>
              <input disabled value={profile?.residencyStatus || "—"} readOnly className="field-input readonly" />
            </div>

            <div className="field-block">
              <span className="field-label">Parent / Guardian Name</span>
              <input disabled value={profile?.parentName || "—"} readOnly className="field-input readonly" />
            </div>

            <div className="field-block">
              <span className="field-label">Parent Contact Number</span>
              <input disabled value={profile?.parentPhoneNumber || "—"} readOnly className="field-input readonly" />
            </div>
          </div>
        </section>

        {/* Account Security & Password Management */}
        <aside className="account-sidebar">
          <section className="security-card">
            <div className="security-header">
              <div className="security-icon-wrap">
                <KeyRound size={20} className="text-blue-600" />
              </div>
              <div>
                <p className="eyebrow">Account Security</p>
                <h2>Change Password</h2>
              </div>
            </div>

            <p className="security-desc">
              Ensure your account is protected with a secure password containing at least 8 characters.
            </p>

            <form
              className="security-form"
              onSubmit={async (e) => {
                e.preventDefault();
                const existingPwd = getStudentCustomPassword(studentId);
                const defaultDob = getStudentDateOfBirth(studentId) || DEFAULT_STUDENT_DOB;
                
                // Validate current password (accept either previous custom password or registered DOB)
                if (existingPwd && currentPassword !== existingPwd) {
                  setPasswordStatus("error");
                  setPasswordMessage("Current password entered is incorrect.");
                  return;
                } else if (!existingPwd && currentPassword !== defaultDob && currentPassword !== "2007-01-01" && currentPassword !== "01-01-2007") {
                  setPasswordStatus("error");
                  setPasswordMessage("Current credential does not match your registered Date of Birth.");
                  return;
                }

                if (!passwordsMatch(newPassword, confirmPassword)) {
                  setPasswordStatus("error");
                  setPasswordMessage("New passwords do not match.");
                  return;
                }
                
                if (newPassword.length < 8) {
                  setPasswordStatus("error");
                  setPasswordMessage("New password must be at least 8 characters.");
                  return;
                }

                // Save custom password to persistent storage
                setStudentCustomPassword(studentId, newPassword);

                setCurrentPassword("");
                setCurrentDob("");
                setNewPassword("");
                setConfirmPassword("");
                setPasswordStatus("success");
                setPasswordMessage(
                  "Password updated successfully! Next time you sign in, you can enter your new password directly.",
                );
              }}
            >
              <div className="field-block">
                <span className="field-label">Current Password</span>
                <PasswordInput
                  value={currentPassword}
                  onChange={(event) => setCurrentPassword(event.target.value)}
                  autoComplete="current-password"
                  placeholder="Enter current credential"
                  required
                />
              </div>

              <div className="field-block">
                <span className="field-label">New Password</span>
                <PasswordInput
                  minLength={8}
                  value={newPassword}
                  onChange={(event) => setNewPassword(event.target.value)}
                  autoComplete="new-password"
                  required
                />
              </div>

              <div className="field-block">
                <span className="field-label">Confirm New Password</span>
                <PasswordInput
                  minLength={8}
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  autoComplete="new-password"
                  required
                />
              </div>

              {passwordMessage && (
                <div className={`form-feedback-pill ${passwordStatus}`} role="status">
                  {passwordStatus === "success" ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                  <span>{passwordMessage}</span>
                </div>
              )}

              <button type="submit" className="primary-btn w-full">
                <span>Update Password</span>
              </button>
            </form>
          </section>
        </aside>
      </div>
    </>
  );
}
