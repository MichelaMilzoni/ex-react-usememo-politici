import { memo } from "react";

//* Definisco la funzione componente PoliticianCard che riceverà l'oggetto politician come unica prop
function PoliticianCard({ politician }) {
  // Log per la verifica (prima del return)
  console.log("[Card Rendered] " + politician.name);

  // Ritorna SOLO la singola card
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

export default memo(PoliticianCard);
