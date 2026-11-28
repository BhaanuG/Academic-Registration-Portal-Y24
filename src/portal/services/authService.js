/**
 * Secure Authentication & Credential Verification Service
 * - Passwords are verified using SHA-256 cryptographic hashing (zero plaintext comparisons)
 * - Admin credentials verified against secure hash
 * - Student initial credentials verified against hashed default DOB 2007-01-01
 * - Student customized passwords hashed before storage
 */

import { findStudentById, getAllStudents } from "./studentData";

const SESSION_KEY = "klef-demo-session";
const ROLE_KEY = "klef-demo-role";
const PASSWORDS_STORAGE_KEY = "klef-student-passwords";
export const DEFAULT_STUDENT_DOB = "2007-01-01"; // 01 Jan 2007

// Admin account hash corresponding to the portal admin credentials in SQL
// username: 8897337687, password: SHA-256 hash (no plaintext in codebase)
const ADMIN_USERNAME = "8897337687";
const ADMIN_PASSWORD_HASH = "80f1e846069e2cb0ff8ff1e78c8be379bc031b4e18fe8616f082e668c226227b";

export async function sha256(message) {
  if (!message) return "";
  const msgUint8 = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

export function isAdministratorId(identifier) {
  return identifier === ADMIN_USERNAME;
}

export function getAdminId() {
  return ADMIN_USERNAME;
}

export async function verifyAdminPassword(inputPassword) {
  if (!inputPassword) return false;
  const hash = await sha256(inputPassword);
  return hash === ADMIN_PASSWORD_HASH;
}

export const verifyAdminCredential = verifyAdminPassword;


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

// Student custom password mapping (stored only as SHA-256 hashes)
export function getStudentCustomPasswordHash(studentId) {
  if (!studentId) return null;
  try {
    const map = JSON.parse(localStorage.getItem(PASSWORDS_STORAGE_KEY) || "{}");
    return map[studentId] || null;
  } catch {
    return null;
  }
}

export async function setStudentCustomPassword(studentId, newPassword) {
  if (!studentId || !newPassword) return;
  try {
    const hash = await sha256(newPassword);
    const map = JSON.parse(localStorage.getItem(PASSWORDS_STORAGE_KEY) || "{}");
    map[studentId] = hash;
    localStorage.setItem(PASSWORDS_STORAGE_KEY, JSON.stringify(map));
  } catch (e) {
    console.error("Failed to store password hash:", e);
  }
}

export function hasCustomPassword(studentId) {
  return Boolean(getStudentCustomPasswordHash(studentId));
}

export async function verifyStudentCredential(studentId, inputCredential, isPasswordMode) {
  if (!studentId || !inputCredential) return false;
  const inputHash = await sha256(inputCredential);
  const customHash = getStudentCustomPasswordHash(studentId);

  if (isPasswordMode) {
    // If student set custom password, check custom hash
    if (customHash) {
      return inputHash === customHash;
    }
  }

  // DOB mode (or initial default check): check against student record or default DOB hash
  const student = findStudentById(studentId);
  const studentDob = student?.dateOfBirth || DEFAULT_STUDENT_DOB;
  const dobHash = await sha256(studentDob);
  return inputHash === dobHash;
}

// Student custom or default Date of Birth
export function getStudentDateOfBirth(studentId) {
  if (!studentId) return DEFAULT_STUDENT_DOB;
  const student = findStudentById(studentId);
  if (student && student.dateOfBirth) return student.dateOfBirth;

  try {
    const localStudents = JSON.parse(localStorage.getItem("klef-admin-students") || "[]");
    const found = localStudents.find((s) => s.username === studentId || s.id === studentId);
    if (found && found.dateOfBirth) return found.dateOfBirth;
  } catch {}

  return sessionStorage.getItem(`klef-demo-dob-${studentId}`) || DEFAULT_STUDENT_DOB;
}

export function rememberDateOfBirth(studentId, dateOfBirth) {
  sessionStorage.setItem(`klef-demo-dob-${studentId}`, dateOfBirth || DEFAULT_STUDENT_DOB);
}

export function getRememberedDateOfBirth(studentId) {
  return sessionStorage.getItem(`klef-demo-dob-${studentId}`) || DEFAULT_STUDENT_DOB;
}

export async function requestPasswordReset(studentId) {
  try {
    const map = JSON.parse(localStorage.getItem(PASSWORDS_STORAGE_KEY) || "{}");
    delete map[studentId];
    localStorage.setItem(PASSWORDS_STORAGE_KEY, JSON.stringify(map));
  } catch {}

  return {
    studentId,
    success: true,
    note: "Password reset successful. Account credential has been reset to default Date of Birth (01 Jan 2007).",
  };
}
