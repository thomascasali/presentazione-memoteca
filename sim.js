/* Simulatore "una sessione vera": nove scenari illustrativi in tre parti, JS vanilla. */
(function () {
  'use strict';
  var A = function (id, label, tier) { return { id: id, label: label, tier: tier || '' }; };

  var DATA = {
    it: [
      {
        tab: 'Notifiche push', term: '~/mia-app, sessione simulata',
        actors: [A('claudemd', 'CLAUDE.md'), A('kb', 'KB stabile e wiki'), A('specialist', 'integrations', 'Sonnet'), A('quick', 'quick-worker', 'Haiku'), A('skill', 'verifica-prima-di-completare'), A('reviewer', 'reviewer', 'Opus')],
        steps: [
          { l: [['prompt', 'Aggiungi le notifiche push web alla mia app']], on: ['claudemd'], n: 'Il CLAUDE.md è già caricato prima del prompt: contiene la politica del lead.' },
          { l: [['lead', 'Lead: guardo se in KB c\'è un pattern sul push web, prima di scrivere codice...']], on: ['kb'], n: 'Il lead cerca in KB invece di partire subito.' },
          { l: [['kb', 'KB: pattern 15, push web con FCM HTTP v1 senza SDK lato server'], ['kb', 'payload solo dati, token invalidi da potare, senza credenziali la funzione non fa nulla'], ['kb', 'trappola: un worker con la config cache sbagliata smette di consumare i job, senza errori']], on: ['kb'], n: 'Una trappola già pagata: nessun errore, solo notifiche che non partono.' },
          { l: [['agent', 'Lead → integrations: implementa il push seguendo il pattern 15']], on: ['specialist'], n: 'Un dominio con pattern propri va allo specialista (Sonnet), anche se il lavoro sembra piccolo.' },
          { l: [['agentresp', 'integrations: JWT RS256 firmato a mano, scambio OAuth, invio su messages:send, token invalidi potati']], on: ['specialist'], n: 'Lo specialista segue il pattern invece di ripartire dall\'SDK.' },
          { l: [['skill', 'verifica-prima-di-completare: accodo un job e controllo che la coda torni a zero da sola'], ['agentresp', 'integrations: config:clear && config:cache all\'avvio del worker, coda a zero']], on: ['skill', 'specialist'], n: 'La skill scatta sul "fatto" e chiede una prova, non un "dovrebbe funzionare".' },
          { l: [['agent', 'Lead → quick-worker: dai log locali, elenca gli errori di invio dell\'ultima ora'], ['agentresp', 'quick-worker: nessun errore di invio nel log']], on: ['quick'], n: 'Piccolo, chiuso, provabile con un comando: va su Haiku, il default.' },
          { l: [['reviewer', 'reviewer: senza credenziali la funzione deve restare inattiva, non lanciare errori. Provato?'], ['agentresp', 'integrations: provato, nessun crash'], ['reviewer', 'reviewer: approvato']], on: ['reviewer', 'specialist'], n: 'Il gate: un secondo contesto, pulito, controlla prima del "fatto".' },
          { l: [['command', '/kb-ingest'], ['success', 'La sessione entra nella wiki: il pattern 15 è stato usato su un altro progetto']], on: ['kb'], n: 'Per cambiare la KB stabile, serve l\'esame di promozione. Qui il pattern è già lì: la sessione lo conferma.' }
        ],
        moral: 'Il secondo progetto non ha ripagato quello che il primo aveva già pagato.'
      },
      {
        tab: 'Sessione cloud', term: '~/mio-progetto, sessione cloud simulata',
        actors: [A('claudemd', 'CLAUDE.md'), A('cloud', 'Sessione cloud'), A('kb', 'KB e wiki, sola lettura'), A('handoff', 'docs/kb-handoff/'), A('wiki', 'Wiki locale')],
        steps: [
          { l: [['prompt', 'Correggi gli arrotondamenti nei totali dei preventivi']], on: ['claudemd', 'cloud'], n: 'Una sessione cloud parte da un clone del repo: vede il progetto, non il tuo computer.' },
          { l: [['lead', 'Lead: cerco in KB un pattern sugli importi arrotondati'], ['kb', 'KB: letta, nessun pattern. Da qui è in sola lettura']], on: ['kb'], n: 'La KB si legge anche dal cloud. Non si scrive.' },
          { l: [['lead', 'Lead: causa trovata, si sommano importi già arrotondati. Arrotondo una volta sola, sul totale'], ['success', 'test sui preventivi: verdi']], on: ['cloud'], n: 'Il lavoro si fa e si prova come in locale.' },
          { l: [['lead', 'Lead: la lezione vale anche per altri progetti, ma da qui non posso scriverla né in KB né in wiki']], on: ['kb', 'cloud'], n: 'Meglio dichiararlo che perderla.' },
          { l: [['command', 'scrivo docs/kb-handoff/arrotondamenti.md'], ['success', 'nota nel repo: cosa è successo, come è stato provato, nessun segreto']], on: ['handoff'], n: 'La nota viaggia con il repo, nello stesso commit del fix.' },
          { l: [['prompt', '(sul tuo computer) /kb-ingest lesson arrotondamenti, dal testo di docs/kb-handoff/arrotondamenti.md']], on: ['wiki'], n: '/kb-ingest non legge docs/kb-handoff/: la nota si porta in wiki a mano, come testo della lezione.' },
          { l: [['success', 'wiki: sorgente salvata, pagina del progetto aggiornata, riga nel log'], ['lead', 'Lead: tolgo la nota da docs/kb-handoff/ e faccio il commit']], on: ['wiki', 'handoff'], n: 'La nota ha fatto da ponte, poi sparisce: la fonte resta la wiki.' }
        ],
        moral: 'Una sessione che non può scrivere in KB lascia una nota, non una lezione persa.'
      },
      {
        tab: 'Promozione in KB', term: '~/llm-wiki, sessione simulata',
        actors: [A('claudemd', 'CLAUDE.md'), A('wiki', 'Wiki: concepts/'), A('exam', '/kb-promote'), A('kb', 'KB stabile: patterns')],
        steps: [
          { l: [['prompt', '/kb-promote idempotenza-webhook']], on: ['exam'], n: 'La promozione è un esame, non un copia e incolla.' },
          { l: [['lead', 'Lead: leggo wiki/concepts/idempotenza-webhook.md'], ['kb', 'wiki: visto in 2 progetti, verificato in produzione in entrambi']], on: ['wiki'], n: 'La wiki dice cosa è stato visto e dove.' },
          { l: [['kb', '[x] usato da almeno 2 progetti'], ['kb', '[x] verificato in produzione'], ['kb', '[x] non già in patterns/patterns.md']], on: ['exam'], n: 'Basta una condizione tra tre (qui, i 2 progetti). In più: verificato in produzione e non già presente.' },
          { l: [['success', 'promosso: nuova sezione in patterns/patterns.md'], ['command', 'nota «Promosso» nel concetto, riga PROMOTE in wiki/log.md, un commit per repo']], on: ['kb', 'wiki'], n: 'Wiki e KB cambiano insieme, e il log lo registra.' },
          { l: [['prompt', '/kb-promote ordine-colonne-export']], on: ['exam'], n: 'Un secondo concetto, stesso esame.' },
          { l: [['kb', '[ ] usato da almeno 2 progetti: no, uno solo'], ['kb', '[ ] gotcha da almeno un\'ora: no'], ['kb', '[ ] dichiarato standard: no']], on: ['exam', 'wiki'], n: 'Nessuna delle tre condizioni vale.' },
          { l: [['lead', 'Lead: esame non superato, il concetto resta in wiki. Se lo rivedi in un altro progetto, si ripete']], on: ['wiki'], n: 'La KB resta piccola. La wiki può tenere ciò che è ancora una sola osservazione.' }
        ],
        moral: 'Una lezione entra in KB quando ha retto in più di un posto.'
      },
      {
        tab: 'Firma dei genitori', term: '~/portale-scuola, sessione simulata',
        actors: [A('claudemd', 'CLAUDE.md'), A('kb', 'KB stabile e wiki'), A('specialist', 'backend-dev', 'Sonnet'), A('skill', 'security', 'Opus'), A('reviewer', 'reviewer', 'Opus')],
        steps: [
          { l: [['prompt', 'I genitori devono poter firmare le autorizzazioni online sul portale della scuola']], on: ['claudemd'], n: 'I genitori non hanno un account: non è un login standard.' },
          { l: [['lead', 'Lead: firma per persone senza account, in KB c\'è qualcosa?']], on: ['kb'], n: 'Il lead cerca un pattern prima di improvvisare un flusso di firma.' },
          { l: [['kb', 'KB: pattern 14, OTP via email come firma elettronica semplice'], ['kb', 'link monouso, OTP a 6 cifre con pepper, circa 10 minuti, tetto di 5 tentativi'], ['kb', 'avvertenza: non è una firma qualificata, con minori serve un parere legale']], on: ['kb'], n: 'Il pattern è nato in produzione su due portali, e dice anche dove finisce la sua validità.' },
          { l: [['agent', 'Lead → backend-dev e security: firma OTP sul pattern 14, rivedete insieme i punti critici']], on: ['specialist', 'skill'], n: 'Implementazione e sicurezza procedono appaiate: Sonnet per il codice, Opus per la sicurezza.' },
          { l: [['agentresp', 'backend-dev: link monouso, OTP con hash e pepper, sessione breve, record di firma con hash del documento'], ['agent2', 'security: rate limit sui tentativi, blocco dopo 5']], on: ['specialist', 'skill'], n: 'Ognuno lavora la sua parte dello stesso pattern.' },
          { l: [['reviewer', 'reviewer: dopo la firma, il documento può ancora cambiare?']], on: ['reviewer'], n: 'Il reviewer prova il caso che nessuno aveva nominato.' },
          { l: [['agentresp', 'backend-dev: no, una volta firmato è immutabile; una modifica sostanziale invalida le firme']], on: ['specialist'], n: 'La risposta era già nel pattern, non improvvisata.' },
          { l: [['reviewer', 'reviewer: approvato']], on: ['reviewer'], n: 'Controllato, si chiude.' },
          { l: [['command', '/kb-ingest'], ['success', 'Pattern 14 usato un\'altra volta, e la sessione è in wiki']], on: ['kb'], n: 'Non è un pattern nuovo: è la stessa regola vista reggere ancora.' }
        ],
        moral: 'I requisiti di sicurezza erano già scritti prima di aprire l\'editor.'
      },
      {
        tab: 'Sale di livello', term: '~/mia-app, sessione simulata',
        actors: [A('claudemd', 'CLAUDE.md'), A('quick', 'quick-worker', 'Haiku'), A('fast', 'fast-worker', 'Sonnet'), A('deep', 'deep-reasoner', 'Opus'), A('reviewer', 'reviewer', 'Opus')],
        steps: [
          { l: [['prompt', 'Porta i test di tutti i moduli al nuovo formato di configurazione']], on: ['claudemd'], n: 'Il lead parte dal livello più economico che basta.' },
          { l: [['lead', 'Lead: il come è deciso e un comando lo prova. Parto da quick-worker'], ['agent', 'Lead → quick-worker: converti i test del modulo A e lancia la suite']], on: ['quick'], n: 'Modifica meccanica, provabile: Haiku.' },
          { l: [['agentresp', 'quick-worker: 12 file convertiti, 3 test falliscono. Causa non trovata, mi fermo']], on: ['quick'], n: 'Haiku dice dove si è fermato invece di tirare a indovinare.' },
          { l: [['lead', 'Lead: serve trovare una causa. Rilancio su fast-worker con il lavoro di Haiku allegato'], ['agent', 'Lead → fast-worker: i 12 file sono già convertiti, trova perché falliscono 3 test']], on: ['fast'], n: 'Si sale di un livello, senza rifare il lavoro già fatto.' },
          { l: [['agentresp', 'fast-worker: gli helper condivisi ordinano i dati in modo diverso nel nuovo formato. Due strade: adattatore o riscrittura']], on: ['fast'], n: 'Sonnet trova la causa e incontra una scelta che pesa sui moduli futuri.' },
          { l: [['agent', 'Lead → deep-reasoner: adattatore o riscrittura degli helper? Risposta in 10 righe'], ['agentresp', 'deep-reasoner: riscrittura. Adattatore solo per il modulo B, che dipende da un\'API esterna']], on: ['deep'], n: 'Una scelta di design va a Opus.' },
          { l: [['agentresp', 'fast-worker: helper riscritti, test verdi in tutti i moduli'], ['reviewer', 'reviewer: eseguita la suite intera, non solo il modulo A. Approvato']], on: ['fast', 'reviewer'], n: 'Il gate chiude: un contesto pulito controlla prima del «fatto».' }
        ],
        moral: 'Si sale di livello solo per un motivo che si sa dire.'
      },
      {
        tab: 'Rinomina su più repo', term: '~/mio-progetto, sessione simulata',
        actors: [A('claudemd', 'CLAUDE.md'), A('quick', 'quick-worker', 'Haiku'), A('reviewer', 'reviewer', 'Opus'), A('log', 'Review log, in KB')],
        steps: [
          { l: [['prompt', 'Rinomina il progetto da vecchio-nome a nuovo-nome: codice, sito e documentazione']], on: ['claudemd'], n: 'Tre repo, un nome da cambiare.' },
          { l: [['lead', 'Lead: piano in tre parti. Codice, sito, documentazione: file diversi, nessuna dipendenza tra loro'], ['lead', 'Lead: vanno in parallelo, ognuno con un comando che prova il lavoro']], on: ['claudemd'], n: 'Il lead pianifica e delega. Il suo contesto resta libero.' },
          { l: [['agent', 'Lead → quick-worker (codice): sostituisci il nome, poi grep deve dare zero'], ['agent', 'Lead → quick-worker (sito): sostituisci il nome nelle pagine, poi grep a zero'], ['agent', 'Lead → quick-worker (documentazione): sostituisci nome e link, poi grep a zero']], on: ['quick'], n: 'Tre agenti insieme, lavoro meccanico con prova: Haiku.' },
          { l: [['agentresp', 'codice: 41 occorrenze, grep a zero'], ['agentresp', 'sito: 18 occorrenze, grep a zero'], ['agentresp', 'documentazione: 27 occorrenze e i link interni, grep a zero']], on: ['quick'], n: 'Ognuno riporta l\'esito del suo comando.' },
          { l: [['lead', 'Lead: repo rinominato su GitHub. Provo un vecchio link: apre il nuovo indirizzo'], ['success', 'i vecchi link vengono reindirizzati']], on: ['claudemd'], n: 'GitHub reindirizza gli indirizzi del repo rinominato. I link fuori dal repo continuano a funzionare.' },
          { l: [['reviewer', 'reviewer: ultimo SHA registrato nel review log: a1b2c3d. Rivedo solo git diff a1b2c3d..HEAD']], on: ['reviewer', 'log'], n: 'Review log incrementale: si guarda ciò che è cambiato dall\'ultimo SHA registrato, non l\'intero progetto.' },
          { l: [['reviewer', 'reviewer: nessun riferimento rimasto al vecchio nome. Approvato'], ['success', 'review log aggiornato: nuovo SHA, esito, nessun finding aperto']], on: ['reviewer', 'log'], n: 'La voce nel log è il punto di partenza della prossima review.' }
        ],
        moral: 'Il lavoro si divide in parallelo, la review guarda solo il diff.'
      },
      {
        tab: 'Ordine non pagato', term: '~/negozio-online, sessione simulata',
        actors: [A('claudemd', 'CLAUDE.md'), A('kb', 'KB stabile e wiki'), A('skill', 'debugging-sistematico'), A('quick', 'quick-worker', 'Haiku'), A('specialist', 'backend-dev', 'Sonnet'), A('reviewer', 'reviewer', 'Opus')],
        steps: [
          { l: [['prompt', 'Un cliente ha pagato ma l\'ordine risulta non pagato']], on: ['claudemd'], n: 'Arriva un bug in produzione, non una richiesta di funzione.' },
          { l: [['skill', 'debugging-sistematico: nessun fix d\'istinto prima della causa radice']], on: ['skill'], n: 'Nessuno l\'ha chiamata: bug e stato incoerente corrispondono alla sua description.' },
          { l: [['lead', 'Lead: prima di toccare il codice, cerco in KB "webhook pagamento"']], on: ['kb'], n: 'La skill impone il passo, il lead lo esegue.' },
          { l: [['kb', 'KB: pattern 16, un webhook può dire "paid" prima che la transazione si consolidi, e può arrivare due volte'], ['kb', 'fix: stato autorevole dall\'API del provider, settle idempotente con lock di riga sull\'ID transazione']], on: ['kb'], n: 'Il pattern descrive la forma di questo bug prima di aprire i log.' },
          { l: [['agent', 'Lead → quick-worker: dal log locale del webhook, estrai le consegne per questo ordine'], ['agentresp', 'quick-worker: due consegne, la seconda ha riscritto lo stato con un valore vecchio']], on: ['quick'], n: 'Lettura di un log già scaricato: lavoro piccolo e chiuso, su Haiku.' },
          { l: [['agent', 'Lead → backend-dev: correggi seguendo il pattern 16']], on: ['specialist'], n: 'La correzione è il lavoro di dominio: Sonnet, con il pattern allegato.' },
          { l: [['agentresp', 'backend-dev: stato chiesto al provider a ogni webhook, settle idempotente sotto lock di riga']], on: ['specialist'], n: 'Il fix segue la ricetta del pattern.' },
          { l: [['reviewer', 'reviewer: replay del webhook due volte sullo stesso ordine, lo stato resta corretto'], ['reviewer', 'reviewer: approvato']], on: ['reviewer'], n: 'Verifica riproducendo il difetto, non guardando l\'ordine di ieri.' },
          { l: [['command', '/kb-ingest'], ['success', 'La sessione conferma il pattern 16 su un altro progetto']], on: ['kb'], n: 'Il pattern regge ancora, altrove.' }
        ],
        moral: 'Forzare l\'ordine a "pagato" a mano avrebbe nascosto il bug.'
      },
      {
        tab: 'Il reviewer dice no', term: '~/mio-progetto, sessione simulata',
        actors: [A('claudemd', 'CLAUDE.md'), A('fast', 'fast-worker', 'Sonnet'), A('reviewer', 'reviewer', 'Opus'), A('kb', 'KB stabile e wiki')],
        steps: [
          { l: [['prompt', 'Prima del rilascio, passa lo scanner anti-segreti del progetto su tutto il repo']], on: ['claudemd'], n: 'Un controllo di routine.' },
          { l: [['agent', 'Lead → fast-worker: esegui lo scanner su tutto il repo'], ['agentresp', 'fast-worker: exit 0, nessun ritrovamento']], on: ['fast'], n: 'Il risultato sembra pulito.' },
          { l: [['reviewer', 'reviewer: exit 0 non basta. Quali file ha letto lo scanner?'], ['reviewer', 'reviewer: salta i file con estensione .doc, anche quando sono testo. In un .doc di prova c\'è una chiave finta e non la vede']], on: ['reviewer'], n: 'Il reviewer controlla il metodo, non solo l\'esito. Questo era un falso pulito.' },
          { l: [['reviewer', 'reviewer: non approvato']], on: ['reviewer'], n: 'Il gate può dire di no.' },
          { l: [['agent', 'Lead → fast-worker: un file senza byte NUL va sempre letto, qualunque estensione. L\'elenco vale solo per i file che contengono NUL'], ['agentresp', 'fast-worker: corretto. Test aggiunto: un .doc di testo con una chiave finta ora viene segnalato']], on: ['fast'], n: 'La correzione arriva con un test che prima avrebbe fallito.' },
          { l: [['reviewer', 'reviewer: secondo giro sul diff della correzione. Il .doc di testo è letto, un binario vero con NUL resta saltato. Approvato']], on: ['reviewer'], n: 'Nuova review, nuovo verdetto.' },
          { l: [['command', '/kb-ingest lesson un «pulito» va letto insieme a cosa è stato scansionato'], ['success', 'La lezione entra in wiki']], on: ['kb'], n: 'Per diventare KB stabile dovrà superare l\'esame di promozione.' }
        ],
        moral: 'Un risultato pulito vale quanto ciò che è stato letto.'
      },
      {
        tab: 'Segreto nel commit', term: '~/mia-app, sessione simulata',
        actors: [A('claudemd', 'CLAUDE.md'), A('hook', 'hook pre-commit'), A('human', 'Tu'), A('fast', 'fast-worker', 'Sonnet')],
        steps: [
          { l: [['prompt', 'Fai il commit della configurazione delle notifiche']], on: ['claudemd'], n: 'Una richiesta ordinaria.' },
          { l: [['command', 'git commit -m "config: notifiche"']], on: ['hook'], n: 'Il hook pre-commit parte da solo, prima che il commit esista.' },
          { l: [['warn', 'config/notifiche.yml:14:GOOGLE_API_KEY'], ['warn', '[pre-commit] commit BLOCCATO: secret rilevati nei file in staging']], on: ['hook'], n: 'Lo scanner dice file, riga e tipo. Il valore non viene mai stampato.' },
          { l: [['lead', 'Lead: mi fermo. Non stampo il valore, non lo cancello da solo, non aggiro il blocco']], on: ['claudemd'], n: 'Il commit resta fermo finché il segreto c\'è.' },
          { l: [['lead', 'Lead: la chiave è già finita altrove (log, chat, backup)? Se sì, va ruotata. Decidi tu']], on: ['human'], n: 'Ruotare una chiave dipende da dove è stata vista. La decisione resta all\'umano.' },
          { l: [['prompt', 'La ruoto io. Nel file lascia il nome di una variabile d\'ambiente']], on: ['human'], n: 'Il valore vero va nell\'ambiente del servizio, non nel repo.' },
          { l: [['agent', 'Lead → fast-worker: sostituisci il valore con la variabile e ripeti la scansione'], ['agentresp', 'fast-worker: file aggiornato, scanner senza ritrovamenti, commit riuscito']], on: ['fast'], n: 'Un file con un segreto non va a Haiku: il quick-worker non li legge.' }
        ],
        moral: 'Lo scanner ferma il commit, l\'umano decide sulla chiave.'
      }
    ],
    en: [
      {
        tab: 'Push notifications', term: '~/my-app, simulated session',
        actors: [A('claudemd', 'CLAUDE.md'), A('kb', 'Stable KB and wiki'), A('specialist', 'integrations', 'Sonnet'), A('quick', 'quick-worker', 'Haiku'), A('skill', 'verifica-prima-di-completare'), A('reviewer', 'reviewer', 'Opus')],
        steps: [
          { l: [['prompt', 'Add web push notifications to my app']], on: ['claudemd'], n: 'CLAUDE.md is already loaded before the prompt: it holds the lead\'s policy.' },
          { l: [['lead', 'Lead: checking the KB for a web push pattern before writing code...']], on: ['kb'], n: 'The lead looks in the KB instead of starting right away.' },
          { l: [['kb', 'KB: pattern 15, web push through FCM HTTP v1 without the server SDK'], ['kb', 'data-only payloads, prune invalid tokens, no credentials means the feature does nothing'], ['kb', 'trap: a worker with the wrong config cache stops consuming jobs, with no errors']], on: ['kb'], n: 'A trap already paid for: no errors, just notifications that never go out.' },
          { l: [['agent', 'Lead → integrations: implement push following pattern 15']], on: ['specialist'], n: 'A domain with its own patterns goes to its specialist (Sonnet), even if the job looks small.' },
          { l: [['agentresp', 'integrations: RS256 JWT signed by hand, OAuth exchange, send via messages:send, invalid tokens pruned']], on: ['specialist'], n: 'The specialist follows the pattern instead of starting from the SDK.' },
          { l: [['skill', 'verifica-prima-di-completare: I enqueue a job and check that the queue drains to zero by itself'], ['agentresp', 'integrations: config:clear && config:cache at worker start, queue at zero']], on: ['skill', 'specialist'], n: 'The skill fires on "done" and asks for proof, not "it should work".' },
          { l: [['agent', 'Lead → quick-worker: from the local logs, list the send errors of the last hour'], ['agentresp', 'quick-worker: no send errors in the log']], on: ['quick'], n: 'Small, closed, provable with one command: Haiku, the default.' },
          { l: [['reviewer', 'reviewer: with no credentials the feature must stay inactive, not throw. Tried?'], ['agentresp', 'integrations: tried, no crash'], ['reviewer', 'reviewer: approved']], on: ['reviewer', 'specialist'], n: 'The gate: a second, clean context checks before "done".' },
          { l: [['command', '/kb-ingest'], ['success', 'The session enters the wiki: pattern 15 was used on another project']], on: ['kb'], n: 'Changing the stable KB takes the promotion exam. Here the pattern is already there: the session confirms it.' }
        ],
        moral: 'The second project did not repay what the first one had already paid for.'
      },
      {
        tab: 'Cloud session', term: '~/my-project, simulated cloud session',
        actors: [A('claudemd', 'CLAUDE.md'), A('cloud', 'Cloud session'), A('kb', 'KB and wiki, read-only'), A('handoff', 'docs/kb-handoff/'), A('wiki', 'Local wiki')],
        steps: [
          { l: [['prompt', 'Fix the rounding in the quote totals']], on: ['claudemd', 'cloud'], n: 'A cloud session starts from a clone of the repo: it sees the project, not your computer.' },
          { l: [['lead', 'Lead: searching the KB for a pattern on rounded amounts'], ['kb', 'KB: read, no pattern. From here it is read-only']], on: ['kb'], n: 'The KB can be read from the cloud. It cannot be written.' },
          { l: [['lead', 'Lead: cause found, amounts that were already rounded get added up. I round once, on the total'], ['success', 'quote tests: green']], on: ['cloud'], n: 'The work gets done and proven as it would locally.' },
          { l: [['lead', 'Lead: the lesson applies to other projects too, but from here I cannot write it to the KB or the wiki']], on: ['kb', 'cloud'], n: 'Better to say so than to lose it.' },
          { l: [['command', 'writing docs/kb-handoff/rounding.md'], ['success', 'note in the repo: what happened, how it was proven, no secrets']], on: ['handoff'], n: 'The note travels with the repo, in the same commit as the fix.' },
          { l: [['prompt', '(on your computer) /kb-ingest lesson rounding, from the text of docs/kb-handoff/rounding.md']], on: ['wiki'], n: '/kb-ingest does not read docs/kb-handoff/: you carry the note into the wiki by hand, as the text of the lesson.' },
          { l: [['success', 'wiki: source saved, project page updated, line added to the log'], ['lead', 'Lead: removing the note from docs/kb-handoff/ and committing']], on: ['wiki', 'handoff'], n: 'The note was a bridge, then it goes: the source stays the wiki.' }
        ],
        moral: 'A session that cannot write to the KB leaves a note, not a lost lesson.'
      },
      {
        tab: 'Promotion to KB', term: '~/llm-wiki, simulated session',
        actors: [A('claudemd', 'CLAUDE.md'), A('wiki', 'Wiki: concepts/'), A('exam', '/kb-promote'), A('kb', 'Stable KB: patterns')],
        steps: [
          { l: [['prompt', '/kb-promote webhook-idempotency']], on: ['exam'], n: 'Promotion is an exam, not a copy and paste.' },
          { l: [['lead', 'Lead: reading wiki/concepts/webhook-idempotency.md'], ['kb', 'wiki: seen in 2 projects, verified in production in both']], on: ['wiki'], n: 'The wiki says what was seen and where.' },
          { l: [['kb', '[x] used by at least 2 projects'], ['kb', '[x] verified in production'], ['kb', '[x] not already in patterns/patterns.md']], on: ['exam'], n: 'One condition out of three is enough (here, the 2 projects). On top of that: verified in production and not already present.' },
          { l: [['success', 'promoted: new section in patterns/patterns.md'], ['command', '"Promoted" note on the concept, PROMOTE line in wiki/log.md, one commit per repo']], on: ['kb', 'wiki'], n: 'Wiki and KB change together, and the log records it.' },
          { l: [['prompt', '/kb-promote export-column-order']], on: ['exam'], n: 'A second concept, same exam.' },
          { l: [['kb', '[ ] used by at least 2 projects: no, just one'], ['kb', '[ ] a gotcha worth an hour or more: no'], ['kb', '[ ] declared a standard: no']], on: ['exam', 'wiki'], n: 'None of the three conditions holds.' },
          { l: [['lead', 'Lead: exam not passed, the concept stays in the wiki. If you see it in another project, the exam runs again']], on: ['wiki'], n: 'The KB stays small. The wiki can hold what is still a single observation.' }
        ],
        moral: 'A lesson enters the KB when it has held up in more than one place.'
      },
      {
        tab: 'Parental signature', term: '~/school-portal, simulated session',
        actors: [A('claudemd', 'CLAUDE.md'), A('kb', 'Stable KB and wiki'), A('specialist', 'backend-dev', 'Sonnet'), A('skill', 'security', 'Opus'), A('reviewer', 'reviewer', 'Opus')],
        steps: [
          { l: [['prompt', 'Parents need to sign authorization forms online on the school portal']], on: ['claudemd'], n: 'Parents have no account: this is not a standard login.' },
          { l: [['lead', 'Lead: signatures from people with no account, is there anything in the KB?']], on: ['kb'], n: 'The lead looks for a pattern before improvising a signing flow.' },
          { l: [['kb', 'KB: pattern 14, OTP over email as a simple e-signature'], ['kb', 'single-use link, 6-digit OTP with a pepper, about 10 minutes, 5-attempt cap'], ['kb', 'warning: not a qualified signature, with minors get legal advice']], on: ['kb'], n: 'The pattern comes from production on two portals, and says where its validity ends.' },
          { l: [['agent', 'Lead → backend-dev and security: OTP signing on pattern 14, review the sensitive parts together']], on: ['specialist', 'skill'], n: 'Implementation and security move side by side: Sonnet for the code, Opus for security.' },
          { l: [['agentresp', 'backend-dev: single-use link, hashed OTP with pepper, short session, signature record with a document hash'], ['agent2', 'security: rate limit on attempts, lockout after 5']], on: ['specialist', 'skill'], n: 'Each works their side of the same pattern.' },
          { l: [['reviewer', 'reviewer: after signing, can the document still change?']], on: ['reviewer'], n: 'The reviewer tries the case nobody had named.' },
          { l: [['agentresp', 'backend-dev: no, once signed it is immutable; a substantive change invalidates the signatures']], on: ['specialist'], n: 'The answer was already in the pattern, not improvised.' },
          { l: [['reviewer', 'reviewer: approved']], on: ['reviewer'], n: 'Checked, and closed.' },
          { l: [['command', '/kb-ingest'], ['success', 'Pattern 14 used once more, and the session is in the wiki']], on: ['kb'], n: 'Not a new pattern: the same rule, holding up again.' }
        ],
        moral: 'The security requirements were already written before the editor opened.'
      },
      {
        tab: 'Moves up a tier', term: '~/my-app, simulated session',
        actors: [A('claudemd', 'CLAUDE.md'), A('quick', 'quick-worker', 'Haiku'), A('fast', 'fast-worker', 'Sonnet'), A('deep', 'deep-reasoner', 'Opus'), A('reviewer', 'reviewer', 'Opus')],
        steps: [
          { l: [['prompt', 'Move the tests of every module to the new config format']], on: ['claudemd'], n: 'The lead starts from the cheapest tier that is enough.' },
          { l: [['lead', 'Lead: the how is settled and a command proves it. Starting with quick-worker'], ['agent', 'Lead → quick-worker: convert the tests of module A and run the suite']], on: ['quick'], n: 'A mechanical change, provable: Haiku.' },
          { l: [['agentresp', 'quick-worker: 12 files converted, 3 tests fail. Cause not found, stopping']], on: ['quick'], n: 'Haiku says where it stopped instead of guessing.' },
          { l: [['lead', 'Lead: a cause has to be found. Relaunching on fast-worker with Haiku\'s work attached'], ['agent', 'Lead → fast-worker: the 12 files are already converted, find out why 3 tests fail']], on: ['fast'], n: 'One tier up, without redoing the work already done.' },
          { l: [['agentresp', 'fast-worker: the shared helpers sort data differently in the new format. Two ways: adapter or rewrite']], on: ['fast'], n: 'Sonnet finds the cause and meets a choice that weighs on future modules.' },
          { l: [['agent', 'Lead → deep-reasoner: adapter or rewrite of the helpers? Answer in 10 lines'], ['agentresp', 'deep-reasoner: rewrite. Adapter only for module B, which depends on an external API']], on: ['deep'], n: 'A design choice goes to Opus.' },
          { l: [['agentresp', 'fast-worker: helpers rewritten, tests green in every module'], ['reviewer', 'reviewer: ran the whole suite, not just module A. Approved']], on: ['fast', 'reviewer'], n: 'The gate closes: a clean context checks before "done".' }
        ],
        moral: 'You move up a tier only for a reason you can state.'
      },
      {
        tab: 'Rename across repos', term: '~/my-project, simulated session',
        actors: [A('claudemd', 'CLAUDE.md'), A('quick', 'quick-worker', 'Haiku'), A('reviewer', 'reviewer', 'Opus'), A('log', 'Review log, in KB')],
        steps: [
          { l: [['prompt', 'Rename the project from old-name to new-name: code, site and documentation']], on: ['claudemd'], n: 'Three repos, one name to change.' },
          { l: [['lead', 'Lead: plan in three parts. Code, site, documentation: different files, no dependency between them'], ['lead', 'Lead: they run in parallel, each with a command that proves the work']], on: ['claudemd'], n: 'The lead plans and delegates. Its context stays free.' },
          { l: [['agent', 'Lead → quick-worker (code): replace the name, then grep must return zero'], ['agent', 'Lead → quick-worker (site): replace the name in the pages, then grep at zero'], ['agent', 'Lead → quick-worker (documentation): replace name and links, then grep at zero']], on: ['quick'], n: 'Three agents at once, mechanical work with a proof: Haiku.' },
          { l: [['agentresp', 'code: 41 occurrences, grep at zero'], ['agentresp', 'site: 18 occurrences, grep at zero'], ['agentresp', 'documentation: 27 occurrences and the internal links, grep at zero']], on: ['quick'], n: 'Each reports the result of its own command.' },
          { l: [['lead', 'Lead: repo renamed on GitHub. Trying an old link: it opens the new address'], ['success', 'old links are redirected']], on: ['claudemd'], n: 'GitHub redirects the addresses of a renamed repo. Links from outside the repo keep working.' },
          { l: [['reviewer', 'reviewer: last SHA recorded in the review log: a1b2c3d. Reviewing only git diff a1b2c3d..HEAD']], on: ['reviewer', 'log'], n: 'Incremental review log: you look at what changed since the last recorded SHA, not the whole project.' },
          { l: [['reviewer', 'reviewer: no reference to the old name left. Approved'], ['success', 'review log updated: new SHA, outcome, no open findings']], on: ['reviewer', 'log'], n: 'The log entry is the starting point of the next review.' }
        ],
        moral: 'The work splits in parallel, the review looks only at the diff.'
      },
      {
        tab: 'Unpaid order', term: '~/online-store, simulated session',
        actors: [A('claudemd', 'CLAUDE.md'), A('kb', 'Stable KB and wiki'), A('skill', 'debugging-sistematico'), A('quick', 'quick-worker', 'Haiku'), A('specialist', 'backend-dev', 'Sonnet'), A('reviewer', 'reviewer', 'Opus')],
        steps: [
          { l: [['prompt', 'A customer paid but the order shows as unpaid']], on: ['claudemd'], n: 'A production bug walks in, not a feature request.' },
          { l: [['skill', 'debugging-sistematico: no instinct fix before the root cause']], on: ['skill'], n: 'Nobody called it: a bug and an inconsistent state match its description.' },
          { l: [['lead', 'Lead: before touching code, searching the KB for "payment webhook"']], on: ['kb'], n: 'The skill forces the step, the lead runs it.' },
          { l: [['kb', 'KB: pattern 16, a webhook can say "paid" before the transaction settles, and can arrive twice'], ['kb', 'fix: authoritative status from the provider API, idempotent settle with a row lock on the transaction ID']], on: ['kb'], n: 'The pattern describes the shape of this bug before the logs are opened.' },
          { l: [['agent', 'Lead → quick-worker: from the local webhook log, extract the deliveries for this order'], ['agentresp', 'quick-worker: two deliveries, the second overwrote the state with a stale value']], on: ['quick'], n: 'Reading an already downloaded log: small, closed work, on Haiku.' },
          { l: [['agent', 'Lead → backend-dev: fix it following pattern 16']], on: ['specialist'], n: 'The fix is domain work: Sonnet, with the pattern attached.' },
          { l: [['agentresp', 'backend-dev: status fetched from the provider on every webhook, idempotent settle under a row lock']], on: ['specialist'], n: 'The fix follows the pattern\'s recipe.' },
          { l: [['reviewer', 'reviewer: replayed the webhook twice on the same order, the state stays correct'], ['reviewer', 'reviewer: approved']], on: ['reviewer'], n: 'Verified by reproducing the defect, not by looking at yesterday\'s order.' },
          { l: [['command', '/kb-ingest'], ['success', 'The session confirms pattern 16 on another project']], on: ['kb'], n: 'The pattern holds again, somewhere else.' }
        ],
        moral: 'Forcing the order to "paid" by hand would have hidden the bug.'
      },
      {
        tab: 'Reviewer says no', term: '~/my-project, simulated session',
        actors: [A('claudemd', 'CLAUDE.md'), A('fast', 'fast-worker', 'Sonnet'), A('reviewer', 'reviewer', 'Opus'), A('kb', 'Stable KB and wiki')],
        steps: [
          { l: [['prompt', 'Before the release, run the project\'s secret scanner over the whole repo']], on: ['claudemd'], n: 'A routine check.' },
          { l: [['agent', 'Lead → fast-worker: run the scanner over the whole repo'], ['agentresp', 'fast-worker: exit 0, nothing found']], on: ['fast'], n: 'The result looks clean.' },
          { l: [['reviewer', 'reviewer: exit 0 is not enough. Which files did the scanner read?'], ['reviewer', 'reviewer: it skips files with a .doc extension, even when they are plain text. A test .doc holds a fake key and it does not see it']], on: ['reviewer'], n: 'The reviewer checks the method, not only the outcome. This was a false clean.' },
          { l: [['reviewer', 'reviewer: not approved']], on: ['reviewer'], n: 'The gate can say no.' },
          { l: [['agent', 'Lead → fast-worker: a file with no NUL bytes is always read, whatever its extension. The list only applies to files that contain NUL'], ['agentresp', 'fast-worker: fixed. Test added: a text .doc with a fake key is now reported']], on: ['fast'], n: 'The fix comes with a test that would have failed before.' },
          { l: [['reviewer', 'reviewer: second pass on the fix diff. The text .doc is read, a real binary with NUL is still skipped. Approved']], on: ['reviewer'], n: 'New review, new verdict.' },
          { l: [['command', '/kb-ingest lesson a "clean" result has to be read together with what was scanned'], ['success', 'The lesson enters the wiki']], on: ['kb'], n: 'To become stable KB it will have to pass the promotion exam.' }
        ],
        moral: 'A clean result is worth what was read.'
      },
      {
        tab: 'Secret in a commit', term: '~/my-app, simulated session',
        actors: [A('claudemd', 'CLAUDE.md'), A('hook', 'pre-commit hook'), A('human', 'You'), A('fast', 'fast-worker', 'Sonnet')],
        steps: [
          { l: [['prompt', 'Commit the notification config']], on: ['claudemd'], n: 'An ordinary request.' },
          { l: [['command', 'git commit -m "config: notifications"']], on: ['hook'], n: 'The pre-commit hook starts on its own, before the commit exists.' },
          { l: [['warn', 'config/notifications.yml:14:GOOGLE_API_KEY'], ['warn', '[pre-commit] commit BLOCKED: secrets found in staged files']], on: ['hook'], n: 'The scanner gives file, line and type. The value is never printed.' },
          { l: [['lead', 'Lead: stopping. I do not print the value, I do not delete it myself, I do not bypass the block']], on: ['claudemd'], n: 'The commit stays put as long as the secret is there.' },
          { l: [['lead', 'Lead: has the key already ended up elsewhere (logs, chat, backups)? If so, it needs rotating. Your call']], on: ['human'], n: 'Rotating a key depends on where it was seen. The decision stays with the human.' },
          { l: [['prompt', 'I will rotate it. Leave the name of an environment variable in the file']], on: ['human'], n: 'The real value goes in the service environment, not in the repo.' },
          { l: [['agent', 'Lead → fast-worker: replace the value with the variable and scan again'], ['agentresp', 'fast-worker: file updated, scanner finds nothing, commit done']], on: ['fast'], n: 'A file with a secret does not go to Haiku: the quick-worker does not read them.' }
        ],
        moral: 'The scanner stops the commit, the human decides about the key.'
      }
    ]
  };
  window.KB_SIM_DATA = DATA;
  var GROUPS = {
    it: ['Conoscenza', 'Orchestrazione', 'Qualità'],
    en: ['Knowledge', 'Orchestration', 'Quality']
  };
  var PER = 3;

  var st = { sc: 0, step: 0 };
  var el = {};

  function cur() { return DATA[KB.lang][st.sc]; }
  function isActive() {
    var s = window.Reveal && Reveal.getCurrentSlide && Reveal.getCurrentSlide();
    return s && s.id === 'simulatore' && !Reveal.isOverview();
  }

  function render() {
    var d = cur(), s = d.steps[st.step];
    el.bar.textContent = d.term;
    var g = Math.floor(st.sc / PER);
    el.groups.forEach(function (b, i) {
      b.textContent = '';
      var r = document.createElement('span'); r.className = 'num'; r.textContent = (i * PER + 1) + '–' + (i * PER + PER);
      b.appendChild(r); b.appendChild(document.createTextNode(' ' + GROUPS[KB.lang][i]));
      b.setAttribute('aria-pressed', String(i === g));
    });
    el.tabs.forEach(function (b, i) {
      var idx = g * PER + i;
      b.textContent = '';
      var r = document.createElement('span'); r.className = 'num'; r.textContent = String(idx + 1);
      b.appendChild(r); b.appendChild(document.createTextNode(' ' + DATA[KB.lang][idx].tab));
      b.setAttribute('aria-pressed', String(idx === st.sc));
    });
    el.term.innerHTML = '';
    for (var i = 0; i <= st.step; i++) {
      d.steps[i].l.forEach(function (ln) {
        var p = document.createElement('p');
        p.className = 'tl ' + ln[0] + (i === st.step ? ' new' : '');
        p.textContent = ln[1];
        el.term.appendChild(p);
      });
    }
    // unita coerenti: il padding va scalato come le misure di getBoundingClientRect
    var rect = el.term.getBoundingClientRect();
    var k = el.term.offsetHeight ? rect.height / el.term.offsetHeight : 1;
    var limit = rect.top + parseFloat(getComputedStyle(el.term).paddingTop || 0) * k - 1;
    while (el.term.children.length > 1 && el.term.firstChild.getBoundingClientRect().top < limit) {
      el.term.removeChild(el.term.firstChild);
    }
    el.actors.innerHTML = '';
    d.actors.forEach(function (a) {
      var div = document.createElement('div');
      div.className = 'actor' + (s.on.indexOf(a.id) >= 0 ? ' on' : '');
      var n = document.createElement('span'); n.textContent = a.label;
      var t = document.createElement('span'); t.className = 'tier'; t.textContent = a.tier;
      div.appendChild(n); div.appendChild(t);
      el.actors.appendChild(div);
    });
    el.note.textContent = s.n;
    el.cnt.textContent = (st.step + 1) + ' / ' + d.steps.length;
    el.prev.disabled = st.step === 0;
    el.next.disabled = st.step === d.steps.length - 1;
  }

  function next() { var d = cur(); if (st.step < d.steps.length - 1) { st.step++; render(); } }
  function prev() { if (st.step > 0) { st.step--; render(); } }
  function pick(i) { if (i >= 0 && i < DATA[KB.lang].length) { st.sc = i; st.step = 0; render(); } }
  function restart() { st.step = 0; render(); }

  function btn(b, fn) {
    b.addEventListener('click', function () { fn(); b.blur(); });
    b.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') e.stopPropagation(); });
  }

  KB.initSim = function () {
    el.bar = document.getElementById('sim-bar');
    el.term = document.getElementById('sim-term');
    el.actors = document.getElementById('sim-actors');
    el.note = document.getElementById('sim-note');
    el.cnt = document.getElementById('sim-cnt');
    el.prev = document.getElementById('sim-prev');
    el.next = document.getElementById('sim-next');
    el.tabs = Array.prototype.slice.call(document.querySelectorAll('.sim-tab'));
    el.groups = Array.prototype.slice.call(document.querySelectorAll('.sim-grp'));
    el.tabs.forEach(function (b, i) { btn(b, function () { pick(Math.floor(st.sc / PER) * PER + i); }); });
    el.groups.forEach(function (b, i) { btn(b, function () { pick(i * PER); }); });
    btn(el.next, next); btn(el.prev, prev); btn(document.getElementById('sim-restart'), restart);
    // toccare il terminale fa avanzare
    document.getElementById('sim-termbox').addEventListener('click', next);
    KB.onLang(render);
    var bind = function (code, key, desc, fn, fallback) {
      Reveal.addKeyBinding({ keyCode: code, key: key, description: desc }, function () {
        if (isActive()) fn(); else if (fallback) fallback();
      });
    };
    bind(13, 'Enter', 'Simulatore: avanti · step', next, function () { if (Reveal.isOverview()) Reveal.toggleOverview(false); });
    bind(40, 'Down', 'Simulatore: avanti · step', next, function () { Reveal.next(); });
    bind(38, 'Up', 'Simulatore: indietro · back', prev, function () { Reveal.prev(); });
    for (var n = 0; n < 9; n++) (function (n) {
      bind(49 + n, String(n + 1), 'Scenario ' + (n + 1), function () { pick(n); });
    })(n);
    bind(82, 'R', 'Simulatore: ricomincia · restart', restart);
    Reveal.on('slidechanged', function () { if (isActive()) render(); });
    Reveal.on('overviewhidden', function () { if (isActive()) render(); });
    render();
  };
})();
