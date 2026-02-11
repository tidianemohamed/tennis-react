# 🎾 Tennis Tournament Manager - Frontend (Vite + React)

Questo progetto è un'interfaccia ad alte prestazioni sviluppata con **Vite**, focalizzata sulla gestione dinamica di tornei di tennis.

### 1. Installazione

'npm install'

### 2. Avvia il server di sviluppo locale

'npm run dev'

### Indirizzo del server backend PHP

VITE_BACKEND_URL=http://localhost:8080/api

### Struttura del Progetto

src/ ├── assets/                  # Risorse statiche (immagini, icone, loghi)

     ├── components/            # Componenti UI divisi per funzione │   
        ├── bracket/            # Logica visuale del tabellone (BracketFlow, MatchNode) │   
        └── ui/                  # Elementi comuni (Navbar, AddPlayer, CreateTournament) 

     ├── features/              # Moduli principali dell'applicazione │ 
        ├── player/             # Gestione atleti (PlayersPage.tsx, player.service.ts) 
        └── tournament/        # Gestione tornei (Dashboard.tsx, tournament.service.ts)

     ├── lib/                    # Configurazioni e utility esterne │   
         ├── api.ts              # Istanza Axios e configurazione URL del backend PHP   
         └── flow-utils.ts      # Helper per il calcolo delle posizioni nel tabellone

     ├── App.tsx                 # Punto di ingresso e gestione delle rotte (React Router) 
     |── main.tsx                # Rendering dell'applicazione nel DOM di Vite
     |── App.css
     |── index.css


### 🚀 Tecnologie e Stack

* **Vite**: Build tool e ambiente di sviluppo.
* **React 18**: Libreria per l'interfaccia utente.
* **TypeScript**: Per un codice robusto e auto-documentato.
* **Tailwind CSS**: Framework per lo styling utility-first.
* **Lucide React**: Iconografia vettoriale.
* **TanStack Query**: Gestione dello stato asincrono e caching delle API.

