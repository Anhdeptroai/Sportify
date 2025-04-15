import React from "react";
import ReactDOM from "react-dom/client";
import AppRoutes from "./routes/AppRoutes.tsx";
import "./index.css";
import PlayerContextProvider from './models/context'

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
      <PlayerContextProvider>
          <AppRoutes />
      </PlayerContextProvider>
    
  </React.StrictMode>
);
