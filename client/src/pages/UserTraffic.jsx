import React, { useEffect, useState } from "react";
import Card from "../components/Card";
import { useTheme } from "../hooks/useTheme";
import api from "../utils/api";

export default function UserTraffic() {
  const { colors, chart } = useTheme();
  const [data, setData]   = useState(null);
  const [from, setFrom]   = useState("");
  const [to, setTo]       = useState("");
  const [groupBy, setGroupBy] = useState("day");
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    const q = new URLSearchParams({ groupBy });
    if (from) q.set("from", from);
    if (to)   q.set("to", to);
    api.get(`/events/traffic?${q}`)
      .then((d) => d.success && setData(d))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  return (
    <div>
      <h2 style={{ marginBottom: 20, color: colors.text, fontWeight: 700 }}>User Traffic Analysis</h2>

      <Card style={{ marginBottom: 20 }}>
        <div style={{ display: "flex", gap: 12, alignItems: "flex-end", flexWrap: "wrap" }}>
          {[["From", from, setFrom], ["To", to, setTo]].map(([label, val, set]) => (
            <label key={label} style={{ fontSize: 13, color: colors.textMuted }}>
              {label}
              <input type="date" value={val} onChange={(e) => set(e.target.value)}
                style={{ display: "block", marginTop: 4, padding: "6px 10px", borderRadius: 6, border: `1px solid ${colors.border}`, fontSize: 13 }} />
            </label>
          ))}
          <label style={{ fontSize: 13, color: colors.textMuted }}>
            Group by
            <select value={groupBy} onChange={(e) => setGroupBy(e.target.value)}
              style={{ display: "block", marginTop: 4, padding: "6px 10px", borderRadius: 6, border: `1px solid ${colors.border}`, fontSize: 13 }}>
              <option value="day">Day</option>
              <option value="hour">Hour</option>
            </select>
          </label>
          <button onClick={load}
            style={{ padding: "8px 18px", background: colors.primary, color: "#fff", border: "none", borderRadius: 6, cursor: "pointer", fontSize: 13 }}>
            Apply
          </button>
        </div>
      </Card>

      {loading && <p style={{ color: colors.textMuted }}>Loading…</p>}
      {!loading && data && (
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 16 }}>
          {/* Timeline table */}
          <Card>
            <div style={{ fontWeight: 600, marginBottom: 12, color: colors.text }}>Sessions Over Time</div>
            <div style={{ overflowY: "auto", maxHeight: 400 }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                <thead>
                  <tr>
                    {["Date", "Source", "Sessions", "Unique Visitors", "Pageviews"].map((h) => (
                      <th key={h} style={{ textAlign: "left", padding: "7px 8px", color: colors.textMuted, borderBottom: `1px solid ${colors.border}` }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.traffic.length === 0 && (
                    <tr><td colSpan={5} style={{ padding: 20, textAlign: "center", color: colors.textMuted }}>No data</td></tr>
                  )}
                  {data.traffic.map((row, i) => (
                    <tr key={i} style={{ borderBottom: `1px solid ${colors.border}` }}>
                      <td style={{ padding: "7px 8px", color: colors.textMuted }}>{row.date}</td>
                      <td style={{ padding: "7px 8px" }}>
                        <span style={{ background: chart.colors[i % 6] + "20", color: chart.colors[i % 6], borderRadius: 4, padding: "2px 7px", fontSize: 11 }}>
                          {row.source || "direct"}
                        </span>
                      </td>
                      <td style={{ padding: "7px 8px", color: colors.text }}>{row.sessions}</td>
                      <td style={{ padding: "7px 8px", color: colors.text }}>{row.uniqueVisitors}</td>
                      <td style={{ padding: "7px 8px", color: colors.text }}>{row.pageviews}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Source breakdown */}
          <Card>
            <div style={{ fontWeight: 600, marginBottom: 14, color: colors.text }}>Source Breakdown</div>
            {data.sourceBreakdown.map((s, i) => {
              const max = data.sourceBreakdown[0]?.visits || 1;
              const pct = Math.round((s.visits / max) * 100);
              return (
                <div key={i} style={{ marginBottom: 14 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 4 }}>
                    <span style={{ color: colors.text, fontWeight: 500 }}>{s.source || "direct"}</span>
                    <span style={{ color: colors.textMuted }}>{s.visits} visits · {s.visitors} visitors</span>
                  </div>
                  <div style={{ background: colors.border, borderRadius: 4, height: 8 }}>
                    <div style={{ width: `${pct}%`, background: chart.colors[i % 6], borderRadius: 4, height: 8 }} />
                  </div>
                </div>
              );
            })}
          </Card>
        </div>
      )}
    </div>
  );
}
