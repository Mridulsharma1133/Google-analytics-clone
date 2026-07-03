import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../hooks/useTheme";

const BASE = "http://localhost:3001/api/v1";

export default function Login() {
  const { colors, radius, font } = useTheme();
  const { login } = useAuth();
  const navigate  = useNavigate();

  const [tab,     setTab]     = useState("login");
  const [form,    setForm]    = useState({ Username: "", email: "", password: "" });
  const [error,   setError]   = useState("");
  const [loading, setLoading] = useState(false);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const body = tab === "login"
        ? { email: form.email, password: form.password }
        : { Username: form.Username, email: form.email, password: form.password };

      const res  = await fetch(`${BASE}/auth/${tab}`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(body),
      });
      const data = await res.json();

      if (!data.success) { setError(data.message); return; }

      login(data);
      navigate("/", { replace: true });
    } catch (err) {
      setError("Cannot reach server. Is it running on port 3001?");
    } finally {
      setLoading(false);
    }
  };

  const inp = {
    width: "100%", padding: "9px 12px", fontSize: 13,
    border: `1px solid ${colors.border}`, borderRadius: radius.md,
    outline: "none", boxSizing: "border-box", fontFamily: font.family,
  };

  const btn = {
    width: "100%", padding: "10px", fontSize: 14, fontWeight: 600,
    background: colors.primary, color: "#fff", border: "none",
    borderRadius: radius.md, cursor: loading ? "not-allowed" : "pointer",
    opacity: loading ? 0.7 : 1, marginTop: 4,
  };

  return (
    <div style={{
      minHeight: "100vh", background: colors.bg, fontFamily: font.family,
      display: "flex", alignItems: "center", justifyContent: "center",
    }}>
      <div style={{
        background: colors.surface, border: `1px solid ${colors.border}`,
        borderRadius: radius.lg, padding: 32, width: 380,
        boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
      }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <div style={{ fontSize: 22, fontWeight: 800, color: colors.primary }}>GA Admin</div>
          <div style={{ fontSize: 12, color: colors.textMuted, marginTop: 2 }}>Google Analytics Dashboard</div>
        </div>

        {/* Tabs */}
        <div style={{
          display: "flex", background: colors.bg,
          borderRadius: radius.md, padding: 3, marginBottom: 24,
        }}>
          {["login", "register"].map((t) => (
            <button key={t} onClick={() => { setTab(t); setError(""); }}
              style={{
                flex: 1, padding: "7px", border: "none", borderRadius: radius.sm,
                fontSize: 13, fontWeight: 600, cursor: "pointer",
                background: tab === t ? colors.surface : "transparent",
                color:      tab === t ? colors.primary  : colors.textMuted,
                boxShadow:  tab === t ? "0 1px 4px rgba(0,0,0,0.08)" : "none",
              }}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {tab === "register" && (
            <div>
              <label style={{ fontSize: 12, color: colors.textMuted, display: "block", marginBottom: 4 }}>Username</label>
              <input style={inp} value={form.Username} onChange={(e) => set("Username", e.target.value)}
                placeholder="Your name" required />
            </div>
          )}
          <div>
            <label style={{ fontSize: 12, color: colors.textMuted, display: "block", marginBottom: 4 }}>Email</label>
            <input style={inp} type="email" value={form.email} onChange={(e) => set("email", e.target.value)}
              placeholder="admin@example.com" required />
          </div>
          <div>
            <label style={{ fontSize: 12, color: colors.textMuted, display: "block", marginBottom: 4 }}>Password</label>
            <input style={inp} type="password" value={form.password} onChange={(e) => set("password", e.target.value)}
              placeholder="••••••••" required minLength={6} />
          </div>

          {error && (
            <div style={{ fontSize: 12, color: colors.danger, background: colors.danger + "10",
              padding: "8px 12px", borderRadius: radius.sm, border: `1px solid ${colors.danger}30` }}>
              {error}
            </div>
          )}

          <button type="submit" style={btn} disabled={loading}>
            {loading ? "Please wait…" : tab === "login" ? "Login" : "Create Account"}
          </button>
        </form>
      </div>
    </div>
  );
}
