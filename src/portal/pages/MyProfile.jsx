import { useEffect, useState, useMemo } from "react";
import PageHeading from "../components/common/PageHeading";
import PasswordInput from "../components/common/PasswordInput";
import { passwordsMatch } from "../utils/validation";
import { findStudentById } from "../services/studentData";
import {
  setStudentCustomPassword,
  getStudentCustomPasswordHash,
  verifyStudentCredential,
  DEFAULT_STUDENT_DOB,
} from "../services/authService";
import { CheckCircle2, User, KeyRound, AlertCircle, Edit3 } from "lucide-react";

export default function Profile({ studentId }) {
  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  // Load registered student information from data service
  const student = useMemo(() => {
    return findStudentById(studentId) || {
      name: "Student",
      username: studentId || "2400030952",
      department: "Computer Science & Engineering",
      specialization: "Generative AI & Multi-modal Intelligence",
      batch: "2024-2028",
      yearOfStudy: "3rd Year",
      gender: "Male",
      dateOfBirth: DEFAULT_STUDENT_DOB,
      aadhaarNumber: "—",
      apaarNumber: "—",
      residencyStatus: "Day Scholar",
      parentName: "—",
      parentPhoneNumber: "—",
      universityEmail: `${studentId}@kluniversity.in`,
      personalEmail: `${studentId}@gmail.com`,
      mobileNumber: "—",
    };
  }, [studentId]);

  const [personalEmail, setPersonalEmail] = useState(student.personalEmail || `${studentId}@gmail.com`);
  const [mobile, setMobile] = useState(student.mobileNumber || "");
  const [passwordMessage, setPasswordMessage] = useState("");
  const [passwordStatus, setPasswordStatus] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    if (student.personalEmail) setPersonalEmail(student.personalEmail);
    if (student.mobileNumber) setMobile(student.mobileNumber);
  }, [student]);

  const save = async () => {
    setLoading(true);
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
              <input disabled value={student.name} readOnly className="field-input readonly" />
            </div>

            <div className="field-block">
              <span className="field-label">Student ID</span>
              <input disabled value={student.username} readOnly className="field-input readonly" />
            </div>

            <div className="field-block">
              <span className="field-label">Date of Birth</span>
              <input
                disabled
                value={
                  student.dateOfBirth
                    ? new Date(student.dateOfBirth).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                      })
                    : "01 January 2007"
                }
                readOnly
                className="field-input readonly"
              />
              <small className="field-help-text">Managed by Central Academic Office</small>
            </div>

            <div className="field-block">
              <span className="field-label">University Email</span>
              <input disabled value={student.universityEmail} readOnly className="field-input readonly" />
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
              <input disabled value={student.gender || "—"} readOnly className="field-input readonly" />
            </div>

            <div className="field-block">
              <span className="field-label">Department</span>
              <input disabled value={student.department || "CSE-2"} readOnly className="field-input readonly" />
            </div>

            <div className="field-block">
              <span className="field-label">Specialization</span>
              <input disabled value={student.specialization && student.specialization.trim() ? student.specialization : "—"} readOnly className="field-input readonly font-medium text-blue-800" />
            </div>

            <div className="field-block">
              <span className="field-label">Residential Status</span>
              <input disabled value={student.residencyStatus || "Day Scholar"} readOnly className="field-input readonly" />
            </div>

            <div className="field-block">
              <span className="field-label">Parent / Guardian Name</span>
              <input disabled value={student.parentName || "—"} readOnly className="field-input readonly" />
            </div>

            <div className="field-block">
              <span className="field-label">Parent Contact Number</span>
              <input disabled value={student.parentPhoneNumber || "—"} readOnly className="field-input readonly" />
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
                const hasCustom = Boolean(getStudentCustomPasswordHash(studentId));
                
                // Cryptographically verify current credential (hash check)
                const isValid = await verifyStudentCredential(studentId, currentPassword, hasCustom);
                if (!isValid) {
                  setPasswordStatus("error");
                  setPasswordMessage(
                    hasCustom
                      ? "Current password entered is incorrect."
                      : "Current credential does not match your registered Date of Birth (YYYY-MM-DD)."
                  );
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

                // Store hashed password securely
                await setStudentCustomPassword(studentId, newPassword);

                setCurrentPassword("");
                setNewPassword("");
                setConfirmPassword("");
                setPasswordStatus("success");
                setPasswordMessage(
                  "Password updated successfully! It has been hashed and stored. You can use it on your next login.",
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
