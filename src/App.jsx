import { Routes, Route, Navigate } from "react-router-dom";
import { RegisterationForm } from "./components/auth/RegisterationForm";
import { LoginForm } from "./components/auth/LoginForm";
import { ProtectedRoute } from "./components/routing/ProtectedRoute";
import "./App.css";
import { Dashboard } from "./pages/Dashboard";
import SnippetCreate from "./pages/SnippetCreate";
import { Snippets } from "./pages/Snippets";
import SnippetEdit from "./pages/SnippetEdit";
import { Profile } from "./pages/Profile";
import { Favorites } from "./pages/Favorites";
import { PublicSnippets } from "./pages/PublicSnippets";
import { PublicSnippetView } from "./pages/PublicSnippetView";

function App() {
  return (
    <Routes>
      <Route path="/register" element={<RegisterationForm />} />
      <Route path="/login" element={<LoginForm />} />

      <Route path="/public/snippets" element={<PublicSnippets />} />
      <Route path="/public/snippets/:id" element={<PublicSnippetView />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route />

      <Route
        path="/dashboard/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard/favorites"
        element={
          <ProtectedRoute>
            <Favorites />
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
      <Route
        path="/dashboard/snippets"
        element={
          <ProtectedRoute>
            <Snippets />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/snippets/:id/edit"
        element={
          <ProtectedRoute>
            <SnippetEdit />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;
