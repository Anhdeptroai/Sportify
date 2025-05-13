import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from 'react-router-dom';
import AuthContextProvider from './controllers/authContext.tsx';
import PlayerContextProvider from './controllers/context.tsx';
import PlaylistContextProvider from './controllers/playlistContext.tsx';
import "./index.css";
import AppRoutes from "./routes/AppRoutes.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthContextProvider>
      <PlayerContextProvider>
        <PlaylistContextProvider>
          <BrowserRouter>
            <AppRoutes />          
          </BrowserRouter>
        </PlaylistContextProvider>
      </PlayerContextProvider>
    </AuthContextProvider>
  </React.StrictMode>
);
