import { cookies } from 'next/headers'
import { findStudentById } from '@/portal/services/studentData'

export const PORTAL_SESSION_COOKIE = 'klef_portal_session'

export async function getPortalUser() {
  const cookieStore = await cookies()
  const token = cookieStore.get(PORTAL_SESSION_COOKIE)?.value
  if (!token) return null

  if (token.startsWith('admin-session-')) {
    const adminId = token.replace('admin-session-', '')
    return {
      id: `admin-${adminId}`,
      username: adminId,
      name: 'G. Bhaanu Sai',
      role: 'admin',
    }
  }

  if (token.startsWith('student-session-')) {
    const studentId = token.replace('student-session-', '')
    const student = findStudentById(studentId)
    if (student) {
      return {
        id: `student-${student.username}`,
        username: student.username,
        name: student.name,
        role: 'student',
        cluster: student.cluster,
        department: student.department,
        specialization: student.specialization,
      }
    }
    return {
      id: `student-${studentId}`,
      username: studentId,
      name: `Student ${studentId}`,
      role: 'student',
      cluster: 'Cluster 2',
    }
  }

  return null
}

