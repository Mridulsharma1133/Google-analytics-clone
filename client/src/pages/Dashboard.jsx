import React, { useEffect, useState } from "react";
import {
  Activity,
  Users,
  Zap,
  BarChart3,
} from "lucide-react";

import Card from "../components/Card";
import { useTheme } from "../hooks/useTheme";
import api from "../utils/api";

function StatCard({
  icon: Icon,
  label,
  value,
  color,
}) {
  const { colors } = useTheme();

  return (
    <Card
      style={{
        display: "flex",
        alignItems: "center",
        gap: 16,
      }}
    >
      <div
        style={{
          background: color + "20",
          borderRadius: 10,
          padding: 12,
        }}
      >
        <Icon
          size={22}
          color={color}
        />
      </div>

      <div>
        <div
          style={{
            fontSize: 22,
            fontWeight: 700,
            color: colors.text,
          }}
        >
          {value ?? 0}
        </div>

        <div
          style={{
            fontSize: 12,
            color: colors.textMuted,
          }}
        >
          {label}
        </div>
      </div>
    </Card>
  );
}

export default function Dashboard() {
  const { colors, chart } = useTheme();

  const [kpis, setKpis] = useState([]);
  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const response =
        await api.get("/kpi");

      if (response.success) {
        setKpis(response.kpis);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <p
        style={{
          color: colors.textMuted,
        }}
      >
        Loading...
      </p>
    );
  }

  return (
    <div>
      <h2
        style={{
          marginBottom: 20,
          color: colors.text,
          fontWeight: 700,
        }}
      >
        Analytics Dashboard
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(4,1fr)",
          gap: 16,
          marginBottom: 24,
        }}
      >
        {kpis.map((kpi, index) => {
          const icons = [
            Zap,
            Activity,
            Users,
            BarChart3,
          ];

          const Icon =
            icons[index % icons.length];

          return (
            <StatCard
              key={kpi.title}
              icon={Icon}
              label={kpi.title}
              value={kpi.value}
              color={
                chart.colors[
                  index %
                    chart.colors.length
                ]
              }
            />
          );
        })}
      </div>
    </div>
  );
}