import React from "react";
import { useTheme } from "../hooks/useTheme";

export default function Card({ children, style = {} }) {
  const { colors, radius, shadow } = useTheme();
  return (
    <div style={{
      background: colors.surface,
      borderRadius: radius.lg,
      boxShadow: shadow.card,
      border: `1px solid ${colors.border}`,
      padding: 20,
      ...style,
    }}>
      {children}
    </div>
  );
}
