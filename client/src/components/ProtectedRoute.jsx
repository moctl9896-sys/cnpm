import { Navigate } from "react-router-dom";
import { getRole } from "../auth/userStore";

// bao ve route theo role
export default function ProtectedRoute({ role, children }) {
  const userRole = getRole();

  if (!userRole) return <Navigate to="/login" />;

  if (role && role !== userRole)
    return <Navigate to="/unauthorized" />;

  return children;
}
