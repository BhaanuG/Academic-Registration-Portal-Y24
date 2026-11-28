export const pageSegments = {
  overview: "Academic-Overview",
  cluster: "Cluster-Selection",
  subjects: "Subject-Selection",
  preferences: "Faculty-Preferences",
  directory: "Faculty-Directory",
  "my-preference": "My-Preference",
  profile: "My-Profile",
};

export const segmentPages = Object.fromEntries(
  Object.entries(pageSegments).map(([page, segment]) => [segment, page]),
);

export function toTitleCase(str) {
  if (!str) return "";
  return str
    .toLowerCase()
    .split(/[\s-]+/)
    .map((word) => (word ? word.charAt(0).toUpperCase() + word.slice(1) : ""))
    .join("-");
}

export function portalPath(studentId, studentName, page) {
  const formattedName = toTitleCase(studentName || "Student");
  return `/KLEF/3-2/${encodeURIComponent(studentId)}/${encodeURIComponent(formattedName)}/${pageSegments[page]}`;
}

