import AuthProvider from "./providers/AuthProvider";
import ComponentProvider from "./providers/components-provider";
import AppRoutes from "./routes";
import "./app.css";

const App = () => {
  return (
    <ComponentProvider>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </ComponentProvider>
  );
};

export default App;
