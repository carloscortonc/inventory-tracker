import { Routes, Route, Navigate } from "react-router-dom";
import { Scanner } from "./pages/scan/Scanner";
import Items from "@/pages/items";
import Login from "@/pages/login/Login";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/scan" element={<Scanner />} />
      <Route path="/" element={<Items />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
