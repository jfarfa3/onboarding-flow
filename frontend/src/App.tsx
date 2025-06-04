import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "@/components/pages/Home";
import Dashboard from "@/components/pages/Dashboard";
import { ToastContainer } from "react-toastify";
import DashboardLayout from "@/components/layout/Dashboard";
import UsersPage from "@/components/pages/Users";
import UserDetail from "@/components/pages/UserDetail";
import ConfigPage from "./components/pages/Config";
import Devices from "./components/pages/Devices";
import Accesses from "./components/pages/Accesses";
import NotFound from "./components/pages/NotFound";
import ProtectedRoute from "./components/atoms/ProtectedRoute";

export default function App() {
  return (
    <BrowserRouter>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<ProtectedRoute requiredPermission={[]}><DashboardLayout /></ProtectedRoute>}>
          <Route index element={<Dashboard />} />
          {/* Rutas protegidas con permisos específicos */}
          <Route path="users" element={
            <ProtectedRoute requiredPermission={["user:view:any"]}>
              <UsersPage />
            </ProtectedRoute>
          } />
          <Route path="user/:userId" element={
            <ProtectedRoute requiredPermission={["user:view:any", "user:view:self"]}>
              <UserDetail />
            </ProtectedRoute>
          } />
          <Route path="devices" element={
            <ProtectedRoute requiredPermission={["equipment:view:any", "equipment:view:self"]}>
              <Devices />
            </ProtectedRoute>
          } />
          <Route path="accesses" element={
            <ProtectedRoute requiredPermission={["access:view:any", "access:view:self"]}>
              <Accesses />
            </ProtectedRoute>
          } />
          <Route path="settings" element={
            <ProtectedRoute requiredPermission={["software:view:any"]}>
              <ConfigPage />
            </ProtectedRoute>
          } />
          <Route path="*" element={<NotFound />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}