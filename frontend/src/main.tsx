import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@/styles/index.css";
import { AuthProvider } from "./contexts/authContext";
import { PlayerProvider } from "./contexts/playerContext";
import App from "@/App";
import { Provider } from "react-redux";
import { store } from "./store";
import { FavoriteProvider } from "./contexts/favoriteContext";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <AuthProvider>
        <PlayerProvider>
          <FavoriteProvider>
            <App />
          </FavoriteProvider>
        </PlayerProvider>
      </AuthProvider>
    </Provider>
  </StrictMode>,
);
