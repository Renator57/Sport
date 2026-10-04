'use strict';
// Fit & Leicht – App-Logik. Daten (Lebensmittel, Übungen) stehen in data.js.
(function () {

  // ---------- Konstanten ----------
  const STORE_KEY = 'fit-leicht-v1';
  const KCAL_PER_KG = 7700;

  // MET-Werte (Metabolisches Äquivalent) für die Kalorienschätzung
  const ACTIVITIES = [
    ['Spazierengehen', 3.5],
    ['Zügiges Gehen / Walking', 4.3],
    ['Nordic Walking', 5.0],
    ['Joggen (ca. 8 km/h)', 8.3],
    ['Laufen (ca. 10 km/h)', 9.8],
    ['Radfahren (gemütlich)', 5.8],
    ['Radfahren (zügig)', 8.0],
    ['Schwimmen', 6.0],
    ['Krafttraining', 5.0],
    ['Bodyweight / Zirkeltraining', 6.0],
    ['HIIT', 8.0],
    ['Seilspringen', 11.0],
    ['Crosstrainer', 5.0],
    ['Rudergerät', 7.0],
    ['Wandern', 6.0],
    ['Fußball', 7.0],
    ['Tanzen', 5.0],
    ['Yoga / Dehnen', 2.5],
    ['Treppensteigen', 8.0]
  ];

  const PLANS = {
    beginner: {
      label: 'Einsteiger',
      days: [
        ['Ganzkörper-Kraft', ['3 Runden: 10 Kniebeugen, 8 Liegestütze (gerne an der Wand/Knie), 10 Ausfallschritte je Seite', '20 Sek. Unterarmstütz (Plank)', '60–90 Sek. Pause zwischen den Runden']],
        ['Zügiges Gehen', ['30 Min. zügig gehen – du solltest noch reden, aber nicht singen können']],
        ['Ruhetag', ['Locker dehnen, Spaziergang, viel trinken']],
        ['Ganzkörper-Kraft', ['3 Runden: 12 Kniebeugen, 10 Glute Bridges, 8 Liegestütze, 10 Rudern mit Wasserflaschen', '25 Sek. Plank']],
        ['Ausdauer', ['30 Min. Radfahren, Schwimmen oder Crosstrainer']],
        ['Aktive Erholung', ['20 Min. Yoga oder Mobility', '8.000 Schritte']],
        ['Langer Spaziergang', ['45–60 Min. Spazieren oder Wandern']]
      ]
    },
    medium: {
      label: 'Mittel',
      days: [
        ['Kraft Unterkörper', ['4×12 Kniebeugen', '3×10 Ausfallschritte je Seite', '3×15 Glute Bridges', '3×30 Sek. Wandsitzen']],
        ['Intervall-Lauf', ['5 Min. Aufwärmen', '8× (1 Min. schnell / 1 Min. locker)', '5 Min. Auslaufen']],
        ['Kraft Oberkörper', ['4×10 Liegestütze', '4×12 Rudern', '3×10 Schulterdrücken', '3×40 Sek. Plank']],
        ['Ausdauer locker', ['40 Min. Joggen, Radfahren oder Schwimmen im Wohlfühltempo']],
        ['Ganzkörper-Zirkel', ['4 Runden: 15 Kniebeugen, 12 Liegestütze, 20 Mountain Climbers, 10 Burpees', '1 Min. Pause pro Runde']],
        ['Aktive Erholung', ['30 Min. Yoga oder Dehnen', '10.000 Schritte']],
        ['Ruhetag', ['Erholung – Muskeln wachsen in der Pause']]
      ]
    },
    advanced: {
      label: 'Profi',
      days: [
        ['HIIT', ['10 Runden: 40 Sek. Belastung / 20 Sek. Pause', 'Burpees, Jump Squats, Mountain Climbers, Seilspringen, High Knees']],
        ['Kraft Unterkörper', ['5×10 Kniebeugen (mit Gewicht)', '4×10 Kreuzheben', '4×12 Bulgarian Split Squats je Seite', '3×15 Wadenheben']],
        ['Lauf 45 Min.', ['45 Min. gleichmäßiges Tempo, am Ende 5 Min. Steigerung']],
        ['Kraft Oberkörper', ['5×8 Klimmzüge oder Latzug', '4×10 Bankdrücken / Liegestütze mit Gewicht', '4×12 Rudern', '3×60 Sek. Plank']],
        ['Intervall-Lauf', ['6× 400 m schnell, 200 m Trabpause']],
        ['Ganzkörper + Core', ['4 Runden: 12 Thruster, 10 Ruderzüge je Seite, 15 Russian Twists, 12 Beinheben']],
        ['Ruhetag / Mobility', ['30 Min. Mobility, Faszienrolle, Spaziergang']]
      ]
    }
  };

  const TIPS = [
    ['Eiweiß zu jeder Mahlzeit', 'Eiweiß macht lange satt und schützt deine Muskeln beim Abnehmen.'],
    ['Trink vor dem Essen ein Glas Wasser', 'Das hilft, Hunger und Durst zu unterscheiden.'],
    ['Gemüse zuerst', 'Fülle die Hälfte deines Tellers mit Gemüse – viel Volumen, wenig Kalorien.'],
    ['Schlaf ist Training', 'Wer 7–9 Stunden schläft, hat weniger Heißhunger.'],
    ['Flüssige Kalorien meiden', 'Softdrinks, Säfte und Alkohol liefern viele Kalorien ohne satt zu machen.'],
    ['Schritte zählen', 'Jeder Spaziergang zählt. 10.000 Schritte verbrennen grob 300–400 kcal.'],
    ['Gewicht schwankt', 'Tägliche Schwankungen von 1–2 kg sind normal (Wasser, Salz). Achte auf den Trend.'],
    ['Plane deine Mahlzeiten', 'Wer vorkocht, greift seltener zu Fast Food.'],
    ['Langsam essen', 'Das Sättigungsgefühl kommt erst nach etwa 20 Minuten.'],
    ['Krafttraining nicht vergessen', 'Muskeln verbrauchen auch in Ruhe Energie.'],
    ['Kleine Ziele setzen', 'Feiere jedes verlorene Kilo – nicht nur das Endziel.'],
    ['Kein Alles-oder-nichts', 'Ein Ausrutscher ist kein Grund aufzugeben. Die nächste Mahlzeit zählt.'],
    ['Miss auch den Bauch', 'Wenn du Muskeln aufbaust, bleibt die Waage manchmal stehen, aber der Bauchumfang sinkt trotzdem.'],
    ['Steigere dich langsam', 'Jede Woche ein bisschen mehr: eine Wiederholung, eine Runde oder fünf Minuten länger.'],
    ['Plateau? Keine Panik', 'Stillstand für 1–2 Wochen ist normal. Prüfe ehrlich deine Kalorien und bleib dran.'],
    ['Nach dem Essen gehen', 'Schon 10 Minuten Spazieren nach dem Essen helfen deinem Blutzucker.'],
    ['Wiegen statt schätzen', 'Eine Küchenwaage zeigt, wie viel du wirklich isst. Öl und Nüsse werden oft unterschätzt.'],
    ['Erholung einplanen', 'Muskeln wachsen in der Pause. Mindestens ein Ruhetag pro Woche gehört dazu.'],
    ['Stress senken', 'Viel Stress fördert Heißhunger. Ein Spaziergang oder Atemübungen helfen.'],
    ['Gemüse vorbereiten', 'Geschnittenes Gemüse im Kühlschrank ist der beste Snack gegen Heißhunger.']
  ];

  // ---------- Hilfsfunktionen ----------
  const $ = (id) => document.getElementById(id);
  const pad = (n) => String(n).padStart(2, '0');
  const dateKey = (d) => d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
  const today = () => dateKey(new Date());
  const parseKey = (k) => { const [y, m, d] = k.split('-').map(Number); return new Date(y, m - 1, d); };
  const fmt = (n, digits = 0) => Number(n).toLocaleString('de-DE', { minimumFractionDigits: digits, maximumFractionDigits: digits });
  const fmtDate = (k) => parseKey(k).toLocaleDateString('de-DE', { weekday: 'short', day: '2-digit', month: '2-digit', year: '2-digit' });
  const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

  function mondayOf(d) {
    const x = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    const day = (x.getDay() + 6) % 7; // Montag = 0
    x.setDate(x.getDate() - day);
    return x;
  }

  function el(tag, attrs, children) {
    const n = document.createElement(tag);
    if (attrs) for (const k in attrs) {
      if (k === 'text') n.textContent = attrs[k];
      else if (k === 'class') n.className = attrs[k];
      else if (k.startsWith('on')) n.addEventListener(k.slice(2), attrs[k]);
      else n.setAttribute(k, attrs[k]);
    }
    (children || []).forEach((c) => c && n.appendChild(typeof c === 'string' ? document.createTextNode(c) : c));
    return n;
  }

  // ---------- Speicher ----------
  // Alles bleibt auf diesem Gerät (localStorage) – funktioniert ohne Internet.
  const defaultReminders = () => ({
    weigh: { on: true, time: '07:00' },
    train: { on: true, time: '18:00' },
    water: { on: false, every: 3 },
    food: { on: true, time: '20:30' },
    notified: { date: '', keys: [] }
  });
  const defaultSettings = () => ({ theme: 'system', haptics: true });
  const defaultFasting = () => ({ plan: 16, active: null, history: [] });
  const emptyState = () => ({ profile: null, weights: [], workouts: [], foods: [], water: {}, steps: {}, badges: [], products: {}, plan: { level: 'beginner', done: {} }, reminders: defaultReminders(), settings: defaultSettings(), fasting: defaultFasting() });
  const STEP_GOAL = 8000;
  let state = emptyState();
  let loaded = false;

  function fromData(data) {
    const next = Object.assign(emptyState(), data || {});
    if (!next.plan || !next.plan.done) next.plan = { level: (next.plan && next.plan.level) || 'beginner', done: {} };
    const r = defaultReminders();
    next.reminders = Object.assign(r, next.reminders || {});
    ['weigh', 'train', 'water', 'food'].forEach((k) => { next.reminders[k] = Object.assign(defaultReminders()[k], next.reminders[k] || {}); });
    if (!next.reminders.notified || !Array.isArray(next.reminders.notified.keys)) next.reminders.notified = { date: '', keys: [] };
    next.settings = Object.assign(defaultSettings(), next.settings || {});
    next.fasting = Object.assign(defaultFasting(), next.fasting || {});
    if (!Array.isArray(next.fasting.history)) next.fasting.history = [];
    if (!next.products || typeof next.products !== 'object') next.products = {};
    return next;
  }

  // Alte Tagesdaten (Essen, Wasser, Plan-Haken) nach 90 Tagen entfernen, damit der Speicher klein bleibt
  function prune() {
    const d = new Date(); d.setDate(d.getDate() - 90);
    const cut = dateKey(d);
    state.foods = state.foods.filter((f) => f.date >= cut);
    Object.keys(state.water).forEach((k) => { if (k < cut) delete state.water[k]; });
    Object.keys(state.steps).forEach((k) => { if (k < cut) delete state.steps[k]; });
    Object.keys(state.plan.done).forEach((k) => { if (k < cut) delete state.plan.done[k]; });
  }

  function load() {
    try {
      const raw = localStorage.getItem(STORE_KEY);
      if (raw) state = fromData(JSON.parse(raw));
    } catch (e) { /* Speicher nicht verfügbar – App läuft trotzdem */ }
    loaded = true;
  }

  function save() {
    prune();
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify(state));
    } catch (e) {
      setStatus('', 'Nicht gespeichert');
    }
    render();
  }

  function setStatus(cls, text) {
    $('sync').className = 'sync ' + cls;
    $('avatar').title = 'Profil · ' + text;
    $('sync-text').textContent = text;
  }

  function updateOnline() {
    if (navigator.onLine) setStatus('ok', 'Online');
    else setStatus('busy', 'Offline');
  }

  // ---------- Berechnungen ----------
  function currentWeight() {
    if (state.weights.length) return [...state.weights].sort((a, b) => a.date.localeCompare(b.date)).at(-1).kg;
    return state.profile ? state.profile.start : null;
  }

  function calc() {
    const p = state.profile;
    if (!p) return null;
    return calcFor(p, currentWeight());
  }

  // Bedarf für ein beliebiges Profil (auch für die Vorschau im Einrichtungs-Assistenten)
  function calcFor(p, w) {
    const bmr = 10 * w + 6.25 * p.height - 5 * p.age + (p.sex === 'm' ? 5 : -161);
    const tdee = bmr * p.activity;
    const minKcal = p.sex === 'm' ? 1500 : 1200;
    const raw = tdee - p.pace;
    const target = Math.max(raw, minKcal);
    const deficit = tdee - target;
    const bmi = w / Math.pow(p.height / 100, 2);
    const protein = Math.round(Math.min(w, 25 * Math.pow(p.height / 100, 2)) * 1.6);
    const water = Math.round(w * 35 / 250) * 250; // ml
    return { w, bmr, tdee, target, deficit, capped: raw < minKcal, minKcal, bmi, protein, water };
  }

  function bmiCategory(b) {
    if (b < 18.5) return 'Untergewicht';
    if (b < 25) return 'Normalgewicht';
    if (b < 30) return 'Übergewicht';
    return 'Adipositas';
  }

  function workoutKcal(met, minutes, kg) {
    return Math.round(met * (kg || 75) * (minutes / 60));
  }

  function streak() {
    const days = new Set(state.workouts.map((w) => w.date));
    let n = 0;
    const d = new Date();
    if (!days.has(dateKey(d))) d.setDate(d.getDate() - 1); // Heute zählt noch nicht als verpasst
    while (days.has(dateKey(d))) { n++; d.setDate(d.getDate() - 1); }
    return n;
  }

  // Trend: Durchschnitt aller Messungen der letzten 7 Tage – glättet Wasser-Schwankungen
  function weightTrend() {
    const ws = [...state.weights].sort((a, b) => a.date.localeCompare(b.date));
    return ws.map((w, i) => {
      const from = parseKey(w.date); from.setDate(from.getDate() - 6);
      const fromKey = dateKey(from);
      const win = ws.slice(0, i + 1).filter((x) => x.date >= fromKey);
      return { date: w.date, kg: w.kg, trend: win.reduce((s, x) => s + x.kg, 0) / win.length };
    });
  }

  // kg pro Woche, berechnet aus dem Trend der letzten 4 Wochen (Steigung per linearer Regression)
  function weeklyRate() {
    const tr = weightTrend();
    if (tr.length < 2) return null;
    const last = parseKey(tr.at(-1).date);
    const cutoff = new Date(last); cutoff.setDate(cutoff.getDate() - 28);
    const pts = tr.filter((t) => parseKey(t.date) >= cutoff).map((t) => [(parseKey(t.date) - last) / 864e5, t.trend]);
    if (pts.length < 2) return null;
    const n = pts.length;
    const mx = pts.reduce((s, p) => s + p[0], 0) / n;
    const my = pts.reduce((s, p) => s + p[1], 0) / n;
    const sxx = pts.reduce((s, p) => s + (p[0] - mx) ** 2, 0);
    if (sxx < 1) return null;
    const sxy = pts.reduce((s, p) => s + (p[0] - mx) * (p[1] - my), 0);
    return sxy / sxx * 7;
  }

  function latestWaist() {
    return [...state.weights].filter((w) => w.waist).sort((a, b) => a.date.localeCompare(b.date)).at(-1) || null;
  }

  // ---------- Rendering ----------
  function render() {
    renderHome();
    renderWeight();
    renderWorkouts();
    renderFood();
    renderPlan();
    renderTodo();
    renderReview();
    if ($('tab-stats').classList.contains('active')) renderStats();
    renderSteps();
    renderBadges();
    renderReminders();
    renderProfile();
  }

  function renderHome() {
    const c = calc();
    const p = state.profile;
    const t = today();
    $('setup-hint').hidden = !loaded || !!p;
    const now = new Date();
    $('today-date').textContent = now.toLocaleDateString('de-DE', { weekday: 'long', day: 'numeric', month: 'long' });
    const hour = now.getHours();
    const hello = hour < 11 ? 'Guten Morgen' : hour < 18 ? 'Hallo' : 'Guten Abend';
    if (p && p.name) $('greeting').textContent = hello + ', ' + p.name;
    else $('greeting').replaceChildren(document.createTextNode('Fit & '), el('span', { class: 'brand', text: 'Leicht' }));
    const initial = p && p.name ? p.name.trim().charAt(0).toUpperCase() : '';
    $('avatar-initial').textContent = initial;
    $('avatar-initial').hidden = !initial;
    $('avatar-ico').style.display = initial ? 'none' : '';

    const eaten = state.foods.filter((f) => f.date === t).reduce((s, f) => s + f.kcal, 0);
    const todayWorkouts = state.workouts.filter((w) => w.date === t);
    const burned = todayWorkouts.reduce((s, w) => s + w.kcal, 0);
    const minutes = todayWorkouts.reduce((s, w) => s + w.min, 0);
    $('h-eaten').textContent = fmt(eaten);
    $('h-burned').textContent = fmt(burned);
    $('h-minutes').textContent = minutes ? 'kcal Sport · ' + fmt(minutes) + ' Min.' : 'kcal Sport';

    const glasses = state.water[t] || 0;
    $('h-water').textContent = fmt(glasses * 0.25, 2).replace(/,?0+$/, '') + ' l';
    $('h-water-goal').textContent = c ? 'Wasser · Ziel ' + fmt(c.water / 1000, 1) + ' l' : 'Wasser';

    const ring = $('h-ring');
    const CIRC = 326.73;
    if (c) {
      const budget = c.target + burned;
      const remaining = budget - eaten;
      const over = remaining < 0;
      $('h-remaining').textContent = fmt(Math.abs(remaining));
      $('h-remaining-label').textContent = over ? 'kcal drüber' : 'kcal übrig';
      $('h-target').textContent = 'gegessen · Ziel ' + fmt(c.target);
      ring.classList.toggle('over', over);
      $('h-ring-prog').style.strokeDashoffset = String(CIRC * (1 - clamp(eaten / budget, 0, 1)));
      $('h-cal-text').textContent = !eaten
        ? 'Noch nichts gegessen eingetragen. Dein Budget heute: ' + fmt(budget) + ' kcal.'
        : over
          ? 'Du liegst ' + fmt(-remaining) + ' kcal über deinem Ziel. Kein Problem: Ein Spaziergang hilft, morgen geht\'s weiter.'
          : fmt(c.target) + ' Ziel + ' + fmt(burned) + ' Sport − ' + fmt(eaten) + ' gegessen';
    } else {
      $('h-remaining').textContent = '–';
      $('h-remaining-label').textContent = 'kcal übrig';
      $('h-target').textContent = 'gegessen';
      ring.classList.remove('over');
      $('h-ring-prog').style.strokeDashoffset = String(CIRC);
      $('h-cal-text').textContent = 'Lege ein Profil an, um dein Kalorienziel zu sehen.';
    }

    const w = currentWeight();
    const lastW = [...state.weights].sort((a, b) => a.date.localeCompare(b.date)).at(-1);
    $('h-weight').textContent = w ? fmt(w, 1) + ' kg' : '–';
    $('h-weight-date').textContent = lastW ? 'am ' + fmtDate(lastW.date) : (p ? 'Startgewicht' : '');
    if (p) {
      const lost = p.start - w;
      const total = p.start - p.goal;
      const togo = w - p.goal;
      $('h-lost').textContent = (lost >= 0 ? '' : '+') + fmt(Math.abs(lost), 1) + ' kg';
      $('h-lost-sub').textContent = lost >= 0 ? 'seit dem Start' : 'zugenommen seit Start';
      $('h-togo').textContent = togo > 0 ? fmt(togo, 1) + ' kg' : 'Geschafft! 🎉';
      if (togo > 0 && c && c.deficit > 0) {
        const days = Math.ceil(togo * KCAL_PER_KG / c.deficit);
        const eta = new Date(); eta.setDate(eta.getDate() + days);
        $('h-eta').textContent = 'ca. ' + eta.toLocaleDateString('de-DE', { month: 'long', year: 'numeric' }) + ' (' + Math.ceil(days / 7) + ' Wochen)';
      } else $('h-eta').textContent = '';
      const pct = total > 0 ? clamp(lost / total * 100, 0, 100) : 100;
      $('h-goal-bar').style.width = pct + '%';
      $('h-goal-text').textContent = fmt(pct) + ' % geschafft · Start ' + fmt(p.start, 1) + ' kg → Ziel ' + fmt(p.goal, 1) + ' kg';
    } else {
      ['h-lost', 'h-togo'].forEach((id) => { $(id).textContent = '–'; });
      $('h-lost-sub').textContent = ''; $('h-eta').textContent = ''; $('h-goal-text').textContent = '';
      $('h-goal-bar').style.width = '0';
    }
    $('h-streak').textContent = streak();

    const dayOfYear = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / 864e5);
    const tip = TIPS[dayOfYear % TIPS.length];
    $('h-tip').replaceChildren(el('strong', { text: tip[0] }), document.createTextNode(tip[1]));
  }

  let showAllWeights = false;
  function renderWeight() {
    const list = $('weight-list');
    const ws = [...state.weights].sort((a, b) => b.date.localeCompare(a.date));
    list.replaceChildren();
    if (!ws.length) list.appendChild(el('li', { class: 'empty', text: 'Noch keine Einträge. Tippe oben auf „Gewicht eintragen“.' }));
    const lastW = ws[0];
    $('w-add-sub').textContent = lastW ? (lastW.date === today() ? 'Heute schon gewogen: ' + fmt(lastW.kg, 1) + ' kg' : 'Zuletzt ' + fmt(lastW.kg, 1) + ' kg am ' + fmtDate(lastW.date)) : 'Am besten morgens nach dem Aufstehen';
    $('weight-more').hidden = ws.length <= 10;
    $('weight-more').textContent = showAllWeights ? 'Weniger anzeigen' : 'Alle ' + ws.length + ' Einträge anzeigen';
    ws.forEach((w, i) => {
      if (!showAllWeights && i >= 10) return;
      const prev = ws[i + 1];
      const diff = prev ? w.kg - prev.kg : null;
      list.appendChild(rowItem(() => sheetWeight(w), [
        el('div', { class: 'grow' }, [
          el('div', { class: 'title', text: fmtDate(w.date) }),
          w.waist ? el('div', { class: 'muted', text: 'Bauch ' + fmt(w.waist, 1) + ' cm' }) : null
        ]),
        diff !== null ? el('span', { class: 'pill ' + (diff > 0 ? 'warn' : ''), text: (diff > 0 ? '+' : diff < 0 ? '−' : '±') + fmt(Math.abs(diff), 1) }) : null,
        el('span', { class: 'num', text: fmt(w.kg, 1) + ' kg' })
      ], 'Gewicht vom ' + fmtDate(w.date) + ' bearbeiten'));
    });

    const c = calc();
    $('w-bmi').textContent = c ? fmt(c.bmi, 1) : '–';
    $('w-bmi-cat').textContent = c ? bmiCategory(c.bmi) : '';
    const r = weeklyRate();
    $('w-rate').textContent = r === null ? '–' : (r > 0 ? '+' : r < 0 ? '−' : '') + fmt(Math.abs(r), 2);
    $('w-rate-sub').textContent = r === null ? 'kg pro Woche'
      : r > 0.05 ? 'kg pro Woche · Trend steigt'
      : r < -1 ? 'kg pro Woche · sehr schnell'
      : r < -0.05 ? 'kg pro Woche · gutes Tempo'
      : 'kg pro Woche · stabil';
    const lw = latestWaist();
    $('w-waist-val').textContent = lw ? fmt(lw.waist, 1) + ' cm' : '–';
    if (lw && state.profile) {
      const whtr = lw.waist / state.profile.height;
      $('w-whtr').textContent = 'Taille/Größe ' + fmt(whtr, 2) + (whtr < 0.5 ? ' · gut' : whtr < 0.6 ? ' · erhöht' : ' · hoch');
    } else $('w-whtr').textContent = lw ? '' : 'Optional beim Wiegen eintragen';
    drawChart();
  }

  function drawChart() {
    const box = $('weight-chart');
    const ws = [...state.weights].sort((a, b) => a.date.localeCompare(b.date));
    const p = state.profile;
    $('chart-legend').hidden = ws.length < 2;
    if (ws.length < 2) {
      box.replaceChildren(el('p', { class: 'empty', text: 'Ab zwei Einträgen siehst du hier deine Kurve.' }));
      return;
    }
    const trend = weightTrend();
    const W = 400, H = 220, L = 40, R = 8, T = 14, B = 26;
    const xs = ws.map((w) => parseKey(w.date).getTime());
    const vals = ws.map((w) => w.kg);
    if (p) vals.push(p.goal);
    let min = Math.min(...vals), max = Math.max(...vals);
    const padV = Math.max(0.5, (max - min) * 0.1);
    min = Math.floor(min - padV); max = Math.ceil(max + padV);
    const x0 = xs[0], x1 = Math.max(xs.at(-1), x0 + 864e5);
    const sx = (x) => L + (x - x0) / (x1 - x0) * (W - L - R);
    const sy = (v) => T + (max - v) / (max - min) * (H - T - B);
    const ns = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(ns, 'svg');
    svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
    svg.setAttribute('role', 'img');
    svg.setAttribute('aria-label', 'Gewichtsverlauf');
    const add = (tag, attrs, text) => {
      const n = document.createElementNS(ns, tag);
      for (const k in attrs) n.setAttribute(k, attrs[k]);
      if (text !== undefined) n.textContent = text;
      svg.appendChild(n); return n;
    };
    const steps = 4;
    for (let i = 0; i <= steps; i++) {
      const v = min + (max - min) * i / steps;
      const y = sy(v);
      add('line', { x1: L, x2: W - R, y1: y, y2: y, stroke: 'var(--line)', 'stroke-width': 1 });
      add('text', { x: L - 6, y: y + 4, 'text-anchor': 'end', 'font-size': 12, fill: 'var(--muted)' }, fmt(v, 1));
    }
    [0, ws.length - 1].forEach((i) => {
      add('text', { x: sx(xs[i]), y: H - 8, 'text-anchor': i ? 'end' : 'start', 'font-size': 12, fill: 'var(--muted)' },
        parseKey(ws[i].date).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit' }));
    });
    if (p) {
      const gy = sy(p.goal);
      add('line', { x1: L, x2: W - R, y1: gy, y2: gy, stroke: 'var(--muted)', 'stroke-width': 1.5 });
      add('text', { x: W - R, y: gy - 6, 'text-anchor': 'end', 'font-size': 12, 'font-weight': 600, fill: 'var(--muted)' }, 'Ziel ' + fmt(p.goal, 1) + ' kg');
    }
    const tpts = trend.map((t, i) => sx(xs[i]) + ',' + sy(t.trend)).join(' ');
    add('polygon', { points: `${sx(xs[0])},${H - B} ${tpts} ${sx(xs.at(-1))},${H - B}`, fill: 'var(--accent)', opacity: 0.12 });
    add('polyline', { points: ws.map((w, i) => sx(xs[i]) + ',' + sy(w.kg)).join(' '), fill: 'none', stroke: 'var(--accent)', 'stroke-width': 1, opacity: 0.35 });
    add('polyline', { points: tpts, fill: 'none', stroke: 'var(--accent)', 'stroke-width': 3, 'stroke-linejoin': 'round', 'stroke-linecap': 'round' });
    ws.forEach((w, i) => {
      const last = i === ws.length - 1;
      const dot = add('circle', { cx: sx(xs[i]), cy: sy(w.kg), r: last ? 5 : ws.length > 40 ? 2 : 3.5, fill: last ? 'var(--accent)' : 'var(--card)', stroke: 'var(--accent)', 'stroke-width': 2 });
      const title = document.createElementNS(ns, 'title');
      title.textContent = fmtDate(w.date) + ': ' + fmt(w.kg, 1) + ' kg';
      dot.appendChild(title);
    });
    box.replaceChildren(svg);
  }

  function renderWorkouts() {
    const list = $('workout-list');
    const ws = [...state.workouts].sort((a, b) => b.date.localeCompare(a.date) || b.id.localeCompare(a.id)).slice(0, 30);
    list.replaceChildren();
    if (!ws.length) list.appendChild(el('li', { class: 'empty', text: 'Noch kein Training eingetragen. Los geht\'s!' }));
    ws.forEach((w) => {
      list.appendChild(rowItem(() => sheetWorkout(w), [
        el('span', { class: 'row-ico', 'aria-hidden': 'true', text: activityEmoji(w.type) }),
        el('div', { class: 'grow' }, [
          el('div', { class: 'title', text: w.type }),
          el('div', { class: 'muted', text: fmtDate(w.date) + ' · ' + w.min + ' Min.' })
        ]),
        el('span', { class: 'pill', text: fmt(w.kcal) + ' kcal' })
      ], w.type + ' bearbeiten'));
    });
    const mon = dateKey(mondayOf(new Date()));
    const week = state.workouts.filter((w) => w.date >= mon && w.date <= today());
    const mins = week.reduce((s, w) => s + w.min, 0);
    $('t-week-count').textContent = week.length;
    $('t-week-min').textContent = fmt(mins);
    $('t-week-kcal').textContent = fmt(week.reduce((s, w) => s + w.kcal, 0));
    $('t-week-bar').style.width = clamp(mins / 150 * 100, 0, 100) + '%';
  }

  // Welcher Tag im Bereich „Essen“ angezeigt wird (zum Nachtragen)
  let foodDay = today();
  function dayLabel(k) {
    const diff = Math.round((parseKey(today()) - parseKey(k)) / 864e5);
    return diff === 0 ? 'Heute' : diff === 1 ? 'Gestern' : diff === 2 ? 'Vorgestern' : parseKey(k).toLocaleDateString('de-DE', { weekday: 'long' });
  }
  function shiftFoodDay(n) {
    const d = parseKey(foodDay); d.setDate(d.getDate() + n);
    const k = dateKey(d);
    if (k > today()) return;
    foodDay = k;
    renderFood();
  }
  $('fd-prev').addEventListener('click', () => shiftFoodDay(-1));
  $('fd-next').addEventListener('click', () => shiftFoodDay(1));

  // Die häufigsten eigenen Einträge als Ein-Tipp-Buttons
  function favoriteFoods(limit) {
    const counts = new Map();
    state.foods.forEach((f) => {
      const key = f.name.toLowerCase() + '|' + f.kcal;
      const e = counts.get(key) || { name: f.name, kcal: f.kcal, protein: f.protein || 0, g: f.g, p100: f.p100, n: 0, last: '' };
      e.n++; if (f.date > e.last) e.last = f.date;
      counts.set(key, e);
    });
    return [...counts.values()].sort((a, b) => b.n - a.n || b.last.localeCompare(a.last)).slice(0, limit || 6);
  }

  function addFood(entry, opts) {
    const f = Object.assign({ id: uid(), date: foodDay, protein: 0 }, entry);
    f.kcal = Math.round(f.kcal);
    f.protein = Math.round((f.protein || 0) * 10) / 10;
    state.foods.push(f);
    haptic();
    save();
    if (!opts || !opts.silent) showToast(f.name + ' hinzugefügt', fmt(f.kcal) + ' kcal · ' + f.meal, { label: 'Rückgängig', fn: () => { state.foods = state.foods.filter((x) => x.id !== f.id); save(); } });
  }

  const MEALS = [['Frühstück', '🌅'], ['Mittagessen', '☀️'], ['Abendessen', '🌙'], ['Snack', '🍎']];
  function renderFood() {
    const t = today();
    if (foodDay > t) foodDay = t;
    const day = foodDay;
    const isToday = day === t;
    $('fd-label').textContent = dayLabel(day);
    $('fd-date').textContent = parseKey(day).toLocaleDateString('de-DE', { day: '2-digit', month: 'long', year: 'numeric' });
    $('fd-next').disabled = isToday;
    $('f-day-title').textContent = isToday ? 'Heute gegessen' : dayLabel(day) + ' gegessen';

    const c = calc();
    const items = state.foods.filter((f) => f.date === day);
    const total = items.reduce((s, f) => s + f.kcal, 0);
    const prot = items.reduce((s, f) => s + (f.protein || 0), 0);
    $('f-total').textContent = fmt(total);
    $('f-total-sub').textContent = c ? '/ ' + fmt(c.target) + ' kcal' : 'kcal';
    $('f-protein-total').textContent = fmt(prot) + ' g';
    $('f-protein-sub').textContent = c ? '/ ' + c.protein + ' g' : '';
    const kb = $('f-kcal-bar');
    kb.firstElementChild.style.width = c ? clamp(total / c.target * 100, 0, 100) + '%' : '0';
    kb.classList.toggle('over', !!c && total > c.target);
    $('f-protein-bar').firstElementChild.style.width = c ? clamp(prot / c.protein * 100, 0, 100) + '%' : '0';

    // Mahlzeiten als eigene Karten mit Zwischensumme und „+“
    $('meals').replaceChildren(...MEALS.map(([meal, ico]) => {
      const list = items.filter((f) => f.meal === meal);
      const sum = list.reduce((s, f) => s + f.kcal, 0);
      return el('div', { class: 'card meal' }, [
        el('div', { class: 'meal-head' }, [
          el('span', { class: 'meal-ico', 'aria-hidden': 'true', text: ico }),
          el('div', { class: 'grow' }, [el('strong', { text: meal }), el('div', { class: 'muted', text: list.length ? fmt(sum) + ' kcal' : 'Noch nichts eingetragen' })]),
          el('button', { type: 'button', class: 'add-round', 'aria-label': meal + ' hinzufügen', text: '+', onclick: () => sheetFood({ meal }) })
        ]),
        list.length ? el('ul', { class: 'list' }, list.map((f) => rowItem(() => sheetFoodEdit(f), [
          el('div', { class: 'grow' }, [
            el('div', { class: 'title', text: f.name }),
            el('div', { class: 'muted', text: (f.g ? fmt(f.g) + ' g · ' : '') + (f.protein ? fmt(f.protein) + ' g Eiweiß' : '') })
          ]),
          el('span', { class: 'num', text: fmt(f.kcal) + ' kcal' })
        ], f.name + ' bearbeiten'))) : null
      ]);
    }));

    const glasses = state.water[day] || 0;
    const goal = c ? c.water / 250 : 8;
    const shown = Math.max(goal, glasses + 1, 8);
    const water = $('water');
    water.replaceChildren();
    for (let i = 0; i < shown; i++) {
      water.appendChild(el('button', {
        class: 'glass' + (i < glasses ? ' full' : ''),
        'aria-label': (i + 1) + ' Gläser',
        onclick: () => { state.water[day] = (i + 1 === glasses) ? i : i + 1; haptic(); save(); }
      }));
    }
    $('water-text').textContent = fmt(glasses * 0.25, 2) + ' l von ' + fmt(goal * 0.25, 1) + ' l' + (glasses >= goal ? ' – super, Ziel erreicht! 💧' : '');
    renderFasting();
  }

  function renderPlan() {
    const level = state.plan.level;
    const plan = PLANS[level];
    const mon = mondayOf(new Date());
    const weekKey = dateKey(mon);
    const done = state.plan.done[weekKey] || [];
    const seg = $('plan-level');
    seg.replaceChildren();
    Object.keys(PLANS).forEach((k) => {
      seg.appendChild(el('button', {
        class: 'secondary' + (k === level ? ' on' : ''), type: 'button', text: PLANS[k].label,
        onclick: () => { state.plan.level = k; save(); }
      }));
    });
    const box = $('plan-days');
    box.replaceChildren(el('h2', { text: 'Woche ab ' + mon.toLocaleDateString('de-DE', { day: '2-digit', month: 'long' }) }));
    const todayIdx = (new Date().getDay() + 6) % 7;
    const names = ['Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag', 'Sonntag'];
    plan.days.forEach((d, i) => {
      const isDone = done.includes(i);
      const cb = el('input', { type: 'checkbox', id: 'plan-' + i, 'aria-label': names[i] + ' erledigt' });
      cb.checked = isDone;
      cb.addEventListener('change', () => {
        const set = new Set(state.plan.done[weekKey] || []);
        cb.checked ? set.add(i) : set.delete(i);
        state.plan.done[weekKey] = [...set];
        save();
      });
      box.appendChild(el('div', { class: 'day' + (isDone ? ' done' : '') + (i === todayIdx ? ' today' : '') }, [
        el('div', { class: 'day-head' }, [
          cb,
          el('label', { for: 'plan-' + i, class: 'grow', style: 'margin:0;color:var(--text);font-size:1rem' }, [
            el('strong', { class: 'day-title', text: names[i] + ': ' + d[0] })
          ]),
          i === todayIdx ? el('span', { class: 'pill blue', text: 'Heute' }) : null
        ]),
        el('ul', null, d[1].map((x) => el('li', { text: x }))),
        exChipsFor(d[1].join(' '))
      ]));
    });
    $('plan-progress').textContent = done.length + ' von 7 Tagen geschafft';
    $('plan-bar').style.width = (done.length / 7 * 100) + '%';
  }

  function renderProfile() {
    const p = state.profile;
    const c = calc();
    $('calc-card').hidden = !c;
    if (!c) return;
    $('c-bmr').textContent = fmt(c.bmr);
    $('c-tdee').textContent = fmt(c.tdee);
    $('c-target').textContent = fmt(c.target);
    $('c-protein').textContent = c.protein;
    $('c-explain').textContent = 'Berechnet mit der Mifflin-St-Jeor-Formel auf Basis deines aktuellen Gewichts (' + fmt(c.w, 1) +
      ' kg). Bei ' + fmt(c.deficit) + ' kcal Defizit pro Tag verlierst du rund ' + fmt(c.deficit * 7 / KCAL_PER_KG, 2) + ' kg pro Woche.';
    const warn = $('c-warn');
    const msgs = [];
    if (c.capped) msgs.push('Dein Tagesziel wurde auf ' + c.minKcal + ' kcal angehoben – weniger sollte man ohne ärztliche Begleitung nicht essen.');
    if (p.goal >= c.w) msgs.push('Dein Wunschgewicht liegt nicht unter deinem aktuellen Gewicht.');
    const goalBmi = p.goal / Math.pow(p.height / 100, 2);
    if (goalBmi < 18.5) msgs.push('Dein Wunschgewicht entspricht einem BMI von ' + fmt(goalBmi, 1) + ' (Untergewicht). Überlege, ein höheres Ziel zu wählen.');
    warn.hidden = !msgs.length;
    warn.textContent = msgs.join(' ');
  }

  function fillProfileForm() {
    const p = state.profile;
    if (!p) return;
    $('p-name').value = p.name || '';
    $('p-sex').value = p.sex;
    $('p-age').value = p.age;
    $('p-height').value = p.height;
    $('p-start').value = p.start;
    $('p-goal').value = p.goal;
    $('p-activity').value = String(p.activity);
    $('p-pace').value = String(p.pace);
  }

  // ---------- Navigation ----------
  function showTab(name) {
    document.querySelectorAll('section.tab').forEach((s) => s.classList.toggle('active', s.id === 'tab-' + name));
    document.querySelectorAll('nav.tabs button').forEach((b) => b.classList.toggle('active', b.dataset.tab === name));
    window.scrollTo(0, 0);
    if (name === 'stats') renderStats();
    try { sessionStorage.setItem('fit-leicht-tab', name); } catch (e) { /* ignorieren */ }
  }
  document.querySelectorAll('nav.tabs button').forEach((b) => b.addEventListener('click', () => showTab(b.dataset.tab)));
  document.querySelectorAll('[data-goto]').forEach((b) => b.addEventListener('click', () => showTab(b.dataset.goto)));
  $('avatar').addEventListener('click', () => showTab('profile'));

  // ---------- Formulare ----------
  $('weight-more').addEventListener('click', () => { showAllWeights = !showAllWeights; renderWeight(); });

  $('profile-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const isNew = !state.profile;
    state.profile = {
      name: $('p-name').value.trim(),
      sex: $('p-sex').value,
      age: Number($('p-age').value),
      height: Number($('p-height').value),
      start: Number($('p-start').value),
      goal: Number($('p-goal').value),
      activity: Number($('p-activity').value),
      pace: Number($('p-pace').value)
    };
    if (isNew && !state.weights.length) state.weights.push({ id: uid(), date: today(), kg: state.profile.start });
    save();
    if (isNew) showTab('home');
  });

  // ---------- Backup ----------
  // Auf Android öffnet sich das Teilen-Menü → z. B. „In Drive speichern“. Sonst normaler Download.
  async function exportBackup() {
    const name = 'fit-leicht-backup-' + today() + '.json';
    const json = JSON.stringify(state, null, 2);
    const done = (msg) => {
      state.lastBackup = today();
      save();
      $('backup-msg').textContent = msg;
    };
    try {
      const file = new File([json], name, { type: 'application/json' });
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({ files: [file], title: 'Fit & Leicht Backup' });
        return done('Backup geteilt. Tipp: „In Drive speichern“ wählen, dann ist es sicher in deinem Google-Konto.');
      }
    } catch (e) {
      if (e && e.name === 'AbortError') return; // Teilen abgebrochen
    }
    const a = el('a', { href: URL.createObjectURL(new Blob([json], { type: 'application/json' })), download: name });
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
    done('Backup wird heruntergeladen.');
  }
  $('export-btn').addEventListener('click', exportBackup);
  $('import-btn').addEventListener('click', () => $('import-file').click());
  $('import-file').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    file.text().then((txt) => {
      const data = JSON.parse(txt);
      if (!data || !Array.isArray(data.weights)) throw new Error('format');
      state = fromData(data);
      fillProfileForm();
      applyTheme();
      save();
      if (state.profile) closeOnboarding();
      $('backup-msg').textContent = 'Backup geladen.';
      showToast('Backup geladen', 'Willkommen zurück' + (state.profile && state.profile.name ? ', ' + state.profile.name : '') + '!');
    }).catch(() => { $('backup-msg').textContent = 'Die Datei ist kein gültiges Fit-&-Leicht-Backup.'; });
    e.target.value = '';
  });
  let resetArmed = null;
  $('reset-btn').addEventListener('click', () => {
    const btn = $('reset-btn');
    if (!resetArmed) {
      btn.textContent = 'Wirklich alles löschen? Nochmal tippen';
      resetArmed = setTimeout(() => { resetArmed = null; btn.textContent = 'Alles löschen'; }, 4000);
      return;
    }
    clearTimeout(resetArmed); resetArmed = null;
    btn.textContent = 'Alles löschen';
    $('backup-msg').textContent = 'Alle Daten gelöscht.';
    state = emptyState();
    document.querySelectorAll('form').forEach((f) => f.reset());
    applyTheme();
    save();
    openOnboarding();
  });

  // ---------- Heute zu tun ----------
  const isRestDay = (title) => /^Ruhetag/.test(title);

  function todayPlan() {
    const idx = (new Date().getDay() + 6) % 7;
    const day = PLANS[state.plan.level].days[idx];
    const done = (state.plan.done[dateKey(mondayOf(new Date()))] || []).includes(idx);
    return { idx, title: day[0], rest: isRestDay(day[0]), done };
  }

  function todoItems() {
    const t = today();
    const c = calc();
    const plan = todayPlan();
    const glasses = state.water[t] || 0;
    const goal = c ? c.water / 250 : 8;
    return [
      { key: 'weigh', title: 'Wiegen', sub: 'Gewicht von heute eintragen', done: state.weights.some((w) => w.date === t), tab: 'weight' },
      plan.rest
        ? { key: 'train', title: 'Ruhetag', sub: 'Erholung gehört zum Training', done: true, tab: 'plan' }
        : { key: 'train', title: 'Training: ' + plan.title, sub: 'Laut deinem Wochenplan', done: plan.done || state.workouts.some((w) => w.date === t), tab: 'train' },
      { key: 'water', title: 'Wasser trinken', sub: glasses + ' von ' + goal + ' Gläsern', done: glasses >= goal, tab: 'food' },
      { key: 'steps', title: fmt(STEP_GOAL) + ' Schritte', sub: (state.steps[t] ? fmt(state.steps[t]) : 'Noch keine') + ' Schritte eingetragen', done: (state.steps[t] || 0) >= STEP_GOAL, tab: 'train' },
      { key: 'food', title: 'Essen eintragen', sub: 'Mahlzeiten von heute', done: state.foods.some((f) => f.date === t), tab: 'food' },
      backupDue() ? { key: 'backup', title: 'Backup machen', sub: state.lastBackup ? 'Letztes Backup: ' + fmtDate(state.lastBackup) : 'Noch nie gesichert', done: false, tab: 'profile' } : null
    ].filter(Boolean);
  }

  // Backup fällig: nie gesichert und Daten älter als 7 Tage, oder letztes Backup älter als 14 Tage
  function backupDue() {
    const dates = state.weights.map((w) => w.date).concat(state.workouts.map((w) => w.date));
    if (!dates.length) return false;
    const days = (k) => (parseKey(today()) - parseKey(k)) / 864e5;
    if (!state.lastBackup) return days(dates.sort()[0]) >= 7;
    return days(state.lastBackup) >= 14;
  }

  function renderTodo() {
    $('todo-card').hidden = !state.profile;
    if (!state.profile) return;
    const list = $('todo-list');
    list.replaceChildren();
    const items = todoItems();
    $('todo-progress').textContent = items.filter((i) => i.done).length + ' / ' + items.length;
    items.forEach((it) => {
      list.appendChild(el('li', { class: it.done ? 'done' : '' }, [
        el('span', { class: 'check', 'aria-hidden': 'true', text: it.done ? '✓' : '' }),
        el('div', { class: 'grow' }, [
          el('div', { class: 'title', text: it.title }),
          el('div', { class: 'muted', text: it.done ? 'Erledigt' : it.sub })
        ]),
        it.done ? null : el('button', { type: 'button', class: 'secondary', text: 'Los', onclick: () => todoAction(it) })
      ]));
    });
  }

  // ---------- Erinnerungen ----------
  function renderReminders() {
    const r = state.reminders;
    if (document.activeElement && $('reminders').contains(document.activeElement) && document.activeElement.type === 'time') return;
    $('r-weigh-on').checked = r.weigh.on; $('r-weigh-time').value = r.weigh.time;
    $('r-train-on').checked = r.train.on; $('r-train-time').value = r.train.time;
    $('r-water-on').checked = r.water.on; $('r-water-every').value = String(r.water.every);
    $('r-food-on').checked = r.food.on; $('r-food-time').value = r.food.time;
    renderNotifStatus();
    renderGcal();
  }

  function renderNotifStatus() {
    const btn = $('notif-btn');
    const txt = $('notif-text');
    if (!('Notification' in window)) {
      txt.textContent = 'Dieser Browser kann keine Benachrichtigungen anzeigen. Nutze die Kalender-Erinnerungen. Auf dem iPhone geht es, wenn die App auf dem Home-Bildschirm installiert ist.';
      btn.hidden = true;
      return;
    }
    const perm = Notification.permission;
    btn.hidden = perm !== 'default';
    txt.textContent = perm === 'granted'
      ? 'Erlaubt. Die App meldet sich zur eingestellten Zeit, solange sie geöffnet ist oder im Hintergrund läuft.'
      : perm === 'denied'
        ? 'Blockiert. Du kannst Benachrichtigungen in den Einstellungen deines Browsers wieder erlauben.'
        : 'Die App meldet sich zur eingestellten Zeit, solange sie geöffnet ist oder im Hintergrund läuft.';
  }

  function bindReminder(id, apply) {
    $(id).addEventListener('change', (e) => { apply(e.target); save(); });
  }
  bindReminder('r-weigh-on', (t) => { state.reminders.weigh.on = t.checked; });
  bindReminder('r-weigh-time', (t) => { if (t.value) state.reminders.weigh.time = t.value; });
  bindReminder('r-train-on', (t) => { state.reminders.train.on = t.checked; });
  bindReminder('r-train-time', (t) => { if (t.value) state.reminders.train.time = t.value; });
  bindReminder('r-water-on', (t) => { state.reminders.water.on = t.checked; });
  bindReminder('r-water-every', (t) => { state.reminders.water.every = Number(t.value); });
  bindReminder('r-food-on', (t) => { state.reminders.food.on = t.checked; });
  bindReminder('r-food-time', (t) => { if (t.value) state.reminders.food.time = t.value; });

  $('notif-btn').addEventListener('click', () => {
    Notification.requestPermission().then(() => {
      renderNotifStatus();
      if (Notification.permission === 'granted') notify('Erinnerungen sind an', 'So sieht eine Erinnerung von Fit & Leicht aus.');
    });
  });

  // Alle Erinnerungen von heute: [key, 'HH:MM', Titel, Text, schon erledigt?]
  function dueList() {
    const r = state.reminders;
    const items = todoItems();
    const done = (k) => items.find((i) => i.key === k).done;
    const plan = todayPlan();
    const list = [];
    if (r.weigh.on) list.push(['weigh', r.weigh.time, 'Zeit zum Wiegen ⚖️', 'Trag dein Gewicht von heute ein.', done('weigh')]);
    if (r.train.on && !plan.rest) list.push(['train', r.train.time, 'Training: ' + plan.title, 'Heute steht dein Training an. Los geht\'s!', done('train')]);
    if (r.water.on) {
      for (let h = 9; h <= 21; h += r.water.every) list.push(['water-' + h, pad(h) + ':00', 'Wasser trinken 💧', 'Zeit für ein Glas Wasser.', done('water')]);
    }
    if (r.food.on) list.push(['food', r.food.time, 'Essen eintragen 🍽️', 'Hast du alle Mahlzeiten von heute eingetragen?', done('food')]);
    return list;
  }

  function notify(title, body) {
    const opts = { body, icon: 'icons/icon-192.png', badge: 'icons/icon-192.png', tag: 'fit-leicht-' + title, lang: 'de' };
    if ('Notification' in window && Notification.permission === 'granted') {
      const viaSw = navigator.serviceWorker && navigator.serviceWorker.controller
        ? navigator.serviceWorker.ready.then((reg) => reg.showNotification(title, opts))
        : Promise.reject();
      viaSw.catch(() => { try { new Notification(title, opts); } catch (e) { /* ignorieren */ } });
    }
    if (document.visibilityState === 'visible') showToast(title, body);
  }

  let toastTimer = null;
  let toastFn = null;
  function showToast(title, body, action) {
    $('toast-title').textContent = title;
    $('toast-body').textContent = body || '';
    $('toast-body').hidden = !body;
    toastFn = action ? action.fn : null;
    $('toast-action').hidden = !action;
    if (action) $('toast-action').textContent = action.label;
    $('toast').hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { $('toast').hidden = true; }, action ? 6000 : 8000);
  }
  $('toast-close').addEventListener('click', () => { $('toast').hidden = true; });
  $('toast-action').addEventListener('click', () => {
    $('toast').hidden = true;
    if (toastFn) toastFn();
    toastFn = null;
  });

  // Löschen mit „Rückgängig“
  function removeWithUndo(listName, item, label) {
    state[listName] = state[listName].filter((x) => x.id !== item.id);
    save();
    showToast(label + ' gelöscht', '', {
      label: 'Rückgängig',
      fn: () => { state[listName].push(item); save(); }
    });
  }

  // Prüft jede halbe Minute, ob eine Erinnerung fällig ist (bis 60 Min. nach der Uhrzeit)
  function checkReminders() {
    if (!state.profile) return;
    const t = today();
    const n = state.reminders.notified;
    if (n.date !== t) { n.date = t; n.keys = []; }
    const now = new Date();
    const mins = now.getHours() * 60 + now.getMinutes();
    let fired = false;
    dueList().forEach(([key, time, title, body, isDone]) => {
      const [h, m] = time.split(':').map(Number);
      const at = h * 60 + m;
      if (isDone || n.keys.includes(key) || mins < at || mins > at + 60) return;
      n.keys.push(key);
      fired = true;
      notify(title, body);
    });
    // Fastenziel erreicht
    const fa = state.fasting.active;
    if (fa && Date.now() - fa.start >= fa.goal * 3600e3 && !fa.notified) {
      fa.notified = true;
      fired = true;
      notify('Fastenziel erreicht 🌙', fa.goal + ' Stunden geschafft. Du kannst dein Essensfenster starten.');
    }
    if (fired) save();
  }

  // ---------- Kalender-Datei (.ics) ----------
  function icsEscape(text) {
    return String(text).replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n');
  }
  function icsFold(line) {
    const enc = new TextEncoder();
    const out = [];
    let cur = '', bytes = 0;
    for (const ch of line) {
      const b = enc.encode(ch).length;
      if (bytes + b > 74) { out.push(cur); cur = ' '; bytes = 1; }
      cur += ch; bytes += b;
    }
    out.push(cur);
    return out.join('\r\n');
  }
  const icsDate = (d, hhmm) => dateKey(d).replace(/-/g, '') + 'T' + hhmm.replace(':', '') + '00';

  function buildIcs() {
    const r = state.reminders;
    const now = new Date();
    const stamp = now.toISOString().replace(/[-:]/g, '').replace(/\.\d+/, '');
    const lines = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Fit & Leicht//Erinnerungen//DE', 'CALSCALE:GREGORIAN', 'METHOD:PUBLISH', 'X-WR-CALNAME:Fit & Leicht'];
    const event = (uid, start, time, rrule, summary, desc) => {
      lines.push('BEGIN:VEVENT', 'UID:' + uid + '@fit-leicht', 'DTSTAMP:' + stamp,
        'DTSTART:' + icsDate(start, time), 'DURATION:PT15M', 'RRULE:' + rrule,
        'SUMMARY:' + icsEscape(summary), 'DESCRIPTION:' + icsEscape(desc), 'TRANSP:TRANSPARENT',
        'BEGIN:VALARM', 'ACTION:DISPLAY', 'TRIGGER:PT0M', 'DESCRIPTION:' + icsEscape(summary), 'END:VALARM',
        'END:VEVENT');
    };
    const start = new Date();
    let count = 0;
    if (r.weigh.on) { event('wiegen', start, r.weigh.time, 'FREQ=DAILY', 'Wiegen ⚖️', 'Morgens vor dem Frühstück wiegen und in Fit & Leicht eintragen.'); count++; }
    if (r.train.on) {
      const codes = ['MO', 'TU', 'WE', 'TH', 'FR', 'SA', 'SU'];
      PLANS[state.plan.level].days.forEach((d, i) => {
        if (isRestDay(d[0])) return;
        const day = new Date(start);
        day.setDate(day.getDate() + ((i - ((day.getDay() + 6) % 7)) + 7) % 7);
        event('training-' + codes[i].toLowerCase(), day, r.train.time, 'FREQ=WEEKLY;BYDAY=' + codes[i],
          'Training: ' + d[0], d[1].join('\n'));
        count++;
      });
    }
    if (r.water.on) {
      for (let h = 9; h <= 21; h += r.water.every) { event('wasser-' + h, start, pad(h) + ':00', 'FREQ=DAILY', 'Wasser trinken 💧', 'Zeit für ein Glas Wasser.'); count++; }
    }
    if (r.food.on) { event('essen', start, r.food.time, 'FREQ=DAILY', 'Essen eintragen 🍽️', 'Alle Mahlzeiten von heute in Fit & Leicht eintragen.'); count++; }
    lines.push('END:VCALENDAR');
    return { text: lines.map(icsFold).join('\r\n') + '\r\n', count };
  }

  // Google-Kalender-Links: öffnen auf Android direkt die Kalender-App mit fertigem Termin
  function calendarEvents() {
    const r = state.reminders;
    const out = [];
    const codes = ['MO', 'TU', 'WE', 'TH', 'FR', 'SA', 'SU'];
    if (r.weigh.on) out.push({ key: 'weigh', label: 'Wiegen ' + r.weigh.time, title: 'Wiegen ⚖️', time: r.weigh.time, rrule: 'FREQ=DAILY', details: 'Morgens vor dem Frühstück wiegen und in Fit & Leicht eintragen.' });
    if (r.train.on) {
      const days = PLANS[state.plan.level].days.map((d, i) => [d, i]).filter(([d]) => !isRestDay(d[0]));
      if (days.length) {
        const names = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];
        out.push({ key: 'train', label: 'Training ' + r.train.time, title: 'Training 💪', time: r.train.time,
          rrule: 'FREQ=WEEKLY;BYDAY=' + days.map(([, i]) => codes[i]).join(','),
          firstIdx: days[0][1],
          details: 'Dein Plan (' + PLANS[state.plan.level].label + '):\n' + days.map(([d, i]) => names[i] + ': ' + d[0]).join('\n') + '\n\nDetails in Fit & Leicht → Plan.' });
      }
    }
    if (r.water.on) {
      for (let h = 9; h <= 21; h += r.water.every) out.push({ key: 'water-' + h, label: 'Wasser ' + pad(h) + ':00', title: 'Wasser trinken 💧', time: pad(h) + ':00', rrule: 'FREQ=DAILY', details: 'Zeit für ein Glas Wasser.' });
    }
    if (r.food.on) out.push({ key: 'food', label: 'Essen ' + r.food.time, title: 'Essen eintragen 🍽️', time: r.food.time, rrule: 'FREQ=DAILY', details: 'Alle Mahlzeiten von heute in Fit & Leicht eintragen.' });
    return out;
  }

  function gcalUrl(ev) {
    const start = new Date();
    if (ev.firstIdx !== undefined) start.setDate(start.getDate() + ((ev.firstIdx - ((start.getDay() + 6) % 7)) + 7) % 7);
    const [h, m] = ev.time.split(':').map(Number);
    const end = new Date(start.getFullYear(), start.getMonth(), start.getDate(), h, m + 15);
    const fmtG = (d, hh, mm) => dateKey(d).replace(/-/g, '') + 'T' + pad(hh) + pad(mm) + '00';
    let tz = '';
    try { tz = Intl.DateTimeFormat().resolvedOptions().timeZone || ''; } catch (e) { /* ignorieren */ }
    const q = new URLSearchParams({
      action: 'TEMPLATE',
      text: ev.title,
      dates: fmtG(start, h, m) + '/' + fmtG(end, end.getHours(), end.getMinutes()),
      details: ev.details,
      recur: 'RRULE:' + ev.rrule
    });
    if (tz) q.set('ctz', tz);
    return 'https://calendar.google.com/calendar/render?' + q.toString();
  }

  function renderGcal() {
    const added = new Set(state.reminders.gcalAdded || []);
    const evs = calendarEvents();
    $('gcal-links').replaceChildren(...(evs.length ? evs.map((ev) => {
      const sig = ev.key + '|' + ev.time + '|' + ev.rrule;
      return el('a', {
        class: 'gcal' + (added.has(sig) ? ' added' : ''), href: gcalUrl(ev), target: '_blank', rel: 'noopener',
        text: (added.has(sig) ? '✓ ' : '+ ') + ev.label,
        onclick: () => {
          const list = new Set(state.reminders.gcalAdded || []);
          list.add(sig);
          state.reminders.gcalAdded = [...list];
          save();
        }
      });
    }) : [el('p', { class: 'muted', text: 'Schalte oben mindestens eine Erinnerung ein.' })]));
  }

  $('ics-btn').addEventListener('click', () => {
    const { text, count } = buildIcs();
    if (!count) { showToast('Keine Erinnerung ausgewählt', 'Schalte oben mindestens eine Erinnerung ein.'); return; }
    const blob = new Blob([text], { type: 'text/calendar;charset=utf-8' });
    const a = el('a', { href: URL.createObjectURL(blob), download: 'fit-leicht-erinnerungen.ics' });
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 4000);
    showToast('Kalender-Datei erstellt', count + ' wiederkehrende Termine. Öffne die Datei und wähle „Alle hinzufügen“.');
  });

  // ---------- Schritte ----------
  function renderSteps() {
    const n = state.steps[today()] || 0;
    $('s-count').textContent = fmt(n) + ' / ' + fmt(STEP_GOAL);
    $('s-add-sub').textContent = n ? fmt(n) + ' heute' : 'eintragen';
    $('s-bar').style.width = clamp(n / STEP_GOAL * 100, 0, 100) + '%';
    $('s-text').textContent = n
      ? fmt(n) + ' von ' + fmt(STEP_GOAL) + ' Schritten' + (n >= STEP_GOAL ? ' – Ziel erreicht! 👟' : ' – noch ' + fmt(STEP_GOAL - n))
      : 'Ziel: ' + fmt(STEP_GOAL) + ' Schritte am Tag. Alltagsbewegung verbrennt oft mehr als ein Training.';
  }

  // ---------- Intervall-Timer ----------
  const timer = { phase: 'idle', round: 0, endAt: 0, left: 0, running: false, tick: null, wake: null, cfg: null };
  let audioCtx = null;

  function timerCfg() {
    return {
      work: clamp(Number($('tm-work').value) || 40, 5, 600),
      rest: clamp(Number($('tm-rest').value) || 0, 0, 600),
      rounds: clamp(Number($('tm-rounds').value) || 1, 1, 50)
    };
  }
  function applyPreset() {
    const v = $('tm-preset').value;
    document.querySelector('.tm-custom').hidden = v !== 'custom';
    if (v !== 'custom') {
      const [w, r, n] = v.split(',');
      $('tm-work').value = w; $('tm-rest').value = r; $('tm-rounds').value = n;
    }
    if (!timer.running && timer.phase !== 'paused') timerIdle();
  }
  const mmss = (sec) => Math.floor(sec / 60) + ':' + pad(sec % 60);

  function timerIdle() {
    const c = timerCfg();
    timer.phase = 'idle';
    const total = c.rounds * c.work + (c.rounds - 1) * c.rest;
    showTimer('idle', 'Bereit', c.work, c.rounds + ' Runden · ' + mmss(total) + ' Min. gesamt', 0);
  }
  function showTimer(phase, label, sec, sub, progress) {
    $('tm-display').dataset.phase = phase;
    $('tm-phase').textContent = label;
    $('tm-time').textContent = mmss(Math.max(0, Math.ceil(sec)));
    $('tm-round').textContent = sub;
    $('tm-bar').style.width = clamp(progress * 100, 0, 100) + '%';
  }

  function beep(freq, ms) {
    try {
      audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
      const o = audioCtx.createOscillator();
      const g = audioCtx.createGain();
      o.frequency.value = freq; o.type = 'sine';
      g.gain.setValueAtTime(0.3, audioCtx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + ms / 1000);
      o.connect(g); g.connect(audioCtx.destination);
      o.start(); o.stop(audioCtx.currentTime + ms / 1000);
    } catch (e) { /* kein Ton möglich */ }
  }
  const buzz = (pattern) => { try { navigator.vibrate && navigator.vibrate(pattern); } catch (e) { /* ignorieren */ } };

  function startPhase(phase) {
    const c = timer.cfg;
    timer.phase = phase;
    const dur = phase === 'prep' ? 5 : phase === 'work' ? c.work : c.rest;
    timer.endAt = Date.now() + dur * 1000;
    timer.dur = dur;
    timer.lastSec = null;
    if (phase === 'work') { beep(880, 400); buzz([200, 80, 200]); }
    if (phase === 'rest') { beep(440, 500); buzz(400); }
  }

  function timerTick() {
    const c = timer.cfg;
    const left = (timer.endAt - Date.now()) / 1000;
    const sec = Math.ceil(left);
    if (sec !== timer.lastSec && sec <= 3 && sec >= 1) beep(660, 120);
    timer.lastSec = sec;
    if (left <= 0) {
      if (timer.phase === 'prep') startPhase('work');
      else if (timer.phase === 'work') {
        if (timer.round >= c.rounds) return timerFinish();
        if (c.rest > 0) startPhase('rest');
        else { timer.round++; startPhase('work'); }
      } else if (timer.phase === 'rest') { timer.round++; startPhase('work'); }
      return timerTick();
    }
    const labels = { prep: 'Gleich geht\'s los', work: 'Belastung', rest: 'Pause' };
    showTimer(timer.phase, labels[timer.phase], left, 'Runde ' + timer.round + ' von ' + c.rounds, 1 - left / timer.dur);
  }

  async function keepAwake() {
    try { if ('wakeLock' in navigator) timer.wake = await navigator.wakeLock.request('screen'); } catch (e) { /* ignorieren */ }
  }
  function releaseAwake() {
    try { if (timer.wake) timer.wake.release(); } catch (e) { /* ignorieren */ }
    timer.wake = null;
  }

  function timerStart() {
    if (timer.running) { // Pause
      timer.running = false;
      timer.left = timer.endAt - Date.now();
      clearInterval(timer.tick);
      releaseAwake();
      $('tm-start').textContent = 'Weiter';
      $('tm-phase').textContent = 'Pausiert';
      return;
    }
    if (timer.phase === 'idle' || timer.phase === 'done') {
      timer.cfg = timerCfg();
      timer.round = 1;
      timer.startedAt = Date.now();
      startPhase('prep');
    } else {
      timer.endAt = Date.now() + timer.left; // aus Pause fortsetzen
    }
    beep(1, 1); // Ton auf dem Handy freischalten
    timer.running = true;
    $('tm-start').textContent = 'Pause';
    $('tm-stop').disabled = false;
    keepAwake();
    timerTick();
    timer.tick = setInterval(timerTick, 200);
  }

  function timerStop() {
    timer.running = false;
    clearInterval(timer.tick);
    releaseAwake();
    $('tm-start').textContent = 'Start';
    $('tm-stop').disabled = true;
    timerIdle();
  }

  function timerFinish() {
    const c = timer.cfg;
    clearInterval(timer.tick);
    timer.running = false;
    timer.phase = 'done';
    releaseAwake();
    beep(988, 250); setTimeout(() => beep(1319, 500), 260);
    buzz([300, 100, 300, 100, 600]);
    $('tm-start').textContent = 'Nochmal';
    $('tm-stop').disabled = true;
    const minutes = Math.max(1, Math.round((c.rounds * c.work + (c.rounds - 1) * c.rest) / 60));
    showTimer('done', 'Geschafft! 💪', 0, c.rounds + ' Runden · ' + minutes + ' Min.', 1);
    const preset = $('tm-preset');
    const isPlank = preset.value === '45,15,4';
    const type = isPlank ? 'Bodyweight / Zirkeltraining' : 'HIIT';
    const met = (ACTIVITIES.find((a) => a[0] === type) || ['', 8])[1];
    showToast('Training geschafft!', minutes + ' Min. ' + type, {
      label: 'Eintragen',
      fn: () => {
        state.workouts.push({ id: uid(), date: today(), type, min: minutes, kcal: workoutKcal(met, minutes, currentWeight()) });
        markPlanDone(today());
        save();
        showToast('Training eingetragen', minutes + ' Min. ' + type);
      }
    });
  }

  $('tm-preset').addEventListener('change', applyPreset);
  ['tm-work', 'tm-rest', 'tm-rounds'].forEach((id) => $(id).addEventListener('input', () => { if (!timer.running) timerIdle(); }));
  $('tm-start').addEventListener('click', timerStart);
  $('tm-stop').addEventListener('click', timerStop);
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible' && timer.running) keepAwake(); });
  applyPreset();

  // ---------- Erfolge ----------
  function longestStreak() {
    const days = [...new Set(state.workouts.map((w) => w.date))].sort();
    let best = 0, cur = 0, prev = null;
    days.forEach((d) => {
      const p = prev ? parseKey(prev) : null;
      if (p) p.setDate(p.getDate() + 1);
      cur = p && dateKey(p) === d ? cur + 1 : 1;
      best = Math.max(best, cur); prev = d;
    });
    return best;
  }
  function bestWeekMinutes() {
    const weeks = {};
    state.workouts.forEach((w) => { const k = dateKey(mondayOf(parseKey(w.date))); weeks[k] = (weeks[k] || 0) + w.min; });
    return Math.max(0, ...Object.values(weeks));
  }
  function badgeList() {
    const p = state.profile;
    const minW = state.weights.length ? Math.min(...state.weights.map((w) => w.kg)) : null;
    const lost = p && minW !== null ? p.start - minW : 0;
    const total = p ? p.start - p.goal : 0;
    const n = state.workouts.length;
    const ls = longestStreak();
    const firstWaist = state.weights.filter((w) => w.waist).sort((a, b) => a.date.localeCompare(b.date));
    const waistLost = firstWaist.length > 1 ? firstWaist[0].waist - Math.min(...firstWaist.map((w) => w.waist)) : 0;
    return [
      ['start', '🚀', 'Los geht\'s', 'Profil angelegt', !!p],
      ['first-workout', '🏃', 'Erstes Training', 'Ein Training eingetragen', n >= 1],
      ['kg1', '⚖️', 'Erstes Kilo', '1 kg abgenommen', lost >= 1],
      ['kg5', '🔥', '5 Kilo', '5 kg abgenommen', lost >= 5],
      ['kg10', '🏅', '10 Kilo', '10 kg abgenommen', lost >= 10],
      ['half', '🌗', 'Halbzeit', 'Halber Weg zum Ziel', total > 0 && lost >= total / 2],
      ['goal', '🏆', 'Ziel erreicht', 'Wunschgewicht geschafft', total > 0 && lost >= total],
      ['streak3', '📅', '3 Tage am Stück', '3 Trainingstage in Folge', ls >= 3],
      ['streak7', '💎', '7 Tage am Stück', '7 Trainingstage in Folge', ls >= 7],
      ['w10', '💪', '10 Trainings', '10 Trainings eingetragen', n >= 10],
      ['w50', '🦾', '50 Trainings', '50 Trainings eingetragen', n >= 50],
      ['who', '❤️', 'WHO-Woche', '150 Min. Sport in einer Woche', bestWeekMinutes() >= 150],
      ['steps', '👟', 'Schrittmacher', fmt(STEP_GOAL) + ' Schritte an einem Tag', Object.values(state.steps).some((v) => v >= STEP_GOAL)],
      ['waist', '📏', 'Weniger Bauch', '3 cm weniger Bauchumfang', waistLost >= 3],
      ['fast', '🌙', 'Fasten geschafft', 'Ein Fastenziel erreicht', state.fasting.history.some((x) => x.end - x.start >= x.goal * 3600e3)],
      ['scan', '📷', 'Scanner-Profi', '5 Produkte gescannt', Object.keys(state.products).length >= 5]
    ];
  }
  function renderBadges() {
    $('badge-card').hidden = !state.profile;
    if (!state.profile) return;
    const list = badgeList();
    const got = list.filter((b) => b[4]);
    $('badge-count').textContent = got.length + ' von ' + list.length + ' freigeschaltet';
    $('badges').replaceChildren(...list.map(([id, ico, name, desc, ok]) => el('div', { class: 'badge' + (ok ? ' got' : ''), title: desc }, [
      el('span', { class: 'ico', 'aria-hidden': 'true', text: ico }),
      el('span', null, [el('strong', { text: name }), el('span', { text: ok ? 'Geschafft' : desc })])
    ])));
    // Neue Erfolge einmalig feiern
    const seen = new Set(state.badges || []);
    const fresh = got.filter((b) => !seen.has(b[0]));
    if (fresh.length) {
      state.badges = got.map((b) => b[0]);
      try { localStorage.setItem(STORE_KEY, JSON.stringify(state)); } catch (e) { /* ignorieren */ }
      const b = fresh.at(-1);
      // kurz warten, damit die Meldung nach „Gespeichert“ erscheint
      if (seen.size || fresh.length === 1) setTimeout(() => showToast('Neuer Erfolg: ' + b[2] + ' ' + b[1], b[3]), 1800);
    }
  }

  // ---------- Analyse ----------
  let statsRange = 30;
  const HABITS = ['Wiegen', 'Training', 'Wasser', 'Schritte', 'Essen'];
  const DOW = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];

  function rangeKeys(n, endKey) {
    const end = parseKey(endKey || today());
    const out = [];
    for (let i = n - 1; i >= 0; i--) { const d = new Date(end); d.setDate(d.getDate() - i); out.push(dateKey(d)); }
    return out;
  }

  function dayStats(k) {
    const c = calc();
    const foods = state.foods.filter((f) => f.date === k);
    const works = state.workouts.filter((w) => w.date === k);
    const d = parseKey(k);
    const idx = (d.getDay() + 6) % 7;
    const planDone = (state.plan.done[dateKey(mondayOf(d))] || []).includes(idx);
    const rest = isRestDay(PLANS[state.plan.level].days[idx][0]);
    const glasses = state.water[k] || 0;
    const waterGoal = c ? c.water / 250 : 8;
    const steps = state.steps[k] || 0;
    const weight = state.weights.find((w) => w.date === k);
    const s = {
      key: k,
      kcal: foods.length ? foods.reduce((a, f) => a + f.kcal, 0) : null,
      protein: foods.length ? foods.reduce((a, f) => a + (f.protein || 0), 0) : null,
      workoutMin: works.reduce((a, w) => a + w.min, 0),
      workoutCount: works.length,
      steps: steps || null,
      glasses,
      weight: weight ? weight.kg : null,
      habits: [!!weight, works.length > 0 || planDone || rest, glasses >= waterGoal, steps >= STEP_GOAL, foods.length > 0]
    };
    s.score = s.habits.filter(Boolean).length;
    return s;
  }

  const avg = (arr) => arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : null;
  const signed = (v, d) => (v > 0 ? '+' : v < 0 ? '−' : '±') + fmt(Math.abs(v), d);

  function trendChange(fromKey, toKey) {
    const tr = weightTrend().filter((t) => t.date >= fromKey && t.date <= toKey);
    if (tr.length < 2) return null;
    return { delta: tr.at(-1).trend - tr[0].trend, last: tr.at(-1).kg };
  }

  function summary(keys) {
    const days = keys.map(dayStats);
    const c = calc();
    const foodDays = days.filter((d) => d.kcal !== null);
    const works = state.workouts.filter((w) => w.date >= keys[0] && w.date <= keys.at(-1));
    const stepDays = days.filter((d) => d.steps);
    return {
      days, c,
      weight: trendChange(keys[0], keys.at(-1)),
      kcalAvg: avg(foodDays.map((d) => d.kcal)),
      proteinAvg: avg(foodDays.map((d) => d.protein)),
      foodDays: foodDays.length,
      inTarget: c ? foodDays.filter((d) => d.kcal <= c.target).length : 0,
      workouts: works.length,
      workoutMin: works.reduce((a, w) => a + w.min, 0),
      stepsAvg: avg(stepDays.map((d) => d.steps)),
      stepDays: stepDays.length,
      waterDays: days.filter((d) => d.habits[2]).length,
      weighDays: days.filter((d) => d.weight !== null).length,
      habitPct: days.length ? days.reduce((a, d) => a + d.score, 0) / (days.length * HABITS.length) : 0,
      works
    };
  }

  function kpi(label, value, sub, cls) {
    return el('div', { class: 'stat' }, [
      el('div', { class: 'label', text: label }),
      el('div', { class: 'value' + (cls ? ' delta ' + cls : ''), text: value }),
      el('div', { class: 'sub', text: sub })
    ]);
  }

  function renderStats() {
    const n = statsRange;
    const keys = rangeKeys(n);
    const S = summary(keys);
    const c = S.c;
    document.querySelectorAll('#range-seg button').forEach((b) => b.classList.toggle('on', Number(b.dataset.range) === n));

    // Kennzahlen
    $('kpis').replaceChildren(
      kpi('Gewicht (Trend)', S.weight ? signed(S.weight.delta, 1) + ' kg' : '–',
        S.weight ? 'in ' + n + ' Tagen · jetzt ' + fmt(S.weight.last, 1) + ' kg' : 'Zu wenige Messungen',
        S.weight ? (S.weight.delta < -0.05 ? 'good' : S.weight.delta > 0.05 ? 'bad' : '') : ''),
      kpi('Ø Kalorien', S.kcalAvg !== null ? fmt(S.kcalAvg) : '–',
        S.foodDays ? 'an ' + S.foodDays + ' Tagen' + (c ? ' · Ziel ' + fmt(c.target) : '') : 'Noch kein Essen eingetragen',
        S.kcalAvg !== null && c ? (S.kcalAvg <= c.target ? 'good' : 'bad') : ''),
      kpi('Trainings', String(S.workouts), fmt(S.workoutMin) + ' Min. · Ø ' + fmt(S.workoutMin / (n / 7)) + ' pro Woche'),
      kpi('Ø Schritte', S.stepsAvg !== null ? fmt(S.stepsAvg) : '–', S.stepDays ? 'an ' + S.stepDays + ' Tagen' : 'Noch keine Schritte'),
      kpi('Wasserziel', S.waterDays + ' / ' + n, 'Tage erreicht'),
      kpi('Ø Eiweiß', S.proteinAvg !== null ? fmt(S.proteinAvg) + ' g' : '–', c ? 'Ziel ' + c.protein + ' g' : '',
        S.proteinAvg !== null && c ? (S.proteinAvg >= c.protein * 0.9 ? 'good' : '') : '')
    );

    renderInsights(S, n);
    renderHeat(S.days);
    drawStatsWeight(keys);
    barChart($('ch-kcal'), S.days.map((d) => ({
      label: fmtDate(d.key), value: d.kcal, key: d.key,
      color: c && d.kcal > c.target ? 'var(--energy)' : 'var(--accent)',
      tip: d.kcal === null ? 'nichts eingetragen' : fmt(d.kcal) + ' kcal' + (d.protein ? ' · ' + fmt(d.protein) + ' g Eiweiß' : '')
    })), { ref: c ? c.target : null, refLabel: c ? 'Ziel ' + fmt(c.target) : '', xLabel: dayTick(n) });

    // Wochen-Minuten
    const weeks = [];
    const firstMon = mondayOf(parseKey(keys[0]));
    for (let d = new Date(firstMon); dateKey(d) <= today(); d.setDate(d.getDate() + 7)) {
      const from = dateKey(d);
      const to = new Date(d); to.setDate(to.getDate() + 6);
      const ws = state.workouts.filter((w) => w.date >= from && w.date <= dateKey(to));
      const min = ws.reduce((a, w) => a + w.min, 0);
      weeks.push({ key: from, label: 'Woche ab ' + d.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit' }), value: min, color: 'var(--accent)', tip: fmt(min) + ' Min. · ' + ws.length + ' Trainings' });
    }
    barChart($('ch-train'), weeks, { ref: 150, refLabel: '150 Min.', xLabel: (i, item) => (weeks.length <= 6 || i % 2 === 0) ? parseKey(item.key).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit' }) : null });

    barChart($('ch-steps'), S.days.map((d) => ({
      label: fmtDate(d.key), value: d.steps, key: d.key, color: 'var(--accent)',
      tip: d.steps ? fmt(d.steps) + ' Schritte' : 'nichts eingetragen'
    })), { ref: STEP_GOAL, refLabel: fmt(STEP_GOAL), xLabel: dayTick(n) });

    renderStatsTable(S.days);
  }

  function dayTick(n) {
    return (i, item, len) => {
      const d = parseKey(item.key);
      if (n <= 7) return DOW[(d.getDay() + 6) % 7];
      const every = n <= 30 ? 7 : 21;
      return (len - 1 - i) % every === 0 ? d.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit' }) : null;
    };
  }

  function renderInsights(S, n) {
    const c = S.c;
    const out = [];
    const p = state.profile;
    if (!p) { $('insights').replaceChildren(el('li', { class: 'empty', text: 'Lege zuerst ein Profil an.' })); return; }

    const rate = weeklyRate();
    const w = currentWeight();
    if (rate !== null && w > p.goal) {
      if (rate < -0.05) {
        const weeks = (w - p.goal) / -rate;
        const eta = new Date(); eta.setDate(eta.getDate() + Math.round(weeks * 7));
        const deficit = -rate * KCAL_PER_KG / 7;
        out.push(['📉', 'Du nimmst ' + fmt(-rate, 2) + ' kg pro Woche ab',
          'Das entspricht etwa ' + fmt(deficit) + ' kcal Defizit am Tag. In diesem Tempo erreichst du dein Ziel ca. im ' + eta.toLocaleDateString('de-DE', { month: 'long', year: 'numeric' }) + '.' + (rate < -1 ? ' Das ist sehr schnell. Iss genug Eiweiß, damit du keine Muskeln verlierst.' : '')]);
      } else {
        out.push(['⏸️', 'Dein Gewicht ist gerade stabil',
          'Seit 4 Wochen tut sich wenig. Prüfe deine Portionen mit einer Küchenwaage oder bau 2.000 Schritte mehr am Tag ein.']);
      }
    } else if (S.weighDays < 2) {
      out.push(['⚖️', 'Wiege dich öfter', 'Mit 2–3 Messungen pro Woche wird dein Trend genauer.']);
    }

    if (S.foodDays >= 3 && c) {
      const pct = S.inTarget / S.foodDays;
      out.push([pct >= 0.7 ? '🎯' : '🍽️', 'An ' + S.inTarget + ' von ' + S.foodDays + ' Tagen im Kalorienziel',
        pct >= 0.7 ? 'Stark! So bleibt das Defizit verlässlich.' : 'Versuch, an mehr Tagen unter ' + fmt(c.target) + ' kcal zu bleiben. Plane abends den nächsten Tag vor.']);
    } else if (S.foodDays < 3) {
      out.push(['📝', 'Trag öfter dein Essen ein', 'Schon ein paar Tage pro Woche zeigen dir, wo die Kalorien stecken.']);
    }

    if (S.proteinAvg !== null && c && S.proteinAvg < c.protein * 0.8) {
      out.push(['🥚', 'Mehr Eiweiß einbauen', 'Im Schnitt ' + fmt(S.proteinAvg) + ' g statt ' + c.protein + ' g. Quark, Skyr, Eier, Hähnchen oder Linsen helfen.']);
    }

    const perWeek = S.workoutMin / (n / 7);
    if (S.works.length) {
      const byDow = [0, 0, 0, 0, 0, 0, 0];
      S.works.forEach((x) => { byDow[(parseKey(x.date).getDay() + 6) % 7]++; });
      const best = byDow.indexOf(Math.max(...byDow));
      out.push(['💪', 'Ø ' + fmt(perWeek) + ' Min. Sport pro Woche',
        (perWeek >= 150 ? 'Du erfüllst die WHO-Empfehlung. ' : 'Bis zur WHO-Empfehlung fehlen ' + fmt(150 - perWeek) + ' Min. pro Woche. ') +
        'Am häufigsten trainierst du am ' + ['Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag', 'Sonntag'][best] + '.']);
    } else {
      out.push(['🏃', 'Noch kein Training im Zeitraum', 'Starte mit 2–3 kurzen Einheiten pro Woche, zum Beispiel mit dem Intervall-Timer.']);
    }

    const good = S.days.filter((d) => d.score >= 4).length;
    out.push(['🔥', fmt(S.habitPct * 100) + ' % deiner Gewohnheiten geschafft',
      good + ' von ' + n + ' Tagen mit mindestens 4 von 5 Gewohnheiten. Kleine Schritte jeden Tag schlagen große Ausnahmen.']);

    $('insights').replaceChildren(...out.slice(0, 5).map(([ico, t, x]) => el('li', null, [
      el('span', { class: 'ico', 'aria-hidden': 'true', text: ico }),
      el('div', null, [el('strong', { text: t }), el('span', { text: x })])
    ])));
  }

  function renderHeat(days) {
    const box = $('heat');
    box.replaceChildren(...DOW.map((d) => el('div', { class: 'dow', text: d })));
    const first = parseKey(days[0].key);
    const lead = (first.getDay() + 6) % 7;
    for (let i = 0; i < lead; i++) box.appendChild(el('button', { class: 'blank', type: 'button', tabindex: '-1', 'aria-hidden': 'true' }));
    const t = today();
    days.forEach((d) => {
      const done = HABITS.filter((_, i) => d.habits[i]);
      const b = el('button', {
        type: 'button', 'data-l': String(d.score), class: d.key === t ? 'today' : '',
        'aria-label': fmtDate(d.key) + ': ' + d.score + ' von 5 Gewohnheiten',
        onclick: () => {
          $('heat-detail').replaceChildren(
            el('strong', { text: fmtDate(d.key) + ': ' }),
            document.createTextNode(HABITS.map((h, i) => (d.habits[i] ? '✓ ' : '✗ ') + h).join('  '))
          );
        }
      });
      box.appendChild(b);
    });
    $('heat-detail').textContent = 'Tippe auf einen Tag für Details.';
  }

  function renderStatsTable(days) {
    const head = ['Tag', 'kcal', 'Eiweiß', 'Training', 'Schritte', 'Wasser', 'Gewicht'];
    const rows = [...days].reverse().map((d) => [
      fmtDate(d.key),
      d.kcal !== null ? fmt(d.kcal) : '–',
      d.protein !== null ? fmt(d.protein) + ' g' : '–',
      d.workoutMin ? d.workoutMin + ' Min.' : '–',
      d.steps ? fmt(d.steps) : '–',
      d.glasses ? d.glasses + ' Gl.' : '–',
      d.weight !== null ? fmt(d.weight, 1) + ' kg' : '–'
    ]);
    $('stats-table').replaceChildren(el('table', null, [
      el('thead', null, [el('tr', null, head.map((h) => el('th', { text: h })))]),
      el('tbody', null, rows.map((r) => el('tr', null, r.map((v) => el('td', { text: v })))))
    ]));
  }

  // ---------- Diagramm-Bausteine ----------
  const SVGNS = 'http://www.w3.org/2000/svg';
  function svgEl(tag, attrs, text) {
    const n = document.createElementNS(SVGNS, tag);
    for (const k in attrs) n.setAttribute(k, attrs[k]);
    if (text !== undefined) n.textContent = text;
    return n;
  }
  function niceStep(raw) {
    const p = Math.pow(10, Math.floor(Math.log10(raw)));
    const f = raw / p;
    return (f <= 1 ? 1 : f <= 2 ? 2 : f <= 2.5 ? 2.5 : f <= 5 ? 5 : 10) * p;
  }
  function chartTip(wrap) {
    let tip = wrap.querySelector('.chart-tip');
    if (!tip) { tip = el('div', { class: 'chart-tip', hidden: '' }); wrap.appendChild(tip); }
    return tip;
  }
  function showTip(wrap, svg, W, x, y, title, body) {
    const tip = chartTip(wrap);
    const scale = svg.getBoundingClientRect().width / W;
    tip.replaceChildren(el('strong', { text: title }), document.createTextNode(body));
    tip.hidden = false;
    const px = clamp(x * scale, 60, wrap.clientWidth - 60);
    tip.style.left = px + 'px';
    tip.style.top = Math.max(0, y * scale - 8) + 'px';
  }

  // Säulen: 4px runde Kappe oben, gerade Basis, max. 24px breit, Zielwert als Referenzlinie
  function barChart(wrap, items, opts) {
    const W = 400, H = 210, L = 40, R = 8, T = 18, B = 24;
    const vals = items.map((i) => i.value || 0);
    const top = Math.max(1, ...vals, opts.ref || 0);
    const step = niceStep(top / 4);
    const max = Math.ceil(top * 1.05 / step) * step;
    const sy = (v) => T + (1 - v / max) * (H - T - B);
    const band = (W - L - R) / items.length;
    const bw = Math.min(24, Math.max(2, band - 2));
    const svg = svgEl('svg', { viewBox: `0 0 ${W} ${H}`, role: 'img', 'aria-label': wrap.previousElementSibling ? wrap.previousElementSibling.textContent : 'Diagramm' });
    for (let v = 0; v <= max + 1e-9; v += step) {
      svg.appendChild(svgEl('line', { x1: L, x2: W - R, y1: sy(v), y2: sy(v), stroke: 'var(--line)', 'stroke-width': 1 }));
      svg.appendChild(svgEl('text', { x: L - 6, y: sy(v) + 4, 'text-anchor': 'end', 'font-size': 11, fill: 'var(--muted)' }, fmt(v)));
    }
    if (!items.some((i) => i.value)) {
      svg.appendChild(svgEl('text', { x: (L + W - R) / 2, y: H / 2, 'text-anchor': 'middle', 'font-size': 13, fill: 'var(--muted)' }, 'Noch keine Daten im Zeitraum'));
    }
    items.forEach((it, i) => {
      const x = L + i * band + (band - bw) / 2;
      if (it.value) {
        const y = sy(it.value), y0 = sy(0);
        const r = Math.min(4, bw / 2, y0 - y);
        svg.appendChild(svgEl('path', {
          d: `M${x},${y0} V${y + r} Q${x},${y} ${x + r},${y} H${x + bw - r} Q${x + bw},${y} ${x + bw},${y + r} V${y0} Z`,
          fill: it.color || 'var(--accent)'
        }));
      }
      const lbl = opts.xLabel ? opts.xLabel(i, it, items.length) : null;
      if (lbl) svg.appendChild(svgEl('text', { x: x + bw / 2, y: H - 6, 'text-anchor': 'middle', 'font-size': 11, fill: 'var(--muted)' }, lbl));
    });
    if (opts.ref) {
      const y = sy(opts.ref);
      svg.appendChild(svgEl('line', { x1: L, x2: W - R, y1: y, y2: y, stroke: 'var(--muted)', 'stroke-width': 1.5 }));
      svg.appendChild(svgEl('text', { x: W - R, y: y - 5, 'text-anchor': 'end', 'font-size': 11, 'font-weight': 600, fill: 'var(--muted)' }, opts.refLabel));
    }
    // Trefferflächen: ganze Spalte, größer als der Balken
    items.forEach((it, i) => {
      const hit = svgEl('rect', { x: L + i * band, y: T, width: band, height: H - T - B, fill: 'transparent' });
      const show = () => showTip(wrap, svg, W, L + i * band + band / 2, it.value ? sy(it.value) : sy(0), it.label, it.tip);
      hit.addEventListener('pointerenter', show);
      hit.addEventListener('pointerdown', show);
      svg.appendChild(hit);
    });
    svg.addEventListener('pointerleave', () => { chartTip(wrap).hidden = true; });
    wrap.replaceChildren(svg);
  }

  // Gewicht im Zeitraum: Trendlinie + Messpunkte, Fadenkreuz beim Berühren
  function drawStatsWeight(keys) {
    const wrap = $('ch-weight');
    const p = state.profile;
    const tr = weightTrend().filter((t) => t.date >= keys[0]);
    if (tr.length < 2) {
      wrap.replaceChildren(el('p', { class: 'empty', text: 'Ab zwei Messungen im Zeitraum siehst du hier deine Kurve.' }));
      $('lg-weight').hidden = true;
      return;
    }
    $('lg-weight').hidden = false;
    const W = 400, H = 210, L = 40, R = 10, T = 16, B = 24;
    const all = tr.map((t) => t.kg).concat(tr.map((t) => t.trend));
    let min = Math.min(...all), max = Math.max(...all);
    const showGoal = p && p.goal >= min - 3;
    if (showGoal) min = Math.min(min, p.goal);
    const step = niceStep(Math.max(0.5, (max - min) / 4));
    min = Math.floor((min - step * 0.3) / step) * step; max = Math.ceil((max + step * 0.3) / step) * step;
    const x0 = parseKey(keys[0]).getTime(), x1 = parseKey(keys.at(-1)).getTime();
    const sx = (k) => L + (parseKey(k).getTime() - x0) / Math.max(1, x1 - x0) * (W - L - R);
    const sy = (v) => T + (max - v) / (max - min) * (H - T - B);
    const svg = svgEl('svg', { viewBox: `0 0 ${W} ${H}`, role: 'img', 'aria-label': 'Gewichtsverlauf im Zeitraum' });
    for (let v = min; v <= max + 1e-9; v += step) {
      svg.appendChild(svgEl('line', { x1: L, x2: W - R, y1: sy(v), y2: sy(v), stroke: 'var(--line)', 'stroke-width': 1 }));
      svg.appendChild(svgEl('text', { x: L - 6, y: sy(v) + 4, 'text-anchor': 'end', 'font-size': 11, fill: 'var(--muted)' }, fmt(v, step < 1 ? 1 : 0)));
    }
    [keys[0], keys.at(-1)].forEach((k, i) => svg.appendChild(svgEl('text', { x: i ? W - R : L, y: H - 6, 'text-anchor': i ? 'end' : 'start', 'font-size': 11, fill: 'var(--muted)' },
      parseKey(k).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit' }))));
    $('lg-weight').lastElementChild.hidden = !showGoal;
    if (showGoal) {
      svg.appendChild(svgEl('line', { x1: L, x2: W - R, y1: sy(p.goal), y2: sy(p.goal), stroke: 'var(--muted)', 'stroke-width': 1.5 }));
      svg.appendChild(svgEl('text', { x: W - R, y: sy(p.goal) - 5, 'text-anchor': 'end', 'font-size': 11, 'font-weight': 600, fill: 'var(--muted)' }, 'Ziel ' + fmt(p.goal, 1)));
    }
    const pts = tr.map((t) => sx(t.date) + ',' + sy(t.trend)).join(' ');
    svg.appendChild(svgEl('polygon', { points: `${sx(tr[0].date)},${H - B} ${pts} ${sx(tr.at(-1).date)},${H - B}`, fill: 'var(--accent)', opacity: 0.1 }));
    svg.appendChild(svgEl('polyline', { points: pts, fill: 'none', stroke: 'var(--accent)', 'stroke-width': 2, 'stroke-linejoin': 'round', 'stroke-linecap': 'round' }));
    tr.forEach((t) => svg.appendChild(svgEl('circle', { cx: sx(t.date), cy: sy(t.kg), r: 3, fill: 'var(--card)', stroke: 'var(--accent)', 'stroke-width': 1.5, opacity: 0.8 })));
    const lastT = tr.at(-1);
    svg.appendChild(svgEl('circle', { cx: sx(lastT.date), cy: sy(lastT.trend), r: 5, fill: 'var(--accent)', stroke: 'var(--card)', 'stroke-width': 2 }));
    svg.appendChild(svgEl('text', { x: sx(lastT.date) - 8, y: sy(lastT.trend) - 10, 'text-anchor': 'end', 'font-size': 12, 'font-weight': 700, fill: 'var(--text)' }, fmt(lastT.trend, 1) + ' kg'));
    const cross = svgEl('line', { y1: T, y2: H - B, stroke: 'var(--muted)', 'stroke-width': 1, visibility: 'hidden' });
    const dot = svgEl('circle', { r: 5, fill: 'var(--accent)', stroke: 'var(--card)', 'stroke-width': 2, visibility: 'hidden' });
    svg.appendChild(cross); svg.appendChild(dot);
    const hit = svgEl('rect', { x: L, y: T, width: W - L - R, height: H - T - B, fill: 'transparent' });
    const move = (e) => {
      const rect = svg.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width * W;
      const near = tr.reduce((a, t) => Math.abs(sx(t.date) - x) < Math.abs(sx(a.date) - x) ? t : a, tr[0]);
      const cx = sx(near.date);
      cross.setAttribute('x1', cx); cross.setAttribute('x2', cx); cross.setAttribute('visibility', 'visible');
      dot.setAttribute('cx', cx); dot.setAttribute('cy', sy(near.trend)); dot.setAttribute('visibility', 'visible');
      showTip(wrap, svg, W, cx, Math.min(sy(near.kg), sy(near.trend)), fmtDate(near.date), 'Messung ' + fmt(near.kg, 1) + ' kg · Trend ' + fmt(near.trend, 1) + ' kg');
    };
    hit.addEventListener('pointermove', move);
    hit.addEventListener('pointerdown', move);
    svg.appendChild(hit);
    svg.addEventListener('pointerleave', () => { chartTip(wrap).hidden = true; cross.setAttribute('visibility', 'hidden'); dot.setAttribute('visibility', 'hidden'); });
    wrap.replaceChildren(svg);
  }

  document.querySelectorAll('#range-seg button').forEach((b) => b.addEventListener('click', () => {
    statsRange = Number(b.dataset.range);
    renderStats();
  }));

  // ---------- Wochenrückblick (montags automatisch) ----------
  function renderReview() {
    const card = $('review-card');
    const thisMon = dateKey(mondayOf(new Date()));
    const lastMon = new Date(mondayOf(new Date())); lastMon.setDate(lastMon.getDate() - 7);
    const lastSun = new Date(lastMon); lastSun.setDate(lastSun.getDate() + 6);
    const keys = rangeKeys(7, dateKey(lastSun));
    const hasData = state.workouts.some((w) => w.date >= keys[0] && w.date <= keys[6]) || state.weights.some((w) => w.date >= keys[0] && w.date <= keys[6]) || state.foods.some((f) => f.date >= keys[0] && f.date <= keys[6]);
    card.hidden = !state.profile || state.reviewSeen === thisMon || !hasData;
    if (card.hidden) return;
    const S = summary(keys);
    const fmtS = (d) => d.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit' });
    $('review-title').textContent = 'Deine Woche ' + fmtS(lastMon) + '–' + fmtS(lastSun);
    $('review-stats').replaceChildren(
      kpi('Gewicht', S.weight ? signed(S.weight.delta, 1) + ' kg' : '–', 'Trend', S.weight ? (S.weight.delta < -0.05 ? 'good' : S.weight.delta > 0.05 ? 'bad' : '') : ''),
      kpi('Training', S.workouts + '×', fmt(S.workoutMin) + ' Min.'),
      kpi('Ø Kalorien', S.kcalAvg !== null ? fmt(S.kcalAvg) : '–', S.foodDays + ' Tage eingetragen'),
      kpi('Gewohnheiten', fmt(S.habitPct * 100) + ' %', 'geschafft')
    );
    $('review-text').textContent = S.habitPct >= 0.7 ? 'Richtig gute Woche! Mach genau so weiter. 💪'
      : S.habitPct >= 0.4 ? 'Solide Woche. Such dir eine Gewohnheit aus, die du diese Woche verbesserst.'
      : 'Neue Woche, neuer Start. Nimm dir heute eine Sache vor, zum Beispiel 20 Minuten gehen.';
  }
  $('review-dismiss').addEventListener('click', () => { state.reviewSeen = dateKey(mondayOf(new Date())); save(); });
  $('review-open').addEventListener('click', () => {
    state.reviewSeen = dateKey(mondayOf(new Date()));
    save();
    statsRange = 7;
    showTab('stats');
  });

  // Training in dieser Woche eingetragen → passenden Plan-Tag automatisch abhaken
  function markPlanDone(dateStr) {
    const d = parseKey(dateStr);
    const weekKey = dateKey(mondayOf(d));
    if (weekKey !== dateKey(mondayOf(new Date()))) return false;
    const idx = (d.getDay() + 6) % 7;
    const set = new Set(state.plan.done[weekKey] || []);
    if (set.has(idx)) return false;
    set.add(idx);
    state.plan.done[weekKey] = [...set];
    return true;
  }

  // =====================================================================
  // ---------- Bedienung: Sheets, Schnell-Eintragen, Einrichtung ----------
  // =====================================================================

  const DB = (window.FL_DATA && window.FL_DATA.FOODS) || [];
  const EX = (window.FL_DATA && window.FL_DATA.EXERCISES) || [];
  const POPULAR = ['Apfel', 'Banane', 'Haferflocken', 'Skyr', 'Ei, gekocht', 'Vollkornbrot', 'Hähnchenbrust, gebraten', 'Reis, gekocht', 'Nudeln, gekocht', 'Cappuccino'];
  const SCAN_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M4 7V5a1 1 0 0 1 1-1h2M17 4h2a1 1 0 0 1 1 1v2M20 17v2a1 1 0 0 1-1 1h-2M7 20H5a1 1 0 0 1-1-1v-2M8 8v8M11 8v8M14 8v8M17 8v8"/></svg>';

  // ---------- Kleine Helfer ----------
  function haptic(ms) {
    if (!state.settings || !state.settings.haptics) return;
    try { if (navigator.vibrate) navigator.vibrate(ms || 12); } catch (e) { /* ignorieren */ }
  }
  // Akzeptiert „82,5“ und „82.5“
  const parseNum = (v) => {
    const s = String(v == null ? '' : v).trim().replace(/\s/g, '').replace(',', '.');
    if (!s) return NaN;
    const n = Number(s);
    return Number.isFinite(n) ? n : NaN;
  };
  const norm = (s) => String(s).toLowerCase().replace(/ä/g, 'a').replace(/ö/g, 'o').replace(/ü/g, 'u').replace(/ß/g, 'ss').replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim();
  const timeStr = (ms) => new Date(ms).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
  const hm = (ms) => { const m = Math.max(0, Math.floor(ms / 60000)); return Math.floor(m / 60) + ':' + pad(m % 60); };

  function rowItem(onOpen, children, label) {
    const li = el('li', { class: 'tap', tabindex: '0', role: 'button', 'aria-label': label }, children.concat([el('span', { class: 'chev', 'aria-hidden': 'true', text: '›' })]));
    li.addEventListener('click', onOpen);
    li.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onOpen(); } });
    return li;
  }

  function activityEmoji(type) {
    const t = String(type).toLowerCase();
    const map = [['spazier', '🚶'], ['walking', '🚶'], ['gehen', '🚶'], ['wander', '🥾'], ['jogg', '🏃'], ['lauf', '🏃'], ['rad', '🚴'], ['schwimm', '🏊'],
      ['kraft', '🏋️'], ['bodyweight', '🤸'], ['hiit', '🔥'], ['seil', '🪢'], ['yoga', '🧘'], ['fußball', '⚽'], ['tanz', '💃'], ['ruder', '🚣'], ['cross', '⚙️'], ['treppe', '🪜']];
    const hit = map.find(([k]) => t.includes(k));
    return hit ? hit[1] : '💪';
  }

  function field(label, input, hint) {
    return el('div', { class: 'field' }, [el('label', { for: input.id, text: label }), input, hint ? el('small', { class: 'muted', text: hint }) : null]);
  }

  // Auswahl-Chips (eine Option aktiv). options: [[wert, beschriftung]]
  function chips(options, value, onPick, cls) {
    const wrap = el('div', { class: 'chips ' + (cls || ''), role: 'radiogroup' });
    const draw = (v) => wrap.querySelectorAll('button').forEach((b) => {
      const on = b.dataset.v === String(v);
      b.classList.toggle('on', on);
      b.setAttribute('aria-checked', on ? 'true' : 'false');
    });
    options.forEach(([v, l]) => wrap.appendChild(el('button', {
      type: 'button', class: 'chip', role: 'radio', 'data-v': String(v), text: l,
      onclick: () => { draw(v); haptic(6); onPick(v); }
    })));
    draw(value);
    wrap.set = draw;
    return wrap;
  }

  function fitInput(inp) {
    const size = () => { inp.style.width = (Math.max(2, (inp.value || inp.placeholder || '').length) + 0.8) + 'ch'; };
    if (!(window.CSS && CSS.supports && CSS.supports('field-sizing', 'content'))) { inp.addEventListener('input', size); size(); inp.fitSize = size; }
    return inp;
  }

  function errorLine() { return el('p', { class: 'form-error', role: 'alert', hidden: '' }); }
  function showError(node, msg) { node.textContent = msg; node.hidden = false; haptic(40); }

  function sheetActions(label, onPrimary, onDelete) {
    return el('div', { class: 'sheet-actions' }, [
      onDelete ? el('button', { type: 'button', class: 'secondary danger', text: 'Löschen', onclick: onDelete }) : null,
      el('button', { type: 'button', class: 'primary-wide', text: label, onclick: onPrimary })
    ]);
  }

  // ---------- Bottom-Sheet mit Unterseiten und Zurück-Taste ----------
  let sheetCur = null;
  const sheetStack = [];
  let sheetCloseTimer = null;

  function leaveView(v) { if (v && v.opts && v.opts.onLeave) v.opts.onLeave(); }
  function showView(v) {
    sheetCur = v;
    $('sheet-title').textContent = v.title;
    $('sheet-body').replaceChildren(v.body);
    $('sheet-back').hidden = !sheetStack.length;
    $('sheet-body').scrollTop = 0;
    if (v.opts.focus) setTimeout(() => { try { v.opts.focus.focus(); } catch (e) { /* ignorieren */ } }, 300);
    if (v.opts.onEnter) v.opts.onEnter();
  }
  function openSheet(title, body, opts) {
    clearTimeout(sheetCloseTimer);
    const sheet = $('sheet');
    const wasOpen = !sheet.hidden && sheet.classList.contains('open');
    leaveView(sheetCur);
    sheetStack.length = 0;
    sheet.hidden = false;
    $('sheet-backdrop').hidden = false;
    sheet.style.transform = '';
    showView({ title, body, opts: opts || {} });
    document.body.classList.add('sheet-open');
    $('fab').classList.add('hide');
    if (!wasOpen) {
      history.pushState({ flSheet: true }, '');
      requestAnimationFrame(() => requestAnimationFrame(() => { sheet.classList.add('open'); $('sheet-backdrop').classList.add('open'); }));
    }
  }
  function pushSheet(title, body, opts) {
    leaveView(sheetCur);
    sheetStack.push(sheetCur);
    showView({ title, body, opts: opts || {} });
  }
  function popSheet() {
    if (!sheetStack.length) return closeSheet();
    leaveView(sheetCur);
    showView(sheetStack.pop());
  }
  function closeSheet(fromPop) {
    const sheet = $('sheet');
    if (sheet.hidden || !sheet.classList.contains('open')) return;
    leaveView(sheetCur);
    sheetCur = null;
    sheetStack.length = 0;
    sheet.classList.remove('open');
    $('sheet-backdrop').classList.remove('open');
    sheet.style.transform = '';
    document.body.classList.remove('sheet-open');
    $('fab').classList.remove('hide');
    sheetCloseTimer = setTimeout(() => { sheet.hidden = true; $('sheet-backdrop').hidden = true; $('sheet-body').replaceChildren(); }, 240);
    if (!fromPop && history.state && history.state.flSheet) history.back();
  }
  $('sheet-close').addEventListener('click', () => closeSheet());
  $('sheet-back').addEventListener('click', popSheet);
  $('sheet-backdrop').addEventListener('click', () => closeSheet());
  // Android-Zurück-Taste: erst Unterseite zurück, dann Sheet schließen
  window.addEventListener('popstate', () => {
    if ($('sheet').hidden || !$('sheet').classList.contains('open')) return;
    if (sheetStack.length) { popSheet(); history.pushState({ flSheet: true }, ''); } else closeSheet(true);
  });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !$('sheet').hidden) closeSheet(); });
  // Nach unten wischen schließt das Sheet
  (function () {
    const sheet = $('sheet');
    let y0 = null, dy = 0;
    const start = (e) => { if (e.target.closest('button')) return; y0 = e.clientY; dy = 0; sheet.classList.add('dragging'); };
    const move = (e) => { if (y0 === null) return; dy = Math.max(0, e.clientY - y0); sheet.style.transform = 'translateY(' + dy + 'px)'; };
    const end = () => {
      if (y0 === null) return;
      y0 = null;
      sheet.classList.remove('dragging');
      if (dy > 90) closeSheet(); else sheet.style.transform = '';
    };
    [$('sheet-grab'), sheet.querySelector('.sheet-head')].forEach((h) => {
      h.addEventListener('pointerdown', (e) => { start(e); if (y0 !== null && h.setPointerCapture) h.setPointerCapture(e.pointerId); });
      h.addEventListener('pointermove', move);
      h.addEventListener('pointerup', end);
      h.addEventListener('pointercancel', end);
    });
  })();

  // ---------- Schnell-Eintragen (+) ----------
  function openQuickMenu() {
    haptic();
    const fa = state.fasting.active;
    const tiles = [
      ['⚖️', 'Gewicht', () => sheetWeight()],
      ['🍽️', 'Essen', () => { foodDay = today(); sheetFood(); }],
      ['📷', 'Scannen', () => { foodDay = today(); sheetFood({ scan: true }); }],
      ['💪', 'Training', () => sheetWorkout()],
      ['💧', 'Wasser +1', () => { closeSheet(); addWater(); }],
      ['👟', 'Schritte', () => sheetSteps()],
      [fa ? '⏹️' : '🌙', fa ? 'Fasten beenden' : 'Fasten starten', () => { closeSheet(); toggleFasting(); }],
      ['⏱️', 'Timer', () => { closeSheet(); showTab('train'); setTimeout(() => $('timer-card').scrollIntoView({ block: 'start', behavior: 'smooth' }), 260); }]
    ];
    openSheet('Was möchtest du eintragen?', el('div', { class: 'quick-grid' }, tiles.map(([ico, label, fn]) =>
      el('button', { type: 'button', class: 'quick', onclick: fn }, [el('span', { class: 'q-ico', 'aria-hidden': 'true', text: ico }), el('span', { text: label })]))));
  }
  $('fab').addEventListener('click', openQuickMenu);

  function addWater(day) {
    const t = day || today();
    state.water[t] = (state.water[t] || 0) + 1;
    haptic();
    save();
    showToast('+1 Glas Wasser 💧', fmt(state.water[t]) + ' Gläser ' + (t === today() ? 'heute' : 'am ' + fmtDate(t)),
      { label: 'Rückgängig', fn: () => { state.water[t] = Math.max(0, (state.water[t] || 1) - 1); save(); } });
  }

  function todoAction(it) {
    if (it.key === 'weigh') sheetWeight();
    else if (it.key === 'train') sheetWorkout();
    else if (it.key === 'water') addWater();
    else if (it.key === 'steps') sheetSteps();
    else if (it.key === 'food') { foodDay = today(); sheetFood(); }
    else showTab(it.tab);
  }

  // ---------- Gewicht ----------
  function sheetWeight(entry) {
    const sorted = [...state.weights].sort((a, b) => b.date.localeCompare(a.date));
    let kg = entry ? entry.kg : (sorted[0] ? sorted[0].kg : (state.profile ? state.profile.start : 75));
    const input = el('input', { id: 'sw-kg', class: 'big-input', type: 'text', inputmode: 'decimal', autocomplete: 'off', 'aria-label': 'Gewicht in Kilogramm' });
    const diffEl = el('p', { class: 'muted center', 'aria-live': 'polite' });
    const ref = sorted.find((w) => !entry || w.id !== entry.id);
    const updDiff = () => {
      const v = parseNum(input.value);
      if (!ref || !(v > 0)) { diffEl.textContent = ''; return; }
      const d = Math.round((v - ref.kg) * 10) / 10;
      diffEl.textContent = d === 0 ? 'Gleich wie am ' + fmtDate(ref.date) : signed(d, 1) + ' kg seit ' + fmtDate(ref.date);
      diffEl.className = 'center delta ' + (d < 0 ? 'good' : d > 0 ? 'bad' : 'muted');
    };
    fitInput(input);
    const setKg = (v) => { kg = Math.round(clamp(v, 30, 300) * 10) / 10; input.value = fmt(kg, 1); if (input.fitSize) input.fitSize(); updDiff(); };
    input.addEventListener('input', updDiff);
    input.addEventListener('focus', () => input.select());
    const stepBtn = (d, label) => el('button', {
      type: 'button', class: 'round', 'aria-label': label, text: d > 0 ? '+' : '−',
      onclick: () => { const v = parseNum(input.value); setKg((v > 0 ? v : kg) + d); haptic(6); }
    });
    const date = el('input', { type: 'date', id: 'sw-date', max: today(), value: entry ? entry.date : today() });
    const waist = el('input', { type: 'text', inputmode: 'decimal', id: 'sw-waist', placeholder: 'optional', value: entry && entry.waist ? fmt(entry.waist, 1) : '' });
    const err = errorLine();
    const doSave = () => {
      const v = parseNum(input.value);
      if (!(v >= 30 && v <= 300)) return showError(err, 'Bitte ein Gewicht zwischen 30 und 300 kg eingeben.');
      const wv = parseNum(waist.value);
      if (waist.value.trim() && !(wv >= 40 && wv <= 250)) return showError(err, 'Der Bauchumfang sollte zwischen 40 und 250 cm liegen.');
      const d = date.value || today();
      const before = state.weights.find((w) => w.date === d);
      state.weights = state.weights.filter((w) => w.date !== d && (!entry || w.id !== entry.id));
      const e2 = { id: entry ? entry.id : uid(), date: d, kg: Math.round(v * 10) / 10 };
      if (wv > 0) e2.waist = Math.round(wv * 10) / 10;
      else if (!entry && before && before.waist) e2.waist = before.waist;
      state.weights.push(e2);
      haptic();
      closeSheet();
      save();
      showToast(entry ? 'Gewicht geändert' : 'Gewicht gespeichert', fmt(e2.kg, 1) + ' kg am ' + fmtDate(d) + (e2.waist ? ' · ' + fmt(e2.waist, 1) + ' cm Bauch' : ''));
    };
    input.addEventListener('keydown', (e) => { if (e.key === 'Enter') doSave(); });
    const body = el('div', { class: 'sheet-form' }, [
      el('div', { class: 'stepper' }, [stepBtn(-0.1, '0,1 kg weniger'), el('div', { class: 'big-wrap' }, [input, el('span', { class: 'unit', text: 'kg' })]), stepBtn(0.1, '0,1 kg mehr')]),
      diffEl,
      el('div', { class: 'row' }, [field('Datum', date), field('Bauchumfang (cm)', waist)]),
      el('p', { class: 'muted small', text: 'Tipp: Immer zur gleichen Zeit wiegen, am besten morgens nach dem Aufstehen. Bauch in Höhe des Nabels messen.' }),
      err,
      sheetActions(entry ? 'Änderung speichern' : 'Speichern', doSave, entry ? () => { closeSheet(); removeWithUndo('weights', entry, 'Gewicht vom ' + fmtDate(entry.date)); } : null)
    ]);
    setKg(kg);
    openSheet(entry ? 'Gewicht bearbeiten' : 'Gewicht eintragen', body);
  }

  // ---------- Training ----------
  const metOf = (t) => (ACTIVITIES.find((a) => a[0] === t) || ['', 5])[1];
  function sheetWorkout(entry) {
    const used = {};
    state.workouts.forEach((w) => { used[w.type] = (used[w.type] || 0) + 1; });
    const defaults = ['Spazierengehen', 'Joggen (ca. 8 km/h)', 'Radfahren (gemütlich)', 'Krafttraining', 'HIIT', 'Schwimmen'];
    const known = (n) => ACTIVITIES.some((a) => a[0] === n);
    const top = [...new Set(Object.keys(used).sort((a, b) => used[b] - used[a]).concat(defaults))].filter(known).slice(0, 6);
    let type = entry ? entry.type : top[0];
    let min = entry ? entry.min : 30;
    const est = el('p', { class: 'est', 'aria-live': 'polite' });
    const upd = () => est.replaceChildren(el('strong', { text: '≈ ' + fmt(workoutKcal(metOf(type), min, currentWeight())) + ' kcal' }), document.createTextNode(' verbrannt'));
    const other = el('select', { id: 'sw-type', 'aria-label': 'Andere Sportart' },
      [el('option', { value: '', text: 'Andere Sportart wählen …' })].concat(ACTIVITIES.map(([n]) => el('option', { value: n, text: activityEmoji(n) + ' ' + n }))));
    const typeChips = chips(top.map((n) => [n, activityEmoji(n) + ' ' + n.replace(/ \(.*\)/, '')]), type, (v) => { type = v; other.value = ''; upd(); }, 'wrap');
    other.addEventListener('change', () => { if (other.value) { type = other.value; typeChips.set(type); upd(); } });
    if (!top.includes(type) && known(type)) other.value = type;
    const minInput = el('input', { type: 'text', inputmode: 'numeric', id: 'sw-min', value: String(min), 'aria-label': 'Dauer in Minuten' });
    const minChips = chips([[15, '15'], [20, '20'], [30, '30'], [45, '45'], [60, '60'], [90, '90']], min, (v) => { min = v; minInput.value = String(v); upd(); });
    minInput.addEventListener('input', () => { const v = parseNum(minInput.value); if (v > 0) { min = Math.round(v); minChips.set(min); upd(); } });
    minInput.addEventListener('focus', () => minInput.select());
    const date = el('input', { type: 'date', id: 'sw-wdate', max: today(), value: entry ? entry.date : today() });
    const err = errorLine();
    const doSave = () => {
      const v = parseNum(minInput.value);
      if (!(v >= 1 && v <= 600)) return showError(err, 'Bitte eine Dauer zwischen 1 und 600 Minuten eingeben.');
      min = Math.round(v);
      const d = date.value || today();
      const w = { id: entry ? entry.id : uid(), date: d, type, min, kcal: workoutKcal(metOf(type), min, currentWeight()) };
      state.workouts = state.workouts.filter((x) => !entry || x.id !== entry.id);
      state.workouts.push(w);
      const ticked = !entry && markPlanDone(d);
      haptic();
      closeSheet();
      save();
      showToast(entry ? 'Training geändert' : 'Training gespeichert 💪', min + ' Min. ' + type.replace(/ \(.*\)/, '') + ' · ' + fmt(w.kcal) + ' kcal' + (ticked ? ' · Plan-Tag ✓' : ''));
    };
    const body = el('div', { class: 'sheet-form' }, [
      el('div', { class: 'lbl', text: 'Sportart' }), typeChips, other,
      el('div', { class: 'lbl', text: 'Dauer in Minuten' }), minChips,
      el('div', { class: 'row' }, [field('Eigene Dauer', minInput), field('Datum', date)]),
      est, err,
      sheetActions(entry ? 'Änderung speichern' : 'Training speichern', doSave, entry ? () => { closeSheet(); removeWithUndo('workouts', entry, entry.type); } : null)
    ]);
    upd();
    openSheet(entry ? 'Training bearbeiten' : 'Training eintragen', body);
  }

  // ---------- Schritte ----------
  function sheetSteps() {
    const cur = state.steps[today()] || 0;
    const input = el('input', { id: 'ss-val', class: 'big-input', type: 'text', inputmode: 'numeric', autocomplete: 'off', value: cur ? String(cur) : '', placeholder: '0', 'aria-label': 'Schritte heute' });
    fitInput(input);
    const err = errorLine();
    const doSave = () => {
      const n = Math.round(parseNum(input.value.replace(/\./g, '')));
      if (!(n >= 0 && n <= 100000)) return showError(err, 'Bitte eine Zahl zwischen 0 und 100.000 eingeben.');
      state.steps[today()] = n;
      haptic();
      closeSheet();
      save();
      showToast('Schritte gespeichert', fmt(n) + ' Schritte heute' + (n >= STEP_GOAL ? ' – Ziel erreicht! 👟' : ' – noch ' + fmt(STEP_GOAL - n)));
    };
    input.addEventListener('keydown', (e) => { if (e.key === 'Enter') doSave(); });
    const body = el('div', { class: 'sheet-form' }, [
      el('div', { class: 'big-wrap solo' }, [input, el('span', { class: 'unit', text: 'Schritte' })]),
      el('p', { class: 'muted center small', text: 'Ziel: ' + fmt(STEP_GOAL) + ' pro Tag. Die Zahl findest du in Google Fit, Samsung Health oder auf deiner Uhr.' }),
      err,
      sheetActions('Speichern', doSave)
    ]);
    openSheet('Schritte heute', body, { focus: input });
  }

  // ---------- Essen: Suche, Portionen, eigene Einträge ----------
  function defaultMeal() {
    const n = new Date();
    const h = n.getHours() + n.getMinutes() / 60;
    return h < 10.5 ? 'Frühstück' : h < 14.5 ? 'Mittagessen' : h < 17.5 ? 'Snack' : 'Abendessen';
  }
  const mealOptions = () => MEALS.map(([m, i]) => [m, i + ' ' + m.replace('essen', '')]);

  const dbItem = (f) => ({ name: f.name, src: 'db', kcal100: f.kcal, prot100: f.protein, portion: f.portion, unit: f.unit });
  const productItem = (code, p) => ({ name: p.brand ? p.name + ' · ' + p.brand : p.name, src: 'scan', code, kcal100: p.kcal, prot100: p.protein, portion: p.portion, unit: p.unit });
  const mineItem = (f) => (f.p100 && f.g
    ? { name: f.name, src: 'mine', kcal100: f.p100[0], prot100: f.p100[1], portion: f.g, unit: fmt(f.g) + ' g', n: f.n }
    : { name: f.name, src: 'mine', kcal: f.kcal, protein: f.protein || 0, n: f.n });

  function searchFoods(q) {
    const nq = norm(q);
    if (!nq) return [];
    const words = nq.split(' ');
    const all = favoriteFoods(300).map(mineItem)
      .concat(Object.entries(state.products).map(([c, p]) => productItem(c, p)))
      .concat(DB.map(dbItem));
    const scored = [];
    all.forEach((it) => {
      const n = norm(it.name);
      if (!words.every((w) => n.includes(w))) return;
      let s = 0;
      if (n.startsWith(nq)) s += 50;
      if (n.split(' ').some((x) => x.startsWith(words[0]))) s += 20;
      if (it.src === 'mine') s += 30 + Math.min(20, it.n || 0);
      if (it.src === 'scan') s += 25;
      scored.push([s - n.length * 0.1, it]);
    });
    scored.sort((a, b) => b[0] - a[0]);
    const seen = new Set();
    return scored.map((x) => x[1]).filter((it) => { const k = norm(it.name); if (seen.has(k)) return false; seen.add(k); return true; }).slice(0, 40);
  }

  function portionValues(it, mult, grams) {
    if (it.kcal100 != null) {
      const g = grams != null ? grams : it.portion * mult;
      return { kcal: it.kcal100 * g / 100, protein: (it.prot100 || 0) * g / 100, g };
    }
    return { kcal: it.kcal * mult, protein: (it.protein || 0) * mult, g: null };
  }

  function foodRow(it, ctx) {
    const one = portionValues(it, 1);
    const sub = it.kcal100 != null ? '1 ' + it.unit + (/\bg$/.test(it.unit) ? '' : ' · ' + fmt(it.portion) + ' g') : '1 Portion';
    const tag = it.src === 'mine' ? 'Zuletzt' : it.src === 'scan' ? 'Gescannt' : '';
    const plus = el('button', { type: 'button', class: 'add-round small', 'aria-label': it.name + ' direkt hinzufügen', text: '+' });
    plus.addEventListener('click', (e) => {
      e.stopPropagation();
      const v = portionValues(it, 1);
      const entry = { name: it.name, kcal: v.kcal, protein: v.protein, meal: ctx.meal };
      if (it.kcal100 != null) { entry.g = Math.round(v.g); entry.p100 = [it.kcal100, it.prot100 || 0]; }
      addFood(entry);
      plus.textContent = '✓';
      plus.classList.add('done');
      setTimeout(() => { plus.textContent = '+'; plus.classList.remove('done'); }, 1400);
    });
    const li = rowItem(() => pushSheet('Menge wählen', portionView(it, ctx)), [
      el('div', { class: 'grow' }, [
        el('div', { class: 'title' }, [document.createTextNode(it.name), tag ? el('span', { class: 'tag', text: tag }) : null]),
        el('div', { class: 'muted', text: sub + ' · ' + fmt(one.kcal) + ' kcal' })
      ]),
      plus
    ], it.name + ' – Menge wählen');
    li.querySelector('.chev').remove();
    return li;
  }

  function sheetFood(opts) {
    opts = opts || {};
    const ctx = { meal: opts.meal || defaultMeal() };
    const input = el('input', { type: 'search', id: 'fs-q', class: 'search-input', placeholder: 'z. B. Apfel, Skyr, Pizza …', autocomplete: 'off', enterkeyhint: 'search', 'aria-label': 'Lebensmittel suchen' });
    const scanBtn = el('button', { type: 'button', class: 'scanbtn', 'aria-label': 'Barcode scannen', onclick: () => openScanner(ctx) });
    scanBtn.innerHTML = SCAN_SVG;
    const mealChips = chips(mealOptions(), ctx.meal, (v) => { ctx.meal = v; });
    const results = el('ul', { class: 'list results' });
    const draw = () => {
      const q = input.value.trim();
      const rows = [];
      if (!q) {
        const favs = favoriteFoods(8);
        if (favs.length) {
          rows.push(el('li', { class: 'list-label', text: 'Zuletzt gegessen' }));
          favs.forEach((f) => rows.push(foodRow(mineItem(f), ctx)));
        }
        rows.push(el('li', { class: 'list-label', text: 'Beliebt' }));
        POPULAR.map((n) => DB.find((f) => f.name === n)).filter(Boolean).forEach((f) => rows.push(foodRow(dbItem(f), ctx)));
      } else {
        const found = searchFoods(q);
        found.forEach((it) => rows.push(foodRow(it, ctx)));
        if (!found.length) rows.push(el('li', { class: 'empty', text: 'Nichts gefunden. Trag es unten selbst ein oder scanne den Barcode.' }));
      }
      results.replaceChildren(...rows);
    };
    input.addEventListener('input', draw);
    const body = el('div', { class: 'sheet-form' }, [
      el('div', { class: 'search-row' }, [input, scanBtn]),
      mealChips,
      results,
      el('button', { type: 'button', class: 'secondary wide', text: '✏️ Eigenes Lebensmittel eintragen', onclick: () => pushSheet('Eigenes Lebensmittel', manualView(ctx, input.value.trim())) })
    ]);
    draw();
    openSheet(foodDay === today() ? 'Essen eintragen' : 'Essen · ' + dayLabel(foodDay), body, { focus: opts.scan ? null : input });
    if (opts.scan) openScanner(ctx);
  }

  function portionView(it, ctx) {
    const per100 = it.kcal100 != null;
    let mult = 1;
    let grams = per100 ? it.portion : null;
    const sum = el('div', { class: 'portion-sum', 'aria-live': 'polite' });
    const addBtn = el('button', { type: 'button', class: 'primary-wide' });
    const gInput = per100 ? el('input', { type: 'text', inputmode: 'decimal', id: 'pv-g', value: String(grams), 'aria-label': 'Menge in Gramm' }) : null;
    const upd = () => {
      const v = portionValues(it, mult, grams);
      sum.replaceChildren(
        el('div', null, [el('strong', { text: fmt(v.kcal) }), el('span', { text: 'kcal' })]),
        el('div', null, [el('strong', { text: fmt(v.protein, v.protein < 10 ? 1 : 0) }), el('span', { text: 'g Eiweiß' })]),
        per100 ? el('div', null, [el('strong', { text: fmt(v.g) }), el('span', { text: 'Gramm' })]) : null
      );
      addBtn.textContent = 'Hinzufügen · ' + fmt(v.kcal) + ' kcal';
    };
    const multChips = chips([[0.5, '½'], [1, '1'], [1.5, '1½'], [2, '2'], [3, '3']], 1, (m) => {
      mult = m;
      if (per100) { grams = Math.round(it.portion * m); gInput.value = String(grams); }
      upd();
    });
    if (per100) {
      gInput.addEventListener('focus', () => gInput.select());
      gInput.addEventListener('input', () => { const v = parseNum(gInput.value); if (v > 0) { grams = v; multChips.set(-1); upd(); } });
    }
    const err = errorLine();
    addBtn.addEventListener('click', () => {
      const v = portionValues(it, mult, grams);
      if (!(v.kcal >= 0) || (per100 && !(v.g > 0 && v.g <= 5000))) return showError(err, 'Bitte eine Menge zwischen 1 und 5.000 g eingeben.');
      const entry = { name: it.name, kcal: v.kcal, protein: v.protein, meal: ctx.meal };
      if (per100) { entry.g = Math.round(v.g); entry.p100 = [it.kcal100, it.prot100 || 0]; }
      closeSheet();
      addFood(entry);
    });
    upd();
    return el('div', { class: 'sheet-form' }, [
      el('div', { class: 'food-head' }, [
        el('div', { class: 'title', text: it.name }),
        el('div', { class: 'muted', text: per100 ? fmt(it.kcal100) + ' kcal · ' + fmt(it.prot100 || 0, 1) + ' g Eiweiß pro 100 g' : fmt(it.kcal) + ' kcal pro Portion' })
      ]),
      el('div', { class: 'lbl', text: per100 ? 'Portionen (1 = ' + it.unit + (/\bg$/.test(it.unit) ? '' : ', ' + fmt(it.portion) + ' g') + ')' : 'Portionen' }),
      multChips,
      per100 ? field('Oder Menge in Gramm', gInput) : null,
      sum,
      el('div', { class: 'lbl', text: 'Mahlzeit' }),
      chips(mealOptions(), ctx.meal, (v) => { ctx.meal = v; }),
      err,
      addBtn
    ]);
  }

  function manualView(ctx, prefill) {
    const name = el('input', { type: 'text', id: 'mv-name', maxlength: '60', value: prefill || '', placeholder: 'z. B. Omas Kartoffelsalat', autocomplete: 'off' });
    const kcal = el('input', { type: 'text', inputmode: 'numeric', id: 'mv-kcal', placeholder: '0' });
    const prot = el('input', { type: 'text', inputmode: 'decimal', id: 'mv-prot', placeholder: 'optional' });
    const err = errorLine();
    const doAdd = () => {
      const n = name.value.trim();
      const k = parseNum(kcal.value);
      const pr = prot.value.trim() ? parseNum(prot.value) : 0;
      if (!n) return showError(err, 'Bitte einen Namen eingeben.');
      if (!(k >= 0 && k <= 5000)) return showError(err, 'Bitte Kalorien zwischen 0 und 5.000 eingeben.');
      if (!(pr >= 0 && pr <= 500)) return showError(err, 'Bitte Eiweiß zwischen 0 und 500 g eingeben.');
      closeSheet();
      addFood({ name: n, kcal: k, protein: pr, meal: ctx.meal });
    };
    return el('div', { class: 'sheet-form' }, [
      field('Name', name),
      el('div', { class: 'row' }, [field('Kalorien (kcal)', kcal), field('Eiweiß (g)', prot)]),
      el('p', { class: 'muted small', text: 'Kennst du die Kalorien nicht genau? Schätze lieber grob, als es wegzulassen. Beim nächsten Mal findest du den Eintrag in der Suche.' }),
      el('div', { class: 'lbl', text: 'Mahlzeit' }),
      chips(mealOptions(), ctx.meal, (v) => { ctx.meal = v; }),
      err,
      sheetActions('Hinzufügen', doAdd)
    ]);
  }

  function sheetFoodEdit(f) {
    const ctx = { meal: f.meal };
    const hasG = !!(f.p100 && f.g);
    const name = el('input', { type: 'text', id: 'fe-name', maxlength: '60', value: f.name });
    const grams = hasG ? el('input', { type: 'text', inputmode: 'decimal', id: 'fe-g', value: String(f.g) }) : null;
    const kcal = el('input', { type: 'text', inputmode: 'numeric', id: 'fe-kcal', value: String(Math.round(f.kcal)) });
    const prot = el('input', { type: 'text', inputmode: 'decimal', id: 'fe-prot', value: f.protein ? fmt(f.protein, f.protein % 1 ? 1 : 0) : '' });
    if (hasG) {
      kcal.readOnly = true; prot.readOnly = true;
      grams.addEventListener('input', () => {
        const g = parseNum(grams.value);
        if (g > 0) { kcal.value = String(Math.round(f.p100[0] * g / 100)); prot.value = fmt(f.p100[1] * g / 100, 1); }
      });
    }
    const err = errorLine();
    const doSave = () => {
      const n = name.value.trim();
      const k = parseNum(kcal.value);
      const pr = prot.value.trim() ? parseNum(prot.value) : 0;
      if (!n) return showError(err, 'Bitte einen Namen eingeben.');
      if (!(k >= 0 && k <= 5000)) return showError(err, 'Bitte Kalorien zwischen 0 und 5.000 eingeben.');
      if (!(pr >= 0)) return showError(err, 'Bitte einen gültigen Eiweißwert eingeben.');
      Object.assign(f, { name: n, kcal: Math.round(k), protein: Math.round(pr * 10) / 10, meal: ctx.meal });
      if (hasG) f.g = Math.round(parseNum(grams.value));
      haptic();
      closeSheet();
      save();
      showToast('Eintrag geändert', n + ' · ' + fmt(k) + ' kcal');
    };
    const body = el('div', { class: 'sheet-form' }, [
      field('Name', name),
      hasG ? field('Menge in Gramm', grams, 'Kalorien und Eiweiß werden automatisch angepasst.') : null,
      el('div', { class: 'row' }, [field('Kalorien (kcal)', kcal), field('Eiweiß (g)', prot)]),
      el('div', { class: 'lbl', text: 'Mahlzeit' }),
      chips(mealOptions(), ctx.meal, (v) => { ctx.meal = v; }),
      err,
      sheetActions('Änderung speichern', doSave, () => { closeSheet(); removeWithUndo('foods', f, f.name); })
    ]);
    openSheet('Eintrag bearbeiten', body);
  }

  // ---------- Barcode-Scanner (Kamera + Open Food Facts) ----------
  const SCAN_FORMATS = ['ean_13', 'ean_8', 'upc_a', 'upc_e'];
  function scannerView(ctx) {
    const video = el('video', { playsinline: '', muted: '', autoplay: '' });
    video.muted = true;
    const frame = el('div', { class: 'scan-frame' }, [video, el('div', { class: 'scan-box', 'aria-hidden': 'true' })]);
    const status = el('p', { class: 'muted center', 'aria-live': 'polite', text: 'Kamera wird gestartet …' });
    const code = el('input', { type: 'text', inputmode: 'numeric', id: 'sc-code', placeholder: 'Nummer unter dem Barcode', 'aria-label': 'Barcode-Nummer', autocomplete: 'off' });
    let stream = null, timerId = null, stopped = true, busy = false;
    const stop = () => {
      stopped = true;
      clearTimeout(timerId);
      if (stream) stream.getTracks().forEach((t) => t.stop());
      stream = null;
      video.srcObject = null;
    };
    const lookup = async (raw) => {
      const c = String(raw || '').replace(/\D/g, '');
      if (!/^\d{8,14}$/.test(c)) { status.textContent = 'Bitte eine gültige Barcode-Nummer mit 8 bis 14 Ziffern eingeben.'; return; }
      if (busy) return;
      busy = true;
      stop();
      status.textContent = 'Suche Produkt ' + c + ' …';
      const res = await findProduct(c);
      busy = false;
      if (res.ok) pushSheet('Menge wählen', portionView(res.item, ctx));
      else {
        status.textContent = res.msg;
        if (res.manual) pushSheet('Eigenes Lebensmittel', manualView(ctx, res.name || ''));
      }
    };
    code.addEventListener('keydown', (e) => { if (e.key === 'Enter') lookup(code.value); });
    const start = async () => {
      stopped = false;
      if (!('BarcodeDetector' in window) || !navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        frame.hidden = true;
        status.textContent = 'Dieser Browser kann Barcodes nicht mit der Kamera lesen (am Android-Handy mit Chrome geht es). Gib die Nummer unter dem Barcode ein.';
        return;
      }
      try {
        const supported = await window.BarcodeDetector.getSupportedFormats();
        const detector = new window.BarcodeDetector({ formats: SCAN_FORMATS.filter((f) => supported.includes(f)) });
        stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' }, audio: false });
        if (stopped) { stream.getTracks().forEach((t) => t.stop()); stream = null; return; }
        video.srcObject = stream;
        frame.hidden = false;
        await video.play();
        status.textContent = 'Halte den Barcode in den Rahmen.';
        const loop = async () => {
          if (stopped) return;
          try {
            const found = await detector.detect(video);
            if (found.length) { haptic(40); beep(1320, 120); lookup(found[0].rawValue); return; }
          } catch (e) { /* nächster Versuch */ }
          timerId = setTimeout(loop, 250);
        };
        loop();
      } catch (e) {
        stop();
        frame.hidden = true;
        status.textContent = e && e.name === 'NotAllowedError'
          ? 'Kein Kamerazugriff. Erlaube die Kamera in den Einstellungen deines Browsers oder gib die Nummer ein.'
          : 'Die Kamera konnte nicht gestartet werden. Gib die Nummer unter dem Barcode ein.';
      }
    };
    const body = el('div', { class: 'sheet-form' }, [
      frame, status,
      el('div', { class: 'search-row' }, [code, el('button', { type: 'button', text: 'Suchen', onclick: () => lookup(code.value) })]),
      el('p', { class: 'muted small', text: 'Die Nährwerte kommen von Open Food Facts, dafür brauchst du Internet. Gescannte Produkte merkt sich die App und du findest sie danach auch offline in der Suche.' })
    ]);
    return { body, start, stop };
  }
  function openScanner(ctx) {
    const v = scannerView(ctx);
    pushSheet('Barcode scannen', v.body, { onEnter: v.start, onLeave: v.stop });
  }

  async function findProduct(code) {
    const known = state.products[code];
    if (known) return { ok: true, item: productItem(code, known) };
    if (!navigator.onLine) return { ok: false, manual: true, msg: 'Du bist offline und die App kennt dieses Produkt noch nicht. Trag es selbst ein.' };
    try {
      const ctrl = new AbortController();
      const to = setTimeout(() => ctrl.abort(), 9000);
      const r = await fetch('https://world.openfoodfacts.org/api/v2/product/' + code + '.json?fields=product_name,product_name_de,brands,nutriments,serving_quantity', { signal: ctrl.signal });
      clearTimeout(to);
      const data = await r.json();
      if (!data || data.status !== 1 || !data.product) return { ok: false, manual: true, msg: 'Produkt nicht gefunden. Trag es selbst ein.' };
      const p = data.product;
      const n = p.nutriments || {};
      let kcal = Number(n['energy-kcal_100g']);
      if (!Number.isFinite(kcal) && Number.isFinite(Number(n.energy_100g))) kcal = Number(n.energy_100g) / 4.184;
      const name = String(p.product_name_de || p.product_name || '').trim() || 'Produkt ' + code;
      if (!Number.isFinite(kcal)) return { ok: false, manual: true, name, msg: 'Für dieses Produkt fehlen die Nährwerte. Trag sie von der Packung ab.' };
      const sq = Number(p.serving_quantity);
      const prod = {
        name: name.slice(0, 60),
        brand: String(p.brands || '').split(',')[0].trim().slice(0, 40),
        kcal: Math.round(kcal),
        protein: Math.round((Number(n.proteins_100g) || 0) * 10) / 10,
        portion: sq > 0 && sq < 2000 ? Math.round(sq) : 100,
        unit: sq > 0 && sq < 2000 ? 'Portion' : '100 g'
      };
      state.products[code] = prod;
      const keys = Object.keys(state.products);
      if (keys.length > 300) delete state.products[keys[0]];
      save();
      return { ok: true, item: productItem(code, prod) };
    } catch (e) {
      return { ok: false, manual: true, msg: 'Keine Verbindung zu Open Food Facts. Versuch es später noch einmal oder trag es selbst ein.' };
    }
  }

  // ---------- Intervallfasten ----------
  function renderFasting() {
    const F = state.fasting;
    const a = F.active;
    const goal = a ? a.goal : F.plan;
    const CIRC = 326.73;
    document.querySelectorAll('#fast-plan button').forEach((b) => b.classList.toggle('on', Number(b.dataset.h) === goal));
    $('fast-of').textContent = 'von ' + goal + ' h';
    if (a) {
      const ms = Date.now() - a.start;
      const pct = clamp(ms / (goal * 3600e3), 0, 1);
      const end = new Date(a.start + goal * 3600e3);
      $('fast-prog').style.strokeDashoffset = String(CIRC * (1 - pct));
      $('fast-ring').classList.toggle('done', pct >= 1);
      $('fast-time').textContent = hm(ms);
      $('fast-text').textContent = pct >= 1
        ? 'Ziel erreicht! 🎉 Beende das Fasten, wenn du wieder isst.'
        : 'Seit ' + timeStr(a.start) + ' Uhr · Ziel um ' + timeStr(end.getTime()) + ' Uhr' + (dateKey(end) > today() ? ' (morgen)' : '') + ' · noch ' + hm(goal * 3600e3 - ms) + ' h';
      $('fast-state').textContent = pct >= 1 ? 'geschafft' : 'läuft';
      $('fast-state').className = 'pill' + (pct >= 1 ? '' : ' blue');
      $('fast-toggle').textContent = 'Fasten beenden';
      $('fast-edit').hidden = false;
      $('h-fast').hidden = false;
      $('h-fast').textContent = '🌙 Fasten ' + hm(ms) + ' / ' + goal + ' h' + (pct >= 1 ? ' ✓' : '');
    } else {
      const last = F.history[F.history.length - 1];
      $('fast-prog').style.strokeDashoffset = String(CIRC);
      $('fast-ring').classList.remove('done');
      $('fast-time').textContent = '0:00';
      $('fast-text').textContent = last
        ? 'Letztes Fasten: ' + hm(last.end - last.start) + ' h' + (last.end - last.start >= last.goal * 3600e3 ? ' ✓ geschafft' : '') + '. Starte nach deiner letzten Mahlzeit.'
        : goal + ':' + (24 - goal) + ' heißt ' + goal + ' Stunden fasten und ' + (24 - goal) + ' Stunden essen. Starte nach deiner letzten Mahlzeit, zum Beispiel nach dem Abendessen.';
      $('fast-state').textContent = 'aus';
      $('fast-state').className = 'pill muted-pill';
      $('fast-toggle').textContent = 'Fasten starten';
      $('fast-edit').hidden = true;
      $('h-fast').hidden = true;
    }
    const hist = F.history.slice(-7).reverse();
    $('fast-hist').replaceChildren(...hist.map((x) => {
      const ok = x.end - x.start >= x.goal * 3600e3;
      return el('span', { class: 'pill' + (ok ? '' : ' muted-pill'), title: new Date(x.start).toLocaleString('de-DE') },
        [DOW[(new Date(x.end).getDay() + 6) % 7] + ' ' + hm(x.end - x.start) + (ok ? ' ✓' : '')]);
    }));
  }

  function toggleFasting() {
    const F = state.fasting;
    if (F.active) {
      const a = F.active;
      const end = Date.now();
      F.history.push({ start: a.start, end, goal: a.goal });
      if (F.history.length > 60) F.history.shift();
      F.active = null;
      const ok = end - a.start >= a.goal * 3600e3;
      haptic();
      save();
      showToast(ok ? 'Fasten geschafft! 🌙' : 'Fasten beendet', hm(end - a.start) + ' h gefastet' + (ok ? '' : ' (Ziel ' + a.goal + ' h)'),
        { label: 'Rückgängig', fn: () => { F.history.pop(); F.active = a; save(); } });
    } else {
      F.active = { start: Date.now(), goal: F.plan };
      haptic();
      save();
      showToast('Fasten gestartet 🌙', 'Ziel: ' + F.plan + ' Stunden. Die App meldet sich, wenn du es geschafft hast.');
    }
  }

  function sheetFastStart() {
    const a = state.fasting.active;
    if (!a) return;
    const toLocal = (ms) => { const d = new Date(ms); return dateKey(d) + 'T' + pad(d.getHours()) + ':' + pad(d.getMinutes()); };
    const input = el('input', { type: 'datetime-local', id: 'fa-start', value: toLocal(a.start), max: toLocal(Date.now()) });
    const err = errorLine();
    const doSave = () => {
      const ms = new Date(input.value).getTime();
      if (!Number.isFinite(ms) || ms > Date.now()) return showError(err, 'Die Startzeit muss in der Vergangenheit liegen.');
      if (Date.now() - ms > 72 * 3600e3) return showError(err, 'Die Startzeit darf höchstens 72 Stunden zurückliegen.');
      a.start = ms;
      a.notified = false;
      closeSheet();
      save();
      showToast('Startzeit geändert', 'Fasten seit ' + timeStr(ms) + ' Uhr');
    };
    openSheet('Startzeit ändern', el('div', { class: 'sheet-form' }, [
      field('Fasten begonnen am', input, 'Zum Beispiel, wenn du vergessen hast, das Fasten nach dem Abendessen zu starten.'),
      err, sheetActions('Speichern', doSave)
    ]));
  }

  $('fast-toggle').addEventListener('click', toggleFasting);
  $('fast-edit').addEventListener('click', sheetFastStart);
  document.querySelectorAll('#fast-plan button').forEach((b) => b.addEventListener('click', () => {
    const h = Number(b.dataset.h);
    state.fasting.plan = h;
    if (state.fasting.active) { state.fasting.active.goal = h; state.fasting.active.notified = false; }
    haptic(6);
    save();
  }));
  $('h-fast').addEventListener('click', () => { showTab('food'); setTimeout(() => $('fast-card').scrollIntoView({ block: 'center', behavior: 'smooth' }), 260); });

  // ---------- Übungen ----------
  const exercisesIn = (text) => { const n = text.toLowerCase(); return EX.filter((x) => x.keys.some((k) => n.includes(k))); };
  function exChipsFor(text) {
    const xs = exercisesIn(text);
    if (!xs.length) return null;
    return el('div', { class: 'ex-chips' }, xs.map((x) => el('button', { type: 'button', class: 'chip small', text: x.emoji + ' ' + x.name, onclick: () => openExercise(x) })));
  }
  function renderExercises() {
    const q = norm($('ex-search').value);
    const list = EX.filter((x) => !q || norm(x.name + ' ' + x.muscles).includes(q));
    $('ex-list').replaceChildren(...(list.length ? list.map((x) => rowItem(() => openExercise(x), [
      el('span', { class: 'row-ico', 'aria-hidden': 'true', text: x.emoji }),
      el('div', { class: 'grow' }, [el('div', { class: 'title', text: x.name }), el('div', { class: 'muted', text: x.muscles })])
    ], x.name + ' – Anleitung')) : [el('li', { class: 'empty', text: 'Keine Übung gefunden.' })]));
  }
  function openExercise(x) {
    const body = el('div', { class: 'sheet-form ex-detail' }, [
      el('div', { class: 'ex-hero' }, [el('span', { class: 'ex-emoji', 'aria-hidden': 'true', text: x.emoji }), el('div', null, [el('div', { class: 'lbl', text: 'Trainiert' }), el('strong', { text: x.muscles })])]),
      el('div', { class: 'lbl', text: 'So geht\'s' }),
      el('ol', { class: 'ex-steps' }, x.steps.map((st) => el('li', { text: st }))),
      el('div', { class: 'tipbox' }, [el('strong', { text: '💡 Darauf achten' }), el('span', { text: x.tip })]),
      el('div', { class: 'grid two' }, [
        el('div', { class: 'stat' }, [el('div', { class: 'label', text: 'Leichter' }), el('div', { class: 'small-text', text: x.easier })]),
        el('div', { class: 'stat' }, [el('div', { class: 'label', text: 'Schwerer' }), el('div', { class: 'small-text', text: x.harder })])
      ]),
      el('button', { type: 'button', class: 'primary-wide', text: '⏱️ Mit Intervall-Timer üben', onclick: () => {
        closeSheet();
        $('tm-preset').value = '45,15,4';
        applyPreset();
        showTab('train');
        setTimeout(() => $('timer-card').scrollIntoView({ block: 'start', behavior: 'smooth' }), 260);
      } })
    ]);
    openSheet(x.name, body);
  }
  $('ex-search').addEventListener('input', renderExercises);
  renderExercises();

  // ---------- Darstellung ----------
  function applyTheme() {
    const t = (state.settings && state.settings.theme) || 'system';
    const root = document.documentElement;
    if (t === 'system') root.removeAttribute('data-theme'); else root.setAttribute('data-theme', t);
    const dark = t === 'dark' || (t === 'system' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
    document.querySelectorAll('meta[name="theme-color"]').forEach((m) => m.setAttribute('content', dark ? '#0b110e' : '#eef2ef'));
    document.querySelectorAll('#theme-seg button').forEach((b) => b.classList.toggle('on', b.dataset.themeSet === t));
    $('set-haptics').checked = !!(state.settings && state.settings.haptics);
  }
  document.querySelectorAll('#theme-seg button').forEach((b) => b.addEventListener('click', () => {
    state.settings.theme = b.dataset.themeSet;
    applyTheme();
    haptic();
    save();
  }));
  $('set-haptics').addEventListener('change', (e) => { state.settings.haptics = e.target.checked; haptic(); save(); });
  if (window.matchMedia) window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', applyTheme);

  // ---------- Buttons auf den Seiten ----------
  $('w-add').addEventListener('click', () => sheetWeight());
  $('t-add').addEventListener('click', () => sheetWorkout());
  $('s-add').addEventListener('click', sheetSteps);
  $('f-search-open').addEventListener('click', () => sheetFood());
  $('f-scan-open').addEventListener('click', () => sheetFood({ scan: true }));
  $('setup-start').addEventListener('click', () => openOnboarding());

  // ---------- Einrichtungs-Assistent ----------
  function openOnboarding() {
    const root = $('onboard');
    const ob = { name: '', sex: '', age: '', height: '', weight: '', goal: '', activity: 1.375, pace: 500, level: 'beginner' };
    let step = 0;
    const num = (id, ph, val, mode) => el('input', { type: 'text', id, inputmode: mode || 'numeric', placeholder: ph, value: val || '', autocomplete: 'off' });
    const choice = (options, value, onPick) => {
      const wrap = el('div', { class: 'choices', role: 'radiogroup' });
      const draw = (v) => wrap.querySelectorAll('button').forEach((b) => { const on = b.dataset.v === String(v); b.classList.toggle('on', on); b.setAttribute('aria-checked', on ? 'true' : 'false'); });
      options.forEach(([v, title, sub, ico]) => wrap.appendChild(el('button', { type: 'button', class: 'choice', role: 'radio', 'data-v': String(v), onclick: () => { draw(v); haptic(6); onPick(v); } }, [
        ico ? el('span', { class: 'c-ico', 'aria-hidden': 'true', text: ico }) : null,
        el('span', { class: 'grow' }, [el('strong', { text: title }), sub ? el('small', { text: sub }) : null])
      ])));
      draw(value);
      return wrap;
    };
    const preview = () => calcFor({ sex: ob.sex || 'm', age: parseNum(ob.age), height: parseNum(ob.height), activity: ob.activity, pace: ob.pace }, parseNum(ob.weight));

    const steps = [
      {
        build: () => {
          const name = el('input', { type: 'text', id: 'ob-name', maxlength: '30', value: ob.name, placeholder: 'Dein Vorname', autocomplete: 'given-name' });
          name.addEventListener('input', () => { ob.name = name.value.trim(); });
          return [
            el('img', { src: 'icons/icon-192.png', alt: '', class: 'ob-logo' }),
            el('h1', { text: 'Willkommen bei Fit & Leicht' }),
            el('p', { class: 'ob-lead', text: 'Abnehmen mit Sport: Kalorienziel, Trainingsplan, Erinnerungen und Analyse. In einer Minute eingerichtet.' }),
            el('ul', { class: 'ob-points' }, [el('li', { text: 'Funktioniert auch ohne Internet' }), el('li', { text: 'Deine Daten bleiben auf deinem Handy' }), el('li', { text: 'Kostenlos und ohne Konto' })]),
            field('Wie heißt du? (optional)', name),
            el('button', { type: 'button', class: 'linkbtn', text: 'Ich habe schon ein Backup', onclick: () => $('import-file').click() })
          ];
        },
        valid: () => null, next: 'Los geht\'s'
      },
      {
        build: () => {
          const age = num('ob-age', 'z. B. 30', ob.age);
          const height = num('ob-height', 'z. B. 178', ob.height);
          age.addEventListener('input', () => { ob.age = age.value; });
          height.addEventListener('input', () => { ob.height = height.value; });
          return [
            el('h1', { text: 'Über dich' }),
            el('p', { class: 'ob-lead', text: 'Damit berechne ich deinen Kalorienbedarf.' }),
            el('div', { class: 'lbl', text: 'Geschlecht' }),
            choice([['m', 'Mann', '', '♂'], ['f', 'Frau', '', '♀']], ob.sex, (v) => { ob.sex = v; }),
            el('div', { class: 'row' }, [field('Alter (Jahre)', age), field('Größe (cm)', height)])
          ];
        },
        valid: () => {
          if (!ob.sex) return 'Bitte wähle dein Geschlecht.';
          const a = parseNum(ob.age), h = parseNum(ob.height);
          if (!(a >= 14 && a <= 100)) return 'Bitte ein Alter zwischen 14 und 100 eingeben.';
          if (!(h >= 120 && h <= 230)) return 'Bitte eine Größe zwischen 120 und 230 cm eingeben.';
          return null;
        }
      },
      {
        build: () => {
          const w = num('ob-weight', 'z. B. 92,5', ob.weight, 'decimal');
          const g = num('ob-goal', 'z. B. 80', ob.goal, 'decimal');
          const info = el('p', { class: 'ob-info', 'aria-live': 'polite' });
          const upd = () => {
            ob.weight = w.value; ob.goal = g.value;
            const hM = parseNum(ob.height) / 100, wv = parseNum(ob.weight), gv = parseNum(ob.goal);
            const parts = [];
            if (wv > 0) parts.push('BMI jetzt ' + fmt(wv / hM / hM, 1) + ' (' + bmiCategory(wv / hM / hM) + ')');
            if (gv > 0) parts.push('mit Wunschgewicht ' + fmt(gv / hM / hM, 1));
            if (wv > 0 && gv > 0 && gv < wv) parts.push(fmt(wv - gv, 1) + ' kg abnehmen');
            info.textContent = parts.join(' · ');
          };
          w.addEventListener('input', upd); g.addEventListener('input', upd);
          upd();
          return [
            el('h1', { text: 'Dein Gewicht' }),
            el('p', { class: 'ob-lead', text: 'Wie viel wiegst du heute, und wo willst du hin?' }),
            el('div', { class: 'row' }, [field('Aktuell (kg)', w), field('Wunschgewicht (kg)', g)]),
            info
          ];
        },
        valid: () => {
          const w = parseNum(ob.weight), g = parseNum(ob.goal), hM = parseNum(ob.height) / 100;
          if (!(w >= 30 && w <= 300)) return 'Bitte dein aktuelles Gewicht eingeben (30–300 kg).';
          if (!(g >= 30 && g <= 300)) return 'Bitte ein Wunschgewicht eingeben (30–300 kg).';
          if (g >= w) return 'Dein Wunschgewicht sollte unter deinem aktuellen Gewicht liegen.';
          if (g / hM / hM < 18.5) return 'Dieses Wunschgewicht wäre Untergewicht (BMI unter 18,5). Bitte wähle ein höheres Ziel.';
          return null;
        }
      },
      {
        build: () => [
          el('h1', { text: 'Dein Alltag' }),
          el('p', { class: 'ob-lead', text: 'Wie aktiv bist du, und wie schnell möchtest du abnehmen?' }),
          el('div', { class: 'lbl', text: 'Aktivität' }),
          choice([[1.2, 'Kaum aktiv', 'Büro, wenig Bewegung', '🪑'], [1.375, 'Leicht aktiv', '1–3× Sport pro Woche', '🚶'], [1.55, 'Mäßig aktiv', '3–5× Sport pro Woche', '🏃'], [1.725, 'Sehr aktiv', '6–7× Sport pro Woche', '🔥'], [1.9, 'Extrem aktiv', 'Körperliche Arbeit und Sport', '🏗️']], ob.activity, (v) => { ob.activity = Number(v); }),
          el('div', { class: 'lbl', text: 'Tempo' }),
          choice([[300, 'Sanft', 'ca. 0,3 kg pro Woche', '🐢'], [500, 'Normal (empfohlen)', 'ca. 0,5 kg pro Woche', '⚖️'], [750, 'Zügig', 'ca. 0,7 kg pro Woche', '🚀']], ob.pace, (v) => { ob.pace = Number(v); })
        ],
        valid: () => null
      },
      {
        build: () => {
          const c = preview();
          const togo = parseNum(ob.weight) - parseNum(ob.goal);
          const days = c.deficit > 0 ? Math.ceil(togo * KCAL_PER_KG / c.deficit) : 0;
          const eta = new Date(); eta.setDate(eta.getDate() + days);
          return [
            el('h1', { text: 'Dein Plan' + (ob.name ? ', ' + ob.name : '') }),
            el('div', { class: 'ob-result' }, [
              el('div', { class: 'lbl', text: 'Dein Tagesziel' }),
              el('div', { class: 'ob-big', text: fmt(c.target) + ' kcal' }),
              el('div', { class: 'ob-row' }, [
                el('span', null, [el('strong', { text: c.protein + ' g' }), ' Eiweiß']),
                el('span', null, [el('strong', { text: fmt(c.water / 1000, 1) + ' l' }), ' Wasser']),
                el('span', null, [el('strong', { text: fmt(STEP_GOAL) }), ' Schritte'])
              ]),
              days ? el('p', { text: 'Ziel ' + fmt(parseNum(ob.goal), 1) + ' kg ca. im ' + eta.toLocaleDateString('de-DE', { month: 'long', year: 'numeric' }) + ' (' + Math.ceil(days / 7) + ' Wochen)' }) : null,
              c.capped ? el('p', { class: 'small', text: 'Dein Ziel wurde auf ' + c.minKcal + ' kcal angehoben. Weniger solltest du ohne ärztliche Begleitung nicht essen.' }) : null
            ]),
            el('div', { class: 'lbl', text: 'Dein Trainingsplan' }),
            choice([['beginner', 'Einsteiger', '3× Kraft und Ausdauer, viel Gehen', '🌱'], ['medium', 'Mittel', 'Kraft, Intervalle und Zirkel', '💪'], ['advanced', 'Profi', 'HIIT, schwere Kraft und Läufe', '🏆']], ob.level, (v) => { ob.level = v; })
          ];
        },
        valid: () => null, next: 'Fertig – los geht\'s'
      }
    ];

    const draw = (dir) => {
      const st = steps[step];
      const err = errorLine();
      const content = el('div', { class: 'ob-content ' + (dir < 0 ? 'from-left' : 'from-right') }, st.build());
      const nextBtn = el('button', { type: 'button', class: 'primary-wide', text: st.next || 'Weiter' });
      const go = () => {
        const msg = st.valid();
        if (msg) return showError(err, msg);
        if (step === steps.length - 1) return finish();
        step++; draw(1);
      };
      nextBtn.addEventListener('click', go);
      content.addEventListener('keydown', (e) => { if (e.key === 'Enter' && e.target.tagName === 'INPUT') go(); });
      root.replaceChildren(
        el('div', { class: 'ob-top' }, [
          step ? el('button', { type: 'button', class: 'icon', 'aria-label': 'Zurück', text: '‹', onclick: () => { step--; draw(-1); } }) : el('span', { class: 'ob-spacer' }),
          el('div', { class: 'ob-progress', role: 'progressbar', 'aria-valuemin': '1', 'aria-valuemax': String(steps.length), 'aria-valuenow': String(step + 1) },
            steps.map((_, i) => el('span', { class: i <= step ? 'on' : '' }))),
          el('span', { class: 'ob-count', text: (step + 1) + '/' + steps.length })
        ]),
        content,
        el('div', { class: 'ob-bottom' }, [err, nextBtn])
      );
      const first = content.querySelector('input');
      if (first && step > 0) setTimeout(() => first.focus(), 200);
    };

    const finish = () => {
      state.profile = {
        name: ob.name, sex: ob.sex, age: Math.round(parseNum(ob.age)), height: Math.round(parseNum(ob.height)),
        start: Math.round(parseNum(ob.weight) * 10) / 10, goal: Math.round(parseNum(ob.goal) * 10) / 10,
        activity: ob.activity, pace: ob.pace
      };
      state.plan.level = ob.level;
      if (!state.weights.some((w) => w.date === today())) state.weights.push({ id: uid(), date: today(), kg: state.profile.start });
      fillProfileForm();
      closeOnboarding();
      showTab('home');
      save();
      haptic(30);
      showToast('Alles eingerichtet! 🎉', 'Dein Tagesziel: ' + fmt(calc().target) + ' kcal. Tippe auf + zum Eintragen.');
    };

    root.hidden = false;
    document.body.classList.add('ob-open');
    draw(1);
  }
  function closeOnboarding() {
    $('onboard').hidden = true;
    $('onboard').replaceChildren();
    document.body.classList.remove('ob-open');
  }

  // ---------- Start ----------
  load();
  applyTheme();
  fillProfileForm();
  render();
  if (!state.profile) openOnboarding();
  setInterval(() => { if (state.fasting.active) renderFasting(); }, 30000);
  updateOnline();
  checkReminders();
  setInterval(checkReminders, 30000);
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') { render(); checkReminders(); } });
  window.addEventListener('online', updateOnline);
  window.addEventListener('offline', updateOnline);

  // Browser bitten, die Daten nicht automatisch zu löschen
  if (navigator.storage && navigator.storage.persist) navigator.storage.persist().catch(() => {});

  // Offline-Modus: Service Worker speichert die App auf dem Gerät
  if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost')) {
    window.addEventListener('load', () => {
      const hadController = !!navigator.serviceWorker.controller;
      navigator.serviceWorker.register('sw.js').catch(() => { /* ohne Offline-Modus weiter */ });
      // Neue Version installiert → anbieten, sie gleich zu laden
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (!hadController) return;
        showToast('Neue Version installiert', 'Lade neu, um die Verbesserungen zu sehen.', { label: 'Neu laden', fn: () => location.reload() });
      });
    });
  }
  try {
    const t = sessionStorage.getItem('fit-leicht-tab');
    if (t && $('tab-' + t)) showTab(t);
  } catch (e) { /* ignorieren */ }

  // App-Verknüpfungen (Icon lange drücken) kommen als #gewicht, #timer, #wasser, #essen
  function handleShortcut() {
    const h = location.hash.replace('#', '');
    if (!h) return;
    history.replaceState(null, '', location.pathname + location.search);
    if (!state.profile) return;
    if (h === 'gewicht') sheetWeight();
    else if (h === 'timer') { showTab('train'); $('timer-card').scrollIntoView({ block: 'start' }); }
    else if (h === 'essen') { foodDay = today(); showTab('food'); sheetFood(); }
    else if (h === 'wasser') { showTab('home'); addWater(); }
  }
  handleShortcut();
  window.addEventListener('hashchange', handleShortcut);
})();
