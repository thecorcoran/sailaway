// South Sound — Zork-style text adventure engine (reads all locations from WORLD in world.js)
(() => {
  const SAVE_KEY = "south_sound_zork_v1";
  const TIDES = ["slack", "flood", "ebb"];
  const WEATHERS = ["calm", "wind", "fog"];
  const TURNS_PER_TIDE = 3;

  // Direction and verb synonyms
  const DIR_MAP = {
    n: "north", north: "north", s: "south", south: "south",
    e: "east", east: "east", w: "west", west: "west",
    u: "up", up: "up", d: "down", down: "down"
  };
  const FILLERS = new Set(["the", "a", "an", "my", "some", "at"]);
  const PREPS = new Set(["to", "on", "in", "into", "from", "with"]);

  const outEl = document.getElementById("output");
  const inputEl = document.getElementById("command");

  let state = null;
  let cmdHistory = [];
  let histIndex = -1;

  // Deep-clone WORLD locations so taking/opening objects mutates state, not the template
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
      inventory: [],
      roomObjects: initWorldObjects(),
      visited: [start.id],
      customNames: {}, // { locationId: "Player's Name" }
      log: [`Started at ${start.name}.`],
      ended: false
    };
  }

  const currentTide = () => TIDES[state.tideIndex];
  const currentLoc = () => WORLD.locations[state.location];

  function print(text, cls = "") {
    if (!text) return;
    const p = document.createElement("p");
    p.className = `line ${cls}`.trim();
    p.textContent = text;
    outEl.appendChild(p);
    outEl.scrollTop = outEl.scrollHeight;
  }

  // Advance the turn clock, cycling tide every TURNS_PER_TIDE actions and occasionally shifting weather
  function advanceTime(steps = 1) {
    const oldTide = currentTide();
    const oldWeather = state.weather;
    state.turn += steps;
    state.tideIndex = Math.floor(state.turn / TURNS_PER_TIDE) % TIDES.length;

    if (state.turn % 5 === 0) {
      state.weather = WEATHERS[(WEATHERS.indexOf(state.weather) + 1 + Math.floor(Math.random() * 2)) % WEATHERS.length];
    }
    if (currentTide() !== oldTide) {
      print(`The tide turns to ${currentTide()}.`, "note");
    }
    if (state.weather !== oldWeather) {
      print(WORLD.weatherDescriptions[state.weather], "note");
    }
  }

  // Describe the current location, visible objects, exits, tide, and weather
  function describeLocation() {
    const loc = currentLoc();
    const given = state.customNames[loc.id];
    print(given ? `${loc.name} ("${given}")` : loc.name, "title");

    const parts = [loc.description];
    if (loc.tideNotes && loc.tideNotes[currentTide()]) parts.push(loc.tideNotes[currentTide()]);
    parts.push(WORLD.weatherDescriptions[state.weather]);
    print(parts.join(" "));

    if (state.tied) print("Your boat is tied to the dock.");
    if (state.anchored) print("Your anchor is down.");

    const visible = state.roomObjects[loc.id] || [];
    const notable = visible.filter((o) => o.takeable || o.openable);
    if (notable.length) {
      print(`You see: ${notable.map((o) => o.name + (o.openable ? (o.open ? " (open)" : " (closed)") : "")).join(", ")}.`);
    }
    const exits = Object.keys(loc.exits || {});
    print(`Exits: ${exits.length ? exits.join(", ") : "none"}. [Tide: ${currentTide()} | Weather: ${state.weather}]`, "note");
  }

  // Find an object by name or alias across inventory, room, and open containers
  function findObject(query, scope = "all") {
    if (!query) return null;
    const q = query.toLowerCase();
    const match = (o) => o.name.toLowerCase() === q || o.name.toLowerCase().includes(q) || (o.aliases || []).includes(q);

    const searchList = (list, container = null) => {
      for (let i = 0; i < list.length; i++) {
        const obj = list[i];
        if (match(obj)) return { obj, list, index: i, container };
        if (obj.openable && obj.open && obj.contents) {
          const found = searchList(obj.contents, obj);
          if (found) return found;
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
    const loc = currentLoc();
    const exit = (loc.exits || {})[dir];
    if (!exit) {
      print("There is no open water in that direction.");
      return;
    }
    if (state.tied) {
      print("Your boat is still tied to the dock. Untie it first.");
      return;
    }
    if (state.anchored) {
      print("Your anchor is down. Weigh anchor before sailing.");
      return;
    }
    const targetId = typeof exit === "string" ? exit : exit.to;
    if (typeof exit === "object" && exit.requiresTide && currentTide() !== exit.requiresTide) {
      print(exit.blockedText || `The ${currentTide()} tide blocks passage that way.`);
      return;
    }
    state.location = targetId;
    const dest = currentLoc();
    if (!state.visited.includes(targetId)) {
      state.visited.push(targetId);
      state.log.push(`Reached ${dest.name}.`);
    }
    advanceTime(1);
    describeLocation();
  }

  // Parse raw input into { verb, noun1, prep, noun2, rawRest }
  function parse(raw) {
    const trimmed = raw.trim();
    const words = trimmed.toLowerCase().split(/\s+/).filter(Boolean);
    if (!words.length) return null;

    // Handle multi-word verbs first
    if (words[0] === "weigh" && words[1] === "anchor") return { verb: "weigh", noun1: "", prep: "", noun2: "", rawRest: "" };
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
        noun2: rest.slice(prepIdx + 1).join(" "),
        rawRest
      };
    }
    return { verb, noun1: rest.join(" "), prep: "", noun2: "", rawRest };
  }

  function handleCommand(raw) {
    const cmd = parse(raw);
    if (!cmd) return;
    const { verb, noun1, noun2, rawRest } = cmd;

    // Bare direction (n, north, s, south, etc.)
    if (DIR_MAP[verb]) return move(DIR_MAP[verb]);

    switch (verb) {
      case "go": case "sail": case "walk": case "head": case "move": case "row":
        if (DIR_MAP[noun1]) return move(DIR_MAP[noun1]);
        return print("Which way? Try north, south, east, or west.");

      case "look": case "l":
        if (!noun1) return describeLocation();
        // Fall through to examine when given a noun ("look at locker")
      case "examine": case "x": case "inspect": case "check": {
        if (!noun1) return print("Examine what?");
        if (noun1 === "boat" || noun1 === "skiff" || noun1 === "hull") {
          return print(`A small wooden sailboat, scarred by salt and beaches. ${state.tied ? "Tied to the dock." : state.anchored ? "Riding at anchor." : "Adrift under ready sail."}`);
        }
        const hit = findObject(noun1);
        if (!hit) return print("You don't see that here.");
        let desc = hit.obj.description;
        if (hit.obj.openable) {
          desc += hit.obj.open
            ? (hit.obj.contents?.length ? ` Inside: ${hit.obj.contents.map((c) => c.name).join(", ")}.` : " It is open and empty.")
            : " It is closed.";
        }
        return print(desc);
      }

      case "take": case "get": case "grab": {
        if (!noun1) return print("Take what?");
        const hit = findObject(noun1, "room");
        if (!hit) return print("You don't see that here.");
        if (!hit.obj.takeable) return print(`You can't carry the ${hit.obj.name}.`);
        hit.list.splice(hit.index, 1);
        state.inventory.push(hit.obj);
        advanceTime(1);
        return print(`Taken: ${hit.obj.name}.`);
      }

      case "drop": case "leave": {
        if (!noun1) return print("Drop what?");
        const hit = findObject(noun1, "inv");
        if (!hit) return print("You aren't carrying that.");
        hit.list.splice(hit.index, 1);
        state.roomObjects[state.location].push(hit.obj);
        advanceTime(1);
        return print(`Dropped: ${hit.obj.name}.`);
      }

      case "inventory": case "i": case "inv":
        return print(state.inventory.length ? `You are carrying: ${state.inventory.map((o) => o.name).join(", ")}.` : "Your pockets and sea bag are empty.");

      case "open": {
        const hit = findObject(noun1);
        if (!hit) return print("You don't see that here.");
        if (!hit.obj.openable) return print(`The ${hit.obj.name} doesn't open.`);
        if (hit.obj.open) return print(`The ${hit.obj.name} is already open.`);
        hit.obj.open = true;
        advanceTime(1);
        const inside = hit.obj.contents?.length ? ` Inside you find: ${hit.obj.contents.map((c) => c.name).join(", ")}.` : " It is empty.";
        return print(`You open the ${hit.obj.name}.${inside}`);
      }

      case "close": {
        const hit = findObject(noun1);
        if (!hit) return print("You don't see that here.");
        if (!hit.obj.openable) return print(`The ${hit.obj.name} doesn't close.`);
        if (!hit.obj.open) return print(`The ${hit.obj.name} is already closed.`);
        hit.obj.open = false;
        return print(`You close the ${hit.obj.name}.`);
      }

      case "read": {
        const hit = findObject(noun1);
        if (!hit) return print("You don't see that here.");
        return print(hit.obj.readable || `There is nothing written on the ${hit.obj.name}.`);
      }

      case "tie": case "moor": case "fasten": {
        const hasDock = Boolean(findObject(noun2 || "dock", "room"));
        if (!hasDock) return print("There is no dock here to tie to. You can anchor instead.");
        if (state.tied) return print("The boat is already tied to the dock.");
        state.tied = true;
        state.anchored = false;
        advanceTime(1);
        return print("You make the bow line fast to the iron cleat on the dock.");
      }

      case "untie": case "unmoor": {
        if (!state.tied) return print("The boat isn't tied to anything.");
        state.tied = false;
        advanceTime(1);
        return print("You cast off the line from the dock. The boat drifts clear.");
      }

      case "anchor":
        if (state.tied) return print("You are already tied to the dock.");
        if (state.anchored) return print("Your anchor is already down.");
        state.anchored = true;
        advanceTime(1);
        return print("The anchor splashes down and bites into the gravel bottom.");

      case "weigh": case "unanchor":
        if (!state.anchored) return print("Your anchor is already aboard.");
        state.anchored = false;
        advanceTime(1);
        return print("You haul the wet anchor line aboard.");

      case "wait": case "z":
        print("You let time pass, watching the water and the shoreline.");
        return advanceTime(1);

      case "name": {
        if (!rawRest) return print("Name this place what? Example: name Ada's Cove");
        const loc = currentLoc();
        state.customNames[loc.id] = rawRest;
        state.log.push(`Named ${loc.name} "${rawRest}".`);
        return print(`You pencil "${rawRest}" onto your chart beside ${loc.name}.`);
      }

      case "log": case "journal":
        print("Voyage Log:", "title");
        return print(state.log.map((entry) => `- ${entry}`).join("\n"));

      case "save":
        try {
          localStorage.setItem(SAVE_KEY, JSON.stringify(state));
          return print("Voyage saved.");
        } catch (_) {
          return print("Could not save to browser storage.");
        }

      case "restore": case "load":
        try {
          const saved = JSON.parse(localStorage.getItem(SAVE_KEY));
          if (!saved || !WORLD.locations[saved.location]) return print("No saved voyage found.");
          state = saved;
          print("Voyage restored.", "note");
          return describeLocation();
        } catch (_) {
          return print("Could not read saved voyage.");
        }

      case "help": case "?":
        return print(
          "Commands: look (l), examine (x) <thing>, north/south/east/west (n/s/e/w), sail <dir>, " +
          "take/drop <thing>, inventory (i), open/close <thing>, read <thing>, tie boat to dock, untie boat, " +
          "anchor, weigh anchor, wait (z), name <place name>, log, save, restore, quit."
        );

      case "quit": case "q":
        state.ended = true;
        inputEl.disabled = true;
        return print("You coil the lines and close the journal. Refresh the page to begin again.");

      default:
        return print("The breeze answers with a slap of water against the hull. You aren't sure how to do that.");
    }
  }

  inputEl.addEventListener("keydown", (e) => {
    if (e.key === "ArrowUp") {
      if (cmdHistory.length && histIndex > 0) {
        histIndex--;
        inputEl.value = cmdHistory[histIndex];
      }
      e.preventDefault();
      return;
    }
    if (e.key === "ArrowDown") {
      if (histIndex < cmdHistory.length - 1) {
        histIndex++;
        inputEl.value = cmdHistory[histIndex];
      } else {
        histIndex = cmdHistory.length;
        inputEl.value = "";
      }
      e.preventDefault();
      return;
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

  // Keep focus on the command line when clicking anywhere in the terminal
  document.addEventListener("click", () => { if (!state.ended) inputEl.focus(); });

  // Start a new voyage
  state = createState();
  print("SOUTH SOUND — A Coastal Text Adventure", "title");
  print("Type 'help' for commands, or 'restore' to resume a saved voyage.", "note");
  describeLocation();
})();
