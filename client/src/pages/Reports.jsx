import React, { useEffect, useState } from "react";
import Card from "../components/Card";
import { useTheme } from "../hooks/useTheme";
import api from "../utils/api";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function Reports() {
  const { colors, chart } = useTheme();
  const [events, setEvents] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [source, setSource] = useState("");
  const [eventName, setEventName] = useState("");
  const [loading, setLoading] = useState(true);
  const [showMenu, setShowMenu] = useState(false);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const LIMIT = 20;

  const filteredEvents = events.filter((item) => {
    if (!startDate && !endDate) return true;
    const itemDate = new Date(item.createdAt).getTime();
    const startTime = startDate ? new Date(startDate).getTime() : -Infinity;
    const endTime = startDate ? new Date(endDate).getTime() : Infinity;
    return itemDate >= startTime && itemDate <= endTime;
  });

  /*Dummy Reports to test export */
  // const reports = [
  //   {
  //     event: "React Workshop",
  //     attendees: 120,
  //     revenue: 5000,
  //   },
  //   {
  //     event: "JS Meetup",
  //     attendees: 80,
  //     revenue: 3000,
  //   },
  // ];

  const exportCSV = () => {
    const headers = ["Event Name", "Source", "Type", "Created At"];

    const csvRows = filteredEvents.map(
      (tx) =>
        `"${tx.date}","${tx.description.replace(/"/g, '""')}",${tx.amount}`,
    );

    // const row = events.map((event) => [
    //   event.eventName,
    //   event.source,
    //   event.type,
    //   event.createdAt,
    // ]);

    const csvContent = [headers.join(","), ...csvRows].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });

    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    const fileSuffix =
      startDate && endDate ? `${startDate}_to_${endDate}` : "all";
    link.setAttribute("download", `transactions_${fileSuffix}.csv`);

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Event", 14, 15);

    autoTable(doc, {
      startY: 25,
      head: [["Event Name", "Source", "Type", "Created At"]],
      body: events.map((event) => [
        event.eventName,
        event.source,
        event.type,
        event.createdAt,
      ]),
    });
    doc.save("reports.pdf");
  };

  const load = (p = page) => {
    setLoading(true);
    const q = new URLSearchParams({ page: p, limit: LIMIT });
    if (source) q.set("source", source);
    if (eventName) q.set("eventName", eventName);
    api
      .get(`/events?${q}`)
      .then((d) => {
        if (d.success) {
          setEvents(d.events);
          setTotal(d.total);
        }
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, [page]);

  const search = () => {
    setPage(1);
    load(1);
  };

  return (
    <div>
      <h2 style={{ marginBottom: 20, color: colors.text, fontWeight: 700 }}>
        Raw Events Report
      </h2>

     <Card style={{ marginBottom: 16 }}>
        <div
          style={{
            display: "flex",
            gap: 12,
            alignItems: "flex-end",
            flexWrap: "wrap",
            width: "100%"
          }}
        >
          {/* Main Filtration Inputs */}
          {[
            ["Source", source, setSource],
            ["Event Name", eventName, setEventName],
          ].map(([label, val, set]) => (
            <label
              key={label}
              style={{ fontSize: 13, color: colors.textMuted }}
            >
              {label}
              <input
                value={val}
                onChange={(e) => set(e.target.value)}
                style={{
                  display: "block",
                  marginTop: 4,
                  padding: "6px 10px",
                  borderRadius: 6,
                  border: `1px solid ${colors.border}`,
                  fontSize: 13,
                }}
              />
            </label>
          ))}

          {/* Date Filter Inputs styled exactly like the text boxes */}
          <div style={{ display: "flex", gap: 12, alignItems: "flex-end" }}>
            <label style={{ fontSize: 13, color: colors.textMuted }}>
              From
              <input 
                type="date" 
                name="" 
                id="" 
                style={{
                  display: "block",
                  marginTop: 4,
                  padding: "5px 10px",
                  borderRadius: 6,
                  border: `1px solid ${colors.border}`,
                  fontSize: 13,
                }}
              />
            </label>

            <label style={{ fontSize: 13, color: colors.textMuted }}>
              To
              <input 
                type="date" 
                name="" 
                id="" 
                style={{
                  display: "block",
                  marginTop: 4,
                  padding: "5px 10px",
                  borderRadius: 6,
                  border: `1px solid ${colors.border}`,
                  fontSize: 13,
                }}
              />
            </label>
          </div>

          {/* Push Action Controls to the End of the Box */}
          <div style={{ display: "flex", gap: 12, marginLeft: "auto", alignItems: "center" }}>
            <button
              onClick={search}
              style={{
                padding: "8px 18px",
                background: colors.primary,
                color: "#fff",
                border: "none",
                borderRadius: 6,
                cursor: "pointer",
                fontSize: 13,
              }}
            >
              Search
            </button>
            
            <div style={{ position: "relative", display: "inline-block" }}>
              <button
                onClick={() => setShowMenu((prev) => !prev)}
                style={{
                  padding: "8px 18px",
                  background: colors.primary,
                  color: "#fff",
                  border: "none",
                  borderRadius: 6,
                  cursor: "pointer",
                  fontSize: 13,
                }}
              >
                Export ▼
              </button>

              {showMenu && (
                <div
                  style={{
                    position: "absolute",
                    top: "110%",
                    right: 0,
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                    background: "#fff",
                    padding: "10px",
                    borderRadius: "8px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                    minWidth: "150px",
                    zIndex: 1000,
                  }}
                >
                  <button
                    onClick={() => {
                      exportPDF();
                      setShowMenu(false);
                    }}
                    style={{
                      padding: "8px",
                      border: "none",
                      borderRadius: "6px",
                      cursor: "pointer",
                      background: colors.primary,
                      color: "#fff",
                    }}
                  >
                    Export PDF
                  </button>

                  <button
                    onClick={() => {
                      exportCSV();
                      setShowMenu(false);
                    }}
                    style={{
                      padding: "8px",
                      border: "none",
                      borderRadius: "6px",
                      cursor: "pointer",
                      background: colors.primary,
                      color: "#fff",
                    }}
                  >
                    Export CSV
                  </button>
                </div>
              )}
            </div>
          </div>

        </div>
      </Card>

      <Card>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 12,
            fontSize: 13,
            color: colors.textMuted,
          }}
        >
          <span>Total: {total}</span>
          <div style={{ display: "flex", gap: 8 }}>
            <button
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              style={{
                padding: "4px 10px",
                border: `1px solid ${colors.border}`,
                borderRadius: 4,
                cursor: "pointer",
                background: page === 1 ? colors.bg : colors.surface,
              }}
            >
              ←
            </button>
            <span style={{ padding: "4px 8px" }}>Page {page}</span>
            <button
              disabled={page * LIMIT >= total}
              onClick={() => setPage(page + 1)}
              style={{
                padding: "4px 10px",
                border: `1px solid ${colors.border}`,
                borderRadius: 4,
                cursor: "pointer",
                background: page * LIMIT >= total ? colors.bg : colors.surface,
              }}
            >
              →
            </button>
          </div>
        </div>

        {loading ? (
          <p style={{ color: colors.textMuted }}>Loading…</p>
        ) : (
          <table
            style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}
          >
            <thead>
              <tr>
                {[
                  "Event Name",
                  "Source",
                  "Visitor ID",
                  "Session ID",
                  "Value",
                  "Type",
                  "Created At",
                ].map((h) => (
                  <th
                    key={h}
                    style={{
                      textAlign: "left",
                      padding: "7px 8px",
                      color: colors.textMuted,
                      borderBottom: `1px solid ${colors.border}`,
                      fontSize: 11,
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {events.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    style={{
                      padding: 20,
                      textAlign: "center",
                      color: colors.textMuted,
                    }}
                  >
                    No data
                  </td>
                </tr>
              )}
              {events.map((e, i) => (
                <tr
                  key={e._id}
                  style={{ borderBottom: `1px solid ${colors.border}` }}
                >
                  <td
                    style={{
                      padding: "7px 8px",
                      fontWeight: 600,
                      color: chart.colors[i % 6],
                    }}
                  >
                    {e.eventName}
                  </td>
                  <td style={{ padding: "7px 8px", color: colors.textMuted }}>
                    {e.source}
                  </td>
                  <td
                    style={{
                      padding: "7px 8px",
                      color: colors.text,
                      fontFamily: "monospace",
                      fontSize: 11,
                    }}
                  >
                    {e.visitorId}
                  </td>
                  <td
                    style={{
                      padding: "7px 8px",
                      color: colors.text,
                      fontFamily: "monospace",
                      fontSize: 11,
                    }}
                  >
                    {e.sessionId}
                  </td>
                  <td style={{ padding: "7px 8px", color: colors.text }}>
                    {e.eventValue ?? "—"}
                  </td>
                  <td style={{ padding: "7px 8px" }}>
                    <span
                      style={{
                        background: chart.colors[i % 6] + "20",
                        color: chart.colors[i % 6],
                        borderRadius: 4,
                        padding: "2px 6px",
                        fontSize: 11,
                      }}
                    >
                      {e.type}
                    </span>
                  </td>
                  <td
                    style={{
                      padding: "7px 8px",
                      color: colors.textMuted,
                      fontSize: 11,
                    }}
                  >
                    {new Date(e.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>
    </div>
  );
}
