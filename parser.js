// parser.js — VERB / VERB NOUN / VERB NOUN PREP NOUN, synonyms, plurals, typo tolerance, shortcuts
window.Parser = (() => {
  const DIR_MAP = {
    n: "n", north: "n", s: "s", south: "s", e: "e", east: "e", w: "w", west: "w",
    ne: "ne", northeast: "ne", nw: "nw", northwest: "nw", se: "se", southeast: "se", sw: "sw", southwest: "sw"
  };

  const SINGLE_TOKEN_SHORTCUTS = {
    i: { verb: "inventory", noun1: "" },
    l: { verb: "look", noun1: "" },
    z: { verb: "wait", noun1: "" },
    x: { verb: "examine", noun1: "" },
    n: { verb: "go", noun1: "n" },
    s: { verb: "go", noun1: "s" },
    e: { verb: "go", noun1: "e" },
    w: { verb: "go", noun1: "w" },
    ne: { verb: "go", noun1: "ne" },
    nw: { verb: "go", noun1: "nw" },
    se: { verb: "go", noun1: "se" },
    sw: { verb: "go", noun1: "sw" }
  };

  const KNOWN_VERBS = [
    "look", "examine", "go", "sail", "row", "take", "get", "grab", "drop", "leave", "keep",
    "eat", "drink", "open", "close", "read", "use", "put", "give", "trade", "offer", "hail",
    "wait", "tie", "lash", "moor", "untie", "anchor", "weigh", "reef", "unreef", "fish",
    "haul", "dig", "rake", "pick", "forage", "chop", "build", "camp", "repair", "dump",
    "stow", "land", "board", "bail", "name", "chart", "log", "save", "restore", "help", "debug", "quit",
    "north", "south", "east", "west", "northeast", "northwest", "southeast", "southwest"
  ];

  const PHRASE_REPLACEMENTS = [
    [/\brock\s+fish\b/g, "rockfish"],
    [/\btide\s+(?:booklet|book|table|notes)\b/g, "tide notes"],
    [/\bship'?s?\s+biscuits?\b/g, "biscuit"],
    [/\bsalt\s+pork\b/g, "salt pork"],
    [/\bwater\s+keg\b/g, "water keg"],
    [/\bhand\s+line\b/g, "hand line"],
    [/\bfishing\s+line\b/g, "hand line"],
    [/\blead\s+line\b/g, "lead line"],
    [/\bboat\s+hook\b/g, "boat hook"],
    [/\bfish\s+gaff\b/g, "fish gaff"],
    [/\bcrab\s+pot\b/g, "crab pot"],
    [/\bfrying\s+pan\b/g, "frying pan"],
    [/\btin\s+cup\b/g, "tin cup"],
    [/\bmedicine\s+chest\b/g, "medicine chest"],
    [/\bbrass\s+compass\b/g, "brass compass"],
    [/\bhudson'?s?\s+bay\s+blankets?\b/g, "blankets"],
    [/\bpowder\s+and\s+shot\b/g, "powder and shot"],
    [/\bpitch\s+and\s+oakum\b/g, "pitch and oakum"],
    [/\bwilkes\s+chart\b/g, "chart"],
    [/\btide\s+pools?\b/g, "tide pools"]
  ];

  const FILLERS = new Set(["the", "a", "an", "my", "some"]);
  const PREPS = new Set(["in", "into", "on", "onto", "to", "from", "with", "back", "at", "for"]);

  function levenshtein(a, b) {
    if (a === b) return 0;
    const m = a.length, n = b.length;
    if (Math.abs(m - n) > 1) return 2;
    const dp = Array.from({ length: m + 1 }, (_, i) => i);
    for (let j = 1; j <= n; j++) {
      let prev = dp[0];
      dp[0] = j;
      for (let i = 1; i <= m; i++) {
        const tmp = dp[i];
        dp[i] = a[i - 1] === b[j - 1] ? prev : 1 + Math.min(prev, dp[i], dp[i - 1]);
        prev = tmp;
      }
    }
    return dp[m];
  }

  function singularize(word) {
    if (!word || word.length <= 3) return word;
    if (["oars", "clams", "oysters", "blankets", "notes", "pools", "berries"].includes(word)) return word;
    if (word.endsWith("ies")) return word.slice(0, -3) + "y";
    if (word.endsWith("es") && /(ch|sh|x|s|z)es$/.test(word)) return word.slice(0, -2);
    if (word.endsWith("s") && !word.endsWith("ss")) return word.slice(0, -1);
    return word;
  }

  function normalizeText(str) {
    let s = str.toLowerCase().replace(/[?!.,]+$/g, "").trim();
    PHRASE_REPLACEMENTS.forEach(([re, rep]) => { s = s.replace(re, rep); });
    return s;
  }

  function parse(raw) {
    const trimmed = raw.trim();
    if (!trimmed) return null;
    const norm = normalizeText(trimmed);
    const rawWords = norm.split(/\s+/).filter(Boolean);

    // Long sentence check (skip for "name ...")
    if (rawWords.length > 7 && rawWords[0] !== "name") {
      return { verb: "too_long", noun1: "", prep: "", noun2: "", rawRest: "" };
    }

    // Single-token shortcuts (i, l, n, x, etc.) ONLY when input is a single token
    if (rawWords.length === 1 && SINGLE_TOKEN_SHORTCUTS[rawWords[0]]) {
      const sc = SINGLE_TOKEN_SHORTCUTS[rawWords[0]];
      return { verb: sc.verb, noun1: sc.noun1, prep: "", noun2: "", rawRest: sc.noun1 };
    }

    // Question phrases -> read tide notes
    if (/^(when is slack|when'?s slack|how many turns|when does (the )?tide|what (is the )?tide|next slack)/.test(norm)) {
      return { verb: "read", noun1: "tide notes", prep: "", noun2: "", rawRest: "tide notes" };
    }

    // Multi-word fixed commands
    if (norm === "push on" || norm === "go anyway" || norm === "sail anyway") return { verb: "push_on", noun1: "", prep: "", noun2: "", rawRest: "" };
    if (norm === "wait for slack" || norm === "wait slack") return { verb: "wait_slack", noun1: "", prep: "", noun2: "", rawRest: "" };
    if (norm === "go ashore" || norm === "go on shore" || norm === "go to shore") return { verb: "land", noun1: "", prep: "", noun2: "", rawRest: "" };
    if (/^(make|light|build)\s+(a\s+)?fire$/.test(norm)) return { verb: "make_fire", noun1: "fire", prep: "", noun2: "", rawRest: "" };
    if (/^(haul|pull|lift|raise)\s+(the\s+)?(crab\s+)?pot$/.test(norm)) return { verb: "haul_pot", noun1: "crab pot", prep: "", noun2: "", rawRest: "" };
    if (/^(weigh|pull|raise|lift)\s+(the\s+)?anchor$/.test(norm)) return { verb: "weigh", noun1: "anchor", prep: "", noun2: "", rawRest: "" };
    if (/^(drop|cast|let go)\s+(the\s+)?anchor$/.test(norm)) return { verb: "anchor", noun1: "anchor", prep: "", noun2: "", rawRest: "" };
    if (/^(reef|unreef)\s*(the\s+)?(sail|lugsail)?$/.test(norm)) return { verb: norm.startsWith("unreef") ? "unreef" : "reef", noun1: "sail", prep: "", noun2: "", rawRest: "" };
    if (/^(cast off|untie|unmoor|slip line)/.test(norm)) return { verb: "untie", noun1: "boat", prep: "", noun2: "", rawRest: "" };
    if (/^(make fast|tie down|lash down)/.test(norm)) return { verb: norm.startsWith("make fast") ? "tie" : "lash", noun1: "gear", prep: "", noun2: "", rawRest: "" };
    if (/^(board|step into|step in|get into|get in)\b/.test(norm)) return { verb: "board", noun1: "boat", prep: "", noun2: "", rawRest: "" };
    if (/^download\s+log$/.test(norm)) return { verb: "download_log", noun1: "", prep: "", noun2: "", rawRest: "" };
    if (/^lost\s+voyages?$/.test(norm)) return { verb: "lost_voyages", noun1: "", prep: "", noun2: "", rawRest: "" };
    if (/^(cling to boat|cling)$/.test(norm)) return { verb: "capsize_choice", noun1: "cling", prep: "", noun2: "", rawRest: "" };
    if (/^(swim ashore|swim)$/.test(norm)) return { verb: "capsize_choice", noun1: "swim", prep: "", noun2: "", rawRest: "" };
    if (/^(right the boat|right boat|right)$/.test(norm)) return { verb: "capsize_choice", noun1: "right", prep: "", noun2: "", rawRest: "" };
    if (/^(call out|shout|yell|call)$/.test(norm)) return { verb: "capsize_choice", noun1: "call", prep: "", noun2: "", rawRest: "" };

    // "go to X"
    if (/^go\s+to\s+/.test(norm)) {
      const target = norm.replace(/^go\s+to\s+/, "").replace(/^(the|a|an)\s+/, "");
      return { verb: "go_to", noun1: target, prep: "to", noun2: "", rawRest: target };
    }

    const words = [...rawWords];
    if (words[0] === "pick" && words[1] === "up") words.splice(0, 2, "take");

    let verb = words[0];
    const rawRest = trimmed.slice(trimmed.split(/\s+/)[0].length).trim();

    // Typo tolerance on verb (only for words length >= 3 not already known)
    if (verb.length >= 3 && !KNOWN_VERBS.includes(verb) && !DIR_MAP[verb]) {
      const matches = KNOWN_VERBS.filter((v) => levenshtein(verb, v) === 1);
      if (matches.length === 1) {
        verb = matches[0];
      } else if (matches.length > 1) {
        return { verb: "did_you_mean", noun1: matches[0], prep: "", noun2: "", rawRest: matches[0] };
      }
    }

    if (DIR_MAP[verb] && words.length === 1) {
      return { verb: "go", noun1: DIR_MAP[verb], prep: "", noun2: "", rawRest: DIR_MAP[verb] };
    }

    if (verb === "look" && (words[1] === "in" || words[1] === "inside")) {
      const target = words.slice(2).filter((w) => !FILLERS.has(w)).join(" ");
      return { verb: "look_in", noun1: target, prep: "in", noun2: "", rawRest };
    }
    if (verb === "look" && words[1] === "at") {
      const target = words.slice(2).filter((w) => !FILLERS.has(w)).join(" ");
      return { verb: "examine", noun1: target, prep: "", noun2: "", rawRest };
    }
    if (verb === "look" && words.length === 2 && DIR_MAP[words[1]]) {
      return { verb: "look_dir", noun1: DIR_MAP[words[1]], prep: "", noun2: "", rawRest };
    }

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

  return { DIR_MAP, parse, singularize, normalizeText };
})();
