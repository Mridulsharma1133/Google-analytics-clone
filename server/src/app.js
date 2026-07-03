import express from "express";
import cors from "cors";
import healthroutes    from "./routes/healthcheck.routes.js";
import authroutes      from "./routes/auth.routes.js";
import eventroutes     from "./routes/event.routes.js";
import dashboardroutes from "./routes/dashboard.routes.js";
import kpiroutes       from "./routes/kpi.routes.js";
import analyticsroutes from "./routes/analytics.routes.js";

const app = express();

app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:3000"],
  credentials: true,
}));
app.use(express.json());

app.use("/api",           healthroutes);
app.use("/api/v1/auth",   authroutes);
app.use("/api/v1/events", eventroutes);
app.use("/api/v1/dashboard", dashboardroutes);
app.use("/api/v1/kpi",    kpiroutes);
app.use("/api/v1/analytics",analyticsroutes);

export default app;
