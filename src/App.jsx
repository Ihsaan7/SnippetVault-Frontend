import { Routes, Route, Navigate } from "react-router-dom";
import { RegisterationForm } from "./components/auth/RegisterationForm";
import { LoginForm } from "./components/auth/LoginForm";
import { ProtectedRoute } from "./components/routing/ProtectedRoute";
import "./App.css";
import { Dashboard } from "./pages/Dashboard";
import SnippetCreate from "./pages/SnippetCreate";

function App() {
  return (
    <Routes>
      <Route path="/register" element={<RegisterationForm />} />
      <Route path="/login" element={<LoginForm />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/create"
        element={
          <ProtectedRoute>
            <SnippetCreate />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;
