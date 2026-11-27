// parser.js — Command normalization, synonyms, plurals, question phrases, and 2-noun forms
window.Parser = (() => {
  const DIR_MAP = {
    n: "n", north: "n",
    s: "s", south: "s",
    e: "e", east: "e",
    w: "w", west: "w",
    ne: "ne", northeast: "ne",
    nw: "nw", northwest: "nw",
    se: "se", southeast: "se",
    sw: "sw", southwest: "sw"
  };

  // Multi-word phrase normalization (spacing & common aliases)
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
    [/\bwilkes\s+chart\b/g, "chart"],
    [/\btide\s+pools?\b/g, "tide pools"]
  ];

  const FILLERS = new Set(["the", "a", "an", "my", "some"]);
  const PREPS = new Set(["in", "into", "on", "onto", "to", "from", "with", "back", "at", "for"]);

  // Simple singularization for matching scenery/item aliases
  function singularize(word) {
    if (!word || word.length <= 3) return word;
    if (word === "oars" || word === "clams" || word === "oysters" || word === "blankets" || word === "notes" || word === "pools") return word;
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

    // Question phrases -> read tide notes
    if (/^(when is slack|when'?s slack|how many turns|when does (the )?tide|what (is the )?tide|next slack)/.test(norm)) {
      return { verb: "read", noun1: "tide notes", prep: "", noun2: "", rawRest: "tide notes" };
    }

    // Multi-word commands
    if (norm === "push on" || norm === "go anyway" || norm === "sail anyway") {
      return { verb: "push_on", noun1: "", prep: "", noun2: "", rawRest: "" };
    }
    if (norm === "wait for slack" || norm === "wait slack") {
      return { verb: "wait_slack", noun1: "", prep: "", noun2: "", rawRest: "" };
    }
    if (/^(weigh|pull|raise|lift)\s+(the\s+)?anchor$/.test(norm)) {
      return { verb: "weigh", noun1: "anchor", prep: "", noun2: "", rawRest: "" };
    }
    if (/^(drop|cast|let go)\s+(the\s+)?anchor$/.test(norm)) {
      return { verb: "anchor", noun1: "anchor", prep: "", noun2: "", rawRest: "" };
    }
    if (/^(reef|unreef)\s*(the\s+)?(sail|lugsail)?$/.test(norm)) {
      return { verb: norm.startsWith("unreef") ? "unreef" : "reef", noun1: "sail", prep: "", noun2: "", rawRest: "" };
    }
    if (/^(cast off|untie|unmoor|slip line)/.test(norm)) {
      const rest = norm.replace(/^(cast off|untie|unmoor|slip line)\s*/, "");
      return { verb: "untie", noun1: rest || "boat", prep: "", noun2: "", rawRest: rest };
    }
    if (/^(make fast|tie down|lash down)/.test(norm)) {
      const rest = norm.replace(/^(make fast|tie down|lash down)\s*/, "");
      return { verb: norm.startsWith("make fast") ? "tie" : "lash", noun1: rest || "gear", prep: "", noun2: "", rawRest: rest };
    }
    if (/^(board|step in|step into|get in|get into)\b/.test(norm)) {
      const rest = norm.replace(/^(board|step into|step in|get into|get in)\s*/, "");
      return { verb: "board", noun1: rest || "boat", prep: "", noun2: "", rawRest: rest };
    }
    if (/^download\s+log$/.test(norm)) {
      return { verb: "download_log", noun1: "", prep: "", noun2: "", rawRest: "" };
    }
    if (/^lost\s+voyages?$/.test(norm)) {
      return { verb: "lost_voyages", noun1: "", prep: "", noun2: "", rawRest: "" };
    }
    if (/^(cling to boat|cling)$/.test(norm)) return { verb: "capsize_choice", noun1: "cling", prep: "", noun2: "", rawRest: "" };
    if (/^(swim ashore|swim)$/.test(norm)) return { verb: "capsize_choice", noun1: "swim", prep: "", noun2: "", rawRest: "" };
    if (/^(right the boat|right boat|right)$/.test(norm)) return { verb: "capsize_choice", noun1: "right", prep: "", noun2: "", rawRest: "" };
    if (/^(call out|shout|yell|call)$/.test(norm)) return { verb: "capsize_choice", noun1: "call", prep: "", noun2: "", rawRest: "" };

    const words = norm.split(/\s+/).filter(Boolean);
    if (!words.length) return null;

    // Handle "pick up"
    if (words[0] === "pick" && words[1] === "up") words.splice(0, 2, "take");

    let verb = words[0];
    const rawRest = trimmed.slice(trimmed.split(/\s+/)[0].length).trim();

    // Bare direction
    if (DIR_MAP[verb] && words.length === 1) {
      return { verb: "go", noun1: DIR_MAP[verb], prep: "", noun2: "", rawRest: DIR_MAP[verb] };
    }

    // "look in X" / "look inside X"
    if ((verb === "look" || verb === "l") && (words[1] === "in" || words[1] === "inside")) {
      const target = words.slice(2).filter((w) => !FILLERS.has(w)).join(" ");
      return { verb: "look_in", noun1: target, prep: "in", noun2: "", rawRest };
    }

    // "look at X"
    if ((verb === "look" || verb === "l") && words[1] === "at") {
      const target = words.slice(2).filter((w) => !FILLERS.has(w)).join(" ");
      return { verb: "examine", noun1: target, prep: "", noun2: "", rawRest };
    }

    // "look <direction>"
    if ((verb === "look" || verb === "l") && words.length === 2 && DIR_MAP[words[1]]) {
      return { verb: "look_dir", noun1: DIR_MAP[words[1]], prep: "", noun2: "", rawRest };
    }

    // Standard VERB [NOUN1] [PREP NOUN2]
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
