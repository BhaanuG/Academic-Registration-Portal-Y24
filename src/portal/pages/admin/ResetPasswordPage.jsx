import { useState, useEffect } from "react";
import {
  KeyRound,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Calendar,
  Building,
  Mail,
  Search,
  AlertTriangle,
} from "lucide-react";
import DatePicker from "../../components/common/DatePicker";

export default function AdminResetPasswordPage() {
  const [identifier, setIdentifier] = useState("");
  const [matchedAccount, setMatchedAccount] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [notFound, setNotFound] = useState(false);

  // Password field for student DOB reset
  const [dobPassword, setDobPassword] = useState("");

  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Perform search / lookup when identifier changes
  useEffect(() => {
    const cleanId = identifier.trim();
    if (!cleanId) {
      setMatchedAccount(null);
      setNotFound(false);
      setDobPassword("");
      setMessage(null);
      return;
    }

    setIsSearching(true);
    setNotFound(false);

    // Look up student from localStorage first, then remote
    const localStudents = JSON.parse(localStorage.getItem("klef-admin-students") || "[]");
    let found = localStudents.find(
      (s) => s.username === cleanId || s.universityEmail?.toLowerCase() === cleanId.toLowerCase()
    );

    if (found) {
      setMatchedAccount({
        id: found.id || found.username,
        type: "student",
        identifier: found.username,
        name: found.name || "Student",
        email: found.universityEmail || `${found.username}@kluniversity.in`,
        department: "Computer Science & Engineering",
        cluster: found.cluster || "Cluster 2",
        dateOfBirth: found.dateOfBirth || "2007-01-01",
        counselor: found.counselor?.name || "Dr. S. Srinivasa Rao",
      });
      setDobPassword(found.dateOfBirth || "2007-01-01");
      setIsSearching(false);
    } else {
      // Check local storage records or default student record
      const localStudents = JSON.parse(localStorage.getItem("klef-admin-students") || "[]");
      const remoteStudent = localStudents.find(
        (s) => s.username === cleanId || s.universityEmail?.toLowerCase() === cleanId.toLowerCase()
      );
      if (remoteStudent || cleanId === "2400030952") {
        const studentRecord = remoteStudent || {
          id: "student-2400030952",
          username: "2400030952",
          name: "Anirudh Varma",
          universityEmail: "2400030952@kluniversity.in",
          cluster: "Cluster 2",
          dateOfBirth: "2007-01-01",
        };
        setMatchedAccount({
          id: studentRecord.id || studentRecord.username,
          type: "student",
          identifier: studentRecord.username,
          name: studentRecord.name || "Student",
          email: studentRecord.universityEmail || `${studentRecord.username}@kluniversity.in`,
          department: "Computer Science & Engineering",
          cluster: studentRecord.cluster || "Cluster 2",
          dateOfBirth: studentRecord.dateOfBirth || "2007-01-01",
          counselor: "Dr. S. Srinivasa Rao",
        });
        setDobPassword(studentRecord.dateOfBirth || "2007-01-01");
      } else {
        setMatchedAccount(null);
        setNotFound(true);
      }
      setIsSearching(false);
    }
  }, [identifier]);

  const canSubmit = Boolean(matchedAccount && dobPassword);

  const handleInitiateSubmit = (e) => {
    e.preventDefault();
    if (!canSubmit) return;
    setMessage(null);
    setShowConfirmModal(true);
  };

  const handleExecuteReset = async () => {
    setShowConfirmModal(false);
    setIsSubmitting(true);
    setMessage(null);

    const targetId = matchedAccount.identifier;

    try {
      // Update student record's DOB in local admin list
      const localData = JSON.parse(localStorage.getItem("klef-admin-students") || "[]");
      const updated = localData.map((s) =>
        s.username === targetId ? { ...s, dateOfBirth: dobPassword } : s
      );
      localStorage.setItem("klef-admin-students", JSON.stringify(updated));

      setMessage({
        type: "success",
        title: "Demonstration Reset Completed",
        text: `Credential updated for ${matchedAccount.name} (${targetId}) in demonstration state. (In production, password reset requires institutional backend synchronization).`,
      });
    } catch {
      setMessage({
        type: "error",
        title: "Reset Operation Failed",
        text: "Demonstration error while resetting student record.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="admin-reset-pwd-shell">
      {/* Page Header */}
      <div className="admin-records-header">
        <div>
          <span className="kicker">Access &amp; Security Controls</span>
          <h1 className="admin-page-title">Reset Student Password</h1>
          <p className="admin-page-desc">
            Authorize administrative password resets for enrolled students.
          </p>
        </div>
      </div>

      <div className="admin-reset-single-pane">
        <form onSubmit={handleInitiateSubmit} className="admin-reset-form">
          {/* Field: Student ID only */}
          <div className="admin-reset-field-group">
            <label htmlFor="account-id-input" className="admin-field-label">
              Student ID *
            </label>
            <div className="admin-field-input-wrap">
              <Search size={16} className="admin-field-icon" />
              <input
                id="account-id-input"
                type="text"
                placeholder="Enter Student ID"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                className="admin-text-input"
                required
                autoComplete="off"
              />
              {isSearching && <RefreshCw size={14} className="admin-field-spinner animate-spin" />}
            </div>
            <span className="admin-field-helper">
              Enter the student's 10-digit roll number to retrieve student records.
            </span>
          </div>

          {/* Target Account Identification Card */}
          {matchedAccount && (
            <div className="admin-account-card">
              <div className="admin-account-details">
                <div className="admin-account-head">
                  <strong className="admin-account-name">{matchedAccount.name}</strong>
                  <span className="admin-account-id-chip">{matchedAccount.identifier}</span>
                </div>
                <div className="admin-account-meta-grid">
                  <div className="admin-meta-item">
                    <Mail size={12} className="text-slate-400" />
                    <span>{matchedAccount.email}</span>
                  </div>
                  <div className="admin-meta-item">
                    <Building size={12} className="text-slate-400" />
                    <span>{matchedAccount.department}</span>
                  </div>
                  {matchedAccount.cluster && (
                    <div className="admin-meta-item">
                      <span className="admin-mini-chip">{matchedAccount.cluster}</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="admin-account-verified" title="Account Verified">
                <CheckCircle size={18} className="text-emerald-600" />
              </div>
            </div>
          )}

          {/* Not Found Warning */}
          {notFound && identifier.trim().length >= 3 && !matchedAccount && (
            <div className="admin-not-found-banner">
              <AlertCircle size={16} />
              <span>No registered student record matches "{identifier}". Please verify the ID.</span>
            </div>
          )}

          {/* Student DOB Policy DatePicker */}
          <div className="admin-reset-field-group">
            <label className="admin-field-label">
              Institutional Policy: Reset to Date of Birth (YYYY-MM-DD) *
            </label>
            <div className="admin-datepicker-wrapper">
              <DatePicker
                value={dobPassword}
                onChange={(val) => setDobPassword(val)}
                label="Date of Birth"
              />
            </div>
            {dobPassword && (
              <div className="admin-dob-preview">
                <Calendar size={14} className="text-amber-700" />
                <span>
                  Target credential will be reset to: <strong>{dobPassword}</strong>
                </span>
              </div>
            )}
          </div>

          {/* Status Alert Banner */}
          {message && (
            <div
              className={`admin-feedback-banner ${
                message.type === "success" ? "feedback-success" : "feedback-error"
              }`}
            >
              {message.type === "success" ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
              <div className="admin-feedback-body">
                <strong>{message.title}</strong>
                <p>{message.text}</p>
              </div>
            </div>
          )}

          {/* Form Actions */}
          <div className="admin-reset-actions">
            <button
              type="button"
              className="secondary-btn"
              onClick={() => {
                setIdentifier("");
                setMatchedAccount(null);
                setDobPassword("");
                setMessage(null);
              }}
              disabled={isSubmitting || (!identifier && !message)}
            >
              Clear Form
            </button>

            <button
              type="submit"
              className="primary-btn"
              disabled={isSubmitting || !canSubmit}
              style={{
                opacity: canSubmit ? 1 : 0.6,
                cursor: canSubmit ? "pointer" : "not-allowed",
              }}
            >
              <RefreshCw size={16} className={isSubmitting ? "animate-spin" : ""} />
              <span>{isSubmitting ? "Applying Reset…" : "Confirm Password Reset"}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && matchedAccount && (
        <div className="student-detail-drawer-scrim" onClick={() => setShowConfirmModal(false)}>
          <div
            className="admin-confirm-dialog"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <div className="admin-confirm-header">
              <div className="admin-confirm-icon-wrap">
                <AlertTriangle size={24} className="text-amber-600" />
              </div>
              <div>
                <h2>Confirm Credential Reset</h2>
                <p>This administrative action will immediately alter authentication credentials.</p>
              </div>
            </div>

            <div className="admin-confirm-body">
              <div className="admin-confirm-summary-box">
                <div className="admin-confirm-row">
                  <span>Target Student:</span>
                  <strong>{matchedAccount.name}</strong>
                </div>
                <div className="admin-confirm-row">
                  <span>Student ID:</span>
                  <strong>{matchedAccount.identifier}</strong>
                </div>
                <div className="admin-confirm-row">
                  <span>New Credential:</span>
                  <strong className="font-mono text-amber-800">{dobPassword}</strong>
                </div>
              </div>
              <p className="admin-confirm-disclaimer">
                The student will authenticate using this Date of Birth on their next login.
              </p>
            </div>

            <div className="admin-confirm-actions">
              <button
                type="button"
                className="secondary-btn"
                onClick={() => setShowConfirmModal(false)}
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="button"
                className="primary-btn danger-override"
                onClick={handleExecuteReset}
                disabled={isSubmitting}
              >
                <KeyRound size={16} />
                <span>Confirm &amp; Overwrite Password</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
