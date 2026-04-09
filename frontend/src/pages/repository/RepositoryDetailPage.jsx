import { useState } from "react";
import { createPortal } from "react-dom";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getRepoById, deleteRepo } from "../../api/repository.api.js";
import { getFiles, createFile } from "../../api/file.api.js";
import { getPRsByRepo } from "../../api/pullRequest.api.js";
import Layout from "../../components/common/Layout.jsx";
import Loader from "../../components/common/Loader.jsx";
import { getPRStatusColor } from "../../utils/getStatusColor.js";
import { timeAgo } from "../../utils/formatDate.js";
import useAuthStore from "../../store/auth.store.js";
import toast from "react-hot-toast";
import {
  GitBranch, FileCode, GitPullRequest,
  Users, Settings, Plus, Trash2, X,
  Globe, Lock, Clock
} from "lucide-react";

const S = {
  card: { background: "var(--bg-elevated)", border: "1px solid var(--border-default)", borderRadius: 14, overflow: "hidden" },
  label: { display: "block", fontSize: 12, color: "var(--text-secondary)", marginBottom: 6, fontWeight: 500 },
  input: {
    width: "100%", background: "rgba(13,17,23,0.8)",
    border: "1px solid var(--border-default)", borderRadius: 10,
    padding: "10px 14px", fontSize: 14, color: "var(--text-primary)",
    outline: "none", transition: "border-color 0.15s, box-shadow 0.15s", fontFamily: "inherit"
  },
  textarea: {
    width: "100%", background: "rgba(13,17,23,0.8)",
    border: "1px solid var(--border-default)", borderRadius: 10,
    padding: "10px 14px", fontSize: 14, color: "var(--text-primary)",
    outline: "none", transition: "border-color 0.15s", fontFamily: "inherit", resize: "none"
  },
  btnPrimary: {
    display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8,
    padding: "9px 18px", background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
    color: "#fff", fontFamily: "inherit", fontSize: 13, fontWeight: 600,
    border: "none", borderRadius: 10, cursor: "pointer", transition: "all 0.2s",
    boxShadow: "0 4px 12px rgba(37,99,235,0.3)"
  },
  btnGhost: {
    display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 6,
    padding: "8px 14px", background: "transparent",
    border: "1px solid var(--border-default)", color: "var(--text-secondary)",
    fontSize: 13, borderRadius: 10, cursor: "pointer", transition: "all 0.15s", fontFamily: "inherit"
  },
  btnDanger: {
    display: "inline-flex", alignItems: "center", justifyContent: "center",
    padding: "8px 10px", background: "transparent",
    border: "1px solid rgba(239,68,68,0.3)", color: "#f87171",
    fontSize: 13, borderRadius: 10, cursor: "pointer", transition: "all 0.15s", fontFamily: "inherit"
  },
};

const CreateFileModal = ({ repoId, onClose, queryClient }) => {
  const [form, setForm] = useState({ name: "", content: "", message: "" });

  const { mutate, isPending } = useMutation({
    mutationFn: () => createFile(repoId, form),
    onSuccess: () => {
      toast.success("File created!");
      queryClient.invalidateQueries({ queryKey: ["files", repoId] });
      onClose();
    },
    onError: (err) => toast.error(err.response?.data?.message || "Failed")
  });

  return createPortal(
    <div style={{
      position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
      display: "flex", alignItems: "center", justifyContent: "center",
      zIndex: 9999, padding: 16,
    }}>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: "absolute", inset: 0,
          background: "rgba(0,0,0,0.72)",
          backdropFilter: "blur(6px)",
          WebkitBackdropFilter: "blur(6px)",
        }}
      />
      <div style={{
        position: "relative", zIndex: 1,
        background: "var(--bg-elevated)", border: "1px solid var(--border-default)",
        borderRadius: 16, width: "100%", maxWidth: 500, padding: 24,
        boxShadow: "0 24px 64px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.04)",
        animation: "modal-in 0.18s ease both",
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 32, height: 32, background: "linear-gradient(135deg, #059669, #047857)",
              borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center"
            }}>
              <FileCode size={15} color="white" />
            </div>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: "var(--text-primary)" }}>Create File</h2>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-secondary)", padding: 4 }}>
            <X size={18} />
          </button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div>
            <label style={S.label}>File Name *</label>
            <input
              value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="index.js" style={S.input}
              onFocus={e => { e.target.style.borderColor = "#2563eb"; e.target.style.boxShadow = "0 0 0 3px rgba(37,99,235,0.25)"; }}
              onBlur={e => { e.target.style.borderColor = "var(--border-default)"; e.target.style.boxShadow = "none"; }}
            />
          </div>
          <div>
            <label style={S.label}>Commit Message *</label>
            <input
              value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })}
              placeholder="initial commit" maxLength={100} style={S.input}
              onFocus={e => { e.target.style.borderColor = "#2563eb"; e.target.style.boxShadow = "0 0 0 3px rgba(37,99,235,0.25)"; }}
              onBlur={e => { e.target.style.borderColor = "var(--border-default)"; e.target.style.boxShadow = "none"; }}
            />
          </div>
          <div>
            <label style={S.label}>Content *</label>
            <textarea
              value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })}
              placeholder="// Write your code here..." rows={8}
              style={{ ...S.textarea, fontFamily: "'JetBrains Mono', 'Fira Code', monospace" }}
              onFocus={e => e.target.style.borderColor = "#2563eb"}
              onBlur={e => e.target.style.borderColor = "var(--border-default)"}
            />
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={onClose} style={{ ...S.btnGhost, flex: 1 }}>Cancel</button>
            <button
              onClick={() => mutate()}
              disabled={isPending || !form.name || !form.content || !form.message}
              style={{ ...S.btnPrimary, flex: 1, opacity: (isPending || !form.name || !form.content || !form.message) ? 0.5 : 1 }}
            >
              {isPending ? "Creating..." : "Create File"}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

// Status badge helper
const prBadge = (status) => {
  const map = {
    pending: { bg: "rgba(245,158,11,0.12)", color: "#fbbf24", border: "rgba(245,158,11,0.25)" },
    accepted: { bg: "rgba(5,150,105,0.12)", color: "#34d399", border: "rgba(5,150,105,0.25)" },
    rejected: { bg: "rgba(239,68,68,0.12)", color: "#f87171", border: "rgba(239,68,68,0.25)" },
  };
  return map[status] || map.pending;
};

const RepositoryDetailPage = () => {
  const { repoId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("files");
  const [showCreateFile, setShowCreateFile] = useState(false);

  const { data: repoData, isLoading } = useQuery({ queryKey: ["repo", repoId], queryFn: () => getRepoById(repoId) });
  const { data: filesData } = useQuery({ queryKey: ["files", repoId], queryFn: () => getFiles(repoId) });
  const { data: prsData } = useQuery({ queryKey: ["prs", repoId], queryFn: () => getPRsByRepo(repoId) });

  const { mutate: handleDelete } = useMutation({
    mutationFn: () => deleteRepo(repoId),
    onSuccess: () => { toast.success("Repository deleted"); navigate("/repos"); },
    onError: (err) => toast.error(err.response?.data?.message || "Failed")
  });

  if (isLoading) return <Layout><Loader /></Layout>;

  const repo = repoData?.data?.data;
  const files = filesData?.data?.data || [];
  const prs = prsData?.data?.data || [];
  const isOwner = repo?.owner?._id === user?._id || repo?.owner === user?._id;

  const tabs = [
    { id: "files", label: "Files", icon: FileCode, count: files.length },
    { id: "prs", label: "Pull Requests", icon: GitPullRequest, count: prs.length },
    { id: "contributors", label: "Contributors", icon: Users }
  ];

  return (
    <Layout>
      {/* Repo header card */}
      <div style={{ ...S.card, padding: "22px 24px", marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
              <div style={{
                width: 40, height: 40, borderRadius: 10, flexShrink: 0,
                background: repo?.visibility === "public" ? "rgba(5,150,105,0.12)" : "rgba(37,99,235,0.12)",
                border: `1px solid ${repo?.visibility === "public" ? "rgba(5,150,105,0.2)" : "rgba(37,99,235,0.2)"}`,
                display: "flex", alignItems: "center", justifyContent: "center"
              }}>
                {repo?.visibility === "public" ? <Globe size={17} color="#34d399" /> : <Lock size={17} color="#60a5fa" />}
              </div>
              <h1 style={{ fontSize: 22, fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-0.6px" }}>
                {repo?.name}
              </h1>
              <span style={{
                fontSize: 11, fontWeight: 500, padding: "3px 10px", borderRadius: 99,
                ...(repo?.visibility === "public"
                  ? { background: "rgba(5,150,105,0.1)", color: "#34d399", border: "1px solid rgba(5,150,105,0.2)" }
                  : { background: "rgba(37,99,235,0.1)", color: "#60a5fa", border: "1px solid rgba(37,99,235,0.2)" })
              }}>
                {repo?.visibility}
              </span>
            </div>
            {repo?.description && (
              <p style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 8 }}>{repo.description}</p>
            )}
            <p style={{ fontSize: 12, color: "var(--text-muted)", display: "flex", alignItems: "center", gap: 6 }}>
              <span>by {repo?.owner?.username}</span>
              <span>•</span>
              <Clock size={11} color="var(--text-muted)" />
              <span>Updated {timeAgo(repo?.updatedAt)}</span>
            </p>
          </div>

          {isOwner && (
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Link
                to={`/repos/${repoId}/settings`}
                style={{ ...S.btnGhost, textDecoration: "none" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--border-muted)"; e.currentTarget.style.color = "var(--text-primary)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border-default)"; e.currentTarget.style.color = "var(--text-secondary)"; }}
              >
                <Settings size={14} />
                Settings
              </Link>
              <button
                onClick={() => { if (confirm("Delete this repository?")) handleDelete(); }}
                style={S.btnDanger}
                onMouseEnter={e => e.currentTarget.style.background = "rgba(239,68,68,0.1)"}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}
              >
                <Trash2 size={14} />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div style={{
        display: "flex", gap: 4, background: "var(--bg-elevated)",
        border: "1px solid var(--border-default)", borderRadius: 12,
        padding: 4, marginBottom: 20
      }}>
        {tabs.map(({ id, label, icon: Icon, count }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            style={{
              flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
              padding: "8px 16px", borderRadius: 9, fontSize: 13, fontWeight: 500,
              border: "none", cursor: "pointer", transition: "all 0.15s", fontFamily: "inherit",
              ...(activeTab === id
                ? { background: "linear-gradient(135deg, #2563eb, #1d4ed8)", color: "#fff", boxShadow: "0 2px 8px rgba(37,99,235,0.3)" }
                : { background: "transparent", color: "var(--text-secondary)" })
            }}
          >
            <Icon size={14} />
            {label}
            {count !== undefined && (
              <span style={{
                fontSize: 10, padding: "1px 6px", borderRadius: 99,
                background: activeTab === id ? "rgba(255,255,255,0.2)" : "var(--bg-overlay)",
                color: activeTab === id ? "#fff" : "var(--text-muted)"
              }}>
                {count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Files Tab */}
      {activeTab === "files" && (
        <div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
            <p style={{ fontSize: 13, color: "var(--text-secondary)" }}>{files.length} files</p>
            {(isOwner || repo?.contributors?.some(c => c._id === user?._id)) && (
              <button onClick={() => setShowCreateFile(true)} style={S.btnPrimary}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-1px)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; }}
              >
                <Plus size={13} strokeWidth={2.5} />
                New File
              </button>
            )}
          </div>

          {files.length === 0 ? (
            <div style={{ ...S.card, padding: "48px 20px", textAlign: "center" }}>
              <div style={{
                width: 48, height: 48, borderRadius: 12, margin: "0 auto 12px",
                background: "rgba(37,99,235,0.1)", border: "1px solid rgba(37,99,235,0.2)",
                display: "flex", alignItems: "center", justifyContent: "center"
              }}>
                <FileCode size={20} color="#60a5fa" />
              </div>
              <p style={{ fontSize: 14, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 4 }}>No files yet</p>
              <p style={{ fontSize: 12, color: "var(--text-muted)" }}>Create your first file to get started</p>
            </div>
          ) : (
            <div style={S.card}>
              {files.map((file, i) => (
                <Link
                  key={file._id}
                  to={`/repos/${repoId}/files/${file._id}`}
                  style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "14px 20px", textDecoration: "none",
                    borderBottom: i !== files.length - 1 ? "1px solid var(--border-subtle)" : "none",
                    transition: "background 0.15s"
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = "rgba(33,38,45,0.5)"}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{
                      width: 32, height: 32, borderRadius: 8,
                      background: "rgba(37,99,235,0.1)", border: "1px solid rgba(37,99,235,0.15)",
                      display: "flex", alignItems: "center", justifyContent: "center"
                    }}>
                      <FileCode size={14} color="#60a5fa" />
                    </div>
                    <div>
                      <p style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)", marginBottom: 2 }}>{file.name}</p>
                      <p style={{ fontSize: 11, color: "var(--text-muted)" }}>
                        {file.versionsCount} version{file.versionsCount !== 1 ? "s" : ""} • {file.size} bytes
                      </p>
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <Clock size={11} color="var(--text-muted)" />
                    <span style={{ fontSize: 11, color: "var(--text-muted)" }}>{timeAgo(file.updatedAt)}</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}

      {/* PRs Tab */}
      {activeTab === "prs" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {prs.length === 0 ? (
            <div style={{ ...S.card, padding: "48px 20px", textAlign: "center" }}>
              <div style={{
                width: 48, height: 48, borderRadius: 12, margin: "0 auto 12px",
                background: "rgba(124,58,237,0.1)", border: "1px solid rgba(124,58,237,0.2)",
                display: "flex", alignItems: "center", justifyContent: "center"
              }}>
                <GitPullRequest size={20} color="#a78bfa" />
              </div>
              <p style={{ fontSize: 14, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 4 }}>No pull requests yet</p>
            </div>
          ) : (
            prs.map((pr) => {
              const badge = prBadge(pr.status);
              return (
                <Link
                  key={pr._id}
                  to={`/repos/${repoId}/prs/${pr._id}`}
                  style={{
                    ...S.card,
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "14px 20px", textDecoration: "none", transition: "border-color 0.15s, box-shadow 0.15s"
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(37,99,235,0.4)"; e.currentTarget.style.boxShadow = "0 4px 16px rgba(37,99,235,0.1)"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border-default)"; e.currentTarget.style.boxShadow = "none"; }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{
                      width: 32, height: 32, borderRadius: 8, flexShrink: 0,
                      background: badge.bg, border: `1px solid ${badge.border}`,
                      display: "flex", alignItems: "center", justifyContent: "center"
                    }}>
                      <GitPullRequest size={14} color={badge.color} />
                    </div>
                    <div>
                      <p style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)", marginBottom: 2 }}>{pr.message}</p>
                      <p style={{ fontSize: 11, color: "var(--text-muted)" }}>
                        {pr.file?.name} • by {pr.createdBy?.username} • {timeAgo(pr.createdAt)}
                      </p>
                    </div>
                  </div>
                  <span style={{
                    fontSize: 11, fontWeight: 600, padding: "4px 10px", borderRadius: 99,
                    background: badge.bg, color: badge.color, border: `1px solid ${badge.border}`
                  }}>
                    {pr.status}
                  </span>
                </Link>
              );
            })
          )}
        </div>
      )}

      {/* Contributors Tab */}
      {activeTab === "contributors" && (
        <div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
            <p style={{ fontSize: 13, color: "var(--text-secondary)" }}>{repo?.contributors?.length || 0} contributors</p>
            {isOwner && (
              <Link
                to={`/repos/${repoId}/contributors`}
                style={{ fontSize: 13, color: "#60a5fa", textDecoration: "none", fontWeight: 500, display: "flex", alignItems: "center", gap: 4 }}
              >
                Manage Contributors â†’
              </Link>
            )}
          </div>

          <div style={S.card}>
            {/* Owner */}
            <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 20px", borderBottom: "1px solid var(--border-subtle)" }}>
              <div style={{
                width: 36, height: 36, borderRadius: "50%",
                background: "linear-gradient(135deg, #2563eb, #7c3aed)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 13, fontWeight: 700, color: "#fff"
              }}>
                {repo?.owner?.username?.[0]?.toUpperCase()}
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)" }}>{repo?.owner?.username}</p>
                <p style={{ fontSize: 11, color: "var(--text-muted)" }}>{repo?.owner?.email}</p>
              </div>
              <span style={{ fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 99, background: "rgba(37,99,235,0.1)", color: "#60a5fa", border: "1px solid rgba(37,99,235,0.2)" }}>
                Owner
              </span>
            </div>

            {repo?.contributors?.length === 0 ? (
              <div style={{ padding: "24px", textAlign: "center" }}>
                <p style={{ fontSize: 13, color: "var(--text-muted)" }}>No contributors yet</p>
              </div>
            ) : (
              repo?.contributors?.map((contributor) => (
                <div key={contributor._id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 20px", borderTop: "1px solid var(--border-subtle)" }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: "50%",
                    background: "linear-gradient(135deg, #7c3aed, #5b21b6)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 13, fontWeight: 700, color: "#fff"
                  }}>
                    {contributor?.username?.[0]?.toUpperCase()}
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)" }}>{contributor?.username}</p>
                    <p style={{ fontSize: 11, color: "var(--text-muted)" }}>{contributor?.email}</p>
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 99, background: "rgba(124,58,237,0.1)", color: "#a78bfa", border: "1px solid rgba(124,58,237,0.2)" }}>
                    Contributor
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {showCreateFile && (
        <CreateFileModal
          repoId={repoId}
          onClose={() => setShowCreateFile(false)}
          queryClient={queryClient}
        />
      )}
    </Layout>
  );
};

export default RepositoryDetailPage;