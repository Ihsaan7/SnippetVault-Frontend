import { Outlet } from "react-router-dom";
import { AppShell } from "./AppShell";

export function DashboardLayout() {
  return (
    <AppShell>
      <Outlet />
    </AppShell>
  );
}
