/**
 * Authentication and Credential Management Service
 * Supports:
 * - Default DOB for students: 01 Jan 2007 ("2007-01-01")
 * - Custom password support if student has updated their password
 * - Dynamic credential mode detection (password vs DOB calendar)
 */

const SESSION_KEY = "klef-demo-session";
const ROLE_KEY = "klef-demo-role";
const PASSWORDS_STORAGE_KEY = "klef-student-passwords";
export const DEFAULT_STUDENT_DOB = "2007-01-01"; // 01 Jan 2007

export function getAuthenticatedStudent() {
  return sessionStorage.getItem(SESSION_KEY);
}

export function createSession(identifier, role = "student") {
  sessionStorage.setItem(SESSION_KEY, identifier);
  sessionStorage.setItem(ROLE_KEY, role);
}

export function clearSession() {
  sessionStorage.removeItem(SESSION_KEY);
  sessionStorage.removeItem(ROLE_KEY);
}

// Student custom password mapping
export function getStudentCustomPassword(studentId) {
  if (!studentId) return null;
  try {
    const map = JSON.parse(localStorage.getItem(PASSWORDS_STORAGE_KEY) || "{}");
    return map[studentId] || null;
  } catch {
    return null;
  }
}

export function setStudentCustomPassword(studentId, newPassword) {
  if (!studentId) return;
  try {
    const map = JSON.parse(localStorage.getItem(PASSWORDS_STORAGE_KEY) || "{}");
    map[studentId] = newPassword;
    localStorage.setItem(PASSWORDS_STORAGE_KEY, JSON.stringify(map));
  } catch (e) {
    console.error("Failed to store password:", e);
  }
}

export function hasCustomPassword(studentId) {
  return Boolean(getStudentCustomPassword(studentId));
}

// Student custom or default Date of Birth
export function getStudentDateOfBirth(studentId) {
  if (!studentId) return DEFAULT_STUDENT_DOB;
  try {
    const localStudents = JSON.parse(localStorage.getItem("klef-admin-students") || "[]");
    const found = localStudents.find((s) => s.username === studentId || s.id === studentId);
    if (found && found.dateOfBirth) return found.dateOfBirth;
  } catch {
    // fallback
  }
  return sessionStorage.getItem(`klef-demo-dob-${studentId}`) || DEFAULT_STUDENT_DOB;
}

export function rememberDateOfBirth(studentId, dateOfBirth) {
  sessionStorage.setItem(`klef-demo-dob-${studentId}`, dateOfBirth || DEFAULT_STUDENT_DOB);
}

export function getRememberedDateOfBirth(studentId) {
  return sessionStorage.getItem(`klef-demo-dob-${studentId}`) || DEFAULT_STUDENT_DOB;
}

export async function requestPasswordReset(studentId) {
  // Clear any custom password so it defaults back to DOB
  try {
    const map = JSON.parse(localStorage.getItem(PASSWORDS_STORAGE_KEY) || "{}");
    delete map[studentId];
    localStorage.setItem(PASSWORDS_STORAGE_KEY, JSON.stringify(map));
  } catch {}

  return {
    studentId,
    success: true,
    isDevelopmentMode: true,
    note: "Password reset successful. Account credential has been reset to default Date of Birth (01 Jan 2007).",
  };
}
