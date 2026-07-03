import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import MainLayout from "./Layout/MainLayout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Events from "./pages/Events";
import Metrics from "./pages/Metrics";
import UserTraffic from "./pages/UserTraffic";
import CustomEvents from "./pages/CustomEvents";
import Reports from "./pages/Reports";
import Configurations from "./pages/Configurations";
import Analytics from "./pages/Analytics";
function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="events" element={<Events />} />
            <Route path="kpi" element={<Metrics />} />
            <Route path="traffic" element={<UserTraffic />} />
            <Route path="custom-events" element={<CustomEvents />} />
            <Route path="reports" element={<Reports />} />
            <Route path="/configurations" element={<Configurations />} />
            <Route path="/analytics" element={<Analytics />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
