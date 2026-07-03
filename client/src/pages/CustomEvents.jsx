import React, { useEffect, useState } from "react";
import Card from "../components/Card";
import { useTheme } from "../hooks/useTheme";
import api from "../utils/api";

const EMPTY = { eventName: "", source: "", eventValue: "", type: "count" };

export default function CustomEvents() {
  const { colors, chart, radius } = useTheme();
  const [form, setForm]     = useState(EMPTY);
  const [filter, setFilter] = useState({ source: "", eventName: "", type: "" });
  const [data, setData]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg]       = useState("");

  const load = () => {
    setLoading(true);
    const q = new URLSearchParams();
    if (filter.source)    q.set("source", filter.source);
    if (filter.eventName) q.set("eventName", filter.eventName);
    if (filter.type)      q.set("type", filter.type);
    api.get(`/events/custom?${q}`)
      .then((d) => d.success && setData(d.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const submit = async (e) => {
    e.preventDefault();
    setMsg("");
    const payload = {
      eventName: form.eventName,
      source:    form.source || "direct",
      eventValue: form.eventValue !== "" ? Number(form.eventValue) : null,
      type:      form.type,
      visitorId: "admin-" + Math.random().toString(36).slice(2),
      sessionId: "sess-"  + Math.random().toString(36).slice(2),
    };
    const res = await api.post("/events", payload);
    if (res.success) {
      setMsg("Event created!");
      setForm(EMPTY);
      load();
    } else {
      setMsg(res.message || "Error");
    }
  };

  const inputStyle = {
    padding: "7px 10px",
    borderRadius: 6,
    border: `1px solid ${colors.border}`,
    fontSize: 13,
    width: "100%",
    boxSizing: "border-box",
  };

  return (
    <div>
      <h2 style={{ marginBottom: 20, color: colors.text, fontWeight: 700 }}>Custom Events</h2>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 16, marginBottom: 24 }}>
        {/* Create form */}
        <Card>
          <div style={{ fontWeight: 600, marginBottom: 14, color: colors.text }}>Create Event</div>
          <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {[
              ["Event Name *", "eventName", "text",   "e.g. button_click"],
              ["Source",       "source",    "text",   "e.g. google, direct"],
              ["Event Value",  "eventValue","number", "optional numeric value"],
            ].map(([label, key, type, placeholder]) => (
              <label key={key} style={{ fontSize: 13, color: colors.textMuted }}>
                {label}
                <input
                  type={type} placeholder={placeholder}
                  value={form[key]}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                  required={key === "eventName"}
                  style={{ ...inputStyle, marginTop: 4 }}
                />
              </label>
            ))}

            <label style={{ fontSize: 13, color: colors.textMuted }}>
              Aggregation Type
              <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}
                style={{ ...inputStyle, marginTop: 4 }}>
                <option value="count">Count</option>
                <option value="sum">Sum</option>
                <option value="unique">Unique</option>
              </select>
            </label>

            <button type="submit"
              style={{ marginTop: 4, padding: "9px", background: colors.primary, color: "#fff", border: "none", borderRadius: 6, cursor: "pointer", fontWeight: 600, fontSize: 13 }}>
              Create Event
            </button>
            {msg && <p style={{ margin: 0, fontSize: 12, color: msg === "Event created!" ? colors.secondary : colors.danger }}>{msg}</p>}
          </form>
        </Card>

        {/* Filter */}
        <Card>
          <div style={{ fontWeight: 600, marginBottom: 14, color: colors.text }}>Filter & Results</div>
          <div style={{ display: "flex", gap: 10, marginBottom: 14, flexWrap: "wrap" }}>
            {[["Source", "source"], ["Event Name", "eventName"]].map(([label, key]) => (
              <label key={key} style={{ fontSize: 12, color: colors.textMuted, flex: 1 }}>
                {label}
                <input value={filter[key]} onChange={(e) => setFilter({ ...filter, [key]: e.target.value })}
                  style={{ ...inputStyle, marginTop: 3 }} />
              </label>
            ))}
            <label style={{ fontSize: 12, color: colors.textMuted }}>
              Type
              <select value={filter.type} onChange={(e) => setFilter({ ...filter, type: e.target.value })}
                style={{ ...inputStyle, marginTop: 3 }}>
                <option value="">All</option>
                <option value="count">Count</option>
                <option value="sum">Sum</option>
                <option value="unique">Unique</option>
              </select>
            </label>
            <div style={{ display: "flex", alignItems: "flex-end" }}>
              <button onClick={load}
                style={{ padding: "7px 16px", background: colors.primary, color: "#fff", border: "none", borderRadius: 6, cursor: "pointer", fontSize: 13 }}>
                Filter
              </button>
            </div>
          </div>

          {loading ? <p style={{ color: colors.textMuted }}>Loading…</p> : (
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr>
                  {["Event Name", "Source", "Type", "Count", "Unique", "Sum", "Result"].map((h) => (
                    <th key={h} style={{ textAlign: "left", padding: "6px 8px", color: colors.textMuted, borderBottom: `1px solid ${colors.border}`, fontWeight: 600, fontSize: 11 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.length === 0 && (
                  <tr><td colSpan={7} style={{ padding: 20, textAlign: "center", color: colors.textMuted }}>No data</td></tr>
                )}
                {data.map((row, i) => (
                  <tr key={i} style={{ borderBottom: `1px solid ${colors.border}` }}>
                    <td style={{ padding: "7px 8px", fontWeight: 600, color: chart.colors[i % 6] }}>{row.eventName}</td>
                    <td style={{ padding: "7px 8px", color: colors.textMuted }}>{row.source}</td>
                    <td style={{ padding: "7px 8px" }}>
                      <span style={{ background: chart.colors[i % 6] + "20", color: chart.colors[i % 6], borderRadius: 4, padding: "2px 7px", fontSize: 11 }}>
                        {row.type}
                      </span>
                    </td>
                    <td style={{ padding: "7px 8px", color: colors.text }}>{row.count}</td>
                    <td style={{ padding: "7px 8px", color: colors.text }}>{row.uniqueVisitors}</td>
                    <td style={{ padding: "7px 8px", color: colors.text }}>{row.sum?.toFixed(2)}</td>
                    <td style={{ padding: "7px 8px", fontWeight: 700, color: colors.primary }}>{row.result}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Card>
      </div>
    </div>
  );
}
