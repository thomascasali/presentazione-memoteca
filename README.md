# Conoscenza che attraversa i progetti — come ho costruito un sistema di conoscenza per Claude Code

Presentation available in English: https://thomascasali.github.io/presentazione-kb-workflow/?lang=en

▶️ **Vedi la presentazione**: https://thomascasali.github.io/presentazione-kb-workflow/

Nuova versione in prova (un unico mazzo reveal.js, tastiera, IT/EN): cartella [`v2/`](v2/index.html), online su `/v2/` dopo la pubblicazione.

Presentazione interattiva su come funziona `claude-kb-workflow`, rivolta a chi si avvicina alla programmazione: un flusso a tre livelli (sessioni → wiki → KB stabile) per far arrivare all'AI, su ogni progetto, quello che ha imparato lavorando sugli altri.

Ora è bilingue italiano/inglese: un selettore di lingua in apertura sull'indice propaga la scelta a tutti e cinque gli atti (salvata in `localStorage`, sovrascrivibile con `?lang=en` o `?lang=it` in URL).

## Contenuti

| Atto | Titolo | Argomenti | Slide |
|------|--------|-----------|-------|
| 1 | Il problema | L'amnesia dell'AI, prodotti reali gestiti nei ritagli di tempo, l'idea di Karpathy | 6 |
| 2 | L'architettura | I tre livelli, l'esame di promozione, l'orchestra di agenti | 6 |
| 3 | Le tre storie | 10 agenti fantasma e il bug dei 4 caratteri; il recupero in un'ora e la memoria vista dall'alto; i 26 errori | 10 |
| 4 | La macchina completa | Il workflow end-to-end, l'orchestrazione parallela, wiki e KB anche per gli agenti, le skill in pratica, cosa c'è nel repo | 7 |
| 5 | Perché lo regalo | Mappa vs territorio, le 3 lezioni trasferibili, come provarlo | 6 |
| Appendice | Sotto il cofano | Estratti reali dal repo pubblico: bootstrap di sessione, CLAUDE.md globale e di progetto, orchestratore, agente, skill, pagina wiki, KB stabile | 10 |
| Appendice B | Una sessione vera | Simulatore a 3 scenari (Flutter, portale web, debug) con terminale e pannello attori | 3 |

## Caratteristiche

- **48 slide** interattive in 5 atti più due appendici
- **4 simulatori interattivi veri** (viaggio di un fatto attraverso l'esame, orchestra in azione, spot the bug, sessione reale a 3 scenari)
- Design moderno con tema scuro, palette diversa per ogni atto
- Navigazione da tastiera (frecce, spazio, ESC, tasti numerici 1-9)
- Responsive per mobile, tablet e proiettore/LIM

## Tecnologie

- HTML5 + CSS3
- React 18 (via CDN, zero build)
- Babel standalone (transpiler JSX in-browser)
- Google Fonts (Fraunces, Public Sans, IBM Plex Mono)

Nessun bundler, nessun `npm install`: ogni file HTML è autonomo e si apre anche direttamente da `file://`.

## Come usarla in locale

1. Apri `index.html` nel browser (doppio click, oppure trascinalo nel browser)
2. Naviga tra gli atti cliccando sulle card della dashboard
3. Dentro un atto usa le frecce ← → o i pulsanti in basso per navigare tra le slide
4. Premi ESC per tornare all'indice, oppure un tasto da 1 a 9 per saltare direttamente a una slide

Non serve un server locale: essendo tutto CDN-based, funziona anche offline se il browser ha già in cache gli script (altrimenti serve una connessione internet per caricare React/Babel/i font da CDN).

## Come pubblicarla su GitHub Pages

1. Crea un repository GitHub (es. `presentazione-kb-workflow`) e carica il contenuto di questa cartella sul branch `main`
2. Vai su **Settings → Pages** del repository e imposta la sorgente su **GitHub Actions**
3. Il workflow incluso in `.github/workflows/static.yml` fa il deploy automatico ad ogni push su `main`
4. Dopo il primo deploy la presentazione sarà raggiungibile su `https://<tuo-utente>.github.io/<nome-repo>/`

Il workflow non richiede build step: pubblica l'intera cartella così com'è, perché tutti i file sono già HTML statico pronto per il browser.

## Autore

Thomas Casali — [GitHub](https://github.com/thomascasali) · [LinkedIn](https://www.linkedin.com/in/thomascasali/)
