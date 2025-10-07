import React, { memo } from "react";

//* Definisco la funzione componente PoliticianCard che riceverà l'oggetto politician come unica prop
function PoliticianCard({ politician }) {
  // Log di verifica per la Milestone 3
  console.log("[Card Rendered] " + politician.name);

  return (
    <div className="politician-card">
      <img
        src={politician.image}
        alt={politician.name}
        style={{ width: "100px", height: "100px", objectFit: "cover" }}
      />
      <h2>{politician.name}</h2>
      <p>Ruolo: {politician.position}</p>
      <p>{politician.biography}</p>
    </div>
  );
}

//* Esporto il componente avvolto in memo per l'ottimizzazione
export default memo(PoliticianCard);
