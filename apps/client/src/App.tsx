import AuthProvider from "./providers/AuthProvider";
import AppRoutes from "./routes";
import "./app.css";

const Routes = () => {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
};

export default Routes;
