# Presentazione kb-workflow — Conoscenza che attraversa i progetti

## Stack Tecnologico
- HTML5 + CSS3 (CSS Grid, Flexbox, clamp(), media queries)
- React 18 via CDN (unpkg.com)
- Babel standalone per transpilazione JSX
- SVG per diagrammi e simulatori
- Google Fonts: Fraunces, Public Sans, IBM Plex Mono
- NESSUN bundler, NESSUN npm, NESSUN framework aggiuntivo. Solo file HTML standalone, apribili anche da `file://`.

## Architettura
- `index.html`: dashboard con le 5 card degli atti più le card delle due appendici (HTML/CSS puro, nessun React)
- `atto1-il-problema.html`, `atto2-larchitettura.html`, `atto3-le-storie.html`, `atto4-la-macchina.html`, `atto5-perche-lo-regalo.html`: un file HTML per atto
- `appendice-sotto-il-cofano.html`: appendice con estratti di file dal repo pubblico `claude-kb-workflow` alla v0.4.0 (orchestratore da `docs/orchestrazione.md`, agente `deep-reasoner`, skill `verifica-prima-di-completare`, schema della wiki, `/kb-promote`), più il CLAUDE.md di questo stesso repo e uno schema semplificato del CLAUDE.md globale (file personale, non nel repo). Gli estratti vanno copiati dai file reali, mai riscritti a memoria; nella versione EN sono tradotti, con la nota "translated excerpts; the original file is in Italian" (l'orchestratore EN è il blocco reale di `docs/orchestration.md`)
- `appendice-b-una-sessione-vera.html`: appendice con un simulatore a 3 scenari (Flutter, portale web, debug) che rigioca una sessione di lavoro passo-passo, terminale finto + pannello attori "Dietro le quinte"
- Ogni file atto (e le appendici) è completamente standalone (include React, Babel, CSS inline)
- I componenti React sono definiti dentro un tag `<script type="text/babel">` nel file HTML

## Design System
Tema scuro "Quaderno di campo" (carta scura, accenti caldi) con questi colori (definiti come oggetto `colors` in ogni file atto):
```js
const colors = {
  bg: '#15120f', bgCard: '#1e1a15', bgLight: '#29231d',
  accent: '...',      // varia per atto, vedi tabella sotto
  accentAlt: '...',   // variante più chiara dello stesso accent
  text: '#f4eee3', textDim: '#d2c8b8', textMuted: '#a89a83',
  border: '#3c332a',
  success: '#6fae5c', danger: '#e0563a', warn: '#d9a441',
  info: '#4e93b8', purple: '#a879c4'
};
```

### Palette per atto

| Atto | Titolo | Accent | Accent-alt | Icona |
|------|--------|--------|------------|-------|
| 1 | Il problema | `#d9a441` (oro) | `#f0c169` | 🧠 |
| 2 | L'architettura | `#4fa88d` (verde) | `#7fcbb3` | 🏗️ |
| 3 | Le tre storie | `#d1603d` (terracotta) | `#e88f6c` | 📖 |
| 4 | La macchina completa | `#4e93b8` (blu-info) | `#7ab8d6` | ⚙️ |
| 5 | Perché lo regalo | `#a879c4` (viola) | `#c9a3de` | 🎁 |
| Appendice | Sotto il cofano | `#6fae5c` (verde/success) | `#98c98a` | 🔧 |
| Appendice B | Una sessione vera | `#b5566a` (rosa cotto/vinaccia) | `#dd93a2` | 🖥️ |

## Componenti Riutilizzabili (da definire in ogni file atto)
- `Box({ type, title, children })`: callout `info` / `warn` / `danger` / `tip` / `success`
- `Glow({ children, color })`: card con bordo luminoso gradient
- `StatBlock` (solo Atto 3): numero grande + etichetta, per i 26/4/1 della Storia 3
- `Code`-style block (solo Atto 3, dentro `SpotTheBug`): blocco monospace stile terminale

## Struttura Slide

Ogni atto segue questa struttura:
1. Slide titolo (centrata, icona, nome atto, titolo, sottotitolo)
2. Slide concetti/narrazione (con box informativi e, dove serve, diagrammi SVG)
3. Slide simulatore/i interattivo/i (Atto 2 ne ha 2, Atto 3 ha il componente "spot the bug")
4. Slide di chiusura atto con collegamento all'atto successivo

Conteggio slide: Atto 1 = 6, Atto 2 = 6, Atto 3 = 10, Atto 4 = 7, Atto 5 = 6, Appendice = 10, Appendice B = 3 → **48 slide totali**, 4 simulatori interattivi.

## Simulatori interattivi

- **Atto 2, slide 2.3 — "Il viaggio di un fatto"**: componente React con `useState` + `setInterval`. Un pallino si muove tra i riquadri Sessioni sporche → Wiki viva → esame → KB stabile. Quattro checkbox ("Verificato in produzione o su dispositivo reale", più tre ragioni: "Usato da 2+ progetti", "Gotcha già pagato", "Standard dichiarato") determinano se il pallino passa l'esame di promozione o si blocca: serve la verifica e almeno una delle tre ragioni.
- **Atto 2, slide 2.6 — "L'orchestra in azione"**: card cliccabili per i ruoli (Direttore, 4 specialisti, Controllore) con pannello informativo, più un bottone che anima una sequenza a step (con `setTimeout` incatenati) che mostra il ciclo lavoro → verifica → correzione → verifica → fine, includendo un passaggio in cui il controllore respinge il lavoro.
- **Atto 3, slide 3.3 — "Spot the bug"**: due blocchi di codice affiancati, uno corretto (`---`) e uno con il bug reale (`\---`). Un bottone rivela ed evidenzia il carattere di troppo con un'animazione CSS (`@keyframes pulseBug`).
- **Appendice B, slide B.2 — "Il simulatore"**: selettore a 3 schede (uno scenario ciascuna), replay manuale passo-passo (Avanti/Indietro/Ricomincia, nessun autoplay) con terminale finto ad auto-scroll a sinistra e pannello attori "Dietro le quinte" a destra (CLAUDE.md, KB stabile, LLM Wiki, specialista, skill, reviewer) che si illumina in base al passo corrente.

## Responsive Design
- Testo sempre con `clamp()`, mai `px` fissi per font-size dei contenuti
- SVG sempre con `viewBox`, mai dimensioni fisse in px
- Media query a `max-width: 768px` in ogni file: padding ridotto, font più piccoli, grid a 1 colonna dove serve (`.bug-grid`, `.stat-row`)
- Container principale: `maxWidth: '1200px'`, con padding laterale responsive

## Navigazione (uguale in tutti e 5 gli atti)
- Freccia destra / Spazio: slide successiva
- Freccia sinistra: slide precedente
- ESC: torna a `index.html`
- Tasti 1-9: salto diretto alla slide N (se esiste)
- Barra superiore fissa (`top-bar`): link indice, nome atto, contatore slide, progress bar
- Barra inferiore fissa (`bottom-bar`): bottoni indietro/avanti + link all'atto precedente (solo sulla prima slide) e all'atto successivo (solo sull'ultima slide, sull'Atto 5 diventa "Torna all'indice")

## Vincoli di contenuto (da rispettare in ogni modifica futura)
- Mai IP, porte o path di server/macchine privati
- Mai nomi di persone terze (solo "il prof", "io", "voi studenti")
- Non usare i conteggi (numero di progetti, di siti, di agenti ecc.) come argomento di vanto; i numeri di una storia al passato restano solo se datati ("allora", versione)
- Mai nomi (né sigle né abbreviazioni) di progetti non pubblici: citabili solo i prodotti pubblici elencati qui sotto
- I nomi di prodotti pubblici del prof (fivbeach.com, maraffaonline.it, tornei.app, beacharena.it, palabvu.it, aibvc.app, clubseries.app, centrosportivo.online) sono citabili e vanno resi cliccabili con `target="_blank"`
- Sono citabili anche le app mobile pubblicate negli store: FiChess, TeamToDo (oltre alle versioni mobile di BeachArena, ClubSeries, già citabili come prodotti web) — niente link cliccabile per queste, sono app da store, non siti. Tutte su App Store + Play Store (una sola riga sotto i badge, non ripetuta per ogni app). MaraffaOnline NON è pubblicata negli store: resta citabile solo come prodotto web (maraffaonline.it)
- Il repo `https://github.com/thomascasali/claude-kb-workflow` diventa pubblico l'18 agosto 2026: fino ad allora il link nella slide finale va mantenuto con l'etichetta "pubblico dal 18/08/2026"

## Link GitHub Pages
https://thomascasali.github.io/presentazione-memoteca/
