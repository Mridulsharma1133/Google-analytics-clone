import React, { useEffect, useState } from "react";
import Card from "../components/Card";
import { useTheme } from "../hooks/useTheme";
import api from "../utils/api";

export default function Events() {
  const { colors, chart } = useTheme();
  const [report, setReport]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [from, setFrom] = useState("");
  const [to, setTo]     = useState("");

  const load = () => {
    setLoading(true);
    const q = new URLSearchParams();
    if (from) q.set("from", from);
    if (to)   q.set("to", to);
    api.get(`/events/ga-report?${q}`)
      .then((d) => d.success && setReport(d.report))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  return (
    <div>
      <h2 style={{ marginBottom: 20, color: colors.text, fontWeight: 700 }}>Events GA Report</h2>

      <Card style={{ marginBottom: 20 }}>
        <div style={{ display: "flex", gap: 12, alignItems: "flex-end" }}>
          {[["From", from, setFrom], ["To", to, setTo]].map(([label, val, set]) => (
            <label key={label} style={{ fontSize: 13, color: colors.textMuted }}>
              {label}
              <input
                type="date" value={val}
                onChange={(e) => set(e.target.value)}
                style={{ display: "block", marginTop: 4, padding: "6px 10px", borderRadius: 6, border: `1px solid ${colors.border}`, fontSize: 13 }}
              />
            </label>
          ))}
          <button
            onClick={load}
            style={{ padding: "8px 18px", background: colors.primary, color: "#fff", border: "none", borderRadius: 6, cursor: "pointer", fontSize: 13 }}
          >
            Apply
          </button>
        </div>
      </Card>

      <Card>
        {loading ? (
          <p style={{ color: colors.textMuted }}>Loading…</p>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr>
                {["Event Name", "Count", "Unique Visitors", "Total Value"].map((h) => (
                  <th key={h} style={{ textAlign: "left", padding: "8px 10px", color: colors.textMuted, borderBottom: `1px solid ${colors.border}`, fontWeight: 600 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {report.length === 0 && (
                <tr><td colSpan={4} style={{ padding: 20, color: colors.textMuted, textAlign: "center" }}>No data</td></tr>
              )}
              {report.map((row, i) => (
                <tr key={i} style={{ borderBottom: `1px solid ${colors.border}` }}>
                  <td style={{ padding: "9px 10px", fontWeight: 600, color: chart.colors[i % 6] }}>{row.eventName}</td>
                  <td style={{ padding: "9px 10px", color: colors.text }}>{row.count}</td>
                  <td style={{ padding: "9px 10px", color: colors.text }}>{row.uniqueVisitors}</td>
                  <td style={{ padding: "9px 10px", color: colors.text }}>{row.totalValue.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>
    </div>
  );
}
