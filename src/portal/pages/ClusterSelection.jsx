import { useState } from "react";
import PageHeading from "../components/common/PageHeading";
import { ArrowLeft, Check, Info } from "lucide-react";

export default function ClusterSelection({ cluster, setCluster, goTo }) {
  const [pending, setPending] = useState(cluster || "Cluster 2");

  const clusters = [
    {
      id: "Cluster 1",
      name: "Cluster 1",
      range: "S1 — S50",
      description: "Section range 1 through 50 for primary cohort registrations.",
      recommended: false,
    },
    {
      id: "Cluster 2",
      name: "Cluster 2",
      range: "S51 — S100",
      description: "Section range 51 through 100 for enrolled CSE-2 students.",
      recommended: true,
    },
  ];

  return (
    <div className="cluster-selection-workspace">
      <PageHeading
        title="Cluster Selection"
        description="Confirm your section cluster cohort allocation before choosing semester subjects."
        aside={
          <div className="status-stamp">
            <span>SELECTED COHORT</span>
            <strong>{pending}</strong>
          </div>
        }
      />

      <section className="specialization-banner">
        <span className="specialization-tag">
          Your Specialization
        </span>
        <strong>Generative AI for Agentic and Multi-Modal Intelligence</strong>
      </section>

      <div className="cluster-grid">
        {clusters.map((item) => {
          const selected = pending === item.name;
          return (
            <div
              key={item.id}
              role="button"
              tabIndex={0}
              className={`cluster-card ${selected ? "selected" : ""}`}
              onClick={() => setPending(item.name)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setPending(item.name);
                }
              }}
            >
              <div className="cluster-card-header">
                {item.recommended ? (
                  <span className="cluster-badge">
                    Recommended
                  </span>
                ) : (
                  <span className="cluster-badge cluster-badge-neutral">
                    Alternative
                  </span>
                )}
                <span className={`cluster-radio-indicator ${selected ? "is-selected" : ""}`}>
                  {selected && <Check size={14} strokeWidth={3} />}
                </span>
              </div>

              <div className="cluster-body">
                <div className="cluster-title-row">
                  <strong>{item.name}</strong>
                  <div className="cluster-range-pill">
                    <span>Range</span>
                    <em>{item.range}</em>
                  </div>
                </div>
                <p className="cluster-desc">{item.description}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="cluster-notice">
        <div className="notice-icon-wrap">
          <Info size={16} className="text-amber-600" />
        </div>
        <span>
          Your cluster is based on your specialization cohort. All course buckets will display faculty
          and section allocations from this cluster only.
        </span>
      </div>

      <div className="cluster-actions">
        <button
          type="button"
          className="secondary-btn"
          onClick={() => goTo("overview")}
        >
          <ArrowLeft size={15} />
          <span>Back to Overview</span>
        </button>
        <button
          type="button"
          className="primary-btn"
          onClick={() => {
            setCluster(pending);
            goTo("subjects");
          }}
        >
          <span>Confirm {pending}</span>
          <Check size={16} />
        </button>
      </div>
    </div>
  );
}
