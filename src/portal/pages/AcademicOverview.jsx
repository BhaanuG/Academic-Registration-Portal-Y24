import { useState, useMemo } from "react";
import PageHeading from "../components/common/PageHeading";
import { findStudentById } from "../services/studentData";
import { getStudentCluster } from "../services/studentService";
import { buckets } from "../services/academicData";
import { readLocalRecord } from "../services/api";
import { getSelectionStorageKey, initialSelections } from "../services/subjectService";

export default function Overview({ studentId, goTo }) {
  // Retrieve student record dynamically from database dataset
  const student = useMemo(() => {
    return findStudentById(studentId) || {
      name: "Student",
      username: studentId || "2400030952",
      universityEmail: `${studentId}@kluniversity.in`,
      department: "CSE - Computer Science & Engineering",
      specialization: "Generative AI & Multi-Modal Intelligence",
      program: "Bachelor of Technology (B.Tech)",
      yearOfStudy: "Third Year",
      cluster: "Cluster-1",
      counselor: {
        name: "Dr. S. Srinivasa Rao",
        employeeId: "KLEF0864",
        designation: "Faculty Counselor",
        mobileNumber: "+91 998XX XX644",
        email: "counselor@kluniversity.in",
      },
    };
  }, [studentId]);

  // Read actual student cluster state
  const cluster = useMemo(() => getStudentCluster(studentId) || student.cluster || "Cluster-1", [studentId, student]);
  const selections = useMemo(() => {
    return readLocalRecord(getSelectionStorageKey(studentId), initialSelections);
  }, [studentId]);

  // Compute curriculum stats
  const selectedSubjectsList = useMemo(() => {
    return buckets
      .map((b) => b.subjects.find((s) => s.code === selections[b.id]))
      .filter(Boolean);
  }, [selections]);

  const selectedCredits = useMemo(() => {
    return selectedSubjectsList.reduce((sum, s) => sum + (s.credits || 0), 0);
  }, [selectedSubjectsList]);

  const totalBuckets = buckets.length || 8;
  const totalSubjects = buckets.reduce((acc, b) => acc + (b.subjects?.length || 0), 0) || 10;
  const electivesPending = Math.max(0, totalBuckets - selectedSubjectsList.length);

  return (
    <div className="overview-container">
      <PageHeading
        title="Academic Overview"
        description="Official university profile, active cohort allocation, and academic registration progression status."
      />

      {/* Top Split Section */}
      <div className="overview-grid">
        {/* Left Column: Academic Enrollment Identity */}
        <div className="overview-main-col">
          <section className="plain-section academic-section">
            <div className="section-title">
              <h2>Academic Enrollment Identity</h2>
            </div>

            <dl className="data-grid academic-grid">
              <div>
                <dt>Student Name</dt>
                <dd>{student.name}</dd>
              </div>
              <div>
                <dt>University Roll Number</dt>
                <dd className="font-semibold text-slate-900">{student.username}</dd>
              </div>
              <div>
                <dt>Institutional Email</dt>
                <dd>
                  <a href={`mailto:${student.universityEmail}`} className="text-blue-600 hover:underline">
                    {student.universityEmail}
                  </a>
                </dd>
              </div>
              <div>
                <dt>Department</dt>
                <dd>CSE - Computer Science & Engineering</dd>
              </div>
              <div>
                <dt>Academic Specialization</dt>
                <dd>{student.specialization || "Generative AI & Multi-Modal Intelligence"}</dd>
              </div>
              <div>
                <dt>Cohort Cluster</dt>
                <dd>{cluster.replace("Cluster ", "Cluster-")}</dd>
              </div>
              <div>
                <dt>Student Type / Track</dt>
                <dd>CRT (CSE-2)</dd>
              </div>
              <div>
                <dt>Gender</dt>
                <dd>{student.gender || "Male"}</dd>
              </div>
              <div>
                <dt>Addon Degree Track</dt>
                <dd>Specialization</dd>
              </div>
              <div>
                <dt>Current Term Level</dt>
                <dd>Third Year · Semester 6 (2026–27 EVEN)</dd>
              </div>
            </dl>
          </section>
        </div>

        {/* Right Column: Academic Counseling Panel */}
        <aside className="counselor-panel">
          <div className="counselor-header-block">
            <p className="eyebrow text-blue-600 font-semibold text-xs tracking-wider uppercase mb-1">
              Academic Counseling
            </p>
            <h2 className="text-lg font-serif font-bold text-slate-900">
              {student.counselor?.name || "Faculty Counselor"}
            </h2>
          </div>

          <dl className="counselor-grid">
            <div>
              <dt>Employee ID</dt>
              <dd className="font-semibold">{student.counselor?.employeeId || "6934"}</dd>
            </div>
            <div>
              <dt>Designation</dt>
              <dd>{student.counselor?.designation || "Faculty Counselor"}</dd>
            </div>
            <div>
              <dt>Department</dt>
              <dd>Computer Science & Engineering</dd>
            </div>
            <div>
              <dt>Contact Mobile</dt>
              <dd className="text-slate-800">
                {student.counselor?.mobileNumber || "+91 998XX XX644"}
              </dd>
            </div>
            <div>
              <dt>Contact Email</dt>
              <dd>
                <a href={`mailto:${student.counselor?.email}`} className="text-blue-600 hover:underline">
                  {student.counselor?.email || "counselor@kluniversity.in"}
                </a>
              </dd>
            </div>
          </dl>
        </aside>
      </div>

      {/* Bottom Section: Prescribed Curriculum Status */}
      <section className="curriculum-status-section">
        <div className="section-title">
          <h2>Prescribed Curriculum Status</h2>
        </div>

        <div className="curriculum-metrics-grid">
          <div className="metric-box">
            <span className="metric-title">Curriculum Buckets</span>
            <span className="metric-number text-blue-600">8</span>
          </div>

          <div className="metric-box">
            <span className="metric-title">Total Subjects</span>
            <span className="metric-number text-emerald-600">10</span>
          </div>

          <div className="metric-box">
            <span className="metric-title">Prescribed Credits</span>
            <span className="metric-number text-purple-600">30</span>
          </div>

          <div className="metric-box">
            <span className="metric-title">Electives Pending</span>
            <span className="metric-number text-amber-500">5</span>
          </div>
        </div>
      </section>
    </div>
  );
}

