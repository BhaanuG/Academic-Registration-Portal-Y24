import studentsList from "./studentsDataset.json";

// Map indexed by student_id for fast lookup
export const studentsMap = new Map();
studentsList.forEach((s) => {
  studentsMap.set(s.username, s);
});

export function getAllStudents() {
  return studentsList;
}

export function findStudentById(studentId) {
  if (!studentId) return null;
  return studentsMap.get(studentId) || null;
}
