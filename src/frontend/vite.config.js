// src/frontend/vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Questa configurazione è cruciale se Vite non riesce a trovare il file index.html
  // Se i tuoi file sono in src/frontend, spesso Vite si aspetta che il file root 
  // sia la directory in cui lo esegui.
  root: './', 
  build: {
    // Vite cerca index.html qui
    outDir: 'dist',
  },
  server: {
    // Opzionale: Assicurati che Vite carichi il tuo file di bootstrap corretto
    // Non è sempre necessario, ma aiuta se ci sono problemi di risoluzione.
    // Il tuo entry point è main.jsx, non index.html, quindi il problema è altrove.
  }
});