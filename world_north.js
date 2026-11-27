// world_north.js — North Puget Sound & Admiralty Inlet (1850, Oregon Territory)
window.WORLD_REGIONS = window.WORLD_REGIONS || {};

window.WORLD_REGIONS.north = {
  possession_sound: {
    id: "possession_sound",
    name: "Possession Sound",
    region: "North Sound",
    description: "Wide wind-swept water where Whidbey Island's southern bluff divides the Sound. Eastward, Snohomish river flats and unbroken timber stand with no town in sight.",
    exits: {
      sw: { to: "port_madison", steps: 2, look: "Port Madison lies southwest." },
      w: { to: "foulweather_bluff", steps: 2, look: "Foulweather Bluff rises west." },
      n: { to: "saratoga_passage", steps: 2, look: "Saratoga Passage runs north along Whidbey Island." }
    },
    scenery: {
      bluff: "Whidbey Island's steep southern headland.",
      flats: "Snohomish River flats and marsh grass along the east shore.",
      timber: "Unbroken fir forest climbing toward the Cascades."
    },
    objects: [],
    hazard: { exposure: 2, tidal: true, currentStrength: "moderate", shelter: false },
    tide_variants: {
      slack: "Broad swells ease across the open junction.",
      flood: "Flood current sweeps south around Whidbey's point.",
      ebb: "Ebb pushes north with choppy tide seams."
    },
    hasShore: false,
    original_name: "",
    tribal_note: ""
  },

  saratoga_passage: {
    id: "saratoga_passage",
    name: "Saratoga Passage",
    region: "North Sound",
    description: "A long deep corridor between Whidbey and Camano islands. Steep sandy bluffs rise on both sides, broken by gravel spits and quiet coves.",
    exits: {
      s: { to: "possession_sound", steps: 2, look: "Possession Sound opens south." },
      nw: { to: "deception_pass", steps: 2, requiresTide: "slack", blockedText: "Deception Pass is a roaring millrace; wait for slack water.", look: "Skagit shoals and rocky Deception Pass lie northwest." }
    },
    scenery: {
      bluffs: "High sandy bluffs crowned with evergreens.",
      spits: "Low gravel points extending from both islands.",
      coves: "Sheltered coves tucked behind gravel hooks."
    },
    objects: [],
    hazard: { exposure: 1, tidal: true, currentStrength: "light", shelter: true },
    tide_variants: {
      slack: "Calm water between the islands.",
      flood: "Steady flood moves north up the passage.",
      ebb: "Ebb drifts south along the bluffs."
    },
    hasShore: true,
    original_name: "",
    tribal_note: ""
  },

  deception_pass: {
    id: "deception_pass",
    name: "Deception Pass",
    region: "North Sound",
    description: "A steep rocky gorge splitting Whidbey and Fidalgo islands. Submerged ledges and a mid-channel islet turn the tide into a violent race except at slack.",
    exits: {
      se: { to: "saratoga_passage", steps: 2, look: "Skagit waters and Saratoga Passage lie southeast." },
      w: { to: "rosario_strait", steps: 2, look: "Wide Rosario Strait and the San Juans open west." }
    },
    scenery: {
      gorge: "Sheer dark basalt cliffs draped with twisted firs.",
      ledges: "Submerged rock shelves hidden beneath foaming water.",
      water: "Violent tidal water boiling between close walls."
    },
    objects: [],
    hazard: { exposure: 3, tidal: true, currentStrength: "fierce", shelter: false },
    tide_variants: {
      slack: "Briefly quiet enough to row through.",
      flood: "White water roars east into Skagit waters.",
      ebb: "Fierce standing waves pour west into Rosario Strait."
    },
    hasShore: false,
    original_name: "",
    tribal_note: ""
  },

  foulweather_bluff: {
    id: "foulweather_bluff",
    name: "Foulweather Bluff",
    region: "Admiralty Inlet",
    description: "A bold sandy headland at the meeting of Admiralty Inlet and Hood Canal. Tide rips and cross-chop gather off the point whenever wind meets current.",
    exits: {
      se: { to: "port_madison", steps: 3, look: "Central Sound stretches southeast to Port Madison." },
      e: { to: "possession_sound", steps: 2, look: "Possession Sound lies east." },
      s: { to: "port_gamble", steps: 1, look: "Hood Canal opens south toward Port Gamble." },
      w: { to: "port_ludlow", steps: 1, look: "Sheltered Port Ludlow lies west." },
      nw: { to: "port_townsend", steps: 2, look: "Admiralty Inlet leads northwest to Port Townsend." }
    },
    scenery: {
      headland: "High buff-colored bluff swept by salt wind.",
      rips: "Short jagged tide rips slapping off the point.",
      water: "Confused meeting of Hood Canal and main Sound tides."
    },
    objects: [],
    hazard: { exposure: 2, tidal: true, currentStrength: "strong", shelter: false },
    tide_variants: {
      slack: "The point lies relatively quiet.",
      flood: "Strong flood sweeps south into Sound and canal.",
      ebb: "Ebb pours north out of the canal, raising chop."
    },
    hasShore: false,
    original_name: "",
    tribal_note: ""
  },

  port_ludlow: {
    id: "port_ludlow",
    name: "Port Ludlow",
    region: "Admiralty Inlet",
    description: "A deep, well-sheltered harbor tucked behind rocky islets. Tall timber crowds the shore; no mill or town stands here yet.",
    exits: {
      e: { to: "foulweather_bluff", steps: 1, look: "Foulweather Bluff lies east." },
      n: { to: "port_townsend", steps: 2, look: "Port Townsend lies north." }
    },
    scenery: {
      islets: "Low rocky islets guarding the harbor mouth.",
      timber: "Dense fir and cedar blanketing the hills."
    },
    objects: [],
    hazard: { exposure: 0, tidal: false, shelter: true },
    tide_variants: {
      slack: "Calm, deep anchorage.",
      flood: "Gentle flood enters past the islets.",
      ebb: "Quiet ebb drifts out toward Admiralty Inlet."
    },
    hasShore: true,
    original_name: "",
    tribal_note: "",
    verify: "Verify 1850 status of Port Ludlow (sawmill built 1853)."
  },

  port_townsend: {
    id: "port_townsend",
    name: "Port Townsend",
    region: "Admiralty Inlet",
    description: "A grand natural harbor backed by grassy bluffs and firs. In 1850 no town stands on the flat—only a broad gravel beach, a Coast Salish (Klallam) village, and clear water sheltered from the Strait.",
    exits: {
      se: { to: "foulweather_bluff", steps: 2, look: "Foulweather Bluff lies southeast." },
      s: { to: "port_ludlow", steps: 2, look: "Port Ludlow lies south." },
      n: { to: "point_wilson", steps: 1, look: "Point Wilson guards the mouth of the Strait to the north." }
    },
    scenery: {
      bluffs: "Open grassy bluffs above the gravel flat.",
      beach: "Long curved shingle beach.",
      village: "Cedar houses along the shore; large seaworthy canoes rest on the gravel."
    },
    objects: [],
    hazard: { exposure: 1, tidal: false, shelter: true },
    tide_variants: {
      slack: "Deep calm harbor water.",
      flood: "Swells ease past the point.",
      ebb: "Gentle draw toward the Strait."
    },
    hasShore: true,
    hasCamp: true,
    original_name: "",
    tribal_note: "",
    verify: "Verify 1850 status of Port Townsend (first white claims April 1851)."
  },

  point_wilson: {
    id: "point_wilson",
    name: "Point Wilson",
    region: "Admiralty Inlet",
    description: "A low, wind-scoured sandspit where Puget Sound meets the Strait of Juan de Fuca. Heavy tide rips clash off the point, and cold salt air carries in from the Pacific.",
    exits: {
      s: { to: "port_townsend", steps: 1, look: "Port Townsend's sheltered bay lies south." },
      n: { to: "rosario_strait", steps: 3, look: "Open water crosses north toward the San Juans and Rosario Strait." },
      w: { to: "cape_flattery", steps: 5, look: "The long Strait of Juan de Fuca runs west to Cape Flattery and the Pacific." }
    },
    scenery: {
      spit: "Bare driftwood-strewn sandspit jutting into the tide.",
      rips: "Steep confused tide rips boiling off the shoal.",
      water: "Heavy Strait water colliding with Admiralty Inlet currents."
    },
    objects: [],
    hazard: { exposure: 3, tidal: true, currentStrength: "fierce", shelter: false },
    tide_variants: {
      slack: "The rips subside to heavy oily swells.",
      flood: "Ocean flood pours past the spit into Admiralty Inlet.",
      ebb: "Ebb slams west into the Strait, piling up steep waves."
    },
    hasShore: false,
    original_name: "",
    tribal_note: ""
  }
};
