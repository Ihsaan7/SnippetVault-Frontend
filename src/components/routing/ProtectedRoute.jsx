import { useAuth } from "../../context/AuthContext";
import { Navigate } from "react-router-dom";

export function ProtectedRoute({ children }) {
  const { isVerified, isLoading } = useAuth();
  if (isLoading) return <div>Loading...</div>;
  if (!isVerified) return <Navigate to="/login" replace />;

  return children;
}
