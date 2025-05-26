import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import AppLayout from "./components/layout/AppLayout/AppLayout";
import PrivateRoute from "./components/layout/PrivateRoute";
import DashboardPage from "./features/dashboard/pages/DashboardPage/DashboardPage";
import LoginPage from "./features/auth/pages/LoginPage/LoginPage";
import "./styles/global.scss";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<LoginPage />} />

          {/* Protected routes */}
          <Route element={<PrivateRoute />}>
            <Route
              path="/"
              element={
                <AppLayout>
                  <Outlet />
                </AppLayout>
              }
            >
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<DashboardPage />} />
              <Route
                path="transactions"
                element={<div className="container">Transactions Page</div>}
              />
              <Route
                path="customers"
                element={<div className="container">Customers Page</div>}
              />
              <Route
                path="reports"
                element={<div className="container">Reports Page</div>}
              />
              <Route
                path="settings"
                element={<div className="container">Settings Page</div>}
              />
              <Route
                path="profile"
                element={<div className="container">Profile Page</div>}
              />
            </Route>
          </Route>

          {/* 404 route */}
          <Route
            path="*"
            element={<div className="container">404 - Page Not Found</div>}
          />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
