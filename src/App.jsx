import { Routes, Route } from "react-router-dom";
import { RegisterationForm } from "./components/auth/RegisterationForm";
import { LoginForm } from "./components/auth/LoginForm";
import { ProtectedRoute } from "./components/routing/ProtectedRoute";
import "./App.css";

function App() {
  return (
    <Routes>
      <Route path="/register" element={<RegisterationForm />} />
      <Route path="/login" element={<LoginForm />} />
      <Route
        element={
          <ProtectedRoute>
            <Dashboar />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;
