/* Simulatore "una sessione vera": tre scenari illustrativi, JS vanilla. */
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
      }
    ]
  };
  window.KB_SIM_DATA = DATA;

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
    el.tabs.forEach(function (b, i) {
      b.textContent = DATA[KB.lang][i].tab;
      b.setAttribute('aria-pressed', String(i === st.sc));
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
    var top = function () { return el.term.getBoundingClientRect().top + parseFloat(getComputedStyle(el.term).paddingTop || 0) - 1; };
    while (el.term.children.length > 1 && el.term.firstChild.getBoundingClientRect().top < top()) {
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
    el.tabs.forEach(function (b, i) { btn(b, function () { pick(i); }); });
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
    bind(49, '1', 'Scenario 1', function () { pick(0); });
    bind(50, '2', 'Scenario 2', function () { pick(1); });
    bind(51, '3', 'Scenario 3', function () { pick(2); });
    bind(82, 'R', 'Simulatore: ricomincia · restart', restart);
    Reveal.on('slidechanged', function () { if (isActive()) render(); });
    render();
  };
})();
