// South Sound — Zork-style text adventure engine (data-driven from WORLD in world.js)
(() => {
  const SAVE_KEY = "south_sound_zork_v1";
  const FORMSPREE_URL = "https://formspree.io/f/mqadvwvo";
  const TIDES = ["slack", "flood", "ebb"];
  const WEATHERS = ["calm", "wind", "fog"];
  const TURNS_PER_TIDE = WORLD.turnsPerTide || 3;
  const TURNS_PER_WEATHER = WORLD.turnsPerWeather || 9;
  const OVERNIGHT_TURNS = WORLD.overnightTurns || 6;

  const DIR_MAP = {
    n: "north", north: "north", s: "south", south: "south",
    e: "east", east: "east", w: "west", west: "west",
    u: "up", up: "up", d: "down", down: "down"
  };
  const FILLERS = new Set(["the", "a", "an", "my", "some", "at"]);
  const PREPS = new Set(["to", "on", "in", "into", "from", "with", "back"]);

  const outEl = document.getElementById("output");
  const inputEl = document.getElementById("command");
  const sendLogBtn = document.getElementById("send-log-btn");
  const feedbackUI = document.getElementById("feedback-ui");
  const feedbackNote = document.getElementById("feedback-note");
  const feedbackSubmit = document.getElementById("feedback-submit");
  const feedbackCancel = document.getElementById("feedback-cancel");

  let state = null;
  let cmdHistory = [];
  let histIndex = -1;
  let transcript = [];

  function initWorldObjects() {
    const objs = {};
    Object.values(WORLD.locations).forEach((loc) => {
      objs[loc.id] = JSON.parse(JSON.stringify(loc.objects || []));
    });
    return objs;
  }

  function createState() {
    const start = WORLD.locations[WORLD.start];
    return {
      location: start.id,
      turn: 0,
      tideIndex: 0,
      weather: "calm",
      lastHeading: "none",
      anchored: false,
      tied: Boolean(WORLD.startTied),
      fishCount: 0,
      inventory: [],
      roomObjects: initWorldObjects(),
      visited: [start.id],
      customNames: {},
      log: [`Started at ${start.name}.`],
      ended: false
    };
  }

  const currentTide = () => TIDES[state.tideIndex];
  const currentLoc = () => WORLD.locations[state.location];
  const passableExits = (loc) => Object.entries(loc.exits || {}).filter(([, ex]) => !(typeof ex === "object" && ex.blocked));

  function print(text, cls = "") {
    if (!text) return;
    transcript.push(text);
    const p = document.createElement("p");
    p.className = `line ${cls}`.trim();
    p.textContent = text;
    outEl.appendChild(p);
    outEl.scrollTop = outEl.scrollHeight;
  }

  function buildDebugReport(note) {
    const inv = state.inventory.map((o) => o.name).join(", ") || "none";
    const header = [
      `Note: ${note || "(none)"}`,
      `State: loc=${state.location} | turn=${state.turn} | tide=${currentTide()} | weather=${state.weather} | tied=${state.tied} | anchored=${state.anchored}`,
      `Inventory: ${inv}`,
      `Time: ${new Date().toISOString()}`,
      "--- TRANSCRIPT ---"
    ].join("\n");
    return `${header}\n${transcript.join("\n")}`;
  }

  // Advance clock ONLY on movement, fish, wait, row/sail. Weather shifts less often than tide.
  function advanceTime(steps = 1) {
    const oldTurn = state.turn;
    const oldTide = currentTide();
    const oldWeather = state.weather;

    state.turn += steps;
    state.tideIndex = Math.floor(state.turn / TURNS_PER_TIDE) % TIDES.length;

    if (Math.floor(state.turn / TURNS_PER_WEATHER) > Math.floor(oldTurn / TURNS_PER_WEATHER)) {
      state.weather = WEATHERS[(WEATHERS.indexOf(state.weather) + 1 + Math.floor(Math.random() * 2)) % WEATHERS.length];
    }
    checkBaitedPots();
    if (currentTide() !== oldTide) print(`Tide turns: ${currentTide()}.`, "note");
    if (state.weather !== oldWeather) print(`Weather: ${state.weather}.`, "note");
  }

  // Any baited crab pot left set in a room overnight yields a fresh crab
  function checkBaitedPots() {
    Object.values(state.roomObjects).forEach((list) => {
      list.forEach((obj) => {
        if (obj.isCrabPot && obj.baited && obj.setTurn !== null && state.turn - obj.setTurn >= OVERNIGHT_TURNS) {
          obj.baited = false;
          obj.setTurn = null;
          obj.contents = obj.contents || [];
          state.fishCount = (state.fishCount || 0) + 1;
          obj.contents.push({ ...WORLD.crabTemplate, id: `crab_${state.fishCount}` });
        }
      });
    });
  }

  function describeLocation() {
    const loc = currentLoc();
    const given = state.customNames[loc.id];
    print(given ? `${loc.name} ("${given}")` : loc.name, "title");

    const parts = [loc.description];
    if (loc.tideNotes?.[currentTide()]) parts.push(loc.tideNotes[currentTide()]);
    parts.push(WORLD.weatherDescriptions[state.weather]);
    print(parts.join(" "));

    if (state.tied) print("Boat tied to dock.");
    if (state.anchored) print("Anchor down.");

    const visible = (state.roomObjects[loc.id] || []).filter((o) => o.takeable || o.openable);
    if (visible.length) {
      const label = (o) => {
        let s = o.name;
        if (o.isCrabPot && o.setTurn !== null) s += o.baited ? " (set, baited)" : " (set)";
        else if (o.openable) s += o.open ? " (open)" : " (closed)";
        return s;
      };
      print(`Here: ${visible.map(label).join(", ")}.`);
    }
    const exits = passableExits(loc).map(([dir]) => dir);
    print(`Exits: ${exits.join(", ") || "none"} | Tide: ${currentTide()} | ${state.weather}`, "note");
  }

  function findScenery(query) {
    const scenery = currentLoc().scenery || {};
    const q = query.toLowerCase();
    if (scenery[q]) return scenery[q];
    for (const [key, text] of Object.entries(scenery)) {
      if (key.includes(q) || q.includes(key)) return text;
    }
    return null;
  }

  function findObject(query, scope = "all") {
    if (!query) return null;
    const q = query.toLowerCase();
    const match = (o) => o.name.toLowerCase() === q || o.name.toLowerCase().includes(q) || (o.aliases || []).includes(q);

    const searchList = (list) => {
      for (let i = 0; i < list.length; i++) {
        const obj = list[i];
        if (match(obj)) return { obj, list, index: i };
        if (obj.openable && obj.open && obj.contents) {
          const hit = searchList(obj.contents);
          if (hit) return hit;
        }
      }
      return null;
    };

    if (scope === "inv" || scope === "all") {
      const hit = searchList(state.inventory);
      if (hit) return { ...hit, inInventory: true };
    }
    if (scope === "room" || scope === "all") {
      const hit = searchList(state.roomObjects[state.location] || []);
      if (hit) return { ...hit, inInventory: false };
    }
    return null;
  }

  function lookDirection(dir) {
    const ex = (currentLoc().exits || {})[dir];
    if (!ex) return print(`Nothing lies ${dir}.`);
    if (typeof ex === "object" && ex.blocked) return print(ex.blockedText);
    const targetId = typeof ex === "string" ? ex : ex.to;
    const dest = WORLD.locations[targetId];
    const cost = (typeof ex === "object" && ex.timeCost) || 1;
    const base = (typeof ex === "object" && ex.lookText) || `${dest.name} lies to the ${dir}.`;
    const tideNote = typeof ex === "object" && ex.requiresTide && currentTide() !== ex.requiresTide
      ? ` ${ex.blockedText}`
      : "";
    return print(`${base}${cost > 1 ? ` (${cost} tide-steps)` : ""}${tideNote}`);
  }

  function move(dir) {
    const ex = (currentLoc().exits || {})[dir];
    if (!ex) return print(`No passage ${dir}.`);
    if (typeof ex === "object" && ex.blocked) return print(ex.blockedText);
    if (state.tied) return print("Still tied to the dock.");
    if (state.anchored) return print("Anchor is down.");

    const targetId = typeof ex === "string" ? ex : ex.to;
    if (typeof ex === "object" && ex.requiresTide && currentTide() !== ex.requiresTide) {
      return print(ex.blockedText || `Blocked by the ${currentTide()} tide.`);
    }

    state.location = targetId;
    state.lastHeading = dir;
    if (!state.visited.includes(targetId)) {
      state.visited.push(targetId);
      state.log.push(`Reached ${currentLoc().name}.`);
    }
    advanceTime((typeof ex === "object" && ex.timeCost) || 1);
    describeLocation();
  }

  function readTideTable() {
    const cycle = TIDES.length * TURNS_PER_TIDE;
    const pos = state.turn % cycle;
    if (currentTide() === "slack") {
      return print(`Tide table: Slack water now. Flood in ${TURNS_PER_TIDE - pos} turn(s).`);
    }
    return print(`Tide table: Currently ${currentTide()}. Next slack in ${cycle - pos} turn(s).`);
  }

  function useCompass() {
    const dirs = passableExits(currentLoc()).map(([d]) => d).join(", ") || "none";
    return print(`Compass: Needle points north. Last heading: ${state.lastHeading}. Open water: ${dirs}.`);
  }

  function fish() {
    if (!findObject("line", "inv") && !findObject("handline", "inv")) {
      return print("You have no fishing line.");
    }
    advanceTime(1);
    const chance = currentTide() === "slack" ? 0.45 : 0.65;
    if (Math.random() > chance) return print("You drop the line and wait. Nothing bites.");

    const pool = WORLD.fishPool;
    const pick = pool[Math.floor(Math.random() * pool.length)];
    state.fishCount = (state.fishCount || 0) + 1;
    state.inventory.push({
      id: `fish_${state.fishCount}`,
      name: pick.name,
      aliases: pick.aliases,
      description: pick.description,
      takeable: true,
      isBait: true,
      releasable: true
    });
    state.log.push(`Caught a ${pick.name} at ${currentLoc().name}.`);
    return print(`A tug on the line. You haul in a ${pick.name}.`);
  }

  function baitPot(fishQuery) {
    const potHit = findObject("crab pot");
    if (!potHit) return print("No crab pot here.");
    const baitHit = fishQuery ? findObject(fishQuery, "inv") : state.inventory.find((o) => o.isBait) && findObject(state.inventory.find((o) => o.isBait).name, "inv");
    if (!baitHit) return print("You need a fish to use as bait.");
    if (!baitHit.obj.isBait) return print(`The ${baitHit.obj.name} won't work as bait.`);

    baitHit.list.splice(baitHit.index, 1);
    potHit.obj.baited = true;
    potHit.obj.open = false;
    return print(`You bait the crab pot with the ${baitHit.obj.name}.`);
  }

  function setPot() {
    const hit = findObject("crab pot");
    if (!hit) return print("No crab pot here.");
    if (hit.inInventory) {
      hit.list.splice(hit.index, 1);
      state.roomObjects[state.location].push(hit.obj);
    }
    hit.obj.open = false;
    hit.obj.setTurn = state.turn;
    return print(hit.obj.baited
      ? "You lower the baited crab pot into the water. Leave it overnight."
      : "You lower the empty crab pot. Bait it with a fish to catch crab.");
  }

  function parse(raw) {
    const trimmed = raw.trim();
    const words = trimmed.toLowerCase().split(/\s+/).filter(Boolean);
    if (!words.length) return null;

    // Multi-word verb forms
    if (["weigh", "pull", "lift", "raise"].includes(words[0]) && words[1] === "anchor") {
      return { verb: "weigh", noun1: "", prep: "", noun2: "", rawRest: "" };
    }
    if (words[0] === "drop" && words[1] === "anchor") return { verb: "anchor", noun1: "", prep: "", noun2: "", rawRest: "" };
    if (words[0] === "cast" && words[1] === "off") return { verb: "untie", noun1: "boat", prep: "", noun2: "", rawRest: "" };
    if (words[0] === "pick" && words[1] === "up") words.splice(0, 2, "take");

    const verb = words[0];
    const rawRest = trimmed.slice(verb.length).trim();
    const rest = words.slice(1).filter((w) => !FILLERS.has(w));
    const prepIdx = rest.findIndex((w) => PREPS.has(w));

    if (prepIdx !== -1) {
      return {
        verb,
        noun1: rest.slice(0, prepIdx).join(" "),
        prep: rest[prepIdx],
        noun2: rest.slice(prepIdx + 1).filter((w) => !PREPS.has(w)).join(" "),
        rawRest
      };
    }
    return { verb, noun1: rest.join(" "), prep: "", noun2: "", rawRest };
  }

  function examineTarget(noun) {
    if (!noun) return print("Examine what?");
    if (noun === "boat" || noun === "skiff") {
      return print(`Small wooden skiff. ${state.tied ? "Tied to dock." : state.anchored ? "At anchor." : "Under sail."}`);
    }
    const hit = findObject(noun);
    if (hit) {
      let desc = hit.obj.description;
      if (hit.obj.isCrabPot && hit.obj.baited) desc += " Baited.";
      if (hit.obj.openable) {
        desc += hit.obj.open
          ? (hit.obj.contents?.length ? ` Inside: ${hit.obj.contents.map((c) => c.name).join(", ")}.` : " Open, empty.")
          : " Closed.";
      }
      return print(desc);
    }
    const scenery = findScenery(noun);
    if (scenery) return print(scenery);
    return print(`You see no "${noun}" here.`);
  }

  function handleCommand(raw) {
    const cmd = parse(raw);
    if (!cmd) return;
    const { verb, noun1, prep, noun2, rawRest } = cmd;

    if (DIR_MAP[verb]) return move(DIR_MAP[verb]);

    switch (verb) {
      case "go": case "sail": case "walk": case "head": case "move": case "row":
        return DIR_MAP[noun1] ? move(DIR_MAP[noun1]) : print("Go which way? Try north, south, east, or west.");

      case "look": case "l":
        if (!noun1) return describeLocation();
        if (DIR_MAP[noun1]) return lookDirection(DIR_MAP[noun1]);
        return examineTarget(noun1);

      case "examine": case "x": case "inspect": case "check": case "explore":
        return noun1 ? examineTarget(noun1) : print(`${verb === "explore" ? "Explore" : "Examine"} what?`);

      case "take": case "get": case "grab": case "pull": case "lift": case "raise": case "haul": {
        if (!noun1) return print("Take what?");
        const hit = findObject(noun1, "room");
        if (!hit) return print(`No "${noun1}" here to take.`);
        if (!hit.obj.takeable) return print(`Can't take the ${hit.obj.name}.`);
        hit.list.splice(hit.index, 1);
        if (hit.obj.isCrabPot) hit.obj.setTurn = null;
        state.inventory.push(hit.obj);
        return print(`Taken: ${hit.obj.name}.`);
      }

      case "drop": case "leave": {
        if (!noun1) return print("Drop what?");
        const hit = findObject(noun1, "inv");
        if (!hit) return print(`You aren't carrying "${noun1}".`);
        hit.list.splice(hit.index, 1);
        state.roomObjects[state.location].push(hit.obj);
        if (hit.obj.isCrabPot && hit.obj.baited) {
          hit.obj.setTurn = state.turn;
          return print("You lower the baited crab pot into the water. Leave it overnight.");
        }
        return print(`Dropped: ${hit.obj.name}.`);
      }

      case "toss": case "throw": case "release": {
        if (!noun1) return print("Release or toss what?");
        const hit = findObject(noun1, "inv");
        if (!hit) return print(`You aren't carrying "${noun1}".`);
        hit.list.splice(hit.index, 1);
        if (hit.obj.releasable) {
          return print(`You release the ${hit.obj.name} back into the water.`);
        }
        state.roomObjects[state.location].push(hit.obj);
        return print(`You toss the ${hit.obj.name} aside.`);
      }

      case "put": {
        if (!noun1) return print("Put what where?");
        const itemHit = findObject(noun1, "inv");
        if (!itemHit) return print(`You aren't carrying "${noun1}".`);

        // "put <fish> in pot" baits the crab pot
        const targetHit = noun2 ? findObject(noun2) : (prep === "back" ? (state.roomObjects[state.location] || []).find((o) => o.openable && o.open) && { obj: (state.roomObjects[state.location] || []).find((o) => o.openable && o.open) } : null);
        if (targetHit?.obj.isCrabPot && itemHit.obj.isBait) return baitPot(itemHit.obj.name);
        if (targetHit?.obj.openable) {
          if (!targetHit.obj.open) return print(`The ${targetHit.obj.name} is closed.`);
          itemHit.list.splice(itemHit.index, 1);
          targetHit.obj.contents = targetHit.obj.contents || [];
          targetHit.obj.contents.push(itemHit.obj);
          return print(`Put ${itemHit.obj.name} in ${targetHit.obj.name}.`);
        }
        if (prep === "back") {
          itemHit.list.splice(itemHit.index, 1);
          state.roomObjects[state.location].push(itemHit.obj);
          return print(`Put ${itemHit.obj.name} back.`);
        }
        return print("Put it in what?");
      }

      case "bait":
        return baitPot(noun2 || (noun1 !== "pot" && noun1 !== "crab pot" ? noun1 : ""));

      case "set":
        if (!noun1 || noun1.includes("pot") || noun1.includes("trap")) return setPot();
        return print("Set what? Try: set crab pot.");

      case "inventory": case "i": case "inv":
        return print(state.inventory.length ? `Carrying: ${state.inventory.map((o) => o.name).join(", ")}.` : "Empty-handed.");

      case "open": {
        if (!noun1) return print("Open what?");
        const hit = findObject(noun1);
        if (!hit) return print(`No "${noun1}" here.`);
        if (!hit.obj.openable) return print(`The ${hit.obj.name} doesn't open.`);
        if (hit.obj.open) return print(`Already open.`);
        hit.obj.open = true;
        const inside = hit.obj.contents?.length ? ` Inside: ${hit.obj.contents.map((c) => c.name).join(", ")}.` : " Empty.";
        return print(`Opened.${inside}`);
      }

      case "close": {
        if (!noun1) return print("Close what?");
        const hit = findObject(noun1);
        if (!hit) return print(`No "${noun1}" here.`);
        if (!hit.obj.openable) return print(`The ${hit.obj.name} doesn't close.`);
        if (!hit.obj.open) return print("Already closed.");
        hit.obj.open = false;
        return print("Closed.");
      }

      case "read": {
        if (!noun1) return print("Read what?");
        const hit = findObject(noun1);
        if (!hit) return print(`No "${noun1}" here.`);
        if (hit.obj.id === "tide_table") return readTideTable();
        if (hit.obj.id === "compass") return useCompass();
        return print(hit.obj.readable || `Nothing written on the ${hit.obj.name}.`);
      }

      case "use": {
        if (!noun1) return print("Use what?");
        const hit = findObject(noun1);
        if (!hit) return print(`You don't have "${noun1}".`);
        if (hit.obj.id === "compass") return useCompass();
        if (hit.obj.id === "tide_table") return readTideTable();
        if (hit.obj.id === "handline") return fish();
        if (hit.obj.isBait) return baitPot(hit.obj.name);
        if (hit.obj.isCrabPot) return setPot();
        return print(`Not sure how to use the ${hit.obj.name}.`);
      }

      case "fish": case "cast":
        return fish();

      case "tie": case "moor": case "fasten": {
        if (!findObject(noun2 || "dock", "room")) return print("No dock here. Try anchor.");
        if (state.tied) return print("Already tied.");
        state.tied = true;
        state.anchored = false;
        return print("Tied to dock.");
      }

      case "untie": case "unmoor":
        if (!state.tied) return print("Not tied.");
        state.tied = false;
        return print("Line cast off.");

      case "anchor":
        if (state.tied) return print("Tied to dock.");
        if (state.anchored) return print("Already anchored.");
        state.anchored = true;
        return print("Anchor down.");

      case "weigh": case "unanchor":
        if (!state.anchored) return print("Anchor is already up.");
        state.anchored = false;
        return print("Anchor up.");

      case "wait": case "z":
        if (noun1 === "overnight" || noun1 === "night") {
          if (!state.anchored && !state.tied) return print("Anchor or tie up before waiting overnight.");
          print("You wait through the night.");
          return advanceTime(OVERNIGHT_TURNS);
        }
        print("Time passes.");
        return advanceTime(1);

      case "sleep": case "camp":
        if (!state.anchored && !state.tied) return print("Anchor or tie up before sleeping.");
        print("You sleep until morning.");
        return advanceTime(OVERNIGHT_TURNS);

      case "name":
        if (!rawRest) return print("Usage: name <place name>");
        state.customNames[currentLoc().id] = rawRest;
        state.log.push(`Named ${currentLoc().name} "${rawRest}".`);
        return print(`Charted as "${rawRest}".`);

      case "log": case "journal":
        print("Log:", "title");
        return print(state.log.map((e) => `- ${e}`).join("\n"));

      case "save":
        try { localStorage.setItem(SAVE_KEY, JSON.stringify(state)); return print("Saved."); }
        catch (_) { return print("Save failed."); }

      case "restore": case "load":
        try {
          const saved = JSON.parse(localStorage.getItem(SAVE_KEY));
          if (!saved || !WORLD.locations[saved.location]) return print("No save found.");
          state = saved;
          print("Restored.", "note");
          return describeLocation();
        } catch (_) { return print("Restore failed."); }

      case "help": case "?":
        return print("look (l), look <dir>, examine/explore <x>, n/s/e/w, sail/row <dir>, take/drop/put/release, open/close, read/use, fish, bait/set pot, tie/untie, anchor, weigh/raise anchor, wait (z) / sleep, name <name>, log, save, restore, quit.");

      case "quit": case "q":
        state.ended = true;
        inputEl.disabled = true;
        return print("Journal closed. Refresh to restart.");

      default:
        return print(`I don't know "${verb}". Try look, examine, go, take, fish.`);
    }
  }

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
    if (e.key !== "Enter" || state.ended) return;
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
    else if (!state.ended) inputEl.focus();
  });

  feedbackCancel.addEventListener("click", () => {
    feedbackUI.classList.add("hidden");
    feedbackNote.value = "";
    if (!state.ended) inputEl.focus();
  });

  feedbackUI.addEventListener("submit", async (e) => {
    e.preventDefault();
    feedbackSubmit.disabled = true;
    feedbackSubmit.textContent = "Sending...";
    const data = new FormData();
    data.append("project", "South Sound (sailaway)");
    data.append("message", buildDebugReport(feedbackNote.value.trim()));

    try {
      const res = await fetch(FORMSPREE_URL, {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" }
      });
      if (res.ok) {
        print("Session log sent. Thank you.", "note");
        feedbackNote.value = "";
        feedbackUI.classList.add("hidden");
      } else {
        print("Could not send log. Try again or email thecorcoran@gmail.com.", "note");
      }
    } catch (_) {
      print("Network error sending log.", "note");
    } finally {
      feedbackSubmit.disabled = false;
      feedbackSubmit.textContent = "Send";
      if (!state.ended) inputEl.focus();
    }
  });

  document.addEventListener("click", (e) => {
    if (!state.ended && !e.target.closest("#feedback-ui") && !e.target.closest("#send-log-btn")) {
      inputEl.focus();
    }
  });

  state = createState();
  print("SOUTH SOUND", "title");
  print("Type 'help' or 'restore'.", "note");
  describeLocation();
})();
