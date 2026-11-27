// game.js — South Sound (1850, Oregon Territory) main engine
(() => {
  const SAVE_KEY = "south_sound_1850_save_v1";
  const LOST_KEY = "south_sound_1850_lost_v1";
  const FORMSPREE_URL = "https://formspree.io/f/mqadvwvo";

  const TIDES = ["slack", "flood", "ebb"];
  const WINDS = ["calm", "breeze", "strong", "gale"];
  const SKIES = ["clear", "overcast", "fog", "rain"];
  const TURNS_PER_TIDE = 3;
  const TURNS_PER_WEATHER = 10;
  const OVERNIGHT_STEPS = 6;
  const FULL_DIR = { n: "north", s: "south", e: "east", w: "west", ne: "northeast", nw: "northwest", se: "southeast", sw: "southwest" };

  // Merge all regional world files into one lookup map
  const LOCATIONS = Object.assign(
    {},
    window.WORLD_REGIONS?.south || {},
    window.WORLD_REGIONS?.central || {},
    window.WORLD_REGIONS?.north || {},
    window.WORLD_REGIONS?.hood || {},
    window.WORLD_REGIONS?.strait || {}
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

  function clone(obj) { return JSON.parse(JSON.stringify(obj)); }

  function createState() {
    const roomObjects = {};
    Object.keys(LOCATIONS).forEach((id) => { roomObjects[id] = []; });
    const inventory = [];

    // Populate items from ITEMS_DB
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

    // Attach extra shared props referenced in location.objects (e.g. fresh_spring, clam_bed, oyster_bed)
    Object.values(LOCATIONS).forEach((loc) => {
      (loc.objects || []).forEach((objId) => {
        if (byId[objId] && !roomObjects[loc.id].some((o) => o.id === objId)) {
          roomObjects[loc.id].push(clone(byId[objId]));
        }
      });
    });

    return {
      location: "olympia_landing",
      day: 1,
      step: 0,
      tide: "slack",
      wind: "calm",
      sky: "overcast",
      tideUncertainty: Math.random() < 0.5 ? 0 : 1,
      aboard: true,
      tied: true,
      anchored: false,
      reefed: false,
      lashed: false,
      hull: 100,
      water: 100,
      fatigue: 0,
      sick: false,
      swampedTurns: 0,
      pendingRisk: null,   // { dir, steps, to, risk } when awaiting "push on" / repeat
      capsizeState: null,  // { locId } during capsize sequence
      endingChoice: null,  // "cape_flattery" | "haro_strait"
      dead: false,
      ended: false,
      fishSeq: 0,
      inventory,
      roomObjects,
      visited: ["olympia_landing"],
      currentKnown: {},    // { locId: true } after examining water or kelp
      customNames: {},
      log: ["Day 1, 1850. Oregon Territory. Put afloat at Olympia Landing on Budd Inlet in a small sloop-rigged skiff."]
    };
  }

  const curLoc = () => LOCATIONS[state.location];
  const hasItem = (id) => state.inventory.some((i) => i.id === id);

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
    state.log.push(`Day ${state.day}. ${entry}`);
  }

  // --- EARNED INSTRUMENT HUD ---
  function renderCompassSVG(exits) {
    const dirs = Object.keys(exits || {});
    const pts = {
      n: [17, 4], ne: [26, 8], e: [30, 17], se: [26, 26],
      s: [17, 30], sw: [8, 26], w: [4, 17], nw: [8, 8]
    };
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

  // --- TIME & ENVIRONMENT (only advances on movement, fish, wait, row/sail) ---
  function advanceTime(steps = 1) {
    const oldStep = state.step;
    const oldTide = state.tide;
    const oldWind = state.wind;

    state.step += steps;
    state.day = 1 + Math.floor(state.step / 12);
    state.tide = TIDES[Math.floor(state.step / TURNS_PER_TIDE) % TIDES.length];

    // Weather shifts less often than tide
    if (Math.floor(state.step / TURNS_PER_WEATHER) > Math.floor(oldStep / TURNS_PER_WEATHER)) {
      const r = Math.random();
      state.wind = r < 0.32 ? "calm" : r < 0.72 ? "breeze" : r < 0.92 ? "strong" : "gale";
      state.sky = SKIES[Math.floor(Math.random() * SKIES.length)];
    }

    // Gradual water and fatigue
    state.water = Math.max(0, state.water - steps * 2);
    state.fatigue = Math.min(100, state.fatigue + steps * (state.sick ? 6 : 2));

    // Baited crab pots left overnight yield crab
    Object.values(state.roomObjects).forEach((list) => {
      list.forEach((obj) => {
        if (obj.isCrabPot && obj.baited && obj.setStep !== null && state.step - obj.setStep >= OVERNIGHT_STEPS) {
          obj.baited = false;
          obj.setStep = null;
          obj.contents = obj.contents || [];
          state.fishSeq++;
          obj.contents.push({ ...clone(window.CRAB_TEMPLATE), id: `crab_${state.fishSeq}` });
        }
      });
    });

    if (state.tide !== oldTide) print(`The tide turns to ${state.tide}.`, "note");
    if (state.wind !== oldWind) print(`Wind shifts: ${state.wind}, sky ${state.sky}.`, "note");

    if (state.water <= 15 && state.water > 0) print("Your water keg sounds nearly hollow. Find fresh water soon.", "warn");
    if (state.water <= 0) {
      triggerDeath("The water keg ran dry days ago. Thirst and salt wind finished the voyage.");
    }
    updateHUD();
  }

  function triggerDeath(reason) {
    state.dead = true;
    state.ended = true;
    addLog(`${reason} The skiff was not seen again.`);
    try {
      localStorage.removeItem(SAVE_KEY);
      const lost = JSON.parse(localStorage.getItem(LOST_KEY) || "[]");
      lost.push({ date: new Date().toISOString().slice(0, 10), location: curLoc().name, log: state.log });
      localStorage.setItem(LOST_KEY, JSON.stringify(lost));
    } catch (_) {}
    print(reason, "warn");
    print("The voyage is lost. Log filed under 'lost voyages'. Type 'new voyage' to begin again.", "note");
  }

  // --- OBJECT & SCENERY MATCHING ---
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
    print(`${loc.name}${given ? ` ("${given}")` : ""} — ${loc.region}`, "title");

    const parts = [loc.description];
    if (loc.tide_variants?.[state.tide]) parts.push(loc.tide_variants[state.tide]);
    parts.push(`Wind: ${state.wind}. Sky: ${state.sky}.`);
    print(parts.join(" "));

    const status = [];
    if (!state.aboard) status.push("You are ashore.");
    if (state.tied) status.push("Skiff tied fast.");
    if (state.anchored) status.push("Anchor down.");
    if (state.reefed) status.push("Lugsail reefed.");
    if (state.swampedTurns > 0) status.push("Bilge flooded — bail before sailing.");
    if (status.length) print(status.join(" "), "note");

    const objs = (state.roomObjects[loc.id] || []).filter((o) => o.takeable || o.openable || o.gatherable || o.isWaterSource || o.id === "hbc_clerk" || o.id === "trading_post_notice");
    if (objs.length) {
      print(`Here: ${objs.map((o) => o.name + (o.openable ? (o.open ? " (open)" : " (closed)") : "")).join(", ")}.`);
    }
    const exits = Object.keys(loc.exits || {}).map((d) => FULL_DIR[d] || d);
    print(`Water open: ${exits.join(", ") || "none"}.`, "note");

    if (loc.ending && !state.endingChoice) {
      state.endingChoice = loc.ending;
      if (loc.ending === "cape_flattery") {
        print("Beyond the cape lies the open Pacific. You can turn south down the coast, or north up the outside—or head back east into the Strait.", "warn");
      } else if (loc.ending === "haro_strait") {
        print("Across the disputed strait lies Fort Victoria (HBC), and north beyond Vancouver Island the route toward Russian America and Sitka. Type 'south'/'west' for Victoria, 'north' for Sitka, or 'east' to return.", "warn");
      }
    }
    updateHUD();
  }

  // --- MOVEMENT & HAZARD GATE ---
  function attemptMove(dir, forced = false) {
    const loc = curLoc();

    // Soft endings at Cape Flattery / Haro Strait
    if (loc.ending === "cape_flattery" && (dir === "s" || dir === "n")) {
      const bound = dir === "s" ? "south down the outer coast" : "north up the outside";
      addLog(`Past Cape Flattery, turned the skiff ${bound} into the Pacific swell.`);
      print(`You set the lugsail and turn ${bound} into the long Pacific swell. The chart ends here. For now.`, "title");
      print("Type 'log' or 'download log' to keep your journal, or keep sailing.", "note");
      return;
    }
    if (loc.ending === "haro_strait" && (dir === "w" || dir === "n" || dir === "s")) {
      const bound = dir === "n" ? "north past Vancouver Island toward Russian America and Sitka" : "west across Haro Strait toward Fort Victoria";
      addLog(`From Haro Strait, bore ${bound}.`);
      print(`You hold ${bound}. The chart ends here. For now.`, "title");
      print("Type 'log' or 'download log' to keep your journal, or keep sailing.", "note");
      return;
    }

    const ex = (loc.exits || {})[dir];
    if (!ex) return print(`Land or shoals block the way ${FULL_DIR[dir] || dir}.`);
    if (!state.aboard) return print("You are ashore. Board the skiff first.");
    if (state.tied) return print("Your skiff is still tied fast. Cast off first.");
    if (state.anchored) return print("Anchor is down. Weigh anchor first.");
    if (state.swampedTurns > 0) return print("The skiff is half-full of water. Bail first.");

    if (ex.requiresTide && state.tide !== ex.requiresTide) {
      return print(ex.blockedText || `The ${state.tide} tide blocks passage.`);
    }

    const dest = LOCATIONS[ex.to];
    const risk = Hazards.evaluateLeg(state, loc, dest, hasItem("lead_line"));

    // Warn-first: refuse risky leg until player confirms with "push on" or repeats the same direction
    if (risk.warn && !forced) {
      const isRepeat = state.pendingRisk && state.pendingRisk.dir === dir && state.pendingRisk.from === state.location;
      if (!isRepeat) {
        state.pendingRisk = { dir, from: state.location };
        return print(Hazards.buildWarning(state, dest, risk), "warn");
      }
    }
    state.pendingRisk = null;

    // Resolve risky leg outcomes
    const outcome = Hazards.resolveLeg(risk, state);
    state.location = dest.id;
    state.endingChoice = null;
    if (!state.visited.includes(dest.id)) {
      state.visited.push(dest.id);
      addLog(`Made ${dest.name}.`);
    }
    advanceTime(ex.steps || 1);
    if (state.dead) return;

    if (outcome.type === "capsize") {
      state.capsizeState = { locId: dest.id };
      print(`A steep cross-sea catches the skiff off ${dest.name} and rolls her over. Cold Sound water closes around your chest. There is no life jacket.`, "warn");
      print("What do you do? (cling to boat / swim ashore / right the boat / call out)", "note");
      return;
    }
    if (outcome.type === "swamp") {
      state.swampedTurns = outcome.turns;
      state.hull = Math.max(10, state.hull - 8);
      addLog(`Shipped heavy water crossing to ${dest.name}.`);
      print("Green water breaks over the bow, soaking your stores and flooding the bilge. Bail the skiff before moving on.", "warn");
    } else if (outcome.type === "scare") {
      state.hull = Math.max(10, state.hull - outcome.damage);
      let msg = `Rough crossing—a plank strains in the chop (hull ${state.hull}%).`;
      if (outcome.loseGear) {
        const idx = state.inventory.findIndex((i) => i.id === "bailer" || i.id === "tin_cup" || i.id === "spare_line");
        if (idx !== -1) {
          const lost = state.inventory.splice(idx, 1)[0];
          msg += ` Your unlashed ${lost.name} washes over the side.`;
        }
      }
      addLog(msg);
      print(msg, "warn");
    }

    describeLocation();
  }

  // --- COMMAND HANDLER ---
  function handleCommand(raw) {
    if (state.dead) {
      if (raw.trim().toLowerCase() === "new voyage") {
        state = createState();
        print("A new voyage begins.", "title");
        return describeLocation();
      }
      if (raw.trim().toLowerCase() === "lost voyages") return showLostVoyages();
      return print("This voyage has ended. Type 'new voyage' or 'lost voyages'.");
    }

    const cmd = Parser.parse(raw);
    if (!cmd) return;
    const { verb, noun1, prep, noun2, rawRest } = cmd;

    // Active capsize sequence
    if (state.capsizeState) {
      if (verb !== "capsize_choice") {
        return print("You are in cold water beside the overturned skiff. Choose: cling to boat, swim ashore, right the boat, or call out.", "warn");
      }
      const res = Hazards.resolveCapsizeChoice(noun1, curLoc(), state);
      state.capsizeState = null;
      if (!res.survived) return triggerDeath(res.text);
      state.hull = Math.max(15, state.hull - (res.hullLoss || 15));
      if (res.swamped) state.swampedTurns = res.swamped;
      addLog(`Survived a capsize off ${curLoc().name}.`);
      print(res.text, "warn");
      return describeLocation();
    }

    // Clear pending risk warning unless pushing on or repeating go
    if (verb !== "push_on" && verb !== "go" && verb !== "sail" && verb !== "row") {
      state.pendingRisk = null;
    }

    switch (verb) {
      case "push_on":
        if (!state.pendingRisk || state.pendingRisk.from !== state.location) return print("Push on where? Give a compass direction.");
        return attemptMove(state.pendingRisk.dir, true);

      case "go": case "sail": case "row": {
        const d = Parser.DIR_MAP[noun1];
        if (!d) return print("Which direction? Try north, south, east, west, ne, nw, se, sw.");
        return attemptMove(d, false);
      }

      case "look": case "l":
        return describeLocation();

      case "look_dir": {
        const d = Parser.DIR_MAP[noun1];
        const ex = (curLoc().exits || {})[d];
        if (!ex) return print(`Shoreline or shoals lie ${FULL_DIR[d] || d}.`);
        const spy = hasItem("spyglass") ? ` Through the spyglass: ${LOCATIONS[ex.to].name} (${ex.steps || 1} step${(ex.steps || 1) > 1 ? "s" : ""}).` : "";
        return print(`${ex.look || `${LOCATIONS[ex.to].name} lies ${FULL_DIR[d]}.`}${spy}`);
      }

      case "look_in": {
        if (!noun1) return print("Look in what?");
        const hit = findObject(noun1);
        if (!hit) return print(`No "${noun1}" here.`);
        if (!hit.obj.openable) return print(`You can't look inside the ${hit.obj.name}.`);
        if (!hit.obj.open) return print(`The ${hit.obj.name} is closed.`);
        return print(hit.obj.contents?.length ? `Inside ${hit.obj.name}: ${hit.obj.contents.map((c) => c.name).join(", ")}.` : `The ${hit.obj.name} is empty.`);
      }

      case "examine": case "x": case "inspect": case "check": case "explore": {
        if (!noun1) return print("Examine what?");
        if (noun1 === "boat" || noun1 === "skiff" || noun1 === "hull") {
          return print(`Small sloop-rigged skiff with oars and lugsail. Hull: ${state.hull}%. Load: ${Hazards.totalWeight(state.inventory).toFixed(1)} lb. Water: ${state.water}%.`);
        }
        // Examining water or kelp in a tidal location unlocks current arrow on HUD
        if ((noun1.includes("water") || noun1.includes("kelp") || noun1.includes("current")) && curLoc().hazard?.tidal) {
          state.currentKnown[state.location] = true;
          updateHUD();
        }
        const hit = findObject(noun1);
        if (hit) {
          let desc = hit.obj.description;
          if (hit.obj.openable) desc += hit.obj.open ? (hit.obj.contents?.length ? ` Inside: ${hit.obj.contents.map((c) => c.name).join(", ")}.` : " Open and empty.") : " Closed.";
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
        if (!hit.obj.takeable) return print(`You cannot take the ${hit.obj.name}.`);
        hit.list.splice(hit.index, 1);
        if (hit.obj.isCrabPot) hit.obj.setStep = null;
        state.inventory.push(hit.obj);
        updateHUD();
        return print(`Taken: ${hit.obj.name}.`);
      }

      case "drop": case "leave": {
        if (!noun1) return print("Drop what?");
        const hit = findObject(noun1, "inv");
        if (!hit) return print(`You aren't carrying "${noun1}".`);
        hit.list.splice(hit.index, 1);
        state.roomObjects[state.location].push(hit.obj);
        if (hit.obj.isCrabPot && hit.obj.baited) {
          hit.obj.setStep = state.step;
          return print("Lowered the baited crab pot. Leave it overnight.");
        }
        updateHUD();
        return print(`Dropped: ${hit.obj.name}.`);
      }

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
          return print(`Baited the crab pot with ${itemHit.obj.name}.`);
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

      case "give": {
        if (!noun1) return print("Give what to whom?");
        const itemHit = findObject(noun1, "inv");
        if (!itemHit) return print(`You aren't carrying "${noun1}".`);
        const clerk = findObject(noun2 || "clerk", "room");
        if (clerk && clerk.obj.id === "hbc_clerk") {
          if (itemHit.obj.id === "hbc_blankets" || itemHit.obj.id === "tobacco") {
            itemHit.list.splice(itemHit.index, 1);
            state.hull = 100;
            state.water = 100;
            addLog(`Traded ${itemHit.obj.name} at Fort Nisqually for hull caulking and fresh water.`);
            return print("The Company clerk accepts the trade. Men caulk your hull and top off your water keg.");
          }
          return print("The clerk shakes his head. 'Bring Hudson's Bay blankets or tobacco if you want trade.'");
        }
        return print("No one here to trade with.");
      }

      case "open": {
        if (!noun1) return print("Open what?");
        const hit = findObject(noun1);
        if (!hit) return print(`No "${noun1}" here.`);
        if (!hit.obj.openable) return print(`The ${hit.obj.name} doesn't open.`);
        if (hit.obj.locked) {
          if (!hasItem(hit.obj.keyId)) return print(`The ${hit.obj.name} is locked.`);
          hit.obj.locked = false;
          print(`You unlock the ${hit.obj.name} with the brass key.`);
        }
        if (hit.obj.open) return print("Already open.");
        hit.obj.open = true;
        const inside = hit.obj.contents?.length ? ` Inside: ${hit.obj.contents.map((c) => c.name).join(", ")}.` : " Empty.";
        return print(`Opened ${hit.obj.name}.${inside}`);
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
        if (!hit) return print(`You don't have "${noun1}" here.`);
        if (hit.obj.id === "tide_notes") {
          const cycle = TIDES.length * TURNS_PER_TIDE;
          const pos = state.step % cycle;
          if (state.tide === "slack") return print(`Tide notes: Slack water now; flood in about ${Math.max(1, TURNS_PER_TIDE - pos)} turn(s).`);
          return print(`Tide notes: ${state.tide} running; next slack in roughly ${Math.max(1, cycle - pos + (state.tideUncertainty ? -1 : 0))} turn(s).`);
        }
        if (hit.obj.id === "wilkes_chart") return showChart();
        if (hit.obj.id === "logbook") return showLog();
        return print(hit.obj.readable || `Nothing written on the ${hit.obj.name}.`);
      }

      case "use": {
        if (!noun1) return print("Use what?");
        const hit = findObject(noun1);
        if (!hit) return print(`You don't have "${noun1}".`);
        if (hit.obj.id === "brass_compass") {
          const exits = Object.keys(curLoc().exits || {}).map((d) => FULL_DIR[d]).join(", ") || "none";
          return print(`Brass compass: Needle holds north. Open water: ${exits}.`);
        }
        if (hit.obj.id === "lead_line") {
          const depth = curLoc().hazard?.shoals ? (state.tide === "ebb" ? "Half a fathom—mud and gravel." : "Two fathoms over silt.") : "Deep water—no bottom at ten fathoms.";
          return print(`You heave the lead: ${depth}`);
        }
        if (hit.obj.id === "hand_line") return doFish();
        if (hit.obj.id === "bailer" || hit.obj.id === "bucket") return doBail();
        if (hit.obj.id === "water_keg") return doDrinkOrFill();
        if (hit.obj.id === "medicine_chest") {
          if (!state.sick) return print("You feel well enough; save the medicine.");
          state.sick = false;
          state.fatigue = Math.max(0, state.fatigue - 25);
          return print("You dose yourself from the medicine chest and rest. The sickness eases.");
        }
        if (hit.obj.id === "cedar_driftwood") {
          if (state.hull >= 100) return print("The hull is already sound.");
          hit.list.splice(hit.index, 1);
          state.hull = Math.min(100, state.hull + 20);
          return print(`You split and wedge the cedar to patch a seam (hull ${state.hull}%).`);
        }
        if (hit.obj.id === "wilkes_chart") return showChart();
        if (hit.obj.id === "tide_notes") return handleCommand("read tide notes");
        return print(`Not sure how to use the ${hit.obj.name} right now.`);
      }

      case "eat": {
        if (!noun1) return print("Eat what?");
        const hit = findObject(noun1, "inv");
        if (!hit) return print(`You aren't carrying "${noun1}".`);
        if (!hit.obj.edible) return print(`You can't eat the ${hit.obj.name}.`);
        hit.list.splice(hit.index, 1);
        if (hit.obj.isShellfish && Math.random() < window.HAZARD_CONFIG.SHELLFISH_POISON_CHANCE) {
          state.sick = true;
          state.fatigue = Math.min(100, state.fatigue + 30);
          addLog("Fell ill after eating shellfish.");
          return print("Your lips tingle and your stomach turns—shellfish sickness. Rest or use a medicine chest.", "warn");
        }
        state.fatigue = Math.max(0, state.fatigue - (hit.obj.foodValue || 15));
        return print(`You eat the ${hit.obj.name}. Strength returns.`);
      }

      case "drink":
        return doDrinkOrFill();

      case "gather": {
        const source = (state.roomObjects[state.location] || []).find((o) => o.gatherable);
        if (!source) return print("Nothing here to gather.");
        if (state.tide !== "ebb") return print("The flats are covered by high water; wait for ebb tide.");
        state.fishSeq++;
        const item = { ...clone(source.gatherable), id: `${source.gatherable.id}_${state.fishSeq}` };
        state.inventory.push(item);
        return print(`You gather ${item.name} from the exposed flats.`);
      }

      case "fish":
        return doFish();

      case "bail":
        return doBail();

      case "tie": case "moor":
        if (!findObject("cleat", "room") && !curLoc().hazard?.shelter) return print("Nothing to make fast to here. Drop anchor instead.");
        state.tied = true;
        state.anchored = false;
        return print("Made fast to the landing.");

      case "lash":
        if (!hasItem("spare_line") && !hasItem("tarpaulin")) return print("You need spare line or a tarpaulin to lash gear down.");
        state.lashed = true;
        return print("You lash the loose gear and cover stores under canvas.");

      case "untie":
        if (!state.tied) return print("The skiff isn't tied.");
        state.tied = false;
        return print("Cast off. The skiff floats clear.");

      case "board":
        state.aboard = true;
        return print("You step aboard the skiff.");

      case "anchor":
        if (state.tied) return print("Already tied fast.");
        if (!hasItem("anchor")) return print("You have no anchor aboard.");
        if (state.anchored) return print("Anchor is already down.");
        state.anchored = true;
        return print("Anchor splashes down and holds.");

      case "weigh":
        if (!state.anchored) return print("Anchor is already aboard.");
        state.anchored = false;
        return print("You haul the hemp rode and stow the anchor.");

      case "reef":
        if (state.reefed) return print("Lugsail is already reefed.");
        state.reefed = true;
        return print("You tie in a reef on the lugsail.");

      case "unreef":
        if (!state.reefed) return print("Full sail is already set.");
        state.reefed = false;
        return print("You shake out the reef.");

      case "wait": case "z":
        if (state.anchored || state.tied) state.fatigue = Math.max(0, state.fatigue - 8);
        print("You wait and watch the water.");
        return advanceTime(1);

      case "wait_slack": {
        if (state.tide === "slack") return print("The tide is already slack.");
        const cycle = TIDES.length * TURNS_PER_TIDE;
        const steps = cycle - (state.step % cycle);
        if (state.anchored || state.tied) state.fatigue = Math.max(0, state.fatigue - steps * 4);
        print(`You hold position and wait ${steps} turn(s) for slack water.`);
        return advanceTime(steps);
      }

      case "inventory": case "i": case "inv":
        return print(state.inventory.length
          ? `Aboard (${Hazards.totalWeight(state.inventory).toFixed(1)} lb): ${state.inventory.map((o) => o.name).join(", ")}.`
          : "Nothing carried.");

      case "name":
        if (!rawRest) return print("Name this place what? Example: name Ada's Cove");
        state.customNames[state.location] = rawRest;
        addLog(`Named ${curLoc().name} "${rawRest}".`);
        return print(`Penciled "${rawRest}" onto your chart beside ${curLoc().name}.`);

      case "chart":
        return showChart();

      case "log":
        return showLog();

      case "download_log": {
        const text = `SOUTH SOUND — 1850 VOYAGE LOG\n\n${state.log.join("\n")}\n`;
        const a = document.createElement("a");
        a.href = URL.createObjectURL(new Blob([text], { type: "text/plain" }));
        a.download = "south-sound-1850-log.txt";
        a.click();
        URL.revokeObjectURL(a.href);
        return print("Downloaded voyage log as text.");
      }

      case "lost_voyages":
        return showLostVoyages();

      case "save":
        try { localStorage.setItem(SAVE_KEY, JSON.stringify(state)); return print("Voyage saved."); }
        catch (_) { return print("Save failed."); }

      case "restore": case "load":
        try {
          const saved = JSON.parse(localStorage.getItem(SAVE_KEY));
          if (!saved || !LOCATIONS[saved.location]) return print("No saved voyage found.");
          state = saved;
          print("Voyage restored.", "note");
          return describeLocation();
        } catch (_) { return print("Restore failed."); }

      case "debug": {
        const loc = curLoc();
        const lines = Object.entries(loc.exits || {}).map(([d, ex]) => {
          const r = Hazards.evaluateLeg(state, loc, LOCATIONS[ex.to], hasItem("lead_line"));
          return `  ${d}->${ex.to}: risk=${r.score} (warn>=${HAZARD_CONFIG.WARN_THRESHOLD}) [${r.reasons.join(", ") || "none"}]`;
        });
        return print(`DEBUG step=${state.step} tide=${state.tide} wind=${state.wind} hull=${state.hull} water=${state.water} fatigue=${state.fatigue} wt=${Hazards.totalWeight(state.inventory).toFixed(1)}\n${lines.join("\n")}`, "note");
      }

      case "help": case "?":
        return print("Commands: look (l), look <dir>, look in <x>, examine (x), go/sail/row <dir>, take/drop/keep/put/give, eat, gather, open/close, read, use, tie/lash/untie, board, anchor, weigh/pull/raise anchor, reef sail, bail, fish, wait, wait for slack, name <x>, chart, log, download log, save, restore, debug.");

      default:
        return print(`I don't know "${verb}". Try: look, examine, go, take, use, wait, fish.`);
    }
  }

  function doFish() {
    if (!hasItem("hand_line")) return print("You need a hand line and hooks to fish.");
    advanceTime(1);
    if (state.dead) return;
    const bonus = hasItem("fish_gaff") ? 0.15 : 0;
    if (Math.random() > (state.tide === "slack" ? 0.45 : 0.62) + bonus) {
      return print("You drop the hand line and wait. Nothing bites.");
    }
    const pick = window.FISH_POOL[Math.floor(Math.random() * window.FISH_POOL.length)];
    state.fishSeq++;
    state.inventory.push({ ...clone(pick), id: `fish_${state.fishSeq}` });
    addLog(`Caught a ${pick.name} at ${curLoc().name}.`);
    return print(`A sharp tug. You haul in a ${pick.name}.`);
  }

  function doBail() {
    if (state.swampedTurns <= 0) return print("The bilge is dry enough.");
    const power = hasItem("bucket") ? 2 : hasItem("bailer") ? 1 : 0;
    if (!power) return print("You have no bailer or bucket—bailing by hand is slow.");
    state.swampedTurns = Math.max(0, state.swampedTurns - Math.max(1, power));
    return print(state.swampedTurns === 0 ? "The bilge is clear. You can sail again." : `You bail steadily (${state.swampedTurns} more turn(s) to clear).`);
  }

  function doDrinkOrFill() {
    if (!hasItem("water_keg")) return print("You have no water keg.");
    const spring = (state.roomObjects[state.location] || []).find((o) => o.isWaterSource);
    if (spring) {
      state.water = 100;
      return print("You fill the oak water keg with cold creek water.");
    }
    if (state.water <= 0) return print("The water keg is dry.");
    state.water = Math.max(0, state.water - 5);
    state.fatigue = Math.max(0, state.fatigue - 10);
    return print(`You drink from the keg (${state.water}% left).`);
  }

  function showChart() {
    if (!hasItem("wilkes_chart")) return print("You aren't carrying a chart.");
    const loc = curLoc();
    const exits = Object.entries(loc.exits || {}).map(([d, ex]) => `${FULL_DIR[d]} -> ${LOCATIONS[ex.to].name} (${ex.steps || 1})`).join("; ");
    const note = loc.region === "Strait of Juan de Fuca" || loc.region === "North Route"
      ? "Soundings grow sparse out here on the 1841 Wilkes sheet."
      : "1841 Wilkes survey notes soundings, points, and passages.";
    return print(`Wilkes Chart (${loc.region} — ${loc.name}): ${exits}. ${note}`);
  }

  function showLog() {
    print("Voyage Log:", "title");
    print(state.log.map((e) => `- ${e}`).join("\n"));
    print("Type 'download log' to save as a text file.", "note");
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
      `State: loc=${state.location} | day=${state.day} | step=${state.step} | tide=${state.tide} | wind=${state.wind} | hull=${state.hull} | water=${state.water}`,
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
  print("SOUTH SOUND — OREGON TERRITORY, 1850", "title");
  print("Type 'help' for commands, or 'restore' to resume.", "note");
  describeLocation();
})();
