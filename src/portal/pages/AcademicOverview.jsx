import { useState, useMemo } from "react";
import PageHeading from "../components/common/PageHeading";
import { findStudentById } from "../services/studentData";
import { getStudentCluster } from "../services/studentService";
import { buckets } from "../services/academicData";
import { readLocalRecord } from "../services/api";
import { loadPreferences } from "../services/preferenceService";
import { getSelectionStorageKey, initialSelections } from "../services/subjectService";
import {
  BookOpen,
  UserCheck,
  CheckCircle2,
  CalendarDays,
  ShieldCheck,
  Building,
  GraduationCap,
  Calendar,
  Compass,
} from "lucide-react";

export default function Overview({ studentId, goTo }) {
  // Retrieve student record dynamically from database dataset
  const student = useMemo(() => {
    return findStudentById(studentId) || {
      name: "Student",
      username: studentId || "2400030952",
      universityEmail: `${studentId}@kluniversity.in`,
      department: "Computer Science & Engineering - 2",
      specialization: "Generative AI & Multi-modal Intelligence",
      program: "Bachelor of Technology (B.Tech)",
      yearOfStudy: "3rd Year",
      cluster: "Cluster 2",
      counselor: {
        name: "Dr. S. Srinivasa Rao",
        employeeId: "KLEF0864",
        designation: "Associate Professor",
        mobileNumber: "9876541111",
        email: "s.rao@kluniversity.in",
      },
    };
  }, [studentId]);

  // Read actual student cluster state
  const cluster = useMemo(() => getStudentCluster(studentId) || student.cluster || "Cluster 2", [studentId, student]);
  const selections = useMemo(() => {
    return readLocalRecord(getSelectionStorageKey(studentId), initialSelections);
  }, [studentId]);
  const preferences = useMemo(() => loadPreferences(studentId), [studentId]);

  // Compute actual progress metrics
  const selectedSubjectsList = useMemo(() => {
    return buckets
      .map((b) => b.subjects.find((s) => s.code === selections[b.id]))
      .filter(Boolean);
  }, [selections]);

  const selectedCredits = useMemo(() => {
    return selectedSubjectsList.reduce((sum, s) => sum + (s.credits || 0), 0);
  }, [selectedSubjectsList]);

  const totalBuckets = buckets.length || 7;
  const isSubjectSelectionComplete = selectedSubjectsList.length >= totalBuckets;

  const rankedSubjectsCount = useMemo(() => {
    const set = new Set();
    Object.keys(preferences).forEach((key) => {
      const separator = key.indexOf("-");
      if (separator !== -1) {
        set.add(key.slice(0, separator));
      }
    });
    return set.size;
  }, [preferences]);

  return (
    <div className="overview-container">
      <PageHeading
        title="Academic Overview"
        description="Official university profile, active cohort allocation, and academic registration progression status."
      />

      {/* Main Content Layout Grid */}
      <div className="overview-grid">
        {/* Left Column: Official Academic Credentials */}
        <div className="overview-main-col">
          <section className="plain-section academic-section">
            <div className="section-title">
              <div>
                <h2>Academic Enrollment Identity</h2>
              </div>
              <span className="read-only">Registrar Managed</span>
            </div>

            <dl className="data-grid academic-grid">
              <div>
                <dt>Student Name</dt>
                <dd>{student.name}</dd>
              </div>
              <div>
                <dt>University Roll Number</dt>
                <dd className="font-mono">{student.username}</dd>
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
                <dt>Department / Branch</dt>
                <dd>{student.department || "Computer Science & Engineering - 2"}</dd>
              </div>
              <div>
                <dt>Academic Specialization</dt>
                <dd className="text-blue-700 font-semibold">{student.specialization || "Generative AI & Multi-modal Intelligence"}</dd>
              </div>
              <div>
                <dt>Program &amp; Degree</dt>
                <dd>{student.program || "Bachelor of Technology (B.Tech)"}</dd>
              </div>
              <div>
                <dt>Academic Batch</dt>
                <dd>2024–2028</dd>
              </div>
              <div>
                <dt>Current Term Level</dt>
                <dd>{student.yearOfStudy || "Third Year"} · Semester 6</dd>
              </div>
            </dl>
          </section>
        </div>

        {/* Right Column: Assigned Faculty Counselor Panel */}
        <aside className="counselor-panel">
          <p className="eyebrow">Academic Counseling</p>
          <h2>{student.counselor?.name || "Dr. S. Srinivasa Rao"}</h2>
          <dl>
            <div>
              <dt>Employee ID</dt>
              <dd className="font-mono">{student.counselor?.employeeId || "KLEF0864"}</dd>
            </div>
            <div>
              <dt>Designation</dt>
              <dd>{student.counselor?.designation || "Associate Professor"}</dd>
            </div>
            <div>
              <dt>Direct Contact</dt>
              <dd>
                <a href={`tel:${student.counselor?.mobileNumber || "9876541111"}`} className="text-blue-600 hover:underline">
                  {student.counselor?.mobileNumber || "9876541111"}
                </a>
              </dd>
            </div>
            <div>
              <dt>Counselor Email</dt>
              <dd>
                <a href={`mailto:${student.counselor?.email || "counselor@kluniversity.in"}`} className="text-blue-600 hover:underline">
                  {student.counselor?.email || "counselor@kluniversity.in"}
                </a>
              </dd>
            </div>
          </dl>
        </aside>
      </div>

      {/* Bottom Row: Active Progress Cards */}
      <div className="overview-cards">
        <article className="overview-card group hover:border-blue-400 transition-all shadow-sm">
          <div className="card-top">
            <span className="card-tag">Cohort Allocation</span>
            <div className="card-icon-wrap bg-blue-50 text-blue-700">
              <Compass size={20} />
            </div>
          </div>
          <p className="cluster-label">Assigned Cluster</p>
          <div className="cluster-val text-blue-900 font-bold tracking-tight">{cluster}</div>
          <p className="cluster-desc text-slate-600">
            Assigned scheduling cohort determining bucket priorities.
          </p>
          <button
            type="button"
            className="secondary-btn w-full mt-4 flex items-center justify-center gap-1.5"
            onClick={() => goTo("cluster")}
          >
            <span>Review Cohort</span>
          </button>
        </article>

        <article className="overview-card group hover:border-amber-400 transition-all shadow-sm">
          <div className="card-top">
            <span className="card-tag">Curriculum Election</span>
            <div className="card-icon-wrap bg-amber-50 text-amber-700">
              <BookOpen size={20} />
            </div>
          </div>
          <p className="cluster-label">Total Credits Selected</p>
          <div className="cluster-val text-amber-900 font-bold tracking-tight">
            {selectedCredits} / 25
          </div>
          <p className="cluster-desc text-slate-600">
            {isSubjectSelectionComplete
              ? "All required buckets selected."
              : `${selectedSubjectsList.length} of ${totalBuckets} curriculum buckets currently chosen.`}
          </p>
          <button
            type="button"
            className="secondary-btn w-full mt-4 flex items-center justify-center gap-1.5"
            onClick={() => goTo("subjects")}
          >
            <span>{isSubjectSelectionComplete ? "Modify Selections" : "Select Courses"}</span>
          </button>
        </article>

        <article className="overview-card group hover:border-emerald-400 transition-all shadow-sm">
          <div className="card-top">
            <span className="card-tag">Faculty Priority</span>
            <div className="card-icon-wrap bg-emerald-50 text-emerald-700">
              <UserCheck size={20} />
            </div>
          </div>
          <p className="cluster-label">Preferences Recorded</p>
          <div className="cluster-val text-emerald-900 font-bold tracking-tight">
            {rankedSubjectsCount} / {totalBuckets}
          </div>
          <p className="cluster-desc text-slate-600">
            {rankedSubjectsCount >= totalBuckets
              ? "Faculty preferences recorded across subjects."
              : "Rank your preferred faculty instructors."}
          </p>
          <button
            type="button"
            className="secondary-btn w-full mt-4 flex items-center justify-center gap-1.5"
            onClick={() => goTo("preferences")}
          >
            <span>{rankedSubjectsCount >= totalBuckets ? "Review Preferences" : "Record Preferences"}</span>
          </button>
        </article>
      </div>
    </div>
  );
}
