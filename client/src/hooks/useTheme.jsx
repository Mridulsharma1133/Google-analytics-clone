import { themes } from "../theme/index.js";
import { useState, useEffect } from "react";
export const useTheme = () => {
  const [mode, setMode] = useState(
    localStorage.getItem("theme") || "light"
  );

  const theme = themes[mode];

  const toggleTheme = () => {
    setMode((prev) => (prev === "light" ? "dark" : "light"));
  };

  useEffect(() => {
    localStorage.setItem("theme", mode);
    document.body.style.background = theme.colors.bg;
    document.body.style.color = theme.colors.text;
  }, [mode]);

  return {
    mode,
    theme,
    colors: theme.colors,
    font: theme.font,
    radius: theme.radius,
    shadow: theme.shadow,
    chart: theme.chart,
    toggleTheme,
  };
};