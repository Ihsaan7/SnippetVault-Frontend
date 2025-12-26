import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import { RegisterationForm } from "./components/auth/RegisterationForm";
import { LoginForm } from "./components/auth/LoginForm";
import { ProtectedRoute } from "./components/routing/ProtectedRoute";
import { ShellLayout } from "./components/layout/ShellLayout";
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

      <Route element={<ShellLayout />}>
        <Route path="/public/snippets" element={<PublicSnippets />} />
        <Route path="/public/snippets/:id" element={<PublicSnippetView />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Outlet />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="profile" element={<Profile />} />
          <Route path="favorites" element={<Favorites />} />
          <Route path="create" element={<SnippetCreate />} />
          <Route path="snippets" element={<Snippets />} />
          <Route path="snippets/:id/edit" element={<SnippetEdit />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;
