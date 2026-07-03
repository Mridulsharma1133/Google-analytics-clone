import React from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { useTheme } from "../hooks/useTheme";

export default function MainLayout() {
  const { colors, font } = useTheme();
  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        fontFamily: font.family,
        background: colors.bg,
      }}
    >
      <Sidebar />
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <Header />
        <main
          style={{
            flex: 1,
            padding: 24,
            background: colors.bg,
            color: colors.text,
          }}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
}
