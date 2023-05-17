import React from "react";
import { useNavigate } from "react-router-dom";
import Router from "./components/Router";
import Header from "./components/Header";
import { HelmetProvider } from "react-helmet-async";
import {
  AuthProvider,
  DocumentTitleProvider,
  SnackbarProvider,
} from "./contexts";

function App() {
  const navigate = useNavigate();
  React.useEffect(() => {
    window.addEventListener("storage", () => {
      if (!localStorage.getItem("user")) {
        navigate("/login", { replace: true });
      }
    });
  }, []);
  return (
    <HelmetProvider>
      <DocumentTitleProvider>
        <AuthProvider>
          <SnackbarProvider>
            <div style={{ backgroundColor: "white", height: "100vh" }}>
              <Header />
              <Router />
            </div>
          </SnackbarProvider>
        </AuthProvider>
      </DocumentTitleProvider>
    </HelmetProvider>
  );
}

export default App;
