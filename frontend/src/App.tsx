import { BrowserRouter, Routes, Route } from "react-router";
import Home from "@/components/pages/Home";
import Dashboard from "@/components/pages/Dashboard";
import { ToastContainer } from "react-toastify";
import DashboardLayout from "@/components/layout/Dashboard";
import Users from "@/components/pages/Users";
export default function App() {
  return (
    <BrowserRouter>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="users" element={<Users />} />
          <Route path="*" element={<Dashboard />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}