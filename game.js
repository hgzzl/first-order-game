const STAT_META = {
  brand: { label: "Brand", color: "#dc6f8e" },
  fulfillment: { label: "Fulfillment", color: "#5d84e6" },
  production: { label: "Production", color: "#e7b84a" },
  staffing: { label: "Staffing", color: "#8a72ce" },
  operations: { label: "Operations", color: "#4f9a70" },
};

const talentDeck = [
  ["Founder focus", "Founder time", { brand: 2, production: 1, operations: 1 }, "#f2b9a8"],
  ["The scrappy generalist", "First hire", { brand: 1, staffing: 2, operations: 1 }, "#dce9a4"],
  ["Production partner", "Specialist", { production: 4, fulfillment: 1 }, "#f1d790"],
  ["Community builder", "Specialist", { brand: 4, staffing: 1 }, "#efb6ca"],
  ["Ops obsessive", "First hire", { operations: 4, fulfillment: 1 }, "#acd9c2"],
  ["Warehouse wizard", "Specialist", { fulfillment: 4, operations: 1 }, "#aec6f1"],
  ["Product tinkerer", "Founder time", { production: 2, brand: 1, operations: 1 }, "#f4c69f"],
  ["People person", "Advisor", { staffing: 4, brand: 1 }, "#cdbce8"],
  ["Launch sprint", "Founder time", { brand: 3, fulfillment: 2 }, "#f0ae9a"],
  ["Systems thinker", "Advisor", { operations: 2, staffing: 1, production: 1 }, "#b9dcc3"],
  ["Quality control", "Specialist", { production: 2, fulfillment: 1, operations: 1 }, "#ead29e"],
  ["Customer champion", "First hire", { brand: 2, fulfillment: 1, staffing: 1 }, "#eeb7cd"],
  ["Packing party", "Founder time", { fulfillment: 3, staffing: 2 }, "#b5d0ec"],
  ["Maker network", "Advisor", { production: 3, staffing: 2 }, "#e5c292"],
  ["Process playbook", "Founder time", { operations: 2, production: 1, fulfillment: 1 }, "#b6d8be"],
  ["Creative director", "Specialist", { brand: 4, production: 1 }, "#e7adbd"],
  ["Recruiting push", "Founder time", { staffing: 2, brand: 1, operations: 1 }, "#cab6e2"],
  ["Last-mile fix", "Specialist", { fulfillment: 3, operations: 2 }, "#a9c5e7"],
  ["Brand virtuoso", "Deep specialist", { brand: 5 }, "#e9a8be"],
  ["Dispatch ace", "Deep specialist", { fulfillment: 5 }, "#9dbce9"],
  ["Master maker", "Deep specialist", { production: 5 }, "#edcb78"],
  ["Talent magnet", "Deep specialist", { staffing: 5 }, "#bca5df"],
  ["Process architect", "Deep specialist", { operations: 5 }, "#9dceb1"],
].map(([name, kind, stats, color], id) => ({ id: `t${id}`, name, kind, stats, color }));

const milestoneDeck = [
  ["Your first 100 orders", "Order", { brand: 3, fulfillment: 2 }, { cash: 3 }, 2, "#dbeaa2"],
  ["Weekend market pop-up", "Order", { brand: 2, production: 2, staffing: 1 }, { cash: 4 }, 2, "#f2c0a7"],
  ["Reliable supplier secured", "Milestone", { production: 3, operations: 1 }, { permanent: "production" }, 3, "#efd48e"],
  ["A team that clicks", "Milestone", { staffing: 3, brand: 1 }, { permanent: "staffing" }, 3, "#cdbbe8"],
  ["Retailer test order", "Order", { production: 2, fulfillment: 3, operations: 1 }, { cash: 5 }, 3, "#afd0ed"],
  ["Repeat customers", "Milestone", { brand: 3, fulfillment: 1 }, { permanent: "brand" }, 3, "#eeb6ca"],
  ["Two-day dispatch", "Milestone", { fulfillment: 3, operations: 2 }, { permanent: "fulfillment" }, 4, "#b6d2ef"],
  ["Smooth operator", "Milestone", { operations: 4, staffing: 1 }, { permanent: "operations" }, 4, "#add8bf"],
  ["Holiday rush", "Order", { production: 3, fulfillment: 3, staffing: 2 }, { cash: 7 }, 4, "#f0c891"],
  ["Local press feature", "Order", { brand: 5, production: 2 }, { cash: 5 }, 4, "#f0b2c1"],
  ["10,000th order", "Milestone", { brand: 2, fulfillment: 3, operations: 2 }, { permanent: "operations" }, 5, "#cae49c"],
  ["Flagship collaboration", "Order", { brand: 4, production: 4, staffing: 2 }, { cash: 8 }, 5, "#efb99f"],
].map(([name, kind, requirements, reward, points, color], id) => ({ id: `m${id}`, name, kind, requirements, reward, points, color }));

const WIN_SCORE = 10;
const PLAYER_COLORS = ["#c8f04b", "#f3a986", "#8fb4ef", "#d39bdd"];
const FOUNDER_ARCHETYPES = [
  { name: "The Storyteller", stat: "brand" },
  { name: "The Logistics Pro", stat: "fulfillment" },
  { name: "The Maker", stat: "production" },
  { name: "The People Builder", stat: "staffing" },
  { name: "The Systems Thinker", stat: "operations" },
];
const CHAOS_CARDS = [
  { id: "c1", name: "Brand tax", title: "The algorithm changed again", description: "Brand costs +1 on every brief until the next Chaos Monkey.", effect: "skill", stat: "brand", delta: 1 },
  { id: "c2", name: "Ops breakthrough", title: "Someone finally read the spreadsheet", description: "Operations costs 1 less on every brief until the next Chaos Monkey.", effect: "skill", stat: "operations", delta: -1 },
  { id: "c3", name: "Talent shuffle", title: "Unexpected re-org", description: "Every founder with cards must choose one to discard.", effect: "discard" },
  { id: "c4", name: "Brief reset", title: "The roadmap has changed", description: "Discard every open order and milestone, then deal four new briefs.", effect: "refresh" },
  { id: "c5", name: "Hiring rebate", title: "Free money, briefly", description: "Drafting a talent card earns $2 until the next Chaos Monkey.", effect: "cashback" },
];
const state = { players: [], currentPlayerIndex: 0, turn: 1, market: [], milestones: [], talentDraw: [], milestoneDraw: [], activeBrief: null, selected: new Set(), outsourced: {}, sound: true, chaosEnabled: true, activeChaos: null, pendingDiscards: [] };
const network = { mode: "local", clientId: sessionStorage.getItem("first-order-client") || crypto.randomUUID(), gameId: null, gameCode: null, games: null, unsubscribe: null, hostId: null };
sessionStorage.setItem("first-order-client", network.clientId);
const $ = (selector) => document.querySelector(selector);
const STAT_ORDER = Object.keys(STAT_META);
const shuffle = (items) => [...items].sort(() => Math.random() - 0.5);
const escapeHtml = (value) => String(value).replace(/[&<>'"]/g, character => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", "\"": "&quot;" })[character]);
const statGrid = (stats, compact = false) => `<div class="stat-grid${compact ? " compact" : ""}">${STAT_ORDER.map(key => {
  const value = stats[key] || 0;
  return `<span class="stat-slot ${value ? "active" : "empty"}" style="--stat-color:${STAT_META[key].color}" title="${STAT_META[key].label}: ${value}"><i></i><em>${STAT_META[key].label}</em><strong>${value || "—"}</strong></span>`;
}).join("")}</div>`;

const currentPlayer = () => state.players[state.currentPlayerIndex];
const localPlayer = () => network.mode === "online" ? state.players.find(player => player.clientId === network.clientId) : currentPlayer();
const isMyTurn = () => network.mode !== "online" || currentPlayer()?.clientId === network.clientId;

function newGame(names = state.players.map(player => player.name), options = {}) {
  const safeNames = names.length >= 2 ? names : ["Day One Goods", "Bright Side Co."];
  const founders = shuffle(FOUNDER_ARCHETYPES).slice(0, safeNames.length);
  Object.assign(state, {
    players: safeNames.map((name, index) => ({ id: crypto.randomUUID(), name, founder: founders[index], founderName: options.founderNames?.[index] || founders[index].name, score: 0, cash: 2, hand: [], strengths: { [founders[index].stat]: 1 }, color: PLAYER_COLORS[index], clientId: options.clientIds?.[index] || null })),
    currentPlayerIndex: 0, turn: 1, activeBrief: null, selected: new Set(), outsourced: {}, chaosEnabled: options.chaosEnabled ?? true, activeChaos: null, pendingDiscards: [],
    talentDraw: buildTalentDraw(options.chaosEnabled ?? true), milestoneDraw: shuffle(milestoneDeck),
  });
  state.market = state.talentDraw.splice(0, 5);
  state.milestones = state.milestoneDraw.splice(0, 4);
  render();
}

function render() {
  const player = currentPlayer();
  $("#companyName").textContent = player.name;
  $("#founderLabel").textContent = `${player.founderName || player.founder?.name} · +1 permanent ${STAT_META[player.founder?.stat || Object.keys(player.strengths)[0]].label}`;
  $("#turnPrompt").textContent = isMyTurn() ? `${player.name}, choose one action.` : `Waiting for ${player.name} to take their turn.`;
  $("#score").textContent = player.score;
  $("#goal").textContent = WIN_SCORE;
  $("#cash").textContent = player.cash;
  $("#turn").textContent = state.turn;
  $("#scoreProgress").style.width = `${Math.min(100, player.score / WIN_SCORE * 100)}%`;
  $("#investButton").disabled = player.cash < 5 || !isMyTurn() || state.pendingDiscards.length > 0;
  $("#refreshMarketButton").disabled = player.cash < 1 || !isMyTurn() || state.pendingDiscards.length > 0;
  const chaosBanner = $("#chaosBanner");
  chaosBanner.hidden = !state.activeChaos;
  if (state.activeChaos) chaosBanner.innerHTML = `<b>🙈 ${escapeHtml(state.activeChaos.name)}</b><span>${escapeHtml(state.activeChaos.description)}</span>`;
  renderPlayers();
  renderMarket();
  renderMilestones();
  renderHand();
  renderSkillBank();
  renderStrengths();
  queueMicrotask(maybeShowPendingDiscard);
}

function totalSkills(player) {
  const totals = { ...player.strengths };
  player.hand.forEach(card => Object.entries(card.stats).forEach(([stat, amount]) => totals[stat] = (totals[stat] || 0) + amount));
  return totals;
}

function renderPlayers() {
  $("#playerStrip").innerHTML = state.players.map((player, index) => {
    const totals = totalSkills(player);
    return `<div class="player-chip ${index === state.currentPlayerIndex ? "active" : ""}" style="--player-color:${player.color}">
      <span class="player-dot">${index + 1}</span><p><b>${escapeHtml(player.name)}</b><small>${escapeHtml(player.founderName || player.founder?.name || "Founder")} · +1 ${STAT_META[player.founder?.stat || Object.keys(player.strengths)[0]]?.label}</small></p>
      <div class="player-skills">${STAT_ORDER.map(stat => `<span style="--stat-color:${STAT_META[stat].color}" title="${STAT_META[stat].label}" aria-label="${STAT_META[stat].label}: ${totals[stat] || 0}"><i></i><small>${STAT_META[stat].label[0]}</small>${totals[stat] || 0}</span>`).join("")}</div>
      ${index === state.currentPlayerIndex ? "<em>PLAYING</em>" : ""}<strong class="player-score">${player.score} rep · $${player.cash}</strong>
    </div>`;
  }).join("");
}

function renderMarket() {
  $("#marketRow").innerHTML = state.market.map((card, index) => `
    <button class="game-card market-card" data-market="${index}" aria-label="Draft ${card.name}" ${!isMyTurn() || state.pendingDiscards.length ? "disabled" : ""}>
      <div class="card-top" style="background:${card.color}">
        <p class="card-kind">${card.kind}</p><span class="card-number">0${index + 1}</span><h3>${card.name}</h3>
      </div>
      <div class="card-body">${statGrid(card.stats)}</div>
    </button>`).join("");
  document.querySelectorAll("[data-market]").forEach(button => button.addEventListener("click", () => draft(Number(button.dataset.market))));
}

function renderMilestones() {
  $("#milestoneRow").innerHTML = state.milestones.map((card, index) => {
    const reward = card.reward.cash ? `$${card.reward.cash} cash` : `+1 permanent ${STAT_META[card.reward.permanent].label}`;
    return `<button class="game-card milestone-card" data-milestone="${index}" aria-label="Open brief ${card.name}" ${!isMyTurn() || state.pendingDiscards.length ? "disabled" : ""}>
      <div class="card-top" style="background:${card.color}"><p class="card-kind">${card.kind}</p><h3>${card.name}</h3></div>
      <div class="card-body">${statGrid(effectiveRequirements(card))}
      <div class="reward"><p>REWARD<strong>${reward}</strong></p><span class="points">+${card.points}</span></div></div>
    </button>`;
  }).join("");
  document.querySelectorAll("[data-milestone]").forEach(button => button.addEventListener("click", () => openBrief(Number(button.dataset.milestone))));
}

function renderHand() {
  const player = localPlayer() || currentPlayer();
  $("#handCount").textContent = `${player.hand.length} card${player.hand.length === 1 ? "" : "s"}`;
  $("#handHint").textContent = player.hand.length ? `${player.name}'s cards — spent when completing a brief.` : `${player.name} has no cards yet.`;
  $("#hand").innerHTML = player.hand.length ? player.hand.map(card => `
    <article class="hand-card"><b>${card.name}</b>${statGrid(card.stats, true)}</article>`).join("") : `<div class="empty-hand">This workspace is empty — draft some time or talent.</div>`;
}

function renderSkillBank() {
  const player = localPlayer() || currentPlayer();
  const cardTotals = {};
  player.hand.forEach(card => Object.entries(card.stats).forEach(([stat, amount]) => cardTotals[stat] = (cardTotals[stat] || 0) + amount));
  $("#skillBank").innerHTML = `<div class="skill-bank-title"><p class="eyebrow">${escapeHtml(player.name)}</p><b>Skills available for your next brief</b></div>${STAT_ORDER.map(key => {
    const cards = cardTotals[key] || 0;
    const permanent = player.strengths[key] || 0;
    return `<div class="skill-total" style="--stat-color:${STAT_META[key].color}"><span><i></i>${STAT_META[key].label}</span><strong>${cards + permanent}</strong><small>${cards} from cards${permanent ? ` + ${permanent} permanent` : ""}</small></div>`;
  }).join("")}`;
}

function renderStrengths() {
  $("#strengthList").innerHTML = statGrid((localPlayer() || currentPlayer()).strengths, true);
}

function buildTalentDraw(chaosEnabled) {
  const talents = shuffle(talentDeck);
  if (!chaosEnabled) return talents;
  const chaos = CHAOS_CARDS.map(card => ({ ...card, chaos: true, kind: "Chaos Monkey" }));
  return [...talents.slice(0, 5), ...shuffle([...talents.slice(5), ...chaos])];
}

function draft(index) {
  if (!isMyTurn() || state.pendingDiscards.length) return;
  const player = currentPlayer();
  const [card] = state.market.splice(index, 1);
  player.hand.push(card);
  const earnedCashback = state.activeChaos?.effect === "cashback";
  if (earnedCashback) player.cash += 2;
  const chaos = replenishTalent();
  playTone(360);
  advanceTurn(`${player.name} drafted ${card.name}${earnedCashback ? " · +$2" : ""}`);
  if (chaos) showChaos(chaos);
}

function replenish(row, deck, source) {
  if (!deck.length) deck.push(...shuffle(source));
  row.unshift(deck.shift());
}

function replenishTalent() {
  if (!state.talentDraw.length) state.talentDraw.push(...buildTalentDraw(state.chaosEnabled));
  let next = state.talentDraw.shift();
  let resolved = null;
  while (next?.chaos) {
    resolved = next;
    resolveChaos(next);
    if (!state.talentDraw.length) state.talentDraw.push(...buildTalentDraw(state.chaosEnabled));
    next = state.talentDraw.shift();
  }
  state.market.unshift(next);
  return resolved;
}

function effectiveRequirements(card) {
  const requirements = { ...card.requirements };
  if (state.activeChaos?.effect === "skill") {
    const stat = state.activeChaos.stat;
    if (requirements[stat]) requirements[stat] = Math.max(1, requirements[stat] + state.activeChaos.delta);
  }
  return requirements;
}

function resolveChaos(chaos) {
  state.activeChaos = { ...chaos };
  if (chaos.effect === "refresh") {
    state.milestoneDraw.push(...state.milestones);
    state.milestones = [];
    for (let index = 0; index < 4; index++) replenish(state.milestones, state.milestoneDraw, milestoneDeck);
  }
  if (chaos.effect === "discard") state.pendingDiscards = state.players.filter(player => player.hand.length).map(player => player.id);
} 

function openBrief(index) {
  if (!isMyTurn() || state.pendingDiscards.length) return;
  state.activeBrief = index;
  state.selected.clear();
  state.outsourced = {};
  updateBriefDialog();
  $("#briefDialog").showModal();
}

function selectedTotals() {
  const player = currentPlayer();
  const totals = { ...player.strengths };
  player.hand.forEach((card, index) => {
    if (state.selected.has(index)) Object.entries(card.stats).forEach(([stat, amount]) => totals[stat] = (totals[stat] || 0) + amount);
  });
  Object.entries(state.outsourced).forEach(([stat, amount]) => totals[stat] = (totals[stat] || 0) + amount);
  return totals;
}

function canComplete(card, totals = selectedTotals()) {
  return Object.entries(effectiveRequirements(card)).every(([stat, amount]) => (totals[stat] || 0) >= amount);
}

function updateBriefDialog() {
  const card = state.milestones[state.activeBrief];
  if (!card) return;
  const totals = selectedTotals();
  const reward = card.reward.cash ? `$${card.reward.cash} cash` : `+1 permanent ${STAT_META[card.reward.permanent].label}`;
  const outsourceCost = Object.values(state.outsourced).reduce((sum, amount) => sum + amount, 0) * 3;
  $("#briefContent").innerHTML = `
    <header class="brief-header" style="background:${card.color}"><p class="eyebrow">${card.kind} brief · +${card.points} reputation</p><h2>${card.name}</h2><p>Reward: ${reward}</p></header>
    <div class="brief-progress"><h3>Brief requirements</h3>${Object.entries(effectiveRequirements(card)).map(([stat, required]) => {
      const have = totals[stat] || 0;
      const outsourced = state.outsourced[stat] || 0;
      const canAffordMore = outsourceCost + 3 <= currentPlayer().cash;
      return `<div class="requirement-line" style="--stat-color:${STAT_META[stat].color}"><span>${STAT_META[stat].label}</span><div class="bar"><i style="width:${Math.min(100, have / required * 100)}%"></i></div><strong>${have} / ${required}</strong><div class="outsource-controls">${outsourced ? `<button data-unoutsource="${stat}" aria-label="Remove outsourced ${STAT_META[stat].label}">−</button><b>+${outsourced}</b>` : ""}<button data-outsource="${stat}" ${canAffordMore ? "" : "disabled"}>+$3</button></div></div>`;
    }).join("")}</div>
    <h3>Select cards to spend</h3>
    <div class="select-cards">${currentPlayer().hand.length ? currentPlayer().hand.map((handCard, index) => `<button class="selectable-card ${state.selected.has(index) ? "selected" : ""}" data-select="${index}"><b>${handCard.name}</b>${statGrid(handCard.stats, true)}</button>`).join("") : `<p>You don't have any cards yet.</p>`}</div>
    <div class="dialog-actions"><small>Permanent strengths included.${outsourceCost ? ` Outsourcing: $${outsourceCost}.` : ""}</small><button class="primary-button" id="completeBrief" ${canComplete(card, totals) ? "" : "disabled"}>Complete brief${outsourceCost ? ` · pay $${outsourceCost}` : ""}</button></div>`;
  document.querySelectorAll("[data-select]").forEach(button => button.addEventListener("click", () => {
    const index = Number(button.dataset.select);
    state.selected.has(index) ? state.selected.delete(index) : state.selected.add(index);
    updateBriefDialog();
  }));
  document.querySelectorAll("[data-outsource]").forEach(button => button.addEventListener("click", () => {
    const stat = button.dataset.outsource;
    state.outsourced[stat] = (state.outsourced[stat] || 0) + 1;
    updateBriefDialog();
  }));
  document.querySelectorAll("[data-unoutsource]").forEach(button => button.addEventListener("click", () => {
    const stat = button.dataset.unoutsource;
    state.outsourced[stat] -= 1;
    if (!state.outsourced[stat]) delete state.outsourced[stat];
    updateBriefDialog();
  }));
  $("#completeBrief").addEventListener("click", completeBrief);
}

function completeBrief() {
  if (!isMyTurn() || state.pendingDiscards.length) return;
  const player = currentPlayer();
  const card = state.milestones[state.activeBrief];
  if (!canComplete(card)) return;
  player.hand = player.hand.filter((_, index) => !state.selected.has(index));
  player.cash -= Object.values(state.outsourced).reduce((sum, amount) => sum + amount, 0) * 3;
  player.score += card.points;
  if (card.reward.cash) player.cash += card.reward.cash;
  if (card.reward.permanent) player.strengths[card.reward.permanent] = (player.strengths[card.reward.permanent] || 0) + 1;
  state.milestones.splice(state.activeBrief, 1);
  replenish(state.milestones, state.milestoneDraw, milestoneDeck);
  $("#briefDialog").close();
  playTone(620, 0.12);
  const won = player.score >= WIN_SCORE;
  advanceTurn(`${player.name} completed ${card.name} · +${card.points} reputation`);
  if (won) setTimeout(() => showWin(player), 450);
}

function refreshMarket() {
  if (!isMyTurn() || state.pendingDiscards.length) return;
  const player = currentPlayer();
  if (player.cash < 1) return;
  player.cash -= 1;
  const combinedDeck = shuffle([...state.talentDraw, ...state.market]);
  const deferredChaos = [];
  state.market = [];
  while (state.market.length < 5 && combinedDeck.length) {
    const card = combinedDeck.shift();
    if (card.chaos) deferredChaos.push(card);
    else state.market.push(card);
  }
  state.talentDraw = shuffle([...combinedDeck, ...deferredChaos]);
  render();
  commitNetworkState();
  notify(`${player.name} refreshed only the talent market · turn continues`);
}

function invest() {
  if (!isMyTurn() || state.pendingDiscards.length) return;
  const player = currentPlayer();
  if (player.cash < 5) return;
  player.cash -= 5;
  player.score += 1;
  playTone(520);
  const won = player.score >= WIN_SCORE;
  advanceTurn(`${player.name} invested in growth · +1 reputation`);
  if (won) setTimeout(() => showWin(player), 450);
}

function advanceTurn(message) {
  state.turn += 1;
  state.currentPlayerIndex = (state.currentPlayerIndex + 1) % state.players.length;
  render();
  commitNetworkState();
  notify(`${message} · Next: ${currentPlayer().name}`);
}
function showWin(player) {
  $("#winnerName").textContent = player.name;
  $("#finalScore").textContent = `${player.score} reputation`;
  $("#finalTurns").textContent = `${state.turn - 1} total turns`;
  $("#winDialog").showModal();
}
function playTone(frequency, duration = 0.07) {
  if (!state.sound) return;
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) return;
  const context = new AudioContext();
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  oscillator.frequency.value = frequency;
  oscillator.type = "sine";
  gain.gain.setValueAtTime(0.035, context.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + duration);
  oscillator.connect(gain).connect(context.destination);
  oscillator.start();
  oscillator.stop(context.currentTime + duration);
  oscillator.addEventListener("ended", () => context.close());
}

const COMPANY_NAMES = [
  "Day One Goods", "Bright Side Co.", "Good Enough Studio", "Tiny Giant Supply",
  "Sunday Standard", "North Star Works", "Lucky Cart", "Common Thread Co.",
  "Soft Launch Supply", "New Leaf Goods", "Corner Office Club", "Fresh Batch Studio",
];

function suggestedNames(count) {
  return shuffle(COMPANY_NAMES).slice(0, count);
}

function renderPlayerInputs(useSuggestions = false) {
  const count = Number($("#playerCount").value);
  const existing = [...document.querySelectorAll(".player-name-input")].map(input => input.value);
  const suggestions = suggestedNames(count);
  $("#playerInputs").innerHTML = Array.from({ length: count }, (_, index) => `<label>
    <span style="--player-color:${PLAYER_COLORS[index]}">${index + 1}</span>
    <input class="player-name-input" maxlength="28" value="${escapeHtml(useSuggestions || !existing[index] ? suggestions[index] : existing[index])}" aria-label="Player ${index + 1} company name" />
  </label>`).join("");
}

function openSetup() {
  $("#playerCount").value = "2";
  $("#onlinePlayerCount").value = "2";
  renderPlayerInputs(true);
  $("#onlineCompanyName").value = suggestedNames(1)[0];
  const invitedCode = new URLSearchParams(location.search).get("game");
  if (invitedCode) $("#joinCodeInput").value = invitedCode.toUpperCase();
  setSetupMode(invitedCode || location.hostname.endsWith(".quick.shopify.io") ? "online" : "local");
  if (!$("#setupDialog").open) $("#setupDialog").showModal();
}

function startConfiguredGame() {
  network.unsubscribe?.();
  Object.assign(network, { mode: "local", gameId: null, gameCode: null, unsubscribe: null });
  const names = [...document.querySelectorAll(".player-name-input")].map((input, index) => input.value.trim() || `Company ${index + 1}`);
  newGame(names, { chaosEnabled: $("#localChaosToggle").checked });
  $("#setupDialog").close();
  notify(`${names[0]} goes first`);
}

function gameSnapshot() {
  return {
    players: state.players, currentPlayerIndex: state.currentPlayerIndex, turn: state.turn,
    market: state.market, milestones: state.milestones, talentDraw: state.talentDraw,
    milestoneDraw: state.milestoneDraw, chaosEnabled: state.chaosEnabled,
    activeChaos: state.activeChaos, pendingDiscards: state.pendingDiscards,
  };
}

function applySnapshot(snapshot) {
  if (!snapshot) return;
  const previousChaosId = state.activeChaos?.id;
  Object.assign(state, snapshot, { activeBrief: null, selected: new Set(), outsourced: {} });
  render();
  if (snapshot.activeChaos?.id && snapshot.activeChaos.id !== previousChaosId) showChaos(snapshot.activeChaos);
}

async function ensureQuick() {
  const loaded = await window.quickReady;
  if (!loaded || !window.quick?.db) {
    $("#quickNote").textContent = "Online play needs the Shopify Quick deployment. Open this game on its quick.shopify.io URL.";
    return false;
  }
  network.games ||= quick.db.collection("first_order_games");
  return true;
}

async function quickFounderName() {
  try { return (await quick.id.waitForUser())?.fullName || quick.id.displayName || "Founder"; }
  catch { return "Founder"; }
}

function generateCode() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ";
  return Array.from({ length: 5 }, () => alphabet[Math.floor(Math.random() * alphabet.length)]).join("");
}

function setSetupMode(mode) {
  const online = mode === "online";
  $("#localModeButton").classList.toggle("active", !online);
  $("#onlineModeButton").classList.toggle("active", online);
  $("#localModeButton").setAttribute("aria-selected", String(!online));
  $("#onlineModeButton").setAttribute("aria-selected", String(online));
  $("#localSetupPanel").hidden = online;
  $("#onlineSetupPanel").hidden = !online;
  if (online && !$("#onlineCompanyName").value) $("#onlineCompanyName").value = suggestedNames(1)[0];
}

async function createOnlineGame() {
  if (!await ensureQuick()) return;
  const name = $("#onlineCompanyName").value.trim() || suggestedNames(1)[0];
  const code = generateCode();
  const founderName = await quickFounderName();
  const doc = await network.games.create({
    code, status: "lobby", hostId: network.clientId,
    maxPlayers: Number($("#onlinePlayerCount").value),
    chaosEnabled: $("#onlineChaosToggle").checked,
    players: [{ clientId: network.clientId, name, founderName }],
  });
  network.mode = "online";
  network.gameId = doc.id;
  network.gameCode = code;
  network.hostId = network.clientId;
  history.replaceState(null, "", `${location.pathname}?game=${code}`);
  subscribeToGame();
  showLobby(doc);
}

async function joinOnlineGame() {
  if (!await ensureQuick()) return;
  const code = $("#joinCodeInput").value.trim().toUpperCase();
  if (code.length !== 5) return notify("Enter a five-letter game code");
  const matches = await network.games.where({ code }).limit(1).find();
  const doc = matches[0];
  if (!doc) return notify("That game could not be found");
  if (doc.status === "playing") {
    if (!doc.game?.players.some(player => player.clientId === network.clientId)) return notify("That game has already started");
    Object.assign(network, { mode: "online", gameId: doc.id, gameCode: code, hostId: doc.hostId });
    subscribeToGame();
    $("#setupDialog").close();
    applySnapshot(doc.game);
    return;
  }
  if (doc.status !== "lobby") return notify("That lobby is no longer open");
  if (doc.players.some(player => player.clientId === network.clientId)) return notify("This browser already joined that game");
  if (doc.players.length >= doc.maxPlayers) return notify("That lobby is already full");
  const name = $("#onlineCompanyName").value.trim() || suggestedNames(1)[0];
  const founderName = await quickFounderName();
  const players = [...doc.players, { clientId: network.clientId, name, founderName }];
  await network.games.update(doc.id, { players });
  network.mode = "online";
  network.gameId = doc.id;
  network.gameCode = code;
  network.hostId = doc.hostId;
  history.replaceState(null, "", `${location.pathname}?game=${code}`);
  subscribeToGame();
  showLobby({ ...doc, players });
}

function subscribeToGame() {
  network.unsubscribe?.();
  network.unsubscribe = network.games.subscribe({
    onUpdate: (doc) => {
      if (doc.id !== network.gameId) return;
      network.hostId = doc.hostId;
      if (doc.status === "lobby") showLobby(doc);
      if (doc.status === "playing" && doc.game) {
        if ($("#setupDialog").open) $("#setupDialog").close();
        if ($("#lobbyDialog").open) $("#lobbyDialog").close();
        applySnapshot(doc.game);
      }
    },
    onDelete: (id) => { if (id === network.gameId) notify("The game was closed"); },
    onError: () => notify("Connection interrupted — trying again"),
  });
}

function showLobby(doc) {
  $("#lobbyCode").textContent = doc.code;
  $("#lobbyPlayers").innerHTML = Array.from({ length: doc.maxPlayers }, (_, index) => {
    const player = doc.players[index];
    return `<div class="lobby-seat ${player ? "filled" : ""}"><span style="--player-color:${PLAYER_COLORS[index]}">${index + 1}</span><b>${player ? escapeHtml(player.name) : "Waiting for founder…"}</b></div>`;
  }).join("");
  const isHost = network.clientId === doc.hostId;
  $("#lobbyStatus").textContent = isHost ? `${doc.players.length} of ${doc.maxPlayers} founders joined` : "Waiting for the host to start the game…";
  $("#launchOnlineButton").hidden = !isHost;
  $("#launchOnlineButton").disabled = doc.players.length < 2;
  $("#launchOnlineButton").dataset.players = JSON.stringify(doc.players);
  $("#launchOnlineButton").dataset.chaos = String(doc.chaosEnabled);
  if ($("#setupDialog").open) $("#setupDialog").close();
  if (!$("#lobbyDialog").open) $("#lobbyDialog").showModal();
}

async function launchOnlineGame() {
  const players = JSON.parse($("#launchOnlineButton").dataset.players || "[]");
  if (players.length < 2) return;
  newGame(players.map(player => player.name), { clientIds: players.map(player => player.clientId), founderNames: players.map(player => player.founderName), chaosEnabled: $("#launchOnlineButton").dataset.chaos === "true" });
  await network.games.update(network.gameId, { status: "playing", game: gameSnapshot() });
  if ($("#lobbyDialog").open) $("#lobbyDialog").close();
}

async function commitNetworkState() {
  if (network.mode !== "online" || !network.gameId || !network.games) return;
  try { await network.games.update(network.gameId, { status: "playing", game: gameSnapshot() }); }
  catch { notify("Couldn't sync that move. Check your connection."); }
}

function showChaos(chaos) {
  $("#chaosTitle").textContent = chaos.title;
  $("#chaosDescription").textContent = chaos.description;
  $("#discardChoices").innerHTML = "";
  $("#chaosContinueButton").hidden = false;
  if (!$("#chaosDialog").open) $("#chaosDialog").showModal();
  maybeShowPendingDiscard();
}

function pendingPlayer() {
  if (!state.pendingDiscards.length) return null;
  if (network.mode === "online") {
    const player = localPlayer();
    return player && state.pendingDiscards.includes(player.id) ? player : null;
  }
  const key = state.pendingDiscards[0];
  return state.players.find(player => player.id === key);
}

function maybeShowPendingDiscard() {
  const player = pendingPlayer();
  if (!player) return;
  $("#chaosTitle").textContent = `${player.name}, choose one card to lose`;
  $("#chaosDescription").textContent = "The re-org is here. Your other cards are safe.";
  $("#chaosContinueButton").hidden = true;
  $("#discardChoices").innerHTML = `<div class="discard-grid">${player.hand.map((card, index) => `<button data-discard="${index}"><b>${escapeHtml(card.name)}</b>${statGrid(card.stats, true)}</button>`).join("")}</div>`;
  document.querySelectorAll("[data-discard]").forEach(button => button.addEventListener("click", () => discardCard(player, Number(button.dataset.discard))));
  if (!$("#chaosDialog").open) $("#chaosDialog").showModal();
}

function discardCard(player, index) {
  const [card] = player.hand.splice(index, 1);
  state.pendingDiscards = state.pendingDiscards.filter(value => value !== player.id);
  render();
  commitNetworkState();
  notify(`${player.name} discarded ${card.name}`);
  if (state.pendingDiscards.length && network.mode === "local") maybeShowPendingDiscard();
  else if ($("#chaosDialog").open) $("#chaosDialog").close();
}

let toastTimer;
function notify(message) {
  const toast = $("#toast"); toast.textContent = message; toast.classList.add("show");
  clearTimeout(toastTimer); toastTimer = setTimeout(() => toast.classList.remove("show"), 2200);
}

$("#briefClose").addEventListener("click", () => $("#briefDialog").close());
$("#rulesClose").addEventListener("click", () => $("#rulesDialog").close());
$("#rulesStart").addEventListener("click", () => $("#rulesDialog").close());
$("#howToPlayButton").addEventListener("click", () => $("#rulesDialog").showModal());
$("#newGameButton").addEventListener("click", () => { if (confirm("Set up a new game? Current progress will be lost.")) openSetup(); });
$("#playAgainButton").addEventListener("click", () => { $("#winDialog").close(); openSetup(); });
$("#playerCount").addEventListener("change", () => renderPlayerInputs());
$("#shuffleNamesButton").addEventListener("click", () => renderPlayerInputs(true));
$("#localModeButton").addEventListener("click", () => setSetupMode("local"));
$("#onlineModeButton").addEventListener("click", () => setSetupMode("online"));
$("#startGameButton").addEventListener("click", startConfiguredGame);
$("#createOnlineButton").addEventListener("click", createOnlineGame);
$("#joinOnlineButton").addEventListener("click", joinOnlineGame);
$("#launchOnlineButton").addEventListener("click", launchOnlineGame);
$("#copyInviteButton").addEventListener("click", async () => {
  const url = `${location.origin}${location.pathname}?game=${network.gameCode}`;
  await navigator.clipboard.writeText(url);
  notify("Invite link copied");
});
$("#chaosContinueButton").addEventListener("click", () => $("#chaosDialog").close());
$("#refreshMarketButton").addEventListener("click", refreshMarket);
$("#investButton").addEventListener("click", invest);
$("#soundButton").addEventListener("click", (event) => { state.sound = !state.sound; event.currentTarget.textContent = state.sound ? "◖))" : "◖×"; notify(`Sound ${state.sound ? "on" : "off"}`); });
newGame(["Day One Goods", "Bright Side Co."]);
openSetup();
