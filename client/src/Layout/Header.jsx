import React from "react";
import { useTheme } from "../hooks/useTheme";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { LogOut, User } from "lucide-react";

export default function Header() {
  const { colors, mode, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <div
      style={{
        height: 52,
        background: colors.surface,
        borderBottom: `1px solid ${colors.border}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 20px",
      }}
    >
      <span style={{ fontWeight: 700, color: colors.primary, fontSize: 16 }}>
        Google Analytics Dashboard
      </span>

      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        {/* USER INFO */}
        {user && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              background: colors.bg,
              borderRadius: 20,
              padding: "4px 12px 4px 8px",
              border: `1px solid ${colors.border}`,
            }}
          >
            <User size={14} color={colors.primary} />
            <span style={{ fontSize: 13, color: colors.text, fontWeight: 500 }}>
              {user.name || user.Username || user.email}
            </span>
            <span
              style={{
                fontSize: 11,
                color: colors.textMuted,
                background: colors.border,
                borderRadius: 4,
                padding: "1px 6px",
                marginLeft: 2,
              }}
            >
              {user.role || "admin"}
            </span>
          </div>
        )}

        {/* 🌗 THEME TOGGLE (ADDED HERE) */}
        <button
          onClick={toggleTheme}
          style={{
            background: colors.bg,
            border: `1px solid ${colors.border}`,
            borderRadius: 6,
            padding: "5px 10px",
            cursor: "pointer",
            color: colors.textMuted,
            fontSize: 13,
          }}
        >
          {mode === "light" ? "🌙 Dark" : "☀️ Light"}
        </button>

        {/* LOGOUT */}
        <button
          onClick={handleLogout}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 5,
            background: "none",
            border: `1px solid ${colors.border}`,
            borderRadius: 6,
            padding: "5px 12px",
            cursor: "pointer",
            color: colors.textMuted,
            fontSize: 13,
          }}
        >
          <LogOut size={13} />
          Logout
        </button>
      </div>
    </div>
  );
}