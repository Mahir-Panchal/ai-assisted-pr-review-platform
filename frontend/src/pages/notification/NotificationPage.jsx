import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getNotifications, markAsRead,
  markAllAsRead, deleteNotification,
  deleteAllNotifications
} from "../../api/notification.api.js";
import Layout from "../../components/common/Layout.jsx";
import Loader from "../../components/common/Loader.jsx";
import { timeAgo } from "../../utils/formatDate.js";
import toast from "react-hot-toast";
import { Bell, Check, Trash2, CheckCheck, RefreshCcw, CheckCircle, XCircle, MessageCircle, Users, User } from "lucide-react";

const notificationIcons = {
  pr_created: <RefreshCcw size={16} />,
  pr_accepted: <CheckCircle size={16} className="text-green-500" />,
  pr_rejected: <XCircle size={16} className="text-red-500" />,
  comment_added: <MessageCircle size={16} />,
  contributor_added: <Users size={16} />,
  contributor_removed: <User size={16} />
};

const NotificationPage = () => {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["notifications"],
    queryFn: getNotifications
  });

  const { mutate: handleMarkRead } = useMutation({
    mutationFn: markAsRead,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notifications"] })
  });

  const { mutate: handleMarkAll } = useMutation({
    mutationFn: markAllAsRead,
    onSuccess: () => {
      toast.success("All marked as read");
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["unreadCount"] });
    }
  });

  const { mutate: handleDelete } = useMutation({
    mutationFn: deleteNotification,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notifications"] })
  });

  const { mutate: handleDeleteAll } = useMutation({
    mutationFn: deleteAllNotifications,
    onSuccess: () => {
      toast.success("All notifications cleared");
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    }
  });

  const notifications = data?.data?.data?.notifications || [];
  const unreadCount = data?.data?.data?.unreadCount || 0;

  return (
    <Layout>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 28 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 4 }}>
            <h1 style={{ fontSize: 24, fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-0.8px" }}>
              Notifications
            </h1>
            {unreadCount > 0 && (
              <span style={{
                display: "inline-flex", alignItems: "center",
                padding: "3px 10px", borderRadius: 99, fontSize: 11, fontWeight: 700,
                background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
                color: "#fff", boxShadow: "0 2px 8px rgba(37,99,235,0.4)"
              }}>
                {unreadCount} new
              </span>
            )}
          </div>
          <p style={{ color: "var(--text-secondary)", fontSize: 14 }}>
            {notifications.length} notification{notifications.length !== 1 ? "s" : ""} total
          </p>
        </div>

        {notifications.length > 0 && (
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <button
              onClick={() => handleMarkAll()}
              style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                padding: "8px 14px", border: "1px solid var(--border-default)",
                borderRadius: 10, background: "transparent", cursor: "pointer",
                fontSize: 13, color: "var(--text-secondary)", fontFamily: "inherit",
                transition: "all 0.15s"
              }}
              onMouseEnter={e => { e.currentTarget.style.color = "var(--text-primary)"; e.currentTarget.style.borderColor = "var(--border-muted)"; }}
              onMouseLeave={e => { e.currentTarget.style.color = "var(--text-secondary)"; e.currentTarget.style.borderColor = "var(--border-default)"; }}
            >
              <CheckCheck size={14} />
              Mark all read
            </button>
            <button
              onClick={() => { if (confirm("Clear all notifications?")) handleDeleteAll(); }}
              style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                padding: "8px 14px", border: "1px solid rgba(239,68,68,0.25)",
                borderRadius: 10, background: "rgba(239,68,68,0.06)", cursor: "pointer",
                fontSize: 13, color: "#f87171", fontFamily: "inherit", transition: "all 0.15s"
              }}
              onMouseEnter={e => e.currentTarget.style.background = "rgba(239,68,68,0.12)"}
              onMouseLeave={e => e.currentTarget.style.background = "rgba(239,68,68,0.06)"}
            >
              <Trash2 size={14} />
              Clear all
            </button>
          </div>
        )}
      </div>

      {isLoading ? (
        <Loader />
      ) : notifications.length === 0 ? (
        <div style={{
          background: "var(--bg-elevated)", border: "1px solid var(--border-default)",
          borderRadius: 14, padding: "60px 20px", textAlign: "center"
        }}>
          <div style={{
            width: 52, height: 52, borderRadius: 13, margin: "0 auto 14px",
            background: "rgba(37,99,235,0.1)", border: "1px solid rgba(37,99,235,0.2)",
            display: "flex", alignItems: "center", justifyContent: "center"
          }}>
            <Bell size={22} color="#60a5fa" />
          </div>
          <p style={{ fontSize: 15, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 6 }}>
            No notifications
          </p>
          <p style={{ fontSize: 13, color: "var(--text-muted)" }}>You're all caught up!</p>
        </div>
      ) : (
        <div style={{
          background: "var(--bg-elevated)", border: "1px solid var(--border-default)",
          borderRadius: 14, overflow: "hidden"
        }}>
          {notifications.map((notification, i) => (
            <div
              key={notification._id}
              style={{
                display: "flex", alignItems: "flex-start", gap: 14,
                padding: "16px 20px",
                borderBottom: i !== notifications.length - 1 ? "1px solid var(--border-subtle)" : "none",
                background: !notification.isRead ? "rgba(37,99,235,0.04)" : "transparent",
                transition: "background 0.15s"
              }}
              onMouseEnter={e => e.currentTarget.style.background = !notification.isRead ? "rgba(37,99,235,0.07)" : "rgba(33,38,45,0.4)"}
              onMouseLeave={e => e.currentTarget.style.background = !notification.isRead ? "rgba(37,99,235,0.04)" : "transparent"}
            >
              {/* Unread dot */}
              {!notification.isRead && (
                <div style={{
                  width: 6, height: 6, borderRadius: "50%", background: "#2563eb",
                  flexShrink: 0, marginTop: 7, boxShadow: "0 0 6px rgba(37,99,235,0.6)"
                }} />
              )}

              <span style={{ fontSize: 20, flexShrink: 0, marginTop: notification.isRead ? 0 : -2 }}>
                {notificationIcons[notification.type] || "ðŸ””"}
              </span>

              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{
                  fontSize: 13, marginBottom: 4, lineHeight: 1.5,
                  color: notification.isRead ? "var(--text-secondary)" : "var(--text-primary)",
                  fontWeight: notification.isRead ? 400 : 500
                }}>
                  {notification.message}
                </p>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <p style={{ fontSize: 11, color: "var(--text-muted)" }}>{timeAgo(notification.createdAt)}</p>
                  {notification.repository && (
                    <>
                      <span style={{ color: "var(--text-muted)", fontSize: 11 }}>•</span>
                      <span style={{ fontSize: 11, color: "var(--text-muted)" }}>
                        in {notification.repository?.name}
                      </span>
                    </>
                  )}
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 4, flexShrink: 0 }}>
                {!notification.isRead && (
                  <button
                    onClick={() => handleMarkRead(notification._id)}
                    title="Mark as read"
                    style={{
                      width: 30, height: 30, borderRadius: 7, background: "transparent",
                      border: "1px solid transparent", cursor: "pointer",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      color: "var(--text-muted)", transition: "all 0.15s"
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = "rgba(37,99,235,0.1)"; e.currentTarget.style.color = "#60a5fa"; e.currentTarget.style.borderColor = "rgba(37,99,235,0.2)"; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--text-muted)"; e.currentTarget.style.borderColor = "transparent"; }}
                  >
                    <Check size={13} />
                  </button>
                )}
                <button
                  onClick={() => handleDelete(notification._id)}
                  style={{
                    width: 30, height: 30, borderRadius: 7, background: "transparent",
                    border: "1px solid transparent", cursor: "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: "var(--text-muted)", transition: "all 0.15s"
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = "rgba(239,68,68,0.1)"; e.currentTarget.style.color = "#f87171"; e.currentTarget.style.borderColor = "rgba(239,68,68,0.2)"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--text-muted)"; e.currentTarget.style.borderColor = "transparent"; }}
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </Layout>
  );
};

export default NotificationPage;