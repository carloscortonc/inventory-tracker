import { Routes, Route, Navigate } from "react-router-dom";
import RegisterProduct from "./pages/scan/RegisterProduct";
import { Scanner } from "./pages/scan/Scanner";
import Items from "@/pages/items";
import Login from "@/pages/login/Login";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/scan" element={<Scanner />} />
      <Route path="/scan/:code" element={<RegisterProduct />} />
      <Route path="/items" element={<Items />} />
      <Route path="*" element={<Navigate to="/scan" replace />} />
    </Routes>
  );
};

export default AppRoutes;
