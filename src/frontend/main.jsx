import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx"; // Solo l'App radice

// Rimuovi: import PoliticiansList from './components/PoliticiansList.jsx'; // NON SERVE QUI

// Ottiene l'elemento HTML dove React disegnerà l'interfaccia
const container = document.getElementById("root");
const root = createRoot(container);

// Esegue il rendering (mostra) SOLO il componente App
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
