// world_north.js — North Puget Sound & Admiralty Inlet (1850, Oregon Territory)
window.WORLD_REGIONS = window.WORLD_REGIONS || {};

window.WORLD_REGIONS.north = {
  possession_sound: {
    id: "possession_sound",
    name: "Possession Sound",
    region: "North Sound",
    description: "Wide, wind-swept water where Whidbey Island's southern tip divides the Sound. To the east, river flats and unbroken timber stand where no town exists.",
    exits: {
      s: { to: "shilshole_bay", steps: 3, look: "The main basin stretches south toward Shilshole Bay." },
      w: { to: "foulweather_bluff", steps: 2, look: "Foulweather Bluff rises west across Admiralty Inlet." },
      n: { to: "saratoga_passage", steps: 2, look: "Saratoga Passage opens north along Whidbey Island." },
      ne: { to: "port_susan", steps: 2, look: "Port Susan stretches northeast." }
    },
    scenery: {
      island: "Whidbey Island's steep southern bluff rising out of the chop.",
      flats: "Snohomish River flats and marsh grass along the eastern shore.",
      timber: "Endless fir forest climbing toward the Cascades."
    },
    objects: [],
    hazard: { exposure: 2, tidal: true, currentStrength: "moderate", shelter: false },
    tide_variants: {
      slack: "Broad swells ease across the open junction.",
      flood: "Flood current sweeps south around Whidbey's point.",
      ebb: "Ebb water pushes north with choppy tide seams."
    },
    original_name: "",
    tribal_note: ""
  },

  saratoga_passage: {
    id: "saratoga_passage",
    name: "Saratoga Passage",
    region: "North Sound",
    description: "A long, deep corridor running between Whidbey Island and Camano Island. Steep sandy bluffs rise on both sides, broken by gravel spits and quiet pockets.",
    exits: {
      s: { to: "possession_sound", steps: 2, look: "Possession Sound opens south." },
      w: { to: "holmes_harbor", steps: 1, look: "Holmes Harbor cuts southwest into Whidbey Island." },
      n: { to: "skagit_bay", steps: 2, look: "Skagit Bay lies north." }
    },
    scenery: {
      bluffs: "High sandy bluffs crowned with evergreens.",
      spits: "Low gravel points extending from both islands."
    },
    objects: [],
    hazard: { exposure: 1, tidal: true, currentStrength: "light", shelter: false },
    tide_variants: {
      slack: "Calm water between the two islands.",
      flood: "Steady flood moves northward up the passage.",
      ebb: "Ebb drifts south along the bluffs."
    },
    original_name: "",
    tribal_note: ""
  },

  holmes_harbor: {
    id: "holmes_harbor",
    name: "Holmes Harbor",
    region: "North Sound",
    description: "A deep, sheltered arm cutting far into Whidbey Island. Calm water, gravel beaches, and quiet fir hills offer a safe refuge from northern wind.",
    exits: {
      e: { to: "saratoga_passage", steps: 1, look: "Saratoga Passage lies east past the point." }
    },
    scenery: {
      beaches: "Clean gravel beaches rimmed with stranded logs.",
      hills: "Low wooded ridges sheltering the harbor from all quarters."
    },
    objects: [],
    hazard: { exposure: 0, tidal: false, shelter: true },
    tide_variants: {
      slack: "Still, clear water.",
      flood: "Rising tide climbs the inner flats.",
      ebb: "Wide clam beaches show along the head of the bay."
    },
    original_name: "",
    tribal_note: ""
  },

  port_susan: {
    id: "port_susan",
    name: "Port Susan",
    region: "North Sound",
    description: "A wide, shallow bay between Camano Island and the mainland. Mudflats and river sloughs border the northern end; flocks of waterfowl wheel over the reeds.",
    exits: {
      sw: { to: "possession_sound", steps: 2, look: "Possession Sound lies southwest." },
      nw: { to: "skagit_bay", steps: 2, look: "Shallow passages lead northwest toward Skagit Bay." }
    },
    scenery: {
      mudflats: "Expansive Stillaguamish tidal flats.",
      sloughs: "Twisting marsh channels disappearing into reeds.",
      waterfowl: "Ducks and geese lifting in dark ribbons over the flats."
    },
    objects: [],
    hazard: { exposure: 1, tidal: false, shelter: true, shoals: true },
    tide_variants: {
      slack: "Quiet water over shallow silt.",
      flood: "Rising water makes the northern flats passable.",
      ebb: "Low tide exposes broad mudflats—mind your depth."
    },
    original_name: "",
    tribal_note: ""
  },

  skagit_bay: {
    id: "skagit_bay",
    name: "Skagit Bay",
    region: "North Sound",
    description: "A broad, shoal-ridden bay fed by the braided mouths of the Skagit River. Driftwood jams line the marshy delta, and to the west the hills pinch into Deception Pass.",
    exits: {
      s: { to: "saratoga_passage", steps: 2, look: "Saratoga Passage runs south." },
      se: { to: "port_susan", steps: 2, look: "Port Susan lies southeast." },
      w: { to: "deception_pass", steps: 2, requiresTide: "slack", blockedText: "Deception Pass is a roaring millrace right now; wait for slack water.", look: "Rocky headlands pinch west into Deception Pass." }
    },
    scenery: {
      delta: "Low marsh islands and river mouths clogged with driftwood.",
      driftwood: "Massive fir logs stranded across the sandbars.",
      headlands: "Dark rocky cliffs framing the western pass."
    },
    objects: [],
    hazard: { exposure: 1, tidal: true, currentStrength: "moderate", shelter: false, shoals: true },
    tide_variants: {
      slack: "Silty water lies flat over the sandbars.",
      flood: "Flood tide covers the shoals.",
      ebb: "Shallow bars show clearly—use a lead line."
    },
    original_name: "",
    tribal_note: ""
  },

  deception_pass: {
    id: "deception_pass",
    name: "Deception Pass",
    region: "North Sound",
    description: "A steep rocky gorge splitting Whidbey and Fidalgo Islands. Submerged ledges and a small mid-channel island turn the tide into a violent race except at slack.",
    exits: {
      e: { to: "skagit_bay", steps: 2, look: "Skagit Bay opens east." },
      w: { to: "rosario_strait", steps: 2, look: "Wide Rosario Strait and the San Juan Islands open west." }
    },
    scenery: {
      gorge: "Sheer dark basalt cliffs draped with twisted firs.",
      ledges: "Submerged rock shelves hidden beneath foaming water.",
      island: "A rocky islet splitting the throat of the pass."
    },
    objects: [],
    hazard: { exposure: 3, tidal: true, currentStrength: "fierce", shelter: false },
    tide_variants: {
      slack: "For a brief interval the gorge quiets enough to row through.",
      flood: "White water roars east into Skagit Bay.",
      ebb: "Fierce boils and standing waves pour west into Rosario Strait."
    },
    original_name: "",
    tribal_note: ""
  },

  foulweather_bluff: {
    id: "foulweather_bluff",
    name: "Foulweather Bluff",
    region: "Admiralty Inlet",
    description: "A bold sandy headland jutting into the meeting of Admiralty Inlet and Hood Canal. Tide rips and cross-chop gather off the point whenever wind meets current.",
    exits: {
      se: { to: "port_madison", steps: 3, look: "The central Sound stretches southeast to Port Madison." },
      e: { to: "possession_sound", steps: 2, look: "Possession Sound lies east." },
      s: { to: "port_gamble", steps: 1, look: "Hood Canal opens south toward Port Gamble." },
      w: { to: "port_ludlow", steps: 1, look: "Sheltered Port Ludlow lies west." },
      n: { to: "marrowstone_point", steps: 2, look: "Admiralty Inlet runs north toward Marrowstone Point." }
    },
    scenery: {
      headland: "A high buff-colored bluff swept by salt wind.",
      rips: "Short jagged tide rips slapping off the point."
    },
    objects: [],
    hazard: { exposure: 2, tidal: true, currentStrength: "strong", shelter: false },
    tide_variants: {
      slack: "The point lies relatively quiet.",
      flood: "Strong flood sweeps south into both the Sound and Hood Canal.",
      ebb: "Ebb pours north out of the canal, raising sharp chop."
    },
    original_name: "",
    tribal_note: ""
  },

  port_ludlow: {
    id: "port_ludlow",
    name: "Port Ludlow",
    region: "Admiralty Inlet",
    description: "A deep, well-sheltered harbor tucked behind rocky islets. Tall timber crowds the shore; no mill or settlement stands here yet.",
    exits: {
      e: { to: "foulweather_bluff", steps: 1, look: "Foulweather Bluff lies east." },
      ne: { to: "marrowstone_point", steps: 2, look: "Marrowstone Point lies northeast." }
    },
    scenery: {
      islets: "Low rocky islets guarding the harbor entrance.",
      timber: "Dense fir and cedar blanketing the hills."
    },
    objects: [],
    hazard: { exposure: 0, tidal: false, shelter: true },
    tide_variants: {
      slack: "Calm, deep anchorage.",
      flood: "Gentle flood enters past the islets.",
      ebb: "Quiet ebb drifts out toward Admiralty Inlet."
    },
    original_name: "",
    tribal_note: "",
    verify: "Verify 1850 status of Port Ludlow (sawmill built 1853)."
  },

  marrowstone_point: {
    id: "marrowstone_point",
    name: "Marrowstone Point",
    region: "Admiralty Inlet",
    description: "A low gravel spit projecting from high clay bluffs at the narrow waist of Admiralty Inlet. Kelp beds trail north and south with the heavy ocean tide.",
    exits: {
      s: { to: "foulweather_bluff", steps: 2, look: "Foulweather Bluff lies south." },
      sw: { to: "port_ludlow", steps: 2, look: "Port Ludlow sits southwest." },
      nw: { to: "port_townsend", steps: 1, look: "Port Townsend's deep bay opens northwest." }
    },
    scenery: {
      spit: "Flat shingle spit washed clean by passing swells.",
      bluffs: "Steep pale bluffs rising behind the point.",
      kelp: "Long kelp lines marking the edge of deep water."
    },
    objects: [],
    hazard: { exposure: 2, tidal: true, currentStrength: "strong", shelter: false },
    tide_variants: {
      slack: "The strait rests briefly.",
      flood: "Heavy ocean flood pushes south down Admiralty Inlet.",
      ebb: "Ebb streams north toward the Strait of Juan de Fuca."
    },
    original_name: "",
    tribal_note: ""
  },

  port_townsend: {
    id: "port_townsend",
    name: "Port Townsend",
    region: "Admiralty Inlet",
    description: "A grand, deep natural harbor backed by grassy bluffs and firs. In 1850 no town stands on the flat—only a broad gravel beach, a Native village, and clear water sheltered from the Strait.",
    exits: {
      se: { to: "marrowstone_point", steps: 1, look: "Marrowstone Point lies southeast." },
      n: { to: "point_wilson", steps: 1, look: "Point Wilson guards the mouth of the Strait to the north." }
    },
    scenery: {
      bluffs: "Open grassy bluffs above the gravel flat.",
      beach: "Long curved shingle beach.",
      village: "Klallam cedar houses along the shore; large seaworthy canoes rest on the gravel."
    },
    objects: [],
    hazard: { exposure: 1, tidal: false, shelter: true },
    tide_variants: {
      slack: "Deep calm harbor water.",
      flood: "Swells ease past the point.",
      ebb: "Gentle draw toward the Strait."
    },
    original_name: "",
    tribal_note: "",
    verify: "Verify 1850 status of Port Townsend (first white claims staked April 1851 by Pettygrove/Plummer)."
  },

  point_wilson: {
    id: "point_wilson",
    name: "Point Wilson",
    region: "Admiralty Inlet",
    description: "A low, wind-scoured sandspit at the very corner where Puget Sound meets the Strait of Juan de Fuca. Heavy tide rips clash off the point, and the salt smell of the open ocean carries on the west wind.",
    exits: {
      s: { to: "port_townsend", steps: 1, look: "Port Townsend's sheltered bay lies south." },
      w: { to: "discovery_bay", steps: 2, look: "The Strait runs west past Protection Island toward Discovery Bay." },
      n: { to: "rosario_strait", steps: 3, look: "Open water crosses north toward the San Juan Islands and Rosario Strait." }
    },
    scenery: {
      spit: "Bare driftwood-strewn sandspit jutting into the tide.",
      rips: "Steep, confused tide rips boiling off the shoal.",
      strait: "Wide gray-blue water stretching west toward the Pacific."
    },
    objects: [],
    hazard: { exposure: 3, tidal: true, currentStrength: "fierce", shelter: false },
    tide_variants: {
      slack: "The rips subside to heavy, oily swells.",
      flood: "Ocean flood pours past the spit into Admiralty Inlet.",
      ebb: "Ebb slams west into the Strait, piling up steep waves."
    },
    original_name: "",
    tribal_note: ""
  }
};
