import React, { useState, useEffect, useMemo, memo } from "react";
import PoliticianCard from "./PoliticianCard";

// ******************************************************
// Funzione Esterna per Filtro (Milestone 2 + Bonus)
// ******************************************************
const applyFilter = (data, query, positionFilter) => {
    // Caso base: se i dati non ci sono, restituisco array vuoto
    if (!data || data.length === 0) {
        return [];
    }
    
    let filteredData = data;

    // Filtro 1: Query (Nome/Biografia)
    if (query && query.trim() !== "") {
        const normalizedQuery = query.toLowerCase().trim();
        filteredData = filteredData.filter((politician) => {
            const nameMatch = politician.name?.toLowerCase().includes(normalizedQuery);
            const bioMatch = politician.biography?.toLowerCase().includes(normalizedQuery);
            return nameMatch || bioMatch;
        });
    }

    // Filtro 2: Posizione (Bonus)
    if (positionFilter && positionFilter !== 'All') {
        filteredData = filteredData.filter((politician) => 
            politician.position === positionFilter
        );
    }

    return filteredData;
};

// ******************************************************
// Componente Principale
// ******************************************************
function PoliticiansList() {
    // Stati di Base (Milestone 1)
    const [dataPoliticians, setDataPoliticians] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Stati di Ricerca (Milestone 2)
    const [searchQuery, setSearchQuery] = useState("");

    // Stati di Paginazione e Bonus
    const [currentPage, setCurrentPage] = useState(1); // Milestone 4
    const [selectedPosition, setSelectedPosition] = useState('All'); // Bonus
    const itemsPerPage = 6; // Definisco quanti elementi per pagina

    // ******************************************************
    // Logica di Fetch (Milestone 1 - Eseguita solo al mount)
    // ******************************************************
    useEffect(() => {
        const fetchPoliticians = async () => {
            try {
                // Milestone 2: Chiamata senza parametri per filtro lato client
                const response = await fetch("http://localhost:3333/politicians"); 
                if (!response.ok) {
                    throw new Error("Il server non risponde");
                }
                const data = await response.json();
                setDataPoliticians(data);
            } catch (error) {
                setError(error.message);
                console.error("Chiamata al server fallita:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchPoliticians();
    }, []); // Array di dipendenze vuoto: carica una sola volta.


    // ******************************************************
    // Logica Ottimizzata (Filtro, Paginazione e Totali)
    // ******************************************************
    const { 
        currentItems, 
        totalPages, 
        totalFilteredItems 
    } = useMemo(() => {
        // 1. FILTRAZIONE (Milestone 2 + Bonus)
        const filtered = applyFilter(dataPoliticians, searchQuery, selectedPosition);
        
        // 2. CALCOLO PAGINAZIONE (Milestone 4)
        const totalItems = filtered.length;
        const pages = Math.ceil(totalItems / itemsPerPage);
        
        // 3. TAGLIO ARRAY (Slice)
        const indexOfLastItem = currentPage * itemsPerPage;
        const indexOfFirstItem = indexOfLastItem - itemsPerPage;
        const paginated = filtered.slice(indexOfFirstItem, indexOfLastItem);
        
        // Se cambio filtro e la pagina corrente è oltre il nuovo totale, resetto
        if (currentPage > pages && pages > 0) {
             // Nota: questo chiamerà un re-render, ma è necessario per evitare bug
             // React gestisce lo stato e l'esecuzione degli hook in modo sequenziale
             setCurrentPage(pages);
        }
        
        return {
            currentItems: paginated,
            totalPages: pages,
            totalFilteredItems: totalItems
        };
    }, [dataPoliticians, searchQuery, selectedPosition, currentPage, itemsPerPage]); // Tutte le dipendenze per il ricalcolo

    // ******************************************************
    // Logica per le Posizioni Uniche (Bonus)
    // ******************************************************
    const uniquePositions = useMemo(() => {
        if (!dataPoliticians || dataPoliticians.length === 0) return ['All'];

        const positions = dataPoliticians
            .map(p => p.position)
            .filter(p => p); 
            
        return ['All', ...new Set(positions)]; 
    }, [dataPoliticians]);

    // Funzioni di navigazione (Milestone 4)
    const goToPage = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    return (
        <>
            <div className="politicians-container">
                {/* CONDIZIONI DI CARICAMENTO/ERRORE */}
                {isLoading && <h1>Caricamento dei politici...</h1>}
                {error && !isLoading && <h1 style={{ color: "red" }}>Errore nel recupero dati: {error}</h1>}

                {/* CONTROLLI FILTRI (Ricerca + Posizione) */}
                <div className="filter-controls" style={{ display: 'flex', gap: '20px', margin: '20px 0' }}>
                    
                    {/* Input di Ricerca (Milestone 2) */}
                    <input 
                        type="text" 
                        value={searchQuery}
                        onChange={(e) => {
                            setSearchQuery(e.target.value);
                            setCurrentPage(1); // Resetto pagina al cambio ricerca
                        }}
                        placeholder="Cerca per nome o biografia..."
                    />

                    {/* Select per la Posizione (Bonus) */}
                    <select 
                        value={selectedPosition}
                        onChange={(e) => {
                            setSelectedPosition(e.target.value);
                            setCurrentPage(1); // Resetto pagina al cambio filtro
                        }}
                    >
                        {uniquePositions.map(position => (
                            <option key={position} value={position}>
                                {position === 'All' ? 'Tutte le Posizioni' : position}
                            </option>
                        ))}
                    </select>
                </div>
                
                {/* VISUALIZZAZIONE DEI DATI */}
                {!isLoading && !error && (
                    <>
                        <p>Mostrando {currentItems.length} di {totalFilteredItems} risultati totali.</p>
                        
                        <div className="card-list">
                            {/* Mappa l'array paginato (Milestone 4) */}
                            {currentItems.map((politician) => (
                                <PoliticianCard
                                    key={politician.id}
                                    politician={politician} // Milestone 3: Card memoizzata
                                />
                            ))}
                        </div>
                        
                        {/* Gestione Nessun Risultato */}
                        {totalFilteredItems === 0 && (
                            <p style={{ marginTop: '20px' }}>Nessun politico trovato con i filtri selezionati.</p>
                        )}

                        {/* CONTROLLI PAGINAZIONE (Milestone 4) */}
                        {totalPages > 1 && (
                            <div className="pagination-controls" style={{ marginTop: '20px' }}>
                                <button
                                    onClick={() => goToPage(currentPage - 1)}
                                    disabled={currentPage === 1}
                                >
                                    Precedente
                                </button>
                                
                                {/* Pulsanti numerici (solo quelli necessari) */}
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                    <button 
                                        key={page}
                                        onClick={() => goToPage(page)}
                                        style={{ margin: '0 5px', fontWeight: currentPage === page ? 'bold' : 'normal' }}
                                    >
                                        {page}
                                    </button>
                                ))}

                                <button
                                    onClick={() => goToPage(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                >
                                    Successiva
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </>
    );
}

export default PoliticiansList;