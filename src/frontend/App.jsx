// 1. Importo React
import React from "react";

// 2. Importo il componente
import PoliticiansList from "./components/PoliticiansList.jsx";

// 3. Definisco il componente App
function App() {
  // 4. Il return deve contenere il JSX da mostrare. Qui inserisco il mio componente.
  return (
    <div className="App">
      <h1>Dati dei Politici dalla mia API</h1>
      {/* 5. Renderizzo (mostro) il componente PoliticiansList */}
      <PoliticiansList />
    </div>
  );
}

// 6. Esporto il componente App
export default App;
