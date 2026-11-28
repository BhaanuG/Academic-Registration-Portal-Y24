import { useEffect, useMemo, useState } from "react";
import { Navigate, Route, Routes, useNavigate, useParams } from "react-router";
import PortalShell from "../components/layout/PortalShell";
import { useAuth } from "../hooks/useAuth";
import { useSubjects } from "../hooks/useSubjects";
import AcademicOverview from "../pages/AcademicOverview";
import ClusterSelection from "../pages/ClusterSelection";
import Developer from "../pages/Developer";
import FacultyDirectory from "../pages/FacultyDirectory";
import FacultyPreferences from "../pages/FacultyPreferences";
import Login from "../pages/Login";
import MyPreferences from "../pages/MyPreferences";
import MyProfile from "../pages/MyProfile";
import ResetPassword from "../pages/ResetPassword";
import SubjectSelection from "../pages/SubjectSelection";
import Admin from "../pages/Admin";
import { loadPreferences, savePreferences } from "../services/preferenceService";
import { buckets, faculty, initialSelections } from "../services/academicData";
import { getStudentCluster, saveLastRoute, saveStudentCluster } from "../services/studentService";
import { findStudentById } from "../services/studentData";
import { portalPath, segmentPages, toTitleCase } from "../utils/routes";

function PortalRoute() {
  const navigate = useNavigate();
  const { studentId = "", studentName = "Student", pageName = "" } = useParams();
  const page = segmentPages[pageName] || "overview";
  const { studentId: authenticatedStudent, signOut } = useAuth();
  const studentRecord = useMemo(() => findStudentById(studentId), [studentId]);
  const currentStudentName = toTitleCase(studentRecord?.name || studentName || "Student");
  const { selections, setSelections } = useSubjects(studentId);
  const [preferences, setPreferences] = useState(() => loadPreferences(studentId));
  const [cluster, setCluster] = useState(() => getStudentCluster(studentId));
  const [dataVersion, setDataVersion] = useState(0);

  // Pure frontend state synchronization using development data
  useEffect(() => {
    setPreferences(loadPreferences(studentId));
    setCluster(getStudentCluster(studentId));
  }, [studentId]);

  useEffect(() => {
    savePreferences(studentId, preferences);
  }, [preferences, studentId]);

  useEffect(() => {
    if (authenticatedStudent === studentId) saveLastRoute(window.location.pathname);
  }, [authenticatedStudent, page, studentId]);

  const setPage = (nextPage) => navigate(portalPath(studentId, currentStudentName, nextPage));

  const content = useMemo(() => {
    if (page === "overview") return <AcademicOverview studentId={studentId} />;
    if (page === "cluster")
      return (
        <ClusterSelection
          studentId={studentId}
          cluster={cluster}
          setCluster={(nextCluster) => {
            setCluster(nextCluster);
            saveStudentCluster(studentId, nextCluster);
          }}
          goTo={setPage}
        />
      );
    if (page === "subjects")
      return (
        <SubjectSelection selections={selections} setSelections={setSelections} goTo={setPage} />
      );
    if (page === "preferences")
      return (
        <FacultyPreferences
          selections={selections}
          prefs={preferences}
          setPrefs={setPreferences}
          cluster={cluster || "Cluster 2"}
        />
      );
    if (page === "directory") return <FacultyDirectory cluster={cluster || "Cluster 2"} />;
    if (page === "my-preference")
      return (
        <MyPreferences
          selections={selections}
          prefs={preferences}
          cluster={cluster || "Cluster 2"}
          onResetAll={() => {
            setSelections({});
            setPreferences({});
          }}
        />
      );
    return <MyProfile studentId={studentId} />;
  }, [cluster, dataVersion, page, preferences, selections, studentId]);

  if (authenticatedStudent !== studentId) return <Navigate to="/" replace />;

  return (
    <PortalShell
      page={page}
      setPage={setPage}
      studentId={studentId}
      onLogout={() => {
        signOut();
        navigate("/");
      }}
    >
      {content}
    </PortalShell>
  );
}

export function PortalRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/KLEF/3-2/Developer/G-Bhaanu-Sai" element={<Developer />} />
      <Route path="/KLEF/3-2/Admin/G-Bhaanu-Sai/:pageName?" element={<Admin />} />
      <Route path="/KLEF/3-2/:studentId/:studentName/:pageName" element={<PortalRoute />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
