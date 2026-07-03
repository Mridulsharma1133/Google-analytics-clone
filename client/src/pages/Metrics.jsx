import React, { useEffect, useState } from "react";
import Card from "../components/Card";
import { useTheme } from "../hooks/useTheme";
import api from "../utils/api";

function Bar({ label, value, max, color }) {
  const { colors } = useTheme();
  const pct = max ? Math.round((value / max) * 100) : 0;
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 3 }}>
        <span style={{ color: colors.text }}>{label}</span>
        <span style={{ color: colors.textMuted }}>{value}</span>
      </div>
      <div style={{ background: colors.border, borderRadius: 4, height: 8 }}>
        <div style={{ width: `${pct}%`, background: color, borderRadius: 4, height: 8, transition: "width .4s" }} />
      </div>
    </div>
  );
}

export default function KPI() {
  const { colors, chart } = useTheme();
  const [kpis, setKpis]   = useState([]);
  const [from, setFrom]   = useState("");
  const [to, setTo]       = useState("");
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    const q = new URLSearchParams();
    if (from) q.set("from", from);
    if (to)   q.set("to", to);
    api.get(`/kpi?${q}`)
      .then((d) => d.success && setKpis(d.kpis))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  return (
    <div>
      <h2 style={{ marginBottom: 20, color: colors.text, fontWeight: 700 }}>KPI Overview</h2>

      <Card style={{ marginBottom: 20 }}>
        <div style={{ display: "flex", gap: 12, alignItems: "flex-end" }}>
          {[["From", from, setFrom], ["To", to, setTo]].map(([label, val, set]) => (
            <label key={label} style={{ fontSize: 13, color: colors.textMuted }}>
              {label}
              <input type="date" value={val} onChange={(e) => set(e.target.value)}
                style={{ display: "block", marginTop: 4, padding: "6px 10px", borderRadius: 6, border: `1px solid ${colors.border}`, fontSize: 13 }} />
            </label>
          ))}
          <button onClick={load}
            style={{ padding: "8px 18px", background: colors.primary, color: "#fff", border: "none", borderRadius: 6, cursor: "pointer", fontSize: 13 }}>
            Apply
          </button>
        </div>
      </Card>

      {loading && <p style={{ color: colors.textMuted }}>Loading…</p>}
      {!loading && (
        <>
          
          <div
  style={{
    display: "grid",
    gridTemplateColumns: "repeat(4,1fr)",
    gap: 16,
  }}
>
  {kpis.map((kpi, index) => (
    <Card
      key={kpi.title}
      style={{
        textAlign: "center",
      }}
    >
      <div
        style={{
          fontSize: 28,
          fontWeight: 700,
          color:
            chart.colors[
              index % chart.colors.length
            ],
        }}
      >
        {kpi.value}
      </div>

      <div
        style={{
          fontSize: 12,
          marginTop: 8,
          color: colors.textMuted,
        }}
      >
        {kpi.title}
      </div>
    </Card>
  ))}
</div>
          
        </>
      )}
    </div>
  );
}
