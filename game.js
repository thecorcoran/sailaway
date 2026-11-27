// game.js — South Sound 1850 (Olympia to Sitka, ~1,100 nm Inside Passage)
(() => {
  const SAVE_KEY = "south_sound_1850_save_v2";
  const LOST_KEY = "south_sound_1850_lost_v1";
  const FORMSPREE_URL = "https://formspree.io/f/mqadvwvo";

  const TIDES = ["slack", "flood", "ebb"];
  const SEASONS = ["spring", "summer", "autumn", "winter"];
  const SKIES = ["clear", "overcast", "fog", "rain"];
  const TURNS_PER_TIDE = 3;
  const TURNS_PER_WEATHER = 10;
  const OVERNIGHT_STEPS = 6;
  const FULL_DIR = { n: "north", s: "south", e: "east", w: "west", ne: "northeast", nw: "northwest", se: "southeast", sw: "southwest" };

  // Merge all 7 regional world files
  const LOCATIONS = Object.assign(
    {},
    window.WORLD_REGIONS?.south || {},
    window.WORLD_REGIONS?.central || {},
    window.WORLD_REGIONS?.north || {},
    window.WORLD_REGIONS?.hood || {},
    window.WORLD_REGIONS?.strait || {},
    window.WORLD_REGIONS?.canada || {},
    window.WORLD_REGIONS?.alaska || {}
  );

  const outEl = document.getElementById("output");
  const inputEl = document.getElementById("command");
  const hudEl = document.getElementById("hud");
  const hudCompass = document.getElementById("hud-compass");
  const hudTide = document.getElementById("hud-tide");
  const hudCurrent = document.getElementById("hud-current");
  const sendLogBtn = document.getElementById("send-log-btn");
  const feedbackUI = document.getElementById("feedback-ui");
  const feedbackNote = document.getElementById("feedback-note");
  const feedbackSubmit = document.getElementById("feedback-submit");
  const feedbackCancel = document.getElementById("feedback-cancel");

  let state = null;
  let cmdHistory = [];
  let histIndex = -1;
  let transcript = [];

  const clone = (o) => JSON.parse(JSON.stringify(o));
  const curLoc = () => LOCATIONS[state.location];
  const curVessel = () => window.VESSELS[state.vesselId] || window.VESSELS.skiff;
  const hasItem = (id) => state.inventory.some((i) => i.id === id);

  function createState() {
    const roomObjects = {};
    Object.keys(LOCATIONS).forEach((id) => { roomObjects[id] = []; });
    const inventory = [];

    const db = clone(window.ITEMS_DB || []);
    const byId = {};
    db.forEach((item) => { byId[item.id] = item; });

    db.forEach((item) => {
      if (item.found_in === "inventory") inventory.push(item);
      else if (item.found_in === "gear_locker" && byId.gear_locker) {
        byId.gear_locker.contents = byId.gear_locker.contents || [];
        byId.gear_locker.contents.push(item);
      } else if (roomObjects[item.found_in]) {
        roomObjects[item.found_in].push(item);
      }
    });

    Object.values(LOCATIONS).forEach((loc) => {
      (loc.objects || []).forEach((objId) => {
        if (byId[objId] && !roomObjects[loc.id].some((o) => o.id === objId)) {
          roomObjects[loc.id].push(clone(byId[objId]));
        }
      });
    });

    return {
      location: "olympia_landing",
      vesselId: "skiff",
      crew: 1,
      blankets: 0,
      lumber: 0,
      day: 1,
      season: "spring",
      step: 0,
      tide: "slack",
      wind: "calm",
      sky: "overcast",
      tideUncertainty: Math.random() < 0.5 ? 0 : 1,
      ashore: false,
      tied: true,
      anchored: false,
      reefed: false,
      lashed: false,
      hull: 100,
      water: 100,
      fatigue: 0,
      exposure: 0,
      sick: false,
      swampedTurns: 0,
      fireLitAt: null,
      shelters: {},       // { locId: "lean-to" | "cabin" }
      milestones: {},     // { locId: true }
      sitkaDelivered: false,
      pendingRisk: null,
      capsizeState: null,
      dead: false,
      seq: 0,
      inventory,
      roomObjects,
      visited: ["olympia_landing"],
      currentKnown: {},
      customNames: {},
      log: ["Day 1, Spring 1850 (Oregon Territory). Put afloat at Olympia Landing in a sloop-rigged skiff with a sealed dispatch bound for Sitka (New Archangel)."]
    };
  }

  function print(text, cls = "") {
    if (!text) return;
    transcript.push(text);
    const p = document.createElement("p");
    p.className = `line ${cls}`.trim();
    p.textContent = text;
    outEl.appendChild(p);
    outEl.scrollTop = outEl.scrollHeight;
  }

  function addLog(entry) {
    state.log.push(`Day ${state.day} (${state.season}). ${entry}`);
  }

  // --- EARNED INSTRUMENT HUD ---
  function renderCompassSVG(exits) {
    const dirs = Object.keys(exits || {});
    const pts = { n: [17, 4], ne: [26, 8], e: [30, 17], se: [26, 26], s: [17, 30], sw: [8, 26], w: [4, 17], nw: [8, 8] };
    const rays = Object.entries(pts).map(([d, [x, y]]) => {
      const open = dirs.includes(d);
      return `<line x1="17" y1="17" x2="${x}" y2="${y}" stroke="${open ? "#f0f2eb" : "#2f352f"}" stroke-width="${open ? 2 : 1}"/>`;
    }).join("");
    return `<svg class="compass-svg" viewBox="0 0 34 34" aria-hidden="true"><circle cx="17" cy="17" r="15" fill="none" stroke="#3a423a"/>${rays}<circle cx="17" cy="17" r="2" fill="#9aa59a"/></svg>`;
  }

  function updateHUD() {
    const loc = curLoc();
    const showCompass = hasItem("brass_compass");
    const showTide = hasItem("tide_notes");
    const showCurrent = Boolean(loc.hazard?.tidal && state.currentKnown[loc.id]);

    hudEl.classList.toggle("hidden", !showCompass && !showTide && !showCurrent);
    hudCompass.classList.toggle("hidden", !showCompass);
    if (showCompass) {
      const openList = Object.keys(loc.exits || {}).map((d) => d.toUpperCase()).join(" ");
      hudCompass.innerHTML = `${renderCompassSVG(loc.exits)}<span>${openList || "—"}</span>`;
    }

    hudTide.classList.toggle("hidden", !showTide);
    if (showTide) {
      const cycle = TIDES.length * TURNS_PER_TIDE;
      const pos = state.step % cycle;
      const rawNext = state.tide === "slack" ? 0 : Math.max(1, cycle - pos + (state.tideUncertainty ? -1 : 0));
      hudTide.textContent = state.tide === "slack"
        ? `Tide: slack (~${Math.max(1, TURNS_PER_TIDE - pos)}t)`
        : `Tide: ${state.tide} (slack ~${rawNext}t)`;
    }

    hudCurrent.classList.toggle("hidden", !showCurrent);
    if (showCurrent) {
      const arrow = state.tide === "slack" ? "•" : state.tide === "flood" ? "↓" : "↑";
      const strength = state.tide === "slack" ? "calm" : (loc.hazard.currentStrength || "light");
      hudCurrent.textContent = `Current: ${arrow} ${strength}`;
    }
  }

  // --- TIME & SEASONS (advances ONLY on movement, fish, wait, row/sail, camp) ---
  function advanceTime(steps = 1) {
    const oldStep = state.step;
    const oldTide = state.tide;
    const oldWind = state.wind;
    const oldSeason = state.season;

    state.step += steps;
    state.day = 1 + Math.floor(state.step / 12);
    state.season = SEASONS[Math.floor((state.day - 1) / 25) % SEASONS.length];
    state.tide = TIDES[Math.floor(state.step / TURNS_PER_TIDE) % TIDES.length];

    // Weather shifts less often than tide; seasons shape wind odds
    if (Math.floor(state.step / TURNS_PER_WEATHER) > Math.floor(oldStep / TURNS_PER_WEATHER)) {
      const r = Math.random();
      if (state.season === "summer") state.wind = r < 0.45 ? "calm" : r < 0.85 ? "breeze" : r < 0.97 ? "strong" : "gale";
      else if (state.season === "winter") state.wind = r < 0.15 ? "calm" : r < 0.45 ? "breeze" : r < 0.78 ? "strong" : "gale";
      else state.wind = r < 0.30 ? "calm" : r < 0.70 ? "breeze" : r < 0.92 ? "strong" : "gale";
      state.sky = SKIES[Math.floor(Math.random() * SKIES.length)];
    }

    // Water, fatigue, and winter/rain exposure
    state.water = Math.max(0, state.water - steps * 2);
    state.fatigue = Math.min(100, state.fatigue + steps * (state.sick ? 5 : 2));
    if (state.fireLitAt === state.location && state.ashore) {
      state.exposure = Math.max(0, state.exposure - steps * 15);
    } else if (state.season === "winter" || state.sky === "rain") {
      const shelterBonus = state.shelters[state.location] === "cabin" ? 0 : state.shelters[state.location] === "lean-to" ? 1 : 3;
      state.exposure = Math.min(100, state.exposure + steps * shelterBonus);
    } else {
      state.exposure = Math.max(0, state.exposure - steps * 2);
    }

    // Lowered baited crab pots stay where lowered and yield crab overnight
    Object.values(state.roomObjects).forEach((list) => {
      list.forEach((obj) => {
        if (obj.isCrabPot && obj.baited && obj.setStep !== null && state.step - obj.setStep >= OVERNIGHT_STEPS) {
          obj.baited = false;
          obj.setStep = null;
          obj.contents = obj.contents || [];
          state.seq++;
          obj.contents.push({ ...clone(window.CRAB_TEMPLATE), id: `crab_${state.seq}` });
        }
      });
    });

    if (state.season !== oldSeason) print(`Season turns to ${state.season}.`, "note");
    if (state.tide !== oldTide) print(`Tide turns: ${state.tide}.`, "note");
    if (state.wind !== oldWind) print(`Wind shifts: ${state.wind}, sky ${state.sky}.`, "note");

    if (state.water <= 15 && state.water > 0) print("Your water keg sounds nearly empty. Find a creek or fort.", "warn");
    if (state.exposure >= 75 && state.exposure < 100) print("Cold and wet are settling deep into your bones. Go ashore and make fire or shelter.", "warn");
    if (state.water <= 0) return triggerDeath("The water keg ran dry. Thirst finished the voyage.");
    if (state.exposure >= 100) return triggerDeath("Days of cold rain and exposure took your strength. The voyage ended ashore.");
    updateHUD();
  }

  function triggerDeath(reason) {
    state.dead = true;
    addLog(`${reason} The ${curVessel().name} was not seen again.`);
    try {
      localStorage.removeItem(SAVE_KEY);
      const lost = JSON.parse(localStorage.getItem(LOST_KEY) || "[]");
      lost.push({ date: new Date().toISOString().slice(0, 10), location: curLoc().name, log: state.log });
      localStorage.setItem(LOST_KEY, JSON.stringify(lost));
    } catch (_) {}
    print(reason, "warn");
    print("Voyage lost and filed under 'lost voyages'. Type 'new voyage' to begin again.", "note");
  }

  // --- MATCHING ---
  function matchesQuery(item, query) {
    const q = query.toLowerCase();
    const sq = Parser.singularize(q);
    const name = item.name.toLowerCase();
    if (name === q || name.includes(q) || name.includes(sq)) return true;
    return (item.aliases || []).some((a) => {
      const al = a.toLowerCase();
      return al === q || al === sq || al.includes(q);
    });
  }

  function findObject(query, scope = "all") {
    if (!query) return null;
    const search = (list) => {
      for (let i = 0; i < list.length; i++) {
        const obj = list[i];
        if (matchesQuery(obj, query)) return { obj, list, index: i };
        if (obj.openable && obj.open && obj.contents) {
          const hit = search(obj.contents);
          if (hit) return hit;
        }
      }
      return null;
    };
    if (scope === "inv" || scope === "all") {
      const hit = search(state.inventory);
      if (hit) return { ...hit, inInventory: true };
    }
    if (scope === "room" || scope === "all") {
      const hit = search(state.roomObjects[state.location] || []);
      if (hit) return { ...hit, inInventory: false };
    }
    return null;
  }

  function findScenery(query) {
    const sc = curLoc().scenery || {};
    const q = query.toLowerCase();
    const sq = Parser.singularize(q);
    if (sc[q]) return sc[q];
    if (sc[sq]) return sc[sq];
    for (const [k, v] of Object.entries(sc)) {
      if (k.includes(q) || q.includes(k) || k.includes(sq)) return v;
    }
    return null;
  }

  function describeLocation() {
    const loc = curLoc();
    const given = state.customNames[loc.id];
    const shoreTag = state.ashore ? " [Ashore]" : "";
    print(`${loc.name}${given ? ` ("${given}")` : ""}${shoreTag} — ${loc.region}`, "title");

    const parts = [loc.description];
    if (loc.tide_variants?.[state.tide]) parts.push(loc.tide_variants[state.tide]);
    const daylight = state.season === "summer" ? "Long summer light." : state.season === "winter" ? "Short winter daylight." : "";
    parts.push(`Season: ${state.season}. Wind: ${state.wind}, ${state.sky}.${daylight ? " " + daylight : ""}`);
    print(parts.join(" "));

    const status = [];
    if (state.ashore) status.push("Ashore on the beach.");
    if (state.shelters[loc.id]) status.push(`Your ${state.shelters[loc.id]} stands above high water.`);
    if (state.fireLitAt === loc.id) status.push("A driftwood fire burns on the gravel.");
    if (state.tied) status.push("Vessel tied fast.");
    if (state.anchored) status.push("Anchor down.");
    if (state.reefed) status.push("Sail reefed.");
    if (state.swampedTurns > 0) status.push("Bilge flooded — bail before sailing.");
    if (status.length) print(status.join(" "), "note");

    const objs = (state.roomObjects[loc.id] || []).filter((o) => o.takeable || o.openable || o.gatherable || o.isWaterSource || o.isTrader || o.id === "rac_officer" || o.id === "trading_post_notice");
    if (objs.length) {
      print(`Here: ${objs.map((o) => o.name + (o.isCrabPot && o.setStep !== null ? " (lowered)" : o.openable ? (o.open ? " (open)" : " (closed)") : "")).join(", ")}.`);
    }
    const exits = Object.keys(loc.exits || {}).map((d) => FULL_DIR[d] || d);
    print(`Water open: ${exits.join(", ") || "none"}.`, "note");
    updateHUD();
  }

  // --- MOVEMENT & HAZARD GATE ---
  function attemptMove(dir, forced = false) {
    const loc = curLoc();
    const ex = (loc.exits || {})[dir];
    if (!ex) return print(`Shore or shoals bar the way ${FULL_DIR[dir] || dir}.`);
    if (state.ashore) return print("You are ashore. Board your boat first.");
    if (state.tied) return print("Vessel is tied fast. Cast off first.");
    if (state.anchored) return print("Anchor is down. Weigh anchor first.");
    if (state.swampedTurns > 0) return print("The bilge is flooded. Bail before moving.");

    if (ex.requiresTide && state.tide !== ex.requiresTide) {
      return print(ex.blockedText || `The ${state.tide} tide bars passage.`);
    }

    const dest = LOCATIONS[ex.to];
    const risk = Hazards.evaluateLeg(state, loc, dest, hasItem("lead_line"));

    if (risk.warn && !forced) {
      const isRepeat = state.pendingRisk && state.pendingRisk.dir === dir && state.pendingRisk.from === state.location;
      if (!isRepeat) {
        state.pendingRisk = { dir, from: state.location };
        return print(Hazards.buildWarning(state, dest, risk), "warn");
      }
    }
    state.pendingRisk = null;

    const outcome = Hazards.resolveLeg(risk, state);
    state.location = dest.id;
    state.fireLitAt = null;
    if (!state.visited.includes(dest.id)) {
      state.visited.push(dest.id);
      addLog(`Made ${dest.name}.`);
    }
    if (dest.milestone && !state.milestones[dest.id]) {
      state.milestones[dest.id] = true;
      addLog(dest.milestone);
    }

    advanceTime(ex.steps || 1);
    if (state.dead) return;

    if (outcome.type === "capsize") {
      state.capsizeState = { locId: dest.id };
      print(`A steep cross-sea catches your ${curVessel().name} off ${dest.name} and rolls her over. Cold water closes over your chest. No life jacket.`, "warn");
      print("Choose: cling to boat / swim ashore / right the boat / call out", "note");
      return;
    }
    if (outcome.type === "swamp") {
      state.swampedTurns = outcome.turns;
      state.hull = Math.max(10, state.hull - 8);
      addLog(`Swamped crossing to ${dest.name}.`);
      print("Green water breaks over the bow, soaking stores and flooding the bilge. Bail before sailing.", "warn");
    } else if (outcome.type === "scare") {
      state.hull = Math.max(10, state.hull - outcome.damage);
      let msg = `Rough leg—timbers strain in the chop (hull ${state.hull}%).`;
      if (outcome.loseGear) {
        const idx = state.inventory.findIndex((i) => i.id === "bailer" || i.id === "tin_cup" || i.id === "spare_line");
        if (idx !== -1) msg += ` Your unlashed ${state.inventory.splice(idx, 1)[0].name} goes over the side.`;
      }
      addLog(msg);
      print(msg, "warn");
    }

    describeLocation();
    if (dest.isSitka && !state.sitkaDelivered && hasItem("dispatch_letter")) {
      print("You have reached New Archangel. Go ashore or give the dispatch to the Russian-American Company officer to deliver your message.", "note");
    }
  }

  // --- COMMAND HANDLER ---
  function handleCommand(raw) {
    if (state.dead) {
      const low = raw.trim().toLowerCase();
      if (low === "new voyage") {
        state = createState();
        print("A new voyage begins.", "title");
        return describeLocation();
      }
      if (low === "lost voyages") return showLostVoyages();
      return print("This voyage is lost. Type 'new voyage' or 'lost voyages'.");
    }

    const cmd = Parser.parse(raw);
    if (!cmd) return;
    const { verb, noun1, prep, noun2, rawRest } = cmd;

    if (verb === "too_long") return print("Short commands, please.");
    if (verb === "did_you_mean") return print(`Did you mean ${noun1}?`);

    // Active capsize survival sequence
    if (state.capsizeState) {
      if (verb !== "capsize_choice") return print("In cold water beside the overturned hull. Choose: cling to boat, swim ashore, right the boat, or call out.", "warn");
      const res = Hazards.resolveCapsizeChoice(noun1, curLoc(), state);
      state.capsizeState = null;
      if (!res.survived) return triggerDeath(res.text);
      state.hull = Math.max(15, state.hull - (res.hullLoss || 15));
      if (res.swamped) state.swampedTurns = res.swamped;
      addLog(`Survived capsize off ${curLoc().name}.`);
      print(res.text, "warn");
      return describeLocation();
    }

    if (!["push_on", "go", "sail", "row"].includes(verb)) state.pendingRisk = null;

    switch (verb) {
      case "push_on":
        if (!state.pendingRisk || state.pendingRisk.from !== state.location) return print("Push on where? Give a direction.");
        return attemptMove(state.pendingRisk.dir, true);

      case "go": case "sail": case "row": {
        const d = Parser.DIR_MAP[noun1];
        if (!d) return print("Go which way? Try north, south, east, west, ne, nw, se, sw.");
        return attemptMove(d, false);
      }

      case "go_to": {
        if (!noun1) return print("Go to where?");
        if (noun1 === "shore" || noun1 === "beach" || noun1 === "land") return goAshore();
        if (noun1 === "boat" || noun1 === "skiff" || noun1 === "whaleboat" || noun1 === "schooner") return boardBoat();
        // Match connected exit by destination name
        const matchExit = Object.entries(curLoc().exits || {}).find(([, ex]) => LOCATIONS[ex.to].name.toLowerCase().includes(noun1));
        if (matchExit) return attemptMove(matchExit[0], false);
        // Match present object or scenery
        if (findObject(noun1) || findScenery(noun1)) return handleCommand(`examine ${noun1}`);
        return print(`You don't see "${noun1}" from here.`);
      }

      case "look":
        return describeLocation();

      case "look_dir": {
        const d = Parser.DIR_MAP[noun1];
        const ex = (curLoc().exits || {})[d];
        if (!ex) return print(`Shore or shoals lie ${FULL_DIR[d] || d}.`);
        const spy = hasItem("spyglass") ? ` Through the spyglass: ${LOCATIONS[ex.to].name} (${ex.steps || 1} step${(ex.steps || 1) > 1 ? "s" : ""}).` : "";
        return print(`${ex.look || `${LOCATIONS[ex.to].name} lies ${FULL_DIR[d]}.`}${spy}`);
      }

      case "look_in": {
        if (!noun1) return print("Look in what?");
        const hit = findObject(noun1);
        if (!hit) return print(`No "${noun1}" here.`);
        if (!hit.obj.openable) return print(`Cannot look inside the ${hit.obj.name}.`);
        if (!hit.obj.open) return print(`The ${hit.obj.name} is closed.`);
        return print(hit.obj.contents?.length ? `Inside ${hit.obj.name}: ${hit.obj.contents.map((c) => c.name).join(", ")}.` : `The ${hit.obj.name} is empty.`);
      }

      case "examine": {
        if (!noun1) return print("Examine what?");
        if (["boat", "skiff", "whaleboat", "schooner", "vessel", "hull"].includes(noun1)) {
          const v = curVessel();
          return print(`${v.name} (crew ${state.crew}/${v.crewMax}). ${v.description} Hull: ${state.hull}%. Load: ${Hazards.totalWeight(state.inventory).toFixed(0)}/${v.cargoLimit} lb. Water: ${state.water}%.`);
        }
        if ((noun1.includes("water") || noun1.includes("kelp") || noun1.includes("current")) && curLoc().hazard?.tidal) {
          state.currentKnown[state.location] = true;
          updateHUD();
        }
        const hit = findObject(noun1);
        if (hit) {
          let desc = hit.obj.description;
          if (hit.obj.openable) desc += hit.obj.open ? (hit.obj.contents?.length ? ` Inside: ${hit.obj.contents.map((c) => c.name).join(", ")}.` : " Open, empty.") : " Closed.";
          return print(desc);
        }
        const sc = findScenery(noun1);
        if (sc) return print(sc);
        return print(`You see no "${noun1}" here.`);
      }

      case "take": case "get": case "grab": case "keep": {
        if (!noun1) return print("Take what?");
        if (findObject(noun1, "inv")) return print("You already have it.");
        const hit = findObject(noun1, "room");
        if (!hit) return print(`No "${noun1}" here to take.`);
        if (!hit.obj.takeable) return print(`Cannot take the ${hit.obj.name}.`);
        hit.list.splice(hit.index, 1);
        if (hit.obj.isCrabPot) hit.obj.setStep = null;
        state.inventory.push(hit.obj);
        updateHUD();
        return print(`Taken: ${hit.obj.name}.`);
      }

      case "haul_pot": case "haul": {
        const hit = findObject("crab pot", "room");
        if (!hit) return print("No crab pot lowered here.");
        hit.list.splice(hit.index, 1);
        hit.obj.setStep = null;
        state.inventory.push(hit.obj);
        const caught = hit.obj.contents?.length ? ` Inside: ${hit.obj.contents.map((c) => c.name).join(", ")}.` : " It came up empty.";
        return print(`You haul the woven crab pot aboard.${caught}`);
      }

      case "drop": case "leave": case "dump": {
        if (!noun1) return print(`${verb === "dump" ? "Dump" : "Drop"} what?`);
        const hit = findObject(noun1, "inv");
        if (!hit) return print(`You aren't carrying "${noun1}".`);
        hit.list.splice(hit.index, 1);
        if (verb === "dump" && hit.obj.releasable) return print(`Released ${hit.obj.name} back into the water.`);
        state.roomObjects[state.location].push(hit.obj);
        if (hit.obj.isCrabPot) {
          hit.obj.setStep = state.step;
          return print(hit.obj.baited ? "Lowered the baited crab pot here. Leave it overnight and haul pot later." : "Lowered the empty crab pot here.");
        }
        updateHUD();
        return print(`${verb === "dump" ? "Dumped" : "Dropped"}: ${hit.obj.name}.`);
      }

      case "stow":
        state.lashed = true;
        return print("You stow cargo low in the bilge and lash gear down.");

      case "put": {
        if (!noun1) return print("Put what where?");
        const itemHit = findObject(noun1, "inv");
        if (!itemHit) return print(`You aren't carrying "${noun1}".`);
        const openCont = (state.roomObjects[state.location] || []).find((o) => o.openable && o.open);
        const target = noun2 ? findObject(noun2) : (prep === "back" && openCont ? { obj: openCont } : null);
        if (target?.obj.isCrabPot && itemHit.obj.isBait) {
          itemHit.list.splice(itemHit.index, 1);
          target.obj.baited = true;
          target.obj.open = false;
          return print(`Baited the crab pot with ${itemHit.obj.name}. Drop it to lower into the water.`);
        }
        if (target?.obj.openable) {
          if (!target.obj.open) return print(`The ${target.obj.name} is closed.`);
          itemHit.list.splice(itemHit.index, 1);
          target.obj.contents = target.obj.contents || [];
          target.obj.contents.push(itemHit.obj);
          updateHUD();
          return print(`Put ${itemHit.obj.name} in ${target.obj.name}.`);
        }
        if (prep === "back") {
          itemHit.list.splice(itemHit.index, 1);
          state.roomObjects[state.location].push(itemHit.obj);
          updateHUD();
          return print(`Put ${itemHit.obj.name} back.`);
        }
        return print("Put it in what?");
      }

      case "give": case "offer": {
        if (!noun1) return print("Offer what?");
        const itemHit = findObject(noun1, "inv");
        if (!itemHit) return print(`You aren't carrying "${noun1}".`);
        // Deliver Sitka dispatch!
        if (curLoc().isSitka && itemHit.obj.id === "dispatch_letter") {
          itemHit.list.splice(itemHit.index, 1);
          state.sitkaDelivered = true;
          addLog("Delivered the sealed Oregon Territory dispatch to the Russian-American Company headquarters at New Archangel (Sitka).");
          print("The Russian-American Company officer breaks the wax seal, notes the date in the ledger, and signs your receipt. The 1,100-mile passage from Olympia is complete.", "title");
          print("Epilogue entered in your voyage log. You remain free to sail the coast as long as you wish.", "note");
          return;
        }
        if (curLoc().isFort) {
          if (itemHit.obj.isCurrency) {
            itemHit.list.splice(itemHit.index, 1);
            state.blankets += itemHit.obj.blanketValue || 1;
            state.water = 100;
            return print(`Traded ${itemHit.obj.name} at ${curLoc().name} (credit: ${state.blankets} blankets, water keg refilled).`);
          }
          return print("The post clerk asks for blankets, tobacco, powder, or cut lumber.");
        }
        if (curLoc().hasCamp) return print("Hail from the water first; do not press trade uninvited.");
        return print("No one here to trade with.");
      }

      case "hail": {
        if (curLoc().isFort) return print("A clerk waves from the wharf. Type 'trade' to barter lumber, blankets, repairs, or vessels.");
        if (!curLoc().hasCamp) return print("Your hail echoes off empty timber.");
        if (Math.random() < 0.4) return print("People on the beach watch quietly from the canoes and choose not to come out.");
        return print("A cedar canoe paddles out partway to meet you. They trade dried fish or fresh water for a blanket or tobacco—or decline if they have no need.");
      }

      case "trade": {
        if (!curLoc().isFort) return print("Formal trade is conducted at Hudson's Bay posts (Nisqually, Victoria, Rupert, Simpson, Stikine) or by hailing canoes.");
        if (noun1 === "lumber" || (!noun1 && state.lumber >= 2)) {
          if (state.lumber < 2) return print(`You have ${state.lumber} lumber; cut at least 2 ashore to trade for a blanket.`);
          const earned = Math.floor(state.lumber / 2);
          state.lumber -= earned * 2;
          state.blankets += earned;
          addLog(`Traded lumber for ${earned} Hudson's Bay blanket(s) at ${curLoc().name}.`);
          return print(`Sold lumber for ${earned} blanket(s). Credit: ${state.blankets} blankets.`);
        }
        if (noun1 === "whaleboat") {
          if (state.vesselId === "whaleboat" || state.vesselId === "schooner") return print("You already sail a larger vessel.");
          if (state.blankets < 4) return print(`A whaleboat costs 4 blankets (you have ${state.blankets}). Chop lumber ashore and trade.`);
          state.blankets -= 4;
          state.vesselId = "whaleboat";
          state.crew = 2;
          state.hull = 100;
          addLog(`Acquired a double-ended whaleboat and hired a hand at ${curLoc().name}.`);
          return print("You trade 4 blankets for a stout double-ended whaleboat (550 lb cargo, crew 2, safer in exposed straits).");
        }
        if (noun1 === "schooner") {
          if (state.vesselId === "schooner") return print("You already command a coastal schooner.");
          if (state.blankets < 10) return print(`A coastal schooner costs 10 blankets (you have ${state.blankets}).`);
          state.blankets -= 10;
          state.vesselId = "schooner";
          state.crew = 4;
          state.hull = 100;
          addLog(`Acquired a coastal trading schooner and crew at ${curLoc().name}.`);
          return print("You trade 10 blankets for a decked coastal trading schooner (1,200 lb cargo, crew 4, ready for Queen Charlotte Sound and Dixon Entrance).");
        }
        return print(`Post ledger — Blankets: ${state.blankets}, Lumber: ${state.lumber}. Commands: 'trade lumber', 'trade whaleboat' (4 blankets), 'trade schooner' (10 blankets), or 'give <item>'.`);
      }

      // --- LAND & SHORE ACTIONS ---
      case "land":
        return goAshore();

      case "board":
        return boardBoat();

      case "chop": {
        if (!state.ashore) return print("Go ashore first to cut timber.");
        if (!hasItem("axe")) return print("You need a felling axe to chop timber.");
        state.lumber += 2;
        advanceTime(1);
        if (state.dead) return;
        return print(`You fell and buck clean fir poles (+2 lumber, total ${state.lumber}).`);
      }

      case "build": {
        if (!state.ashore) return print("Go ashore first to build shelter.");
        if (!hasItem("axe")) return print("You need an axe to build.");
        const cur = state.shelters[state.location];
        if (!cur) {
          if (state.lumber < 2) return print("You need 2 lumber to build a lean-to. Chop timber first.");
          state.lumber -= 2;
          state.shelters[state.location] = "lean-to";
          advanceTime(2);
          addLog(`Built a cedar lean-to ashore at ${curLoc().name}.`);
          return print("You lash poles and boughs into a weatherproof lean-to.");
        }
        if (cur === "lean-to") {
          if (state.lumber < 4) return print("You need 4 lumber to raise the lean-to into a rough cabin.");
          state.lumber -= 4;
          state.shelters[state.location] = "cabin";
          advanceTime(3);
          addLog(`Built a notched log cabin ashore at ${curLoc().name}.`);
          return print("You notch and stack fir logs into a tight rough cabin above high water.");
        }
        return print("Your rough cabin already stands here.");
      }

      case "make_fire": {
        if (!state.ashore) return print("Go ashore before lighting a fire.");
        if (!hasItem("tinderbox")) return print("You need flint, steel and tinderbox.");
        state.fireLitAt = state.location;
        state.exposure = Math.max(0, state.exposure - 30);
        return print("Sparks catch the charred linen; soon a bright driftwood fire warms the gravel.");
      }

      case "camp": {
        if (!state.ashore) return print("Go ashore before making camp.");
        state.fatigue = Math.max(0, state.fatigue - 45);
        if (state.fireLitAt === state.location || state.shelters[state.location]) state.exposure = Math.max(0, state.exposure - 40);
        print("You camp above the wrack line through the night.");
        return advanceTime(OVERNIGHT_STEPS);
      }

      case "dig": case "rake": {
        const source = (state.roomObjects[state.location] || []).find((o) => o.gatherable);
        if (!source) return print("Nothing to dig or rake on this shore.");
        if (state.tide !== "ebb") return print("High water covers the flats; wait for ebb tide.");
        state.seq++;
        const item = { ...clone(source.gatherable), id: `${source.gatherable.id}_${state.seq}` };
        state.inventory.push(item);
        return print(`You gather ${item.name} from the exposed gravel.`);
      }

      case "pick": case "forage": {
        if (!state.ashore) return print("Go ashore to forage.");
        if (state.season === "winter") return print("Frozen salal and bare brush—nothing to pick in winter.");
        state.seq++;
        state.inventory.push({ id: `berries_${state.seq}`, name: "wild berries", aliases: ["berries", "salal", "fruit"], description: "Tart coastal salmonberries and salal.", takeable: true, weight: 1, edible: true, foodValue: 12 });
        return print("You pick a handful of wild berries along the forest edge.");
      }

      case "repair": {
        if (state.hull >= 100) return print("The hull is already sound.");
        if (hasItem("pitch_oakum")) {
          state.hull = Math.min(100, state.hull + 30);
          return print(`You drive oakum and hot pitch into the sprung seams (hull ${state.hull}%).`);
        }
        const cedar = findObject("cedar driftwood", "inv");
        if (cedar) {
          cedar.list.splice(cedar.index, 1);
          state.hull = Math.min(100, state.hull + 20);
          return print(`You wedge split cedar into a cracked plank (hull ${state.hull}%).`);
        }
        return print("You need pitch and oakum, cedar driftwood, or a Hudson's Bay post to repair the hull.");
      }

      // --- STANDARD OBJECT & SAILING VERBS ---
      case "open": {
        if (!noun1) return print("Open what?");
        const hit = findObject(noun1);
        if (!hit) return print(`No "${noun1}" here.`);
        if (!hit.obj.openable) return print(`The ${hit.obj.name} doesn't open.`);
        if (hit.obj.open) return print("Already open.");
        hit.obj.open = true;
        return print(`Opened ${hit.obj.name}.${hit.obj.contents?.length ? ` Inside: ${hit.obj.contents.map((c) => c.name).join(", ")}.` : " Empty."}`);
      }

      case "close": {
        if (!noun1) return print("Close what?");
        const hit = findObject(noun1);
        if (!hit) return print(`No "${noun1}" here.`);
        if (!hit.obj.openable) return print(`The ${hit.obj.name} doesn't close.`);
        if (!hit.obj.open) return print("Already closed.");
        hit.obj.open = false;
        return print(`Closed ${hit.obj.name}.`);
      }

      case "read": {
        if (!noun1) return print("Read what?");
        const hit = findObject(noun1);
        if (!hit) return print(`No "${noun1}" here.`);
        if (hit.obj.id === "tide_notes") {
          const cycle = TIDES.length * TURNS_PER_TIDE;
          const pos = state.step % cycle;
          return print(state.tide === "slack"
            ? `Tide notes: Slack water now; flood in about ${Math.max(1, TURNS_PER_TIDE - pos)} turn(s).`
            : `Tide notes: ${state.tide} running; next slack in roughly ${Math.max(1, cycle - pos + (state.tideUncertainty ? -1 : 0))} turn(s).`);
        }
        if (hit.obj.id === "wilkes_chart") return showChart();
        if (hit.obj.id === "logbook") return showLog();
        return print(hit.obj.readable || `Nothing written on the ${hit.obj.name}.`);
      }

      case "use": {
        if (!noun1) return print("Use what?");
        const hit = findObject(noun1);
        if (!hit) return print(`You don't have "${noun1}".`);
        if (hit.obj.id === "brass_compass") return print(`Compass: North steady. Open water: ${Object.keys(curLoc().exits || {}).map((d) => FULL_DIR[d]).join(", ")}.`);
        if (hit.obj.id === "lead_line") return print(curLoc().hazard?.shoals ? (state.tide === "ebb" ? "Lead line: half a fathom, mud and gravel." : "Lead line: two fathoms over silt.") : "Lead line: deep water, no bottom at ten fathoms.");
        if (hit.obj.id === "hand_line") return doFish();
        if (hit.obj.id === "bailer" || hit.obj.id === "bucket") return doBail();
        if (hit.obj.id === "water_keg") return doDrinkOrFill();
        if (hit.obj.id === "pitch_oakum") return handleCommand("repair");
        if (hit.obj.id === "medicine_chest") {
          if (!state.sick && state.exposure < 30) return print("You feel well enough; save the medicine.");
          state.sick = false;
          state.exposure = Math.max(0, state.exposure - 30);
          return print("You dose yourself from the medicine chest. The chills and nausea ease.");
        }
        if (hit.obj.id === "wilkes_chart") return showChart();
        if (hit.obj.id === "tide_notes") return handleCommand("read tide notes");
        return print(`Not sure how to use the ${hit.obj.name} here.`);
      }

      case "eat": {
        if (!noun1) return print("Eat what?");
        const hit = findObject(noun1, "inv");
        if (!hit) return print(`You aren't carrying "${noun1}".`);
        if (!hit.obj.edible) return print(`Cannot eat the ${hit.obj.name}.`);
        hit.list.splice(hit.index, 1);
        const poisonOdds = state.season === "summer" ? window.HAZARD_CONFIG.SHELLFISH_POISON_CHANCE * 1.5 : state.season === "winter" ? 0.04 : window.HAZARD_CONFIG.SHELLFISH_POISON_CHANCE;
        if (hit.obj.isShellfish && Math.random() < poisonOdds) {
          state.sick = true;
          state.fatigue = Math.min(100, state.fatigue + 30);
          addLog("Fell gravely ill after eating shellfish.");
          return print("Numb lips and a violent turn of the stomach—shellfish poisoning. Rest or use a medicine chest.", "warn");
        }
        state.fatigue = Math.max(0, state.fatigue - (hit.obj.foodValue || 15));
        return print(`You eat the ${hit.obj.name}.`);
      }

      case "drink": return doDrinkOrFill();
      case "fish": return doFish();
      case "bail": return doBail();

      case "tie": case "moor":
        if (!findObject("cleat", "room") && !curLoc().hazard?.shelter) return print("Nothing to tie to here; anchor instead.");
        state.tied = true;
        state.anchored = false;
        return print("Made fast.");

      case "lash":
        if (!hasItem("spare_line") && !hasItem("tarpaulin")) return print("Need spare line or tarpaulin to lash gear.");
        state.lashed = true;
        return print("Loose gear lashed and stores covered under tarpaulin.");

      case "untie":
        if (!state.tied) return print("Not tied.");
        state.tied = false;
        return print("Cast off.");

      case "anchor":
        if (state.tied) return print("Already tied fast.");
        if (!hasItem("anchor")) return print("No anchor aboard.");
        if (state.anchored) return print("Anchor already down.");
        state.anchored = true;
        return print("Anchor down and holding.");

      case "weigh":
        if (!state.anchored) return print("Anchor already aboard.");
        state.anchored = false;
        return print("Anchor weighed and stowed.");

      case "reef":
        if (state.reefed) return print("Sail already reefed.");
        state.reefed = true;
        return print("Reef tied in the sail.");

      case "unreef":
        if (!state.reefed) return print("Full sail already set.");
        state.reefed = false;
        return print("Reef shaken out.");

      case "wait":
        if (state.anchored || state.tied || state.ashore) state.fatigue = Math.max(0, state.fatigue - 8);
        print("Time passes.");
        return advanceTime(1);

      case "wait_slack": {
        if (state.tide === "slack") return print("Already slack water.");
        const cycle = TIDES.length * TURNS_PER_TIDE;
        const steps = cycle - (state.step % cycle);
        print(`You wait ${steps} turn(s) for slack water.`);
        return advanceTime(steps);
      }

      case "inventory":
        return print(`Aboard ${curVessel().name} (${Hazards.totalWeight(state.inventory).toFixed(0)}/${curVessel().cargoLimit} lb | Blankets: ${state.blankets} | Lumber: ${state.lumber}): ${state.inventory.map((o) => o.name).join(", ") || "empty"}.`);

      case "name":
        if (!rawRest) return print("Usage: name <place name>");
        state.customNames[state.location] = rawRest;
        addLog(`Named ${curLoc().name} "${rawRest}".`);
        return print(`Charted as "${rawRest}".`);

      case "chart": return showChart();
      case "log": return showLog();
      case "download_log": {
        const a = document.createElement("a");
        a.href = URL.createObjectURL(new Blob([`SOUTH SOUND 1850 — VOYAGE LOG\n\n${state.log.join("\n")}\n`], { type: "text/plain" }));
        a.download = "south-sound-1850-log.txt";
        a.click();
        URL.revokeObjectURL(a.href);
        return print("Downloaded voyage log.");
      }
      case "lost_voyages": return showLostVoyages();

      case "save":
        try { localStorage.setItem(SAVE_KEY, JSON.stringify(state)); return print("Saved."); }
        catch (_) { return print("Save failed."); }

      case "restore":
        try {
          const saved = JSON.parse(localStorage.getItem(SAVE_KEY));
          if (!saved || !LOCATIONS[saved.location]) return print("No saved voyage found.");
          state = saved;
          print("Restored.", "note");
          return describeLocation();
        } catch (_) { return print("Restore failed."); }

      case "debug": {
        const loc = curLoc();
        const lines = Object.entries(loc.exits || {}).map(([d, ex]) => {
          const r = Hazards.evaluateLeg(state, loc, LOCATIONS[ex.to], hasItem("lead_line"));
          return `  ${d}->${ex.to}: risk=${r.score} (warn>=${HAZARD_CONFIG.WARN_THRESHOLD}) [${r.reasons.join(", ") || "none"}]`;
        });
        return print(`DEBUG day=${state.day}(${state.season}) step=${state.step} tide=${state.tide} wind=${state.wind} vessel=${state.vesselId} hull=${state.hull} water=${state.water} exp=${state.exposure}\n${lines.join("\n")}`, "note");
      }

      case "help":
        return print("look, examine, go/sail/row <dir>, go to <x>, take/drop/keep/put/dump/stow, eat, drink, open/close, read, use, give/trade/offer/hail, land/board, chop/build/dig/rake/pick/forage/make fire/camp, tie/untie, anchor/weigh anchor, reef sail, bail, repair, fish, haul pot, wait/wait for slack, name <x>, chart, log, download log, save, restore, debug.");

      case "quit":
        return print("Journal closed. Use 'save' before leaving, or refresh to restart.");

      default:
        return print(`I don't know "${verb}". Try: look, examine, go, take, use, wait, fish.`);
    }
  }

  function goAshore() {
    if (state.ashore) return print("Already ashore.");
    if (!curLoc().hasShore) return print("No safe beach or landing here.");
    if (!state.anchored && !state.tied) state.anchored = true;
    state.ashore = true;
    return print(`You haul the ${curVessel().name} onto the gravel beach at ${curLoc().name}.`);
  }

  function boardBoat() {
    if (!state.ashore) return print("Already aboard.");
    state.ashore = false;
    return print(`You shove off and step aboard the ${curVessel().name}.`);
  }

  function doFish() {
    if (!hasItem("hand_line")) return print("Need hand line and hooks to fish.");
    advanceTime(1);
    if (state.dead) return;
    if (Math.random() > (state.tide === "slack" ? 0.45 : 0.62) + (hasItem("fish_gaff") ? 0.15 : 0)) {
      return print("You drop the line and wait. Nothing bites.");
    }
    const pick = window.FISH_POOL[Math.floor(Math.random() * window.FISH_POOL.length)];
    state.seq++;
    state.inventory.push({ ...clone(pick), id: `fish_${state.seq}` });
    addLog(`Caught a ${pick.name} at ${curLoc().name}.`);
    return print(`A sharp tug. You haul in a ${pick.name}.`);
  }

  function doBail() {
    if (state.swampedTurns <= 0) return print("Bilge is dry.");
    const power = hasItem("bucket") ? 2 : hasItem("bailer") ? 1 : 1;
    state.swampedTurns = Math.max(0, state.swampedTurns - power);
    return print(state.swampedTurns === 0 ? "Bilge cleared." : `Bailing steadily (${state.swampedTurns} turn(s) left).`);
  }

  function doDrinkOrFill() {
    if (!hasItem("water_keg")) return print("No water keg aboard.");
    if ((state.roomObjects[state.location] || []).some((o) => o.isWaterSource) || curLoc().isFort) {
      state.water = 100;
      return print("Filled the oak water keg with fresh water.");
    }
    if (state.water <= 0) return print("Water keg is dry.");
    state.water = Math.max(0, state.water - 5);
    state.fatigue = Math.max(0, state.fatigue - 10);
    return print(`You drink from the keg (${state.water}% left).`);
  }

  function showChart() {
    if (!hasItem("wilkes_chart")) return print("Not carrying a chart.");
    const loc = curLoc();
    const exits = Object.entries(loc.exits || {}).map(([d, ex]) => `${FULL_DIR[d]} -> ${LOCATIONS[ex.to].name} (${ex.steps || 1})`).join("; ");
    return print(`Chart (${loc.region} — ${loc.name}): ${exits}.`);
  }

  function showLog() {
    print("Voyage Log:", "title");
    print(state.log.map((e) => `- ${e}`).join("\n"));
    print("Type 'download log' to save as text.", "note");
  }

  function showLostVoyages() {
    try {
      const lost = JSON.parse(localStorage.getItem(LOST_KEY) || "[]");
      if (!lost.length) return print("No lost voyages recorded.");
      print("Lost Voyages:", "title");
      lost.forEach((v, i) => print(`${i + 1}. ${v.date} — lost at ${v.location} (${v.log.length} entries)`));
    } catch (_) { print("Could not read lost voyages."); }
  }

  // --- INPUT & FORMSPREE LOG SUBMISSION ---
  inputEl.addEventListener("keydown", (e) => {
    if (e.key === "ArrowUp") {
      if (cmdHistory.length && histIndex > 0) inputEl.value = cmdHistory[--histIndex];
      return e.preventDefault();
    }
    if (e.key === "ArrowDown") {
      if (histIndex < cmdHistory.length - 1) inputEl.value = cmdHistory[++histIndex];
      else { histIndex = cmdHistory.length; inputEl.value = ""; }
      return e.preventDefault();
    }
    if (e.key !== "Enter") return;
    const raw = inputEl.value.trim();
    if (!raw) return;
    cmdHistory.push(raw);
    histIndex = cmdHistory.length;
    inputEl.value = "";
    print(`> ${raw}`, "echo");
    handleCommand(raw);
  });

  sendLogBtn.addEventListener("click", () => {
    feedbackUI.classList.toggle("hidden");
    if (!feedbackUI.classList.contains("hidden")) feedbackNote.focus();
    else inputEl.focus();
  });

  feedbackCancel.addEventListener("click", () => {
    feedbackUI.classList.add("hidden");
    feedbackNote.value = "";
    inputEl.focus();
  });

  feedbackUI.addEventListener("submit", async (e) => {
    e.preventDefault();
    feedbackSubmit.disabled = true;
    feedbackSubmit.textContent = "Sending...";
    const data = new FormData();
    data.append("project", "South Sound 1850 (sailaway)");
    const report = [
      `Note: ${feedbackNote.value.trim() || "(none)"}`,
      `State: loc=${state.location} | day=${state.day}(${state.season}) | step=${state.step} | tide=${state.tide} | wind=${state.wind} | vessel=${state.vesselId} | hull=${state.hull} | water=${state.water}`,
      `Inventory: ${state.inventory.map((i) => i.name).join(", ") || "none"}`,
      "--- TRANSCRIPT ---",
      transcript.join("\n")
    ].join("\n");
    data.append("message", report);
    try {
      const res = await fetch(FORMSPREE_URL, { method: "POST", body: data, headers: { Accept: "application/json" } });
      if (res.ok) {
        print("Session log sent. Thank you.", "note");
        feedbackNote.value = "";
        feedbackUI.classList.add("hidden");
      } else print("Could not send log.", "note");
    } catch (_) { print("Network error sending log.", "note"); }
    finally {
      feedbackSubmit.disabled = false;
      feedbackSubmit.textContent = "Send";
      inputEl.focus();
    }
  });

  document.addEventListener("click", (e) => {
    if (!e.target.closest("#feedback-ui") && !e.target.closest("#send-log-btn")) inputEl.focus();
  });

  state = createState();
  print("SOUTH SOUND 1850 — OLYMPIA TO NEW ARCHANGEL (SITKA)", "title");
  print("Type 'help' for commands, or 'restore' to resume.", "note");
  describeLocation();
})();
