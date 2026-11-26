// Puget Sound Survey — minimal sailing exploration game
const SAVE_KEY = "puget_sound_survey_v1";
const WEATHERS = ["calm", "wind", "fog", "storm"];
const TIDES = ["slack", "flood", "ebb"];
const WEATHER_NOTES = {
  calm: "Glassy water and light airs.",
  wind: "A brisk breeze raised whitecaps across the reach.",
  fog: "Fog hung low over the water all morning.",
  storm: "Squalls drove rain hard across the deck."
};

// TODO: Once original_name fields in data/map.json are populated from verified
// Indigenous sources, render() will display them automatically on surveyed nodes.
let mapData = null, nodesById = {}, state = null;
const $ = (id) => document.getElementById(id);
const clamp = (n) => Math.max(0, Math.min(100, Math.round(n)));
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

function newState() {
  const start = nodesById[mapData.start];
  return {
    day: 1, location: start.id, food: 100, boat: 100, morale: 100,
    weather: "calm", tide: "slack", surveyed: [start.id], customNames: {},
    gameOver: false, endReason: "",
    log: [`Day 1. Set out from ${start.name} with full stores and a sound hull. ${WEATHER_NOTES.calm}`]
  };
}

function saveState() {
  try { localStorage.setItem(SAVE_KEY, JSON.stringify(state)); } catch (_) {}
}

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(SAVE_KEY));
    return saved && nodesById[saved.location] ? saved : null;
  } catch (_) { return null; }
}

// Advance calendar and roll the next day's weather and tide
function advanceDay(days = 1) {
  state.day += days;
  state.weather = pick(WEATHERS);
  state.tide = pick(TIDES);
}

// Evaluate current passage risk for a destination node
function assessRisk(node) {
  if (node.hazard === "strong current" && state.tide !== "slack") return { risky: true, note: `${state.tide} tide in strong current` };
  if (node.hazard === "exposed" && (state.weather === "storm" || state.weather === "wind")) return { risky: true, note: `exposed water in ${state.weather}` };
  if (node.hazard === "fog-prone" && state.weather === "fog") return { risky: true, note: "thick fog along shoals" };
  if (state.weather === "storm") return { risky: true, note: "stormy crossing" };
  return { risky: false, note: node.hazard === "strong current" ? "slack tide — safe passage" : "fair passage" };
}

function finishTurn(days = 1) {
  advanceDay(days);
  if (state.boat <= 0 || state.food <= 0) {
    state.gameOver = true;
    state.endReason = state.boat <= 0
      ? "The boat took on too much water and could sail no further."
      : "Our provisions ran dry before we could make a friendly shore.";
    state.log.push(`Day ${state.day}. ${state.endReason} The survey ends here.`);
  }
  saveState();
  render();
}

function sailTo(targetId, distance) {
  if (state.gameOver) return;
  const target = nodesById[targetId];
  const risk = assessRisk(target);
  const foodCost = Math.max(4, Math.round(distance * 0.55));
  const damage = risk.risky
    ? (target.hazard === "strong current" ? 18 + Math.floor(Math.random() * 14) : 10 + Math.floor(Math.random() * 10))
    : 0;

  state.food = clamp(state.food - foodCost);
  state.boat = clamp(state.boat - damage);
  state.morale = clamp(state.morale + (risk.risky ? -8 : state.weather === "calm" ? 2 : 0));
  state.location = targetId;

  let entry = `Day ${state.day}. Sailed ${distance} nm to ${target.name} on a ${state.tide} tide. ${WEATHER_NOTES[state.weather]}`;
  if (damage > 0) entry += ` Rough going (${risk.note}); hull took ${damage} damage.`;
  state.log.push(entry);
  finishTurn(distance >= 18 ? 2 : 1);
}

function anchorAndRest() {
  if (state.gameOver) return;
  const node = nodesById[state.location];
  state.food = clamp(state.food - 5);
  state.morale = clamp(state.morale + 16);
  state.log.push(`Day ${state.day}. Anchored at ${node.name} to rest and mend gear. ${WEATHER_NOTES[state.weather]}`);
  finishTurn(1);
}

function surveyPlace() {
  if (state.gameOver) return;
  const node = nodesById[state.location];
  if (state.surveyed.includes(node.id)) return;
  state.surveyed.push(node.id);
  state.food = clamp(state.food - 4);
  state.morale = clamp(state.morale + 6);
  state.log.push(`Day ${state.day}. Surveyed ${node.name}. ${WEATHER_NOTES[state.weather]} Recorded soundings and shoreline notes.`);
  finishTurn(1);
}

function namePlace(rawName) {
  const given = rawName.trim();
  if (state.gameOver || !given) return;
  const node = nodesById[state.location];
  state.customNames[node.id] = state.customNames[node.id] || [];
  state.customNames[node.id].push(given);
  state.log.push(`Day ${state.day}. At ${node.name}. ${WEATHER_NOTES[state.weather]} Named a local landmark "${given}."`);
  saveState();
  render();
}

function setBar(key, val) {
  const fill = $(`bar-${key}`);
  fill.style.width = `${val}%`;
  fill.classList.toggle("low", val <= 25);
  $(`val-${key}`).textContent = val;
}

function render() {
  const node = nodesById[state.location];
  const isSurveyed = state.surveyed.includes(node.id);
  const givenList = state.customNames[node.id] || [];

  $("conditions").innerHTML =
    `<span><strong>Day ${state.day}</strong></span>` +
    `<span>Weather: <strong>${state.weather}</strong></span>` +
    `<span>Tide: <strong>${state.tide}</strong></span>`;
  setBar("food", state.food);
  setBar("boat", state.boat);
  setBar("morale", state.morale);

  $("loc-name").textContent = node.name;
  $("loc-hazard").textContent = `hazard: ${node.hazard}`;
  $("loc-hazard").classList.toggle("risky", node.hazard !== "none");

  const meta = [];
  if (isSurveyed && node.original_name) meta.push(`Original name: ${node.original_name}`);
  if (givenList.length) meta.push(`Your chart names: ${givenList.map((n) => `"${n}"`).join(", ")}`);
  $("loc-given").textContent = meta.join(" · ");
  $("loc-desc").textContent = isSurveyed
    ? node.description
    : "Uncharted shore. Survey this place to record its description and mark it on your chart.";

  $("btn-survey").disabled = state.gameOver || isSurveyed;
  $("btn-survey").textContent = isSurveyed ? "Surveyed" : "Survey Place";
  $("btn-rest").disabled = state.gameOver;
  $("name-input").disabled = state.gameOver;
  $("name-form").querySelector("button").disabled = state.gameOver;
  $("chart-progress").textContent = `${state.surveyed.length} / ${mapData.nodes.length} surveyed`;

  const list = $("neighbor-list");
  list.innerHTML = "";
  node.neighbors.forEach(({ id, distance }) => {
    const dest = nodesById[id], risk = assessRisk(dest), destNames = state.customNames[id];
    const li = document.createElement("li"), info = document.createElement("div");
    const title = document.createElement("strong"), sub = document.createElement("small");
    info.className = "neighbor-info";
    title.textContent = destNames?.length ? `${dest.name} ("${destNames[0]}")` : dest.name;
    sub.className = risk.risky ? "warn" : "";
    sub.textContent = `${distance} nm · ${state.surveyed.includes(id) ? "charted" : "uncharted"} · ${risk.note}`;
    info.append(title, sub);
    const btn = document.createElement("button");
    btn.textContent = "Sail";
    btn.disabled = state.gameOver;
    btn.addEventListener("click", () => sailTo(id, distance));
    li.append(info, btn);
    list.appendChild(li);
  });

  const logEl = $("log-list");
  logEl.innerHTML = "";
  state.log.forEach((line) => {
    const li = document.createElement("li");
    li.textContent = line;
    logEl.appendChild(li);
  });
  logEl.scrollTop = logEl.scrollHeight;
  $("gameover-panel").classList.toggle("hidden", !state.gameOver);
  $("gameover-reason").textContent = state.endReason;
}

const logAsText = () => `PUGET SOUND SURVEY — VOYAGE LOG\n\n${state.log.join("\n")}\n`;

function bindEvents() {
  $("btn-survey").addEventListener("click", surveyPlace);
  $("btn-rest").addEventListener("click", anchorAndRest);
  $("name-form").addEventListener("submit", (e) => {
    e.preventDefault();
    namePlace($("name-input").value);
    $("name-input").value = "";
  });
  $("btn-copy").addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(logAsText());
      $("btn-copy").textContent = "Copied";
      setTimeout(() => ($("btn-copy").textContent = "Copy Log"), 1500);
    } catch (_) { alert("Could not copy automatically. Use Download .txt instead."); }
  });
  $("btn-download").addEventListener("click", () => {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([logAsText()], { type: "text/plain" }));
    a.download = "puget-sound-voyage-log.txt";
    a.click();
    URL.revokeObjectURL(a.href);
  });
  const reset = () => {
    if (!state.gameOver && !confirm("Start a new voyage? Your current log will be cleared.")) return;
    state = newState();
    saveState();
    render();
  };
  $("btn-reset").addEventListener("click", reset);
  $("btn-restart-over").addEventListener("click", reset);
}

async function init() {
  try {
    const res = await fetch("data/map.json");
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    mapData = await res.json();
    mapData.nodes.forEach((n) => (nodesById[n.id] = n));
    state = loadState() || newState();
    saveState();
    bindEvents();
    render();
  } catch (_) {
    $("loc-name").textContent = "Unable to load data/map.json";
    $("loc-desc").textContent = "Serve this folder over HTTP (e.g. `python3 -m http.server`) so the browser can fetch data/map.json.";
  }
}

init();
