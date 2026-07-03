import React, { useEffect, useState } from "react";
import Card from "../components/Card";
import { useTheme } from "../hooks/useTheme";
import api from "../utils/api";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  LineChart,
  Line,
} from "recharts";
export default function Analytics() {
  const { colors, chart } = useTheme();

  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadAnalytics = async () => {
    try {
      const res = await api.get("/analytics");

      if (res.success) {
        setAnalytics(res.analytics);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnalytics();
  }, []);

  if (loading) {
    return <p style={{ color: colors.textMuted }}>Loading Analytics...</p>;
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
        Analytics Overview
      </h2>

      {/* Top Row */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 20,
          marginBottom: 20,
        }}
      >
        {/* Top Events */}
        <Card>
          <h3
            style={{
              marginBottom: 15,
              color: colors.text,
            }}
          >
            Top Events
          </h3>

          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
            }}
          >
            <thead>
              <tr>
                <th
                  style={{
                    textAlign: "left",
                    paddingBottom: 10,
                    color: colors.textMuted,
                  }}
                >
                  Event
                </th>

                <th
                  style={{
                    textAlign: "right",
                    paddingBottom: 10,
                    color: colors.textMuted,
                  }}
                >
                  Count
                </th>
              </tr>
            </thead>

            <tbody>
              {analytics?.topEvents?.map((event) => (
                <tr key={event.eventName}>
                  <td
                    style={{
                      padding: "8px 0",
                      color: colors.text,
                    }}
                  >
                    {event.eventName}
                  </td>

                  <td
                    style={{
                      textAlign: "right",
                      color: chart.colors[0],
                      fontWeight: 600,
                    }}
                  >
                    {event.count}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>

        {/* Top Pages */}
        <Card>
          <h3
            style={{
              marginBottom: 15,
              color: colors.text,
            }}
          >
            Top Pages
          </h3>

          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
            }}
          >
            <thead>
              <tr>
                <th
                  style={{
                    textAlign: "left",
                    paddingBottom: 10,
                    color: colors.textMuted,
                  }}
                >
                  Page
                </th>

                <th
                  style={{
                    textAlign: "right",
                    paddingBottom: 10,
                    color: colors.textMuted,
                  }}
                >
                  Views
                </th>
              </tr>
            </thead>

            <tbody>
              {analytics?.topPages?.map((page) => (
                <tr key={page.page}>
                  <td
                    style={{
                      padding: "8px 0",
                      color: colors.text,
                    }}
                  >
                    {page.page}
                  </td>

                  <td
                    style={{
                      textAlign: "right",
                      color: chart.colors[1],
                      fontWeight: 600,
                    }}
                  >
                    {page.count}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>

      {/* Second Row */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 20,
          marginBottom: 20,
        }}
      >
        {/* Sources */}
        <Card>
          <h3
            style={{
              marginBottom: 15,
              color: colors.text,
            }}
          >
            Traffic Sources
          </h3>

          {analytics?.topSources?.map((source, index) => (
            <div
              key={source.source}
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 10,
              }}
            >
              <span style={{ color: colors.text }}>
                {source.source || "direct"}
              </span>

              <span
                style={{
                  color: chart.colors[index % chart.colors.length],
                  fontWeight: 600,
                }}
              >
                {source.count}
              </span>
            </div>
          ))}
        </Card>

        {/* Countries */}
        <Card>
          <h3
            style={{
              marginBottom: 15,
              color: colors.text,
            }}
          >
            Countries
          </h3>

          {analytics?.topCountries?.map((country, index) => (
            <div
              key={country.country}
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 10,
              }}
            >
              <span style={{ color: colors.text }}>{country.country}</span>

              <span
                style={{
                  color: chart.colors[index % chart.colors.length],
                  fontWeight: 600,
                }}
              >
                {country.count}
              </span>
            </div>
          ))}
        </Card>
      </div>
      <Card style={{ marginBottom: 20 }}>
        <h3
          style={{
            marginBottom: 20,
            color: colors.text,
          }}
        >
          Event Analytics Charts
        </h3>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 20,
          }}
        >
          {/* Top Events Chart */}
          <div>
            <h4
              style={{
                marginBottom: 10,
                color: colors.text,
              }}
            >
              Top Events
            </h4>

            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analytics?.topEvents || []}>
                <XAxis dataKey="eventName" />
                <YAxis />
                <Tooltip />

                <Bar dataKey="count" fill={chart.colors[0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Traffic Sources */}
          <div>
            <h4
              style={{
                marginBottom: 10,
                color: colors.text,
              }}
            >
              Traffic Sources
            </h4>

            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={analytics?.topSources || []}
                  dataKey="count"
                  nameKey="source"
                  outerRadius={100}
                  label
                >
                  {(analytics?.topSources || []).map((entry, index) => (
                    <Cell
                      key={index}
                      fill={chart.colors[index % chart.colors.length]}
                    />
                  ))}
                </Pie>

                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </Card>
      <Card style={{ marginBottom: 20 }}>
        <h3
          style={{
            marginBottom: 15,
            color: colors.text,
          }}
        >
          Event Trend
        </h3>

        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={analytics?.dailyTrend || []}>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />

            <Line
              type="monotone"
              dataKey="events"
              stroke={chart.colors[1]}
              strokeWidth={3}
            />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      {/* Recent Events */}
      <Card>
        <h3
          style={{
            marginBottom: 15,
            color: colors.text,
          }}
        >
          Recent Events
        </h3>

        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
          }}
        >
          <thead>
            <tr>
              {["Event", "Page", "Source", "Country", "Visitor"].map(
                (header) => (
                  <th
                    key={header}
                    style={{
                      textAlign: "left",
                      padding: 10,
                      color: colors.textMuted,
                      borderBottom: `1px solid ${colors.border}`,
                    }}
                  >
                    {header}
                  </th>
                ),
              )}
            </tr>
          </thead>

          <tbody>
            {analytics?.recentEvents?.map((event) => (
              <tr key={event._id}>
                <td
                  style={{
                    padding: 10,
                    color: colors.text,
                  }}
                >
                  {event.eventName}
                </td>

                <td
                  style={{
                    padding: 10,
                    color: colors.textMuted,
                  }}
                >
                  {event.page}
                </td>

                <td
                  style={{
                    padding: 10,
                    color: colors.textMuted,
                  }}
                >
                  {event.source}
                </td>

                <td
                  style={{
                    padding: 10,
                    color: colors.textMuted,
                  }}
                >
                  {event.country}
                </td>

                <td
                  style={{
                    padding: 10,
                    color: colors.textMuted,
                  }}
                >
                  {event.visitorId}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
