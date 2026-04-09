import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getMyActivity } from "../../api/activity.api.js";
import Layout from "../../components/common/Layout.jsx";
import Loader from "../../components/common/Loader.jsx";
import { timeAgo } from "../../utils/formatDate.js";
import {
  Activity,
  ChevronLeft,
  ChevronRight,
  FolderPlus,
  FilePlus2,
  FilePenLine,
  Trash2,
  GitPullRequest,
  CheckCircle2,
  XCircle,
  UserPlus,
  UserMinus,
  MessageSquarePlus,
  Settings2,
  Pin,
} from "lucide-react";

const activityIcons = {
  repo_created: FolderPlus,
  file_created: FilePlus2,
  file_updated: FilePenLine,
  file_deleted: Trash2,
  pr_created: GitPullRequest,
  pr_accepted: CheckCircle2,
  pr_rejected: XCircle,
  contributor_added: UserPlus,
  contributor_removed: UserMinus,
  comment_added: MessageSquarePlus,
  rule_updated: Settings2,
};

const ActivityPage = () => {
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ["myActivity", page],
    queryFn: () => getMyActivity(page),
  });

  const activities = data?.data?.data?.activities || [];
  const total = data?.data?.data?.total || 0;
  const totalPages = data?.data?.data?.totalPages || 1;

  return (
    <Layout>
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          marginBottom: 28,
        }}
      >
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              marginBottom: 4,
            }}
          >
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 9,
                background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 4px 12px rgba(37,99,235,0.3)",
              }}
            >
              <Activity size={16} color="white" />
            </div>
            <h1
              style={{
                fontSize: 24,
                fontWeight: 800,
                color: "var(--text-primary)",
                letterSpacing: "-0.8px",
              }}
            >
              My Activity
            </h1>
          </div>
          <p style={{ color: "var(--text-secondary)", fontSize: 14 }}>
            {total} total events across all repositories
          </p>
        </div>

        {totalPages > 1 && (
          <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 8 }}>
            Page {page} of {totalPages}
          </div>
        )}
      </div>

      {isLoading ? (
        <Loader />
      ) : activities.length === 0 ? (
        <div
          style={{
            background: "var(--bg-elevated)",
            border: "1px solid var(--border-default)",
            borderRadius: 14,
            padding: "60px 20px",
            textAlign: "center",
          }}
        >
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: 13,
              margin: "0 auto 14px",
              background: "rgba(37,99,235,0.08)",
              border: "1px solid rgba(37,99,235,0.15)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Activity size={22} color="#60a5fa" />
          </div>
          <p
            style={{
              fontSize: 15,
              fontWeight: 600,
              color: "var(--text-secondary)",
              marginBottom: 6,
            }}
          >
            No activity yet
          </p>
          <p style={{ fontSize: 13, color: "var(--text-muted)" }}>
            Your actions across all repositories will appear here
          </p>
        </div>
      ) : (
        <>
          <div
            style={{
              background: "var(--bg-elevated)",
              border: "1px solid var(--border-default)",
              borderRadius: 14,
              overflow: "hidden",
              marginBottom: 20,
              position: "relative",
            }}
          >
            <div
              style={{
                position: "absolute",
                left: 58,
                top: 0,
                bottom: 0,
                width: 1,
                background:
                  "linear-gradient(to bottom, transparent, var(--border-subtle) 10%, var(--border-subtle) 90%, transparent)",
              }}
            />

            {activities.map((activity, i) => {
              const Icon = activityIcons[activity.type] || Pin;

              return (
                <div
                  key={activity._id}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 0,
                    padding: "16px 20px",
                    borderBottom:
                      i !== activities.length - 1
                        ? "1px solid var(--border-subtle)"
                        : "none",
                    transition: "background 0.15s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = "rgba(33,38,45,0.4)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "transparent")
                  }
                >
                  <div
                    style={{
                      width: 28,
                      height: 40,
                      borderRadius: 8,
                      flexShrink: 0,
                      background: "var(--bg-overlay)",
                      border: "1px solid var(--border-subtle)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginRight: 20,
                      zIndex: 1,
                    }}
                  >
                    <Icon size={16} color="#60a5fa" />
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p
                      style={{
                        fontSize: 13,
                        color: "#c9d1d9",
                        lineHeight: 1.5,
                        marginBottom: 4,
                      }}
                    >
                      {activity.message}
                    </p>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontSize: 11, color: "var(--text-muted)" }}>
                        {timeAgo(activity.createdAt)}
                      </span>
                      {activity.repository && (
                        <>
                          <span style={{ color: "var(--text-muted)", fontSize: 11 }}>
                            •
                          </span>
                          <span
                            style={{
                              fontSize: 11,
                              padding: "1px 7px",
                              borderRadius: 99,
                              background: "rgba(37,99,235,0.08)",
                              color: "#60a5fa",
                              border: "1px solid rgba(37,99,235,0.15)",
                            }}
                          >
                            {activity.repository?.name}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {totalPages > 1 && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 12,
              }}
            >
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 9,
                  background: "var(--bg-elevated)",
                  border: "1px solid var(--border-default)",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--text-secondary)",
                  transition: "all 0.15s",
                  opacity: page === 1 ? 0.4 : 1,
                }}
                onMouseEnter={(e) => {
                  if (page !== 1) {
                    e.currentTarget.style.borderColor = "var(--border-muted)";
                    e.currentTarget.style.color = "var(--text-primary)";
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "var(--border-default)";
                  e.currentTarget.style.color = "var(--text-secondary)";
                }}
              >
                <ChevronLeft size={15} />
              </button>

              <span
                style={{
                  fontSize: 13,
                  color: "var(--text-secondary)",
                  fontWeight: 500,
                  padding: "6px 14px",
                  background: "var(--bg-elevated)",
                  border: "1px solid var(--border-default)",
                  borderRadius: 9,
                }}
              >
                {page} / {totalPages}
              </span>

              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 9,
                  background: "var(--bg-elevated)",
                  border: "1px solid var(--border-default)",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--text-secondary)",
                  transition: "all 0.15s",
                  opacity: page === totalPages ? 0.4 : 1,
                }}
                onMouseEnter={(e) => {
                  if (page !== totalPages) {
                    e.currentTarget.style.borderColor = "var(--border-muted)";
                    e.currentTarget.style.color = "var(--text-primary)";
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "var(--border-default)";
                  e.currentTarget.style.color = "var(--text-secondary)";
                }}
              >
                <ChevronRight size={15} />
              </button>
            </div>
          )}
        </>
      )}
    </Layout>
  );
};

export default ActivityPage;