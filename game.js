// South Sound — Zork-style text adventure engine (reads all locations from WORLD in world.js)
(() => {
  const SAVE_KEY = "south_sound_zork_v1";
  const TIDES = ["slack", "flood", "ebb"];
  const WEATHERS = ["calm", "wind", "fog"];
  const TURNS_PER_TIDE = 3;
  const FISH_POOL = [
    { name: "flounder", aliases: ["fish", "flounder"], description: "A flat, speckled starry flounder." },
    { name: "perch", aliases: ["fish", "perch"], description: "A silver-sided pile perch." },
    { name: "rockfish", aliases: ["fish", "rockfish"], description: "A small dark-backed rockfish." }
  ];

  const DIR_MAP = {
    n: "north", north: "north", s: "south", south: "south",
    e: "east", east: "east", w: "west", west: "west",
    u: "up", up: "up", d: "down", down: "down"
  };
  const FILLERS = new Set(["the", "a", "an", "my", "some", "at"]);
  const PREPS = new Set(["to", "on", "in", "into", "from", "with"]);

  const outEl = document.getElementById("output");
  const inputEl = document.getElementById("command");
  const sendLogBtn = document.getElementById("send-log-btn");
  const feedbackUI = document.getElementById("feedback-ui");
  const feedbackNote = document.getElementById("feedback-note");
  const feedbackSubmit = document.getElementById("feedback-submit");
  const feedbackCancel = document.getElementById("feedback-cancel");
  const FORMSPREE_URL = "https://formspree.io/f/mqadvwvo";

  let state = null;
  let cmdHistory = [];
  let histIndex = -1;
  let transcript = []; // Full raw record of player inputs and game responses

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

  function print(text, cls = "") {
    if (!text) return;
    transcript.push(text);
    const p = document.createElement("p");
    p.className = `line ${cls}`.trim();
    p.textContent = text;
    outEl.appendChild(p);
    outEl.scrollTop = outEl.scrollHeight;
  }

  // Format a copy/debug-ready session report for Formspree
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

  // Advance clock, cycle tide every TURNS_PER_TIDE turns, and occasionally shift weather
  function advanceTime(steps = 1) {
    const oldTide = currentTide();
    const oldWeather = state.weather;
    state.turn += steps;
    state.tideIndex = Math.floor(state.turn / TURNS_PER_TIDE) % TIDES.length;

    if (state.turn % 5 === 0) {
      state.weather = WEATHERS[(WEATHERS.indexOf(state.weather) + 1 + Math.floor(Math.random() * 2)) % WEATHERS.length];
    }
    if (currentTide() !== oldTide) print(`Tide turns: ${currentTide()}.`, "note");
    if (state.weather !== oldWeather) print(`Weather: ${state.weather}.`, "note");
  }

  function describeLocation() {
    const loc = currentLoc();
    const given = state.customNames[loc.id];
    print(given ? `${loc.name} ("${given}")` : loc.name, "title");

    const parts = [loc.description];
    if (loc.tideNotes && loc.tideNotes[currentTide()]) parts.push(loc.tideNotes[currentTide()]);
    parts.push(WORLD.weatherDescriptions[state.weather]);
    print(parts.join(" "));

    if (state.tied) print("Boat tied to dock.");
    if (state.anchored) print("Anchor down.");

    const visible = (state.roomObjects[loc.id] || []).filter((o) => o.takeable || o.openable);
    if (visible.length) {
      print(`Here: ${visible.map((o) => o.name + (o.openable ? (o.open ? " (open)" : " (closed)") : "")).join(", ")}.`);
    }
    const exits = Object.keys(loc.exits || {});
    print(`Exits: ${exits.join(", ") || "none"} | Tide: ${currentTide()} | ${state.weather}`, "note");
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

  function move(dir) {
    const exit = (currentLoc().exits || {})[dir];
    if (!exit) return print("No water that way.");
    if (state.tied) return print("Still tied to the dock.");
    if (state.anchored) return print("Anchor is down.");

    const targetId = typeof exit === "string" ? exit : exit.to;
    if (typeof exit === "object" && exit.requiresTide && currentTide() !== exit.requiresTide) {
      return print(exit.blockedText || `Blocked by the ${currentTide()} tide.`);
    }
    state.location = targetId;
    if (!state.visited.includes(targetId)) {
      state.visited.push(targetId);
      state.log.push(`Reached ${currentLoc().name}.`);
    }
    advanceTime(1);
    describeLocation();
  }

  function fish() {
    const hasLine = Boolean(findObject("line", "inv") || findObject("handline", "inv"));
    if (!hasLine) return print("You have no fishing line.");
    advanceTime(1);
    const chance = currentTide() === "slack" ? 0.45 : 0.65;
    if (Math.random() > chance) return print("You drop the line and wait. Nothing bites.");

    const pick = FISH_POOL[Math.floor(Math.random() * FISH_POOL.length)];
    state.fishCount = (state.fishCount || 0) + 1;
    state.inventory.push({
      id: `fish_${state.fishCount}`,
      name: pick.name,
      aliases: pick.aliases,
      description: pick.description,
      takeable: true
    });
    state.log.push(`Caught a ${pick.name} at ${currentLoc().name}.`);
    return print(`A sharp tug. You haul in a ${pick.name}.`);
  }

  function parse(raw) {
    const trimmed = raw.trim();
    const words = trimmed.toLowerCase().split(/\s+/).filter(Boolean);
    if (!words.length) return null;

    if (words[0] === "weigh" && words[1] === "anchor") return { verb: "weigh", noun1: "", prep: "", noun2: "", rawRest: "" };
    if (words[0] === "drop" && words[1] === "anchor") return { verb: "anchor", noun1: "", prep: "", noun2: "", rawRest: "" };
    if (words[0] === "cast" && words[1] === "off") return { verb: "untie", noun1: "boat", prep: "", noun2: "", rawRest: "" };
    if (words[0] === "pick" && words[1] === "up") words.splice(0, 2, "take");

    const verb = words[0];
    const rawRest = trimmed.slice(verb.length).trim();
    const rest = words.slice(1).filter((w) => !FILLERS.has(w));
    const prepIdx = rest.findIndex((w) => PREPS.has(w));

    if (prepIdx !== -1) {
      return { verb, noun1: rest.slice(0, prepIdx).join(" "), prep: rest[prepIdx], noun2: rest.slice(prepIdx + 1).join(" "), rawRest };
    }
    return { verb, noun1: rest.join(" "), prep: "", noun2: "", rawRest };
  }

  function handleCommand(raw) {
    const cmd = parse(raw);
    if (!cmd) return;
    const { verb, noun1, noun2, rawRest } = cmd;

    if (DIR_MAP[verb]) return move(DIR_MAP[verb]);

    switch (verb) {
      case "go": case "sail": case "walk": case "head": case "move": case "row":
        return DIR_MAP[noun1] ? move(DIR_MAP[noun1]) : print("Which way?");

      case "look": case "l":
        if (!noun1) return describeLocation();
      case "examine": case "x": case "inspect": case "check": {
        if (!noun1) return print("Examine what?");
        if (noun1 === "boat" || noun1 === "skiff") {
          return print(`Small wooden skiff. ${state.tied ? "Tied to dock." : state.anchored ? "At anchor." : "Under sail."}`);
        }
        const hit = findObject(noun1);
        if (!hit) return print("Not here.");
        let desc = hit.obj.description;
        if (hit.obj.openable) {
          desc += hit.obj.open
            ? (hit.obj.contents?.length ? ` Inside: ${hit.obj.contents.map((c) => c.name).join(", ")}.` : " Open, empty.")
            : " Closed.";
        }
        return print(desc);
      }

      case "take": case "get": case "grab": case "pull": case "haul": {
        if (!noun1) return print("Take what?");
        const hit = findObject(noun1, "room");
        if (!hit) return print("Not here.");
        if (!hit.obj.takeable) return print(`Can't take the ${hit.obj.name}.`);
        hit.list.splice(hit.index, 1);
        state.inventory.push(hit.obj);
        advanceTime(1);
        return print(`Taken: ${hit.obj.name}.`);
      }

      case "drop": case "leave": {
        if (!noun1) return print("Drop what?");
        const hit = findObject(noun1, "inv");
        if (!hit) return print("Not carrying that.");
        hit.list.splice(hit.index, 1);
        state.roomObjects[state.location].push(hit.obj);
        advanceTime(1);
        return print(`Dropped: ${hit.obj.name}.`);
      }

      case "inventory": case "i": case "inv":
        return print(state.inventory.length ? `Carrying: ${state.inventory.map((o) => o.name).join(", ")}.` : "Empty-handed.");

      case "open": {
        const hit = findObject(noun1);
        if (!hit) return print("Not here.");
        if (!hit.obj.openable) return print("Doesn't open.");
        if (hit.obj.open) return print("Already open.");
        hit.obj.open = true;
        advanceTime(1);
        const inside = hit.obj.contents?.length ? ` Inside: ${hit.obj.contents.map((c) => c.name).join(", ")}.` : " Empty.";
        return print(`Opened.${inside}`);
      }

      case "close": {
        const hit = findObject(noun1);
        if (!hit) return print("Not here.");
        if (!hit.obj.openable) return print("Doesn't close.");
        if (!hit.obj.open) return print("Already closed.");
        hit.obj.open = false;
        return print("Closed.");
      }

      case "read": {
        const hit = findObject(noun1);
        if (!hit) return print("Not here.");
        return print(hit.obj.readable || "Nothing to read.");
      }

      case "fish": case "cast":
        return fish();

      case "tie": case "moor": case "fasten": {
        if (!findObject(noun2 || "dock", "room")) return print("No dock here. Try anchor.");
        if (state.tied) return print("Already tied.");
        state.tied = true;
        state.anchored = false;
        advanceTime(1);
        return print("Tied to dock.");
      }

      case "untie": case "unmoor":
        if (!state.tied) return print("Not tied.");
        state.tied = false;
        advanceTime(1);
        return print("Line cast off.");

      case "anchor":
        if (state.tied) return print("Tied to dock.");
        if (state.anchored) return print("Already anchored.");
        state.anchored = true;
        advanceTime(1);
        return print("Anchor down.");

      case "weigh": case "unanchor":
        if (!state.anchored) return print("Anchor is already up.");
        state.anchored = false;
        advanceTime(1);
        return print("Anchor up.");

      case "wait": case "z":
        print("Time passes.");
        return advanceTime(1);

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
        return print("look (l), examine (x), n/s/e/w, sail <dir>, take/pull/drop, inventory (i), open/close, read, fish, tie/untie, anchor, weigh anchor, wait (z), name <name>, log, save, restore, quit.");

      case "quit": case "q":
        state.ended = true;
        inputEl.disabled = true;
        return print("Journal closed. Refresh to restart.");

      default:
        return print("Nothing happens.");
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
