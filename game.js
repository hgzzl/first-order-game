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
  ["Production partner", "Specialist", { production: 3, fulfillment: 1 }, "#f1d790"],
  ["Community builder", "Specialist", { brand: 3, staffing: 1 }, "#efb6ca"],
  ["Ops obsessive", "First hire", { operations: 3, fulfillment: 1 }, "#acd9c2"],
  ["Warehouse wizard", "Specialist", { fulfillment: 3, operations: 1 }, "#aec6f1"],
  ["Product tinkerer", "Founder time", { production: 2, brand: 1, operations: 1 }, "#f4c69f"],
  ["People person", "Advisor", { staffing: 3, brand: 1 }, "#cdbce8"],
  ["Launch sprint", "Founder time", { brand: 2, fulfillment: 2 }, "#f0ae9a"],
  ["Systems thinker", "Advisor", { operations: 2, staffing: 1, production: 1 }, "#b9dcc3"],
  ["Quality control", "Specialist", { production: 2, fulfillment: 1, operations: 1 }, "#ead29e"],
  ["Customer champion", "First hire", { brand: 2, fulfillment: 1, staffing: 1 }, "#eeb7cd"],
  ["Packing party", "Founder time", { fulfillment: 2, staffing: 2 }, "#b5d0ec"],
  ["Maker network", "Advisor", { production: 2, staffing: 2 }, "#e5c292"],
  ["Process playbook", "Founder time", { operations: 2, production: 1, fulfillment: 1 }, "#b6d8be"],
  ["Creative director", "Specialist", { brand: 3, production: 1 }, "#e7adbd"],
  ["Recruiting push", "Founder time", { staffing: 2, brand: 1, operations: 1 }, "#cab6e2"],
  ["Last-mile fix", "Specialist", { fulfillment: 2, operations: 2 }, "#a9c5e7"],
].map(([name, kind, stats, color], id) => ({ id: `t${id}`, name, kind, stats, color }));

const milestoneDeck = [
  ["Your first 100 orders", "Order", { brand: 3, fulfillment: 2 }, { cash: 3 }, 2, "#dbeaa2"],
  ["Weekend market pop-up", "Order", { brand: 2, production: 2, staffing: 1 }, { cash: 4 }, 2, "#f2c0a7"],
  ["Reliable supplier secured", "Milestone", { production: 4, operations: 2 }, { permanent: "production" }, 3, "#efd48e"],
  ["A team that clicks", "Milestone", { staffing: 4, brand: 2 }, { permanent: "staffing" }, 3, "#cdbbe8"],
  ["Retailer test order", "Order", { production: 2, fulfillment: 3, operations: 1 }, { cash: 5 }, 3, "#afd0ed"],
  ["Repeat customers", "Milestone", { brand: 4, fulfillment: 2 }, { permanent: "brand" }, 3, "#eeb6ca"],
  ["Two-day dispatch", "Milestone", { fulfillment: 4, operations: 3 }, { permanent: "fulfillment" }, 4, "#b6d2ef"],
  ["Smooth operator", "Milestone", { operations: 5, staffing: 2 }, { permanent: "operations" }, 4, "#add8bf"],
  ["Holiday rush", "Order", { production: 3, fulfillment: 3, staffing: 2 }, { cash: 7 }, 4, "#f0c891"],
  ["Local press feature", "Order", { brand: 5, production: 2 }, { cash: 5 }, 4, "#f0b2c1"],
  ["10,000th order", "Milestone", { brand: 3, fulfillment: 4, operations: 3 }, { permanent: "operations" }, 5, "#cae49c"],
  ["Flagship collaboration", "Order", { brand: 4, production: 4, staffing: 2 }, { cash: 8 }, 5, "#efb99f"],
].map(([name, kind, requirements, reward, points, color], id) => ({ id: `m${id}`, name, kind, requirements, reward, points, color }));

const PLAYER_COLORS = ["#c8f04b", "#f3a986", "#8fb4ef", "#d39bdd"];
const state = { players: [], currentPlayerIndex: 0, turn: 1, market: [], milestones: [], talentDraw: [], milestoneDraw: [], activeBrief: null, selected: new Set(), sound: true };
const $ = (selector) => document.querySelector(selector);
const STAT_ORDER = Object.keys(STAT_META);
const shuffle = (items) => [...items].sort(() => Math.random() - 0.5);
const escapeHtml = (value) => String(value).replace(/[&<>'"]/g, character => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", "\"": "&quot;" })[character]);
const statGrid = (stats, compact = false) => `<div class="stat-grid${compact ? " compact" : ""}">${STAT_ORDER.map(key => {
  const value = stats[key] || 0;
  return `<span class="stat-slot ${value ? "active" : "empty"}" style="--stat-color:${STAT_META[key].color}" title="${STAT_META[key].label}: ${value}"><i></i><em>${STAT_META[key].label}</em><strong>${value || "—"}</strong></span>`;
}).join("")}</div>`;

const currentPlayer = () => state.players[state.currentPlayerIndex];

function newGame(names = state.players.map(player => player.name)) {
  const safeNames = names.length >= 2 ? names : ["Day One Goods", "Bright Side Co."];
  Object.assign(state, {
    players: safeNames.map((name, index) => ({ name, score: 0, cash: 2, hand: [], strengths: {}, color: PLAYER_COLORS[index] })),
    currentPlayerIndex: 0, turn: 1, activeBrief: null, selected: new Set(),
    talentDraw: shuffle(talentDeck), milestoneDraw: shuffle(milestoneDeck),
  });
  state.market = state.talentDraw.splice(0, 5);
  state.milestones = state.milestoneDraw.splice(0, 4);
  render();
}

function render() {
  const player = currentPlayer();
  $("#companyName").textContent = player.name;
  $("#turnPrompt").textContent = `${player.name}, choose one action.`;
  $("#score").textContent = player.score;
  $("#cash").textContent = player.cash;
  $("#turn").textContent = state.turn;
  $("#scoreProgress").style.width = `${Math.min(100, player.score / 15 * 100)}%`;
  $("#investButton").disabled = player.cash < 5;
  renderPlayers();
  renderMarket();
  renderMilestones();
  renderHand();
  renderSkillBank();
  renderStrengths();
}

function renderPlayers() {
  $("#playerStrip").innerHTML = state.players.map((player, index) => `<div class="player-chip ${index === state.currentPlayerIndex ? "active" : ""}" style="--player-color:${player.color}">
    <span class="player-dot">${index + 1}</span><p><b>${escapeHtml(player.name)}</b><small>${player.score} reputation · $${player.cash}</small></p>${index === state.currentPlayerIndex ? "<em>PLAYING</em>" : ""}
  </div>`).join("");
}

function renderMarket() {
  $("#marketRow").innerHTML = state.market.map((card, index) => `
    <button class="game-card market-card" data-market="${index}" aria-label="Draft ${card.name}">
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
    return `<button class="game-card milestone-card" data-milestone="${index}" aria-label="Open brief ${card.name}">
      <div class="card-top" style="background:${card.color}"><p class="card-kind">${card.kind}</p><h3>${card.name}</h3></div>
      <div class="card-body">${statGrid(card.requirements)}
      <div class="reward"><p>REWARD<strong>${reward}</strong></p><span class="points">+${card.points}</span></div></div>
    </button>`;
  }).join("");
  document.querySelectorAll("[data-milestone]").forEach(button => button.addEventListener("click", () => openBrief(Number(button.dataset.milestone))));
}

function renderHand() {
  const player = currentPlayer();
  $("#handCount").textContent = `${player.hand.length} card${player.hand.length === 1 ? "" : "s"}`;
  $("#handHint").textContent = player.hand.length ? `${player.name}'s cards — spent when completing a brief.` : `${player.name} has no cards yet.`;
  $("#hand").innerHTML = player.hand.length ? player.hand.map(card => `
    <article class="hand-card"><b>${card.name}</b>${statGrid(card.stats, true)}</article>`).join("") : `<div class="empty-hand">This workspace is empty — draft some time or talent.</div>`;
}

function renderSkillBank() {
  const player = currentPlayer();
  const cardTotals = {};
  player.hand.forEach(card => Object.entries(card.stats).forEach(([stat, amount]) => cardTotals[stat] = (cardTotals[stat] || 0) + amount));
  $("#skillBank").innerHTML = `<div class="skill-bank-title"><p class="eyebrow">AT A GLANCE</p><b>Available for your next brief</b></div>${STAT_ORDER.map(key => {
    const cards = cardTotals[key] || 0;
    const permanent = player.strengths[key] || 0;
    return `<div class="skill-total" style="--stat-color:${STAT_META[key].color}"><span><i></i>${STAT_META[key].label}</span><strong>${cards + permanent}</strong><small>${cards} from cards${permanent ? ` + ${permanent} permanent` : ""}</small></div>`;
  }).join("")}`;
}

function renderStrengths() {
  $("#strengthList").innerHTML = statGrid(currentPlayer().strengths, true);
}

function draft(index) {
  const player = currentPlayer();
  const [card] = state.market.splice(index, 1);
  player.hand.push(card);
  replenish(state.market, state.talentDraw, talentDeck);
  playTone(360);
  advanceTurn(`${player.name} drafted ${card.name}`);
}

function replenish(row, deck, source) {
  if (!deck.length) deck.push(...shuffle(source));
  row.unshift(deck.shift());
}

function openBrief(index) {
  state.activeBrief = index;
  state.selected.clear();
  updateBriefDialog();
  $("#briefDialog").showModal();
}

function selectedTotals() {
  const player = currentPlayer();
  const totals = { ...player.strengths };
  player.hand.forEach((card, index) => {
    if (state.selected.has(index)) Object.entries(card.stats).forEach(([stat, amount]) => totals[stat] = (totals[stat] || 0) + amount);
  });
  return totals;
}

function canComplete(card, totals = selectedTotals()) {
  return Object.entries(card.requirements).every(([stat, amount]) => (totals[stat] || 0) >= amount);
}

function updateBriefDialog() {
  const card = state.milestones[state.activeBrief];
  if (!card) return;
  const totals = selectedTotals();
  const reward = card.reward.cash ? `$${card.reward.cash} cash` : `+1 permanent ${STAT_META[card.reward.permanent].label}`;
  $("#briefContent").innerHTML = `
    <header class="brief-header" style="background:${card.color}"><p class="eyebrow">${card.kind} brief · +${card.points} reputation</p><h2>${card.name}</h2><p>Reward: ${reward}</p></header>
    <div class="brief-progress"><h3>Brief requirements</h3>${Object.entries(card.requirements).map(([stat, required]) => {
      const have = totals[stat] || 0; return `<div class="requirement-line" style="--stat-color:${STAT_META[stat].color}"><span>${STAT_META[stat].label}</span><div class="bar"><i style="width:${Math.min(100, have / required * 100)}%"></i></div><strong>${have} / ${required}</strong></div>`;
    }).join("")}</div>
    <h3>Select cards to spend</h3>
    <div class="select-cards">${currentPlayer().hand.length ? currentPlayer().hand.map((handCard, index) => `<button class="selectable-card ${state.selected.has(index) ? "selected" : ""}" data-select="${index}"><b>${handCard.name}</b>${statGrid(handCard.stats, true)}</button>`).join("") : `<p>You don't have any cards yet.</p>`}</div>
    <div class="dialog-actions"><small>Permanent strengths are already included.</small><button class="primary-button" id="completeBrief" ${canComplete(card, totals) ? "" : "disabled"}>Complete brief</button></div>`;
  document.querySelectorAll("[data-select]").forEach(button => button.addEventListener("click", () => {
    const index = Number(button.dataset.select);
    state.selected.has(index) ? state.selected.delete(index) : state.selected.add(index);
    updateBriefDialog();
  }));
  $("#completeBrief").addEventListener("click", completeBrief);
}

function completeBrief() {
  const player = currentPlayer();
  const card = state.milestones[state.activeBrief];
  if (!canComplete(card)) return;
  player.hand = player.hand.filter((_, index) => !state.selected.has(index));
  player.score += card.points;
  if (card.reward.cash) player.cash += card.reward.cash;
  if (card.reward.permanent) player.strengths[card.reward.permanent] = (player.strengths[card.reward.permanent] || 0) + 1;
  state.milestones.splice(state.activeBrief, 1);
  replenish(state.milestones, state.milestoneDraw, milestoneDeck);
  $("#briefDialog").close();
  playTone(620, 0.12);
  const won = player.score >= 15;
  advanceTurn(`${player.name} completed ${card.name} · +${card.points} reputation`);
  if (won) setTimeout(() => showWin(player), 450);
}

function invest() {
  const player = currentPlayer();
  if (player.cash < 5) return;
  player.cash -= 5;
  player.score += 1;
  playTone(520);
  const won = player.score >= 15;
  advanceTurn(`${player.name} invested in growth · +1 reputation`);
  if (won) setTimeout(() => showWin(player), 450);
}

function advanceTurn(message) {
  state.turn += 1;
  state.currentPlayerIndex = (state.currentPlayerIndex + 1) % state.players.length;
  render();
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
  renderPlayerInputs(true);
  if (!$("#setupDialog").open) $("#setupDialog").showModal();
}

function startConfiguredGame() {
  const names = [...document.querySelectorAll(".player-name-input")].map((input, index) => input.value.trim() || `Company ${index + 1}`);
  newGame(names);
  $("#setupDialog").close();
  notify(`${names[0]} goes first`);
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
$("#startGameButton").addEventListener("click", startConfiguredGame);
$("#investButton").addEventListener("click", invest);
$("#soundButton").addEventListener("click", (event) => { state.sound = !state.sound; event.currentTarget.textContent = state.sound ? "◖))" : "◖×"; notify(`Sound ${state.sound ? "on" : "off"}`); });
newGame(["Day One Goods", "Bright Side Co."]);
openSetup();
