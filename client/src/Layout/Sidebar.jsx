import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Activity,
  FileText,
  Users,
  BarChart3,
  Zap,
  Settings,
} from "lucide-react";
import { useTheme } from "../hooks/useTheme";

const nav = [
  { icon: LayoutDashboard, name: "Dashboard", route: "/" },
  { icon: Activity, name: "Events Report", route: "/events" },
  { icon: BarChart3, name: "KPI", route: "/kpi" },
  { icon: Users, name: "User Traffic", route: "/traffic" },
  { icon: Zap, name: "Custom Events", route: "/custom-events" },
  { icon: FileText, name: "Reports", route: "/reports" },
  { icon: Settings, name: "Configurations", route: "/configurations" },
  { icon: BarChart3, name: "Analytics", route: "/analytics" },
];

export default function Sidebar() {
  const { colors, radius } = useTheme();

  return (
    <div
      style={{
        width: 220,
        minHeight: "100vh",
        background: colors.sidebar,
        display: "flex",
        flexDirection: "column",
        padding: "16px 10px",
      }}
    >
      {/* BRAND */}
      <div
        style={{
          padding: "10px 12px 18px",
          color: colors.sidebarText,
          fontWeight: 700,
          fontSize: 16,
          letterSpacing: 1,
        }}
      >
        GA Admin
      </div>

      {/* NAV */}
      <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
        {nav.map((item) => (
          <li key={item.route}>
            <NavLink
              to={item.route}
              end={item.route === "/"}
              style={({ isActive }) => ({
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "10px 12px",
                borderRadius: radius.md,
                marginBottom: 6,
                textDecoration: "none",
                fontSize: 13,
                fontWeight: isActive ? 600 : 400,

                color: isActive ? "#ffffff" : colors.sidebarText,

                background: isActive ? "rgba(79, 70, 229, 0.9)" : "transparent",

                borderLeft: isActive
                  ? "4px solid #ffffff"
                  : "4px solid transparent",

                transition: "all 0.2s ease",
              })}
            >
              <item.icon size={17} color="currentColor" />

              <span>{item.name}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </div>
  );
}
