//* IMPORTO react e hook
import React from "react";
import { useState, useEffect, useMemo, memo } from "react";

//* importo componenti
import PoliticianCard from "./PoliticianCard";

//* Preparo la Funzione di Filtro Esterna
const applyFilter = (data, query) => {
  //QUERY VUOTA: Se la query non è presente o è solo spazi, restituisco tutti i dati.
  if (!query || query.trim() === "") {
    return data;
  }

  //Converto la query una sola volta (più efficiente).
  const normalizedQuery = query.toLowerCase().trim();

  //Controllo name O biography con filter
  const newData = data.filter((politician) => {
    // Normalizzo il nome del politico e controllo se include la query
    const nameMatch = politician.name?.toLowerCase().includes(normalizedQuery);

    // Normalizzo la biografia e controllo se include la query
    const bioMatch = politician.biography?.toLowerCase().includes(normalizedQuery);

    // Restituisco true se c'è una corrispondenza nel nome O nella biografia
    return nameMatch || bioMatch;
  });

  return newData;
};

//* funzione componente
function PoliticiansList() {
  //* Inizializzo lo Stato e gli Effetti (Hook React)
  // Crea lo Stato per i Dati (politicians)
  const [dataPoliticians, setDataPoliticians] = useState([]);

  // Crea lo Stato per la Gestione (isLoading e error):
  const [isLoading, setIsLoading] = useState(true); //impostato su true perchè il componente caricherà subito i dati
  const [error, setError] = useState(null); //Sarà null finché non ci sarà un problema. In caso di fallimento, ci salverò il messaggio di errore.

  // --creo lo stato per salvare la query digitata dall'utente
  const [searchQuery, setSearchQuery] = useState("");

  //* Implemento la Chiamata API (useEffect)
  // Definisco la Funzione di Fetch
  // Chiamando useEffect(() => { ... }, [])
  // e al suo interno, definisco una funzione async chiamata fetchPoliticians.
  //? useEffect è il posto giusto per le operazioni che React non gestisce direttamente,
  //? come la comunicazione con un server esterno.
  useEffect(() => {
    const fetchPoliticians = async () => {
      // nel try effettuo la chiamata e controllo se la risposta è ok, se non lo è gestisco un nuovo errore
      try {
        const response = await fetch("http://localhost:3333/politicians");
        if (!response.ok) {
          throw new Error("Il server non risponde");
        }

        // converto i dati
        const data = await response.json();
        // aggiorno lo stato
        setDataPoliticians(data);
      } catch (error) {
        // Catturo l'errore come 'error'
        // Imposto l'errore usando la variabile catturata 'error'
        setError(error.message);
        console.error("Chiamata al server fallita:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPoliticians();
  }, []);

  //* ottimizzo con useMemo()
  // hook nativo di react al quale passo delle dipendenze, mi ritorna il risultato di un calcolo pesante
  // memorizzandolo nella variabile dichiarata
  const filteredPoliticians = useMemo(() => {
    return applyFilter(dataPoliticians, searchQuery);
  }, [dataPoliticians, searchQuery]);

  return (
    <>
      <div className="politicians-container">
        {/* CONDIZIONE DI CARICAMENTO */}
        {isLoading && <h1>Caricamento dei politici...</h1>}

        {/* CONDIZIONE DI ERRORE */}
        {error && !isLoading && <h1 style={{ color: "red" }}>Errore nel recupero dati: {error}</h1>}

        <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
        {/* VISUALIZZAZIONE DEI DATI */}
        {!isLoading && !error && (
          <div className="card-list">
            {filteredPoliticians.map((politician) => (
              // Sostituisco l'intero vecchio div con la Card ottimizzata
              <PoliticianCard
                // La key è cruciale per il map
                key={politician.id}
                // Passo l'oggetto intero come prop per la memorizzazione
                politician={politician}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default PoliticiansList;
