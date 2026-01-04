import { useEffect, useState } from "react";
import { useEffect, useState } from "react";
import { apiFetch } from "./api/http";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";

import AdminDashboard from "./pages/admin/Dashboard";
import RecruiterDashboard from "./pages/recruiter/Dashboard";
import CandidateDashboard from "./pages/candidate/Dashboard";
import Login from "./pages/Login";

function App() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("/api/health")
      .then(res => res.json())
      .then(data => setData(data));
  }, []);

  return (
    <div>
      <h1>FE ↔ BE DEV CONNECT</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}


//call api da bao ve
function App() {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    apiFetch("/api/profile")
      .then(res => res.json())
      .then(setProfile);
  }, []);

  return (
    <pre>{JSON.stringify(profile, null, 2)}</pre>
  );
}



//role
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute role="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/recruiter/dashboard"
          element={
            <ProtectedRoute role="recruiter">
              <RecruiterDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/candidate/dashboard"
          element={
            <ProtectedRoute role="candidate">
              <CandidateDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

